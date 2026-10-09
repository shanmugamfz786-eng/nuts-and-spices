const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/adminController.js', 'utf8');

const target = `"INSERT INTO settings (setting_key, setting_value) VALUES ('master_admin_state_json', ?) ON DUPLICATE KEY UPDATE setting_value = ?",
      [adminStateJson, adminStateJson]`;

const replacement = `"INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
      ['master_admin_state_json', adminStateJson, adminStateJson]`;

content = content.replace(target, replacement);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/adminController.js', content);
console.log('Fixed parameterized insert in adminController');
