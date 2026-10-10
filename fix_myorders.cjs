const fs = require('fs');
let cartPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', 'utf8');

cartPage = cartPage.replace(
  /const myOrders = \(orders \|\| \[\]\)\.filter\(o =>\s*user && o\.customer && \(\s*\(user\.phone && o\.customer\.phone === user\.phone\) \|\|\s*\(user\.email && o\.customer\.email === user\.email\)\s*\)\s*\)\.sort/g,
  `const guestOrderIds = JSON.parse(localStorage.getItem('guest_orders') || '[]');
  
  const myOrders = (orders || []).filter(o => {
    const oPhone = o.phone || (o.customer && o.customer.phone);
    const oEmail = o.email || (o.customer && o.customer.email);
    const isOwner = user ? ((user.phone && oPhone === user.phone) || (user.email && oEmail === user.email)) : false;
    const isGuestOwner = guestOrderIds.includes(o.orderId || o.id);
    return isOwner || isGuestOwner;
  }).sort`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', cartPage);
console.log('Fixed myOrders filter');
