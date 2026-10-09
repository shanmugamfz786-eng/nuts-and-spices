fetch('http://localhost:5001/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customer: { name: 'Test', phone: '9999999999', address: '123', city: 'Test', pincode: '600001' },
    items: [
      { productId: 'prod_123', name: 'pattasu', weight: 'Standard', price: 100, quantity: 1 }
    ]
  })
}).then(res => res.json()).then(console.log).catch(console.error);
