# Haji Nuts & Spices - Gourmet E-Commerce Platform

A high-performance modern e-commerce web application and backend for **Haji Nuts & Spices**, built with React 19, Vite, TailwindCSS, Node.js Express, TiDB Serverless (MySQL-compatible), Cashfree Payments, and Cloudinary.

---

## 🏗️ Architecture & Tech Stack

- **Frontend (`/src`)**:
  - React 19 + Vite 8
  - TailwindCSS v4 + Lucide React icons
  - Cashfree Payment SDK integration
  - Hosted on **Vercel** with automatic rewrites to the backend API (`/api/*`).

- **Backend (`/server`)**:
  - Node.js Express (ES Modules)
  - Database: **TiDB Cloud Serverless** / MySQL-compatible with parameterized queries and SSL support
  - Authentication: JWT (JSON Web Tokens) with role-based access control (`admin`, `customer`)
  - Payment Gateway: **Cashfree Payments** with signature verification and webhook processing
  - Media: **Cloudinary** for catalog and banner image management
  - Hosted on **Render** as a web service.

---

## 📁 Repository Structure

```
.
├── .env.example              # Template for environment configuration
├── vercel.json               # Vercel deployment and API rewrite rules
├── index.html                # Single-page application entry HTML
├── vite.config.js            # Vite configuration
├── package.json              # Frontend client dependencies and scripts
├── public/                   # Static assets, logos, and product images
├── src/                      # React frontend source code
│   ├── api/                  # API client methods with JWT bearer authentication
│   ├── components/           # Reusable UI components & admin panels
│   ├── context/              # Cart and Application state contexts
│   ├── data/                 # Seed products, categories, and constants
│   ├── pages/                # Page views (Catalog, Product Details, Checkout, Admin, etc.)
│   └── services/             # Cloud synchronization services
└── server/                   # Express backend API
    ├── config/               # Database pool and connection configuration
    ├── controllers/          # Request handlers (auth, orders, catalog, payment, etc.)
    ├── middleware/           # JWT authentication, role guards, and rate limiters
    ├── routes/               # API route definitions
    ├── scripts/              # DB migration and initialization script (`initDb.js`)
    └── package.json          # Backend-specific dependencies and scripts
```

---

## ⚙️ Environment Variables

Create `.env` inside `/server` (or the project root for dev convenience) based on `.env.example`:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Backend listening port | `5000` |
| `NODE_ENV` | Application environment (`development` \| `production`) | `development` |
| `JWT_SECRET` | Secret key for signing customer and admin JWT tokens | `your_secret_key` |
| `DB_HOST` | TiDB Cloud / MySQL Host | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` |
| `DB_PORT` | TiDB / MySQL Port | `4000` |
| `DB_USER` | TiDB / MySQL Username | `xxxxxxxx.root` |
| `DB_PASSWORD` | TiDB / MySQL Password | `your_db_password` |
| `DB_NAME` | Database schema name | `nuts_and_spices` |
| `DB_SSL` | Enable TLS/SSL connection (`true` \| `false`) | `true` |
| `STORE_WHATSAPP_NUMBER` | Contact WhatsApp number for order notifications | `919655298540` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret` |
| `CASHFREE_ENV` | Cashfree environment (`TEST` \| `PRODUCTION`) | `TEST` |
| `CASHFREE_APP_ID` | Cashfree App ID | `your_cashfree_app_id` |
| `CASHFREE_SECRET_KEY` | Cashfree Secret Key | `your_cashfree_secret_key` |
| `FRONTEND_URL` | Whitelisted origin(s) for CORS and payment return URL | `http://localhost:5173` |
| `INITIAL_ADMIN_PASSWORD`| Initial admin password for seeding the `usr_admin` user | `your_admin_password` |

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Initialize the Database
Set your TiDB/MySQL credentials in your backend environment and initialize tables and initial seed data:
```bash
cd server
npm run db:init
cd ..
```

### 4. Run the Backend Server
```bash
cd server
npm run dev
# Server will start on http://localhost:5000 (or specified PORT)
```

### 5. Run the Frontend Client
```bash
# In the repository root:
npm run dev
# Vite will launch on http://localhost:5173
```

---

## 🧪 Testing & Code Quality

```bash
# Run backend test suite (unit & security tests)
cd server
npm test

# Run code linter
npm run lint

# Run production frontend build
npm run build
```

---

## 🌐 Production Deployment

- **Frontend (Vercel)**:
  - Framework Preset: `Vite`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Uses `vercel.json` to proxy `/api/*` calls to the Render backend service while serving SPA routes directly.

- **Backend (Render)**:
  - Root Directory: `server`
  - Environment: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Remember to set `NODE_ENV=production`, your `DB_*` TiDB credentials, `JWT_SECRET`, `CASHFREE_*`, and `FRONTEND_URL` in the Render dashboard environment variables.
