const run = async () => {
  const orderData = {
    customer: { name: 'Test', phone: '9999999999', address: '123', city: 'Test', pincode: '600001' },
    items: [
      { productId: 'test-prod', name: 'Test Product', weight: '250g', price: 500, quantity: 1 }
    ]
  };

  console.log('1. Create product in DB');
  const pRes = await fetch('http://localhost:5001/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'test-prod',
      name: 'Test Product',
      category: 'nuts',
      price: 500,
      weights: [{ label: '250g', price: 500, originalPrice: 500 }]
    })
  });
  console.log('Create Prod:', await pRes.text());

  console.log('\n2. Place order');
  const oRes = await fetch('http://localhost:5001/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  console.log('Order:', await oRes.text());
};
run();
