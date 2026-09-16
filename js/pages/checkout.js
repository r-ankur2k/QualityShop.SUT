// --- Multi-Step Checkout Page Logic ---

const renderCheckoutPage = async () => {
    await applyNetworkDelay();
    renderNavbar('checkout');

    if (State.cart.length === 0) {
        showToast('Your cart is empty. Please add products first.', 'warning');
        setTimeout(() => window.location.href = 'products.html', 1000);
        return;
    }

    renderStep();
};

const renderStep = () => {
    const container = document.getElementById('checkout-step-container');
    const step = State.checkoutStep || 1;

    if (!container) return;

    // Update Stepper Badges
    ['1', '2', '3'].forEach(s => {
        const badge = document.getElementById(`step-badge-${s}`);
        if (badge) {
            if (parseInt(s) === step) {
                badge.className = "w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md";
            } else if (parseInt(s) < step) {
                badge.className = "w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm";
            } else {
                badge.className = "w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm";
            }
        }
    });

    if (step === 1) {
        renderShippingStep(container);
    } else if (step === 2) {
        renderPaymentStep(container);
    } else if (step === 3) {
        renderReviewStep(container);
    }

    initIcons();
};

const renderShippingStep = (container) => {
    const shipping = State.checkoutData.shipping || {};
    container.innerHTML = `
        <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i data-lucide="map-pin" class="h-5 w-5 text-indigo-600"></i> Step 1: Shipping Address
            </h2>

            <!-- Saved Addresses Dropdown -->
            <div class="mb-6 p-4 bg-indigo-50/70 rounded-xl border border-indigo-100">
                <label for="saved-address-select" class="block text-xs font-bold text-indigo-900 uppercase mb-1.5 flex items-center gap-1">
                    <i data-lucide="bookmark" class="h-3.5 w-3.5 text-indigo-600"></i> Select Saved Address
                </label>
                <select id="saved-address-select" onchange="handleSelectSavedAddress(this.value)" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800" data-test-id="saved-address-select">
                    <option value="">Select Saved Address</option>
                    ${MOCK_SAVED_ADDRESSES.map(a => `
                        <option value="${a.id}">${a.label}</option>
                    `).join('')}
                </select>
            </div>

            <form id="shipping-form" onsubmit="handleShippingSubmit(event)" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
                        <input type="text" id="ship-name" required value="${shipping.name || ''}" placeholder="e.g. Alex Smith" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" data-test-id="shipping-name-input">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone Number</label>
                        <input type="tel" id="ship-phone" required value="${shipping.phone || ''}" placeholder="e.g. 555-019-2834" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" data-test-id="shipping-phone-input">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Street Address</label>
                    <input type="text" id="ship-address" required value="${shipping.address || ''}" placeholder="e.g. 123 Main Street" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" data-test-id="shipping-address-input">
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">City</label>
                        <input type="text" id="ship-city" required value="${shipping.city || ''}" placeholder="e.g. Austin" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" data-test-id="shipping-city-input">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">State / Province</label>
                        <input type="text" id="ship-state" required value="${shipping.state || ''}" placeholder="e.g. TX" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" data-test-id="shipping-state-input">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Zip / Postal Code</label>
                        <input type="text" id="ship-zip" required value="${shipping.zip || ''}" placeholder="e.g. 78701" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" data-test-id="shipping-zip-input">
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-100 flex justify-end">
                    <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition flex items-center gap-2" data-test-id="checkout-step-1-submit">
                        Continue to Payment <i data-lucide="arrow-right" class="h-4 w-4"></i>
                    </button>
                </div>
            </form>
        </div>
    `;
};

const handleSelectSavedAddress = (addrId) => {
    const addr = MOCK_SAVED_ADDRESSES.find(a => a.id === addrId);
    document.getElementById('ship-name').value = addr ? addr.name : '';
    document.getElementById('ship-phone').value = addr ? addr.phone : '';
    document.getElementById('ship-address').value = addr ? addr.address : '';
    document.getElementById('ship-city').value = addr ? addr.city : '';
    document.getElementById('ship-state').value = addr ? addr.state : '';
    document.getElementById('ship-zip').value = addr ? addr.zip : '';
};

const handleShippingSubmit = (e) => {
    e.preventDefault();
    State.checkoutData.shipping = {
        name: document.getElementById('ship-name').value,
        phone: document.getElementById('ship-phone').value,
        address: document.getElementById('ship-address').value,
        city: document.getElementById('ship-city').value,
        state: document.getElementById('ship-state').value,
        zip: document.getElementById('ship-zip').value
    };
    State.checkoutStep = 2;
    renderStep();
};

const renderPaymentStep = (container) => {
    const payment = State.checkoutData.payment || {};
    container.innerHTML = `
        <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i data-lucide="credit-card" class="h-5 w-5 text-indigo-600"></i> Step 2: Payment Details
            </h2>

            <!-- Saved Payment Methods Dropdown -->
            <div class="mb-6 p-4 bg-indigo-50/70 rounded-xl border border-indigo-100">
                <label for="saved-card-select" class="block text-xs font-bold text-indigo-900 uppercase mb-1.5 flex items-center gap-1">
                    <i data-lucide="bookmark" class="h-3.5 w-3.5 text-indigo-600"></i> Select Saved Payment Method
                </label>
                <select id="saved-card-select" onchange="handleSelectSavedCard(this.value)" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800" data-test-id="saved-card-select">
                    <option value="">Select Saved Payment Method</option>
                    ${MOCK_SAVED_PAYMENT_METHODS.map(c => `
                        <option value="${c.id}">${c.label}</option>
                    `).join('')}
                </select>
            </div>

            <form id="payment-form" onsubmit="handlePaymentSubmit(event)" class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Cardholder Name</label>
                    <input type="text" id="pay-name" required value="${payment.name || ''}" placeholder="e.g. Alex Smith" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" data-test-id="payment-name-input">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Credit Card Number</label>
                    <input type="text" id="pay-card" required value="${payment.card || ''}" placeholder="e.g. 4532 8892 1100 8892" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" data-test-id="payment-card-input">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Expiration Date</label>
                        <input type="text" id="pay-exp" required placeholder="MM/YY" value="${payment.exp || ''}" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" data-test-id="payment-exp-input">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">CVV</label>
                        <input type="text" id="pay-cvv" required value="${payment.cvv || ''}" placeholder="123" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" data-test-id="payment-cvv-input">
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-100 flex justify-between">
                    <button type="button" onclick="goToStep(1)" class="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-sm" data-test-id="checkout-step-2-back">
                        Back to Shipping
                    </button>
                    <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition flex items-center gap-2" data-test-id="checkout-step-2-submit">
                        Review Order <i data-lucide="arrow-right" class="h-4 w-4"></i>
                    </button>
                </div>
            </form>
        </div>
    `;
};

