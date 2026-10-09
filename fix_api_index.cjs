const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/api/index.js', 'utf8');

const target = `export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  || ('/api');`;

const replacement = `export const API_BASE_URL = ((import.meta.env.VITE_API_BASE_URL || '').replace(/\\/api\\/?$/, '') || '') + '/api';`;

content = content.replace(target, replacement);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/api/index.js', content);
console.log('Fixed API_BASE_URL in src/api/index.js');
