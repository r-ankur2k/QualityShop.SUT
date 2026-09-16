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

/**
 * Executes a simulated REST API fetch request using the current endpoint, method, and JSON body payload.
 */
const executeApiConsoleTest = async () => {
    const methodEl = document.getElementById('api-test-method');
    const urlEl = document.getElementById('api-test-url');
    const bodyEl = document.getElementById('api-test-body');
    const outputEl = document.getElementById('api-console-output');
    const statusEl = document.getElementById('api-console-status');
    const btnEl = document.getElementById('api-test-run-btn');

    if (!urlEl || !outputEl || !statusEl) return;

    const method = methodEl ? methodEl.value : 'GET';
    const endpoint = urlEl.value.trim();
    const bodyText = bodyEl ? bodyEl.value.trim() : '';

    await withButtonSpinner(btnEl, async () => {
        statusEl.textContent = 'Sending...';
        statusEl.className = 'font-mono text-amber-500 font-bold';

        try {
            const startTime = performance.now();
            const options = { method, headers: { 'Content-Type': 'application/json' } };

            if ((method === 'POST' || method === 'PUT') && bodyText) {
                try {
                    options.body = JSON.stringify(JSON.parse(bodyText));
                } catch (err) {
                    showToast('Invalid Request JSON format', 'error');
                    statusEl.textContent = 'JSON Parse Error';
                    statusEl.className = 'font-mono text-rose-500 font-bold';
                    outputEl.textContent = JSON.stringify({ error: 'Invalid Request JSON payload: ' + err.message }, null, 2);
                    return;
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

/**
 * Loads a predefined sample endpoint preset into the console input controls.
 *
 * @param {string} method - HTTP Method ('GET', 'POST', etc.)
 * @param {string} endpoint - API route path string
 */
const selectConsolePreset = (method, endpoint) => {
    const methodEl = document.getElementById('api-test-method');
    const urlEl = document.getElementById('api-test-url');
    const bodyEl = document.getElementById('api-test-body');

    if (methodEl) methodEl.value = method;
    if (urlEl) urlEl.value = endpoint;

    const sampleBodies = {
        '/api/v1/auth/login': JSON.stringify({ email: 'user@test.com', password: 'user123' }, null, 2),
        '/api/v1/cart/items': JSON.stringify({ productId: 'p1', quantity: 1 }, null, 2),
        '/api/v1/checkout/orders': JSON.stringify({
            items: [{ id: 'p1', name: 'Premium Noise-Canceling Headphones', price: 299.99, quantity: 1 }],
            shippingAddress: { fullName: 'Jane Doe', street: '123 Test St', city: 'Seattle', zip: '98101' },
            paymentMethod: { cardType: 'Visa', cardNumber: '**** **** **** 4242' }
        }, null, 2)
    };

    if (bodyEl) {
        bodyEl.value = sampleBodies[endpoint] || '';
    }

    updateConsoleCodeSnippet();
    showToast(`Loaded preset: ${method} ${endpoint}`, 'info');
};

/**
 * Clears the console payload textarea input.
 */
const clearConsolePayload = () => {
    const bodyEl = document.getElementById('api-test-body');
    if (bodyEl) bodyEl.value = '';
    updateConsoleCodeSnippet();
};

/**
 * Updates the live code snippet preview element based on currently selected method, endpoint, and payload.
 */
const updateConsoleCodeSnippet = () => {
    const methodEl = document.getElementById('api-test-method');
    const urlEl = document.getElementById('api-test-url');
    const bodyEl = document.getElementById('api-test-body');
    const snippetEl = document.getElementById('api-console-code-snippet');

    if (!snippetEl) return;

    const method = methodEl ? methodEl.value : 'GET';
    const endpoint = urlEl ? urlEl.value.trim() : '/api/v1/products';
    const bodyText = bodyEl ? bodyEl.value.trim() : '';

    let code = '';
    if (method === 'GET') {
        code = `const response = await fetch('${endpoint}');\nconst data = await response.json();`;
    } else {
        const payloadStr = bodyText ? bodyText.replace(/\n/g, '\n  ') : '{}';
        code = `const response = await fetch('${endpoint}', {\n  method: '${method}',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(${payloadStr})\n});\nconst data = await response.json();`;
    }

    snippetEl.textContent = code;
};

/**
 * Copies the current automation code snippet preview string to the system clipboard.
 */
const copyCodeSnippet = () => {
    const snippetEl = document.getElementById('api-console-code-snippet');
    if (!snippetEl) return;
    navigator.clipboard.writeText(snippetEl.textContent);
    showToast('Code snippet copied to clipboard', 'success');
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
