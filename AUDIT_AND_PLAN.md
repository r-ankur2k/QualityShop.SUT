# QualityShop SUT - Codebase Audit & Enterprise QA Automation Plan

## Overview & Background
QualityShop SUT (System Under Test) is an enterprise-grade web application built specifically for Quality Assurance (QA) and software test engineers to practice, benchmark, and demonstrate automated End-to-End (E2E) testing using frameworks like **Playwright**, **Cypress**, **Selenium**, and **WebdriverIO**.

The application has been fully transformed from a single-page script into a **traditional multi-page HTML architecture** with robust cookie-based session tracking, deterministic test selectors (`data-test-id`), multi-step checkout state management, real-time order state progression, and an exposed browser test API (`window.QualityShopTestAPI`).

---

## 1. Feature Implementation Status Matrix

| Feature Module | Status | Implementation Summary & Target |
|---|---|---|
| **Multi-Page HTML Architecture** | ✅ Implemented | Traditional page-per-route structure (`login.html`, `products.html`, `cart.html`, `checkout.html`, `orders.html`, `profile.html`, `admin.html`, etc.). |
| **Auth Cookie Gating & Persistence** | ✅ Implemented | Strict `requireAuth()` check enforcing `auth_token`, `user_email`, `user_role`, `session_id`, and `logged_in` cookies with `localStorage` fallback (`js/cookies.js`). |
| **Login Page Store Nav Suppression** | ✅ Implemented | Store links (Products, Wishlist, Contact) are hidden on `login.html` until authenticating. Reference credentials cards displayed. |
| **Saved Details Dropdowns** | ✅ Implemented | Step 1 & 2 checkout form inputs default to blank with `Select Saved Address` & `Select Saved Payment Method` auto-fill selectors. |
| **Promo Code Helper Box** | ✅ Implemented | Cart page promo toggle (`data-test-id="view-available-promos-btn"`) and promo codes info box (`data-test-id="promo-codes-info-box"`). |
| **Real-Time Order State Machine** | ✅ Implemented | Background timer advances order status (`Processing` ➔ `Shipped` ➔ `Delivered` every 7s) with dynamic DOM badge updating without page reloads. |
| **Deterministic `data-test-id` Selectors** | ✅ Implemented | Uniform test attributes across all forms, buttons, tables, badges, and modals. |
| **Global Automation API** | ✅ Implemented | `window.QualityShopTestAPI` programmatic fixture methods (`setAuthCookies`, `seedCart`, `advanceOrderStatus`, `setNetworkDelay`, `setSimulatedError`, `resetSUTState`). |
| **Simulated REST API Interceptor Layer** | ✅ Implemented | Client-side API Mock Layer (`js/api-mock.js`) overriding `fetch` to support direct API automation (`Playwright request`, `cy.request()`, REST Assured, Postman). |
| **API Fault Injection & Status Simulator** | ✅ Implemented | Configurable negative API response status returns (`400 Bad Request`, `401 Unauthorized`, `422 Unprocessable Entity`, `429 Rate Limit`, `500 Internal Error`). |
| **Multi-Second Network Latency Simulator** | ✅ Implemented | Configurable non-blocking network delay up to 30 seconds (`0ms`, `500ms`, `1.5s`, `3.0s`, `5s`, `10s`, `20s`, `30s`) in `test-data.html`. |
| **OpenAPI Spec & Postman Collection** | ✅ Implemented | Downloadable `openapi.json` and interactive Postman Collection export in `test-data.html`. |
| **Visual Failure Banners & Loading Spinners**| ✅ Implemented | Interactive top QA status alert banner, animated button spinners via `withButtonSpinner()`, and REST API console tester. |

---

## 2. Multi-Page HTML Architecture & Navigation Structure

QualityShop SUT enforces client-side authentication gating (`requireAuth()`) across protected routes. Unauthenticated users are redirected to `login.html`.

