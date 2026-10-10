import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Search, Heart, ShoppingBag, User, Menu, X, LayoutGrid, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { activePage, navigate, cartItemCount, wishlist, setIsSearchOpen, setSearchQuery, user, categories, products, setSelectedProduct } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [navSearchInput, setNavSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-md transition-all">
        
        {/* TOP ANNOUNCEMENT BAR (SHOW ON HOME & TOP LINK PAGES) */}
        {['home', 'about', 'help', 'bulk-orders', 'contact', 'shipping-policy', 'returns-refunds', 'privacy-policy', 'faqs'].includes(activePage) && (
          <div className="bg-gradient-to-r from-[#25D366] via-[#25D366] to-[#25D366] text-[#F9FAFB] text-[11px] sm:text-[12px] font-extrabold py-1.5 sm:py-2 px-4 sm:px-6 border-b border-[#25D366]/30 tracking-wider uppercase shadow-xs">
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
            
            {/* 1. LEFT: BRAND LOGO WITH IMAGE */}
            <div className="flex items-center shrink-0">
              <button 
                onClick={() => navigate('home')}
                className="flex items-center gap-2 sm:gap-3 focus:outline-none cursor-pointer group"
              >
                <img 
                  src="/logo.jpg" 
                  alt="Haji Nuts & Spices Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col text-left">
                  <span className="text-base sm:text-xl font-black tracking-wider text-black font-serif uppercase leading-none">
                    HAJI
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-black tracking-widest uppercase font-serif inline-block mt-0.5">
                    NUTS & SPICES
                  </span>
                </div>
              </button>
            </div>

            {/* 2. CENTER: PILL SEARCH BAR WITH LIVE POPUP DROPDOWN (DESKTOP) */}
            <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-lg mx-4 relative">
              <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
                <div className="w-full relative flex items-center bg-white rounded-full border border-black shadow-sm p-1 focus-within:ring-2 focus-within:ring-black/30">
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
                    className="px-4.5 py-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-extrabold text-xs rounded-full transition-all tracking-wider uppercase shrink-0 shadow-sm cursor-pointer border border-[#25D366]"
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
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
              <div className="w-full relative flex items-center bg-white rounded-full border border-black shadow-sm p-1">
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
                  className="px-4 py-1.5 bg-[#25D366] text-white font-bold text-[10px] rounded-full tracking-wider uppercase shrink-0"
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
                    <span className="bg-[#000000] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </span>
                <ChevronRight className="w-5 h-5 text-[#8C7A6B] group-hover:text-[#000000] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Exclusive Offers */}
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('offers'); }}
                className="w-full text-left py-4 flex items-center justify-between text-base font-extrabold font-serif text-[#000000] hover:text-[#000000] transition-colors group cursor-pointer"
              >
                <span>Exclusive Offers</span>
                <ChevronRight className="w-5 h-5 text-[#8C7A6B] group-hover:text-[#000000] group-hover:translate-x-1 transition-transform" />
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

      {/* FULL HEIGHT LEFT SIDE CATEGORY DRAWER OVERLAY */}
      {isCategoryDrawerOpen && (
        <div className="fixed inset-0 z-50 flex h-screen w-screen overflow-hidden">
          {/* Soft Warm Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-[#3D2314]/35 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsCategoryDrawerOpen(false)}
          />

          {/* Side Drawer Content Panel */}
          <div className="relative w-80 max-w-[85vw] bg-white h-screen shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300 border-r border-[#E5E7EB]">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB] shrink-0">
              <h2 className="text-xl font-extrabold font-serif tracking-wider text-[#000000] uppercase">
                CATEGORIES
              </h2>
              <button
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="p-1 text-[#8C7A6B] hover:text-[#000000] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Category List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#E5E7EB]/50 py-2 min-h-0 bg-white">
              {subCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setIsCategoryDrawerOpen(false);
                    navigate('category', { category: cat.id });
                  }}
                  className="w-full text-left px-5 py-3.5 text-xs font-bold text-[#000000] hover:bg-[#F9FAFB] flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full overflow-hidden border border-[#E5E7EB] group-hover:border-[#000000] shadow-xs shrink-0 transition-all bg-[#F9FAFB]">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#000000] group-hover:text-[#000000]">
                      {cat.name}
                    </span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8C7A6B] group-hover:text-[#000000] group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E7EB] text-center shrink-0">
              <button
                onClick={() => {
                  setIsCategoryDrawerOpen(false);
                  navigate('shop', { category: 'all' });
                }}
                className="text-xs font-extrabold text-[#000000] hover:underline cursor-pointer"
              >
                View Full Shop Catalog →
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
