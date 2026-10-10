const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');

content = content.replace('clearCart();', '');
content = content.replace(`alert('Backend success! Redirecting to Cashfree...'); cashfree.checkout(checkoutOptions); alert('Cashfree checkout function called!');`, `cashfree.checkout(checkoutOptions);`);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', content);
console.log('Fixed CheckoutPage cart clearing and alerts');
