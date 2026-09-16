// --- Order Confirmation / Receipt Page Logic ---

const renderOrderConfirmationPage = async () => {
    await applyNetworkDelay();
    renderNavbar('orders');

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');

    const order = State.orders.find(o => o.id === orderId) || State.orders[0];
    const container = document.getElementById('confirmation-container');

    if (!container) return;

    if (!order) {
        container.innerHTML = `
            <div class="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <h2 class="text-xl font-bold text-slate-800">Order Not Found</h2>
                <a href="products.html" class="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm">Return to Shop</a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden max-w-2xl mx-auto" data-test-id="order-confirmation-receipt">
            <div class="bg-emerald-600 p-8 text-center text-white">
                <div class="inline-flex p-3 rounded-full bg-white/20 mb-3">
                    <i data-lucide="check-circle" class="h-10 w-10"></i>
                </div>
                <h1 class="text-2xl font-black" data-test-id="confirmation-heading">Thank You For Your Order!</h1>
                <p class="text-emerald-100 text-sm mt-1">Order ID: <span class="font-mono font-bold" data-test-id="confirmation-order-id">${order.id}</span></p>
            </div>

            <div class="p-6 sm:p-8 space-y-6">
                <div class="flex justify-between items-center text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                        <span class="text-slate-400 block">Date Placed</span>
                        <span class="font-bold text-slate-800" data-test-id="confirmation-date">${order.date}</span>
                    </div>
                    <div>
                        <span class="text-slate-400 block">Status</span>
                        <span class="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold" data-test-id="confirmation-status">${order.status}</span>
                    </div>
                    <div>
                        <span class="text-slate-400 block">Tracking Number</span>
                        <span class="font-mono font-bold text-indigo-600" data-test-id="confirmation-tracking">${order.trackingNumber}</span>
                    </div>
                </div>

                <!-- Purchased Items Summary -->
                <div>
                    <h3 class="text-xs font-bold text-slate-600 uppercase mb-3">Purchased Items</h3>
                    <div class="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                        ${order.items.map(item => `
                            <div class="p-3.5 flex justify-between items-center text-xs bg-white">
                                <div class="flex items-center gap-3">
                                    <span class="text-2xl">${item.image}</span>
                                    <div>
                                        <span class="font-bold text-slate-800 block">${item.name}</span>
                                        <span class="text-slate-400">Qty: ${item.quantity} × $${item.price.toFixed(2)}</span>
                                    </div>
                                </div>
                                <span class="font-bold text-slate-900">$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="flex justify-between items-center pt-4 border-t border-slate-100 text-base font-black text-slate-900">
                    <span>Total Paid</span>
                    <span data-test-id="confirmation-total">$${order.total.toFixed(2)}</span>
                </div>

                <div class="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                    <a href="orders.html" class="flex-grow bg-slate-900 hover:bg-black text-white font-semibold py-2.5 px-4 rounded-xl text-xs text-center transition" data-test-id="view-orders-btn">
                        View All Orders History
                    </a>
                    <a href="products.html" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl text-xs text-center transition" data-test-id="continue-shopping-btn">
                        Continue Shopping
                    </a>
                </div>
            </div>
        </div>
    `;

    initIcons();
};

document.addEventListener('DOMContentLoaded', () => {
    renderOrderConfirmationPage();
});
