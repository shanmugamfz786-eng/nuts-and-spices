const fs = require('fs');
let cartPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', 'utf8');

cartPage = cartPage.replace(
  /<div key=\{order\.orderId\} className="bg-white p-5 rounded-2xl border border-\[#E5E7EB\] shadow-sm space-y-4 hover:shadow-md transition-shadow">/g,
  `<div key={order.orderId || order.id} 
       onClick={() => {
         window.history.pushState({}, '', '?order_id=' + (order.orderId || order.id));
         navigate('order-success');
       }}
       className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4 hover:shadow-md transition-shadow cursor-pointer hover:border-[#25D366]">`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', cartPage);
console.log('Made orders clickable');
