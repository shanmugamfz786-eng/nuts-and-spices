const run = async () => {
  const req = {
    customer: { name: 'test', phone: '1234567890', address: 'test', city: 'test', pincode: '123456' },
    items: [
      {
        productId: 'prod-1791544241328',
        name: 'pattasu',
        weight: '1 bundle',
        price: 1,
        quantity: 1
      }
    ]
  };
  const res = await fetch('https://nuts-and-spices.onrender.com/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  const text = await res.text();
  console.log('Status:', res.status, text);
};
run();
