const fs = require('fs');
let file = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', 'utf8');

const injection = `
      try {
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
        }
      } catch(e) {
        console.warn('Failed to parse catalog state json', e);
      }
`;

// Inject right before "let subtotal = 0;"
file = file.replace(/    let subtotal = 0;/g, injection + '\n    let subtotal = 0;');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', file);
console.log('Fixed orderController.js natively');
