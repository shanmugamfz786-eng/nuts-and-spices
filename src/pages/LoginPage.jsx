import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const { user, loginUser, logoutUser, navigate, loginAdmin } = useCart();
  const [showPassword, setShowPassword] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E6D7C3] shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-[#FAF5EF] border border-[#8B3A13] text-[#8B3A13] rounded-full flex items-center justify-center mx-auto text-3xl font-black font-serif shadow-inner">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block">
              Gourmet Member Profile
            </span>
            <h1 className="text-3xl font-black font-serif text-[#2B1509] mt-1">
              Welcome Back, {user.name}!
            </h1>
            <p className="text-xs sm:text-sm text-[#8C7A6B] mt-1">
              {user.email || user.phone}
            </p>
          </div>

          <div className="bg-[#FAF5EF] p-5 rounded-2xl border border-[#E6D7C3] grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#8B3A13] block">Member Phone</span>
              <span className="text-xs font-bold text-[#2B1509]">{user.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#8B3A13] block">Member Email</span>
              <span className="text-xs font-bold text-[#2B1509]">{user.email || 'N/A'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('shop', { category: 'all' })}
              className="px-8 py-3.5 bg-[#8B3A13] hover:bg-[#6E2C00] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md uppercase tracking-wider flex items-center gap-2 cursor-pointer"
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
      setErrorMessage(res?.message || 'Invalid mobile/email or password.');
    }
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
      navigate('home');
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E6D7C3]">
        
        {/* Login Form */}
        <div className="p-8 sm:p-10 bg-[#FAF5EF] flex flex-col justify-center">
          
          <div className="mb-6">
            <h3 className="text-2xl font-black font-serif text-[#2B1509]">
              Account Login
            </h3>
            <p className="text-xs text-[#8C7A6B] mt-1">
              Enter your registered mobile number or email address below.
            </p>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="bg-red-50 text-red-700 border border-red-200 text-xs font-semibold p-3.5 rounded-2xl mb-4">
              ⚠️ {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-[#8B3A13]" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Mobile / Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A3525]">
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
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E6D7C3] rounded-2xl text-xs font-semibold text-[#2B1509] placeholder-[#8C7A6B] outline-none focus:border-[#8B3A13] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A3525]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your mobile via WhatsApp.')}
                  className="text-[11px] font-bold text-[#8B3A13] hover:underline cursor-pointer"
                >
                  Forgot Password?
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
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[#E6D7C3] rounded-2xl text-xs font-semibold text-[#2B1509] placeholder-[#8C7A6B] outline-none focus:border-[#8B3A13] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#2B1509] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="login-remember"
                defaultChecked
                className="rounded text-[#8B3A13] focus:ring-[#8B3A13]"
              />
              <label htmlFor="login-remember" className="text-xs font-medium text-[#4A3525]">
                Remember me on this browser
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#8B3A13] hover:bg-[#6E2C00] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md hover:shadow-lg uppercase tracking-wider cursor-pointer mt-2"
            >
              LOGIN TO ACCOUNT
            </button>



            {/* Mobile Link to Register */}
            <div className="text-center pt-4 border-t border-[#E6D7C3]">
              <span className="text-xs text-[#8C7A6B]">Don't have an account? </span>
              <button
                type="button"
                onClick={() => navigate('register')}
                className="text-xs font-bold text-[#8B3A13] hover:underline cursor-pointer"
              >
                Register Here →
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
