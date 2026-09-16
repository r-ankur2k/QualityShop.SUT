// --- Wishlist Page Logic ---

const renderWishlistPage = async () => {
    await applyNetworkDelay();
    renderNavbar('wishlist');

    const container = document.getElementById('wishlist-container');
    if (!container) return;

    if (State.wishlist.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center" data-test-id="empty-wishlist-state">
                <div class="text-6xl mb-4">❤️</div>
                <h2 class="text-xl font-bold text-slate-800">Your Wishlist is Empty</h2>
                <p class="text-slate-500 text-sm mt-1">Save your favorite items here to purchase them later.</p>
                <a href="products.html" class="inline-block mt-6 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-md" data-test-id="explore-products-btn">
                    Explore Products Catalog
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="space-y-6">
            <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span class="text-sm font-semibold text-slate-700" data-test-id="wishlist-count">Saved Items (${State.wishlist.length})</span>
                <button onclick="moveAllWishlistToCart()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-xs transition shadow-sm flex items-center gap-1.5" data-test-id="move-all-to-cart-btn">
                    <i data-lucide="shopping-cart" class="h-4 w-4"></i> Move All to Shopping Cart
                </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${State.wishlist.map(product => `
                    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between" data-test-id="wishlist-card-${product.id}">
                        <div class="p-6 bg-slate-50 text-center text-6xl select-none relative h-40 flex items-center justify-center">
                            <span>${product.image}</span>
                            <button onclick="removeFromWishlist('${product.id}')" class="absolute top-3 right-3 p-1.5 bg-white text-rose-600 hover:bg-rose-50 rounded-full shadow-sm" title="Remove" data-test-id="remove-wishlist-btn-${product.id}">
                                <i data-lucide="x" class="h-4 w-4"></i>
                            </button>
                        </div>
                        <div class="p-5 flex-grow flex flex-col justify-between">
                            <div>
                                <span class="text-xs font-semibold text-indigo-600 uppercase">${product.category}</span>
                                <h3 class="font-bold text-slate-900 text-base mt-1 line-clamp-1">${product.name}</h3>
                                <span class="text-lg font-bold text-slate-900 block mt-2" data-test-id="wishlist-price-${product.id}">$${product.price.toFixed(2)}</span>
                            </div>
                            <button onclick="moveWishlistItemToCart('${product.id}')" class="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5" data-test-id="wishlist-add-to-cart-btn-${product.id}">
                                <i data-lucide="shopping-cart" class="h-4 w-4"></i> Move to Cart
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    initIcons();
};

const removeFromWishlist = (productId) => {
    State.wishlist = State.wishlist.filter(w => w.id !== productId);
    saveWishlistToStorage();
    showToast('Removed from Wishlist', 'info');
    renderWishlistPage();
};

const moveWishlistItemToCart = (productId) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = State.cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        State.cart.push({ ...product, quantity: 1 });
    }
    saveCartToStorage();

    State.wishlist = State.wishlist.filter(w => w.id !== productId);
    saveWishlistToStorage();

    showToast(`Moved ${product.name} to cart`, 'success');
    renderWishlistPage();
};

const moveAllWishlistToCart = () => {
    State.wishlist.forEach(product => {
        const existing = State.cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            State.cart.push({ ...product, quantity: 1 });
        }
    });

    State.wishlist = [];
    saveWishlistToStorage();
    saveCartToStorage();

    showToast('Moved all wishlist items to cart', 'success');
    renderWishlistPage();
};

document.addEventListener('DOMContentLoaded', () => {
    renderWishlistPage();
});
