const fs = require('fs');
const path = require('path');

const MOCK_PRODUCTS = [
    { id: 'p1', name: 'Premium Noise-Canceling Headphones', price: 299.99, category: 'Electronics', rating: 4.8, reviews: 124, stock: 45, image: '🎧', description: 'Industry leading noise cancellation.' },
    { id: 'p2', name: 'Ergonomic Office Chair', price: 189.50, category: 'Furniture', rating: 4.5, reviews: 89, stock: 12, image: '🪑', description: 'Comfort for long work hours.' },
    { id: 'p3', name: 'Organic Green Tea Bundle', price: 24.99, category: 'Groceries', rating: 4.9, reviews: 340, stock: 200, image: '🍵', description: 'Sourced directly from Japan.' },
    { id: 'p4', name: '4K Ultra HD Monitor', price: 450.00, category: 'Electronics', rating: 4.6, reviews: 56, stock: 8, image: '🖥️', description: 'Crystal clear display for professionals.' },
    { id: 'p5', name: 'Running Shoes - Speedster', price: 120.00, category: 'Apparel', rating: 4.3, reviews: 210, stock: 50, image: '👟', description: 'Lightweight design for marathon runners.' },
    { id: 'p6', name: 'Smart Fitness Watch', price: 199.99, category: 'Electronics', rating: 4.1, reviews: 78, stock: 30, image: '⌚', description: 'Track your health metrics 24/7.' },
    { id: 'p7', name: 'Minimalist Wooden Desk', price: 350.00, category: 'Furniture', rating: 4.7, reviews: 45, stock: 5, image: '🪵', description: 'Solid oak construction.' },
    { id: 'p8', name: 'Gourmet Coffee Beans', price: 18.99, category: 'Groceries', rating: 4.8, reviews: 560, stock: 150, image: '☕', description: 'Dark roast, arabica beans.' },
    { id: 'p9', name: 'Wireless Mechanical Keyboard', price: 129.99, category: 'Electronics', rating: 4.7, reviews: 88, stock: 25, image: '⌨️', description: 'Tactile switches for typing bliss.' },
    { id: 'p10', name: 'Yoga Mat - Non Slip', price: 35.00, category: 'Sports', rating: 4.4, reviews: 150, stock: 100, image: '🧘', description: 'Eco-friendly material.' },
    { id: 'p11', name: 'Stainless Steel Water Bottle', price: 25.00, category: 'Sports', rating: 4.9, reviews: 500, stock: 300, image: '💧', description: 'Keeps water cold for 24 hours.' },
    { id: 'p12', name: 'Bluetooth Speaker Mini', price: 45.99, category: 'Electronics', rating: 4.2, reviews: 65, stock: 40, image: '🔊', description: 'Powerful sound in a small package.' },
    { id: 'p13', name: 'Leather Wallet', price: 55.00, category: 'Apparel', rating: 4.6, reviews: 90, stock: 60, image: '👛', description: 'Genuine leather, classic design.' },
    { id: 'p14', name: 'Sunglasses - Aviator', price: 89.00, category: 'Apparel', rating: 4.5, reviews: 110, stock: 20, image: '🕶️', description: 'Polarized lenses for UV protection.' },
    { id: 'p15', name: 'Ceramic Plant Pot', price: 22.50, category: 'Home', rating: 4.8, reviews: 45, stock: 15, image: '🪴', description: 'Minimalist design for indoor plants.' },
    { id: 'p16', name: 'Electric Toothbrush', price: 79.99, category: 'Health', rating: 4.9, reviews: 250, stock: 50, image: '🪥', description: 'Removes 10x more plaque.' },
    { id: 'p17', name: 'Air Fryer', price: 129.99, category: 'Home', rating: 4.7, reviews: 180, stock: 30, image: '🍳', description: 'Crispy food with less oil.' },
    { id: 'p18', name: 'Scented Candle', price: 19.99, category: 'Home', rating: 4.6, reviews: 120, stock: 100, image: '🕯️', description: 'Relaxing lavender scent.' },
    { id: 'p19', name: 'Dumbbell Set', price: 49.99, category: 'Sports', rating: 4.8, reviews: 90, stock: 40, image: '🏋️', description: 'Adjustable weights for home gym.' },
    { id: 'p20', name: 'Digital Camera', price: 499.99, category: 'Electronics', rating: 4.5, reviews: 60, stock: 15, image: '📷', description: '24MP sensor for stunning photos.' },
    { id: 'p21', name: 'Hardcover Notebook', price: 12.99, category: 'Office', rating: 4.9, reviews: 300, stock: 200, image: '📓', description: '120 pages of high-quality paper.' },
    { id: 'p22', name: 'Blender', price: 89.99, category: 'Home', rating: 4.6, reviews: 150, stock: 25, image: '🥤', description: 'Perfect for smoothies and shakes.' },
    { id: 'p23', name: 'Gaming Mouse', price: 59.99, category: 'Electronics', rating: 4.7, reviews: 110, stock: 35, image: '🖱️', description: 'High-precision sensor for gaming.' },
    { id: 'p24', name: 'Backpack', price: 69.99, category: 'Apparel', rating: 4.8, reviews: 200, stock: 60, image: '🎒', description: 'Durable and spacious for daily use.' },
    { id: 'p25', name: 'Wall Clock', price: 39.99, category: 'Home', rating: 4.5, reviews: 80, stock: 50, image: '⏰', description: 'Modern design with silent movement.' },
    { id: 'p26', name: 'Desk Lamp', price: 29.99, category: 'Home', rating: 4.6, reviews: 100, stock: 70, image: '💡', description: 'Adjustable LED light for your workspace.' },
    { id: 'p27', name: 'Fountain Pen', price: 45.00, category: 'Office', rating: 4.9, reviews: 180, stock: 40, image: '✒️', description: 'A luxurious writing experience.' }
];

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

