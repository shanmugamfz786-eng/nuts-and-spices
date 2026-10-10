const fs = require('fs');

// 1. Update orderRoutes.js
let routes = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/routes/orderRoutes.js', 'utf8');
routes = routes.replace(
  /router\.get\('\/:id', authMiddleware, getOrderById\);/g,
  `router.get('/my-orders', authMiddleware, getMyOrders);\nrouter.get('/:id', getOrderById);` // Made public
);
// Import getMyOrders
routes = routes.replace(/getOrderById, updateOrderStatus/g, 'getOrderById, updateOrderStatus, getMyOrders');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/routes/orderRoutes.js', routes);

// 2. Update orderController.js
let ctrl = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', 'utf8');

// Add getMyOrders function
const getMyOrdersFunc = `
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
    
    const orders = await queryDb(query, params);
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
`;
ctrl += getMyOrdersFunc;

// Remove auth enforcement from getOrderById since it's now public for guest tracking links
ctrl = ctrl.replace(
  /if \(req\.user\.role !== 'admin'\) \{[\s\S]*?return res\.status\(403\)[\s\S]*?\}\s*\}/g,
  '// Auth enforcement removed so guest users can track their orders using secure Order ID'
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', ctrl);
console.log('Backend routes updated');
