import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { ShieldCheck, Lock, Mail, AlertCircle, Store } from 'lucide-react';

export default function AdminLogin() {
  const { loginAdmin, navigate } = useCart();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await loginAdmin(email, password);
    if (!res.success) {
      setError(res.message || 'Invalid Email or Password');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between p-4 relative overflow-hidden font-sans select-none">
      
      {/* Background Ambient Glow Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#128C7E]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#128C7E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full max-w-5xl mx-auto py-3 px-4 flex items-center justify-between z-20 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/80 shadow-xs mb-6">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.jpg" 
            alt="Haji Logo" 
            className="w-9 h-9 object-contain rounded-xl border border-gray-200 bg-white shadow-2xs" 
          />
          <div className="flex flex-col text-left">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 font-serif leading-none">
              HAJI NUTS & SPICES
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
              Enterprise Admin Portal
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#075E54] border border-emerald-200/70 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
        >
          <Store className="w-4 h-4" />
          <span>View Store</span>
        </button>
      </header>

      {/* Center Login Card */}
      <div className="w-full max-w-md mx-auto bg-white border border-[#E5E7EB] rounded-3xl shadow-xl p-6 sm:p-8 relative z-10 text-gray-800 my-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 mx-auto mb-4 shadow-sm flex items-center justify-center border border-emerald-100">
            <ShieldCheck className="w-8 h-8 text-[#075E54]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Admin Portal Login
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Gourmet Store Control Panel Authentication
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
                className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#075E54] rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-gray-900 outline-none transition-colors"
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
                className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#075E54] rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-gray-900 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#075E54] hover:bg-[#05463e] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all transform active:scale-98 mt-3 cursor-pointer"
          >
            Sign In To Admin Portal
          </button>
        </form>

        <div className="mt-6 text-center pt-4 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="text-xs font-bold text-gray-500 hover:text-emerald-800 transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            ← Return to Store Home
          </button>
        </div>

      </div>

      {/* Footer Branding Note */}
      <footer className="text-center py-2 text-[11px] text-gray-400 font-mono">
        Haji Gourmet Enterprise Portal &bull; Secure Session
      </footer>

    </div>
  );
}
