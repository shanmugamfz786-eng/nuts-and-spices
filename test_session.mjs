const run = async () => {
  const req = {
    orderId: `NS-${Date.now()}`,
    amount: 100,
    customerPhone: '9876543210',
    customerEmail: 'test@example.com',
    customerName: 'Test'
  };
  const res = await fetch('https://nuts-and-spices.onrender.com/api/payment/create-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  console.log('Session creation status:', res.status, await res.text());
};
run();
