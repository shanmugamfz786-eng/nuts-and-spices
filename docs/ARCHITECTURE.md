# Architecture & Data Flow Guide: Haji Nuts & Spices

This document outlines the end-to-end architectural flow of the **Haji Nuts & Spices** e-commerce platform across order creation, payment gateway handshakes, webhook event handling, and delivery lifecycle tracking.

---

## 1. System Topology Overview

```mermaid
graph TD
    Client[React 19 Frontend<br/>Vercel] -->|Vercel Rewrites /api/*| Backend[Express Backend<br/>Render.com]
    Backend -->|Parameterized Queries (SSL)| DB[(TiDB Cloud / MySQL)]
    Client -->|Checkout SDK Session| Cashfree[Cashfree Payment Gateway]
    Cashfree -->|HMAC-SHA256 Webhook| Backend
    Backend -->|Images / Cloud Storage| Cloudinary[(Cloudinary CDN)]
```

---

## 2. Order → Payment → Webhook Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer / Guest
    participant Frontend as React 19 Frontend (Vercel)
    participant API as Express API Server (Render)
    participant DB as TiDB Cloud Database
    participant PG as Cashfree Gateway

    Customer->>Frontend: Selects Product Variant & Enters Shipping Details
    Frontend->>API: POST /api/orders (items, customer details, optional coupon)
    Note over API: Pricing Engine re-calculates subtotal against DB catalog.<br/>Tampered client prices are completely ignored.
    API->>DB: INSERT INTO orders (id, status='pending', payment_status='pending')
    DB-->>API: Order Created (e.g. HNS-X9K2LQ8A)
    API-->>Frontend: { success: true, orderId: "HNS-X9K2LQ8A", ... }

    Frontend->>API: POST /api/payment/create-session (orderId, phone4 for guest proof)
    API->>DB: SELECT * FROM orders WHERE id = orderId
    API->>PG: POST /pg/orders (order_amount from DB, customer_id, order_id)
    PG-->>API: { payment_session_id: "session_..." }
    API-->>Frontend: { paymentSessionId: "session_..." }

    Frontend->>PG: Cashfree.checkout({ paymentSessionId })
    Customer->>PG: Completes UPI / Netbanking / Card Payment
    PG-->>Customer: Payment Successful Receipt

    par Webhook Notification (Server-to-Server)
        PG->>API: POST /api/payment/webhook (Raw JSON Buffer + x-webhook-signature)
        Note over API: 1. Verify body is raw Buffer<br/>2. Replay check (timestamp < 5 mins)<br/>3. Timing-safe HMAC-SHA256 compare
        API->>DB: UPDATE orders SET status='confirmed', payment_status='paid' WHERE id=orderId
        API-->>PG: 200 OK (Acknowledged)
    and User Return (Client-Side Verification)
        Frontend->>API: POST /api/payment/verify (orderId, phone4)
        API->>PG: GET /pg/orders/{orderId}/payments
        API->>DB: UPDATE orders SET status='confirmed', payment_status='paid' WHERE id=orderId
        API-->>Frontend: { success: true, isPaid: true }
        Frontend->>Customer: Display OrderSuccessPage with Live Tracking
    end
```

---

## 3. Order Status State Machine

The order lifecycle adheres strictly to the state transition graph defined in `server/services/orderService.js`:

```mermaid
stateDiagram-v2
    [*] --> pending
    pending --> confirmed : Payment Verified / COD Confirmed
    pending --> cancelled : Customer / Admin Cancellation
    confirmed --> shipped : Consignment Dispatched from Hub
    confirmed --> cancelled : Cancelled before dispatch
    shipped --> delivered : Out for Delivery -> Delivered
    delivered --> refunded : Approved Return & Refund
    cancelled --> refund_pending : Paid Order Auto-Flagged for Refund
    refund_pending --> refunded : Bank ARN Settlement
    refunded --> [*]
```

---

## 4. Guest Tracking Security

To protect customers from order enumeration or data scraping:
- **Order IDs**: Generated as random alphanumeric tokens (`HNS-<8 characters>`) with collision retry loops rather than sequential IDs (`HNS-001`, `HNS-002`).
- **Owner vs Guest Isolation**:
  - Registered account owners and admins receive complete order details via JWT bearer tokens.
  - Unauthenticated guests querying `GET /api/orders/:id` **must** provide `?phone4=XXXX` matching the last 4 digits of the phone number associated with the order.
  - Unverified guest requests return 401/403 or sanitized minimal tracking payloads, preventing leak of recipient street addresses or line items.