const handleSelectSavedCard = (cardId) => {
    const card = MOCK_SAVED_PAYMENT_METHODS.find(c => c.id === cardId);
    document.getElementById('pay-name').value = card ? card.name : '';
    document.getElementById('pay-card').value = card ? card.card : '';
    document.getElementById('pay-exp').value = card ? card.exp : '';
    document.getElementById('pay-cvv').value = card ? card.cvv : '';
};

const handlePaymentSubmit = (e) => {
    e.preventDefault();
    State.checkoutData.payment = {
        name: document.getElementById('pay-name').value,
        card: document.getElementById('pay-card').value,
        exp: document.getElementById('pay-exp').value,
        cvv: document.getElementById('pay-cvv').value
    };
    State.checkoutStep = 3;
    renderStep();
};

const renderReviewStep = (container) => {
    const shipping = State.checkoutData.shipping || {};
    const payment = State.checkoutData.payment || {};
    const last4 = payment.card ? payment.card.trim().slice(-4) : '••••';
    const subtotal = State.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = State.checkoutData.coupon ? (subtotal * State.checkoutData.coupon.discount) : 0;
    const estimatedTax = (subtotal - discount) * 0.08;
    const shippingCost = subtotal > 150 ? 0 : 15.00;
    const grandTotal = Math.max(0, subtotal - discount + estimatedTax + shippingCost);

    container.innerHTML = `
        <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i data-lucide="check-circle-2" class="h-5 w-5 text-indigo-600"></i> Step 3: Review & Place Order
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl text-xs text-slate-700">
                <div>
                    <h3 class="font-bold text-slate-900 uppercase mb-1">Shipping Address</h3>
                    <p class="font-semibold">${shipping.name || 'N/A'}</p>
                    <p>${shipping.address || ''}</p>
                    <p>${shipping.city || ''}${shipping.state ? ', ' + shipping.state : ''} ${shipping.zip || ''}</p>
                    <p>Phone: ${shipping.phone || 'N/A'}</p>
                </div>
                <div>
                    <h3 class="font-bold text-slate-900 uppercase mb-1">Payment Method</h3>
                    <p class="font-semibold">Card ending in ${last4}</p>
                    <p>Cardholder: ${payment.name || 'N/A'}</p>
                </div>
            </div>

            <!-- Items -->
            <div class="space-y-3">
                <h3 class="text-xs font-bold text-slate-600 uppercase">Items (${State.cart.length})</h3>
                <div class="divide-y divide-slate-100 border-t border-b border-slate-100 max-h-48 overflow-y-auto">
                    ${State.cart.map(item => `
                        <div class="py-2.5 flex justify-between text-xs">
                            <span class="text-slate-800 font-medium">${item.name} × ${item.quantity}</span>
                            <span class="font-bold text-slate-900">$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="p-4 bg-indigo-50/50 rounded-xl text-sm space-y-2">
                <div class="flex justify-between font-bold text-slate-900 text-base">
                    <span>Grand Total</span>
                    <span data-test-id="checkout-grand-total">$${grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <div class="flex justify-between items-center pt-4 border-t border-slate-100">
                <button type="button" onclick="goToStep(2)" class="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-sm" data-test-id="checkout-step-3-back">
                    Back to Payment
                </button>
                <button onclick="placeOrder()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl text-sm transition shadow-lg flex items-center gap-2" data-test-id="place-order-btn">
                    <i data-lucide="check" class="h-5 w-5"></i> Place Order Now
                </button>
            </div>
        </div>
    `;
};

const goToStep = (step) => {
    State.checkoutStep = step;
    renderStep();
};

const placeOrder = () => {
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = State.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = State.checkoutData.coupon ? (subtotal * State.checkoutData.coupon.discount) : 0;
    const estimatedTax = (subtotal - discount) * 0.08;
    const shippingCost = subtotal > 150 ? 0 : 15.00;
    const grandTotal = Math.max(0, subtotal - discount + estimatedTax + shippingCost);

    const newOrder = {
        id: orderId,
        date: new Date().toISOString().split('T')[0],
        items: [...State.cart],
        shipping: { ...State.checkoutData.shipping },
        total: grandTotal,
        status: 'Processing',
        trackingNumber: 'TRK-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    };

    State.orders.unshift(newOrder);
    saveOrdersToStorage();

    // Clear Cart
    State.cart = [];
    saveCartToStorage();
    State.checkoutStep = 1;

    showToast(`Order ${orderId} placed successfully!`, 'success');

    setTimeout(() => {
        window.location.href = `order-confirmation.html?orderId=${orderId}`;
    }, 500);
};

document.addEventListener('DOMContentLoaded', () => {
    renderCheckoutPage();
});
