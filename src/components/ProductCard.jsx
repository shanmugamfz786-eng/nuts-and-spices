import React, { useState } from 'react';
import { useCart, isProductActive } from '../context/CartContext';
import { Heart, ShoppingCart, Check, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const { addToCart, wishlist, toggleWishlist, navigate } = useCart();
  
  const defaultWeight = (product?.weights && product.weights[0]) 
    ? product.weights[0] 
    : { label: '250G', price: Number(product?.price) || 350, originalPrice: Math.round((Number(product?.price) || 350) * 1.2) };

  const [selectedWeight, setSelectedWeight] = useState(defaultWeight);
  const [added, setAdded] = useState(false);

  if (!product || !isProductActive(product)) return null;

  const activeWeight = selectedWeight || defaultWeight;
  const weightsList = Array.isArray(product.weights) && product.weights.length > 0 ? product.weights : [defaultWeight];

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, activeWeight, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const curP = Number(activeWeight.price) || 350;
  const origP = Number(activeWeight.originalPrice) || ((product.discountPercent > 0) ? Math.round(curP / ((100 - product.discountPercent) / 100)) : Math.round(curP * 1.2));
  const discountPercent = (product.discountPercent !== undefined && product.discountPercent !== null && product.discountPercent > 0) 
    ? Number(product.discountPercent) 
    : (origP > curP ? Math.round(((origP - curP) / origP) * 100) : 15);

  // ==================== LIST VIEW (HORIZONTAL CARD) ====================
  if (viewMode === 'list') {
    return (
      <motion.div 
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate('product-details', { product })}
        className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 hover:border-[#000000]/30 shadow-sm hover:shadow-xl transition-all duration-300 p-3.5 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer relative"
      >
        {/* Left Side: Product Image with Badge + Title */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#F9FAFB]/60 shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {discountPercent > 0 && (
              <div className="absolute top-1.5 left-1.5 z-10">
                <span className="bg-[#B91C1C] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm shadow-xs">
                  {discountPercent}% OFF
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base font-sans group-hover:text-[#000000] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
            {product.categoryName && (
              <span className="text-[11px] text-gray-400 font-medium block mt-1">
                {product.categoryName}
              </span>
            )}
          </div>
        </div>

        {/* Center: Weight Dropdown */}
        <div onClick={(e) => e.stopPropagation()} className="relative w-full md:w-56 lg:w-64 shrink-0">
          <select
            value={activeWeight.label}
            onChange={(e) => {
              const selected = weightsList.find(w => w.label === e.target.value);
              if (selected) setSelectedWeight(selected);
            }}
            className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-semibold text-gray-800 py-2 px-3 pr-8 appearance-none focus:outline-none focus:border-[#000000] cursor-pointer shadow-2xs"
          >
            {weightsList.map((w, wIdx) => (
              <option key={`${product.id}-${w.label}-${wIdx}`} value={w.label}>
                {w.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Right Side: Price + Add to Cart Button */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-2 md:gap-1.5 shrink-0 w-full md:w-56">
          <div className="flex flex-col md:text-right">
            <span className="text-[11px] text-gray-400 line-through font-sans leading-none">
              ₹{origP}.00
            </span>
            <span className="text-base sm:text-lg font-black text-[#222222] font-serif leading-tight mt-0.5">
              ₹{curP}.00
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
              added 
                ? 'bg-[#075E54] text-white' 
                : 'bg-[#128C7E] hover:bg-[#075E54] text-white'
            }`}
          >
            {added ? (
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

      </motion.div>
    );
  }

  // ==================== GRID VIEW (VERTICAL CARD) ====================
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      onClick={() => navigate('product-details', { product })}
      className="group bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/80 hover:border-[#000000]/30 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square overflow-hidden bg-[#F9FAFB]/60">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Red Discount OFF Badge Top Left */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-[#B91C1C] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-xs">
              {discountPercent}% OFF
            </span>
          </div>
        )}

        {/* Wishlist Heart Button Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors z-10 ${
            isWishlisted 
              ? 'bg-red-50 text-red-500 shadow-md' 
              : 'bg-white/80 text-gray-400 hover:text-red-500 shadow-xs'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
        </button>
      </div>

      {/* Card Details */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        
        {/* Title */}
        <div>
          <h3 className="font-bold text-gray-900 text-xs sm:text-sm font-sans group-hover:text-[#000000] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Weight Picker Select Dropdown */}
        <div onClick={(e) => e.stopPropagation()} className="relative">
          <select
            value={activeWeight.label}
            onChange={(e) => {
              const selected = weightsList.find(w => w.label === e.target.value);
              if (selected) setSelectedWeight(selected);
            }}
            className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-semibold text-gray-800 py-1.5 px-3 pr-8 appearance-none focus:outline-none focus:border-[#000000] cursor-pointer shadow-2xs"
          >
            {weightsList.map((w, wIdx) => (
              <option key={`${product.id}-${w.label}-${wIdx}`} value={w.label}>
                {w.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-1.5 space-y-2">
          
          {/* Strikethrough Original & Bold Current Price in Gold */}
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-400 line-through font-sans leading-none">
              ₹{origP}.00
            </span>
            <span className="text-base sm:text-lg font-black text-[#222222] font-serif leading-tight mt-0.5">
              ₹{curP}.00
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
              added 
                ? 'bg-[#075E54] text-white' 
                : 'bg-[#128C7E] hover:bg-[#075E54] text-white'
            }`}
          >
            {added ? (
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
}
