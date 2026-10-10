const fs = require('fs');
let checkoutPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');

checkoutPage = checkoutPage.replace(
  /createNewOrder\(orderDetails\);/g,
  `createNewOrder(orderDetails);
          const guestOrders = JSON.parse(localStorage.getItem('guest_orders') || '[]');
          if (!guestOrders.includes(backendOrderId)) {
            guestOrders.push(backendOrderId);
            localStorage.setItem('guest_orders', JSON.stringify(guestOrders));
          }`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', checkoutPage);
console.log('Fixed guest_orders storage');
