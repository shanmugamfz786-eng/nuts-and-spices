import { queryDb } from '../config/db.js';

export const createPaymentSession = async (req, res) => {
  try {
    const { orderId, amount, customerPhone, customerEmail, customerName } = req.body;

    if (!orderId || !amount || !customerPhone) {
      return res.status(400).json({ success: false, message: 'Missing required fields for payment.' });
    }

    const apiUrl = process.env.CASHFREE_ENV === 'PRODUCTION' 
      ? 'https://api.cashfree.com/pg/orders' 
      : 'https://sandbox.cashfree.com/pg/orders';

    const requestBody = {
      order_id: orderId,
      order_amount: parseFloat(amount).toFixed(2),
      order_currency: 'INR',
      customer_details: {
        customer_id: customerPhone.replace(/\D/g, ''),
        customer_phone: customerPhone,
        customer_email: customerEmail || 'guest@nutsandspices.in',
        customer_name: customerName || 'Guest User'
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL || 'https://localhost:5173'}/order-success?order_id={order_id}`
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

    res.json({
      success: true,
      paymentSessionId: data.payment_session_id,
      orderId: data.order_id
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
      return res.status(500).json({ success: false, message: 'Failed to verify payment.', error: data });
    }

    // Cashfree order_status can be SUCCESS, ACTIVE, PAID, etc.
    const isSuccess = data.order_status === 'PAID';

    if (isSuccess) {
      // Update order status in DB
      await queryDb('UPDATE orders SET status = ?, payment_status = ? WHERE id = ?', ['confirmed', 'paid', orderId]);
    }

    res.json({
      success: true,
      isPaid: isSuccess,
      status: data.order_status
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
