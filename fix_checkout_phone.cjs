const fs = require('fs');
let checkoutPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');

checkoutPage = checkoutPage.replace(
  /<input\s+type="tel"\s+value=\{formData\.phone\}/g,
  `<input type="tel" disabled={!!user?.phone} value={formData.phone}`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', checkoutPage);
console.log('Fixed phone editing in checkout');
