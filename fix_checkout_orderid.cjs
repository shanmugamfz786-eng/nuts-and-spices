const fs = require('fs');
let file = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');
file = file.replace(/const orderDetails = \{\s*orderId,\s*customer: formData,/g, 'const orderDetails = {\n            orderId: backendOrderId,\n            customer: formData,');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', file);
console.log('Fixed orderId in CheckoutPage.jsx');
