const fs = require('fs');
let cartPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', 'utf8');

cartPage = cartPage.replace(
  /const token = localStorage\.getItem\('token'\);/g,
  `const token = localStorage.getItem('nuts_spices_auth_token');\n        const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\\/api\\/?$/, '') || '';`
);

cartPage = cartPage.replace(
  /fetch\(import\.meta\.env\.VITE_API_URL \+ '\/api\/orders\/my-orders'/g,
  `fetch(BASE + '/api/orders/my-orders'`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', cartPage);
console.log('Fixed CartPage fetch token and URL');
