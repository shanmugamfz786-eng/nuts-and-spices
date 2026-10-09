const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');

const target1 = `const orderRes = await fetch((import.meta.env.VITE_API_BASE_URL || '') + '/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer: formData, items: cart, notes: formData.notes }) }); const orderData = await orderRes.json();`;

const replacement1 = `const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\\/api\\/?$/, '') || '';
      const orderRes = await fetch(BASE + '/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${localStorage.getItem('nuts_spices_auth_token') || ''}\` }, body: JSON.stringify({ customer: formData, items: cart, notes: formData.notes }) }); 
      if (!orderRes.ok && orderRes.status === 404) throw new Error('API Endpoint not found');
      const text1 = await orderRes.text();
      let orderData; try { orderData = JSON.parse(text1); } catch(e) { throw new Error('Backend returned HTML instead of JSON (order creation): ' + text1.substring(0, 100)); }`;

const target2 = `const response = await fetch((import.meta.env.VITE_API_BASE_URL || '') + '/api/payment/create-session', {`;

const replacement2 = `const response = await fetch(BASE + '/api/payment/create-session', {`;

const target3 = `const data = await response.json();`;

const replacement3 = `const text2 = await response.text();
      let data; try { data = JSON.parse(text2); } catch(e) { throw new Error('Backend returned HTML instead of JSON (payment session): ' + text2.substring(0, 100)); }`;

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);
content = content.replace(target3, replacement3);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', content);
console.log('Fixed CheckoutPage.jsx double /api issue');
