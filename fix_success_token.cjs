const fs = require('fs');
let successPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/OrderSuccessPage.jsx', 'utf8');

successPage = successPage.replace(
  /localStorage\.getItem\('token'\)/g,
  `localStorage.getItem('nuts_spices_auth_token')`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/OrderSuccessPage.jsx', successPage);
console.log('Fixed OrderSuccessPage fetch token');
