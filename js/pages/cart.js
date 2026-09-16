// --- Shopping Cart Page Logic ---

const renderCartPage = async () => {
    await applyNetworkDelay();
    renderNavbar('cart');
    renderCartTable();
};

const renderCartTable = () => {
    const container = document.getElementById('cart-container');
    if (!container) return;

    if (State.cart.length === 0) {
        container.innerHTML = `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center" data-test-id="empty-cart-state">
                <div class="text-6xl mb-4">🛒</div>
                <h2 class="text-xl font-bold text-slate-800">Your Shopping Cart is Empty</h2>
                <p class="text-slate-500 text-sm mt-1">Looks like you haven't added any products to your cart yet.</p>
                <a href="products.html" class="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-md" data-test-id="continue-shopping-btn">
                    Explore Products Catalog
                </a>
            </div>
        `;
        return;
    }

    const subtotal = State.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = State.checkoutData.coupon ? (subtotal * State.checkoutData.coupon.discount) : 0;
    const estimatedTax = (subtotal - discount) * 0.08;
    const shippingCost = subtotal > 150 ? 0 : 15.00;
    const grandTotal = Math.max(0, subtotal - discount + estimatedTax + shippingCost);

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Items Table -->
            <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 class="text-lg font-bold text-slate-900" data-test-id="cart-items-count">Shopping Cart (${State.cart.length} unique items)</h2>
                    <button onclick="clearAllCartItems()" class="text-xs text-rose-600 hover:text-rose-800 font-semibold" data-test-id="clear-cart-btn">Clear All</button>
                </div>
                <div class="divide-y divide-slate-100">
                    ${State.cart.map(item => `
                        <div class="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" data-test-id="cart-item-row-${item.id}">
                            <div class="flex items-center gap-4">
                                <div class="bg-slate-50 p-3 rounded-xl text-3xl select-none flex items-center justify-center h-16 w-16">
                                    <span>${item.image}</span>
                                </div>
                                <div>
                                    <h3 class="font-bold text-slate-900 text-sm" data-test-id="cart-item-name-${item.id}">${item.name}</h3>
                                    <span class="text-xs text-slate-400 block">$${item.price.toFixed(2)} each</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between w-full sm:w-auto gap-6">
                                <div class="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                                    <button onclick="updateCartQuantity('${item.id}', -1)" class="px-2.5 py-1 hover:bg-slate-100 text-slate-600 font-bold" data-test-id="cart-qty-minus-${item.id}">-</button>
                                    <span class="px-3 py-1 text-xs font-semibold text-slate-800" data-test-id="cart-qty-value-${item.id}">${item.quantity}</span>
                                    <button onclick="updateCartQuantity('${item.id}', 1)" class="px-2.5 py-1 hover:bg-slate-100 text-slate-600 font-bold" data-test-id="cart-qty-plus-${item.id}">+</button>
                                </div>
                                <span class="font-bold text-slate-900 text-sm" data-test-id="cart-item-total-${item.id}">$${(item.price * item.quantity).toFixed(2)}</span>
                                <button onclick="removeCartItem('${item.id}')" class="text-slate-400 hover:text-rose-600 p-1" title="Remove" data-test-id="cart-remove-btn-${item.id}">
                                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Summary Card -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit space-y-6">
                <h3 class="text-base font-bold text-slate-900 pb-4 border-b border-slate-100">Order Summary</h3>

                <!-- Coupon Code Section -->
                <div>
                    <label for="coupon-code" class="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Apply Promo Code</label>
                    <div class="flex gap-2">
                        <input type="text" id="coupon-code" placeholder="e.g. SAVE10" value="${State.checkoutData.coupon ? State.checkoutData.coupon.code : ''}" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500" data-test-id="coupon-input">
                        <button onclick="applyCoupon()" class="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold transition" data-test-id="apply-coupon-btn">Apply</button>
                    </div>
                    ${State.checkoutData.coupon ? `<p class="text-xs text-emerald-600 font-semibold mt-1">✓ Promo code active (${State.checkoutData.coupon.code})</p>` : ''}
                </div>

                <div class="space-y-3 pt-4 border-t border-slate-100 text-sm">
                    <div class="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span data-test-id="summary-subtotal">$${subtotal.toFixed(2)}</span>
                    </div>
                    ${discount > 0 ? `
                        <div class="flex justify-between text-emerald-600 font-medium">
                            <span>Discount (${State.checkoutData.coupon.code})</span>
                            <span data-test-id="summary-discount">-$${discount.toFixed(2)}</span>
                        </div>
                    ` : ''}
                    <div class="flex justify-between text-slate-600">
                        <span>Estimated Shipping</span>
                        <span data-test-id="summary-shipping">${shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div class="flex justify-between text-slate-600">
                        <span>Estimated Tax (8%)</span>
                        <span data-test-id="summary-tax">$${estimatedTax.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                        <span>Grand Total</span>
                        <span data-test-id="summary-total">$${grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                <a href="checkout.html" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-center" data-test-id="proceed-to-checkout-btn">
                    Proceed to Checkout <i data-lucide="arrow-right" class="h-4 w-4"></i>
                </a>
            </div>
        </div>
    `;

    initIcons();
};

const updateCartQuantity = (productId, delta) => {
    const item = State.cart.find(i => i.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeCartItem(productId);
        return;
    }
    saveCartToStorage();
    renderCartPage();
};

const removeCartItem = (productId) => {
    State.cart = State.cart.filter(i => i.id !== productId);
    saveCartToStorage();
    showToast('Item removed from cart', 'info');
    renderCartPage();
};

const clearAllCartItems = () => {
    State.cart = [];
    saveCartToStorage();
    showToast('Cart cleared', 'info');
    renderCartPage();
};

const applyCoupon = () => {
    const input = document.getElementById('coupon-code');
    if (!input) return;
    const code = input.value.trim().toUpperCase();

    const coupon = MOCK_COUPONS.find(c => c.code === code);
    if (coupon) {
        State.checkoutData.coupon = coupon;
        showToast(`Coupon ${code} applied successfully!`, 'success');
    } else if (code === '') {
        State.checkoutData.coupon = null;
        showToast(`Coupon cleared`, 'info');
    } else {
        showToast(`Invalid coupon code: ${code}`, 'error');
    }
    renderCartPage();
};

document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});
