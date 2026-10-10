const run = async () => {
  const adminState = {
    products: [
      { id: 'admin-prod-1', name: 'Admin Nuts', price: 900, weights: [{ label: '1kg', price: 900, originalPrice: 1000 }] }
    ]
  };

  const loginRes = await fetch('http://localhost:5001/api/admin/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(adminState)
  });
  console.log('Sync State:', await loginRes.text());

  const orderData = {
    customer: { name: 'Test', phone: '9999999999', address: '123', city: 'Test', pincode: '600001' },
    items: [
      { productId: 'admin-prod-1', name: 'Admin Nuts', weight: '1kg', price: 900, quantity: 1 }
    ]
  };

  const oRes = await fetch('http://localhost:5001/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  console.log('Order:', await oRes.text());
};
run();
