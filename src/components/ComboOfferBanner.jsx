import React from 'react';
import { useCart } from '../context/CartContext';

export default function ComboOfferBanner() {
  const { navigate, isCombosPageEnabled = true } = useCart();

  if (!isCombosPageEnabled) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* BANNER CONTAINER (Clean, fully visible image banner with click to navigate) */}
      <div 
        role="button"
        tabIndex={0}
        onClick={() => navigate('combo-deals')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate('combo-deals');
          }
        }}
        title="View Special Combo Offers"
        className="relative w-full rounded-[24px] sm:rounded-[36px] overflow-hidden shadow-xl border border-[#E5E7EB]/60 bg-white cursor-pointer group transition-all duration-300 hover:shadow-2xl"
      >
        {/* Bright Banner Image showing all graphic contents cleanly */}
        <img
          src="/images/combo_banner.jpg"
          alt="Special Combo Offer Nuts, Dates & Spices - Up to 40% Off"
          className="w-full h-auto object-cover object-center select-none block transition-transform duration-500 group-hover:scale-[1.01]"
          draggable={false}
        />
      </div>
    </section>
  );
}
