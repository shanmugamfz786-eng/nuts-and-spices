import React from 'react';
import { useCart } from '../context/CartContext';
import { Tag, ArrowLeft } from 'lucide-react';

export default function OffersPage() {
  const { navigate } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 bg-[#F9FAFB] rounded-full flex items-center justify-center mx-auto text-3xl border border-[#E5E7EB] shadow-inner text-[#000000]">
        <Tag className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-[#000000] uppercase tracking-widest block">
          Special Discounts & Festivals
        </span>
        <h1 className="text-3xl font-black font-serif text-[#000000]">
          Exclusive Offers & Bundles
        </h1>
        <p className="text-xs sm:text-sm text-[#8C7A6B] max-w-md mx-auto">
          Offer details and promotional coupons will be added here soon! Check back for festive discounts on nuts and spice bundles.
        </p>
      </div>

      <div className="p-8 bg-white rounded-3xl border border-[#E5E7EB] shadow-sm max-w-lg mx-auto text-xs text-[#8C7A6B] italic">
        [ Offers content placeholder ready for future update ]
      </div>

      <button
        onClick={() => navigate('shop', { category: 'all' })}
        className="px-6 py-3 bg-[#000000] text-white font-bold text-xs rounded-xl inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shop</span>
      </button>
    </div>
  );
}
