import { queryDb, memoryStore } from '../config/db.js';
import { PRODUCTS } from '../../src/data/products.js';
import { INITIAL_OFFERS, INITIAL_STORE_SETTINGS } from '../../src/data/mockAdminData.js';
import { calculateItemsSubtotal, calculateCouponDiscount, calculateOrderTotals } from '../utils/pricing.js';
import crypto from 'crypto';

const STORE_WHATSAPP_NUMBER = process.env.STORE_WHATSAPP_NUMBER || '919876543210';

export const createOrder = async (req, res) => {
  try {
    const { customer, items, notes } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.city || !customer.pincode) {
      return res.status(400).json({ success: false, message: 'Missing required customer details (name, phone, address, city, pincode).' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty. Add products before placing order.' });
    }

    if (items.length > 50) {
      return res.status(400).json({ success: false, message: 'Too many items in order. Maximum 50 items allowed.' });
    }

    // Generate non-sequential, unpredictable Order ID (HNS-XXXXXXXX with 8 random uppercase alphanumeric chars)
    let orderId = '';
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // omit ambiguous 0, O, 1, I
    let collisionAttempts = 0;

    while (!orderId && collisionAttempts < 5) {
      let code = '';
      for (let i = 0; i < 8; i++) {
        const randIndex = crypto.randomInt(0, charset.length);
        code += charset[randIndex];
      }
      const candidate = `HNS-${code}`;
      const existing = await queryDb('SELECT id FROM orders WHERE id = ? OR order_id = ? LIMIT 1', [candidate, candidate]);
      if (!existing || existing.length === 0) {
        orderId = candidate;
      }
      collisionAttempts++;
    }

    if (!orderId) {
      orderId = `HNS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    }


    // Validate products and calculate total securely from backend catalog
    let dbProducts = await queryDb('SELECT * FROM products');
    if (!dbProducts || dbProducts.length === 0) {
      dbProducts = memoryStore.products.length > 0 ? [...memoryStore.products] : [...PRODUCTS];
    }

    try {
      const adminStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_admin_state_json']);
      if (adminStateRows && adminStateRows.length > 0 && adminStateRows[0].setting_value) {
         const parsedState = JSON.parse(adminStateRows[0].setting_value);
         // Merge admin state with default PRODUCTS to prevent unavailable errors
         if (parsedState && parsedState.products && parsedState.products.length > 0) {
           const adminProducts = parsedState.products;
           // Merge admin state with both database products and default PRODUCTS
           const existingIds = new Set(dbProducts.map(p => p.id));
           // Add adminProducts not already in DB
           for (const p of adminProducts) {
             if (!existingIds.has(p.id)) {
               dbProducts.push(p);
               existingIds.add(p.id);
             }
           }
           // Add default PRODUCTS not already in DB or admin
           for (const p of PRODUCTS) {
             if (!existingIds.has(p.id)) {
               dbProducts.push(p);
               existingIds.add(p.id);
             }
           }
         }
      }
    } catch(e) {
      console.warn('Failed to parse admin state json', e);
    }


      try {
        const catalogStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_catalog_json']);
        if (catalogStateRows && catalogStateRows.length > 0 && catalogStateRows[0].setting_value) {
           const parsedCatalog = JSON.parse(catalogStateRows[0].setting_value);
           if (parsedCatalog && parsedCatalog.products && parsedCatalog.products.length > 0) {
              const existingIds = new Set(dbProducts.map(p => p.id));
              for (const p of parsedCatalog.products) {
                if (!existingIds.has(p.id)) {
                  dbProducts.push(p);
                  existingIds.add(p.id);
                }
              }
           }
        }
      } catch(e) {
        console.warn('Failed to parse catalog state json', e);
      }

    // 1. Calculate and validate items against catalog (strict variant existence check)
    let subtotal = 0;
    let validatedItems = [];
    try {
      const itemsCalc = calculateItemsSubtotal(items, dbProducts);
      subtotal = itemsCalc.subtotal;
      validatedItems = itemsCalc.validatedItems;
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    // Replace request items with validated items for saving
    items.length = 0;
    items.push(...validatedItems);

    // 2. Fetch live active offers & store settings
    let serverOffers = INITIAL_OFFERS;
    let storeSettings = INITIAL_STORE_SETTINGS;

    try {
      const adminStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_admin_state_json']);
      if (adminStateRows && adminStateRows.length > 0 && adminStateRows[0].setting_value) {
        const parsed = JSON.parse(adminStateRows[0].setting_value);
        if (parsed && Array.isArray(parsed.offers) && parsed.offers.length > 0) {
          serverOffers = parsed.offers;
        }
        if (parsed && parsed.storeSettings) {
          storeSettings = parsed.storeSettings;
        }
      }
    } catch (e) {
      console.warn('Failed to parse admin offers state for coupon validation', e);
    }

    // Check past customer orders for one-time coupon redemption rules
    let pastOrders = [];
    try {
      pastOrders = await queryDb('SELECT notes, status FROM orders WHERE phone = ?', [customer.phone]);
    } catch (e) {}

    let discountAmount = 0;
    try {
      const couponCalc = calculateCouponDiscount({
        couponCode: req.body.couponCode,
        subtotal,
        validatedItems,
        serverOffers,
        customerPhone: customer.phone,
        pastCustomerOrders: pastOrders
      });
      discountAmount = couponCalc.discountAmount;
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    // 3. Compute final totals
    const totals = calculateOrderTotals({
      subtotal,
      discountAmount,
      storeSettings
    });

    const deliveryCharge = totals.deliveryCharge;
    const totalAmount = totals.totalAmount;
    const itemsJson = JSON.stringify(validatedItems);

    const rawCouponCode = req.body.couponCode ? req.body.couponCode.trim().toUpperCase() : '';
    const fullNotes = [notes, rawCouponCode ? `Coupon Applied: ${rawCouponCode} (-₹${discountAmount})` : '']
      .filter(Boolean)
      .join(' | ');

    await queryDb(
      `INSERT INTO orders 
      (id, order_id, customer_name, phone, email, address, city, state, pincode, subtotal, delivery_charge, total_amount, status, items_json, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        orderId,
        customer.name,
        customer.phone,
        customer.email || '',
        customer.address,
        customer.city,
        customer.state || 'Tamil Nadu',
        customer.pincode,
        subtotal,
        deliveryCharge,
        totalAmount,
        'pending',
        itemsJson,
        fullNotes
      ]
    );

    const orderRecord = {
      id: orderId,
      orderId,
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address,
      city: customer.city,
      state: customer.state || 'Tamil Nadu',
      pincode: customer.pincode,
      subtotal,
      deliveryCharge,
      totalAmount,
      status: 'pending',
      items,
      notes: notes || '',
      createdAt: new Date()
    };

    memoryStore.orders.unshift(orderRecord);

    // Format WhatsApp message
    let msg = `🛒 *NUTS & SPICES - NEW ORDER*\n`;
    msg += `🆔 *Order ID:* #${orderId}\n`;
    msg += `------------------------------------\n`;
    msg += `👤 *Customer:* ${customer.name}\n`;
    msg += `📞 *Phone:* ${customer.phone}\n`;
    msg += `📍 *Address:* ${customer.address}, ${customer.city} - ${customer.pincode}\n`;
    if (notes) {
      msg += `📝 *Notes:* ${notes}\n`;
    }
    msg += `------------------------------------\n`;
    msg += `📦 *Items Ordered:*\n`;

    items.forEach((item, index) => {
      const lineTotal = item.price * item.quantity;
      msg += `${index + 1}. ${item.name} (${item.weight}) x ${item.quantity} = ₹${lineTotal}\n`;
    });

    msg += `------------------------------------\n`;
    msg += `💰 *Subtotal:* ₹${subtotal.toLocaleString('en-IN')}\n`;
    msg += `🚚 *Delivery:* ₹${deliveryCharge}\n`;
    msg += `💳 *Total Amount:* ₹${totalAmount.toLocaleString('en-IN')}\n`;
    msg += `------------------------------------\n`;
    msg += `Thank you! Please confirm order & delivery timeline.`;

    const whatsAppUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    res.status(201).json({
      success: true,
      message: 'Order saved in database successfully!',
      orderId,
      whatsAppUrl,
      order: orderRecord
    });
  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to save order in database.' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const dbOrders = await queryDb("SELECT * FROM orders ORDER BY CASE WHEN status = 'cancelled' THEN 0 WHEN status = 'refunded' THEN 1 ELSE 2 END, created_at DESC");
    let formattedOrders = [];
    
    if (dbOrders && dbOrders.length > 0) {
      formattedOrders = dbOrders.map(row => {
        let parsedItems = [];
        try {
          parsedItems = typeof row.items_json === 'string' ? JSON.parse(row.items_json) : (row.items_json || []);
        } catch(e) {
          console.error('Failed to parse items_json for order', row.id);
        }
        
        return {
          id: row.id,
          orderId: row.order_id || row.id,
          customerName: row.customer_name,
          phone: row.phone,
          email: row.email,
          address: row.address,
          city: row.city,
          state: row.state,
          pincode: row.pincode,
          subtotal: row.subtotal,
          deliveryCharge: row.delivery_charge,
          totalAmount: row.total_amount,
          total: Number(row.total_amount) || 0,
          status: (row.status || 'pending').toLowerCase(),
          items: parsedItems,
          notes: row.notes,
          date: row.created_at,
          createdAt: row.created_at,
          customer: {
            name: row.customer_name,
            phone: row.phone,
            email: row.email,
            address: row.address,
            city: row.city,
            pincode: row.pincode
          }
        };
      });
    } else {
      formattedOrders = process.env.NODE_ENV !== 'production' ? memoryStore.orders : [];
    }
    
    res.json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders
    });
  } catch (error) {
    console.error('Fetch orders error:', error);
    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({ success: false, message: 'Database service unavailable' });
    }
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await queryDb('DELETE FROM orders WHERE id = ? OR order_id = ?', [id, id]);
    memoryStore.orders = memoryStore.orders.filter(o => o.id !== id && o.orderId !== id);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await queryDb('SELECT * FROM orders WHERE id = ? OR order_id = ?', [id, id]);
    
    let order = orders && orders.length > 0 ? orders[0] : memoryStore.orders.find(o => o.id === id || o.orderId === id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    let formattedOrder = order;
    if (orders && orders.length > 0) {
      const row = orders[0];
      let parsedItems = [];
      try {
        parsedItems = typeof row.items_json === 'string' ? JSON.parse(row.items_json) : (row.items_json || []);
      } catch(e) {}
      
      formattedOrder = {
        id: row.id,
        orderId: row.order_id || row.id,
        customerName: row.customer_name,
        phone: row.phone,
        email: row.email,
        address: row.address,
        city: row.city,
        state: row.state,
        pincode: row.pincode,
        subtotal: row.subtotal,
        deliveryCharge: row.delivery_charge,
        totalAmount: row.total_amount,
        total: Number(row.total_amount) || 0,
        status: (row.status || 'pending').toLowerCase(),
        items: parsedItems,
        notes: row.notes,
        date: row.created_at,
        createdAt: row.created_at,
        customer: {
          name: row.customer_name,
          phone: row.phone,
          email: row.email,
          address: row.address,
          city: row.city,
          pincode: row.pincode
        }
      };
    }

    let isAuthorized = false;
    const orderPhone = (formattedOrder.phone || '').replace(/\D/g, '').slice(-10);
    const orderEmail = (formattedOrder.email || '').toLowerCase().trim();

    if (req.user) {
      const userRole = (req.user.role || '').toLowerCase();
      const userPhone = (req.user.phone || '').replace(/\D/g, '').slice(-10);
      const userEmail = (req.user.email || '').toLowerCase().trim();

      if (userRole === 'admin') {
        isAuthorized = true;
      } else if (userPhone && orderPhone && userPhone === orderPhone) {
        isAuthorized = true;
      } else if (userEmail && orderEmail && userEmail === orderEmail) {
        isAuthorized = true;
      }
    }

    // If caller is an authorized user (owner or admin), return full order
    if (isAuthorized) {
      return res.json({
        success: true,
        order: formattedOrder
      });
    }

    // For unauthenticated / guest tracking, require phone4 matching the last 4 digits of order phone
    const phone4 = (req.query.phone4 || req.body?.phone4 || '').toString().trim();
    if (!phone4 || !orderPhone.endsWith(phone4)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. For guest order tracking, please provide the last 4 digits of your phone number (e.g. ?phone4=1234).'
      });
    }

    // Minimal safe tracking payload: no customer full address, phone or email
    const safeMinimalOrder = {
      id: formattedOrder.id,
      orderId: formattedOrder.orderId,
      status: formattedOrder.status,
      items: formattedOrder.items,
      totalAmount: formattedOrder.totalAmount,
      total: formattedOrder.total,
      createdAt: formattedOrder.createdAt,
      date: formattedOrder.date,
      deliveryCharge: formattedOrder.deliveryCharge,
      subtotal: formattedOrder.subtotal
    };

    return res.json({
      success: true,
      order: safeMinimalOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const normalizedStatus = (status || '').toLowerCase().trim();
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      new: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'shipped', 'cancelled', 'refunded'],
      preparing: ['shipped', 'cancelled', 'refunded'],
      shipped: ['out for delivery', 'delivered', 'refunded'],
      'out for delivery': ['delivered', 'refunded'],
      delivered: ['refunded'],
      cancelled: [],
      refunded: []
    };

    const orders = await queryDb('SELECT * FROM orders WHERE id = ? OR order_id = ? LIMIT 1', [id, id]);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    const currentOrder = orders[0];
    const currentStatus = (currentOrder.status || 'pending').toLowerCase().trim();

    // Idempotent update: same status returns success
    if (currentStatus === normalizedStatus) {
      return res.json({ success: true, message: `Order is already ${normalizedStatus}` });
    }

    const allowedNext = validTransitions[currentStatus] || [];
    if (!allowedNext.includes(normalizedStatus)) {
      return res.status(409).json({
        success: false,
        message: `Invalid order status transition from '${currentStatus}' to '${normalizedStatus}'. Allowed next: ${allowedNext.join(', ') || 'None'}`
      });
    }

    // If order was paid and is cancelled/refunded, update payment_status accordingly
    let paymentStatusUpdateSql = '';
    if ((normalizedStatus === 'cancelled' || normalizedStatus === 'refunded') && currentOrder.payment_status === 'paid') {
      paymentStatusUpdateSql = ", payment_status = 'refund_pending'";
    }

    await queryDb(`UPDATE orders SET status = ? ${paymentStatusUpdateSql} WHERE id = ? OR order_id = ?`, [normalizedStatus, id, id]);

    const memOrder = memoryStore.orders.find(o => o.id === id || o.orderId === id);
    if (memOrder) memOrder.status = normalizedStatus;

    res.json({
      success: true,
      message: `Order status updated to ${normalizedStatus}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userPhone = (req.user.phone || '').trim().toLowerCase();
    const userEmail = (req.user.email || '').trim().toLowerCase();
    
    let query = 'SELECT * FROM orders WHERE phone = ?';
    let params = [userPhone];
    if (userEmail) {
      query += ' OR email = ?';
      params.push(userEmail);
    }
    query += ' ORDER BY created_at DESC';
    
    const dbOrders = await queryDb(query, params);
    
    let formattedOrders = [];
    if (dbOrders && dbOrders.length > 0) {
      formattedOrders = dbOrders.map(row => {
        let parsedItems = [];
        try {
          parsedItems = typeof row.items_json === 'string' ? JSON.parse(row.items_json) : (row.items_json || []);
        } catch(e) {}
        
        return {
          id: row.id,
          orderId: row.order_id || row.id,
          customerName: row.customer_name,
          phone: row.phone,
          email: row.email,
          address: row.address,
          city: row.city,
          state: row.state,
          pincode: row.pincode,
          subtotal: row.subtotal,
          deliveryCharge: row.delivery_charge,
          totalAmount: row.total_amount,
          status: row.status,
          items: parsedItems,
          notes: row.notes,
          createdAt: row.created_at,
          customer: {
            name: row.customer_name,
            phone: row.phone,
            email: row.email,
            address: row.address,
            city: row.city,
            pincode: row.pincode
          }
        };
      });
    }

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user?.email || '';
    const userPhone = req.user?.phone || '';

    // Check if order exists (by id or order_id)
    const orderExists = await queryDb('SELECT * FROM orders WHERE id = ? OR order_id = ?', [id, id]);
    if (!orderExists || orderExists.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orderExists[0];
    const cleanOrderPhone = (order.phone || '').replace(/\D/g, '').slice(-10);
    const cleanUserPhone = userPhone.replace(/\D/g, '').slice(-10);
    const isOwner = (userEmail && order.email && order.email.toLowerCase() === userEmail.toLowerCase()) ||
                    (cleanUserPhone && cleanOrderPhone && cleanOrderPhone === cleanUserPhone);

    if (!isOwner && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this order' });
    }
    
    if (order.status !== 'pending' && order.status !== 'confirmed') {
       return res.status(400).json({ success: false, message: 'Only pending or confirmed orders can be cancelled' });
    }

    let paymentStatusSql = '';
    if (order.payment_status === 'paid') {
      paymentStatusSql = ", payment_status = 'refund_pending'";
    }

    await queryDb(`UPDATE orders SET status = 'cancelled' ${paymentStatusSql} WHERE id = ? OR order_id = ?`, [id, id]);

    // Also update in memoryStore if present
    const memoryIdx = memoryStore.orders.findIndex(o => o.id === id || o.orderId === id);
    if (memoryIdx !== -1) {
      memoryStore.orders[memoryIdx].status = 'cancelled';
      if (order.payment_status === 'paid') {
        memoryStore.orders[memoryIdx].payment_status = 'refund_pending';
      }
    }

    res.json({
      success: true,
      message: order.payment_status === 'paid'
        ? 'Order cancelled successfully. Refund has been initiated.'
        : 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};
