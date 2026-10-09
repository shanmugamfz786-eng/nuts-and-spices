const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', 'utf8');

content = content.replace(
  'const updated = [productToAdd, ...prev];',
  'const updated = [productToAdd, ...prev];\n      syncAdminStateToCloud({ products: updated });'
);

content = content.replace(
  'const updated = prev.map(p => p.id === productId ? { ...p, ...updatedFields } : p);',
  'const updated = prev.map(p => p.id === productId ? { ...p, ...updatedFields } : p);\n      syncAdminStateToCloud({ products: updated });'
);

content = content.replace(
  'const updated = prev.filter(p => p.id !== productId);',
  'const updated = prev.filter(p => p.id !== productId);\n      syncAdminStateToCloud({ products: updated });'
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', content);
console.log('Fixed CartContext.jsx');
