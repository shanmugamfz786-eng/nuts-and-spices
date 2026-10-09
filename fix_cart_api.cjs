const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', 'utf8');

content = content.replace(
  /fetch\(\(import\.meta\.env\.VITE_API_BASE_URL \|\| ''\) \+ '\/api\//g,
  `fetch(((import.meta.env.VITE_API_BASE_URL || '').replace(/\\/api\\/?$/, '') || '') + '/api/`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', content);
console.log('Fixed CartContext double /api');
