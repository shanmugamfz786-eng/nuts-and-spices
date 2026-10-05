import fs from 'fs';

let content = fs.readFileSync('src/context/CartContext.jsx', 'utf8');

const replacement = "  const loginUser = (loginData) => {\n" +
"    const identifier = (loginData.identifier || loginData.phone || loginData.email || '').trim().toLowerCase();\n" +
"    \n" +
"    // Bypass for WhatsApp quick login or mock logins where name is explicitly provided\n" +
"    if (loginData.name && !loginData.password) {\n" +
"      setUser(loginData);\n" +
"      setIsAuthModalOpen(false);\n" +
"      return { success: true };\n" +
"    }\n\n" +
"    const foundUser = registeredUsers.find(u => \n" +
"      (u.phone && u.phone.toLowerCase() === identifier) ||\n" +
"      (u.email && u.email.toLowerCase() === identifier)\n" +
"    );\n\n" +
"    if (foundUser) {\n" +
"      if (foundUser.password !== loginData.password) {\n" +
"        return { success: false, message: 'Incorrect password.' };\n" +
"      }\n" +
"      setUser({\n" +
"        name: foundUser.name,\n" +
"        phone: foundUser.phone,\n" +
"        email: foundUser.email\n" +
"      });\n" +
"      setIsAuthModalOpen(false);\n" +
"      return { success: true };\n" +
"    } else {\n" +
"      return { success: false, message: 'User not found. Please register first.' };\n" +
"    }\n" +
"  };";

content = content.replace(/  const loginUser = \(loginData\) => \{[\s\S]*?  \};\n/, replacement + '\n');
fs.writeFileSync('src/context/CartContext.jsx', content);
