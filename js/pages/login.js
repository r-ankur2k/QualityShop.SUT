// --- Authentication / Login Page Logic ---

const renderLoginPage = async () => {
    await applyNetworkDelay();
    renderNavbar('login');

    // Check if already logged in
    if (State.user) {
        showToast(`Already logged in as ${State.user.email}`, 'info');
    }

    // Auto-fill test credential helper buttons
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autologin') === 'admin') {
        fillCredentials('admin@test.com', 'admin123');
    } else if (urlParams.get('autologin') === 'user') {
        fillCredentials('user@test.com', 'user123');
    }
};

const fillCredentials = (email, password) => {
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    if (emailInput) emailInput.value = email;
    if (passInput) passInput.value = password;
};

const handleLoginFormSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('remember-me')?.checked || false;
    const errorMessage = document.getElementById('error-message');

    if (!email || !password) {
        if (errorMessage) {
            errorMessage.textContent = 'Please provide both email and password.';
            errorMessage.classList.remove('hidden');
        }
        return;
    }

    // Check for simulated errors
    if (State.simulatedError === '401') {
        if (errorMessage) {
            errorMessage.textContent = 'Simulated 401 Unauthorized Error: Invalid credentials.';
            errorMessage.classList.remove('hidden');
        }
        showToast('Simulated 401 Error', 'error');
        return;
    }

    // Role determination
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
    const name = email.split('@')[0];

    // Use AutomationHelpers to set auth cookies and update State
    AutomationHelpers.setAuthCookies(email, role, name, rememberMe);

    showToast(`Welcome back, ${name}!`, 'success');

    setTimeout(() => {
        const redirectUrl = urlParams('redirect') || (role === 'admin' ? 'admin.html' : 'index.html');
        window.location.href = redirectUrl;
    }, 500);
};

const urlParams = (key) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
};

document.addEventListener('DOMContentLoaded', () => {
    renderLoginPage();

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginFormSubmit);
    }
});
