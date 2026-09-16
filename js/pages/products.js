// --- Products Catalog Page Logic ---
let filteredProducts = [...MOCK_PRODUCTS];

const renderProductsPage = async () => {
    await applyNetworkDelay();
    renderNavbar('products');
    filterProducts();
};

const filterProducts = () => {
    const category = State.filters.category;
    const maxPrice = State.filters.price;
    const search = State.filters.search.toLowerCase().trim();
    const sort = State.filters.sort;

    filteredProducts = MOCK_PRODUCTS.filter(product => {
        const matchesCategory = category === 'All' || product.category === category;
        const matchesPrice = product.price <= maxPrice;
        const matchesSearch = product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search);
        return matchesCategory && matchesPrice && matchesSearch;
    });

    if (sort === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    renderGrid();
};

const renderGrid = () => {
    const gridContainer = document.getElementById('product-grid');
    const resultCount = document.getElementById('result-count');
    if (!gridContainer) return;

    resultCount.textContent = `Showing ${filteredProducts.length} of ${MOCK_PRODUCTS.length} products`;

    if (filteredProducts.length === 0) {
        gridContainer.innerHTML = `
            <div class="col-span-full py-12 text-center" data-test-id="no-products-found">
                <div class="text-4xl mb-3">🔍</div>
                <h3 class="text-lg font-semibold text-slate-800">No products found</h3>
                <p class="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
                <button onclick="resetFilters()" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Reset Filters</button>
            </div>
        `;
        return;
    }

    gridContainer.innerHTML = filteredProducts.map(product => {
        const inWishlist = State.wishlist.some(w => w.id === product.id);
        const inCompare = State.compare.some(c => c.id === product.id);

        return `
            <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-slate-100 overflow-hidden flex flex-col group" data-test-id="product-card-${product.id}">
                <div class="relative bg-slate-50 p-6 text-center text-6xl select-none flex items-center justify-center h-48">
                    <span>${product.image}</span>
                    <button onclick="toggleWishlist('${product.id}')" class="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500 shadow-sm transition" data-test-id="wishlist-btn-${product.id}">
                        <i data-lucide="heart" class="${inWishlist ? 'fill-rose-500 text-rose-500' : ''} h-5 w-5"></i>
                    </button>
                    <span class="absolute bottom-3 left-3 text-xs bg-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-medium" data-test-id="category-badge-${product.id}">${product.category}</span>
                </div>
                <div class="p-5 flex-grow flex flex-col">
                    <div class="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-1">
                        <span>★ ${product.rating}</span>
                        <span class="text-slate-400">(${product.reviews})</span>
                        <span class="ml-auto text-xs ${product.stock < 10 ? 'text-rose-600 font-bold' : 'text-slate-500'}" data-test-id="stock-badge-${product.id}">Stock: ${product.stock}</span>
                    </div>
                    <a href="product-detail.html?id=${product.id}" class="text-slate-900 font-semibold text-base hover:text-indigo-600 transition line-clamp-1 mb-1" data-test-id="product-title-${product.id}">${product.name}</a>
                    <p class="text-slate-500 text-xs line-clamp-2 mb-4 flex-grow">${product.description}</p>

                    <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div>
                            <span class="text-xs text-slate-400 block">Price</span>
                            <span class="text-lg font-bold text-slate-900" data-test-id="product-price-${product.id}">$${product.price.toFixed(2)}</span>
                        </div>
                        <button onclick="addToCart('${product.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 shadow-sm" data-test-id="add-to-cart-btn-${product.id}">
                            <i data-lucide="shopping-cart" class="h-4 w-4"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    initIcons();
};

const addToCart = (productId) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const existing = State.cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        State.cart.push({ ...product, quantity: 1 });
    }
    saveCartToStorage();
    renderNavbar('products');
    showToast(`Added ${product.name} to cart`, 'success');
};

const toggleWishlist = (productId) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const idx = State.wishlist.findIndex(w => w.id === productId);
    if (idx >= 0) {
        State.wishlist.splice(idx, 1);
        showToast(`Removed from Wishlist`, 'info');
    } else {
        State.wishlist.push(product);
        showToast(`Saved to Wishlist`, 'success');
    }
    saveWishlistToStorage();
    renderNavbar('products');
    renderGrid();
};

const toggleCompare = (productId) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const idx = State.compare.findIndex(c => c.id === productId);
    if (idx >= 0) {
        State.compare.splice(idx, 1);
        showToast(`Removed from Compare`, 'info');
    } else {
        if (State.compare.length >= 4) {
            return showToast(`Can compare up to 4 items max`, 'warning');
        }
        State.compare.push(product);
        showToast(`Added to Compare`, 'success');
    }
    saveCompareToStorage();
    renderNavbar('products');
    renderGrid();
};

const resetFilters = () => {
    State.filters = { category: 'All', price: 1000, search: '', sort: 'default' };
    document.getElementById('search-input').value = '';
    document.getElementById('category-filter').value = 'All';
    document.getElementById('price-filter').value = '1000';
    document.getElementById('price-value').textContent = '$1000';
    document.getElementById('sort-filter').value = 'default';
    filterProducts();
};

document.addEventListener('DOMContentLoaded', () => {
    renderProductsPage();

    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const priceValue = document.getElementById('price-value');
    const sortFilter = document.getElementById('sort-filter');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            State.filters.search = e.target.value;
            filterProducts();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            State.filters.category = e.target.value;
            filterProducts();
        });
    }

    if (priceFilter) {
        priceFilter.addEventListener('input', (e) => {
            State.filters.price = parseFloat(e.target.value);
            if (priceValue) priceValue.textContent = `$${e.target.value}`;
            filterProducts();
        });
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            State.filters.sort = e.target.value;
            filterProducts();
        });
    }
});
