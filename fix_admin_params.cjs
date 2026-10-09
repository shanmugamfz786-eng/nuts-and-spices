const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/adminController.js', 'utf8');

const target = `const rows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = 'master_admin_state_json'");`;
const replacement = `const rows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_admin_state_json']);`;

content = content.replace(target, replacement);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/adminController.js', content);
console.log('Fixed parameterized query in adminController');
