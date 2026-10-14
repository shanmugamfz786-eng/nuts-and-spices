import crypto from 'crypto';
import { queryDb } from '../config/db.js';

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

    let customerDetails = {
      name: order.customer_name || 'Guest User',
      phone: order.customer_phone || '9999999999',
      email: order.customer_email || 'guest@nutsandspices.in'
    };

    if (order.customer_json) {
      try {
        const parsed = JSON.parse(order.customer_json);
        if (parsed.name) customerDetails.name = parsed.name;
        if (parsed.phone) customerDetails.phone = parsed.phone;
        if (parsed.email) customerDetails.email = parsed.email;
      } catch (e) {
        // use fallback fields
      }
    }

    const cleanPhone = String(customerDetails.phone).replace(/\D/g, '') || '9999999999';
    const frontendBaseUrl = (process.env.FRONTEND_URL || 'https://www.hajinutsandspices.com').split(',')[0].trim();

    const apiUrl = process.env.CASHFREE_ENV === 'PRODUCTION' 
      ? 'https://api.cashfree.com/pg/orders' 
      : 'https://sandbox.cashfree.com/pg/orders';

    const requestBody = {
      order_id: String(order.id || orderId),
      order_amount: totalAmount.toFixed(2),
      order_currency: 'INR',
      customer_details: {
        customer_id: cleanPhone,
        customer_phone: cleanPhone.slice(-10),
        customer_email: customerDetails.email || 'guest@nutsandspices.in',
        customer_name: customerDetails.name || 'Guest User'
      },
      order_meta: {
        return_url: `${frontendBaseUrl}/order-success?order_id={order_id}`
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

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree Order Creation Error:', data);
      return res.status(500).json({ success: false, message: 'Failed to create payment session.', error: data });
    }

    return res.json({
      success: true,
      paymentSessionId: data.payment_session_id,
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

    const apiUrl = process.env.CASHFREE_ENV === 'PRODUCTION' 
      ? `https://api.cashfree.com/pg/orders/${orderId}` 
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

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
    const orderIdMatches = String(data.order_id) === String(dbOrder.id) || String(data.order_id) === String(dbOrder.order_id);

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
 * Verifies signature using CASHFREE_SECRET_KEY, timestamp and rawBody.
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

    // req.body contains raw Buffer from express.raw()
    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));

    // Cashfree signature verification: HMAC SHA256 of (timestamp + rawBody)
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(timestamp + rawBody)
      .digest('base64');

    if (signature !== expectedSignature) {
      console.warn('Cashfree webhook signature mismatch');
      return res.status(401).send('Invalid signature');
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return res.status(400).send('Invalid JSON payload');
    }

    const { data, type } = payload || {};
    const order = data?.order || data;
    const payment = data?.payment;

    if (order?.order_id) {
      const orderId = order.order_id;
      const orderAmount = order.order_amount;
      const orderStatus = order.order_status;
      const paymentStatus = payment?.payment_status;

      const isPaid = orderStatus === 'PAID' || paymentStatus === 'SUCCESS';

      const dbOrders = await queryDb('SELECT * FROM orders WHERE id = ? OR order_id = ? LIMIT 1', [orderId, orderId]);
      if (dbOrders && dbOrders.length > 0) {
        const dbOrder = dbOrders[0];
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
