import React, { useState, useRef, useMemo } from 'react';
import { useCart, isProductActive } from '../context/CartContext';
import { ChevronLeft, ChevronRight, ShoppingCart, Check, ChevronDown, Heart, Eye } from 'lucide-react';

function FeaturedCard({ product }) {
  const { addToCart, wishlist, toggleWishlist, navigate } = useCart();
  
  const defaultWeight = (product && product.weights && product.weights[0]) 
    ? product.weights[0] 
    : { label: '250g', price: Number(product?.price) || 350, originalPrice: Math.round((Number(product?.price) || 350) * 1.2) };

  const [selectedWeight, setSelectedWeight] = useState(defaultWeight);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const activeWeight = selectedWeight || defaultWeight;
  const weightsList = Array.isArray(product.weights) && product.weights.length > 0 ? product.weights : [defaultWeight];
  const isWishlisted = Array.isArray(wishlist) && wishlist.includes(product.id);

  const curP = Number(activeWeight.price) || 350;
  const origP = Number(activeWeight.originalPrice) || ((product.discountPercent > 0) ? Math.round(curP / ((100 - product.discountPercent) / 100)) : Math.round(curP * 1.2));
  const discountPercent = (product.discountPercent !== undefined && product.discountPercent !== null) 
    ? Number(product.discountPercent) 
    : (origP > curP ? Math.round(((origP - curP) / origP) * 100) : 15);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, activeWeight, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div 
      onClick={() => navigate('product-details', { product })}
      className="min-w-[225px] max-w-[245px] sm:min-w-[245px] sm:max-w-[260px] bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col snap-start shrink-0 overflow-hidden cursor-pointer group transform hover:-translate-y-1"
    >
      {/* Product Image Box & Badges */}
      <div className="relative aspect-square bg-[#FAF7F2] p-2.5 sm:p-3 flex items-center justify-center overflow-hidden">
        
        {/* Top Badges Stack (Left) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className="bg-[#25D366] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow-xs font-serif">
            {product.badge || 'FEATURED'}
          </span>
          {discountPercent > 0 && (
            <span className="bg-[#8B0000] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs w-fit">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Floating Quick Action Buttons (Right) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (toggleWishlist) toggleWishlist(product.id);
            }}
            className="w-7 h-7 rounded-full bg-white/95 shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-red-500 hover:scale-110 transition-all cursor-pointer"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </button>

          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('product-details', { product });
            }}
            className="w-7 h-7 rounded-full bg-white/95 shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#000000] hover:scale-110 transition-all cursor-pointer opacity-90 group-hover:opacity-100"
            title="View Details"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Real Product Image from Store Catalog */}
        <img
          src={product.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600'}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Card Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
        <div>
          {/* Product Title */}
          <h3 className="font-serif font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-[#000000] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Weight Picker Dropdown */}
        <div onClick={(e) => e.stopPropagation()} className="relative">
          <select
            value={activeWeight.label}
            onChange={(e) => {
              const w = weightsList.find(item => item.label === e.target.value);
              if (w) setSelectedWeight(w);
            }}
            className="w-full text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:border-[#000000] appearance-none pr-8 shadow-2xs"
          >
            {weightsList.map((w) => (
              <option key={w.label} value={w.label}>
                {w.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Price Row (Strikethrough Original + Highlighted Discounted Price) */}
        <div className="pt-0.5">
          <span className="text-[11px] text-gray-400 line-through font-medium block">
            ₹{origP}.00
          </span>
          <span className="text-base sm:text-lg font-black text-[#A67C1E] font-serif block -mt-0.5">
            ₹{curP}.00
          </span>
        </div>

        {/* Add To Cart Button (Warm Spice #000000 with Gold/Cart Icon - NO GREEN) */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md active:scale-95 ${
            added
              ? 'bg-[#128C7E] text-white'
              : 'bg-[#25D366] hover:bg-[#128C7E] text-white'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>ADDED TO CART</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5 text-[#000000]" />
              <span>ADD TO CART</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function FeaturedTodaySection() {
  const { products, categories, setSelectedCategory, navigate } = useCart();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Dynamically load the user's authentic store products that are marked as Featured Today
  const featuredProducts = useMemo(() => {
    return (products || []).filter(p => isProductActive(p) && p.isFeaturedToday);
  }, [products]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollRatio = scrollLeft / (scrollWidth - clientWidth || 1);
      const index = Math.min(3, Math.floor(scrollRatio * 4));
      setActiveIndex(index);
    }
  };

  const handleVisitNow = () => {
    if (setSelectedCategory) setSelectedCategory('all');
    navigate('shop');
  };

  if (featuredProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-2 pb-6">
      {/* Header with Subtitle & Visit Now Button */}
      <div className="flex flex-row items-end justify-between border-b border-[#E5E7EB]/60 pb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#A2834E] block font-serif">
            HANDPICKED FOR YOU
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black font-serif text-[#000000] tracking-tight mt-1">
            Featured Today
          </h2>
        </div>

        {/* Visit Now Button */}
        <button
          onClick={handleVisitNow}
          className="border border-[#000000]/60 hover:border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white transition-all font-semibold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2 rounded-full flex items-center gap-1.5 shadow-xs cursor-pointer group"
        >
          <span>Visit Now</span>
          <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* Carousel Container with Side Navigation Arrows */}
      <div className="relative group">
        
        {/* Left Scroll Button */}
        <button
          onClick={scrollLeft}
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[#000000] hover:bg-[#FAF7F2] transition-all cursor-pointer opacity-95 hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Products Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth scrollbar-none py-3 px-1 snap-x snap-mandatory"
        >
          {featuredProducts.map((product) => (
            <FeaturedCard key={product.id} product={product} />
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={scrollRight}
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[#000000] hover:bg-[#FAF7F2] transition-all cursor-pointer opacity-95 hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination Indicator Dots */}
      <div className="flex justify-center items-center gap-1.5 pt-1">
        {[0, 1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`transition-all duration-300 rounded-full ${
              activeIndex === dot
                ? 'w-6 h-1.5 bg-[#000000]'
                : 'w-2 h-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
