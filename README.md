# QualityShop.SUT - Enterprise System Under Test (SUT)

A realistic, enterprise-grade multi-page e-commerce web application built for QA automation engineers, test automation practice, demo scenarios, and training. Optimized for **Playwright**, **Cypress**, **Selenium**, and **WebdriverIO**.

---
<h3 align="center">Created by </h3>
<p align="center">
  <a href="https://github.com/r-ankur2k" target="_blank">
    <img src="https://avatars.githubusercontent.com/u/124512084?v=4" width="100px" alt="Ankur Raj" />
    <br/>
    <h3 align="center">ANKUR RAJ</h3>
  </a>
</p>

---

![Static Badge](https://img.shields.io/badge/Project-Enterprise_SUT-indigo)  ![Status](https://img.shields.io/badge/Status-Active-success)  ![HTML](https://img.shields.io/badge/HTML-5-orange)  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-blue)  ![JavaScript](https://img.shields.io/badge/JavaScript-ES6_Modules-yellow)  ![Automation Ready](https://img.shields.io/badge/QA_Automation-Playwright_%7C_Cypress_%7C_Selenium-emerald)

## Live Site URL -> https://r-ankur2k.github.io/QualityShop.SUT/

---

## Key Enterprise QA Automation Features

1. **Multi-Page Web Architecture:** Real URL page navigation (`/products.html`, `/login.html`, `/cart.html`, `/checkout.html`, `/admin.html`), supporting browser history (Back/Forward), page refreshes, and multi-page state persistence.
2. **Deterministic `data-test-id` Selector Schema:** Every interactive button, input, row, card, and modal carries standardized `data-test-id` attributes for resilient Page Object Model (POM) selector strategy.
3. **Hybrid Cookie Session Persistence:** Built-in `CookieUtils` supporting `http://`/`https://` protocol and fallback storage (`localStorage` + memory) for `file://` local disk test runs.
4. **Network Latency & Delay Simulator:** Inject configurable API latency (0ms, 500ms, 1.5s, 3.0s) via `test-data.html` or console API to test async waiting assertions, loading spinners, and double-click prevention.
5. **HTTP Failure Simulator:** Simulate HTTP error responses (401 Unauthorized, 422 Validation Error, 500 Server Error) to test negative QA assertions and error handling.
6. **Global Test Runner API (`window.QualityShopTestAPI`):** Exposes window-level helpers for programmatic session setup, cart seeding, latency simulation, and state resets directly within Playwright `evaluate()` or Cypress `cy.window()`.
7. **URL State Seeding & Deep Linking:** Pre-condition query parameters (`login.html?autologin=user`, `login.html?autologin=admin`, `products.html?category=Electronics`, `cart.html?seedCart=true`).

---

## Application Page Directory

| Page File | Description & QA Target Features |
|---|---|
| `index.html` / `products.html` | Catalog grid, category filters, price slider, search input, sorting dropdown, wishlist/compare toggles, cart badges. |
| `product-detail.html` | Deep-linkable product detail view (`?id=p1`), image zoom mockup, quantity adjustments, customer reviews submit modal. |
| `login.html` | User authentication form, auth cookie injection, test credentials reference box (`admin@test.com` / `user@test.com`). |
| `cart.html` | Cart table, quantity controls, item removal, promo code discount calculator (`SAVE10`, `OFF20`, `FREESHIP`). |
| `checkout.html` | Multi-step checkout flow (Step 1: Shipping Address, Step 2: Payment Details, Step 3: Order Review). |
| `order-confirmation.html` | Order success receipt, generated tracking ID, summary details. |
| `orders.html` | Customer order history, status badges (`Processing`, `Shipped`, `Delivered`), order tracking status, file complaint button. |
| `wishlist.html` | Saved wishlist items management, bulk move to cart. |
| `compare.html` | Side-by-side product specification comparison table. |
| `profile.html` | Account details, default shipping address management, payment preferences. |
| `contact.html` | Support ticket form with file upload / screenshot attachment (`data-test-id="file-upload-input"`) for testing file upload fixtures. |
| `admin.html` | Admin Dashboard with stock level editor and customer order status update dropdowns (`data-test-id="status-select-{id}"`). |
| `test-data.html` | QA Inspector page with live cookie session viewer, API latency simulator, error code toggles, and state reset buttons. |

---

## Project Structure

```text
QualityShop.SUT/
│── index.html              # Main products catalog page
│── products.html           # Catalog listing with search & filters
│── product-detail.html     # Single product specs & reviews
│── login.html              # Login & cookie session setup
│── cart.html               # Shopping cart management
│── checkout.html           # Multi-step checkout flow
│── order-confirmation.html # Order receipt & tracking
│── orders.html             # Customer order history
│── wishlist.html           # Saved items wishlist
│── compare.html            # Product comparison table
│── profile.html            # Account settings & addresses
│── contact.html            # Support form & file attachment
│── admin.html              # Admin inventory & order management
│── test-data.html          # Test Data Manager & Cookie Inspector
│── js/
│   ├── data.js             # Initial mock products & categories dataset
│   ├── cookies.js          # Hybrid CookieUtils engine (HTTP + file:// support)
│   ├── state.js            # Centralized localStorage & state management
│   ├── components.js       # Reusable Navbar, Footer, Toast, & Modal injectors
│   ├── automation.js       # window.QualityShopTestAPI & window.AutomationHelpers
│   └── pages/              # Page-specific DOM event controllers
│       ├── products.js
│       ├── login.js
│       ├── product-detail.js
│       ├── cart.js
│       ├── checkout.js
│       ├── order-confirmation.js
│       ├── orders.js
│       ├── wishlist.js
│       ├── compare.js
│       ├── profile.js
│       ├── contact.js
│       ├── admin.js
│       └── test-data.js
└── README.md
```

---

## Test Automation Usage Examples

### 1. Playwright (Page Object Model & `data-test-id`)

```typescript
import { test, expect } from '@playwright/test';

test('Add item to cart and verify cart badge', async ({ page }) => {
  await page.goto('https://r-ankur2k.github.io/QualityShop.SUT/products.html');
  await page.click('[data-test-id="add-to-cart-btn-p1"]');
  await expect(page.locator('[data-test-id="nav-cart-badge"]')).toHaveText('1');
});

test('Bypass UI login using QualityShopTestAPI', async ({ page }) => {
  await page.goto('https://r-ankur2k.github.io/QualityShop.SUT/login.html');
  await page.evaluate(() => {
    window.QualityShopTestAPI.setAuthCookies('admin@test.com', 'admin', 'Admin User');
  });
  await page.goto('https://r-ankur2k.github.io/QualityShop.SUT/admin.html');
  await expect(page.locator('[data-test-id="admin-page-title"]')).toBeVisible();
});
```

### 2. Cypress File Upload Testing

```javascript
describe('Contact Support File Upload', () => {
  it('submits support ticket with attached screenshot', () => {
    cy.visit('/contact.html');
    cy.get('[data-test-id="contact-name-input"]').type('QA Tester');
    cy.get('[data-test-id="contact-email-input"]').type('qa@test.com');
    cy.get('[data-test-id="contact-message-textarea"]').type('Found layout defect');
    cy.get('[data-test-id="file-upload-input"]').selectFile('cypress/fixtures/bug.png');
    cy.get('[data-test-id="submit-contact-btn"]').click();
    cy.get('[data-test-id="contact-success-alert"]').should('be.visible');
  });
});
```

---

## Contributing
Pull requests, additional test scenarios, and bug reports are welcome!

---

## License
MIT License - Free for education, commercial test automation training, and QA framework benchmarking.
