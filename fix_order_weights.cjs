const fs = require('fs');
let orderControl = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', 'utf8');

orderControl = orderControl.replace(
`      // Find the specific weight/variant price
      const productWeights = backendProduct.weights || backendProduct.weights_json || [];`,
`      // Find the specific weight/variant price
      let productWeights = backendProduct.weights || backendProduct.weights_json || [];
      if (typeof productWeights === 'string') {
        try {
          productWeights = JSON.parse(productWeights);
        } catch(e) {
          console.error("Failed to parse productWeights", e);
          productWeights = [];
        }
      }`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', orderControl);
console.log('Fixed orderController.js JSON parsing');
