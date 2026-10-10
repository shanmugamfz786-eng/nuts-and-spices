const fs = require('fs');
let orderApi = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/api/orderApi.js', 'utf8');

orderApi = orderApi.replace(
  /export const getOrders = \(\) => apiFetch\('\/orders'\);/g,
  `export const getOrders = () => apiFetch('/orders');\nexport const fetchOrdersApi = () => apiFetch('/orders');`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/api/orderApi.js', orderApi);
console.log('Fixed fetchOrdersApi');
