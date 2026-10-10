const fs = require('fs');
let productControl = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/productController.js', 'utf8');

productControl = productControl.replace(
`           if (parsedState && parsedState.products && parsedState.products.length > 0) {
              products = parsedState.products;
           }`,
`           if (parsedState && parsedState.products && parsedState.products.length > 0) {
              const existingIds = new Set(products.map(p => p.id));
              for (const p of parsedState.products) {
                if (!existingIds.has(p.id)) {
                  products.push(p);
                  existingIds.add(p.id);
                }
              }
           }`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/productController.js', productControl);
console.log('Fixed products merge in productController.js');
