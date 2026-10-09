const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/api/index.js', 'utf8');

content = content.replace(/export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL[\s\S]*?\|\|\s*\('\/api'\);/,
`export const API_BASE_URL = (() => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url && import.meta.env.PROD) {
    console.error("CRITICAL ERROR: VITE_API_BASE_URL is not defined in production environment variables.");
    // Do not fall back to /api in production to prevent silent Vercel HTML rewrites
  }
  return (url || '').replace(/\\/api\\/?$/, '') + '/api';
})();`);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/api/index.js', content);
console.log('Fixed API_BASE_URL');
