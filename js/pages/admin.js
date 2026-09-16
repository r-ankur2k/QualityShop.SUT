// --- Admin Dashboard Page Logic ---

const renderAdminPage = async () => {
    await applyNetworkDelay();
    renderNavbar('admin');

    // Access control check
    if (State.user && State.user.role !== 'admin') {
        showToast('Access Denied: Admin role required.', 'error');
        setTimeout(() => window.location.href = 'index.html', 1000);
        return;
    }

    renderAdminDashboard();
};

const renderAdminDashboard = () => {
    const container = document.getElementById('admin-container');
    if (!container) return;

    const totalSales = State.orders.reduce((acc, o) => acc + o.total, 0);
    const totalOrders = State.orders.length;
    const totalProducts = MOCK_PRODUCTS.length;

    container.innerHTML = `
        <div class="space-y-8">
            <!-- Metrics Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm" data-test-id="admin-metric-sales">
                    <span class="text-xs font-semibold text-slate-400 uppercase">Total Sales Revenue</span>
                    <span class="text-2xl font-black text-slate-900 block mt-1">$${totalSales.toFixed(2)}</span>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm" data-test-id="admin-metric-orders">
                    <span class="text-xs font-semibold text-slate-400 uppercase">Total Orders</span>
                    <span class="text-2xl font-black text-slate-900 block mt-1">${totalOrders}</span>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm" data-test-id="admin-metric-products">
                    <span class="text-xs font-semibold text-slate-400 uppercase">Catalog Products</span>
                    <span class="text-2xl font-black text-slate-900 block mt-1">${totalProducts}</span>
                </div>
            </div>

            <!-- Inventory Stock Management Table -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 class="text-base font-bold text-slate-900" data-test-id="inventory-title">Catalog Inventory Management</h2>
                    <span class="text-xs text-slate-400">Click stock to update</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs" data-test-id="admin-inventory-table">
                        <thead class="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase">
                            <tr>
                                <th class="p-4">Product</th>
                                <th class="p-4">Category</th>
                                <th class="p-4">Price</th>
                                <th class="p-4">Stock Level</th>
                                <th class="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${MOCK_PRODUCTS.map(p => `
                                <tr class="hover:bg-slate-50/50" data-test-id="admin-product-row-${p.id}">
                                    <td class="p-4 font-bold text-slate-900 flex items-center gap-2">
                                        <span>${p.image}</span>
                                        <span>${p.name}</span>
                                    </td>
                                    <td class="p-4 text-slate-600">${p.category}</td>
                                    <td class="p-4 font-semibold text-slate-900">$${p.price.toFixed(2)}</td>
                                    <td class="p-4">
                                        <span class="px-2.5 py-1 rounded font-bold ${p.stock < 10 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}" data-test-id="admin-stock-${p.id}">
                                            ${p.stock} units
                                        </span>
                                    </td>
                                    <td class="p-4 text-right">
                                        <button onclick="updateStockPrompt('${p.id}')" class="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-semibold" data-test-id="edit-stock-btn-${p.id}">
                                            Edit Stock
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Customer Orders Management Table -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="p-6 border-b border-slate-100">
                    <h2 class="text-base font-bold text-slate-900" data-test-id="admin-orders-title">Customer Orders Management</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs" data-test-id="admin-orders-table">
                        <thead class="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase">
                            <tr>
                                <th class="p-4">Order ID</th>
                                <th class="p-4">Date</th>
                                <th class="p-4">Customer</th>
                                <th class="p-4">Total</th>
                                <th class="p-4">Status</th>
                                <th class="p-4 text-right">Update Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${State.orders.length === 0 ? `
                                <tr><td colspan="6" class="p-6 text-center text-slate-400">No orders placed yet.</td></tr>
                            ` : State.orders.map(o => `
                                <tr class="hover:bg-slate-50/50" data-test-id="admin-order-row-${o.id}">
                                    <td class="p-4 font-mono font-bold text-indigo-600">${o.id}</td>
                                    <td class="p-4 text-slate-600">${o.date}</td>
                                    <td class="p-4 font-semibold text-slate-800">${o.shipping.name || 'Customer'}</td>
                                    <td class="p-4 font-bold text-slate-900">$${o.total.toFixed(2)}</td>
                                    <td class="p-4">
                                        <span class="px-2.5 py-1 rounded-full font-bold ${o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}" data-test-id="admin-order-status-${o.id}">
                                            ${o.status}
                                        </span>
                                    </td>
                                    <td class="p-4 text-right">
                                        <select onchange="updateOrderStatus('${o.id}', this.value)" class="px-2 py-1 border border-slate-300 rounded font-semibold text-xs" data-test-id="status-select-${o.id}">
                                            <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                                            <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                                            <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                            <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    initIcons();
};

const updateStockPrompt = (productId) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const newStock = prompt(`Enter new stock level for ${product.name}:`, product.stock);
    if (newStock !== null && !isNaN(parseInt(newStock))) {
        product.stock = parseInt(newStock);
        showToast(`Stock for ${product.name} updated to ${product.stock}`, 'success');
        renderAdminDashboard();
    }
};

const updateOrderStatus = (orderId, newStatus) => {
    const order = State.orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        saveOrdersToStorage();
        showToast(`Order ${orderId} status changed to ${newStatus}`, 'success');
        renderAdminDashboard();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderAdminPage();
});
