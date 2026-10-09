import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import ComboOfferBanner from '../components/ComboOfferBanner';
import TestimonialsSection from '../components/TestimonialsSection';
import FeaturedTodaySection from '../components/FeaturedTodaySection';
import BestSellingSection from '../components/BestSellingSection';

const HERO_SLIDES = [
  { id: 1, image: '/images/hero1.png' },
  { id: 2, image: '/images/hero2.jpg' },
  { id: 3, image: '/images/hero3.jpg' }
];

export default function HomePage() {
  const { navigate, categories } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);

  // 5.5 Seconds Automatic Cinematic Zoom & Crossfade Transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  const categoriesList = (categories || []).filter(c => c.id !== 'all');

  return (
    <div className="space-y-16 pb-16">
      
      {/* CINEMATIC ZOOM & CROSSFADE HERO BANNER (ONLY IMAGES - NO EXTRA OVERLAYS) */}
      <section className="relative w-full m-0 p-0 overflow-hidden shadow-md h-[190px] sm:h-[280px] md:h-[350px] lg:h-[420px] bg-[#F9FAFB]">
        
        {/* STACKED ZOOM & CROSSFADE BANNER SLIDES */}
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div 
              key={slide.id} 
              className={`absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt="Nuts & Spices Premium Banner"
                className={`w-full h-full object-cover select-none brightness-105 contrast-105 filter transform transition-transform duration-[6500ms] ease-out ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
                draggable={false}
              />
            </div>
          );
        })}

      </section>

      {/* SHOP BY CATEGORY GRID SECTION (MATCHING USER REFERENCE DESIGN) */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-[#000000]">
            Explore categories
          </h2>
          <div className="w-12 h-1 bg-[#000000] mx-auto rounded-full" />
          <p className="text-xs sm:text-base font-serif italic text-[#000000] leading-relaxed pt-1">
            Experience the finest selection of premium dates, exotic nuts, and artisanal wellness blends.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
          {categoriesList.map(cat => (
            <div
              key={cat.id}
              onClick={() => {
                navigate('category', { category: cat.id });
              }}
              className="group cursor-pointer flex flex-col items-center text-center space-y-3"
            >
              {/* Rounded Square Image Box */}
              <div className="w-full aspect-square rounded-[28px] overflow-hidden bg-white shadow-md group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1.5 border border-[#E5E7EB]/60 relative">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bold Uppercase Category Name Below */}
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#000000] group-hover:text-[#000000] transition-colors leading-tight line-clamp-2 px-1 font-serif">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED TODAY CAROUSEL SECTION (HANDPICKED FOR YOU) */}
      <FeaturedTodaySection />

      {/* BEST SELLING PRODUCTS CAROUSEL SECTION (FRESH FROM HARVEST) */}
      <BestSellingSection />

      {/* EXCLUSIVE COMBO OFFER PROMO BANNER SECTION */}
      <ComboOfferBanner />

      {/* CUSTOMER REVIEWS / TESTIMONIALS SECTION (OUR HAPPY HARVEST TRIBE) */}
      <TestimonialsSection />

    </div>
  );
}
