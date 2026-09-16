// --- Customer Orders History Page Logic ---

const renderOrderStatusBadge = (order) => {
    let colorClasses = 'bg-amber-100 text-amber-800 border-amber-200';
    let icon = '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>';
    if (order.status === 'Shipped') {
        colorClasses = 'bg-blue-100 text-blue-800 border-blue-200';
        icon = '🚚';
    } else if (order.status === 'Delivered') {
        colorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-200';
        icon = '✓';
    } else if (order.status === 'Cancelled') {
        colorClasses = 'bg-rose-100 text-rose-800 border-rose-200';
        icon = '✕';
    }
    return `<span class="px-3 py-1 rounded-full font-bold text-xs border inline-flex items-center gap-1.5 transition-all duration-300 ${colorClasses}" data-test-id="order-status-badge-${order.id}">${icon} ${order.status}</span>`;
};

const renderOrdersPage = async () => {
    await applyNetworkDelay();
    renderNavbar('orders');

    const container = document.getElementById('orders-container');
    if (!container) return;

    if (State.orders.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center" data-test-id="no-orders-state">
                <div class="text-6xl mb-4">📦</div>
                <h2 class="text-xl font-bold text-slate-800">No Orders Found</h2>
                <p class="text-slate-500 text-sm mt-1">You haven't placed any orders yet.</p>
                <a href="products.html" class="inline-block mt-6 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-md" data-test-id="shop-now-btn">
                    Start Shopping
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="space-y-6">
            ${State.orders.map(order => `
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-test-id="order-card-${order.id}">
                    <!-- Card Header -->
                    <div class="bg-slate-50 p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div class="flex flex-wrap gap-6">
                            <div>
                                <span class="text-slate-400 block uppercase font-semibold">Order Placed</span>
                                <span class="font-bold text-slate-800" data-test-id="order-date-${order.id}">${order.date}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block uppercase font-semibold">Total</span>
                                <span class="font-bold text-slate-900" data-test-id="order-total-${order.id}">$${order.total.toFixed(2)}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block uppercase font-semibold">Ship To</span>
                                <span class="font-bold text-slate-800">${order.shipping.name || 'Customer'}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            ${renderOrderStatusBadge(order)}
                            <span class="font-mono text-slate-500 font-bold" data-test-id="order-id-${order.id}">${order.id}</span>
                        </div>
                    </div>

                    <!-- Items List -->
                    <div class="p-4 sm:p-6 divide-y divide-slate-100">
                        ${order.items.map(item => `
                            <div class="py-3 flex items-center justify-between text-xs">
                                <div class="flex items-center gap-3">
                                    <span class="text-3xl">${item.image}</span>
                                    <div>
                                        <a href="product-detail.html?id=${item.id}" class="font-bold text-slate-900 hover:text-indigo-600 transition" data-test-id="order-item-link-${item.id}">${item.name}</a>
                                        <span class="text-slate-400 block">Quantity: ${item.quantity} × $${item.price.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button onclick="reorderItem('${item.id}')" class="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold" data-test-id="reorder-btn-${item.id}">
                                    Buy Again
                                </button>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Actions Footer -->
                    <div class="bg-slate-50/50 p-4 border-t border-slate-100 flex justify-between items-center text-xs">
                        <span class="text-slate-500">Tracking: <strong class="font-mono text-slate-700">${order.trackingNumber}</strong></span>
                        <button onclick="fileComplaint('${order.id}')" class="text-rose-600 hover:underline font-semibold" data-test-id="file-complaint-btn-${order.id}">File Support Ticket / Complaint</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    initIcons();
};

const reorderItem = (productId) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const existing = State.cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        State.cart.push({ ...product, quantity: 1 });
    }
    saveCartToStorage();
    renderNavbar('orders');
    showToast(`Added ${product.name} to cart`, 'success');
};

const fileComplaint = (orderId) => {
    showToast(`Opening complaint ticket modal for ${orderId}`, 'info');
    setTimeout(() => {
        window.location.href = `contact.html?orderId=${orderId}`;
    }, 500);
};

document.addEventListener('DOMContentLoaded', () => {
    renderOrdersPage();
});
