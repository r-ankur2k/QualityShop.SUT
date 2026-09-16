// --- QualityShop SUT Shared UI Components ---

const renderNavbar = (activePage = '') => {
    const navbarEl = document.getElementById('navbar');
    if (!navbarEl) return;

    const itemCount = State.cart.reduce((acc, item) => acc + item.quantity, 0);
    const user = State.user;

    const navLinkStyle = (pageName) => {
        return activePage === pageName
            ? 'font-weight:700; background:#000; color:#fff;'
            : 'color:#000;';
    };

    const userHtml = user
        ? `<div class="flex items-center gap-3 ml-2">
             <span class="text-sm text-slate-700 hidden md:block" data-test-id="user-greeting">Hi, ${user.displayName || user.name}</span>
             <a href="profile.html" class="p-2 text-slate-700 hover:text-black" title="Profile" data-test-id="nav-profile-link"><i data-lucide="user"></i></a>
             <button onclick="handleLogout()" class="p-2 text-slate-700 hover:text-red-600" title="Logout" data-test-id="nav-logout"><i data-lucide="log-out"></i></button>
           </div>`
        : `<a href="login.html" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition" data-test-id="nav-login">Login</a>`;

    navbarEl.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16" style="color: #000 !important;">
            <a href="index.html" class="flex items-center cursor-pointer" data-test-id="nav-home-logo">
                <i data-lucide="package" class="h-8 w-8 text-black"></i>
                <span class="ml-2 text-xl font-bold tracking-tight text-violet-700">QualityShop<span class="text-indigo-400">.SUT</span></span>
            </a>
            <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                    <a href="index.html" style="${navLinkStyle('products')}" class="px-3 py-2 rounded-md text-sm font-medium" data-test-id="nav-products">Products</a>
                    <a href="compare.html" style="${navLinkStyle('compare')}" class="px-3 py-2 rounded-md text-sm font-medium" data-test-id="nav-compare">Compare (${State.compare.length})</a>
                    <a href="wishlist.html" style="${navLinkStyle('wishlist')}" class="px-3 py-2 rounded-md text-sm font-medium" data-test-id="nav-wishlist">Wishlist (${State.wishlist.length})</a>
                    <a href="contact.html" style="${navLinkStyle('contact')}" class="px-3 py-2 rounded-md text-sm font-medium" data-test-id="nav-contact">Contact</a>
                    ${user ? `<a href="orders.html" style="${navLinkStyle('orders')}" class="px-3 py-2 rounded-md text-sm font-medium" data-test-id="nav-orders">Orders</a>` : ''}
                    ${user && user.role === 'admin' ? `<a href="admin.html" style="${navLinkStyle('admin')}" class="px-3 py-2 rounded-md text-sm font-medium" data-test-id="nav-admin">Admin</a>` : ''}
                </div>
            </div>
            <div class="flex items-center gap-4 text-black">
                <a href="test-data.html" class="p-2 text-black hover:text-amber-500" title="Test Data Inspector" data-test-id="test-data-btn">
                    <i data-lucide="database"></i><span class="sr-only">Test Data</span>
                </a>
                <a href="cart.html" class="relative cursor-pointer p-2 hover:bg-slate-100 rounded-full text-black" data-test-id="cart-icon">
                    <i data-lucide="shopping-cart"></i>
                    ${itemCount > 0 ? `<span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full" data-test-id="cart-count">${itemCount}</span>` : ''}
                </a>
                ${userHtml}
            </div>
        </div>
    `;

    initIcons();
};

const renderFooter = () => {
    const footerEl = document.getElementById('footer');
    if (!footerEl) return;
    footerEl.innerHTML = `
        <footer class="bg-slate-900 text-slate-400 py-10 mt-auto">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p class="mb-2">© 2025 QualityShop SUT. Built for Automation Testing.</p>
                <p class="text-sm">Use <code class="text-amber-400">data-test-id</code> attributes for all automated test selectors.</p>
                <p class="mb-2 text-xs text-slate-500 mt-2">Proudly Built by Ankur Raj</p>
            </div>
        </footer>
    `;
};

const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const bgColors = {
        success: 'bg-emerald-600 text-white',
        error: 'bg-rose-600 text-white',
        warning: 'bg-amber-500 text-white',
        info: 'bg-indigo-600 text-white'
    };

    const toast = document.createElement('div');
    toast.className = `p-4 rounded-lg shadow-lg ${bgColors[type] || bgColors.info} flex items-center gap-2 text-sm font-medium transition-all duration-300 transform translate-y-2 opacity-0`;
    toast.setAttribute('data-test-id', 'toast-notification');
    toast.setAttribute('data-test-type', type);
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-auto text-white/80 hover:text-white">&times;</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

const handleLogout = () => {
    CookieUtils.clearAuth();
    State.user = null;
    showToast('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
};

const initIcons = () => {
    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderFooter();
});
