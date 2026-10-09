const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', 'utf8');

const target = `const adminStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = 'master_admin_state_json'");`;
const replacement = `const adminStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_admin_state_json']);`;

content = content.replace(target, replacement);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', content);
console.log('Fixed parameterized query in orderController');
