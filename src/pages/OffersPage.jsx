import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { 
  Ticket, 
  Tag, 
  Copy, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Sparkles, 
  Clock, 
  ShoppingBag, 
  Percent, 
  ShieldCheck, 
  Gift, 
  Search, 
  Share2, 
  CheckCircle2, 
  Zap,
  HelpCircle,
  Truck,
  Flame,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OffersPage() {
  const { offers = [], categories = [], navigate } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedNotice, setCopiedNotice] = useState('');

  // Extract unique categories from active offers
  const offerCategories = useMemo(() => {
    const cats = new Set();
    offers.forEach(off => {
      if (off.applicableCategory) cats.add(off.applicableCategory);
    });
    return Array.from(cats);
  }, [offers]);

  // Filtered offers list
  const filteredOffers = useMemo(() => {
    return offers.filter(off => {
      // Category filter
      if (selectedCategory !== 'all' && off.applicableCategory !== selectedCategory) {
        return false;
      }
      // Active filter
      if (activeOnly && off.status !== 'ACTIVE') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const code = (off.code || `HAJI${off.discountPercent}`).toLowerCase();
        const name = (off.name || '').toLowerCase();
        const cat = (off.applicableCategoryName || '').toLowerCase();
        return code.includes(q) || name.includes(q) || cat.includes(q);
      }
      return true;
    });
  }, [offers, selectedCategory, activeOnly, searchQuery]);

  // Highest discount among active offers
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
    setCopiedNotice(`Voucher code "${code}" copied to clipboard!`);
    setTimeout(() => {
      setCopiedId(null);
      setCopiedNotice('');
    }, 2800);
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
    } else {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
        setCopiedId(offer.id);
        setCopiedNotice('Deal shared link copied to clipboard!');
        setTimeout(() => {
          setCopiedId(null);
          setCopiedNotice('');
        }, 2800);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D241E] pb-24 selection:bg-[#128C7E] selection:text-white">
      
      {/* 1. TOP BREADCRUMB & VIP BANNER */}
      <div className="bg-[#075E54] text-white pt-8 pb-14 px-4 sm:px-6 relative overflow-hidden shadow-md">
        {/* Subtle background glow & decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#128C7E]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-amber-200/80 font-semibold uppercase tracking-wider">
            <button 
              onClick={() => navigate('home')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-white">Exclusive Offers & Coupons</span>
          </div>

          {/* Hero Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-300/40 rounded-full text-amber-300 text-xs font-black tracking-widest uppercase">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Sowcarpet Heritage Privileges</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-white tracking-tight leading-tight">
                Exclusive Gourmet Vouchers & Offers
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
                Enjoy special harvest discounts on royal California almonds, Kashmir saffron, Iranian pistachios, and Arabian dates. Copy any active voucher code and apply it during checkout.
              </p>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center">
                <div className="text-2xl font-black text-amber-300 font-serif">{offers.length}</div>
                <div className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">Active Deals</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center">
                <div className="text-2xl font-black text-amber-300 font-serif">Up to {maxDiscount}%</div>
                <div className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">Max Savings</div>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center">
                <div className="text-2xl font-black text-amber-300 font-serif">100%</div>
                <div className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">Fresh & Pure</div>
              </div>
            </div>

          </div>

          {/* Quick Perks Strip */}
          <div className="pt-4 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-emerald-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Authentic Certified Grade</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Free Delivery on ₹1,499+</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Instant Voucher Redemption</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Festive Packaging Available</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. FLOATING NOTICE / COPIED TOAST */}
      <AnimatePresence>
        {copiedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#128C7E] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/50 backdrop-blur-md text-xs font-bold"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span>{copiedNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. FILTER & SEARCH CONTROL BAR */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vouchers by coupon code, nuts, dates, or spice..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/20 rounded-2xl text-xs text-gray-800 placeholder-gray-400 outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#128C7E] text-white shadow-md'
                  : 'bg-[#F9FAFB] hover:bg-gray-100 text-gray-700 border border-[#E5E7EB]'
              }`}
            >
              All Offers ({offers.length})
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

          {/* Active Only Toggle */}
          <button
            onClick={() => setActiveOnly(!activeOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border transition-all cursor-pointer shrink-0 ${
              activeOnly 
                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-white text-gray-600 border-[#E5E7EB] hover:bg-gray-50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeOnly ? 'bg-amber-600' : 'bg-gray-400'}`} />
            <span>Active Only</span>
          </button>

        </div>
      </div>

      {/* 4. OFFERS VOUCHER CARDS GRID */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
        
        {filteredOffers.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-12 text-center max-w-lg mx-auto shadow-sm space-y-4 my-8">
            <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto text-2xl border border-amber-200">
              🎟️
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 font-serif">No Matching Offers Found</h3>
              <p className="text-xs text-gray-500">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search terms or category filter to discover available deals.' 
                  : 'New harvest promotional vouchers are being prepared! Explore our special festive combo packs.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setActiveOnly(false); }}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl cursor-pointer"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => navigate('combo-deals')}
                className="px-5 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl cursor-pointer shadow-md inline-flex items-center justify-center gap-1.5"
              >
                <span>Browse Festive Combos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              const code = offer.code || `HAJI${offer.discountPercent}`;
              const isCopied = copiedId === offer.id;
              const isActive = offer.status === 'ACTIVE';

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-3xl border border-[#E5E7EB] hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
                >
                  
                  {/* TICKET TOP HEADER */}
                  <div className="p-6 space-y-4">
                    
                    {/* Top Status & Discount Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Percent className="w-3.5 h-3.5" />
                          <span>{offer.discountPercent}% OFF</span>
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        )}
                      </div>

                      {/* Share Button */}
                      <button
                        onClick={() => handleShare(offer)}
                        className="p-1.5 text-gray-400 hover:text-[#128C7E] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Share this deal"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Offer Name */}
                    <div>
                      <h3 className="text-xl font-black font-serif text-gray-900 group-hover:text-[#128C7E] transition-colors leading-snug">
                        {offer.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        Enjoy guaranteed {offer.discountPercent}% price deduction on authentic {offer.applicableCategoryName || 'gourmet items'}.
                      </p>
                    </div>

                    {/* Terms / Highlights Box */}
                    <div className="bg-[#F9FAFB] rounded-2xl p-3 border border-[#E5E7EB] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-gray-600">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Category:</span>
                        <button
                          onClick={() => navigate('shop', { category: offer.applicableCategory })}
                          className="font-bold text-[#128C7E] hover:underline cursor-pointer"
                        >
                          {offer.applicableCategoryName || 'All Categories'} →
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-gray-600">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Min. Order Value:</span>
                        <span className="font-bold font-serif text-gray-900">
                          {offer.minOrderAmount ? `₹${offer.minOrderAmount}` : 'No minimum spend'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-gray-600 pt-0.5 border-t border-gray-200/60 font-mono text-[11px]">
                        <span className="flex items-center gap-1 text-gray-500 font-sans">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>Valid Until:</span>
                        </span>
                        <span className="font-bold text-gray-800">{offer.endDate || 'Limited Period'}</span>
                      </div>
                    </div>

                  </div>

                  {/* VOUCHER PERFORATED CUTOUT DIVIDER */}
                  <div className="relative flex items-center my-1">
                    {/* Left Notched Circle Cutout */}
                    <div className="w-5 h-5 bg-[#FDFBF7] rounded-full border-r border-[#E5E7EB] -ml-2.5 shadow-inner" />
                    {/* Dashed Perforated Tear Line */}
                    <div className="flex-1 border-t-2 border-dashed border-[#E5E7EB] mx-1" />
                    {/* Right Notched Circle Cutout */}
                    <div className="w-5 h-5 bg-[#FDFBF7] rounded-full border-l border-[#E5E7EB] -mr-2.5 shadow-inner" />
                  </div>

                  {/* TICKET BOTTOM ACTION ROW */}
                  <div className="p-6 pt-3 bg-gradient-to-b from-white to-[#F9FAFB] space-y-3">
                    
                    {/* Coupon Code & Copy Pill */}
                    <div className="flex items-center justify-between gap-2 p-1.5 pl-3 bg-amber-50/80 border-2 border-dashed border-amber-300 rounded-2xl">
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-bold text-amber-800/80 tracking-wider block">Coupon Code</span>
                        <span className="font-mono text-sm font-black text-amber-950 tracking-wider">
                          {code}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleCopyCode(offer)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm active:scale-95'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Shop Category CTA */}
                    <button
                      onClick={() => navigate('shop', { category: offer.applicableCategory || 'all' })}
                      className="w-full py-3 bg-[#128C7E] hover:bg-[#075E54] active:scale-[0.98] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Shop Category Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 5. HOW TO REDEEM 3-STEP GUIDE */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 sm:p-10 shadow-sm space-y-8">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#128C7E] uppercase tracking-widest block">
              Effortless Savings
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-gray-900">
              How to Redeem Your Offers
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Three simple steps to enjoy the freshest premium nuts, dates, and authentic spices at celebration prices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-serif font-black text-lg flex items-center justify-center mx-auto shadow-inner">
                1
              </div>
              <h3 className="text-base font-bold text-gray-900 font-serif">Copy Voucher Code</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Click the <strong>"Copy Code"</strong> button on your preferred voucher above to save it to your clipboard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-serif font-black text-lg flex items-center justify-center mx-auto shadow-inner">
                2
              </div>
              <h3 className="text-base font-bold text-gray-900 font-serif">Select Gourmet Items</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Browse our curated selection and add authentic dry fruits, spices, or dates to meet the minimum spend.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-serif font-black text-lg flex items-center justify-center mx-auto shadow-inner">
                3
              </div>
              <h3 className="text-base font-bold text-gray-900 font-serif">Apply & Save Instantly</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Enter your code in checkout notes or mention it in your WhatsApp order to receive immediate bill discounts.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* 6. WHATSAPP VIP & BULK ENQUIRY BANNER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-gradient-to-r from-[#128C7E] via-[#075E54] to-[#075E54] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
              Corporate Gifts & Bulk Celebrations
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-serif text-white">
              Planning Bulk Orders or Festival Hampers?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100">
              Get customized wholesale volume discounts, personalized brass gift packaging, and door-to-door pan-India delivery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                const message = encodeURIComponent('Hello Haji Nuts & Spices! I would like to inquire about exclusive bulk order offers and festive gift hamper discounts.');
                window.open(`https://wa.me/919940024479?text=${message}`, '_blank');
              }}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-transform active:scale-95 text-center cursor-pointer"
            >
              Enquire on WhatsApp
            </button>
            <button
              onClick={() => navigate('combo-deals')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-colors text-center cursor-pointer"
            >
              Explore Festive Combos
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
