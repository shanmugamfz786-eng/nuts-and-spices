const run = async () => {
  const orderData = {
    customer: { name: 'Test', phone: '9999999999', address: '123', city: 'Test', pincode: '600001' },
    items: [
      { productId: 'test-prod', name: 'Test Product', weight: '250g', price: 500, quantity: 1 }
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
