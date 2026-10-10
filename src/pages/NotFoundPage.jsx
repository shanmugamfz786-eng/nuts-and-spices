import React from 'react';
import { useCart } from '../context/CartContext';
import { AlertTriangle, Home, ShoppingBag } from 'lucide-react';

export default function NotFoundPage() {
  const { navigate } = useCart();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5E7EB] shadow-xl text-center max-w-lg w-full space-y-6">
        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse shadow-inner">
          <AlertTriangle className="w-12 h-12" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-black font-serif text-[#000000]">404</h1>
          <h2 className="text-2xl font-bold font-serif text-[#000000]">Page Not Found</h2>
          <p className="text-sm text-[#8C7A6B] leading-relaxed max-w-sm mx-auto">
            Oops! The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('home')}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </button>
          
          <button
            onClick={() => navigate('shop', { category: 'all' })}
            className="w-full sm:w-auto px-6 py-3.5 bg-white border border-[#128C7E] text-[#128C7E] hover:bg-gray-50 font-extrabold text-xs rounded-2xl transition-all shadow-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
