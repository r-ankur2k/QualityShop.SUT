// --- REST API Interceptor & Mock Server Layer for E2E Automation Testing ---

const MOCK_OPENAPI_SPEC = {
    openapi: "3.0.3",
    info: {
        title: "QualityShop SUT REST API",
        description: "Enterprise SUT API automation layer supporting direct HTTP test suites (Playwright request context, Cypress cy.request, Postman, REST Assured).",
        version: "1.0.0"
    },
    servers: [
        { url: "/api/v1", description: "Local Mock Server" }
    ],
    paths: {
        "/auth/login": {
            post: {
                summary: "Authenticate User Session",
                description: "Authenticates credentials and sets session auth cookies.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", example: "user@test.com" },
                                    password: { type: "string", example: "user123" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Login successful with token & user profile" },
                    "400": { description: "Bad Request - Missing or invalid payload" },
                    "401": { description: "Unauthorized - Invalid credentials" }
                }
            }
        },
        "/auth/logout": {
            post: {
                summary: "Invalidate Session Tokens",
                responses: {
                    "200": { description: "Logged out successfully" }
                }
            }
        },
        "/products": {
            get: {
                summary: "Get Product Catalog",
                parameters: [
                    { name: "category", in: "query", schema: { type: "string" } },
                    { name: "search", in: "query", schema: { type: "string" } },
                    { name: "sort", in: "query", schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "List of products" }
                }
            }
        },
        "/products/{id}": {
            get: {
                summary: "Get Product By ID",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Product detail object" },
                    "404": { description: "Product not found" }
                }
            }
        },
        "/cart/items": {
            get: {
                summary: "Get Cart Items",
                responses: { "200": { description: "Current cart contents" } }
            },
            post: {
                summary: "Add Item to Cart",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    productId: { type: "string", example: "p1" },
                                    quantity: { type: "integer", example: 1 }
                                }
                            }
                        }
                    }
                },
                responses: { "200": { description: "Updated cart" } }
            },
            delete: {
                summary: "Clear Cart",
                responses: { "200": { description: "Cart emptied" } }
            }
        },
        "/checkout/orders": {
            post: {
                summary: "Create New Order",
                responses: {
                    "201": { description: "Order created successfully" },
                    "422": { description: "Unprocessable Entity - Out of stock or invalid payment" }
                }
            }
        },
        "/orders": {
            get: {
                summary: "Get User Orders",
                responses: { "200": { description: "User order history" } }
            }
        },
        "/support/tickets": {
            post: {
                summary: "Submit Support Ticket",
                responses: { "201": { description: "Ticket created" } }
            }
        }
    }
};

const MOCK_POSTMAN_COLLECTION = {
    info: {
        name: "QualityShop SUT API Collection",
        description: "Postman Collection for QualityShop SUT API endpoints",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [
        {
            name: "Auth - Login",
            request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: {
                    mode: "raw",
                    raw: JSON.stringify({ email: "user@test.com", password: "user123" }, null, 2)
                },
                url: { raw: "{{baseUrl}}/api/v1/auth/login" }
            }
        },
        {
            name: "Products - Get Catalog",
            request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/v1/products?category=Electronics" }
            }
        },
        {
            name: "Cart - Add Item",
            request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: {
                    mode: "raw",
                    raw: JSON.stringify({ productId: "p1", quantity: 1 }, null, 2)
                },
                url: { raw: "{{baseUrl}}/api/v1/cart/items" }
            }
        },
        {
            name: "Checkout - Place Order",
            request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: {
                    mode: "raw",
                    raw: JSON.stringify({
                        shippingAddress: { fullName: "Test User", street: "123 QA St", city: "Test City" },
                        paymentMethod: { cardName: "Test User", cardNumber: "**** 4242" }
                    }, null, 2)
                },
                url: { raw: "{{baseUrl}}/api/v1/checkout/orders" }
            }
        }
    ]
};

// Original fetch store
const _originalFetch = window.fetch;

// Client API Helper Interface
window.QualityShopAPI = {
    login: async (email, password) => {
        const res = await window.fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },
    logout: async () => {
        const res = await window.fetch('/api/v1/auth/logout', { method: 'POST' });
        return res.json();
    },
    getProducts: async (filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        const res = await window.fetch(`/api/v1/products${query ? '?' + query : ''}`);
        return res.json();
    },
    getProductById: async (id) => {
        const res = await window.fetch(`/api/v1/products/${id}`);
        return res.json();
    },
    addToCart: async (productId, quantity = 1) => {
        const res = await window.fetch('/api/v1/cart/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity })
        });
        return res.json();
    },
    createOrder: async (orderPayload = {}) => {
        const res = await window.fetch('/api/v1/checkout/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });
        return res.json();
    },
    getOrders: async () => {
        const res = await window.fetch('/api/v1/orders');
        return res.json();
    },
    getOpenApiSpec: () => MOCK_OPENAPI_SPEC,
    getPostmanCollection: () => MOCK_POSTMAN_COLLECTION
};

