const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', 'utf8');

const target = `      const saved = localStorage.getItem('nuts_spices_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeProductList(parsed);
        }
      }`;

const replacement = `      const saved = localStorage.getItem('nuts_spices_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Force sync to backend immediately on load to sync locally created items
          fetch((import.meta.env.VITE_API_BASE_URL || '') + '/api/admin/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ products: parsed }) }).catch(()=>{});
          return sanitizeProductList(parsed);
        }
      }`;

content = content.replace(target, replacement);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', content);
console.log('Fixed CartContext force sync');
