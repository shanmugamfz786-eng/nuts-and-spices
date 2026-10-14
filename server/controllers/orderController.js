import { queryDb, memoryStore } from '../config/db.js';
import { PRODUCTS } from '../../src/data/products.js';
import { INITIAL_OFFERS, INITIAL_STORE_SETTINGS } from '../../src/data/mockAdminData.js';
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

    
      // Generate secure, unpredictable Order ID (UUID)
          // Generate sequential Order ID (HNS-001, HNS-002, etc.)
    let orderId = 'HNS-001';
    try {
      const lastOrder = await queryDb('SELECT order_id FROM orders WHERE order_id LIKE "HNS-%" ORDER BY CAST(SUBSTRING(order_id, 5) AS UNSIGNED) DESC LIMIT 1');
      if (lastOrder && lastOrder.length > 0 && lastOrder[0].order_id) {
        const lastNum = parseInt(lastOrder[0].order_id.substring(4), 10);
        if (!isNaN(lastNum)) {
          orderId = `HNS-${String(lastNum + 1).padStart(3, '0')}`;
        }
      }
    } catch (e) {
      console.warn('Could not fetch last order ID', e);
      orderId = `HNS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
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

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const backendProduct = dbProducts.find(p => p.id === (item.productId || item.id));
      if (!backendProduct) {
        return res.status(400).json({ success: false, message: `Product '${item.name || item.id}' is unavailable.` });
      }

      // Find the specific weight/variant price
      let productWeights = backendProduct.weights || backendProduct.weights_json || [];
      if (typeof productWeights === 'string') {
        try {
          productWeights = JSON.parse(productWeights);
        } catch(e) {
          console.error("Failed to parse productWeights", e);
          productWeights = [];
        }
      }
      // Try finding variant by label AND price first (to support duplicate labels with different prices)
      let variant = productWeights.find(w => w.label === item.weight && Number(w.price) === Number(item.price));
      if (!variant) {
        variant = productWeights.find(w => w.label === item.weight);
      }
      let realPrice = variant ? variant.price : null;

      // Fallback if weights are differently structured or single price
      if (realPrice === null || realPrice === undefined) {
         if (productWeights.length > 0) {
           realPrice = productWeights[0].price;
         } else if (backendProduct.price) {
           realPrice = backendProduct.price;
         } else {
           return res.status(400).json({ success: false, message: `Pricing error for product '${backendProduct.name}'.` });
         }
      }

      const qty = Number(item.quantity);
      if (qty <= 0 || isNaN(qty) || !Number.isInteger(qty) || qty > 100) {
         return res.status(400).json({ success: false, message: `Invalid quantity for '${backendProduct.name}'. Quantity must be between 1 and 100.` });
      }

      subtotal += (Number(realPrice) * qty);
      
      // Override frontend price with backend validated price
      validatedItems.push({
        ...item,
        price: Number(realPrice),
        name: backendProduct.name // Override frontend name just in case
      });
    }

    // Replace request items with validated items for saving
    items.length = 0;
    items.push(...validatedItems);

    // Ignore any client-sent discountAmount entirely and validate couponCode strictly on server
    let discountAmount = 0;
    const rawCouponCode = typeof req.body.couponCode === 'string' ? req.body.couponCode.trim().toUpperCase() : '';

    if (rawCouponCode) {
      // 1. Fetch live active offers from master_admin_state_json in settings, falling back to INITIAL_OFFERS
      let serverOffers = INITIAL_OFFERS;
      try {
        const adminStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_admin_state_json']);
        if (adminStateRows && adminStateRows.length > 0 && adminStateRows[0].setting_value) {
          const parsed = JSON.parse(adminStateRows[0].setting_value);
          if (parsed && Array.isArray(parsed.offers) && parsed.offers.length > 0) {
            serverOffers = parsed.offers;
          }
        }
      } catch (e) {
        console.warn('Failed to parse admin offers state for coupon validation', e);
      }

      const matchingOffer = serverOffers.find(o => {
        const oCode = (o.code || `HAJI${o.discountPercent}`).trim().toUpperCase();
        return oCode === rawCouponCode;
      });

      if (!matchingOffer) {
        return res.status(400).json({ success: false, message: `Coupon code '${rawCouponCode}' is invalid.` });
      }

      if (matchingOffer.status && matchingOffer.status !== 'ACTIVE') {
        return res.status(400).json({ success: false, message: `Coupon '${rawCouponCode}' is inactive or expired.` });
      }

      // Check date validity if start/end dates exist
      const todayStr = new Date().toISOString().split('T')[0];
      if (matchingOffer.startDate && todayStr < matchingOffer.startDate) {
        return res.status(400).json({ success: false, message: `Coupon '${rawCouponCode}' is not active yet.` });
      }
      if (matchingOffer.endDate && todayStr > matchingOffer.endDate) {
        return res.status(400).json({ success: false, message: `Coupon '${rawCouponCode}' has expired.` });
      }

      const minSpend = Number(matchingOffer.minOrderAmount) || 0;
      if (subtotal < minSpend) {
        return res.status(400).json({ 
          success: false, 
          message: `Minimum order value of ₹${minSpend} required for coupon '${rawCouponCode}'. (Current: ₹${subtotal})` 
        });
      }

      // Compute discount based on category restriction if applicable
      const applicableCat = matchingOffer.applicableCategory;
      let eligibleSubtotal = subtotal;

      if (applicableCat && applicableCat !== 'all') {
        eligibleSubtotal = validatedItems
          .filter(it => it.categoryId === applicableCat || it.category === applicableCat)
          .reduce((sum, it) => sum + (Number(it.price) * Number(it.quantity)), 0);

        if (eligibleSubtotal === 0) {
          return res.status(400).json({ 
            success: false, 
            message: `Coupon '${rawCouponCode}' is only valid on ${matchingOffer.applicableCategoryName || 'eligible'} items.` 
          });
        }
      }

      const discountPct = Number(matchingOffer.discountPercent) || 0;
      discountAmount = Math.max(0, Math.round((eligibleSubtotal * discountPct) / 100));
    }

    // Determine delivery charge server-side from settings
    let deliveryCharge = 0;
    try {
      const adminStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_admin_state_json']);
      if (adminStateRows && adminStateRows.length > 0 && adminStateRows[0].setting_value) {
        const parsed = JSON.parse(adminStateRows[0].setting_value);
        if (parsed && parsed.storeSettings) {
          const freeThreshold = Number(parsed.storeSettings.freeDeliveryThreshold) || 1499;
          const standardCharge = Number(parsed.storeSettings.standardDeliveryFee) || 0;
          deliveryCharge = (subtotal >= freeThreshold) ? 0 : standardCharge;
        }
      }
    } catch {}

    const totalAmount = Math.max(0, subtotal - discountAmount + deliveryCharge);
    const itemsJson = JSON.stringify(items);

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
      formattedOrders = memoryStore.orders;
    }
    
    res.json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders
    });
  } catch (error) {
    console.error('Fetch orders error:', error);
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
    if (req.user) {
      const userRole = (req.user.role || '').toLowerCase();
      const userPhone = (req.user.phone || '').replace(/\D/g, '').slice(-10);
      const userEmail = (req.user.email || '').toLowerCase().trim();
      const orderPhone = (formattedOrder.phone || '').replace(/\D/g, '').slice(-10);
      const orderEmail = (formattedOrder.email || '').toLowerCase().trim();

      if (userRole === 'admin') {
        isAuthorized = true;
      } else if (userPhone && orderPhone && userPhone === orderPhone) {
        isAuthorized = true;
      } else if (userEmail && orderEmail && userEmail === orderEmail) {
        isAuthorized = true;
      }
    }

    // If not authorized (guest lookup or non-owner), return only minimal safe tracking payload
    if (!isAuthorized) {
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
    }

    res.json({
      success: true,
      order: formattedOrder
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
    const allowedStatuses = ['pending', 'new', 'confirmed', 'preparing', 'shipped', 'out for delivery', 'delivered', 'cancelled', 'refunded'];
    if (!normalizedStatus || !allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Allowed: ' + allowedStatuses.join(', ') });
    }

    await queryDb('UPDATE orders SET status = ? WHERE id = ? OR order_id = ?', [normalizedStatus, id, id]);

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
       return res.status(400).json({ success: false, message: 'Only pending or confirmed orders can be cancelled by user' });
    }

    await queryDb('UPDATE orders SET status = ? WHERE id = ? OR order_id = ?', ['cancelled', id, id]);

    // Also update in memoryStore if present
    const memoryIdx = memoryStore.orders.findIndex(o => o.id === id || o.orderId === id);
    if (memoryIdx !== -1) {
      memoryStore.orders[memoryIdx].status = 'cancelled';
    }

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};
