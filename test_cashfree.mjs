fetch('http://localhost:5001/api/payment/create-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: 'NS-72084', amount: 150, customerPhone: '9999999999', customerEmail: 'test@example.com', customerName: 'Test'
  })
}).then(res => res.json()).then(console.log).catch(console.error);
