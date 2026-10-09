import React from 'react';
import { useCart } from '../context/CartContext';
import { ArrowRight } from 'lucide-react';

export default function ComboOfferBanner() {
  const { navigate } = useCart();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* BANNER CONTAINER (NO BOX, INVISIBLE BG FOR CONTENT, BRIGHT IMAGE) */}
      <div className="relative w-full rounded-[24px] sm:rounded-[36px] overflow-hidden shadow-xl border border-[#E5E7EB]/60 bg-white">
        {/* Bright Banner Image */}
        <img
          src="/images/combo_banner.jpg"
          alt="Special Combo Offer Nuts, Dates & Spices"
          className="w-full h-auto object-cover object-center select-none block"
          draggable={false}
        />

        {/* Content Overlay (Background completely invisible, no box/card) */}
        <div className="absolute inset-0 flex flex-col justify-center items-start p-6 sm:p-10 md:p-14 lg:p-16 pointer-events-none">
          <div className="max-w-lg space-y-2 sm:space-y-3">
            {/* Title with shadow for readability directly over bright image */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-serif text-white tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              Handpicked Luxury Hampers
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base font-semibold text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-md line-clamp-2 sm:line-clamp-none">
              Finest assortments of exotic nuts, dried fruits and spices crafted for gifts & celebrations.
            </p>

            {/* Nav Button (pointer-events-auto so only this button is clickable) */}
            <div className="pt-2 sm:pt-3 pointer-events-auto">
              <button
                type="button"
                onClick={() => navigate('combo-deals')}
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-white text-xs sm:text-sm font-bold bg-gradient-to-r from-[#000000] via-[#000000] to-[#000000] hover:from-[#000000] hover:to-[#000000] active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer border border-[#F9FAFB]/30"
              >
                <span>View Special Combos</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
