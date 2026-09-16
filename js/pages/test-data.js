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
            <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                    <th class="p-3.5">Cookie Name</th>
                    <th class="p-3.5">Cookie Value</th>
                    <th class="p-3.5 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                ${cookieKeys.map(key => `
                    <tr class="hover:bg-slate-50/80 transition" data-test-id="cookie-row-${key}">
                        <td class="p-3.5 font-mono font-bold text-indigo-700">${key}</td>
                        <td class="p-3.5 font-mono text-slate-700 break-all max-w-md" data-test-id="cookie-value-${key}">${cookies[key]}</td>
                        <td class="p-3.5 text-right">
                            <button onclick="deleteSingleCookie('${key}')" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg text-[11px] transition" data-test-id="delete-cookie-btn-${key}">
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
    if (latencyVal) {
        const ms = State.networkDelay || 0;
        const text = ms >= 1000 ? `${(ms / 1000).toFixed(ms % 1000 === 0 ? 0 : 1)}s (${ms}ms)` : `${ms}ms`;
        latencyVal.textContent = text;
    }

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
    renderNavbar();
    const formatted = ms >= 1000 ? `${ms / 1000}s` : `${ms}ms`;
    showToast(`Network latency set to ${formatted}`, 'warning');
};

const setError = (code) => {
    AutomationHelpers.setSimulatedError(code);
    renderControlPanels();
    renderNavbar();
    if (code) {
        showToast(`Forced HTTP error response: ${code}`, 'error');
    } else {
        showToast(`Simulated HTTP errors cleared (200 OK)`, 'success');
    }
};

const triggerSetUserAuth = () => {
    AutomationHelpers.setAuthCookies('user@test.com', 'customer', 'Standard User');
    renderCookieTable();
    renderNavbar();
    showToast('Customer auth cookies injected', 'success');
};

const triggerSetAdminAuth = () => {
    AutomationHelpers.setAuthCookies('admin@test.com', 'admin', 'Admin User');
    renderCookieTable();
    renderNavbar();
    showToast('Admin auth cookies injected', 'success');
};

const triggerClearAuth = () => {
    AutomationHelpers.clearAuthCookies();
    renderCookieTable();
    renderNavbar();
    showToast('All auth cookies cleared', 'info');
};

const triggerSeedCart = () => {
    AutomationHelpers.seedCart([
        { ...MOCK_PRODUCTS[0], quantity: 2 },
        { ...MOCK_PRODUCTS[2], quantity: 1 }
    ]);
};

const triggerClearCart = () => {
    AutomationHelpers.clearCart();
    renderNavbar();
};

const triggerResetSUT = () => {
    if (confirm('Are you sure you want to reset all SUT state? This will clear localStorage and cookies.')) {
        AutomationHelpers.resetSUTState();
    }
};

const executeApiConsoleTest = async () => {
    const selectEl = document.getElementById('api-test-endpoint');
    const outputEl = document.getElementById('api-console-output');
    const statusEl = document.getElementById('api-console-status');
    const btnEl = document.getElementById('api-test-run-btn');

    if (!selectEl || !outputEl || !statusEl) return;

    const val = selectEl.value; // e.g. "GET /api/v1/products"
    const parts = val.split(' ');
    const method = parts[0];
    const endpoint = parts[1];

    await withButtonSpinner(btnEl, async () => {
        statusEl.textContent = 'Sending...';
        statusEl.className = 'font-mono text-amber-500 font-bold';

        try {
            const startTime = performance.now();
            const options = { method, headers: { 'Content-Type': 'application/json' } };

            if (method === 'POST') {
                if (endpoint.includes('/login')) {
                    options.body = JSON.stringify({ email: 'user@test.com', password: 'user123' });
                } else if (endpoint.includes('/checkout')) {
                    options.body = JSON.stringify({ items: State.cart, shippingAddress: { fullName: 'Test User' } });
                }
            }

            const response = await fetch(endpoint, options);
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);

            const json = await response.json();

            statusEl.textContent = `${response.status} ${response.statusText} (${duration}ms)`;
            if (response.ok) {
                statusEl.className = 'font-mono text-emerald-400 font-bold';
            } else {
                statusEl.className = 'font-mono text-rose-400 font-bold';
            }

            outputEl.textContent = JSON.stringify(json, null, 2);
        } catch (e) {
            statusEl.textContent = 'Request Failed';
            statusEl.className = 'font-mono text-rose-500 font-bold';
            outputEl.textContent = JSON.stringify({ error: e.message }, null, 2);
        }
    });
};

const downloadOpenApiSpec = () => {
    const spec = window.QualityShopAPI.getOpenApiSpec();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(spec, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "openapi.json");
    dlAnchorElem.click();
    showToast('Downloaded openapi.json', 'success');
};

const downloadPostmanCollection = () => {
    const col = window.QualityShopAPI.getPostmanCollection();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(col, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "postman_collection.json");
    dlAnchorElem.click();
    showToast('Downloaded postman_collection.json', 'success');
};

document.addEventListener('DOMContentLoaded', () => {
    renderTestDataPage();
});
