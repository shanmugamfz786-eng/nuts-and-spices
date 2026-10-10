const fs = require('fs');
let checkoutPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');

checkoutPage = checkoutPage.replace(
  /<span>\{deliveryCharge > 0 \? `\?\$\{deliveryCharge\}` : 'FREE'\}<\/span>/g,
  '<span>FREE</span>'
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', checkoutPage);
console.log('Fixed deliveryCharge reference error in Checkout');
