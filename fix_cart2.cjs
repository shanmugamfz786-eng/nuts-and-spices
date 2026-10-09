const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', 'utf8');

content = content.replace(
  'const updatedP = { ...p, status: currentlyActive ? \'Inactive\' : \'Active\', active: !currentlyActive };',
  'const updatedP = { ...p, status: currentlyActive ? \'Inactive\' : \'Active\', active: !currentlyActive };\n          syncAdminStateToCloud({ products: prev.map(x => x.id === productId ? updatedP : x) });'
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', content);
console.log('Fixed CartContext toggle');
