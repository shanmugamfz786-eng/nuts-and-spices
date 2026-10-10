fetch('http://localhost:5001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ identifier: 'test@example.com', password: 'password' })
}).then(res => res.json()).then(console.log).catch(console.error);
