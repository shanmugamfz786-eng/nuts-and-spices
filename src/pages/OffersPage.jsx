import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { 
  Ticket, 
  Tag, 
  Copy, 
  Check, 
  ArrowRight, 
  Calendar, 
  Percent, 
  ShieldCheck, 
  Gift, 
  Search, 
  Share2, 
  CheckCircle2, 
  Zap, 
  Truck, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OffersPage() {
  const { offers = [], categories = [], applyCoupon, navigate } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [appliedId, setAppliedId] = useState(null);
  const [toastNotice, setToastNotice] = useState('');

  // Extract unique categories from offers
  const offerCategories = useMemo(() => {
    const cats = new Set();
    offers.forEach(off => {
      if (off.applicableCategory) cats.add(off.applicableCategory);
    });
    return Array.from(cats);
  }, [offers]);

  // Filtered offers list (without Active Only button)
  const filteredOffers = useMemo(() => {
    return offers.filter(off => {
      if (selectedCategory !== 'all' && off.applicableCategory !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const code = (off.code || `HAJI${off.discountPercent}`).toLowerCase();
        const name = (off.name || '').toLowerCase();
        const cat = (off.applicableCategoryName || '').toLowerCase();
        return code.includes(q) || name.includes(q) || cat.includes(q);
      }
      return true;
    });
  }, [offers, selectedCategory, searchQuery]);

  // Highest discount among offers
  const maxDiscount = useMemo(() => {
    if (!offers.length) return 25;
    return Math.max(...offers.map(o => Number(o.discountPercent) || 0), 20);
  }, [offers]);

  // Copy coupon code to clipboard
  const handleCopyCode = (offer) => {
    const code = offer.code || `HAJI${offer.discountPercent}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }
    setCopiedId(offer.id);
    setToastNotice(`Coupon "${code}" copied to clipboard!`);
    setTimeout(() => {
      setCopiedId(null);
      setToastNotice('');
    }, 2800);
  };

  // Direct Apply to Cart
  const handleApplyToCart = (offer) => {
    const res = applyCoupon(offer);
    setAppliedId(offer.id);
    setToastNotice(`🎉 ${res.message}`);
    setTimeout(() => {
      setAppliedId(null);
      setToastNotice('');
      navigate('cart');
    }, 1200);
  };

  // Share deal
  const handleShare = (offer) => {
    const code = offer.code || `HAJI${offer.discountPercent}`;
    const text = `🎉 Get ${offer.discountPercent}% OFF at Haji Nuts & Spices with coupon code: ${code}! Valid on ${offer.applicableCategoryName || 'products'}. Visit https://www.hajinutsandspices.com`;
    
    if (navigator.share) {
      navigator.share({
        title: `${offer.discountPercent}% OFF - Haji Nuts & Spices`,
        text: text,
        url: window.location.href,
      }).catch(() => {});
    } else if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setToastNotice('Deal link copied to clipboard!');
      setTimeout(() => setToastNotice(''), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#000000] pb-28">
      
      {/* 1. BRAND SIGNATURE HERO BANNER (#128C7E & #075E54) */}
      <section className="relative bg-gradient-to-br from-[#128C7E] via-[#075E54] to-[#075E54] text-white pt-10 sm:pt-14 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl border-b border-[#075E54]/40">
        
        {/* Glow Spheres & Grain Elements */}
        <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-[#128C7E]/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-[#075E54]/60 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08)_1px,_transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F9FAFB]/90">
            <button 
              onClick={() => navigate('home')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-white/40">/</span>
            <span className="text-white font-bold">Gourmet Offers & Privileges</span>
          </nav>

          {/* Hero Content Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/15 border border-white/25 rounded-full text-white text-xs font-black tracking-widest uppercase backdrop-blur-sm shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Harvest Festive Deals & Coupons</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-white tracking-tight leading-[1.15]">
                Exclusive Gourmet Vouchers & Offers
              </h1>
              
              <p className="text-xs sm:text-sm text-[#F9FAFB]/90 leading-relaxed max-w-xl font-normal">
                Enjoy special harvest discounts on royal California almonds, Kashmir saffron, Iranian pistachios, and Arabian dates. Copy any active voucher code or apply instantly to your cart.
              </p>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-3 gap-3 shrink-0 lg:w-96">
              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center shadow-lg transition-transform hover:-translate-y-1">
                <div className="text-2xl sm:text-3xl font-black text-white font-serif">{offers.length}</div>
                <div className="text-[10px] uppercase font-bold text-[#F9FAFB] tracking-wider mt-0.5">Active Deals</div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center shadow-lg transition-transform hover:-translate-y-1">
                <div className="text-2xl sm:text-3xl font-black text-white font-serif">Up to {maxDiscount}%</div>
                <div className="text-[10px] uppercase font-bold text-[#F9FAFB] tracking-wider mt-0.5">Max Savings</div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center shadow-lg transition-transform hover:-translate-y-1">
                <div className="text-2xl sm:text-3xl font-black text-white font-serif">100%</div>
                <div className="text-[10px] uppercase font-bold text-[#F9FAFB] tracking-wider mt-0.5">Certified Pure</div>
              </div>
            </div>
          </div>

          {/* Quick Perks Strip */}
          <div className="pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-[#F9FAFB]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-white shrink-0" />
              <span>Authentic Certified Grade</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-white shrink-0" />
              <span>Free Doorstep Delivery</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-white shrink-0" />
              <span>Instant Cart Deduction</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Gift className="w-4 h-4 text-white shrink-0" />
              <span>Festive Luxury Hampers</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FLOATING NOTICE / TOAST */}
      <AnimatePresence>
        {toastNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#075E54] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#128C7E] backdrop-blur-md text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>{toastNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. FILTER & SEARCH CONTROL BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-9 relative z-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search offers by name, dry fruits, spices, or dates..."
              className="w-full pl-10 pr-16 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/20 rounded-xl text-xs text-[#000000] placeholder:text-gray-400 outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400 hover:text-black cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills (Active Only removed cleanly) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#128C7E] text-white shadow-md'
                  : 'bg-[#F9FAFB] hover:bg-gray-100 text-gray-700 border border-[#E5E7EB]'
              }`}
            >
              All Deals ({offers.length})
            </button>
            
            {offerCategories.map((catId) => {
              const catObj = categories.find(c => c.id === catId);
              const label = catObj ? catObj.name : catId.replace('-', ' ');
              return (
                <button
                  key={catId}
                  onClick={() => setSelectedCategory(catId)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap capitalize transition-all cursor-pointer ${
                    selectedCategory === catId
                      ? 'bg-[#128C7E] text-white shadow-md'
                      : 'bg-[#F9FAFB] hover:bg-gray-100 text-gray-700 border border-[#E5E7EB]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 4. PREMIUM TICKET COUPONS GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {filteredOffers.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-12 text-center max-w-md mx-auto shadow-sm space-y-4 my-12">
            <div className="w-16 h-16 bg-[#128C7E]/10 text-[#128C7E] rounded-full flex items-center justify-center mx-auto text-3xl border border-[#128C7E]/20 shadow-inner">
              🎟️
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-black font-serif">No Vouchers Found</h3>
              <p className="text-xs text-gray-500">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'No offers match your current filter. Try resetting your search.' 
                  : 'New promotional discount codes are being prepared!'}
              </p>
            </div>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-5 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl cursor-pointer shadow transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Modern Voucher Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              const code = offer.code || `HAJI${offer.discountPercent}`;
              const isCopied = copiedId === offer.id;
              const isApplied = appliedId === offer.id;
              const isActive = offer.status === 'ACTIVE';

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-3xl border border-[#E5E7EB] hover:border-[#128C7E] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
                >
                  
                  {/* Card Top Section */}
                  <div className="p-6 space-y-4">
                    
                    {/* Badge & Share Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white rounded-full text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                          <Percent className="w-3.5 h-3.5" />
                          <span>{offer.discountPercent}% OFF</span>
                        </span>
                        
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-[#128C7E] border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#128C7E] animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500">
                            Expired
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleShare(offer)}
                        className="p-1.5 text-gray-400 hover:text-[#128C7E] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Share coupon deal"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Offer Name */}
                    <div>
                      <h3 className="text-xl font-black font-serif text-black group-hover:text-[#128C7E] transition-colors leading-snug">
                        {offer.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        Enjoy guaranteed {offer.discountPercent}% price deduction on fresh, premium {offer.applicableCategoryName || 'gourmet items'}.
                      </p>
                    </div>

                    {/* Rules Pill Box */}
                    <div className="bg-[#F9FAFB] rounded-2xl p-3.5 border border-[#E5E7EB] space-y-2 text-xs">
                      <div className="flex items-center justify-between text-gray-600">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Category:</span>
                        <button
                          onClick={() => navigate('shop', { category: offer.applicableCategory || 'all' })}
                          className="font-bold text-[#128C7E] hover:underline cursor-pointer"
                        >
                          {offer.applicableCategoryName || 'All Categories'} →
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-gray-600">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Min. Order Value:</span>
                        <span className="font-bold font-serif text-black">
                          {offer.minOrderAmount ? `₹${offer.minOrderAmount}` : 'No minimum spend'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-gray-600 pt-1 border-t border-gray-200/60 font-mono text-[11px]">
                        <span className="flex items-center gap-1 text-gray-400 font-sans">
                          <Calendar className="w-3.5 h-3.5 text-[#128C7E]" />
                          <span>Valid Until:</span>
                        </span>
                        <span className="font-bold text-gray-800">{offer.endDate || 'Limited Period'}</span>
                      </div>
                    </div>

                  </div>

                  {/* VOUCHER TEAR CUTOUT DIVIDER */}
                  <div className="relative flex items-center my-0.5">
                    <div className="w-5 h-5 bg-[#FDFBF7] rounded-full border-r border-[#E5E7EB] -ml-2.5 shadow-inner" />
                    <div className="flex-1 border-t-2 border-dashed border-[#E5E7EB] mx-2" />
                    <div className="w-5 h-5 bg-[#FDFBF7] rounded-full border-l border-[#E5E7EB] -mr-2.5 shadow-inner" />
                  </div>

                  {/* Card Bottom Section */}
                  <div className="p-6 pt-3 bg-gradient-to-b from-white to-[#F9FAFB] space-y-3">
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleApplyToCart(offer)}
                        className={`py-3 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                          isApplied ? 'bg-[#075E54]' : 'bg-[#128C7E] hover:bg-[#075E54]'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Applied!</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-white fill-white" />
                            <span>Apply Offer</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => navigate('shop', { category: offer.applicableCategory || 'all' })}
                        className="py-3 bg-emerald-50 hover:bg-[#128C7E] text-[#075E54] hover:text-white border border-[#128C7E]/30 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 group-hover:border-[#128C7E]"
                      >
                        <span>Shop Items</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* 5. HOW IT WORKS GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 sm:p-12 shadow-sm space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#128C7E] uppercase tracking-widest block">
              Quick & Seamless
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-black">
              How to Redeem Your Offers
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Enjoying festival discounts on premium gourmet nuts and whole spices takes only 3 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#128C7E]/10 text-[#128C7E] font-serif font-black text-lg flex items-center justify-center mx-auto shadow-inner">
                1
              </div>
              <h3 className="text-base font-bold text-black font-serif">Pick or Copy Voucher</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Click <strong>"Apply Code"</strong> to automatically attach the discount to your bag, or copy the code.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#128C7E]/10 text-[#128C7E] font-serif font-black text-lg flex items-center justify-center mx-auto shadow-inner">
                2
              </div>
              <h3 className="text-base font-bold text-black font-serif">Add Gourmet Items</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Add authentic dry fruits, spices, or dates to meet the minimum spend threshold.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#128C7E]/10 text-[#128C7E] font-serif font-black text-lg flex items-center justify-center mx-auto shadow-inner">
                3
              </div>
              <h3 className="text-base font-bold text-black font-serif">Instant Price Deduction</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Watch your Grand Total drop immediately on the Cart and Checkout summary before payment.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. VIP BULK ORDERS FOOTER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gradient-to-r from-[#128C7E] via-[#075E54] to-[#075E54] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#075E54]">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-xs font-bold text-[#F9FAFB] uppercase tracking-widest block">
              Corporate Gifts & Bulk Celebrations
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-serif text-white">
              Planning Bulk Orders or Festival Hampers?
            </h3>
            <p className="text-xs sm:text-sm text-[#F9FAFB]/90 leading-relaxed">
              Get customized corporate gift packaging, wholesale wedding dry fruit trays, and exclusive tiered volume discounts directly via WhatsApp.
            </p>
          </div>

          <button
            onClick={() => {
              const message = encodeURIComponent('Hello Haji Nuts & Spices! I would like to inquire about exclusive bulk order offers and festive gift hamper discounts.');
              window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
            }}
            className="px-6 py-3.5 bg-white text-[#075E54] hover:bg-gray-100 font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <span>WhatsApp Bulk Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
