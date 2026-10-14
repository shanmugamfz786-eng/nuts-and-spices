# Security & Threat Model: Haji Nuts & Spices

This document outlines the security architecture, threat model, mitigation strategies, and operational checklists implemented across the **Haji Nuts & Spices** web application and backend API.

---

## 1. Threat Model & Mitigations

| Threat | Risk Level | Mitigation Implemented | Source File |
| :--- | :--- | :--- | :--- |
| **Order ID Guessing / Scraping** | High | Replaced sequential IDs with `HNS-<8 random alphanumeric>` tokens using `crypto.randomBytes`. Guest tracking strictly requires `?phone4=XXXX` proof. | `server/controllers/orderController.js`, `server/services/orderService.js` |
| **Client Price / Cart Tampering** | Critical | Recomputation of all line items, variant weights, delivery charges, and coupon discounts against the server database catalog. Client prices are completely ignored. | `server/utils/pricing.js`, `server/controllers/orderController.js` |
| **Cashfree Webhook Forgery** | Critical | Webhook endpoint is mounted with `express.raw({ type: 'application/json' })` before general JSON parsers; verification enforces `crypto.timingSafeEqual` and rejects timestamps > 5 minutes old. | `server/index.js`, `server/services/paymentService.js` |
| **User Enumeration** | Medium | Login endpoint returns a unified generic error (`"Invalid mobile number/email or password."`) regardless of whether user exists or password failed. | `server/controllers/authController.js` |
| **JWT Algorithm Confusion** | High | JWT signing and verification explicitly mandate algorithm `HS256` (`{ algorithms: ['HS256'] }`). | `server/middleware/authMiddleware.js`, `server/controllers/authController.js` |
| **Malicious Media Uploads** | High | Multer limits set to 5MB, 1 file max. Strict MIME-type filter permitting only `image/jpeg`, `image/png`, and `image/webp`. Image deletion strictly constrained to our Cloudinary folder. | `server/routes/uploadRoutes.js` |
| **Brute Force & DoS** | Medium | Rate limiters applied to authentication routes (`authLimiter`), order lookups (`getOrderLimiter`), and general API traffic. `trust proxy = 1` set for accurate client IP detection on Render. | `server/index.js`, `server/routes/orderRoutes.js` |
| **Cross-Site Scripting (XSS)** | Medium | Helmet CSP policies configured allowing only verified origins (Cashfree SDK, Cloudinary CDN). No raw `dangerouslySetInnerHTML` usage in user-rendered components. | `server/index.js`, `src/App.jsx` |

---

## 2. Secrets & Keys Rotation Guide

### 2.1 Rotating `JWT_SECRET`
1. Generate a new cryptographically strong 32+ byte hex key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Update `JWT_SECRET` in the Render Environment Variables dashboard.
3. Deploy the backend service. Active user tokens will be invalidated; users will be redirected to log in seamlessly due to the frontend 401 interceptor.

### 2.2 Rotating Cashfree API Keys
1. Generate a new API Key Pair and Webhook Secret in the Cashfree Merchant Dashboard (`https://merchant.cashfree.com/`).
2. Update `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, and `CASHFREE_WEBHOOK_SECRET` on Render.
3. Verify test orders in Sandbox mode before switching `CASHFREE_ENV=PRODUCTION`.

### 2.3 Rotating Cloudinary Credentials
1. Generate new API credentials in the Cloudinary Console (`Security > Access Keys`).
2. Update `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` on Render.

---

## 3. Security Incident Checklist

If a potential credential leak or vulnerability is reported:
- [ ] **Step 1: Rotate Database Credentials**: Update the TiDB Cloud cluster user password and update `DATABASE_URL` immediately.
- [ ] **Step 2: Invalidate Active JWTs**: Change `JWT_SECRET` on Render to force re-authentication for all active sessions.
- [ ] **Step 3: Audit Webhook Activity**: Check Cashfree logs for unverified signatures or anomalous transactions.
- [ ] **Step 4: Review Cloudinary Assets**: Confirm no unauthorized assets were uploaded or deleted outside the `nuts_and_spices_products` folder.
- [ ] **Step 5: Review Server Access Logs**: Inspect Pino HTTP logs on Render for suspicious IP clusters or rate limit triggers.
