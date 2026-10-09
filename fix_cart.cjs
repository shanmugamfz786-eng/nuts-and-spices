const fs = require('fs');

let cart = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', 'utf8');

const oldRegister = `  const registerUser = (userData) => {
    const newUser = {
      name: userData.name,
      phone: userData.phone || userData.identifier || '',
      email: userData.email || '',
      password: userData.password || ''
    };

    setRegisteredUsers(prev => {
      const filtered = prev.filter(u => 
        !(u.phone && u.phone === newUser.phone) && 
        !(u.email && u.email.toLowerCase() === newUser.email.toLowerCase())
      );
      const upd = [...filtered, newUser];
      syncAdminStateToCloud({ registeredUsers: upd });
      return upd;
    });

    setUser(newUser);
    setIsAuthModalOpen(false);
  };`;

const newRegister = `  const registerUser = async (userData) => {
    try {
      const { register } = await import('../api/authApi.js');
      const res = await register(userData);
      if (res && res.success) {
        localStorage.setItem('nuts_spices_auth_token', res.token);
        setUser(res.user);
        setIsAuthModalOpen(false);
      }
      return res;
    } catch (err) {
      return { success: false, message: 'Registration failed due to network error.' };
    }
  };`;

cart = cart.replace(oldRegister, newRegister);

const oldLogin = `  const loginUser = (loginData) => {
    const identifier = (loginData.identifier || loginData.phone || loginData.email || '').trim().toLowerCase();
    
    // Bypass for WhatsApp quick login or mock logins where name is explicitly provided
    if (loginData.name && !loginData.password) {
      setUser(loginData);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    const foundUser = registeredUsers.find(u => 
      (u.phone && u.phone.toLowerCase() === identifier) ||
      (u.email && u.email.toLowerCase() === identifier)
    );

    if (foundUser) {
      if (foundUser.password !== loginData.password) {
        return { success: false, message: 'Incorrect password.' };
      }
      setUser({
        name: foundUser.name,
        phone: foundUser.phone,
        email: foundUser.email
      });
      setIsAuthModalOpen(false);
      return { success: true };
    }

    return { success: false, message: 'User not found. Please register.' };
  };`;

const newLogin = `  const loginUser = async (loginData) => {
    if (loginData.name && !loginData.password) {
      setUser(loginData);
      setIsAuthModalOpen(false);
      return { success: true };
    }
    try {
      const { login } = await import('../api/authApi.js');
      const res = await login(loginData);
      if (res && res.success) {
        localStorage.setItem('nuts_spices_auth_token', res.token);
        setUser(res.user);
        setIsAuthModalOpen(false);
      }
      return res;
    } catch (err) {
      return { success: false, message: 'Login failed due to network error.' };
    }
  };`;

cart = cart.replace(oldLogin, newLogin);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', cart);
console.log('Fixed CartContext');
