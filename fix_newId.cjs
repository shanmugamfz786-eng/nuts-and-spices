const fs = require('fs');
let file = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/productController.js', 'utf8');
file = file.replace(/const newId = id \|\| req\.body\.id \|\| `prod_\d+`;/g, 'const newId = id || req.body.id || `prod_${Date.now()}`;');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/productController.js', file);
console.log('Fixed createProduct newId bug');
