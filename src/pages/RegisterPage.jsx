import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Mail, Lock, User, Phone, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck, LogIn, Gift } from 'lucide-react';

export default function RegisterPage() {
  const { user, registerUser, navigate } = useCart();
  const [showPassword, setShowPassword] = useState(false);
  
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-lg">
          <h2 className="text-2xl font-black font-serif text-[#000000]">Already Registered!</h2>
          <p className="text-xs text-[#8C7A6B] mt-2">You are currently logged in as {user.name}.</p>
          <button
            onClick={() => navigate('shop', { category: 'all' })}
            className="mt-6 px-6 py-3 bg-[#000000] text-white font-bold text-xs rounded-2xl uppercase tracking-wider cursor-pointer"
          >
            BROWSE SHOP CATALOG
          </button>
        </div>
      </div>
    );
  }

  const handleRegisterSubmit = async (e) => {
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
      email: regEmail.trim() || `${regName.toLowerCase().replace(/\s+/g, '')}@nutsandspices.in`,
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
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E5E7EB]">
        
        {/* Registration Form */}
        <div className="p-8 sm:p-10 bg-[#F9FAFB]">
          
          <div className="mb-6">
            <h3 className="text-2xl font-black font-serif text-[#000000]">
              Member Registration
            </h3>
            <p className="text-xs text-[#8C7A6B] mt-1">
              Fill in your details below to create your free account.
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
              <CheckCircle2 className="w-4 h-4 text-[#128C7E]" />
              <span>{successMessage}</span>
            </div>
          )}

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
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#128C7E]"
                />
              </div>
            </div>

            {/* Mobile Phone */}
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
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#128C7E]"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#128C7E]"
                />
              </div>
            </div>

            {/* Create Password */}
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
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#128C7E]"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#128C7E]"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="reg-terms"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded text-[#000000] focus:ring-[#128C7E]"
              />
              <label htmlFor="reg-terms" className="text-[11px] text-[#000000]">
                I agree to Nuts & Spices Terms of Service & Privacy Policy.
              </label>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md uppercase tracking-wider cursor-pointer mt-2"
            >
              CREATE MY ACCOUNT
            </button>

            {/* Link to Login */}
            <div className="text-center pt-4 border-t border-[#E5E7EB]">
              <span className="text-xs text-[#8C7A6B]">Already have an account? </span>
              <button
                type="button"
                onClick={() => navigate('login')}
                className="text-xs font-bold text-[#128C7E] hover:underline cursor-pointer"
              >
                Login Here →
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
