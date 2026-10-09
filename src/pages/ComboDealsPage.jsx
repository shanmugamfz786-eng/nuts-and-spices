import React from 'react';
import { useCart, isProductActive } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { ArrowLeft, Sparkles, Gift } from 'lucide-react';

export default function ComboDealsPage() {
  const { navigate, products } = useCart();

  // Filter combo products or popular festive packs
  const comboProducts = (products || []).filter(isProductActive).filter(p => 
    p.category === 'combos' || 
    (p.categoryName || '').toLowerCase().includes('combo') ||
    (p.name || '').toLowerCase().includes('combo') ||
    (p.badge || '').toLowerCase().includes('combo')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button & Page Header */}
      <div className="space-y-4">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#000000] hover:text-[#000000] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-gradient-to-r from-[#000000] via-[#000000] to-[#222222] p-8 sm:p-10 rounded-3xl text-white shadow-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#F9FAFB]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#F9FAFB]/90">
              Exclusive Combos & Hampers
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-serif text-white">
            Special Combo Deals
          </h1>

          <p className="text-xs sm:text-sm text-[#F9FAFB]/90 max-w-xl">
            Explore our curated festive bundles, gourmet gift boxes, and health power-packs. Ready for immediate dispatch and WhatsApp checkout.
          </p>
        </div>
      </div>

      {/* Products Display */}
      {comboProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E7EB] space-y-3">
          <Sparkles className="w-8 h-8 text-[#000000] mx-auto" />
          <h3 className="text-base font-bold text-gray-800">Combo Packs Updating</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            New festive hampers and customized dry fruit gift boxes are being added to this collection.
          </p>
          <button
            onClick={() => navigate('shop', { category: 'all' })}
            className="px-5 py-2.5 bg-[#000000] hover:bg-[#000000] text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Browse All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4.5">
          {comboProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
