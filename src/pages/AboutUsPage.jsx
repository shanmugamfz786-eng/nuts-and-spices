import React from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, BookOpen, ShieldCheck, ShoppingBag, HeartHandshake, Sparkles, MessageSquare } from 'lucide-react';
import { STORE_WHATSAPP_NUMBER } from '../data/products';

export default function AboutUsPage() {
  const { navigate, storeSettings } = useCart();

  const sections = [
    {
      id: 'story',
      title: 'Our Story',
      icon: BookOpen,
      color: 'bg-[#8B3A13]',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
      description: 'Founded with a deep passion for authenticity and health, NUTS & SPICES began its journey by sourcing directly from heritage farms and spice gardens across the Western Ghats, Kashmir, and international estates. We believe that true flavor and nutrition start at the source. Over the years, we have grown from a modest family initiative into a trusted gourmet destination, connecting thousands of families with unadulterated, farm-fresh ingredients crafted by nature.'
    },
    {
      id: 'quality',
      title: 'Our Quality',
      icon: ShieldCheck,
      color: 'bg-[#D4AF37]',
      image: 'https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=800',
      description: 'Quality is non-negotiable at NUTS & SPICES. Every single batch of jumbo almonds, cardamom pods, and organic seeds undergoes rigorous hand-sorting, moisture testing, and hygienic multi-stage processing. We maintain strict zero-adulteration standards with zero artificial colors, synthetic flavors, or harmful chemical preservatives. Sealed in food-grade, nitrogen-flushed packages, we lock in original aromas and crisp texture.'
    },
    {
      id: 'products',
      title: 'Our Products',
      icon: ShoppingBag,
      color: 'bg-[#A04000]',
      image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=800',
      description: 'Our carefully curated pantry spans across California Jumbo Almonds, Mangalore W240 Cashews, Afghan Anjeer, Royal Kimia & Ajwa Dates, telling a story of rich taste and supreme nutrition. From hand-ground aromatic masalas and unpolished traditional millets to wild forest honey and superfood seed mixes, each item is packed with essential vitamins, minerals, and healthy fats for your daily wellness.'
    },
    {
      id: 'promise',
      title: 'Our Promise',
      icon: HeartHandshake,
      color: 'bg-[#D4AF37]',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
      description: 'We promise 100% transparency, freshness, and utmost customer convenience. We have eliminated complicated online payment gateways so you can browse, customize pack sizes, and instantly dispatch orders directly to our store team via WhatsApp. We promise fast doorstep delivery, honest weight measurements, and prompt personal customer support for every single package shipped.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('home')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#8B3A13] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>

      {/* Hero Header Section (Warm Royal Spice Gradient - ZERO DARK SHADES) */}
      <div className="bg-gradient-to-br from-[#8B3A13] via-[#A04000] to-[#B8860B] text-white p-8 sm:p-14 rounded-3xl space-y-6 relative overflow-hidden border border-[#D4AF37]/40 shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 border border-[#D4AF37]/50 text-[#FAF5EF] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <span>Heritage & Quality Excellence</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-serif text-white">
          About NUTS & SPICES
        </h1>

        {/* Brand Story Highlight Banner */}
        <div className="p-6 bg-white/15 rounded-2xl backdrop-blur-md border border-white/25 max-w-3xl">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FAF5EF] block mb-2">
            Brand Story
          </span>
          <p className="text-sm sm:text-lg text-white leading-relaxed font-medium font-serif italic">
            "We bring carefully selected nuts, dry fruits, seeds and authentic spices directly to customers with a focus on quality, freshness and convenience."
          </p>
        </div>
      </div>

      {/* 4 Core Sections with Long Content & Matching Images */}
      <div className="space-y-12">
        {sections.map((sec, idx) => {
          const IconComponent = sec.icon;
          const isEven = idx % 2 === 0;

          return (
            <div
              key={sec.id}
              className={`bg-white rounded-3xl border border-[#E6D7C3] shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 items-center ${
                !isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Box */}
              <div className={`lg:col-span-5 h-64 sm:h-80 rounded-2xl overflow-hidden relative shadow-inner bg-[#FAF5EF] ${
                !isEven ? 'lg:order-2' : 'lg:order-1'
              }`}>
                <img
                  src={sec.image}
                  alt={sec.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute top-4 left-4 p-3 rounded-2xl ${sec.color} text-white shadow-lg`}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>

              {/* Long Content Box */}
              <div className={`lg:col-span-7 space-y-4 ${
                !isEven ? 'lg:order-1' : 'lg:order-2'
              }`}>
                <h3 className="text-2xl sm:text-3xl font-black font-serif text-[#2B1509]">
                  {sec.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#4A3525] leading-relaxed">
                  {sec.description}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* WhatsApp Support CTA */}
      <div className="bg-[#FAF5EF] p-8 sm:p-12 rounded-3xl border border-[#E6D7C3] text-center space-y-6">
        <h3 className="text-2xl font-black font-serif text-[#2B1509]">
          Experience Pure Gourmet Goodness Today
        </h3>
        <p className="text-xs sm:text-sm text-[#8C7A6B] max-w-xl mx-auto">
          Explore our collection or chat directly with our store manager on WhatsApp for custom orders and gifting inquiries.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('shop', { category: 'all' })}
            className="px-8 py-3.5 bg-[#8B3A13] hover:bg-[#A04000] text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Explore Shop Catalog
          </button>

          <a
            href={`https://wa.me/${storeSettings?.whatsappNumber || '919876543210'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#B8860B] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

    </div>
  );
}
