const fs = require('fs');
let authControl = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/authController.js', 'utf8');

authControl = authControl.replace(
`    const identifier = email || phone;

    // Check existing
    const existing = await queryDb('SELECT * FROM users WHERE phone = ? OR email = ?', [phone, identifier]);`,
`    const identifier = email ? email.trim().toLowerCase() : phone;
    const cleanPhone = phone ? phone.trim() : '';

    // Check existing
    const existing = await queryDb('SELECT * FROM users WHERE phone = ? OR LOWER(email) = ?', [cleanPhone, identifier]);`
);

authControl = authControl.replace(
`      'INSERT INTO users (id, name, phone, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name.trim(), phone.trim(), email ? email.trim() : \`\${phone}@nutsandspices.in\`, hashedPassword, 'customer']`,
`      'INSERT INTO users (id, name, phone, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name.trim(), cleanPhone, email ? email.trim().toLowerCase() : \`\${cleanPhone}@nutsandspices.in\`, hashedPassword, 'customer']`
);

authControl = authControl.replace(
`    const userObj = {
      id: userId,
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : \`\${phone}@nutsandspices.in\`,
      role: 'customer'
    };`,
`    const userObj = {
      id: userId,
      name: name.trim(),
      phone: cleanPhone,
      email: email ? email.trim().toLowerCase() : \`\${cleanPhone}@nutsandspices.in\`,
      role: 'customer'
    };`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/server/controllers/authController.js', authControl);
console.log('Fixed authController.js');
