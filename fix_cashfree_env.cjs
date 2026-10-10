const fs = require('fs');
let checkout = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');

checkout = checkout.replace(
`          const cashfree = await load({
            mode: 'production' // or 'sandbox'
          });`,
`          const cashfree = await load({
            mode: import.meta.env.VITE_CASHFREE_ENV === 'PRODUCTION' ? 'production' : 'sandbox'
          });`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', checkout);
console.log('Fixed Cashfree mode');
