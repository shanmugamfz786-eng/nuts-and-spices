const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', 'utf8');

const target = `const backendProduct = dbProducts.find(p => p.id === item.id);`;
const replacement = `const backendProduct = dbProducts.find(p => p.id === (item.productId || item.id));`;

content = content.replace(target, replacement);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', content);
console.log('Fixed orderController item ID');
