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
    networkDelay: 0,
    simulatedError: null
};

// Initialize State from Storage & Cookies
const initStoreState = () => {
    try { State.wishlist = JSON.parse(localStorage.getItem('mock_wishlist') || '[]'); } catch(e) { State.wishlist = []; }
    try { State.cart = JSON.parse(localStorage.getItem('mock_cart') || '[]'); } catch(e) { State.cart = []; }
    try { State.compare = JSON.parse(localStorage.getItem('mock_compare') || '[]'); } catch(e) { State.compare = []; }
    try { State.savedAddresses = JSON.parse(localStorage.getItem('mock_addresses') || '[]'); } catch(e) { State.savedAddresses = []; }
    try { State.paymentMethods = JSON.parse(localStorage.getItem('mock_cards') || '[]'); } catch(e) { State.paymentMethods = []; }
    try { State.orders = JSON.parse(localStorage.getItem('mock_orders') || '[]'); } catch(e) { State.orders = []; }
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

initStoreState();
