const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/vite.config.js', 'utf8');

content = content.replace('chunkSizeWarningLimit: 1000', 'chunkSizeWarningLimit: 5000');

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/vite.config.js', content);
