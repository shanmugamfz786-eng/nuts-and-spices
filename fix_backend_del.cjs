const fs = require('fs');
let orderController = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', 'utf8');
orderController = orderController.replace(/const deliveryCharge = subtotal > 1000 \? 0 : 50;/g, 'const deliveryCharge = 0;');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', orderController);
console.log('Fixed deliveryCharge in backend');
