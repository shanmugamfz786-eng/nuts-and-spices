const fs = require('fs');

const mergeLogic = `           if (parsedState && parsedState.products && parsedState.products.length > 0) {
             const adminProducts = parsedState.products;
             const existingIds = new Set(dbProducts.map(p => p.id));
             for (const p of adminProducts) {
               if (!existingIds.has(p.id)) {
                 dbProducts.push(p);
                 existingIds.add(p.id);
               }
             }
             for (const p of PRODUCTS) {
               if (!existingIds.has(p.id)) {
                 dbProducts.push(p);
                 existingIds.add(p.id);
               }
             }
           }
        }

        // ALSO fetch from master_catalog_json which is the source of truth for the public storefront
        const catalogStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_catalog_json']);
        if (catalogStateRows && catalogStateRows.length > 0 && catalogStateRows[0].setting_value) {
           const parsedCatalog = JSON.parse(catalogStateRows[0].setting_value);
           if (parsedCatalog && parsedCatalog.products && parsedCatalog.products.length > 0) {
             const existingIds = new Set(dbProducts.map(p => p.id));
             for (const p of parsedCatalog.products) {
               if (!existingIds.has(p.id)) {
                 dbProducts.push(p);
                 existingIds.add(p.id);
               }
             }
           }
        }`;

let orderControl = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', 'utf8');

// The replacement should happen right after the closing brace of the master_admin_state_json block.
// Wait, I can just replace the whole block up to the catch(e) to be safe.
const targetRegex = /           if \(parsedState && parsedState\.products && parsedState\.products\.length > 0\) \{[\s\S]*?            \}\s*\}/;

orderControl = orderControl.replace(targetRegex, mergeLogic);
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', orderControl);
console.log('Fixed orderController.js');

let productControl = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/productController.js', 'utf8');
const pTargetRegex = /           if \(parsedState && parsedState\.products && parsedState\.products\.length > 0\) \{[\s\S]*?            \}\s*\}/;

const pMergeLogic = `           if (parsedState && parsedState.products && parsedState.products.length > 0) {
              const existingIds = new Set(products.map(p => p.id));
              for (const p of parsedState.products) {
                if (!existingIds.has(p.id)) {
                  products.push(p);
                  existingIds.add(p.id);
                }
              }
           }
        }
        
        const catalogStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_catalog_json']);
        if (catalogStateRows && catalogStateRows.length > 0 && catalogStateRows[0].setting_value) {
           const parsedCatalog = JSON.parse(catalogStateRows[0].setting_value);
           if (parsedCatalog && parsedCatalog.products && parsedCatalog.products.length > 0) {
              const existingIds = new Set(products.map(p => p.id));
              for (const p of parsedCatalog.products) {
                if (!existingIds.has(p.id)) {
                  products.push(p);
                  existingIds.add(p.id);
                }
              }
           }`;

productControl = productControl.replace(pTargetRegex, pMergeLogic);
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/productController.js', productControl);
console.log('Fixed productController.js');

