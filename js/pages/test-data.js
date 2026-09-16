// --- Test Data Manager & Cookie Inspector Page Logic ---

const renderTestDataPage = async () => {
    renderNavbar('test-data');
    renderCookieTable();
    renderControlPanels();
};

const renderCookieTable = () => {
    const tableContainer = document.getElementById('cookie-inspector-container');
    if (!tableContainer) return;

    const cookies = CookieUtils.getAll();
    const cookieKeys = Object.keys(cookies);

    if (cookieKeys.length === 0) {
        tableContainer.innerHTML = `
            <div class="p-6 text-center text-slate-400 text-xs" data-test-id="empty-cookies-notice">
                No active cookies or hybrid cookie storage found.
            </div>
        `;
        return;
    }

    tableContainer.innerHTML = `
        <table class="w-full text-left text-xs border-collapse" data-test-id="cookie-inspector-table">
            <thead class="bg-slate-100 text-slate-600 font-semibold uppercase">
                <tr>
                    <th class="p-3">Cookie Name</th>
                    <th class="p-3">Cookie Value</th>
                    <th class="p-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                ${cookieKeys.map(key => `
                    <tr class="hover:bg-slate-50/80" data-test-id="cookie-row-${key}">
                        <td class="p-3 font-mono font-bold text-indigo-700">${key}</td>
                        <td class="p-3 font-mono text-slate-700 break-all max-w-md" data-test-id="cookie-value-${key}">${cookies[key]}</td>
                        <td class="p-3 text-right">
                            <button onclick="deleteSingleCookie('${key}')" class="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded text-[11px]" data-test-id="delete-cookie-btn-${key}">
                                Delete
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
};

const renderControlPanels = () => {
    const latencyVal = document.getElementById('current-latency');
    if (latencyVal) latencyVal.textContent = `${State.networkDelay}ms`;

    const errorVal = document.getElementById('current-error');
    if (errorVal) errorVal.textContent = State.simulatedError || 'None';
};

const deleteSingleCookie = (key) => {
    CookieUtils.delete(key);
    showToast(`Deleted cookie: ${key}`, 'info');
    renderCookieTable();
    renderNavbar();
};

const setLatency = (ms) => {
    AutomationHelpers.setNetworkDelay(ms);
    renderControlPanels();
};

const setError = (code) => {
    AutomationHelpers.setSimulatedError(code);
    renderControlPanels();
};

const triggerSetUserAuth = () => {
    AutomationHelpers.setAuthCookies('user@test.com', 'customer', 'Standard User');
    renderCookieTable();
    renderNavbar();
};

const triggerSetAdminAuth = () => {
    AutomationHelpers.setAuthCookies('admin@test.com', 'admin', 'Admin User');
    renderCookieTable();
    renderNavbar();
};

const triggerClearAuth = () => {
    AutomationHelpers.clearAuthCookies();
    renderCookieTable();
    renderNavbar();
};

const triggerSeedCart = () => {
    AutomationHelpers.seedCart([
        { ...MOCK_PRODUCTS[0], quantity: 2 },
        { ...MOCK_PRODUCTS[2], quantity: 1 }
    ]);
};

const triggerClearCart = () => {
    AutomationHelpers.clearCart();
};

const triggerResetSUT = () => {
    if (confirm('Are you sure you want to reset all SUT state? This will clear localStorage and cookies.')) {
        AutomationHelpers.resetSUTState();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderTestDataPage();
});
