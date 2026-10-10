const fs = require('fs');

let productCard = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/components/ProductCard.jsx', 'utf8');
productCard = productCard.replace(/<option key=\{w\.label\} value=\{w\.label\}>/g, '<option key={`${product.id}-${w.label}-${Math.random()}`} value={w.label}>');
productCard = productCard.replace(/<button\s+key=\{w\.label\}/g, '<button\n                  key={`${product.id}-${w.label}-${Math.random()}`}');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/components/ProductCard.jsx', productCard);

let productDetails = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/ProductDetailsPage.jsx', 'utf8');
productDetails = productDetails.replace(/<button\s+key=\{w\.label\}/g, '<button\n                  key={`${product.id}-${w.label}-${i}`}');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/ProductDetailsPage.jsx', productDetails);

let adminProducts = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/components/admin/AdminProducts.jsx', 'utf8');
adminProducts = adminProducts.replace(/<span key=\{wIdx\}/g, '<span key={`${p.id}-${w.label}-${wIdx}`}');
adminProducts = adminProducts.replace(/<div key=\{idx\} className="flex items-center gap-2">/g, '<div key={`weight-opt-${idx}`} className="flex items-center gap-2">');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/components/admin/AdminProducts.jsx', adminProducts);

console.log('Fixed React duplicate keys');
