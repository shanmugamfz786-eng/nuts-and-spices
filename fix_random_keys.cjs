const fs = require('fs');
let productCard = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/components/ProductCard.jsx', 'utf8');
productCard = productCard.replace(/\{weightsList\.map\(\(w\) => \(/g, '{weightsList.map((w, wIdx) => (');
productCard = productCard.replace(/<option key=\{`\$\{product\.id\}-\$\{w\.label\}-\$\{Math\.random\(\)\}`\} value=\{w\.label\}>/g, '<option key={`${product.id}-${w.label}-${wIdx}`} value={w.label}>');
productCard = productCard.replace(/<button\n                  key=\{`\$\{product\.id\}-\$\{w\.label\}-\$\{Math\.random\(\)\}`\}/g, '<button\n                  key={`${product.id}-${w.label}-${wIdx}`}');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/components/ProductCard.jsx', productCard);
console.log('Fixed Math.random keys');
