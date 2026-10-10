const fs = require('fs');

let authModal = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/components/AuthModal.jsx', 'utf8');

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
          setIsAuthModalOpen(false);
          navigate('admin');
        }, 600);
      } else {
        setErrorMessage(adminRes.message || 'Invalid Admin Password');
      }
      return;
    }

    setSuccessMessage('Logged in successfully!');
    setTimeout(() => {
      loginUser({
        identifier: id,
        password: loginPassword
      });
      setSuccessMessage('');
    }, 600);
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
          setIsAuthModalOpen(false);
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
        setSuccessMessage('');
      }, 600);
    } else {
      setErrorMessage(res ? res.message : 'Invalid credentials');
    }
  };`;

authModal = authModal.replace(oldHandleLogin, newHandleLogin);

let oldHandleReg = `  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regMobile.trim() || !regPassword) {
      setErrorMessage('Please fill in all required fields.');
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

    setSuccessMessage('Account created successfully!');
    setTimeout(() => {
      registerUser({
        name: regName.trim(),
        phone: regMobile.trim(),
        email: regEmail.trim() || \`\${regName.toLowerCase().replace(/\\s+/g, '')}@nutsandspices.in\`,
        password: regPassword
      });
      setSuccessMessage('');
    }, 600);
  };`;

let newHandleReg = `  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regMobile.trim() || !regPassword) {
      setErrorMessage('Please fill in all required fields.');
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
      setSuccessMessage('Account created successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 600);
    } else {
      setErrorMessage(res ? res.message : 'Registration failed');
    }
  };`;

authModal = authModal.replace(oldHandleReg, newHandleReg);
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/components/AuthModal.jsx', authModal);
console.log('Fixed AuthModal.jsx');
