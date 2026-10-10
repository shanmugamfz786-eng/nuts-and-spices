const fs = require('fs');

// 1. CartContext.jsx Revert
let cartContext = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', 'utf8');
cartContext = cartContext.replace(/const deliveryCharge = cartTotal > 0 && cartTotal < 1000 \? 50 : 0;\s*const grandTotal = cartTotal \+ deliveryCharge;/g, 'const deliveryCharge = 0;\n  const grandTotal = cartTotal;');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', cartContext);

// 2. CartPage.jsx Revert
let cartPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', 'utf8');
cartPage = cartPage.replace(/\{deliveryCharge > 0 \? `?\$\{deliveryCharge\}` : 'FREE'\}/g, 'FREE');
cartPage = cartPage.replace(/grandTotal/g, 'cartTotal');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', cartPage);

// 3. CheckoutPage.jsx Revert
let checkoutPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');
checkoutPage = checkoutPage.replace(/grandTotal/g, 'cartTotal');
checkoutPage = checkoutPage.replace(/<div className="pt-3 flex items-center justify-between text-xs font-bold text-\[#8C7A6B\]">\s*<span>Delivery Charge:<\/span>\s*<span>\{deliveryCharge > 0 \? `?\$\{deliveryCharge\}` : 'FREE'\}<\/span>\s*<\/div>/g, '');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', checkoutPage);

// 4. Backend orderController.js Fix
let orderController = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', 'utf8');
orderController = orderController.replace(/let deliveryCharge = 50;\s*\/\/\s*standard delivery\s*if \(subtotal >= 1000\) \{\s*deliveryCharge = 0;\s*\/\/\s*Free delivery for orders > 1000\s*\}/g, 'let deliveryCharge = 0; // FREE DELIVERY');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', orderController);

console.log('Removed all delivery charges');
