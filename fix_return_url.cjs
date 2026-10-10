const fs = require('fs');
let file = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/paymentController.js', 'utf8');

// Replace the return_url line
file = file.replace(
  /return_url: `\$\{process\.env\.FRONTEND_URL \|\| 'https:\/\/localhost:5173'\}\/order-success\?order_id=\{order_id\}`/g,
  "return_url: `${req.headers.origin || process.env.FRONTEND_URL || 'https://www.hajinutsandspices.com'}/order-success?order_id={order_id}`"
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/paymentController.js', file);
console.log('Fixed return_url in paymentController.js');
