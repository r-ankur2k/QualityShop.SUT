// --- Product Detail Page Logic ---

const renderProductDetailPage = async () => {
    await applyNetworkDelay();
    renderNavbar('products');

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id') || 'p1';
    const product = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
    State.currentProduct = product;

    const container = document.getElementById('product-detail-container');
    if (!container) return;

    const inWishlist = State.wishlist.some(w => w.id === product.id);
    const inCompare = State.compare.some(c => c.id === product.id);

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8" data-test-id="product-detail-card">
            <!-- Left Column: Image -->
            <div class="bg-slate-50 rounded-xl p-12 flex items-center justify-center text-9xl select-none relative min-h-[300px]">
                <span>${product.image}</span>
                <span class="absolute top-4 left-4 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full" data-test-id="detail-category">${product.category}</span>
            </div>

            <!-- Right Column: Info -->
            <div class="flex flex-col justify-between space-y-6">
                <div>
                    <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900" data-test-id="detail-title">${product.name}</h1>
                    <div class="flex items-center gap-2 mt-2 text-amber-500 text-sm font-semibold">
                        <span>★ ${product.rating}</span>
                        <span class="text-slate-400">(${product.reviews} customer reviews)</span>
                        <span class="ml-auto text-xs ${product.stock < 10 ? 'bg-rose-100 text-rose-700 font-bold' : 'bg-emerald-100 text-emerald-800'} px-2.5 py-0.5 rounded-full" data-test-id="detail-stock">
                            In Stock: ${product.stock} units
                        </span>
                    </div>

                    <div class="mt-4 pb-4 border-b border-slate-100">
                        <span class="text-3xl font-black text-slate-900" data-test-id="detail-price">$${product.price.toFixed(2)}</span>
                    </div>

                    <p class="mt-4 text-slate-600 text-sm leading-relaxed" data-test-id="detail-description">${product.description}</p>
                </div>

                <!-- Quantity & Actions -->
                <div class="space-y-4 pt-4 border-t border-slate-100">
                    <div class="flex items-center gap-4">
                        <label class="text-xs font-bold text-slate-700 uppercase">Quantity</label>
                        <div class="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                            <button onclick="adjustQuantity(-1)" class="px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold" data-test-id="qty-minus">-</button>
                            <span id="detail-qty" class="px-4 py-1.5 text-sm font-semibold text-slate-800" data-test-id="detail-qty-value">1</span>
                            <button onclick="adjustQuantity(1)" class="px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold" data-test-id="qty-plus">+</button>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <button onclick="addCurrentToCart()" class="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition shadow-md flex items-center justify-center gap-2" data-test-id="detail-add-to-cart-btn">
                            <i data-lucide="shopping-cart" class="h-5 w-5"></i> Add to Shopping Cart
                        </button>
                        <button onclick="toggleWishlist('${product.id}')" class="p-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition" title="Wishlist" data-test-id="detail-wishlist-btn">
                            <i data-lucide="heart" class="${inWishlist ? 'fill-rose-500 text-rose-500' : ''} h-5 w-5"></i>
                        </button>
                        <button onclick="toggleCompare('${product.id}')" class="p-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition" title="Compare" data-test-id="detail-compare-btn">
                            <i data-lucide="arrow-left-right" class="${inCompare ? 'text-indigo-600 font-bold' : ''} h-5 w-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Specifications & Customer Reviews Section -->
        <div class="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 class="text-lg font-bold text-slate-900 mb-4">Customer Reviews</h2>
            <div class="space-y-4">
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div class="flex items-center justify-between mb-1">
                        <span class="font-semibold text-sm text-slate-800">Sarah Jenkins</span>
                        <span class="text-amber-500 text-xs">★★★★★ 5.0</span>
                    </div>
                    <p class="text-slate-600 text-xs">Excellent quality product! Exceeded my expectations. Delivery was very fast.</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div class="flex items-center justify-between mb-1">
                        <span class="font-semibold text-sm text-slate-800">Michael Chen</span>
                        <span class="text-amber-500 text-xs">★★★★☆ 4.0</span>
                    </div>
                    <p class="text-slate-600 text-xs">Great value for the price. Works as advertised.</p>
                </div>
            </div>
        </div>
    `;

    initIcons();
};

let detailQuantity = 1;

const adjustQuantity = (delta) => {
    detailQuantity = Math.max(1, detailQuantity + delta);
    const qtyValue = document.getElementById('detail-qty');
    if (qtyValue) qtyValue.textContent = detailQuantity;
};

const addCurrentToCart = () => {
    if (!State.currentProduct) return;
    const existing = State.cart.find(item => item.id === State.currentProduct.id);
    if (existing) {
        existing.quantity += detailQuantity;
    } else {
        State.cart.push({ ...State.currentProduct, quantity: detailQuantity });
    }
    saveCartToStorage();
    renderNavbar('products');
    showToast(`Added ${detailQuantity}x ${State.currentProduct.name} to cart`, 'success');
};

document.addEventListener('DOMContentLoaded', () => {
    renderProductDetailPage();
});