| Page | File | Auth Required | Status | Description & QA Automation Value |
|---|---|---|---|---|
| **Login** | `login.html` | No | ✅ Implemented | Entry point. Suppresses main store nav links. Displays reference credentials cards and handles session cookie generation (`auth_token`, `user_email`, `user_role`, `logged_in`). |
| **Catalog** | `index.html` / `products.html` | Yes | ✅ Implemented | Product catalog listing, category filtering, search input, price slider, and sorting selector. |
| **Product Detail** | `product-detail.html` | Yes | ✅ Implemented | Deep-linkable product view (`?id=p1`). Includes stock counter, customer reviews list, and interactive review submission modal. |
| **Cart** | `cart.html` | Yes | ✅ Implemented | Shopping cart items table, quantity increment/decrement, item removal, subtotal/shipping/tax calculation, and a test promo code helper (`data-test-id="promo-codes-info-box"`). |
| **Checkout** | `checkout.html` | Yes | ✅ Implemented | Multi-step checkout (Step 1: Shipping, Step 2: Payment, Step 3: Review). Inputs default to blank with auto-fill dropdowns (`data-test-id="saved-address-select"` & `data-test-id="saved-card-select"`). |
| **Receipt** | `order-confirmation.html` | Yes | ✅ Implemented | Order summary receipt displaying generated tracking numbers and status details. |
| **Orders** | `orders.html` | Yes | ✅ Implemented | Customer order history listing with real-time status badges (Processing, Shipped, Delivered) and support ticket creation. |
| **Profile** | `profile.html` | Yes | ✅ Implemented | Account details, saved shipping addresses, saved payment cards, and logout control. |
| **Admin** | `admin.html` | Yes (`admin` role) | ✅ Implemented | Admin inventory management, stock updater, order status toggle, and analytics overview. |
| **Contact** | `contact.html` | Yes | ✅ Implemented | Support ticket contact form supporting file upload attachments (`data-test-id="uploaded-file-name"`) for testing file upload automation. |
| **Test Manager** | `test-data.html` | No | ✅ Implemented | Live Cookie Session Inspector, State Reset, API Latency Simulator, and Error Injection controls. |

---

## 3. Core Shared Modules (`/js/`)

1. **`js/cookies.js`**: `CookieUtils` module supporting both standard HTTP browser cookies (`document.cookie`) and `localStorage` backfills for `file://` local disk protocol testing.
2. **`js/state.js`**: Application state store managing `cart`, `wishlist`, `orders`, and `reviews` synced with browser storage.
3. **`js/components.js`**: Reusable UI components (Navbar, Footer, Toast Notifications) with page-aware link highlighting and authentication check hooks.
4. **`js/automation.js`**: Programmatic test helper API (`window.QualityShopTestAPI`), automated order status progression timer, and URL query parameter state seeder (`?autologin=user`, `?seedCart=true`).
5. **`js/data.js`**: Primary mock datasets (`MOCK_PRODUCTS`, `MOCK_COUPONS`, `MOCK_SAVED_ADDRESSES`, `MOCK_SAVED_PAYMENT_METHODS`).

---

## 4. Standardized Test Selectors (`data-test-id`)

Every key interactive element across QualityShop SUT includes deterministic `data-test-id` attributes:

- **Authentication:** `data-test-id="input-email"`, `data-test-id="input-password"`, `data-test-id="login-submit-btn"`, `data-test-id="remember-me-checkbox"`
- **Navigation:** `data-test-id="nav-link-products"`, `data-test-id="nav-link-cart"`, `data-test-id="nav-cart-badge"`
- **Products & Catalog:** `data-test-id="product-card-{id}"`, `data-test-id="add-to-cart-btn-{id}"`, `data-test-id="search-input"`, `data-test-id="filter-category-select"`
- **Cart & Promo:** `data-test-id="view-available-promos-btn"`, `data-test-id="promo-codes-info-box"`, `data-test-id="promo-code-item-SAVE10"`, `data-test-id="apply-coupon-btn"`
- **Checkout & Saved Selectors:** `data-test-id="saved-address-select"`, `data-test-id="saved-card-select"`, `data-test-id="checkout-step-1-submit"`, `data-test-id="checkout-step-2-submit"`, `data-test-id="place-order-btn"`
- **Orders & Status:** `data-test-id="order-status-badge-{id}"`, `data-test-id="order-id-{id}"`, `data-test-id="file-complaint-btn-{id}"`
- **Reviews & Ratings:** `data-test-id="review-name-input"`, `data-test-id="review-rating-select"`, `data-test-id="review-text-textarea"`, `data-test-id="submit-review-btn"`
- **Support & Uploads:** `data-test-id="attachment"`, `data-test-id="uploaded-file-name"`, `data-test-id="contact-submission-success"`

