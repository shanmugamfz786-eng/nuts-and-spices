const run = async () => {
  const req = {
    customer: { name: 'test', phone: '1234567890', address: 'test', city: 'test', pincode: '123456' },
    items: [
      {
        productId: 'prod-1791544241328', // pattasu
        name: 'pattasu',
        weight: '1 bundle',
        price: 1,
        quantity: 1
      }
    ]
  };
  const res1 = await fetch('http://localhost:5001/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  console.log('Valid product status:', res1.status, await res1.text());

  const req2 = {
    customer: { name: 'test', phone: '1234567890', address: 'test', city: 'test', pincode: '123456' },
    items: [
      {
        productId: 'fake-prod-123',
        name: 'ghost',
        weight: '1 kg',
        price: 100,
        quantity: 1
      }
    ]
  };
  const res2 = await fetch('http://localhost:5001/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req2)
  });
  console.log('Fake product status:', res2.status, await res2.text());
};
run();
