const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');

content = content.replace(`const orderId = 'NS_' + Math.floor(100000 + Math.random() * 900000).toString();`, ``);
content = content.replace(`// Also create the order in DB so it's pending while payment happens
        const orderDetails = {
          orderId,
          customer: formData,
          items: cart,
          total: cartTotal,
          status: 'pending', // Pending payment
          timestamp: new Date().toLocaleString()
        };`, ``);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', content);
console.log('Cleaned up CheckoutPage');
