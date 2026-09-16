// --- QualityShop SUT Enterprise Automation API ---
const AutomationHelpers = {
    CookieUtils: CookieUtils,
    setAuthCookies: (email = 'user@test.com', role = 'customer', name = 'Test User', remember = true) => {
        const uid = 'mock-' + email.replace(/[^a-zA-Z0-9]/g, '');
        const displayName = name || email.split('@')[0];
        const days = remember ? 7 : null;
        const token = `Bearer_mock_jwt_${uid}_${Date.now()}`;
        const sessionId = `sess_${Math.random().toString(36).substring(2, 10)}`;

        CookieUtils.set('auth_token', token, days);
        CookieUtils.set('user_email', email, days);
        CookieUtils.set('user_role', role, days);
        CookieUtils.set('user_name', displayName, days);
        CookieUtils.set('session_id', sessionId, days);
        CookieUtils.set('logged_in', 'true', days);

        State.user = { uid, email, displayName, role };
        if (typeof showToast === 'function') showToast(`Auth cookies set for ${email}`, 'success');
        if (typeof renderNavbar === 'function') renderNavbar();
    },
    clearAuthCookies: () => {
        CookieUtils.clearAuth();
        State.user = null;
        if (typeof showToast === 'function') showToast('Auth cookies cleared', 'info');
        if (typeof renderNavbar === 'function') renderNavbar();
    },
    getAuthCookies: () => ({
        authToken: CookieUtils.get('auth_token'),
        userEmail: CookieUtils.get('user_email'),
        userRole: CookieUtils.get('user_role'),
        userName: CookieUtils.get('user_name'),
        sessionId: CookieUtils.get('session_id'),
        loggedIn: CookieUtils.get('logged_in')
    }),
    seedCart: (items = []) => {
        State.cart = items;
        saveCartToStorage();
        if (typeof renderNavbar === 'function') renderNavbar();
        if (typeof showToast === 'function') showToast(`Cart seeded with ${items.length} items`, 'success');
    },
    clearCart: () => {
        State.cart = [];
        saveCartToStorage();
        if (typeof renderNavbar === 'function') renderNavbar();
    },
    setNetworkDelay: (ms = 0) => {
        State.networkDelay = ms;
        try { localStorage.setItem('qs_network_delay', ms.toString()); } catch(e) {}
        if (typeof showToast === 'function') showToast(`API delay set to ${ms}ms`, 'info');
    },
    setSimulatedError: (statusCode = null) => {
        State.simulatedError = statusCode;
        if (statusCode) {
            try { localStorage.setItem('qs_simulated_error', statusCode.toString()); } catch(e) {}
        } else {
            try { localStorage.removeItem('qs_simulated_error'); } catch(e) {}
        }
        if (typeof showToast === 'function') showToast(`Simulated Error: ${statusCode || 'None'}`, 'warning');
    },
    resetSUTState: () => {
        localStorage.clear();
        CookieUtils.clearAuth();
        State.cart = [];
        State.wishlist = [];
        State.user = null;
        State.orders = [];
        State.compare = [];
        if (typeof showToast === 'function') showToast('SUT state completely reset', 'info');
        setTimeout(() => window.location.reload(), 300);
    },
    advanceOrderStatus: (orderId = null, targetStatus = null) => {
        if (!State.orders || State.orders.length === 0) return null;

        const order = orderId
            ? State.orders.find(o => o.id === orderId)
            : State.orders.find(o => o.status === 'Processing' || o.status === 'Shipped');

        if (!order) return null;

        const oldStatus = order.status;
        if (targetStatus) {
            order.status = targetStatus;
        } else if (order.status === 'Processing') {
            order.status = 'Shipped';
        } else if (order.status === 'Shipped') {
            order.status = 'Delivered';
        }

        saveOrdersToStorage();

        // Update live DOM elements if present on page
        const statusBadge = document.querySelector(`[data-test-id="order-status-badge-${order.id}"]`);
        if (statusBadge) {
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
            statusBadge.className = `px-3 py-1 rounded-full font-bold text-xs border inline-flex items-center gap-1.5 transition-all duration-300 ${colorClasses}`;
            statusBadge.innerHTML = `${icon} ${order.status}`;
        }

        const confirmationBadge = document.querySelector('[data-test-id="confirmation-status"]');
        if (confirmationBadge) {
            let colorClasses = 'bg-amber-100 text-amber-800';
            if (order.status === 'Shipped') colorClasses = 'bg-blue-100 text-blue-800';
            else if (order.status === 'Delivered') colorClasses = 'bg-emerald-100 text-emerald-800';
            else if (order.status === 'Cancelled') colorClasses = 'bg-rose-100 text-rose-800';
            confirmationBadge.className = `inline-block px-2.5 py-0.5 rounded-full font-bold transition-all duration-300 ${colorClasses}`;
            confirmationBadge.textContent = order.status;
        }

        const adminBadge = document.querySelector(`[data-test-id="admin-order-status-${order.id}"]`);
        if (adminBadge) {
            let colorClasses = 'bg-amber-100 text-amber-800';
            if (order.status === 'Shipped') colorClasses = 'bg-blue-100 text-blue-800';
            else if (order.status === 'Delivered') colorClasses = 'bg-emerald-100 text-emerald-800';
            else if (order.status === 'Cancelled') colorClasses = 'bg-rose-100 text-rose-800';
            adminBadge.className = `px-2.5 py-1 rounded-full font-bold ${colorClasses}`;
            adminBadge.textContent = order.status;
        }

        const adminSelect = document.querySelector(`[data-test-id="status-select-${order.id}"]`);
        if (adminSelect) {
            adminSelect.value = order.status;
        }

        if (typeof showToast === 'function' && oldStatus !== order.status) {
            showToast(`Order ${order.id} status updated to ${order.status}`, 'info');
        }

        window.dispatchEvent(new CustomEvent('qs:order-status-changed', {
            detail: { orderId: order.id, oldStatus, newStatus: order.status }
        }));

        return order;
    },
    startOrderStatusAutoAdvance: (intervalMs = 7000) => {
        if (window._qsOrderStatusTimer) {
            clearInterval(window._qsOrderStatusTimer);
        }
        window._qsOrderStatusTimer = setInterval(() => {
            AutomationHelpers.advanceOrderStatus();
        }, intervalMs);
    },
    stopOrderStatusAutoAdvance: () => {
        if (window._qsOrderStatusTimer) {
            clearInterval(window._qsOrderStatusTimer);
            window._qsOrderStatusTimer = null;
        }
    }
};

window.AutomationHelpers = AutomationHelpers;
window.QualityShopTestAPI = AutomationHelpers;

// Helper to simulate network latency if active
const applyNetworkDelay = async () => {
    if (State.networkDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, State.networkDelay));
    }
};

// Handle URL query parameter pre-conditions and start automated state transitions
const handleUrlStateSeeding = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('autologin')) {
        const type = params.get('autologin');
        if (type === 'admin') {
            AutomationHelpers.setAuthCookies('admin@test.com', 'admin', 'Admin User');
        } else {
            AutomationHelpers.setAuthCookies('user@test.com', 'customer', 'Standard User');
        }
    }
    if (params.get('seedCart') === 'true') {
        AutomationHelpers.seedCart([
            { ...MOCK_PRODUCTS[0], quantity: 2 },
            { ...MOCK_PRODUCTS[2], quantity: 1 }
        ]);
    }

    // Automatically advance active order statuses every 7 seconds for async testing
    AutomationHelpers.startOrderStatusAutoAdvance(7000);
};

document.addEventListener('DOMContentLoaded', handleUrlStateSeeding);
