// --- QualityShop SUT Shared UI Components & QA Banner Helpers ---

/**
 * Renders the primary top navigation header dynamically across all pages.
 * Handles active route styling, user session dropdowns, cart badges, and login suppression.
 *
 * @param {string} activePage - Name of the active route ('products', 'cart', 'orders', 'profile', 'admin', 'contact', 'login', etc.)
 */
const renderNavbar = (activePage = '') => {
    const navbarEl = document.getElementById('navbar');
    if (!navbarEl) return;

    const itemCount = State.cart ? State.cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
    const user = State.user;

    const navLinkClass = (pageName) => {
        return activePage === pageName
            ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all duration-200'
            : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100/80 font-medium transition-all duration-200';
    };

    const isLoginPage = activePage === 'login';

    const userHtml = user
        ? `<div class="flex items-center gap-2.5 ml-2 pl-3 border-l border-slate-200/80">
             <a href="profile.html" class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-indigo-600 transition" title="View Profile" data-test-id="nav-profile-link">
                <div class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    ${(user.displayName || user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <span class="text-xs font-semibold text-slate-700 hidden sm:inline" data-test-id="user-greeting">Hi, ${user.displayName || user.name}</span>
             </a>
             <button onclick="handleLogout()" class="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition" title="Logout" data-test-id="nav-logout">
                <i data-lucide="log-out" class="h-4 w-4"></i>
             </button>
           </div>`
        : (isLoginPage ? '' : `<a href="login.html" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm hover:shadow-indigo-100" data-test-id="nav-login">Sign In</a>`);

    const navLinks = isLoginPage ? '' : `
        <div class="hidden md:block">
            <div class="flex items-center space-x-1.5">
                <a href="index.html" class="px-3 py-1.5 rounded-xl text-xs ${navLinkClass('products')}" data-test-id="nav-products">
                    Products
                </a>
                <a href="wishlist.html" class="px-3 py-1.5 rounded-xl text-xs ${navLinkClass('wishlist')}" data-test-id="nav-wishlist">
                    Wishlist ${State.wishlist && State.wishlist.length > 0 ? `<span class="ml-1 bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">${State.wishlist.length}</span>` : ''}
                </a>
                <a href="contact.html" class="px-3 py-1.5 rounded-xl text-xs ${navLinkClass('contact')}" data-test-id="nav-contact">
                    Contact
                </a>
                ${user ? `<a href="orders.html" class="px-3 py-1.5 rounded-xl text-xs ${navLinkClass('orders')}" data-test-id="nav-orders">Orders</a>` : ''}
                ${user && user.role === 'admin' ? `<a href="admin.html" class="px-3 py-1.5 rounded-xl text-xs ${navLinkClass('admin')}" data-test-id="nav-admin"><span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Admin</span></a>` : ''}
            </div>
        </div>
    `;

    navbarEl.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <a href="${isLoginPage ? 'login.html' : 'index.html'}" class="flex items-center gap-2.5 cursor-pointer group" data-test-id="nav-home-logo">
                <div class="p-2 bg-indigo-600 text-white rounded-xl shadow-sm group-hover:bg-indigo-700 transition">
                    <i data-lucide="package" class="h-5 w-5"></i>
                </div>
                <div>
                    <span class="text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition">QualityShop</span>
                    <span class="hidden sm:inline-block ml-1.5 text-[10px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded border border-indigo-100">SUT v2.5</span>
                </div>
            </a>

            ${navLinks}

            <div class="flex items-center gap-3">
                ${!isLoginPage ? `
                <a href="cart.html" class="relative cursor-pointer p-2.5 hover:bg-slate-100 rounded-xl text-slate-700 hover:text-indigo-600 transition" data-test-id="cart-icon">
                    <i data-lucide="shopping-cart" class="h-5 w-5"></i>
                    ${itemCount > 0 ? `<span class="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-rose-600 rounded-full shadow-sm" data-test-id="cart-count">${itemCount}</span>` : ''}
                </a>` : ''}
                ${userHtml}
            </div>
        </div>
    `;

    initIcons();
    renderQAModeBanner();
};

/**
 * Renders top sticky QA Status Alert Banner when artificial network latency or simulated HTTP errors are active.
 */
const renderQAModeBanner = () => {
    let bannerEl = document.getElementById('qs-qa-status-banner');

    if (!State.simulatedError && (!State.networkDelay || State.networkDelay === 0)) {
        if (bannerEl) bannerEl.remove();
        return;
    }

    if (!bannerEl) {
        bannerEl = document.createElement('div');
        bannerEl.id = 'qs-qa-status-banner';
        bannerEl.className = 'bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-inner border-b border-amber-600/20';
        document.body.prepend(bannerEl);
    }

    let activeModes = [];
    if (State.simulatedError) {
        activeModes.push(`⚠️ Simulated Error Injection Active: HTTP ${State.simulatedError}`);
    }
    if (State.networkDelay > 0) {
        const seconds = (State.networkDelay / 1000).toFixed(State.networkDelay >= 1000 ? 1 : 0);
        activeModes.push(`⏱️ Artificial Network Delay: ${State.networkDelay >= 1000 ? seconds + 's' : State.networkDelay + 'ms'}`);
    }

    bannerEl.innerHTML = `
        <div class="flex items-center gap-2 text-slate-900 font-bold" data-test-id="qa-active-banner-text">
            <span>${activeModes.join(' &nbsp;|&nbsp; ')}</span>
        </div>
        <div class="flex items-center gap-3">
            <a href="test-data.html" class="underline hover:text-slate-900 text-slate-950 font-bold">QA Manager</a>
            <button onclick="clearQAModes()" class="bg-slate-950 text-amber-300 hover:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-bold transition">Clear Modes</button>
        </div>
    `;
};

/**
 * Resets active QA simulated error injection and network latency parameters.
 */
const clearQAModes = () => {
    AutomationHelpers.setSimulatedError(null);
    AutomationHelpers.setNetworkDelay(0);
    const bannerEl = document.getElementById('qs-qa-status-banner');
    if (bannerEl) bannerEl.remove();
    showToast('QA Simulated Error & Latency Modes cleared', 'info');
    if (typeof renderControlPanels === 'function') renderControlPanels();
};

/**
 * Renders a structured, modern enterprise footer at the bottom of every page.
 */
const renderFooter = () => {
    const footerEl = document.getElementById('footer');
    if (!footerEl) return;
    footerEl.innerHTML = `
        <footer class="bg-slate-900 text-slate-400 py-10 mt-auto border-t border-slate-800/80">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <!-- Grid columns for structured footer navigation -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
                    <!-- Column 1: Brand & SUT Overview -->
                    <div class="space-y-3 md:col-span-1">
                        <div class="flex items-center gap-2.5">
                            <div class="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
                                <i data-lucide="package" class="h-5 w-5"></i>
                            </div>
                            <span class="text-lg font-black tracking-tight text-white">QualityShop <span class="text-xs bg-indigo-500/20 text-indigo-400 font-bold px-1.5 py-0.5 rounded border border-indigo-500/30">SUT</span></span>
                        </div>
                        <p class="text-xs text-slate-400 leading-relaxed">
                            Enterprise web application test bench for practicing & benchmarking automated E2E & REST API testing with Playwright, Cypress, Selenium, and WebdriverIO.
                        </p>
                    </div>

                    <!-- Column 2: Application Pages -->
                    <div>
                        <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Store Pages</h4>
                        <ul class="space-y-2 text-xs font-medium">
                            <li><a href="index.html" class="hover:text-indigo-400 transition flex items-center gap-1.5"><i data-lucide="grid" class="h-3.5 w-3.5 text-slate-500"></i> Products Catalog</a></li>
                            <li><a href="cart.html" class="hover:text-indigo-400 transition flex items-center gap-1.5"><i data-lucide="shopping-cart" class="h-3.5 w-3.5 text-slate-500"></i> Shopping Cart</a></li>
                            <li><a href="checkout.html" class="hover:text-indigo-400 transition flex items-center gap-1.5"><i data-lucide="credit-card" class="h-3.5 w-3.5 text-slate-500"></i> Checkout Flow</a></li>
                            <li><a href="orders.html" class="hover:text-indigo-400 transition flex items-center gap-1.5"><i data-lucide="package-check" class="h-3.5 w-3.5 text-slate-500"></i> Order History</a></li>
                        </ul>
                    </div>

                    <!-- Column 3: Account & Support -->
                    <div>
                        <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Account & Help</h4>
                        <ul class="space-y-2 text-xs font-medium">
                            <li><a href="profile.html" class="hover:text-indigo-400 transition flex items-center gap-1.5"><i data-lucide="user" class="h-3.5 w-3.5 text-slate-500"></i> Profile & Settings</a></li>
                            <li><a href="wishlist.html" class="hover:text-indigo-400 transition flex items-center gap-1.5"><i data-lucide="heart" class="h-3.5 w-3.5 text-slate-500"></i> Saved Wishlist</a></li>
                            <li><a href="contact.html" class="hover:text-indigo-400 transition flex items-center gap-1.5"><i data-lucide="mail" class="h-3.5 w-3.5 text-slate-500"></i> Contact & Support</a></li>
                            <li><a href="login.html" class="hover:text-indigo-400 transition flex items-center gap-1.5"><i data-lucide="key" class="h-3.5 w-3.5 text-slate-500"></i> User Login</a></li>
                        </ul>
                    </div>

                    <!-- Column 4: QA & Automation Utilities -->
                    <div>
                        <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <i data-lucide="terminal" class="h-4 w-4"></i> QA Automation Tools
                        </h4>
                        <ul class="space-y-2 text-xs font-medium">
                            <li><a href="test-data.html" class="text-amber-300 hover:text-amber-200 transition font-mono flex items-center gap-1.5" data-test-id="footer-test-data-link"><span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> Test Manager Dashboard</a></li>
                            <li><a href="admin.html" class="hover:text-indigo-400 transition flex items-center gap-1.5"><i data-lucide="shield" class="h-3.5 w-3.5 text-slate-500"></i> Admin Panel</a></li>
                            <li><a href="compare.html" class="hover:text-indigo-400 transition flex items-center gap-1.5"><i data-lucide="arrow-left-right" class="h-3.5 w-3.5 text-slate-500"></i> Product Comparison</a></li>
                            <li><span class="font-mono text-[11px] text-slate-500">API Spec: /api/v1/openapi.json</span></li>
                        </ul>
                    </div>
                </div>

                <!-- Footer Bottom Row -->
                <div class="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                    <div class="flex items-center gap-2">
                        <p>© 2025 QualityShop SUT. Enterprise Test Bench Platform. Designed by Ankur Raj.</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700">
                            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                            data-test-id ready
                        </span>
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700">
                            API Interceptor Active
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    `;
    initIcons();
};

/**
 * Triggers a temporary toast notification in the bottom-right viewport container.
 *
 * @param {string} message - Text notification string
 * @param {string} type - Notification alert theme ('success', 'error', 'warning', 'info')
 */
const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const config = {
        success: { bg: 'bg-emerald-900/90 border-emerald-700 text-emerald-100', icon: 'check-circle' },
        error: { bg: 'bg-rose-900/90 border-rose-700 text-rose-100', icon: 'alert-octagon' },
        warning: { bg: 'bg-amber-900/90 border-amber-700 text-amber-100', icon: 'alert-triangle' },
        info: { bg: 'bg-indigo-900/90 border-indigo-700 text-indigo-100', icon: 'info' }
    };

    const cfg = config[type] || config.info;

    const toast = document.createElement('div');
    toast.className = `p-3.5 rounded-2xl shadow-xl backdrop-blur-md border ${cfg.bg} flex items-center gap-3 text-xs font-medium transition-all duration-300 transform translate-y-3 opacity-0 toast`;
    toast.setAttribute('data-test-id', 'toast-notification');
    toast.setAttribute('data-test-type', type);
    toast.innerHTML = `
        <i data-lucide="${cfg.icon}" class="h-4 w-4 shrink-0"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-auto p-1 hover:bg-white/10 rounded-lg transition">&times;</button>
    `;

    container.appendChild(toast);
    initIcons();

    setTimeout(() => {
        toast.classList.remove('translate-y-3', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
};

/**
 * Log out user session and redirect to catalog index.
 */
const handleLogout = () => {
    CookieUtils.clearAuth();
    State.user = null;
    showToast('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
};

/**
 * Attaches a visual loading spinner to a button during asynchronous tasks.
 * Prevents duplicate clicks and displays execution feedback.
 *
 * @param {HTMLElement} buttonElement - Target button DOM node
 * @param {Function} asyncCallback - Async function to execute
 */
const withButtonSpinner = async (buttonElement, asyncCallback) => {
    if (!buttonElement) return await asyncCallback();

    const originalContent = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.classList.add('opacity-80', 'cursor-wait');
    buttonElement.innerHTML = `<span class="inline-block animate-spin border-2 border-current border-t-transparent rounded-full h-3.5 w-3.5 mr-2"></span> Processing...`;

    try {
        const result = await asyncCallback();
        return result;
    } finally {
        buttonElement.disabled = false;
        buttonElement.classList.remove('opacity-80', 'cursor-wait');
        buttonElement.innerHTML = originalContent;
        initIcons();
    }
};

/**
 * Initializes Lucide icon set across rendered elements.
 */
const initIcons = () => {
    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderFooter();
});

