import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Search, Heart, ShoppingBag, User, Menu, X, LayoutGrid, ChevronRight, Sparkles, Gift, Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { activePage, navigate, cartItemCount, wishlist, setIsSearchOpen, setSearchQuery, user, categories, products, setSelectedProduct } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [navSearchInput, setNavSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(() => {
    const hasAnnouncement = ['home', 'shop', 'about', 'help', 'bulk-orders', 'contact', 'shipping-policy', 'returns-refunds', 'privacy-policy', 'faqs'].includes(activePage);
    return hasAnnouncement ? 104 : 64;
  });

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    let resizeObserver;
    if (headerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(headerRef.current);
    }
    return () => {
      window.removeEventListener('resize', updateHeight);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [activePage]);

  const safeCategories = categories || [];
  const subCategories = safeCategories.filter(c => c.id !== 'all');

  // Filter products for instant live search dropdown popup
  const searchResults = (navSearchInput.trim().length > 0 && products) ? products.filter(p => {
    if (p.status === 'Inactive' || p.active === false) return false;
    const q = navSearchInput.toLowerCase().trim();
    const nameMatch = (p.name || '').toLowerCase().includes(q);
    const catMatch = (p.categoryName || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q);
    const descMatch = (p.description || '').toLowerCase().includes(q);
    return nameMatch || catMatch || descMatch;
  }).slice(0, 6) : [];

  // Close live search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when Category Drawer or Mobile Menu is open
  useEffect(() => {
    if (isCategoryDrawerOpen || isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCategoryDrawerOpen, isMobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearchInput.trim()) {
      setSearchQuery(navSearchInput);
      setIsSearchOpen(true);
      setIsSearchFocused(false);
      navigate('shop', { category: 'all' });
    } else {
      setIsSearchOpen(true);
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-md transition-all"
      >
        
        {/* TOP ANNOUNCEMENT BAR (SHOW ON HOME & TOP LINK PAGES) */}
        {['home', 'shop', 'about', 'help', 'bulk-orders', 'contact', 'shipping-policy', 'returns-refunds', 'privacy-policy', 'faqs'].includes(activePage) && (
          <div className="bg-gradient-to-r from-[#128C7E] via-[#128C7E] to-[#128C7E] text-[#F9FAFB] text-[11px] sm:text-[12px] font-extrabold py-1.5 sm:py-2 px-4 sm:px-6 border-b border-[#128C7E]/30 tracking-wider uppercase shadow-xs">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 lg:gap-8">
              
              {/* Left TV News Right-to-Left Scrolling Ticker */}
              <div className="flex-1 w-full sm:w-auto overflow-hidden flex items-center pr-4 lg:pr-8">
                <marquee behavior="scroll" direction="left" scrollamount="5" className="font-extrabold text-[#F9FAFB] tracking-wider text-[11px] sm:text-[12px] leading-relaxed block my-auto">
                  ORDER ABOVE ₹3500 GET FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp; WE DELIVER ACROSS INDIA &nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp; AUTHENTIC GOURMET SELECTION &nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp; ORDER ABOVE ₹3500 GET FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp; WE DELIVER ACROSS INDIA
                </marquee>
              </div>

              {/* Right Quick Links to Dedicated Pages */}
              <div className="hidden lg:flex items-center gap-4 shrink-0 text-[#F9FAFB]/90 text-[11px] sm:text-[12px] pl-6 border-l border-white/20">
                <button onClick={() => navigate('about')} className="hover:text-[#000000] transition-colors cursor-pointer font-serif">OUR STORY</button>
                <span className="text-white/40">|</span>
                <button onClick={() => navigate('help')} className="hover:text-[#000000] transition-colors cursor-pointer font-serif">HELP CENTER</button>
                <span className="text-white/40">|</span>
                <button onClick={() => navigate('bulk-orders')} className="hover:text-[#000000] transition-colors cursor-pointer font-serif">BULK ORDERS</button>
                <span className="text-white/40">|</span>
                <button onClick={() => navigate('contact')} className="hover:text-[#000000] transition-colors cursor-pointer font-serif">CONTACT US</button>
              </div>

            </div>
          </div>
        )}

        {/* MAIN HEADER ROW */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            
            {/* 1. LEFT: BRAND LOGO WITH IMAGE (Click image to open Categories Drawer) */}
            <div className="flex items-center shrink-0 gap-2 sm:gap-3">
              <button 
                type="button"
                onClick={() => setIsCategoryDrawerOpen(true)}
                title="Browse All Categories"
                className="focus:outline-none cursor-pointer group rounded-full p-0.5 hover:ring-2 hover:ring-[#128C7E] transition-all"
              >
                <img 
                  src="/logo.jpg" 
                  alt="Haji Nuts & Spices Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform"
                />
              </button>

              <button
                type="button"
                onClick={() => navigate('home')}
                className="flex flex-col text-left focus:outline-none cursor-pointer group"
              >
                <span className="text-base sm:text-xl font-black tracking-wider text-black font-serif uppercase leading-none group-hover:text-[#128C7E] transition-colors">
                  HAJI
                </span>
                <span className="text-[10px] sm:text-[11px] font-extrabold text-black tracking-widest uppercase font-serif inline-block mt-0.5 group-hover:text-[#128C7E] transition-colors">
                  NUTS & SPICES
                </span>
              </button>
            </div>

            {/* 2. CENTER: PILL SEARCH BAR WITH LIVE POPUP DROPDOWN (DESKTOP) */}
            <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-lg mx-4 relative">
              <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
                <div className="w-full relative flex items-center bg-white rounded-full border-2 border-[#128C7E] shadow-sm p-1 focus-within:ring-2 focus-within:ring-[#128C7E]/30">
                  <Search className="w-4 h-4 text-gray-500 ml-2.5 shrink-0" />
                  <input
                    type="text"
                    value={navSearchInput}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => {
                      setNavSearchInput(e.target.value);
                      setIsSearchFocused(true);
                    }}
                    placeholder="Search..."
                    className="w-full bg-transparent px-2.5 py-1 text-xs sm:text-sm font-medium text-black focus:outline-none placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="px-4.5 py-1.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-extrabold text-xs rounded-full transition-all tracking-wider uppercase shrink-0 shadow-sm cursor-pointer border border-[#128C7E]"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* INSTANT LIVE SEARCH DROPDOWN RESULTS POPUP */}
              <AnimatePresence>
              {navSearchInput.trim().length > 0 && isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden z-50"
                >
                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-[#E5E7EB]/40 max-h-[380px] overflow-y-auto">
                      {searchResults.map((product) => {
                        const mainPrice = product.weights?.[0]?.price || product.price || 0;
                        return (
                          <div
                            key={product.id}
                            onClick={() => {
                              setIsSearchFocused(false);
                              setNavSearchInput('');
                              navigate('product-details', { product });
                            }}
                            className="p-3 sm:p-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 rounded-xl object-cover border border-[#E5E7EB] shrink-0 group-hover:scale-105 transition-transform"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs sm:text-sm font-bold text-[#000000] group-hover:text-[#000000] transition-colors truncate font-serif">
                                  {product.name}
                                </h4>
                                <p className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider truncate mt-0.5">
                                  {product.categoryName || product.category || 'Gourmet'}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0 pl-3">
                              <span className="text-xs sm:text-sm font-extrabold text-[#000000] font-mono">
                                ₹{Number(mainPrice).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {/* View all results footer link */}
                      <div
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery(navSearchInput);
                          setIsSearchOpen(true);
                          navigate('shop', { category: 'all' });
                        }}
                        className="p-3.5 bg-[#F9FAFB] text-center hover:bg-[#E5E7EB]/40 transition-colors cursor-pointer border-t border-[#E5E7EB]"
                      >
                        <span className="text-xs font-black text-[#000000] hover:underline font-serif">
                          View all results for "{navSearchInput}" →
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center space-y-1.5">
                      <p className="text-xs sm:text-sm font-bold text-[#000000]">No products found matching "{navSearchInput}"</p>
                      <p className="text-[11px] text-[#8C7A6B]">Try searching for almonds, dates, cashew, spices, or honey.</p>
                    </div>
                  )}
                </motion.div>
              )}
              </AnimatePresence>

            </div>

            {/* 3. RIGHT: LINKS, SEARCH ICON & 3-LINE HAMBURGER MENU TOGGLE */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              
              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-6">
                <button
                  onClick={() => navigate('home')}
                  className={`text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-colors ${
                    activePage === 'home' ? 'text-black' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  HOME
                </button>

                <button
                  onClick={() => navigate('shop', { category: 'all' })}
                  className={`text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-colors ${
                    activePage === 'categories' || activePage === 'shop' ? 'text-black' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  SHOP
                </button>



                <button
                  onClick={() => navigate('about')}
                  className={`text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-colors ${
                    activePage === 'about' ? 'text-black' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  ABOUT
                </button>

                <button
                  onClick={() => navigate('contact')}
                  className={`text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-colors ${
                    activePage === 'contact' ? 'text-black' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  CONTACT
                </button>
              </nav>

              {/* User Profile Icon & Name */}
              <button
                onClick={() => navigate(user ? 'profile' : 'login')}
                className="hidden sm:flex items-center gap-1.5 p-1 text-black hover:text-gray-700 transition-colors cursor-pointer"
                title={user ? user.name : "Login / Account"}
              >
                <User className="w-5 h-5" />
                {user && user.name && (
                  <span className="text-[11px] font-extrabold tracking-wider hidden md:block truncate max-w-[120px] uppercase font-serif mt-0.5">
                    {user.name}
                  </span>
                )}
              </button>

              {/* Wishlist Heart Icon */}
              <button
                onClick={() => navigate('wishlist')}
                className="hidden sm:block p-1 text-rose-500 hover:text-rose-600 transition-colors relative cursor-pointer"
                title="My Wishlist"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-rose-500 text-rose-500 transition-transform hover:scale-110" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Shopping Bag Icon */}
              <button
                onClick={() => navigate('cart')}
                className="p-1 text-black hover:text-gray-700 transition-colors relative cursor-pointer"
                title="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#128C7E] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Search Icon Button (Mobile Header) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-1 text-black hover:text-gray-700 transition-colors cursor-pointer"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* 3-LINE HAMBURGER MENU BUTTON (MOBILE ONLY - HIDDEN ON PC/LAPTOP) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-1 text-black hover:text-gray-700 transition-colors cursor-pointer"
                title="Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

            </div>

          </div>

          {/* Mobile Search Input Row with Live Dropdown */}
          <div className="block md:hidden pb-2 relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="w-full relative flex items-center bg-white rounded-full border-2 border-[#128C7E] shadow-sm p-1">
                <Search className="w-4 h-4 text-gray-500 ml-2.5 shrink-0" />
                <input
                  type="text"
                  value={navSearchInput}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setNavSearchInput(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  placeholder="Search products..."
                  className="w-full bg-transparent px-2 py-1 text-xs text-black focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#128C7E] text-white font-bold text-[10px] rounded-full tracking-wider uppercase shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Mobile Live Dropdown Popup */}
            {navSearchInput.trim().length > 0 && isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-[#E5E7EB]/40 max-h-[300px] overflow-y-auto">
                    {searchResults.map((product) => {
                      const mainPrice = product.weights?.[0]?.price || product.price || 0;
                      return (
                        <div
                          key={product.id}
                          onClick={() => {
                            setIsSearchFocused(false);
                            setNavSearchInput('');
                            navigate('product-details', { product });
                          }}
                          className="p-3 flex items-center justify-between hover:bg-[#F9FAFB]"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover border border-[#E5E7EB] shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#000000] truncate">
                                {product.name}
                              </h4>
                              <p className="text-[9px] font-semibold text-[#8C7A6B] uppercase">
                                {product.categoryName || product.category || 'Gourmet'}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-extrabold text-[#000000] font-mono shrink-0 pl-2">
                            ₹{Number(mainPrice).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-[#000000]">No products found matching "{navSearchInput}"</div>
                )}
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Dynamic layout spacer so page content never overlaps fixed header */}
      <div style={{ height: `${headerHeight}px` }} className="w-full shrink-0" aria-hidden="true" />

      {/* 3-LINE HAMBURGER RIGHT SIDE DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end h-screen w-screen overflow-hidden">
          {/* Soft Warm Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-[#3D2314]/35 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Right-sliding Side Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] bg-[#F9FAFB] h-screen shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300 border-l border-[#E5E7EB]">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E5E7EB]/60 flex items-center justify-between shrink-0 bg-[#F9FAFB]">
              <h2 className="text-2xl font-black font-serif text-[#000000]">
                Menú
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-[#000000] hover:text-[#000000] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Menu Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#E5E7EB]/60">
              
              {/* About */}
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('about'); }}
                className="w-full text-left py-4 flex items-center justify-between text-base font-extrabold font-serif text-[#000000] hover:text-[#000000] transition-colors group cursor-pointer"
              >
                <span>About</span>
                <ChevronRight className="w-5 h-5 text-[#8C7A6B] group-hover:text-[#000000] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Help Center */}
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('help'); }}
                className="w-full text-left py-4 flex items-center justify-between text-base font-extrabold font-serif text-[#000000] hover:text-[#000000] transition-colors group cursor-pointer"
              >
                <span>Help Center</span>
                <ChevronRight className="w-5 h-5 text-[#8C7A6B] group-hover:text-[#000000] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Bulk Order */}
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('bulk-orders'); }}
                className="w-full text-left py-4 flex items-center justify-between text-base font-extrabold font-serif text-[#000000] hover:text-[#000000] transition-colors group cursor-pointer"
              >
                <span>Bulk Order</span>
                <ChevronRight className="w-5 h-5 text-[#8C7A6B] group-hover:text-[#000000] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Contact Us */}
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('contact'); }}
                className="w-full text-left py-4 flex items-center justify-between text-base font-extrabold font-serif text-[#000000] hover:text-[#000000] transition-colors group cursor-pointer"
              >
                <span>Contact Us</span>
                <ChevronRight className="w-5 h-5 text-[#8C7A6B] group-hover:text-[#000000] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* All Products & Shop Catalog */}
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('shop', { category: 'all' }); }}
                className="w-full text-left py-4 flex items-center justify-between text-base font-extrabold font-serif text-[#000000] hover:text-[#000000] transition-colors group cursor-pointer"
              >
                <span>Shop All Products</span>
                <ChevronRight className="w-5 h-5 text-[#8C7A6B] group-hover:text-[#000000] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* My Wishlist */}
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('wishlist'); }}
                className="w-full text-left py-4 flex items-center justify-between text-base font-extrabold font-serif text-[#000000] hover:text-[#000000] transition-colors group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>My Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="bg-[#128C7E] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                      {wishlist.length}
                    </span>
                  )}
                </span>
                <ChevronRight className="w-5 h-5 text-[#8C7A6B] group-hover:text-[#000000] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Special Combo Deals */}
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('combo-deals'); }}
                className="w-full text-left py-4 flex items-center justify-between text-base font-extrabold font-serif text-[#000000] hover:text-[#128C7E] transition-colors group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>Special Combo Deals</span>
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    🔥 FESTIVE
                  </span>
                </span>
                <ChevronRight className="w-5 h-5 text-[#8C7A6B] group-hover:text-[#128C7E] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Exclusive Offers */}
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('offers'); }}
                className="w-full text-left py-4 flex items-center justify-between text-base font-extrabold font-serif text-[#000000] hover:text-[#128C7E] transition-colors group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>Exclusive Offers & Coupons</span>
                  <span className="bg-[#128C7E] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    🎟️ VOUCHERS
                  </span>
                </span>
                <ChevronRight className="w-5 h-5 text-[#8C7A6B] group-hover:text-[#128C7E] group-hover:translate-x-1 transition-transform" />
              </button>

            </div>

            {/* Drawer Footer */}
            <div className="p-6 bg-[#E5E7EB]/30 border-t border-[#E5E7EB] shrink-0 text-center space-y-2">
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('admin'); }}
                className="text-xs font-extrabold text-[#000000] hover:underline cursor-pointer block w-full"
              >
                Admin Portal Login →
              </button>
              <p className="text-[10px] font-semibold text-[#8C7A6B]">
                © HAJI NUTS & SPICES - Gourmet Selection
              </p>
            </div>

          </div>
        </div>
      )}

      {/* FULL HEIGHT LEFT SIDE PROFESSIONAL CATEGORY & DEALS DRAWER OVERLAY */}
      {isCategoryDrawerOpen && (
        <div className="fixed inset-0 z-50 flex h-screen w-screen overflow-hidden">
          {/* Soft Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsCategoryDrawerOpen(false)}
          />

          {/* Luxury Executive Side Drawer Panel */}
          <div className="relative w-84 sm:w-96 max-w-[90vw] bg-white h-screen shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300 border-r border-[#E5E7EB]">
            
            {/* 1. Brand Header */}
            <div className="p-5 bg-gradient-to-r from-[#128C7E] to-[#0e7064] text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white p-0.5 shadow-sm shrink-0">
                  <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" />
                </div>
                <div>
                  <h2 className="text-base font-black font-serif tracking-wider uppercase leading-tight">
                    Haji Nuts & Spices
                  </h2>
                  <span className="text-[10px] font-extrabold text-emerald-200 tracking-widest uppercase block mt-0.5">
                    Gourmet Catalog & Deals
                  </span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Scrollable Body with Isolated Scrolling */}
            <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-gray-100 min-h-0 bg-[#FDFBF7]/40">
              
              {/* SPECIAL SPOTLIGHT: COMBOS & OFFERS SECTION */}
              <div className="p-4 space-y-2.5 bg-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#128C7E] block">
                  Exclusive Deals & Privileges
                </span>

                {/* Combo Deals Card */}
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryDrawerOpen(false);
                    navigate('combo-deals');
                  }}
                  className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70 border border-amber-200/90 hover:border-amber-400 shadow-xs hover:shadow-md transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-gray-950 font-serif">
                          Special Combo Deals
                        </span>
                        <span className="px-1.5 py-0.2 bg-amber-500 text-white font-black text-[9px] rounded-md uppercase">
                          SAVE 35%
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-900/80 font-medium mt-0.5">
                        Luxury gift hampers, health & biryani kits
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* Gourmet Offers Card */}
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryDrawerOpen(false);
                    navigate('offers');
                  }}
                  className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/70 border border-emerald-200/90 hover:border-[#128C7E] shadow-xs hover:shadow-md transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#128C7E] text-white flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-gray-950 font-serif">
                          Gourmet Vouchers & Offers
                        </span>
                        <span className="px-1.5 py-0.2 bg-[#128C7E] text-white font-black text-[9px] rounded-md uppercase">
                          ACTIVE
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-900/80 font-medium mt-0.5">
                        Harvest discount codes & seasonal coupons
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#128C7E] group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>

              {/* ALL PRODUCT CATEGORIES SECTION */}
              <div className="py-3 bg-white">
                <div className="px-5 pb-2 pt-1 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Product Categories ({subCategories.length})
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">
                    Select to browse
                  </span>
                </div>

                <div className="space-y-0.5">
                  {subCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setIsCategoryDrawerOpen(false);
                        navigate('category', { category: cat.id });
                      }}
                      className="w-full text-left px-5 py-3 hover:bg-[#F9FAFB] flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#E5E7EB] group-hover:border-[#128C7E] shadow-2xs shrink-0 transition-all bg-[#F9FAFB]">
                          <img 
                            src={cat.image} 
                            alt={cat.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-900 group-hover:text-[#128C7E] transition-colors truncate font-serif">
                          {cat.name}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#128C7E] group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* 3. Drawer Footer */}
            <div className="p-4 bg-gray-50 border-t border-[#E5E7EB] space-y-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryDrawerOpen(false);
                  navigate('shop', { category: 'all' });
                }}
                className="w-full py-2.5 px-4 bg-[#128C7E] hover:bg-[#0e7064] text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <span>View Full Shop Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] font-semibold text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Pure Origin
                </span>
                <span>•</span>
                <span>Pan-India Delivery</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
