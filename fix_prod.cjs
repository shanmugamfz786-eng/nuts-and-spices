const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/productController.js', 'utf8');

const target = `    let products = await queryDb('SELECT * FROM products');

    if (!products || products.length === 0) {
      products = memoryStore.products.length > 0 ? memoryStore.products : PRODUCTS;
    }`;

const replacement = `    let products = await queryDb('SELECT * FROM products');

    if (!products || products.length === 0) {
      products = memoryStore.products.length > 0 ? memoryStore.products : PRODUCTS;
    }

    try {
      const adminStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_admin_state_json']);
      if (adminStateRows && adminStateRows.length > 0 && adminStateRows[0].setting_value) {
         const parsedState = JSON.parse(adminStateRows[0].setting_value);
         if (parsedState && parsedState.products && parsedState.products.length > 0) {
            products = parsedState.products;
         }
      }
    } catch(e) {}`;

content = content.replace(target, replacement);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/productController.js', content);
console.log('Fixed productController.js');
