const fs = require('fs');

let successPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/OrderSuccessPage.jsx', 'utf8');
successPage = successPage.replace(
  /fetch\(`\$\{API_BASE_URL\}\/orders\/\$\{urlOrderId\}`\)/g,
  `fetch(\`\${API_BASE_URL}/orders/\${urlOrderId}\`, { headers: { 'Authorization': \`Bearer \${token}\` } })`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/OrderSuccessPage.jsx', successPage);

console.log('Fixed OrderSuccessPage auth header');
