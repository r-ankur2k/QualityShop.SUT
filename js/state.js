// --- QualityShop SUT Centralized Application State ---
const State = {
    user: null,
    wishlist: [],
    cart: [],
    currentProduct: null,
    filters: { category: 'All', price: 1000, search: '', sort: 'default' },
    selectedProducts: new Set(),
    checkoutData: { shipping: {}, coupon: null },
    compare: [],
    savedAddresses: [],
    paymentMethods: [],
    pagination: { page: 1, itemsPerPage: 9 },
    checkoutStep: 1,
    orders: [],
    reviews: {},
    networkDelay: 0,
    simulatedError: null
};

// Initialize State from Storage & Cookies
const requireAuth = (allowedRoles = null) => {
    const pagePath = window.location.pathname.split('/').pop() || 'index.html';
    const publicPages = ['login.html', 'test-data.html'];

    if (publicPages.includes(pagePath)) {
        return true;
    }

    // Support instant query param autologin seeding
    const params = new URLSearchParams(window.location.search);
    if (params.get('autologin')) {
        const type = params.get('autologin');
        const email = type === 'admin' ? 'admin@test.com' : 'user@test.com';
        const role = type === 'admin' ? 'admin' : 'customer';
        const name = type === 'admin' ? 'Admin User' : 'Standard User';
        const uid = 'mock-' + email.replace(/[^a-zA-Z0-9]/g, '');

        CookieUtils.set('auth_token', `Bearer_mock_jwt_${uid}`, 7);
        CookieUtils.set('user_email', email, 7);
        CookieUtils.set('user_role', role, 7);
        CookieUtils.set('user_name', name, 7);
        CookieUtils.set('session_id', `sess_mock`, 7);
        CookieUtils.set('logged_in', 'true', 7);

        State.user = { uid, email, displayName: name, role, name };
    }

    const isLoggedIn = CookieUtils.get('logged_in') === 'true';
    if (!isLoggedIn || !State.user) {
        const queryStr = window.location.search ? window.location.search : '';
        const redirectTarget = encodeURIComponent(pagePath + queryStr);
        window.location.href = `login.html?redirect=${redirectTarget}`;
        return false;
    }

    if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        if (!allowedRoles.includes(State.user.role)) {
            if (typeof showToast === 'function') showToast('Access Denied: Admin role required.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
            return false;
        }
    }

    return true;
};

const initStoreState = () => {
    try { State.wishlist = JSON.parse(localStorage.getItem('mock_wishlist') || '[]'); } catch(e) { State.wishlist = []; }
    try { State.cart = JSON.parse(localStorage.getItem('mock_cart') || '[]'); } catch(e) { State.cart = []; }
    try { State.compare = JSON.parse(localStorage.getItem('mock_compare') || '[]'); } catch(e) { State.compare = []; }
    try { State.savedAddresses = JSON.parse(localStorage.getItem('mock_addresses') || '[]'); } catch(e) { State.savedAddresses = []; }
    try { State.paymentMethods = JSON.parse(localStorage.getItem('mock_cards') || '[]'); } catch(e) { State.paymentMethods = []; }
    try { State.orders = JSON.parse(localStorage.getItem('mock_orders') || '[]'); } catch(e) { State.orders = []; }
    try { State.reviews = JSON.parse(localStorage.getItem('mock_reviews') || '{}'); } catch(e) { State.reviews = {}; }
    try { State.networkDelay = parseInt(localStorage.getItem('qs_network_delay') || '0', 10); } catch(e) { State.networkDelay = 0; }
    try { State.simulatedError = localStorage.getItem('qs_simulated_error') || null; } catch(e) { State.simulatedError = null; }

    // Restore user session from auth cookies
    const isLoggedIn = CookieUtils.get('logged_in') === 'true';
    const email = CookieUtils.get('user_email');
    const role = CookieUtils.get('user_role') || 'customer';
    const name = CookieUtils.get('user_name') || (email ? email.split('@')[0] : 'User');

    if (isLoggedIn && email) {
        const uid = 'mock-' + email.replace(/[^a-zA-Z0-9]/g, '');
        State.user = { uid, email, displayName: name, role, name };
    }

    // Require authentication for protected store pages
    requireAuth();
};

const saveCartToStorage = () => {
    try { localStorage.setItem('mock_cart', JSON.stringify(State.cart || [])); } catch(e) {}
};

const saveWishlistToStorage = () => {
    try { localStorage.setItem('mock_wishlist', JSON.stringify(State.wishlist || [])); } catch(e) {}
};

const saveCompareToStorage = () => {
    try { localStorage.setItem('mock_compare', JSON.stringify(State.compare || [])); } catch(e) {}
};

const saveOrdersToStorage = () => {
    try { localStorage.setItem('mock_orders', JSON.stringify(State.orders || [])); } catch(e) {}
};

const saveReviewsToStorage = () => {
    try { localStorage.setItem('mock_reviews', JSON.stringify(State.reviews || {})); } catch(e) {}
};

initStoreState();
