import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, loginUser, registerUser, loginAdmin, navigate } = useCart();
  
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
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
  };

  const handleRegisterSubmit = (e) => {
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
        email: regEmail.trim() || `${regName.toLowerCase().replace(/\s+/g, '')}@nutsandspices.in`,
        password: regPassword
      });
      setSuccessMessage('');
    }, 600);
  };

  const handleWhatsAppQuickLogin = () => {
    setSuccessMessage('Authenticating via WhatsApp...');
    setTimeout(() => {
      loginUser({
        name: 'WhatsApp Member',
        identifier: '9876543210',
        email: 'whatsapp@nutsandspices.in',
        phone: '9876543210'
      });
      setSuccessMessage('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#E5E7EB] relative flex flex-col my-auto max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#000000] via-[#000000] to-[#222222] text-white p-6 pb-5 relative shrink-0">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute right-4 top-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#000000]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#000000]">
              Nuts & Spices Gourmet Club
            </span>
          </div>
          <h2 className="text-2xl font-black font-serif tracking-tight">
            {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-xs text-[#E5E7EB] mt-1">
            {authMode === 'login' 
              ? 'Log in to access your orders & quick WhatsApp checkout.'
              : 'Join today for exclusive gourmet offers and WhatsApp updates.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 bg-black/15 p-1 rounded-2xl mt-5 border border-white/20">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[#000000] text-white shadow-md'
                  : 'text-[#E5E7EB] hover:text-white'
              }`}
            >
              LOGIN
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-[#000000] text-white shadow-md'
                  : 'text-[#E5E7EB] hover:text-white'
              }`}
            >
              REGISTER
            </button>
          </div>
        </div>

        {/* Form Body Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-[#F9FAFB]">
          
          {/* Notifications */}
          {errorMessage && (
            <div className="bg-red-50 text-red-700 border border-red-200 text-xs font-semibold p-3.5 rounded-2xl animate-in fade-in">
              ⚠️ {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#000000]" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Mobile / Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter mobile no. or email"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] placeholder-[#8C7A6B] outline-none focus:border-[#000000] transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your mobile via WhatsApp.')}
                    className="text-[11px] font-bold text-[#000000] hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] placeholder-[#8C7A6B] outline-none focus:border-[#000000] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#000000] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember-me"
                  defaultChecked
                  className="rounded text-[#000000] focus:ring-[#000000]"
                />
                <label htmlFor="remember-me" className="text-xs font-medium text-[#000000]">
                  Keep me signed in on this device
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#000000] hover:bg-[#000000] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md hover:shadow-lg uppercase tracking-wider cursor-pointer mt-2"
              >
                LOGIN TO ACCOUNT
              </button>

              {/* Divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E7EB]" />
                </div>
                <span className="relative bg-[#F9FAFB] px-3 text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider">
                  OR QUICK ACCESS
                </span>
              </div>

              {/* WhatsApp Quick OTP Login */}
              <button
                type="button"
                onClick={handleWhatsAppQuickLogin}
                className="w-full py-3 bg-[#000000] hover:bg-[#000000] text-white font-bold text-xs rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>LOGIN WITH WHATSAPP OTP</span>
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] placeholder-[#8C7A6B] outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Mobile Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] placeholder-[#8C7A6B] outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] placeholder-[#8C7A6B] outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] placeholder-[#8C7A6B] outline-none focus:border-[#000000]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#000000] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] placeholder-[#8C7A6B] outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#000000] focus:ring-[#000000]"
                />
                <label htmlFor="terms" className="text-[11px] text-[#000000]">
                  I agree to Nuts & Spices Terms of Service & Privacy Policy.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#000000] hover:bg-[#000000] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md uppercase tracking-wider cursor-pointer mt-2"
              >
                CREATE MY ACCOUNT
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
