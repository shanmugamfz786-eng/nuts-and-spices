import { queryDb, memoryStore } from '../config/db.js';
import { PRODUCTS } from '../../src/data/products.js';

const STORE_WHATSAPP_NUMBER = process.env.STORE_WHATSAPP_NUMBER || '919876543210';

export const createOrder = async (req, res) => {
  try {
    const { customer, items, notes } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.city || !customer.pincode) {
      return res.status(400).json({ success: false, message: 'Missing required customer details (name, phone, address, city, pincode).' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty. Add products before placing order.' });
    }

    const orderNumericId = Math.floor(10000 + Math.random() * 90000);
    const orderId = `NS-${orderNumericId}`;

    // Validate products and calculate total securely from backend catalog
    let dbProducts = await queryDb('SELECT * FROM products');
    if (!dbProducts || dbProducts.length === 0) {
      dbProducts = memoryStore.products.length > 0 ? memoryStore.products : PRODUCTS;
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
      if (qty <= 0 || isNaN(qty)) {
         return res.status(400).json({ success: false, message: 'Invalid quantity.' });
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

    const deliveryCharge = 0;
    const totalAmount = subtotal + deliveryCharge;
    const itemsJson = JSON.stringify(items);

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
        notes || ''
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
    const orders = await queryDb('SELECT * FROM orders ORDER BY created_at DESC');
    const result = (orders && orders.length > 0) ? orders : memoryStore.orders;
    
    res.json({
      success: true,
      count: result.length,
      orders: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
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

    // Enforce ownership
    if (req.user.role !== 'admin') {
      const userPhone = (req.user.phone || '').trim().toLowerCase();
      const userEmail = (req.user.email || '').trim().toLowerCase();
      const orderPhone = (order.phone || '').trim().toLowerCase();
      const orderEmail = (order.email || '').trim().toLowerCase();

      if ((userPhone && userPhone !== orderPhone) && (userEmail && userEmail !== orderEmail)) {
        return res.status(403).json({ success: false, message: 'You are not authorized to view this order.' });
      }
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Allowed: ' + allowedStatuses.join(', ') });
    }

    await queryDb('UPDATE orders SET status = ? WHERE id = ? OR order_id = ?', [status, id, id]);

    const memOrder = memoryStore.orders.find(o => o.id === id || o.orderId === id);
    if (memOrder) memOrder.status = status;

    res.json({
      success: true,
      message: `Order status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
};
