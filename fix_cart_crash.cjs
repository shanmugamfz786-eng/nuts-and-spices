const fs = require('fs');
let cartPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', 'utf8');

cartPage = cartPage.replace(
  /\{deliveryCharge > 0 \? `\?\$` \+ `\{deliveryCharge\}` : 'FREE'\}/g,
  'FREE'
);

// Fallback replace if regex above misses because of templating
cartPage = cartPage.replace(
  /<span className="font-bold text-\[#000000\]">\{deliveryCharge > 0 \? `\?\$\{deliveryCharge\}` : 'FREE'\}<\/span>/g,
  '<span className="font-bold text-[#000000]">FREE</span>'
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', cartPage);
console.log('Fixed deliveryCharge reference error');