---

## 5. Global Automation Test API (`window.QualityShopTestAPI`)

Automation frameworks can invoke `window.QualityShopTestAPI` directly in browser scripts:

```javascript
// Set authentication cookies programmatically
window.QualityShopTestAPI.setAuthCookies('user@test.com', 'customer', 'Test User', true);

// Retrieve current auth cookies object
const cookies = window.QualityShopTestAPI.getAuthCookies();

// Seed cart with initial products
window.QualityShopTestAPI.seedCart([
  { id: 'p1', name: 'Premium Noise-Canceling Headphones', price: 299.99, quantity: 1 }
]);

// Clear cart
window.QualityShopTestAPI.clearCart();

// Advance order status programmatically or trigger next lifecycle phase
window.QualityShopTestAPI.advanceOrderStatus('ORD-123456');

// Start/Stop automated background order status advancement timer (every 7s)
window.QualityShopTestAPI.startOrderStatusAutoAdvance(7000);
window.QualityShopTestAPI.stopOrderStatusAutoAdvance();

// Set simulated network latency (in ms)
window.QualityShopTestAPI.setNetworkDelay(1500);

// Inject simulated HTTP error (e.g., 401, 422, 500)
window.QualityShopTestAPI.setSimulatedError(500);

// Reset all application state and cookies
window.QualityShopTestAPI.resetSUTState();
```

---

## 6. API Automation Layer (`js/api-mock.js`)

The API layer is fully active and intercepts client-side network calls for direct API testing:

### A. Client-Side REST API Interceptor (`js/api-mock.js`)

| Method | Endpoint | Status | Description & QA Automation Objective |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | ✅ Implemented | Validates credentials, sets `auth_token` JWT cookie & returns JSON session payload. |
| `POST` | `/api/v1/auth/logout` | ✅ Implemented | Clears authentication tokens and invalidates server-side session. |
| `GET` | `/api/v1/products` | ✅ Implemented | Returns product catalog array with query filter support (`?category=Electronics&search=pro`). |
| `GET` | `/api/v1/products/:id` | ✅ Implemented | Returns single product object or `404 Not Found`. |
| `POST` | `/api/v1/cart/items` | ✅ Implemented | Adds items to cart via API payload `{ productId, quantity }`. |
| `POST` | `/api/v1/checkout/orders` | ✅ Implemented | Processes order creation, returning `201 Created` with order ID & tracking code. |
| `GET` | `/api/v1/orders` | ✅ Implemented | Retrieves user's order history array. |
| `POST` | `/api/v1/support/tickets` | ✅ Implemented | Handles multipart form uploads for screenshot/attachment files. |
| `GET` | `/api/v1/openapi.json` | ✅ Implemented | Dynamic OpenAPI 3.0 specification endpoint. |
| `GET` | `/api/v1/postman_collection.json` | ✅ Implemented | Exposes generated Postman collection payload. |

### B. API Response Fault Injection & Status Code Simulator
Enable testing of negative API response scenarios and resilience assertions:
- **`400 Bad Request`**: Structured JSON field validation errors (`[{ field: "email", message: "Invalid email format" }]`).
- **`401 Unauthorized` / `403 Forbidden`**: Missing or expired `Authorization: Bearer <token>` header validation.
- **`422 Unprocessable Entity`**: Out-of-stock product validation or expired promo code error responses.
- **`429 Too Many Requests`**: Rate limiting simulation for testing retry logic & exponential backoff.
- **`500 Internal Server Error`**: Server crash emulation for testing error handling & retry fallback UI.

### C. OpenAPI Specification & Postman Collection Export
- Interactive **OpenAPI 3.0 / Swagger UI Spec Viewer** accessible via `test-data.html` (`/api/v1/openapi.json`).
- Downloadable **Postman / Bruno API Collection** directly from QualityShop SUT.