// Window fetch interceptor for /api/v1/*
window.fetch = async function (resource, options = {}) {
    const url = typeof resource === 'string' ? resource : (resource ? resource.url : '');

    // Pass-through non-API requests to standard browser fetch
    if (!url || !url.includes('/api/v1')) {
        return _originalFetch.apply(this, arguments);
    }

    // Apply artificial network delay if configured
    if (State.networkDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, State.networkDelay));
    }

    // Simulated HTTP Error Injection Check
    if (State.simulatedError) {
        const code = parseInt(State.simulatedError, 10);
        const errorMessages = {
            400: { error: "Bad Request", message: "Invalid payload parameters provided", errors: [{ field: "email", message: "Invalid email format" }] },
            401: { error: "Unauthorized", message: "Missing or invalid authentication token header" },
            422: { error: "Unprocessable Entity", message: "Selected product is out of stock or coupon has expired" },
            429: { error: "Too Many Requests", message: "Rate limit exceeded. Please try again after 60 seconds", retryAfter: 60 },
            500: { error: "Internal Server Error", message: "Simulated backend database connection failure" }
        };

        const payload = errorMessages[code] || { error: "Simulated Error", message: `HTTP status code ${code} forced` };

        return new Response(JSON.stringify({ status: code, ...payload }), {
            status: code,
            statusText: payload.error || "Error",
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Handle Mock Endpoints
    const method = (options.method || 'GET').toUpperCase();
    const cleanUrl = url.split('?')[0];
    const params = new URLSearchParams(url.split('?')[1] || '');

    // 1. Auth Login
    if (cleanUrl.endsWith('/api/v1/auth/login') && method === 'POST') {
        let body = {};
        try { body = JSON.parse(options.body || '{}'); } catch (e) {}

        const email = body.email || 'user@test.com';
        const role = email.includes('admin') ? 'admin' : 'customer';
        const name = role === 'admin' ? 'Admin User' : 'Standard User';

        CookieUtils.set('auth_token', `Bearer_mock_jwt_${Date.now()}`, 7);
        CookieUtils.set('user_email', email, 7);
        CookieUtils.set('user_role', role, 7);
        CookieUtils.set('user_name', name, 7);
        CookieUtils.set('logged_in', 'true', 7);

        State.user = { uid: 'mock-' + email.replace(/[^a-zA-Z0-9]/g, ''), email, displayName: name, role, name };

        return new Response(JSON.stringify({
            success: true,
            token: `Bearer_mock_jwt_${Date.now()}`,
            user: State.user,
            session_id: `sess_${Date.now()}`
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // 2. Auth Logout
    if (cleanUrl.endsWith('/api/v1/auth/logout') && method === 'POST') {
        CookieUtils.clearAuth();
        State.user = null;
        return new Response(JSON.stringify({ success: true, message: "Logged out successfully" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 3. Products List
    if (cleanUrl.endsWith('/api/v1/products') && method === 'GET') {
        const category = params.get('category');
        const search = (params.get('search') || '').toLowerCase();
        let list = [...MOCK_PRODUCTS];

        if (category && category !== 'All') {
            list = list.filter(p => p.category === category);
        }
        if (search) {
            list = list.filter(p => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
        }

        return new Response(JSON.stringify({ count: list.length, products: list }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 4. Product Detail
    if (cleanUrl.match(/\/api\/v1\/products\/([^\/]+)$/) && method === 'GET') {
        const productId = cleanUrl.split('/').pop();
        const product = MOCK_PRODUCTS.find(p => p.id === productId);

        if (!product) {
            return new Response(JSON.stringify({ error: "Not Found", message: `Product ${productId} not found` }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(product), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 5. Cart Operations
    if (cleanUrl.endsWith('/api/v1/cart/items')) {
        if (method === 'GET') {
            return new Response(JSON.stringify({ cart: State.cart }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        if (method === 'POST') {
            let body = {};
            try { body = JSON.parse(options.body || '{}'); } catch(e) {}
            const product = MOCK_PRODUCTS.find(p => p.id === body.productId);
            if (product) {
                const existing = State.cart.find(i => i.id === product.id);
                if (existing) {
                    existing.quantity += (body.quantity || 1);
                } else {
                    State.cart.push({ ...product, quantity: body.quantity || 1 });
                }
                saveCartToStorage();
            }
            return new Response(JSON.stringify({ success: true, cart: State.cart }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        if (method === 'DELETE') {
            State.cart = [];
            saveCartToStorage();
            return new Response(JSON.stringify({ success: true, cart: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
    }

    // 6. Checkout Orders
    if (cleanUrl.endsWith('/api/v1/checkout/orders') && method === 'POST') {
        let body = {};
        try { body = JSON.parse(options.body || '{}'); } catch(e) {}

        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        const trackingNumber = 'TRK-' + Math.floor(100000 + Math.random() * 900000);
        const items = body.items || State.cart;
        const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        const newOrder = {
            id: orderId,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Processing',
            trackingNumber: trackingNumber,
            items: items,
            shippingAddress: body.shippingAddress || { fullName: 'Test Customer', street: '123 Test St', city: 'Test City' },
            paymentMethod: body.paymentMethod || { cardName: 'Test Customer', cardNumber: '•••• 4242' },
            total: total
        };

        State.orders.unshift(newOrder);
        saveOrdersToStorage();
        State.cart = [];
        saveCartToStorage();

        return new Response(JSON.stringify({
            success: true,
            status: 201,
            message: "Order created successfully",
            order: newOrder
        }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }

    // 7. Get Orders
    if (cleanUrl.endsWith('/api/v1/orders') && method === 'GET') {
        return new Response(JSON.stringify({ orders: State.orders }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // 8. Support Tickets
    if (cleanUrl.endsWith('/api/v1/support/tickets') && method === 'POST') {
        return new Response(JSON.stringify({
            success: true,
            status: 201,
            ticketId: 'TCK-' + Math.floor(100000 + Math.random() * 900000),
            message: "Support ticket created successfully"
        }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }

    // 9. OpenAPI Spec
    if (cleanUrl.endsWith('/api/v1/openapi.json')) {
        return new Response(JSON.stringify(MOCK_OPENAPI_SPEC), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // 10. Postman Collection
    if (cleanUrl.endsWith('/api/v1/postman_collection.json')) {
        return new Response(JSON.stringify(MOCK_POSTMAN_COLLECTION), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: "Not Found", message: `Endpoint ${cleanUrl} not found` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
    });
};
