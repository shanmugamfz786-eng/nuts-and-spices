const fs = require('fs');
let ctx = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', 'utf8');

ctx = ctx.replace(
  /if \(res\.data\.orders && res\.data\.orders\.length > 0\) setOrders\(res\.data\.orders\);/g,
  `if (res.data.orders && res.data.orders.length > 0) {
              setOrders(prev => {
                const combined = [...prev, ...res.data.orders];
                const unique = [];
                const seen = new Set();
                for (let o of combined) {
                  const id = o.orderId || o.id;
                  if (!seen.has(id)) {
                    seen.add(id);
                    unique.push(o);
                  }
                }
                return unique;
              });
            }`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', ctx);
console.log('Fixed CartContext merge');
