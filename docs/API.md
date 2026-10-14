# API Route Reference & Authentication Matrix

| Method | Endpoint | Auth Required | Role Allowed | Rate Limit | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | No | Public | None | Database connection probe (`SELECT 1`) |
| **GET** | `/api/catalog` | No | Public | None | Optimized storefront product & category catalog |
| **POST**| `/api/catalog` | Yes | `admin` | None | Overwrite/sync catalog across stores |
| **POST**| `/api/auth/register` | No | Public | 15 req / 15 min | Customer account registration |
| **POST**| `/api/auth/login` | No | Public | 15 req / 15 min | Customer & Admin authentication |
| **GET** | `/api/auth/me` | Yes | Any (`customer`, `admin`) | None | Fetch current profile |
| **PUT** | `/api/auth/me` | Yes | Any (`customer`, `admin`) | None | Update current user profile name |
| **GET** | `/api/auth/users` | Yes | `admin` | None | List all registered users |
| **DELETE**| `/api/auth/users/:id` | Yes | `admin` | None | Delete user record |
| **POST**| `/api/orders` | No | Public (Guest & Auth) | 20 req / 15 min | Create order with server-side validation |
| **GET** | `/api/orders` | Yes | `admin` | None | Fetch all store orders |
| **GET** | `/api/orders/my-orders`| Yes | Any (`customer`, `admin`) | None | Fetch logged-in user's orders |
| **GET** | `/api/orders/:id` | Optional | Admin, Owner, or Guest with `?phone4=` | 60 req / 15 min | Safe order lookup / guest tracking |
| **PUT** | `/api/orders/:id/status`| Yes | `admin` | None | Update order fulfillment status |
| **PUT** | `/api/orders/:id/cancel`| Yes | Owner or `admin` | None | Cancel pending/confirmed order |
| **DELETE**| `/api/orders/:id` | Yes | `admin` | None | Delete order record |
| **POST**| `/api/payment/create-session`| Optional | Admin, Owner, or Guest with `phone4` | 30 req / 15 min | Create Cashfree payment session |
| **POST**| `/api/payment/verify` | Optional | Admin, Owner, or Guest with `phone4` | 30 req / 15 min | Idempotently verify Cashfree transaction |
| **POST**| `/api/payment/webhook`| No | Signed Cashfree Webhook | None | Automated Cashfree payment notification |
| **GET** | `/api/products` | No | Public | None | List store products |
| **GET** | `/api/products/:id` | No | Public | None | Single product details |
| **POST**| `/api/products` | Yes | `admin` | None | Create new product |
| **PUT** | `/api/products/:id` | Yes | `admin` | None | Update existing product |
| **DELETE**| `/api/products/:id` | Yes | `admin` | None | Remove product |
| **GET** | `/api/categories` | No | Public | None | List store categories |
| **GET** | `/api/categories/:id` | No | Public | None | Single category details |
| **POST**| `/api/categories` | Yes | `admin` | None | Create category |
| **PUT** | `/api/categories/:id` | Yes | `admin` | None | Update category |
| **DELETE**| `/api/categories/:id` | Yes | `admin` | None | Delete category |
| **POST**| `/api/upload` | Yes | `admin` | None | Upload product/banner image to Cloudinary (5MB max) |
| **POST**| `/api/upload/delete` | Yes | `admin` | None | Remove image from Cloudinary |
| **GET** | `/api/admin/dashboard/stats` | Yes | `admin` | None | Fetch dashboard metrics & summary |
| **POST**| `/api/admin/state` | Yes | `admin` | None | Sync full admin state to database |
| **GET** | `/api/admin/state` | Yes | `admin` | None | Fetch persisted admin state from DB |
| **POST**| `/api/admin/sync-git` | Yes | `admin` | None | Sync catalog to codebase |

*Note: All mutation endpoints (`POST`, `PUT`, `DELETE`) require authorization, with the single necessary exceptions of guest order placement (`POST /api/orders`) and signed webhook ingestion (`POST /api/payment/webhook`).*
