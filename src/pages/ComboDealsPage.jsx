import React, { useState, useMemo } from 'react';
import { useCart, isProductActive } from '../context/CartContext';
import { STORE_WHATSAPP_NUMBER } from '../data/products';
import { 
  Gift, 
  Sparkles, 
  ShoppingCart, 
  Check, 
  Heart, 
  ArrowLeft, 
  MessageCircle, 
  Star, 
  ShieldCheck, 
  Truck, 
  Percent, 
  Search, 
  ChevronRight, 
  PackageCheck,
  Zap,
  SlidersHorizontal,
  Clock,
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// CURATED PREMIUM SPECIAL COMBOS & HAMPERS CATALOG
const CURATED_COMBOS = [
  {
    id: 'combo-royal-01',
    name: 'Royal Mughal Imperial Dry Fruit Hamper',
    category: 'gift-hampers',
    categoryLabel: 'Royal Gift Hampers',
    badge: '👑 FESTIVE BESTSELLER',
    badgeColor: 'bg-amber-500 text-white',
    rating: 4.9,
    reviewsCount: 168,
    description: 'Handcrafted luxury gift presentation packed with jumbo California almonds, royal whole cashews, Iranian roasted pistachios and rich Arabian dates. Includes greeting card & brass satin ribbon.',
    items: [
      '250g Jumbo California Almonds (Badam)',
      '250g W240 Royal Whole Cashews (Kaju)',
      '250g Roasted Salted Iranian Pistachios (Pista)',
      '250g Arabian Safawi Royal Dates',
      'Complimentary Handcrafted Gift Box'
    ],
    weights: [
      { label: '1 KG ROYAL BOX', price: 1449, originalPrice: 1899 },
      { label: '2 KG GRAND HAMPER', price: 2799, originalPrice: 3699 }
    ],
    image: '/images/combo_banner.jpg',
    fastDelivery: true
  },
  {
    id: 'combo-immunity-02',
    name: 'Kashmir Saffron & Superfoods Immunity Elixir',
    category: 'wellness',
    categoryLabel: 'Health & Wellness',
    badge: '⚡ IMMUNITY SHIELD',
    badgeColor: 'bg-emerald-600 text-white',
    rating: 5.0,
    reviewsCount: 94,
    description: 'Pure certified Kashmiri Mongra saffron combined with fragrant green cardamom, organic mamra almonds, and walnut kernels for maximum vitality and glowing health.',
    items: [
      '1g Pure Kashmir Mongra Saffron (Kesar)',
      '50g Royal Green Cardamom (Elaichi)',
      '250g Kashmiri Mamra High-Oil Almonds',
      '250g Organic Akhrot (Kashmiri Walnut Kernels)'
    ],
    weights: [
      { label: 'STANDARD BOOSTER PACK', price: 1299, originalPrice: 1650 },
      { label: 'DOUBLE REFILL PACK', price: 2499, originalPrice: 3199 }
    ],
    image: '/images/products/product_1.jpg',
    fastDelivery: true
  },
  {
    id: 'combo-biryani-03',
    name: 'South Indian Grand Biryani & Royal Masala Kit',
    category: 'spices',
    categoryLabel: 'Masterchef Spices',
    badge: '🌶️ CHEF SIGNATURE',
    badgeColor: 'bg-rose-600 text-white',
    rating: 4.8,
    reviewsCount: 120,
    description: 'Authentic Sowcarpet aromatic whole spice kit. Handpicked direct from Western Ghats and Malabar plantations for restaurant-style fragrant biryanis and royal curries.',
    items: [
      '100g Zanzibar Extra Aromatic Cloves (Lavang)',
      '100g Star Anise (Chakra Phool)',
      '100g Tellicherry Bold Black Pepper',
      '100g Ceylon Cinnamon Sticks (Dalchini)',
      '50g Green Cardamom Extra Large',
      '200g Kashmiri Bright Degi Mirch'
    ],
    weights: [
      { label: 'MASTER CHEF 6-PIECE KIT (650G)', price: 749, originalPrice: 999 },
      { label: 'RESTAURANT MEGA PACK (1.3 KG)', price: 1399, originalPrice: 1899 }
    ],
    image: '/images/products/product_6.jpg',
    fastDelivery: true
  },
  {
    id: 'combo-energy-04',
    name: 'Daily Energy & Workout Power Snack Pack',
    category: 'wellness',
    categoryLabel: 'Health & Wellness',
    badge: '💪 DAILY POWER',
    badgeColor: 'bg-blue-600 text-white',
    rating: 4.9,
    reviewsCount: 88,
    description: 'The ultimate wholesome fuel pack for active professionals, students, and fitness enthusiasts. High in protein, natural dietary fiber, and healthy omega fatty acids.',
    items: [
      '500g Crunchy California Almonds',
      '250g Seedless Afghan Black Kishmish',
      '200g Roasted 5-Seeds Trail Mix (Chia, Pumpkin, Flax, Sunflower)',
      '250g Royal Medjool Soft Dates'
    ],
    weights: [
      { label: '1.2 KG MONTHLY PACK', price: 949, originalPrice: 1250 },
      { label: '2.4 KG FAMILY FITNESS PACK', price: 1799, originalPrice: 2399 }
    ],
    image: '/images/products/product_2.jpg',
    fastDelivery: true
  },
  {
    id: 'combo-potli-05',
    name: 'Festive Celebration Dry Fruit Potli (Set of 4)',
    category: 'gift-hampers',
    categoryLabel: 'Royal Gift Hampers',
    badge: '🎉 CELEBRATION SPECIAL',
    badgeColor: 'bg-amber-600 text-white',
    rating: 4.9,
    reviewsCount: 142,
    description: 'Four elegant traditional velvet embroidered potli drawstring pouches filled with premium grade dry fruits. Ready for wedding return favors and festive gifting.',
    items: [
      '150g Roasted Salted Cashews in Golden Potli',
      '150g California Roasted Almonds in Red Potli',
      '150g Afghan Kishmish in Emerald Potli',
      '150g Salted Pistachios in Royal Blue Potli'
    ],
    weights: [
      { label: 'SET OF 4 POTLIS (600G)', price: 899, originalPrice: 1199 },
      { label: 'SET OF 8 POTLIS (1.2 KG)', price: 1699, originalPrice: 2299 }
    ],
    image: '/images/products/product_5.jpg',
    fastDelivery: false
  },
  {
    id: 'combo-snacks-06',
    name: 'Gourmet Roasted & Flavoured Snacking Trio',
    category: 'budget',
    categoryLabel: 'Under ₹999 Deals',
    badge: '🍿 CRUNCHY SNACK',
    badgeColor: 'bg-purple-600 text-white',
    rating: 4.8,
    reviewsCount: 76,
    description: 'Zero oil roasted premium nuts coated with lip-smacking gourmet spices. Perfect for evening tea, office breaks, and weekend gatherings.',
    items: [
      '200g Spicy Peri-Peri Whole Cashews',
      '200g Smoked Barbecue Roasted Almonds',
      '200g Himalayan Pink Salt Crunchy Pistachios'
    ],
    weights: [
      { label: 'TRIO PACK (600G)', price: 799, originalPrice: 1050 },
      { label: 'MEGA TRIO PACK (1.2 KG)', price: 1499, originalPrice: 1999 }
    ],
    image: '/images/products/product_11.jpg',
    fastDelivery: true
  },
  {
    id: 'combo-sweet-07',
    name: 'Sowcarpet Royal Sweet & Kheer Essentials',
    category: 'budget',
    categoryLabel: 'Under ₹999 Deals',
    badge: '🍨 SWEET DELIGHTS',
    badgeColor: 'bg-amber-700 text-white',
    rating: 4.9,
    reviewsCount: 65,
    description: 'Traditional ingredients specially handpicked for festive payasam, halwa, kheer, and authentic royal Indian sweets with unforgettable rich aroma.',
    items: [
      '250g Kashmiri Snow White Walnut Kernels',
      '100g Charoli / Chironji Seeds',
      '50g Extra Fragrant Green Cardamom Powder',
      '100g Silver-Cut Slivers of Pista & Badam'
    ],
    weights: [
      { label: 'DESSERT MASTER PACK (500G)', price: 849, originalPrice: 1150 }
    ],
    image: '/images/products/product_14.jpg',
    fastDelivery: true
  },
  {
    id: 'combo-budget-08',
    name: 'Student & Office Pocket Energy Duo',
    category: 'budget',
    categoryLabel: 'Under ₹999 Deals',
    badge: '⚡ VALUE PACK',
    badgeColor: 'bg-teal-700 text-white',
    rating: 4.7,
    reviewsCount: 114,
    description: 'A pocket-friendly, high-nutrition essential pairing of California raw almonds and naturally sweet Afghan green kishmish.',
    items: [
      '250g California Raw Crunchy Almonds',
      '250g Natural Afghan Long Green Kishmish'
    ],
    weights: [
      { label: '500G POCKET DUO', price: 499, originalPrice: 650 },
      { label: '1 KG COMBO DUO', price: 899, originalPrice: 1200 }
    ],
    image: '/images/products/product_4.jpg',
    fastDelivery: true
  }
];

const COMBO_CATEGORIES = [
  { id: 'all', label: 'All Combos' },
  { id: 'gift-hampers', label: 'Royal Gift Hampers', icon: '👑' },
  { id: 'wellness', label: 'Health & Wellness', icon: '💪' },
  { id: 'spices', label: 'Masterchef Spices', icon: '🌶️' },
  { id: 'budget', label: 'Under ₹999 Deals', icon: '🏷️' }
];

export default function ComboDealsPage() {
  const { 
    navigate, 
    products, 
    comboDeals = [],
    isCombosPageEnabled = true,
    addToCart, 
    wishlist, 
    toggleWishlist, 
    activeWhatsAppNumber,
    getProductFinalPrice,
    hasPincodePrice
  } = useCart();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeights, setSelectedWeights] = useState({});
  const [addedComboId, setAddedComboId] = useState(null);
  const [selectedInfoCombo, setSelectedInfoCombo] = useState(null);

  // Helper to resolve all components/products of a combo with pictures and weights
  const getComboProducts = (combo) => {
    if (!combo) return [];
    if (Array.isArray(combo.components) && combo.components.length > 0) {
      return combo.components;
    }
    const items = Array.isArray(combo.items) ? combo.items : [];
    return items.map((it, idx) => {
      const cleanName = String(it).replace(/^[0-9]+(?:\.[0-9]+)?\s*(?:kg|g|gm|ml|l)?\s*/i, '').trim();
      const weightMatch = String(it).match(/^[0-9]+(?:\.[0-9]+)?\s*(?:kg|g|gm|ml|l)?/i);
      const weight = weightMatch ? weightMatch[0].trim() : '';
      const matched = (products || []).find(p => 
        p && p.name && (p.name.toLowerCase() === cleanName.toLowerCase() ||
        p.name.toLowerCase().includes(cleanName.toLowerCase()) ||
        cleanName.toLowerCase().includes(p.name.toLowerCase()))
      );
      return {
        id: matched?.id || `comp_${idx}`,
        name: matched?.name || cleanName,
        weight: weight,
        image: matched?.image || combo.image || '/images/combo_banner.jpg',
        price: matched?.weights?.[0]?.price || 0,
        category: matched?.category || ''
      };
    });
  };

  // Live Combos: only display active ones to customers
  const activeCombosList = useMemo(() => {
    return (comboDeals || []).filter(c => c.status !== 'INACTIVE');
  }, [comboDeals]);

  // Dynamically derive category tabs from actual combos present in Admin
  const comboCategoryTabs = useMemo(() => {
    const tabs = [{ id: 'all', label: 'All Combos' }];
    const seen = new Set();
    
    (activeCombosList || []).forEach(c => {
      if (c && c.category && !seen.has(c.category)) {
        seen.add(c.category);
        const predefined = COMBO_CATEGORIES.find(pc => pc.id === c.category);
        tabs.push({
          id: c.category,
          label: c.categoryLabel || predefined?.label || (c.category.charAt(0).toUpperCase() + c.category.slice(1).replace(/-/g, ' ')),
          icon: predefined?.icon || '🎁'
        });
      }
    });

    return tabs;
  }, [activeCombosList]);

  // Filter combos based on active category and live search
  const filteredCombos = useMemo(() => {
    return activeCombosList.filter(combo => {
      const matchCat = activeCategory === 'all' || combo.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        combo.name.toLowerCase().includes(q) ||
        combo.description.toLowerCase().includes(q) ||
        (combo.items || []).some(it => it.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [activeCombosList, activeCategory, searchQuery]);

  // Handle Weight / Size Selection
  const handleSelectWeight = (comboId, weightObj) => {
    setSelectedWeights(prev => ({
      ...prev,
      [comboId]: weightObj
    }));
  };

  // Add Combo to Cart
  const handleAddToCart = (combo) => {
    const weightsList = Array.isArray(combo.weights) && combo.weights.length > 0
      ? combo.weights
      : [{ label: combo.packLabel || 'Standard Pack', price: Number(combo.price) || 499, originalPrice: Number(combo.originalPrice) || 699 }];
    const currentWeight = selectedWeights[combo.id] || weightsList[0];
    const finalPrice = getProductFinalPrice ? getProductFinalPrice(combo, currentWeight) : currentWeight.price;
    const productPayload = {
      id: combo.id,
      name: combo.name,
      category: 'combos',
      categoryName: combo.categoryLabel || 'Special Combo',
      image: combo.image,
      price: finalPrice,
      originalPrice: currentWeight.originalPrice,
      weights: weightsList,
      badge: combo.badge
    };

    addToCart(productPayload, { ...currentWeight, price: finalPrice }, 1);
    setAddedComboId(combo.id);
    setTimeout(() => setAddedComboId(null), 1800);
  };

  // One-Tap Direct WhatsApp Order
  const handleWhatsAppOrder = (combo) => {
    const weightsList = Array.isArray(combo.weights) && combo.weights.length > 0
      ? combo.weights
      : [{ label: combo.packLabel || 'Standard Pack', price: Number(combo.price) || 499, originalPrice: Number(combo.originalPrice) || 699 }];
    const currentWeight = selectedWeights[combo.id] || weightsList[0];
    const phone = (activeWhatsAppNumber || STORE_WHATSAPP_NUMBER || '919876543210').replace(/[^0-9]/g, '');
    const discount = Math.round(((currentWeight.originalPrice - currentWeight.price) / currentWeight.originalPrice) * 100);

    const message = 
      `Salam / Hello Haji Nuts & Spices! 🌿\n\n` +
      `I want to order this *Special Combo Deal*:\n` +
      `📦 *Combo:* ${combo.name}\n` +
      `⚖️ *Selected Size:* ${currentWeight.label}\n` +
      `💰 *Special Offer Price:* ₹${currentWeight.price} (MRP: ₹${currentWeight.originalPrice} - Save ${discount}%)\n\n` +
      `🚚 Please provide payment link and delivery timeline for Chennai. Thank you!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // If Admin has toggled OFF Storefront access for Combos
  if (!isCombosPageEnabled) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen text-slate-900 pb-20 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-lg my-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Gift className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-black font-serif text-slate-900">
              Seasonal Combos Updating
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our store administrators are currently preparing our new festive hampers and exclusive bundles. Please check back soon or browse our full catalog!
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => navigate('shop', { category: 'all' })}
              className="w-full py-3 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Browse Shop Catalog
            </button>
            <button
              onClick={() => navigate('home')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-slate-900 pb-20">
      
      {/* 1. TOP BREADCRUMB & HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between gap-4 mb-4">
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#128C7E] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Store</span>
            <span>/</span>
            <span>Curated Collections</span>
            <span>/</span>
            <span className="text-[#128C7E] font-bold">Special Combo Deals</span>
          </div>
        </div>

        {/* 2. EXECUTIVE HERO BANNER */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#128C7E] via-[#0D7266] to-[#075E54] text-white p-6 sm:p-10 md:p-12 shadow-xl border border-emerald-700/40">
          
          {/* Subtle Decorative Elements */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-16 bottom-0 w-48 h-48 bg-amber-400/15 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-400/20 text-amber-200 border border-amber-300/30 rounded-full text-xs font-extrabold uppercase tracking-widest backdrop-blur-xs">
              <Gift className="w-3.5 h-3.5 text-amber-300" />
              <span>Festive Bundles & Luxury Hampers</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-white tracking-tight leading-tight">
              Special Combo Deals
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 font-medium leading-relaxed">
              Curated dry fruit hampers, organic immunity wellness boxes, and royal Sowcarpet biryani spice kits. Handcrafted with zero broken nuts, vacuum-packed fresh, and offered with massive bundle savings.
            </p>

            {/* Value Highlights Pill Row */}
            <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3 text-xs font-bold text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/20 rounded-xl border border-white/15">
                <Percent className="w-3.5 h-3.5 text-amber-300" />
                <span>Save Up To 35%</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/20 rounded-xl border border-white/15">
                <Truck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Express Chennai Dispatch</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/20 rounded-xl border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                <span>100% Quality Guaranteed</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE SEARCH & CATEGORY FILTER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {comboCategoryTabs.map(cat => {
              const isActive = activeCategory === cat.id;
              const count = cat.id === 'all' 
                ? activeCombosList.length 
                : activeCombosList.filter(c => c.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#128C7E] text-white shadow-md shadow-[#128C7E]/30 scale-102'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
                  }`}
                >
                  {cat.icon ? <span>{cat.icon}</span> : null}
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search combos, badam, kaju..."
              className="w-full bg-white border border-slate-200 focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/20 rounded-2xl pl-10 pr-4 py-2 text-xs font-medium outline-none shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

        </div>

        {/* 4. COMBOS GRID */}
        {filteredCombos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-sm my-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Combos Match Your Search</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any combo packs matching "{searchQuery}". Try searching for Almonds, Cashews, or choose "All Combos".
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="px-5 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
            {filteredCombos.map(combo => {
              const comboWeights = Array.isArray(combo.weights) && combo.weights.length > 0 
                ? combo.weights 
                : [{ label: combo.packLabel || 'Standard Pack', price: Number(combo.price) || 499, originalPrice: Number(combo.originalPrice) || 699 }];
              const currentWeight = selectedWeights[combo.id] || comboWeights[0];
              const discount = Math.round(
                ((currentWeight.originalPrice - currentWeight.price) / currentWeight.originalPrice) * 100
              );
              const savingsAmount = currentWeight.originalPrice - currentWeight.price;
              const isWishlisted = wishlist.includes(combo.id);
              const isAdded = addedComboId === combo.id;
              const comboItems = Array.isArray(combo.items) ? combo.items : [];

              return (
                <motion.div
                  key={combo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-[#128C7E]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  
                  {/* Top Image & Floating Badges */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                    <img
                      src={combo.image}
                      alt={combo.name}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 select-none"
                    />

                    {/* Gradient Overlay for Top Badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

                    {/* Badge Pill */}
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${combo.badgeColor || 'bg-amber-500 text-white'}`}>
                      {combo.badge || 'SPECIAL DEAL'}
                    </span>

                    {/* View Product Info Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedInfoCombo(combo)}
                      className="absolute top-3 right-12 p-2 bg-white/90 backdrop-blur-xs rounded-full shadow-md text-slate-600 hover:text-[#128C7E] transition-colors cursor-pointer"
                      title="View Included Products Info"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(combo.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full shadow-md text-slate-600 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Rating Pill */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white rounded-xl text-[11px] font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{combo.rating || 4.9}</span>
                      <span className="text-slate-300 text-[10px]">({combo.reviewsCount || 120})</span>
                    </div>

                    {/* Savings Tag */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-emerald-500 text-white rounded-xl text-[11px] font-black shadow-md flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>Save ₹{savingsAmount}</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#128C7E]">
                        {combo.categoryLabel || 'SPECIAL COMBO'}
                      </span>

                      <h3 className="text-base font-black font-serif text-slate-900 group-hover:text-[#128C7E] transition-colors leading-snug">
                        {combo.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {combo.description}
                      </p>
                    </div>

                    {/* "What's Inside" Included Items Section */}
                    {comboItems.length > 0 && (
                      <div className="space-y-1.5 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <PackageCheck className="w-3.5 h-3.5 text-[#128C7E]" />
                            <span>Included in this Box:</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedInfoCombo(combo)}
                            className="text-[10px] font-bold text-[#128C7E] hover:underline flex items-center gap-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/60 px-2 py-0.5 rounded-full transition-colors"
                            title="View all included products"
                          >
                            <Info className="w-3 h-3" />
                            <span>View Info</span>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {comboItems.map((item, idx) => (
                            <button 
                              key={idx} 
                              type="button"
                              onClick={() => setSelectedInfoCombo(combo)}
                              className="text-[10px] font-medium bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 text-slate-700 hover:text-[#128C7E] px-2 py-0.5 rounded-lg cursor-pointer transition-colors text-left"
                              title="Click to view product info"
                            >
                              ✓ {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price & Action Row */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      
                      {/* Price Display */}
                      {(() => {
                        const adminPrice = Number(combo.price || currentWeight?.price || 0);
                        return (
                          <div className="flex flex-col">
                            <span className="text-base sm:text-lg font-black text-[#222222] font-serif leading-tight">
                              ₹{adminPrice}.00
                            </span>
                          </div>
                        );
                      })()}

                      {/* Add to Cart Button (Matching ProductCard) */}
                      <button
                        type="button"
                        onClick={() => handleAddToCart(combo)}
                        className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#128C7E] hover:bg-[#0e7064] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>ADDED!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>ADD TO CART</span>
                          </>
                        )}
                      </button>

                    </div>

                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

        {/* 5. CUSTOM BULK & CORPORATE GIFTING BANNER */}
        <div className="mt-14 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-xl text-center md:text-left z-10">
            <span className="px-3 py-1 bg-black/20 text-white rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-white/20">
              Bulk & Corporate Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white">
              Need Custom Hampers for Weddings or Festivals?
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 font-medium">
              We personalize luxury brass, wooden, and velvet dry fruit gift boxes with your family or company branding. Special wholesale discounts starting from 10+ hampers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10 w-full md:w-auto">
            <button
              onClick={() => navigate('bulk-orders')}
              className="w-full sm:w-auto px-6 py-3 bg-white text-slate-900 font-bold text-xs rounded-2xl shadow-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Learn More
            </button>
            <button
              onClick={() => {
                const phone = (activeWhatsAppNumber || STORE_WHATSAPP_NUMBER || '919876543210').replace(/[^0-9]/g, '');
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent('Hello Haji Nuts & Spices! I would like to inquire about Custom Wedding / Corporate Gift Hampers.')}`, '_blank');
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* 6. FOUR ASSURANCE PILLARS */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 shadow-2xs">
            <div className="p-2.5 bg-emerald-50 text-[#128C7E] rounded-xl shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">100% Whole Grade</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Zero broken or powdered nuts. Premium royal harvest only.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 shadow-2xs">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Gift Box Packaging</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Complimentary ribbon and personalized card on request.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 shadow-2xs">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Express Delivery</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Same-day dispatch in Chennai; fast pan-India shipping.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 shadow-2xs">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Fresh 2026 Batch</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Nitrogen-flushed vacuum sealed for crisp crunchiness.</p>
            </div>
          </div>

        </div>

      </div>

      {/* COMBO PRODUCT INFO MODAL */}
      <AnimatePresence>
        {selectedInfoCombo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="relative bg-slate-900 text-white p-5 flex items-start justify-between">
                <div className="space-y-1 pr-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {selectedInfoCombo.categoryLabel || 'COMBO PACK'}
                  </span>
                  <h3 className="text-lg font-black font-serif text-white leading-tight">
                    {selectedInfoCombo.name}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {selectedInfoCombo.description || 'Specially curated combo pack with fresh products.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInfoCombo(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Products List (Scrollable) */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-[#128C7E]" />
                    <span>Included Products In This Combo</span>
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-[#128C7E] border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {getComboProducts(selectedInfoCombo).length} Items Selected
                  </span>
                </div>

                <div className="space-y-2.5">
                  {getComboProducts(selectedInfoCombo).map((prod, idx) => (
                    <div
                      key={prod.id || idx}
                      className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-all"
                    >
                      <img
                        src={prod.image || '/images/combo_banner.jpg'}
                        alt={prod.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {prod.name}
                        </h4>
                        {prod.weight && (
                          <p className="text-[11px] font-semibold text-[#128C7E] mt-0.5">
                            Pack: {prod.weight}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded mt-1 font-medium">
                          ✓ 100% Pure & Fresh Sealed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Assurance banner */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center gap-2.5 text-amber-900">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-[11px] leading-tight">
                    Every product in this combo is individually vacuum sealed for maximum crunch, aroma, and freshness.
                  </p>
                </div>
              </div>

              {/* Modal Footer with Price & Add to Cart */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Combo Price
                  </span>
                  <span className="text-xl font-black font-serif text-[#222222]">
                    ₹{Number(selectedInfoCombo.price || selectedInfoCombo.weights?.[0]?.price || 0)}.00
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(selectedInfoCombo);
                    setSelectedInfoCombo(null);
                  }}
                  className="flex-1 max-w-xs py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#128C7E] hover:bg-[#0e7064] text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
