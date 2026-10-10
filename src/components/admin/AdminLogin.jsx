import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const { loginAdmin, navigate } = useCart();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = loginAdmin(email, password);
    if (!res.success) {
      setError(res.message || 'Invalid Email or Password');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      
      {/* Background Ambient Glow Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#128C7E]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#128C7E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-3xl shadow-xl p-8 relative z-10 text-gray-800">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#F9FAFB] mx-auto mb-4 shadow-sm flex items-center justify-center border border-[#E5E7EB]">
            <ShieldCheck className="w-8 h-8 text-[#000000]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#000000]">
            Admin Portal Login
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            NUTS & SPICES Control Panel Authentication
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5 tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Admin Email"
                className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-gray-900 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5 tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-gray-900 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#128C7E] hover:bg-[#128C7E] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg border border-[#000000] transition-all transform active:scale-98 mt-3 cursor-pointer"
          >
            Sign In To Admin Portal
          </button>
        </form>

      </div>
    </div>
  );
}

