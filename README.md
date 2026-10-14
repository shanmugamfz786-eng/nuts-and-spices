# Haji Nuts & Spices - Enterprise E-Commerce Platform

[![CI Test & Build Workflow](https://github.com/shanmugamfz786-eng/nuts-and-spices/actions/workflows/ci.yml/badge.svg)](https://github.com/shanmugamfz786-eng/nuts-and-spices/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

An enterprise-grade, high-performance e-commerce platform for gourmet dry fruits, nuts, and exotic spices. Built with **React 19**, **Vite 8**, **Tailwind CSS 4**, **Node.js Express**, **TiDB Cloud (MySQL)**, **Cashfree Payments**, and **Cloudinary CDN**. Deployed on **Vercel** (Frontend) and **Render** (Backend).

---

## Architecture Diagram

```mermaid
graph TD
    User([Customer Browser]) -->|HTTPS| Vercel[Vercel Edge Network - Frontend SPA]
    Vercel -->|/api/* Rewrites| Render[Render.com - Express REST API]
    Render -->|Parameterized SQL (TLS)| TiDB[(TiDB Cloud Serverless)]
    Render -->|HMAC-SHA256 Webhook| Cashfree[Cashfree Payment Gateway]
    Vercel -->|Seamless Checkout SDK| Cashfree
    Render -->|Product & Banner Assets| Cloudinary[(Cloudinary Media CDN)]
```

---

## Key Features

- **Storefront & Catalog**: Instant category filtering, pack weight selector (250g, 500g, 1kg), smart search modal, and live customer reviews.
- **Cart & Dynamic Pricing**: Pure client pricing engine re-validated server-side; supports coupon codes, minimum spend thresholds, and tiered free delivery.
- **Secure Cashfree Checkout**: Pre-payment session creation, client-side SDK integration, and raw-buffer HMAC-SHA256 webhook processing with replay defense.
- **Live Consignment Tracking**: Complete order lifecycle (`pending` → `confirmed` → `shipped` → `delivered` → `refunded`) with AWB copy, printable tax invoices, and cancellation workflows.
- **Executive Admin Portal**: Protected back-office dashboard with live sales metrics, catalog inventory manager, customer registry, and Cloudinary media upload.

---

## Folder Structure

```
├── .github/workflows/ci.yml      # Automated GitHub Actions test & build workflow
├── docs/
│   ├── API.md                   # Complete REST API reference with authentication levels
│   ├── ARCHITECTURE.md          # Data flow diagrams and order lifecycle state machine
│   └── SECURITY.md              # Threat model, secrets rotation guide & incident checklist
├── public/                      # Static assets, sitemap.xml, robots.txt, icons
├── server/                      # Express Backend
│   ├── config/                  # Database pool, Cloudinary config & env validator
│   ├── controllers/             # Thin HTTP route handlers (Auth, Orders, Payment, etc.)
│   ├── middleware/              # Auth, admin, Zod validation, and error handlers
│   ├── routes/                  # Express REST router definitions
│   ├── scripts/                 # Idempotent DB schema migrations (initDb.js)
│   ├── services/                # Encapsulated business services (Order, Payment, Auth)
│   ├── tests/                   # Vitest integration and unit test suite
│   ├── utils/                   # Canonical pricing, currency rounding, and discount math
│   ├── index.js                 # Express server bootstrap & security headers
│   └── package.json             # Backend dependencies & scripts
├── src/                         # React 19 Frontend SPA
│   ├── api/                     # Type-safe API client modules & 401 interceptor
│   ├── components/              # Modular UI components (Navbar, Modals, ProductCards)
│   ├── context/                 # CartContext state provider & store settings
│   ├── data/                    # Clean catalog seed data & store defaults
│   ├── pages/                   # Lazy-loaded route views (Shop, Checkout, Tracking, Admin)
│   ├── tests/                   # Frontend unit tests for cart and pricing logic
│   ├── types/                   # Shared TypeScript definitions (index.d.ts)
│   ├── config.js                # Centralized frontend environment configuration
│   └── App.jsx                  # Root router with ErrorBoundary and Suspense loaders
├── .env.example                 # Exhaustive environment variable template
├── .prettierrc                  # Prettier formatting rules
└── package.json                 # Frontend dependencies & build commands
```

---

## Prerequisites

- **Node.js**: `>= 20.0.0` (LTS recommended, see `.nvmrc`)
- **npm**: `>= 10.0.0`
- **TiDB Cloud / MySQL Server**: With SSL enabled

---

## Local Setup & Quickstart

### 1. Clone & Configure Environment
```bash
git clone https://github.com/shanmugamfz786-eng/nuts-and-spices.git
cd nuts-and-spices

# Copy environment template
cp .env.example .env
cp .env.example server/.env
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Initialize Database
Initialize the database tables and seed sample data:
```bash
cd server
npm run db:init
cd ..
```

### 4. Run Development Servers
```bash
# Terminal 1: Backend API Server (Port 5000)
cd server
npm run dev

# Terminal 2: Frontend Vite Server (Port 5173)
npm run dev
```

Visit `http://localhost:5173` to explore the storefront.

---

## Environment Variables Reference

| Variable Name | Required? | Example Value | Where Used | Purpose |
| :--- | :---: | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Yes | `http://localhost:5000` | Frontend | Target backend API host |
| `VITE_CASHFREE_MODE` | Yes | `SANDBOX` | Frontend | Cashfree SDK mode (`SANDBOX` / `PRODUCTION`) |
| `PORT` | No | `5000` | Backend | HTTP port for Express server |
| `NODE_ENV` | Yes | `development` / `production` | Backend | Environment flag |
| `FRONTEND_URL` | Yes | `http://localhost:5173` | Backend | CORS allowlist (comma-separated) |
| `DATABASE_URL` | Yes | `mysql://user:pass@host:4000/db` | Backend | TiDB Cloud / MySQL connection string |
| `JWT_SECRET` | Yes | *Cryptographic 32+ char hex* | Backend | HS256 secret for JWT token signatures |
| `CASHFREE_APP_ID` | Yes | `TEST_...` | Backend | Cashfree Merchant App ID |
| `CASHFREE_SECRET_KEY` | Yes | `TEST_...` | Backend | Cashfree Merchant Secret Key |
| `CASHFREE_WEBHOOK_SECRET` | Yes | `TEST_...` | Backend | Cashfree HMAC-SHA256 webhook secret |
| `CLOUDINARY_CLOUD_NAME` | Yes | `d...` | Backend | Cloudinary cloud account identifier |
| `CLOUDINARY_API_KEY` | Yes | `123456789...` | Backend | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Yes | `sec_...` | Backend | Cloudinary API Secret |

---

## Scripts & Commands

### Root (Frontend)
- `npm run dev`: Launch Vite local development server
- `npm run build`: Compile production-optimized SPA bundle
- `npm run lint`: Run Oxlint linter across files
- `npm test`: Run frontend unit tests for cart and pricing logic

### Backend (`/server`)
- `npm run dev`: Start backend with nodemon hot reloading
- `npm start`: Start production server (`node index.js`)
- `npm run db:init`: Run idempotent database schema creation and seed
- `npm test`: Run Vitest integration test suite
- `npm test -- --coverage`: Run test suite with V8 code coverage report

---

## Deployment Guide

### Vercel (Frontend)
1. Import the repository root in Vercel.
2. Build Settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Environment Variables:
   - Set `VITE_API_BASE_URL` to your Render backend URL (e.g., `https://nuts-and-spices-dqzp.onrender.com`).
   - Set `VITE_CASHFREE_MODE` (`SANDBOX` or `PRODUCTION`).
4. Ensure `vercel.json` rewrites are present for API proxying and client routing.

### Render (Backend)
1. Create a Web Service pointing to the repository.
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment Variables:
   - Configure all backend variables from `.env.example` in the Render Environment tab.
   - Set `JWT_SECRET` with at least 32 characters.
   - Register the webhook URL in Cashfree Merchant Dashboard:
     `https://<your-render-app>.onrender.com/api/payment/webhook`

---

## Troubleshooting

- **Cashfree Webhook Signature Mismatch**: Ensure `CASHFREE_WEBHOOK_SECRET` on Render matches the secret configured in Cashfree Webhook settings. The raw body parser is mounted in `server/index.js` before `express.json()`.
- **Database Latency on Cold Start**: TiDB Serverless clusters may take ~2 seconds to establish the initial connection pool. Vitest timeouts are set to 15s.
- **Image Upload Failures**: Confirm Cloudinary credentials and verify that the uploaded image is JPEG, PNG, or WebP and does not exceed 5MB.
