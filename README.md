# 🛒 QualityShop.SUT — Enterprise System Under Test (SUT)

A realistic, enterprise-grade multi-page e-commerce web application built for QA automation engineers, test automation practice, framework benchmarking, and training. 

Optimized for **Playwright**, **Cypress**, **Selenium**, **WebdriverIO**, **REST Assured**, and **Postman**.

---

<p align="center">
  <a href="https://github.com/r-ankur2k" target="_blank">
    <img src="https://avatars.githubusercontent.com/u/124512084?v=4" width="90px" style="border-radius: 50%;" alt="Ankur Raj" />
  </a>
  <br />
  <b>Created with ❤️ by <a href="https://github.com/r-ankur2k">ANKUR RAJ</a></b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Project-Enterprise_SUT-indigo?style=for-the-badge" alt="Enterprise SUT" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/QA_Automation-Playwright_%7C_Cypress_%7C_Selenium-emerald?style=for-the-badge" alt="QA Automation" />
  <img src="https://img.shields.io/badge/REST_API-OpenAPI_3.0-blue?style=for-the-badge" alt="REST API" />
</p>

---

> 🌐 **Live Application URL:** [https://r-ankur2k.github.io/QualityShop.SUT/](https://r-ankur2k.github.io/QualityShop.SUT/)  
> 📊 **QA Manager & Test Data Inspector:** [https://r-ankur2k.github.io/QualityShop.SUT/test-data.html](https://r-ankur2k.github.io/QualityShop.SUT/test-data.html)  
> 📖 **OpenAPI 3.0 Specification:** [https://r-ankur2k.github.io/QualityShop.SUT/api/v1/openapi.json](https://r-ankur2k.github.io/QualityShop.SUT/api/v1/openapi.json)

---

## 🚀 Key Enterprise QA Automation Features

1. **Multi-Page Web Architecture:** Real URL page navigation (`/products.html`, `/login.html`, `/cart.html`, `/checkout.html`, `/orders.html`, `/admin.html`), supporting browser history (Back/Forward), page refreshes, and state persistence across routes.
2. **Deterministic `data-test-id` Selector Schema:** Every interactive button, input, row, card, and modal carries standardized `data-test-id` attributes for resilient Page Object Model (POM) selector strategies.
3. **Hybrid Cookie Session Persistence:** Built-in `CookieUtils` supporting `http://`/`https://` protocols and fallback storage (`localStorage` + memory) for local `file://` disk test runs.
4. **Zero-Backend REST API Interceptor (`/api/v1/*`):** Client-side mock API engine (`js/api-mock.js`) intercepting `window.fetch` to support E2E API testing via Playwright `request`, `cy.request()`, REST Assured, and Postman.
5. **Configurable Network Latency Simulator (Up to 30s):** Inject artificial network delays (`0ms`, `500ms`, `1.5s`, `3.0s`, `5s`, `10s`, `20s`, `30s`) to test async waiting assertions, loading spinners, and timeout logic.
6. **HTTP Status Code & Fault Simulator:** Simulate error responses (`400 Bad Request`, `401 Unauthorized`, `422 Unprocessable Entity`, `429 Rate Limit`, `500 Internal Error`) to test negative assertions and UI recovery workflows.
7. **Global Automation API (`window.QualityShopTestAPI`):** Exposes window-level helpers for programmatic auth cookie injection, cart seeding, latency toggles, and state resets directly within test scripts.
8. **URL Query State Seeding & Deep Linking:** Pre-condition state via query parameters (`login.html?autologin=user`, `login.html?autologin=admin`, `cart.html?seedCart=true`).

---

## 📂 Application Page Directory

| Page File | Auth Required | Description & QA Target Features |
|---|:---:|---|
| `login.html` | No | Entry point. Suppresses main store nav. Displays test credentials (`user@test.com` / `admin@test.com`) with autofill buttons. |
| `index.html` / `products.html` | Yes | Catalog grid, category filters, price slider, search input, sorting dropdown, wishlist/compare toggles, cart badges. |
| `product-detail.html` | Yes | Deep-linkable product detail view (`?id=p1`), image zoom mockup, stock counter, reviews list, and review submit modal. |
| `cart.html` | Yes | Shopping cart items table, quantity controls, item removal, promo code calculator (`SAVE10`, `OFF20`, `FREESHIP`), and promo helper box. |
| `checkout.html` | Yes | Multi-step checkout flow (Step 1: Shipping Address, Step 2: Payment Details, Step 3: Order Review) with saved address & card auto-fill dropdowns. |
| `order-confirmation.html` | Yes | Order receipt displaying generated tracking ID and purchase summary. |
| `orders.html` | Yes | Customer order history listing with real-time status progression (`Processing` ➔ `Shipped` ➔ `Delivered`) and support ticket creation. |
| `wishlist.html` | Yes | Saved wishlist items management and bulk move-to-cart controls. |
| `compare.html` | Yes | Side-by-side product specification comparison matrix. |
| `profile.html` | Yes | Account settings, saved shipping addresses, and payment preferences. |
| `contact.html` | Yes | Support ticket contact form supporting file upload attachments (`data-test-id="file-upload-input"`) for testing file fixture uploads. |
| `admin.html` | Yes (`admin`) | Admin Dashboard with stock level editor and customer order status update dropdowns (`data-test-id="status-select-{id}"`). |
| `test-data.html` | No | Live Cookie Session Inspector, State Reset, API Latency Simulator, Error Injection controls, and downloadable OpenAPI spec. |

---

## 🌐 Base URL & REST API Reference

For web & API automation, use the following hosted targets:

- **Base Site URL:** `https://r-ankur2k.github.io/QualityShop.SUT`
- **Base API Domain URI:** `https://r-ankur2k.github.io/QualityShop.SUT/api/v1`

| HTTP Method | Endpoint Path | Description |
|:---:|---|---|
| `POST` | `/api/v1/auth/login` | Authenticate credentials & return session JWT cookie |
| `GET` | `/api/v1/products` | Retrieve catalog product list with query filtering |
| `GET` | `/api/v1/products/:id` | Fetch single product specification by ID |
| `POST` | `/api/v1/cart/items` | Add product item to user shopping cart payload |
| `POST` | `/api/v1/checkout/orders` | Process checkout & generate order tracking receipt |
| `GET` | `/api/v1/orders` | Retrieve user order history array |
| `POST` | `/api/v1/support/tickets` | Submit support ticket with optional attachment |
| `GET` | `/api/v1/openapi.json` | Download OpenAPI 3.0 JSON specification |
| `GET` | `/api/v1/postman_collection.json` | Download Postman Collection JSON export |

---

## 🧪 Test Automation Usage Examples

### 1. Playwright (Page Object Model & Auth Bypass)

```typescript
import { test, expect } from '@playwright/test';

test('Add item to cart with programmatic auth bypass', async ({ page }) => {
  await page.goto('https://r-ankur2k.github.io/QualityShop.SUT/products.html');

  // Bypass UI login using QualityShopTestAPI
  await page.evaluate(() => {
    window.QualityShopTestAPI.setAuthCookies('admin@test.com', 'admin', 'Admin User');
  });

  await page.click('[data-test-id="add-to-cart-btn-p1"]');
  await expect(page.locator('[data-test-id="nav-cart-badge"]')).toHaveText('1');
});
```

### 2. Cypress (File Upload Testing)

```javascript
describe('Contact Support File Upload', () => {
  it('submits support ticket with attached screenshot', () => {
    cy.visit('https://r-ankur2k.github.io/QualityShop.SUT/contact.html');
    cy.get('[data-test-id="contact-name-input"]').type('QA Tester');
    cy.get('[data-test-id="contact-email-input"]').type('qa@test.com');
    cy.get('[data-test-id="contact-message-textarea"]').type('Found layout defect');
    cy.get('[data-test-id="file-upload-input"]').selectFile('cypress/fixtures/bug.png');
    cy.get('[data-test-id="submit-contact-btn"]').click();
    cy.get('[data-test-id="contact-success-alert"]').should('be.visible');
  });
});
```

### 3. API Automation (Playwright Request Context)

```typescript
import { test, expect } from '@playwright/test';

test('API Test: Fetch Products Catalog', async ({ page }) => {
  await page.goto('https://r-ankur2k.github.io/QualityShop.SUT/index.html');

  const response = await page.evaluate(async () => {
    const res = await fetch('https://r-ankur2k.github.io/QualityShop.SUT/api/v1/products');
    return res.json();
  });

  expect(response.products.length).toBeGreaterThan(0);
});
```

---

## 📁 Project Structure

```text
QualityShop.SUT/
├── index.html              # Products catalog & main landing
├── products.html           # Catalog listing with search & filters
├── product-detail.html     # Single product specs & reviews modal
├── login.html              # User authentication & cookie setup
├── cart.html               # Shopping cart & promo calculator
├── checkout.html           # Multi-step shipping & payment flow
├── order-confirmation.html # Order receipt & tracking details
├── orders.html             # Customer order history & real-time badges
├── wishlist.html           # Saved items wishlist
├── compare.html            # Product specification comparison matrix
├── profile.html            # Account settings & address management
├── contact.html            # Support ticket form & file upload fixture
├── admin.html              # Admin stock editor & order manager
├── test-data.html          # Test Data Manager & API Inspector
├── js/
│   ├── data.js             # Initial mock products & dataset
│   ├── cookies.js          # Hybrid CookieUtils engine (HTTP + file://)
│   ├── state.js            # Centralized localStorage & state store
│   ├── api-mock.js         # Client-side REST API Interceptor (/api/v1/*)
│   ├── components.js       # Reusable Navbar, Footer, Toast, & Banners
│   ├── automation.js       # QualityShopTestAPI & State Seeder
│   └── pages/              # Page-specific DOM event logic controllers
└── README.md
```

---

## 🤝 Contributing

Pull requests, extra test scenarios, and bug reports are welcome! Feel free to fork the repository and submit a PR.

---

## 📜 License

MIT License — Free for education, commercial test automation training, and QA framework benchmarking.
