import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Mail, Lock, User, Phone, Eye, EyeOff, Sparkles, CheckCircle2, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const { user, loginUser, logoutUser, navigate } = useCart();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  if (user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5E7EB] shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-[#F9FAFB] border border-[#000000] text-[#000000] rounded-full flex items-center justify-center mx-auto text-3xl font-black font-serif shadow-inner">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <span className="text-xs font-bold text-[#000000] uppercase tracking-widest block">
              Gourmet Member Profile
            </span>
            <h1 className="text-3xl font-black font-serif text-[#000000] mt-1">
              Welcome, {user.name}!
            </h1>
            <p className="text-xs sm:text-sm text-[#8C7A6B] mt-1">
              {user.email || user.phone}
            </p>
          </div>

          <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#000000] block">Member Phone</span>
              <span className="text-xs font-bold text-[#000000]">{user.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#000000] block">Member Email</span>
              <span className="text-xs font-bold text-[#000000]">{user.email || 'N/A'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('shop', { category: 'all' })}
              className="px-8 py-3.5 bg-[#000000] hover:bg-[#000000] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md uppercase tracking-wider flex items-center gap-2"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={logoutUser}
              className="px-8 py-3.5 bg-white border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs rounded-2xl transition-all uppercase tracking-wider cursor-pointer"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMessage('Please enter your mobile/email and password.');
      return;
    }

    setSuccessMessage('Logged in successfully!');
    setTimeout(() => {
      loginUser({
        name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : 'Valued Customer',
        identifier: loginIdentifier,
        email: loginIdentifier.includes('@') ? loginIdentifier : 'customer@nutsandspices.in',
        phone: loginIdentifier.includes('@') ? '9876543210' : loginIdentifier
      });
      navigate('home');
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
      loginUser({
        name: regName.trim(),
        identifier: regMobile.trim(),
        email: regEmail.trim() || `${regName.toLowerCase().replace(/\s+/g, '')}@nutsandspices.in`,
        phone: regMobile.trim()
      });
      navigate('home');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E5E7EB] grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Side Branding Banner */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#000000] via-[#000000] to-[#222222] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#000000]/30 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#000000]" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#000000]">
                Gourmet Store
              </span>
            </div>
            <h2 className="text-3xl font-black font-serif leading-tight">
              NUTS & SPICES
            </h2>
            <p className="text-xs text-[#E5E7EB] leading-relaxed">
              Log in or register to unlock instant WhatsApp orders, member rewards, and fast re-ordering of your favorite spices & nuts.
            </p>
          </div>

          <div className="space-y-3 pt-8 border-t border-[#000000]/60">
            <div className="flex items-center gap-3 text-xs text-[#E5E7EB]">
              <ShieldCheck className="w-5 h-5 text-[#000000] shrink-0" />
              <span>100% Secure WhatsApp Fulfilled Orders</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#E5E7EB]">
              <Sparkles className="w-5 h-5 text-[#000000] shrink-0" />
              <span>Freshly Processed & Vacuum Packaged</span>
            </div>
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 bg-[#F9FAFB]">
          
          {/* Mode Tabs */}
          <div className="flex border-b border-[#E5E7EB] pb-4 mb-6">
            <button
              onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
              className={`flex-1 text-center py-2 text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'border-[#000000] text-[#000000]'
                  : 'border-transparent text-[#8C7A6B] hover:text-[#000000]'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
              className={`flex-1 text-center py-2 text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'border-[#000000] text-[#000000]'
                  : 'border-transparent text-[#8C7A6B] hover:text-[#000000]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="bg-red-50 text-red-700 border border-red-200 text-xs font-semibold p-3.5 rounded-2xl mb-4">
              ⚠️ {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-[#000000]" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Mobile Phone or Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter mobile no. or email"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] placeholder-[#8C7A6B] outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              <div className="space-y-1">
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
                    className="w-full pl-10 pr-10 py-3 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] placeholder-[#8C7A6B] outline-none focus:border-[#000000]"
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

              <button
                type="submit"
                className="w-full py-3.5 bg-[#000000] hover:bg-[#000000] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md uppercase tracking-wider cursor-pointer mt-2"
              >
                LOGIN
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

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
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#000000] hover:bg-[#000000] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md uppercase tracking-wider cursor-pointer mt-2"
              >
                CREATE ACCOUNT
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
