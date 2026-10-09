const syncState = async () => {
  await fetch('http://localhost:5001/api/admin/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      products: [
        { id: 'prod_123', name: 'pattasu', price: 100, active: true, weights: [{ label: 'Standard', price: 100 }] }
      ]
    })
  });

  const res = await fetch('http://localhost:5001/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { name: 'Test', phone: '9999999999', address: '123', city: 'Test', pincode: '600001' },
      items: [
        { productId: 'prod_123', name: 'pattasu', weight: 'Standard', price: 100, quantity: 1 }
      ]
    })
  });

  console.log(await res.json());
};

syncState();
