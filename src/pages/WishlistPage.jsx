import React from 'react';
import { useCart, isProductActive } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const { navigate, products, wishlist } = useCart();

  // Filter products that are in the user's wishlist
  const wishlistProducts = (products || [])
    .filter(isProductActive)
    .filter(p => (wishlist || []).includes(p.id));

  return (
    <div className="bg-white min-h-screen pb-16 space-y-8">
      
      {/* PAGE HEADER BANNER (Warm Spice Gradient - ZERO DARK SHADES) */}
      <section className="relative bg-gradient-to-br from-[#128C7E] via-[#075E54] to-[#075E54] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl border-b border-[#075E54]/30">
        
        {/* Subtle Decorative Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          
          {/* Back Button */}
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          {/* Banner Main Content */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider border border-white/40 shadow-xs">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Your Favorites</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-wide uppercase">
                My Wishlist
              </h1>

              <p className="text-xs sm:text-sm text-[#E5E7EB] leading-relaxed font-serif">
                Your saved favorite items from NUTS & SPICES. Easily select pack weights, add to cart, or place direct WhatsApp orders.
              </p>

              <div className="pt-1 text-xs font-extrabold text-white flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>{wishlistProducts.length} Saved {wishlistProducts.length === 1 ? 'Item' : 'Items'}</span>
              </div>
            </div>

            {/* Heart Icon Badge Graphic */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/15 border-2 border-white/40 flex items-center justify-center shrink-0 shadow-2xl backdrop-blur-md">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-rose-500 fill-rose-500 animate-bounce" />
            </div>

          </div>

        </div>

      </section>

      {/* PRODUCTS GRID OR EMPTY STATE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {wishlistProducts.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-black font-serif text-[#000000]">
                Saved Products ({wishlistProducts.length})
              </h2>
              <button
                onClick={() => navigate('shop', { category: 'all' })}
                className="text-xs font-extrabold text-[#000000] hover:underline cursor-pointer"
              >
                + Add More Products
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          /* EMPTY WISHLIST STATE */
          <div className="text-center py-20 px-4 bg-[#F9FAFB] rounded-3xl border border-[#E5E7EB] max-w-xl mx-auto space-y-5 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto shadow-inner">
              <Heart className="w-10 h-10 fill-current" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black font-serif text-[#000000]">
                Your Wishlist is Empty
              </h3>
              <p className="text-xs sm:text-sm text-[#8C7A6B] max-w-md mx-auto leading-relaxed">
                You haven't saved any favorite items yet. Click the heart icon ❤️ on any product to save it here for quick access!
              </p>
            </div>

            <button
              onClick={() => navigate('shop', { category: 'all' })}
              className="px-8 py-3 rounded-full bg-[#128C7E] text-white text-xs font-black uppercase tracking-wider hover:bg-[#075E54] transition-all shadow-md inline-flex items-center gap-2 cursor-pointer border border-[#075E54]/30"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </button>
          </div>
        )}

      </main>

    </div>
  );
}
