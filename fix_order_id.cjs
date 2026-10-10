const fs = require('fs');

let orderCtrl = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', 'utf8');

const idGenLogic = `
      // Generate Sequential Order ID: HNS-001, HNS-002...
      let nextNum = 1;
      const hnsOrders = await queryDb("SELECT id FROM orders WHERE id LIKE 'HNS-%'");
      if (hnsOrders && hnsOrders.length > 0) {
        let maxNum = 0;
        hnsOrders.forEach(o => {
          const m = o.id.match(/HNS-(\\d+)/);
          if (m) {
            const num = parseInt(m[1], 10);
            if (num > maxNum) maxNum = num;
          }
        });
        nextNum = maxNum + 1;
      }
      const orderId = \`HNS-\${nextNum.toString().padStart(3, '0')}\`;
`;

orderCtrl = orderCtrl.replace(
  /const orderNumericId = Math\.floor\(10000 \+ Math\.random\(\) \* 90000\);\s*const orderId = `NS-\$\{orderNumericId\}`;/g,
  idGenLogic
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', orderCtrl);
console.log('Fixed Order ID generation to HNS-001');
