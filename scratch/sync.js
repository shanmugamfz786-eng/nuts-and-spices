import { PRODUCTS, CATEGORIES } from '../src/data/products.js';

async function sync() {
  const res = await fetch('https://nuts-spices-e-commerce.vercel.app/api/catalog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ products: PRODUCTS, categories: CATEGORIES })
  });
  const data = await res.text();
  console.log(data);
}
sync().catch(console.error);
