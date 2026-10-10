const fs = require('fs');

let cartPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', 'utf8');
cartPage = cartPage.replace(/cartTotal, deliveryCharge, cartTotal,/g, 'cartTotal,');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', cartPage);

let checkoutPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');
checkoutPage = checkoutPage.replace(/cartTotal, deliveryCharge, cartTotal,/g, 'cartTotal,');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', checkoutPage);

console.log('Fixed duplicate cartTotal');
