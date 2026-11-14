import crypto from 'crypto';
import { queryDb } from '../config/db.js';

/**
 * Check if the caller is authorized to operate on this order (for payment session creation & verification).
 * If authenticated token is provided, must be admin or order owner (matching phone/email).
 * If guest, must provide phone4 matching the last 4 digits of order phone.
 */
function isOrderPaymentAuthorized(order, req) {
  const orderPhone = (order.phone || '').replace(/\D/g, '').slice(-10);
  const orderEmail = (order.email || '').toLowerCase().trim();

  // If JWT authenticated user is attached
  if (req.user) {
    const role = (req.user.role || '').toLowerCase();
    if (role === 'admin') return true;

    const userPhone = (req.user.phone || '').replace(/\D/g, '').slice(-10);
    const userEmail = (req.user.email || '').toLowerCase().trim();

    if (userPhone && orderPhone && userPhone === orderPhone) return true;
    if (userEmail && orderEmail && userEmail === orderEmail) return true;
    return false;
  }

  // For guest checkout verification, require phone4 matching last 4 digits of order phone
  const phone4 = (req.body?.phone4 || req.query?.phone4 || '').toString().trim();
  if (phone4 && orderPhone.endsWith(phone4)) {
    return true;
  }

  return false;
}

export const createPaymentSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required.' });
    }

    // Load order directly from DB - never trust client-sent amounts or customer info
    const orders = await queryDb('SELECT * FROM orders WHERE id = ? OR order_id = ? LIMIT 1', [orderId, orderId]);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orders[0];

    // Ownership check (or guest phone4 proof)
    if (!isOrderPaymentAuthorized(order, req)) {
      return res.status(403).json({ success: false, message: 'Unauthorized: phone4 or login matching order is required.' });
    }

    // Reject if order is already paid or cancelled
    if (order.payment_status === 'paid') {
      return res.status(400).json({ success: false, message: 'Order is already paid.' });
    }
    if (order.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot process payment for a cancelled order.' });
    }

    const totalAmount = Number(order.total_amount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid order amount.' });
    }

    // Correct schema columns: customer_name, phone, email
    const rawPhone = order.phone || '';
    const cleanPhone = String(rawPhone).replace(/\D/g, '').slice(-10) || '9999999999';
    const customerName = (order.customer_name || 'Guest User').trim();
    const customerEmail = (order.email && order.email.includes('@')) 
      ? order.email.trim() 
      : `${cleanPhone}@nutsandspices.in`;

    // Stable customer ID derived from phone
    const customerId = `cust_${cleanPhone}`;
    const frontendBaseUrl = (process.env.FRONTEND_URL || 'https://www.hajinutsandspices.com').split(',')[0].trim();

    const apiUrl = process.env.CASHFREE_ENV === 'PRODUCTION' 
      ? 'https://api.cashfree.com/pg/orders' 
      : 'https://sandbox.cashfree.com/pg/orders';

    const requestBody = {
      order_id: String(order.id || orderId),
      order_amount: totalAmount.toFixed(2),
      order_currency: 'INR',
      customer_details: {
        customer_id: customerId,
        customer_phone: cleanPhone,
        customer_email: customerEmail,
        customer_name: customerName
      },
      order_meta: {
        return_url: req.body.returnUrl || `${frontendBaseUrl}/order-success?order_id={order_id}`
      }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01'
      },
      body: JSON.stringify(requestBody)
    });

    let data = await response.json();

    if (!response.ok) {
      // If Cashfree order already exists, recover by fetching existing active session or creating fresh retry attempt
      if (data && data.code === 'order_already_exists') {
        console.warn(`Cashfree order ${requestBody.order_id} already exists. Attempting recovery...`);
        try {
          const fetchRes = await fetch(`${apiUrl}/${encodeURIComponent(requestBody.order_id)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-client-id': process.env.CASHFREE_APP_ID,
              'x-client-secret': process.env.CASHFREE_SECRET_KEY,
              'x-api-version': '2023-08-01'
            }
          });
          const existingData = await fetchRes.json();
          if (fetchRes.ok && existingData.payment_session_id && existingData.order_status === 'ACTIVE') {
            console.log('Reusing active Cashfree payment session:', existingData.payment_session_id);
            data = existingData;
          } else {
            // Existing order is expired, paid, or missing session: create fresh Cashfree order with attempt suffix
            const retryOrderId = `${requestBody.order_id}_${Date.now().toString(36).slice(-4).toUpperCase()}`;
            console.warn(`Creating fresh Cashfree order attempt with ID: ${retryOrderId}`);
            const retryRes = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-client-id': process.env.CASHFREE_APP_ID,
                'x-client-secret': process.env.CASHFREE_SECRET_KEY,
                'x-api-version': '2023-08-01'
              },
              body: JSON.stringify({ ...requestBody, order_id: retryOrderId })
            });
            const retryData = await retryRes.json();
            if (retryRes.ok && retryData.payment_session_id) {
              data = retryData;
            } else {
              console.error('Cashfree Retry Order Creation Error:', retryData);
              return res.status(500).json({ success: false, message: 'Failed to create payment session.', error: retryData });
            }
          }
        } catch (fetchErr) {
          console.error('Error recovering duplicate Cashfree order:', fetchErr);
          return res.status(500).json({ success: false, message: 'Failed to create payment session.', error: data });
        }
      } else {
        console.error('Cashfree Order Creation Error:', data);
        return res.status(500).json({ success: false, message: 'Failed to create payment session.', error: data });
      }
    }

    const paymentUrl = data.payments?.url || (
      process.env.CASHFREE_ENV === 'PRODUCTION'
        ? `https://payments.cashfree.com/order/#${data.payment_session_id}`
        : `https://sandbox.cashfree.com/order/#${data.payment_session_id}`
    );

    return res.json({
      success: true,
      paymentSessionId: data.payment_session_id,
      paymentUrl,
      orderId: data.order_id,
      environment: process.env.CASHFREE_ENV === 'PRODUCTION' ? 'production' : 'sandbox'
    });
  } catch (error) {
    console.error('Payment Session Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }

    // Fetch order from DB
    const orders = await queryDb('SELECT * FROM orders WHERE id = ? OR order_id = ? LIMIT 1', [orderId, orderId]);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found in database.' });
    }
    const dbOrder = orders[0];

    // Ownership check (or guest phone4 proof)
    if (!isOrderPaymentAuthorized(dbOrder, req)) {
      return res.status(403).json({ success: false, message: 'Unauthorized: phone4 or login matching order is required.' });
    }

    // If order is already paid, return isPaid: true immediately without second UPDATE
    if (dbOrder.payment_status === 'paid') {
      return res.json({
        success: true,
        isPaid: true,
        status: 'PAID',
        message: 'Order already marked as paid'
      });
    }

    // Use encoded string of dbOrder.id (same ID used at creation)
    const encodedOrderId = encodeURIComponent(String(dbOrder.id));
    const apiUrl = process.env.CASHFREE_ENV === 'PRODUCTION' 
      ? `https://api.cashfree.com/pg/orders/${encodedOrderId}` 
      : `https://sandbox.cashfree.com/pg/orders/${encodedOrderId}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ success: false, message: 'Failed to verify payment with gateway.', error: data });
    }

    // Verify Cashfree order_status === 'PAID' AND Cashfree amount === DB order total_amount
    const isStatusPaid = data.order_status === 'PAID';
    const amountMatches = Math.abs(parseFloat(data.order_amount) - parseFloat(dbOrder.total_amount)) < 0.01;
    const orderIdMatches = String(data.order_id) === String(dbOrder.id) ||
      String(data.order_id) === String(dbOrder.order_id) ||
      String(data.order_id).startsWith(String(dbOrder.id) + '_') ||
      String(data.order_id).startsWith(String(dbOrder.order_id) + '_');

    if (isStatusPaid && amountMatches && orderIdMatches) {
      // Idempotently update order status in DB
      await queryDb(
        "UPDATE orders SET status = CASE WHEN status = 'cancelled' THEN status ELSE 'confirmed' END, payment_status = 'paid' WHERE id = ?",
        [dbOrder.id]
      );

      return res.json({
        success: true,
        isPaid: true,
        status: data.order_status
      });
    }

    return res.json({
      success: true,
      isPaid: false,
      status: data.order_status,
      message: !amountMatches ? 'Payment amount does not match order amount' : 'Payment not completed'
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * Cashfree Webhook Handler
 * Verifies signature using CASHFREE_SECRET_KEY, timestamp, raw Buffer body, and crypto.timingSafeEqual.
 * Reject timestamps older than 5 minutes (replay protection).
 * Idempotent: returns 200 quickly if already processed.
 */
export const handleCashfreeWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!secretKey) {
      console.error('Cashfree webhook error: CASHFREE_SECRET_KEY not set');
      return res.status(500).send('Webhook secret not configured');
    }

    if (!signature || !timestamp) {
      return res.status(400).send('Missing webhook signature or timestamp headers');
    }

    // Reject timestamps older than 5 minutes (300 seconds)
    const tsNum = parseInt(timestamp, 10);
    const nowSec = Math.floor(Date.now() / 1000);
    // Support either second or millisecond timestamps from Cashfree
    const parsedTsSec = tsNum > 100000000000 ? Math.floor(tsNum / 1000) : tsNum;
    if (isNaN(parsedTsSec) || Math.abs(nowSec - parsedTsSec) > 300) {
      return res.status(400).send('Webhook timestamp expired or invalid');
    }

    // REQUIRE Buffer.isBuffer(req.body) - never allow JSON.stringify fallback
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).send('Raw body buffer required for webhook verification');
    }

    const rawBody = req.body.toString('utf8');

    // Expected signature: HMAC SHA256 of (timestamp + rawBody)
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(timestamp + rawBody)
      .digest('base64');

    const signatureBuf = Buffer.from(signature, 'utf8');
    const expectedBuf = Buffer.from(expectedSignature, 'utf8');

    if (signatureBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(signatureBuf, expectedBuf)) {
      console.warn('Cashfree webhook signature mismatch');
      return res.status(401).send('Invalid signature');
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return res.status(400).send('Invalid JSON payload');
    }

    const { data } = payload || {};
    const order = data?.order || data;
    const payment = data?.payment;

    if (order?.order_id) {
      const orderId = order.order_id;
      const orderAmount = order.order_amount;
      const orderStatus = order.order_status;
      const paymentStatus = payment?.payment_status;

      const isPaid = orderStatus === 'PAID' || paymentStatus === 'SUCCESS';
      const baseOrderId = orderId.includes('_') ? orderId.split('_')[0] : orderId;

      const dbOrders = await queryDb('SELECT * FROM orders WHERE id = ? OR order_id = ? OR id = ? OR order_id = ? LIMIT 1', [orderId, orderId, baseOrderId, baseOrderId]);
      if (dbOrders && dbOrders.length > 0) {
        const dbOrder = dbOrders[0];

        // Idempotency: if already paid, return 200 immediately
        if (dbOrder.payment_status === 'paid') {
          return res.status(200).json({ status: 'OK', message: 'Already processed' });
        }

        const amountMatches = !orderAmount || Math.abs(parseFloat(orderAmount) - parseFloat(dbOrder.total_amount)) < 0.01;

        if (isPaid && amountMatches) {
          await queryDb(
            "UPDATE orders SET status = CASE WHEN status = 'cancelled' THEN status ELSE 'confirmed' END, payment_status = 'paid' WHERE id = ?",
            [dbOrder.id]
          );
          console.log(`Cashfree webhook: Order ${orderId} marked as paid`);
        } else if (orderStatus === 'FAILED' || paymentStatus === 'FAILED') {
          await queryDb("UPDATE orders SET payment_status = 'failed' WHERE id = ? AND payment_status != 'paid'", [dbOrder.id]);
        }
      }
    }

    return res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('Cashfree Webhook Handler Error:', error);
    return res.status(500).send('Webhook handler error');
  }
};