const baseDir = path.join(__dirname, '..', 'api', 'v1');

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function writeJsonAndHtml(dirPath, fileNameWithoutExt, data) {
    ensureDir(dirPath);
    const jsonStr = JSON.stringify(data, null, 2);

    // Write .json file (e.g., products.json or p1.json)
    fs.writeFileSync(path.join(dirPath, `${fileNameWithoutExt}.json`), jsonStr, 'utf8');

    // Also write a subfolder with index.html (and index.json) so GitHub Pages serves it on path/ (e.g. /api/v1/products or /api/v1/products/p1)
    const subDir = path.join(dirPath, fileNameWithoutExt);
    ensureDir(subDir);
    fs.writeFileSync(path.join(subDir, 'index.html'), jsonStr, 'utf8');
    fs.writeFileSync(path.join(subDir, 'index.json'), jsonStr, 'utf8');
}

// 1. openapi.json & postman_collection.json
ensureDir(baseDir);
fs.writeFileSync(path.join(baseDir, 'openapi.json'), JSON.stringify(MOCK_OPENAPI_SPEC, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'postman_collection.json'), JSON.stringify(MOCK_POSTMAN_COLLECTION, null, 2), 'utf8');

// 2. /api/v1/products (all products list)
const productsPayload = { count: MOCK_PRODUCTS.length, products: MOCK_PRODUCTS };
writeJsonAndHtml(baseDir, 'products', productsPayload);

// 3. /api/v1/products/:id (individual products p1..p27)
const productsDir = path.join(baseDir, 'products');
MOCK_PRODUCTS.forEach(p => {
    writeJsonAndHtml(productsDir, p.id, p);
});

// 4. /api/v1/cart/items
const cartDir = path.join(baseDir, 'cart');
writeJsonAndHtml(cartDir, 'items', { cart: [] });

// 5. /api/v1/orders
writeJsonAndHtml(baseDir, 'orders', { orders: [] });

console.log('Successfully generated static API files under api/v1/');
