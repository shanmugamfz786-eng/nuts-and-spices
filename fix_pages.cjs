const fs = require('fs');

// LoginPage.jsx
let loginPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/LoginPage.jsx', 'utf8');

let oldHandleLogin = `  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const id = loginIdentifier.trim();
    if (!id || !loginPassword) {
      setErrorMessage('Please enter your mobile/email and password.');
      return;
    }

    if (id.toLowerCase() === 'admin702@admin.com') {
      const adminRes = loginAdmin(id, loginPassword);
      if (adminRes.success) {
        setSuccessMessage('Admin Access Granted!');
        setTimeout(() => {
          navigate('admin');
        }, 600);
      } else {
        setErrorMessage(adminRes.message || 'Invalid Admin Password');
      }
      return;
    }

    const res = loginUser({
      identifier: id,
      password: loginPassword
    });

    if (res && res.success) {
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        navigate('home');
      }, 600);
    } else {
      setErrorMessage(res ? res.message : 'Invalid credentials');
    }
  };`;

let newHandleLogin = `  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const id = loginIdentifier.trim();
    if (!id || !loginPassword) {
      setErrorMessage('Please enter your mobile/email and password.');
      return;
    }

    if (id.toLowerCase() === 'admin702@admin.com') {
      const adminRes = loginAdmin(id, loginPassword);
      if (adminRes.success) {
        setSuccessMessage('Admin Access Granted!');
        setTimeout(() => {
          navigate('admin');
        }, 600);
      } else {
        setErrorMessage(adminRes.message || 'Invalid Admin Password');
      }
      return;
    }

    const res = await loginUser({
      identifier: id,
      password: loginPassword
    });

    if (res && res.success) {
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        navigate('home');
      }, 600);
    } else {
      setErrorMessage(res ? res.message : 'Invalid credentials');
    }
  };`;

loginPage = loginPage.replace(oldHandleLogin, newHandleLogin);
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/LoginPage.jsx', loginPage);

// RegisterPage.jsx
let regPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/RegisterPage.jsx', 'utf8');

let oldHandleReg = `  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regMobile.trim() || !regPassword) {
      setErrorMessage('Please fill in all required fields (*).');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('Please accept the Terms & Conditions.');
      return;
    }

    setSuccessMessage('Account registered successfully!');
    setTimeout(() => {
      registerUser({
        name: regName.trim(),
        phone: regMobile.trim(),
        email: regEmail.trim() || \`\${regName.toLowerCase().replace(/\\s+/g, '')}@nutsandspices.in\`,
        password: regPassword
      });
      navigate('home');
    }, 600);
  };`;

let newHandleReg = `  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regMobile.trim() || !regPassword) {
      setErrorMessage('Please fill in all required fields (*).');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('Please accept the Terms & Conditions.');
      return;
    }

    const res = await registerUser({
      name: regName.trim(),
      phone: regMobile.trim(),
      email: regEmail.trim() || \`\${regName.toLowerCase().replace(/\\s+/g, '')}@nutsandspices.in\`,
      password: regPassword
    });

    if (res && res.success) {
      setSuccessMessage('Account registered successfully!');
      setTimeout(() => {
        navigate('home');
      }, 600);
    } else {
      setErrorMessage(res ? res.message : 'Registration failed');
    }
  };`;

regPage = regPage.replace(oldHandleReg, newHandleReg);
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/RegisterPage.jsx', regPage);

console.log('Fixed Login and Register pages');
