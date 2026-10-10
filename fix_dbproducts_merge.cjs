const fs = require('fs');
let orderControl = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', 'utf8');

// Replace the buggy merge logic
orderControl = orderControl.replace(
`           // Add missing default products to dbProducts
           const existingIds = new Set(adminProducts.map(p => p.id));
           dbProducts = [...adminProducts, ...PRODUCTS.filter(p => !existingIds.has(p.id))];`,
`           // Merge admin state with both database products and default PRODUCTS
           const existingIds = new Set(dbProducts.map(p => p.id));
           // Add adminProducts not already in DB
           for (const p of adminProducts) {
             if (!existingIds.has(p.id)) {
               dbProducts.push(p);
               existingIds.add(p.id);
             }
           }
           // Add default PRODUCTS not already in DB or admin
           for (const p of PRODUCTS) {
             if (!existingIds.has(p.id)) {
               dbProducts.push(p);
               existingIds.add(p.id);
             }
           }`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', orderControl);
console.log('Fixed dbProducts merge in orderController.js');
