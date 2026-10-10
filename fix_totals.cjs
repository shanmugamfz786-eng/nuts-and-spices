const fs = require('fs');

// 1. CartContext.jsx
let cartContext = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', 'utf8');
// Insert deliveryCharge and grandTotal
cartContext = cartContext.replace(/const cartTotal = cart\.reduce\(\(sum, item\) => sum \+ item\.price \* item\.quantity, 0\);/g, `const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);\n  const deliveryCharge = cartTotal > 0 && cartTotal < 1000 ? 50 : 0;\n  const grandTotal = cartTotal + deliveryCharge;`);
cartContext = cartContext.replace(/cartTotal,\n/g, 'cartTotal,\n        deliveryCharge,\n        grandTotal,\n');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', cartContext);

// 2. CartPage.jsx
let cartPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', 'utf8');
cartPage = cartPage.replace(/cartTotal, navigate/g, 'cartTotal, deliveryCharge, grandTotal, navigate');
cartPage = cartPage.replace(/<span>Doorstep Delivery Charges:<\/span>\s*<span className="font-bold text-\[#000000\]">FREE<\/span>/g, '<span>Doorstep Delivery Charges:</span>\n                    <span className="font-bold text-[#000000]">{deliveryCharge > 0 ? `?${deliveryCharge}` : \'FREE\'}</span>');
cartPage = cartPage.replace(/<span className="text-2xl font-black text-\[#000000\]">\s*?\{cartTotal\.toLocaleString\('en-IN'\)\}\s*<\/span>/g, '<span className="text-2xl font-black text-[#000000]">\n                      ?{grandTotal.toLocaleString(\'en-IN\')}\n                    </span>');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', cartPage);

// 3. CheckoutPage.jsx
let checkoutPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');
checkoutPage = checkoutPage.replace(/cartTotal, createNewOrder/g, 'cartTotal, deliveryCharge, grandTotal, createNewOrder');
checkoutPage = checkoutPage.replace(/total: cartTotal,/g, 'total: grandTotal,');
checkoutPage = checkoutPage.replace(/<span>Pay ?\{cartTotal\.toLocaleString\('en-IN'\)\} Securely<\/span>/g, '<span>Pay ?{grandTotal.toLocaleString(\'en-IN\')} Securely</span>');
checkoutPage = checkoutPage.replace(/<span className="text-\[#000000\]">?\{cartTotal\.toLocaleString\('en-IN'\)\}<\/span>/g, '<span className="text-[#000000]">?{grandTotal.toLocaleString(\'en-IN\')}</span>');

// Add delivery charge row in Order Summary
checkoutPage = checkoutPage.replace(/<span className="text-\[#000000\]">Total Amount:<\/span>/g, `</div>
            
            <div className="pt-3 flex items-center justify-between text-xs font-bold text-[#8C7A6B]">
              <span>Delivery Charge:</span>
              <span>{deliveryCharge > 0 ? \`?\${deliveryCharge}\` : 'FREE'}</span>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-base font-black">
              <span className="text-[#000000]">Grand Total:</span>`);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', checkoutPage);

console.log('Fixed UI totals to include delivery charge');
