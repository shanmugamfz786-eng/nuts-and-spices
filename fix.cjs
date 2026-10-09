const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');

const codeToMove = "const orderRes = await fetch((import.meta.env.VITE_API_BASE_URL || '') + '/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer: formData, items: cart, notes: formData.notes }) }); const orderData = await orderRes.json(); if (!orderData.success) { alert(orderData.message); setIsProcessingPayment(false); return; } const backendOrderId = orderData.order.id; const backendTotal = orderData.order.totalAmount;";

content = content.replace(codeToMove, '');

const insertTarget = "const orderId = 'NS_' + Math.floor(100000 + Math.random() * 900000).toString();";
content = content.replace(insertTarget, codeToMove + '\n      ' + insertTarget);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', content);
console.log('Fixed CheckoutPage.jsx');
