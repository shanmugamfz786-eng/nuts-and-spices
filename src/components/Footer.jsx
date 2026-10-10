import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { STORE_WHATSAPP_NUMBER } from '../data/products';

export default function Footer() {
  const { navigate, categories, storeSettings } = useCart();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to format category names with neat casing
  const formatCategoryName = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
      .replace(/\bAnd\b/gi, '&');
  };

  // Real store categories list (filtered & clean)
  const allValidCategories = (categories && categories.length > 0)
    ? categories.filter(c => c.id !== 'all')
    : [
        { id: 'nuts-dry-fruits', name: 'NUTS & DRY FRUITS', isPremium: true },
        { id: 'dates', name: 'DATES', isPremium: true },
        { id: 'honey', name: 'HONEY', isPremium: true },
        { id: 'masala', name: 'MASALA', isPremium: true },
        { id: 'seeds-items', name: 'SEEDS ITEMS', isPremium: true },
        { id: 'malt-beverages', name: 'MALT & BEVERAGES', isPremium: true },
        { id: 'rice-millet', name: 'RICE & MILLET', isPremium: true },
        { id: 'soup', name: 'SOUP', isPremium: true },
        { id: 'herbals', name: 'HERBALS', isPremium: true },
        { id: 'viral-product', name: 'VIRAL PRODUCT', isPremium: true }
      ];

  // Admin managed Premium Categories (shows only what Admin has marked/added as Premium)
  const adminPremiumCategories = allValidCategories.filter(c => c.isPremium);
  const displayCategories = adminPremiumCategories.length > 0
    ? adminPremiumCategories.slice(0, 10)
    : allValidCategories.slice(0, 10);

  return (
    <footer className="bg-[#128C7E] text-[#000000] pt-16 pb-12 border-t-2 border-[#075E54] relative shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* TOP SECTION: 4 COLUMNS LAYOUT MATCHING USER REFERENCE SCREENSHOT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#075E54]">
          
          {/* COL 1: BRAND LOGO, SLOGAN & CIRCULAR SOCIAL ICONS (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-wider text-[#000000] uppercase">
                HAJI
              </h3>
              <p className="text-sm font-extrabold font-serif text-[#000000] tracking-widest uppercase">
                NUTS & SPICES
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#000000] font-semibold leading-relaxed max-w-sm font-serif">
              Providing the finest quality of premium dates, handpicked nuts, authentic spices, and healthy snacks. Traditional quality, delivered for your health.
            </p>

            {/* CIRCULAR SOCIAL MEDIA BUTTONS */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-white/50 bg-white flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-white transition-all duration-300 shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-white/50 bg-white flex items-center justify-center text-[#E4405F] hover:bg-[#E4405F] hover:text-white hover:border-white transition-all duration-300 shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full border border-white/50 bg-white flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000] hover:text-white hover:border-white transition-all duration-300 shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              <a
                href={`https://wa.me/${storeSettings?.whatsappNumber || '919876543210'}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Store Support"
                className="w-10 h-10 rounded-full border border-white/50 bg-white flex items-center justify-center text-[#128C7E] hover:bg-[#128C7E] hover:text-white hover:border-white transition-all duration-300 shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4.5 h-4.5 fill-current" />
              </a>
            </div>
          </div>

          {/* COL 2: QUICK LINKS (2 COLS) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#000000] tracking-widest uppercase font-serif">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#000000] font-semibold font-medium">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-gray-900 hover:font-bold transition-all cursor-pointer">Home</button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-gray-900 hover:font-bold transition-all cursor-pointer">About Us</button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'all' })} className="hover:text-gray-900 hover:font-bold transition-all cursor-pointer">Shop</button>
              </li>
              <li>
                <button onClick={() => navigate('bulk-orders')} className="hover:text-gray-900 hover:font-bold transition-all cursor-pointer">Bulk Orders</button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-gray-900 hover:font-bold transition-all cursor-pointer">Contact</button>
              </li>
            </ul>
          </div>

          {/* COL 3: CUSTOMER HELP (2 COLS) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#000000] tracking-widest uppercase font-serif">
              CUSTOMER HELP
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#000000] font-semibold font-medium">
              <li>
                <button onClick={() => navigate('shipping-policy')} className="hover:text-gray-900 hover:font-bold transition-all cursor-pointer">Shipping Policy</button>
              </li>
              <li>
                <button onClick={() => navigate('returns-refunds')} className="hover:text-gray-900 hover:font-bold transition-all cursor-pointer">Returns & Refunds</button>
              </li>
              <li>
                <button onClick={() => navigate('privacy-policy')} className="hover:text-gray-900 hover:font-bold transition-all cursor-pointer">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => navigate('terms-conditions')} className="hover:text-gray-900 hover:font-bold transition-all cursor-pointer">Terms & Conditions</button>
              </li>
              <li>
                <button onClick={() => navigate('faqs')} className="hover:text-gray-900 hover:font-bold transition-all cursor-pointer">FAQs</button>
              </li>
            </ul>
          </div>

          {/* COL 4: SHOP PREMIUM CATEGORIES (4 COLS WITH 2 SUB-COLUMNS) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#000000] tracking-widest uppercase font-serif">
              SHOP PREMIUM CATEGORIES
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs sm:text-sm text-[#000000] font-semibold font-medium">
              {displayCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate('category', { category: cat.id })}
                  className="text-left hover:text-gray-900 hover:font-bold transition-all cursor-pointer truncate"
                  title={cat.name}
                >
                  {formatCategoryName(cat.name)}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM BAR: COPYRIGHT & ACCEPTED PAYMENTS BADGE */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2 text-xs text-[#000000] font-semibold">
          
          {/* Copyright text */}
          <p className="font-medium text-center md:text-left">
            © {new Date().getFullYear()} HAJI NUTS & SPICES. Delivering health and quality.
          </p>

          {/* Accepted Payments Label & Badges */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-extrabold text-[#000000] tracking-widest uppercase font-serif">
              ACCEPTED PAYMENTS
            </span>
            <div className="flex items-center gap-1.5 opacity-95">
              <span className="px-2 py-0.5 bg-white border border-[#075E54] rounded text-[10px] font-bold tracking-wider text-[#128C7E]">UPI</span>
              <span className="px-2 py-0.5 bg-white border border-[#075E54] rounded text-[10px] font-bold tracking-wider text-[#128C7E]">CARD</span>
              <span className="px-2 py-0.5 bg-white border border-[#075E54] rounded text-[10px] font-bold tracking-wider text-[#128C7E]">COD</span>
            </div>
          </div>

        </div>

      </div>

      {/* FLOATING FIXED SCROLL TO TOP BUTTON (SHOWS ONLY ON SCROLL DOWN) */}
      <button
        onClick={scrollToTop}
        title="Scroll to Top"
        aria-label="Scroll to Top"
        className={`fixed bottom-20 md:bottom-8 right-5 md:right-8 z-50 w-12 h-12 rounded-full bg-white hover:bg-gray-100 text-[#128C7E] flex items-center justify-center shadow-xl border border-[#075E54] cursor-pointer transition-all duration-300 transform ${
          showScrollTop 
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto hover:-translate-y-1' 
            : 'opacity-0 scale-75 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>

    </footer>
  );
}
