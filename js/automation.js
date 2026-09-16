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

// Handle URL query parameter pre-conditions
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
};

document.addEventListener('DOMContentLoaded', handleUrlStateSeeding);
