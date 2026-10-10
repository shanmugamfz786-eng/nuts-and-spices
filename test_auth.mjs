const run = async () => {
  console.log('1. Register with new Gmail');
  let res = await fetch('http://localhost:5001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', phone: '5551234567', email: 'Test.User@gmail.com', password: 'password123' })
  });
  console.log(await res.json());

  console.log('\n2. Register duplicate');
  res = await fetch('http://localhost:5001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User 2', phone: '5551234568', email: 'test.user@GMAIL.com', password: 'password123' })
  });
  console.log(await res.json());

  console.log('\n3. Login with correct password');
  res = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'test.user@gmail.com', password: 'password123' })
  });
  console.log(await res.json());

  console.log('\n4. Login with wrong password');
  res = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'test.user@gmail.com', password: 'wrong' })
  });
  console.log(await res.json());

  console.log('\n5. Login with uppercase');
  res = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'TEST.USER@GMAIL.COM', password: 'password123' })
  });
  console.log(await res.json());

};
run();
