const fs = require('fs');

// 1. Fix orderController.js
let orderController = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', 'utf8');

const oldDbProducts = `         if (parsedState && parsedState.products && parsedState.products.length > 0) {
            dbProducts = parsedState.products;
         }`;
const newDbProducts = `         // Merge admin state with default PRODUCTS to prevent unavailable errors
         if (parsedState && parsedState.products && parsedState.products.length > 0) {
           const adminProducts = parsedState.products;
           // Add missing default products to dbProducts
           const existingIds = new Set(adminProducts.map(p => p.id));
           dbProducts = [...adminProducts, ...PRODUCTS.filter(p => !existingIds.has(p.id))];
         }`;
orderController = orderController.replace(oldDbProducts, newDbProducts);

const oldVariant = `      const variant = productWeights.find(w => w.label === item.weight);
      let realPrice = variant ? variant.price : null;`;
const newVariant = `      // Try finding variant by label AND price first (to support duplicate labels with different prices)
      let variant = productWeights.find(w => w.label === item.weight && Number(w.price) === Number(item.price));
      if (!variant) {
        variant = productWeights.find(w => w.label === item.weight);
      }
      let realPrice = variant ? variant.price : null;`;
orderController = orderController.replace(oldVariant, newVariant);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/orderController.js', orderController);
console.log('Fixed orderController.js');

// 2. Fix ProductCard.jsx duplicate keys
let productCard = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/components/ProductCard.jsx', 'utf8');

const oldSelectChange = `            <select
              value={activeWeight.label}
              onChange={(e) => {
                const selected = weightsList.find(w => w.label === e.target.value);
                if (selected) setSelectedWeight(selected);
              }}`;
const newSelectChange = `            <select
              value={weightsList.indexOf(activeWeight) !== -1 ? weightsList.indexOf(activeWeight) : 0}
              onChange={(e) => {
                const selected = weightsList[parseInt(e.target.value, 10)];
                if (selected) setSelectedWeight(selected);
              }}`;
productCard = productCard.replaceAll(oldSelectChange, newSelectChange);

const oldSelectMap = `              {weightsList.map((w) => (
                <option key={w.label} value={w.label}>
                  {w.label}
                </option>
              ))}`;
const newSelectMap = `              {weightsList.map((w, i) => (
                <option key={product.id + '-' + w.label + '-' + i} value={i}>
                  {w.label}
                </option>
              ))}`;
productCard = productCard.replaceAll(oldSelectMap, newSelectMap);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/components/ProductCard.jsx', productCard);
console.log('Fixed ProductCard.jsx');

// 3. Fix ProductDetailsPage.jsx duplicate keys
let productDetails = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/ProductDetailsPage.jsx', 'utf8');

const oldButtonMap = `                {safeWeights.map((w) => (
                  <button
                    key={w.label}
                    onClick={() => setSelectedWeight(w)}
                    className={\`px-4 py-2 rounded-xl text-xs font-bold border transition-all \${
                      activeWeight.label === w.label`;
const newButtonMap = `                {safeWeights.map((w, i) => (
                  <button
                    key={product.id + '-' + w.label + '-' + i}
                    onClick={() => setSelectedWeight(w)}
                    className={\`px-4 py-2 rounded-xl text-xs font-bold border transition-all \${
                      activeWeight === w`;
productDetails = productDetails.replace(oldButtonMap, newButtonMap);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/ProductDetailsPage.jsx', productDetails);
console.log('Fixed ProductDetailsPage.jsx');

// 4. Fix CartContext.js cartItemId
let cartContext = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', 'utf8');
const oldCartId = `const cartItemId = \`\${product.id}-\${weightLabel}\`;`;
const newCartId = `const cartItemId = \`\${product.id}-\${weightLabel}-\${itemPrice}\`;`;
cartContext = cartContext.replace(oldCartId, newCartId);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', cartContext);
console.log('Fixed CartContext.jsx');

