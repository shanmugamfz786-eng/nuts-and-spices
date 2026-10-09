const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/productController.js', 'utf8');

const target = `    let product = dbProds && dbProds.length > 0 ? dbProds[0] : null;
    if (!product) {
      product = PRODUCTS.find(p => p.id === id);
    }`;

const replacement = `    let product = dbProds && dbProds.length > 0 ? dbProds[0] : null;
    if (!product) {
      product = PRODUCTS.find(p => p.id === id);
    }
    if (!product) {
       try {
         const adminStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_admin_state_json']);
         if (adminStateRows && adminStateRows.length > 0 && adminStateRows[0].setting_value) {
            const parsedState = JSON.parse(adminStateRows[0].setting_value);
            if (parsedState && parsedState.products && parsedState.products.length > 0) {
               product = parsedState.products.find(p => p.id === id);
            }
         }
       } catch(e) {}
    }`;

content = content.replace(target, replacement);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/productController.js', content);
console.log('Fixed getProductById in productController.js');
