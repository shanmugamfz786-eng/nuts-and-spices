import React, { useState } from 'react';
import { useCart, isProductActive } from '../context/CartContext';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';

export default function SearchModal() {
  const { products, isSearchOpen, setIsSearchOpen, navigate, addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isSearchOpen) return null;

  const activeProducts = (products || []).filter(isProductActive);

  const filteredProducts = searchTerm.trim() === '' 
    ? activeProducts.slice(0, 4) // default suggestions
    : activeProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.categoryName || p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 bg-[#3D2314]/35 backdrop-blur-sm flex items-start justify-center pt-16 px-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#E5E7EB]">
        {/* Search Header Input */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-3 bg-[#F9FAFB]">
          <Search className="w-5 h-5 text-[#000000]" />
          <input
            type="text"
            placeholder="Search The Product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-transparent outline-none text-[#000000] placeholder-[#8C7A6B] text-base font-medium"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="text-xs text-[#8C7A6B] hover:text-[#000000] font-medium"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-[#8C7A6B] hover:text-[#000000] hover:bg-[#E5E7EB]/50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto divide-y divide-[#F9FAFB]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#000000] mb-3">
            {searchTerm.trim() ? `Search Results (${filteredProducts.length})` : 'Popular Suggestions'}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-8 text-center text-[#8C7A6B]">
              <p className="text-base font-medium">No products matching "{searchTerm}"</p>
              <p className="text-xs mt-1">Try searching for "Almonds", "Spices", or "Dates"</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const weightObj = product?.weights?.[0] || { label: '250g', price: Number(product?.price) || 350 };
              return (
                <div 
                  key={product.id}
                  className="py-3 flex items-center justify-between group hover:bg-[#F9FAFB] rounded-xl px-2 transition-colors cursor-pointer"
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigate('product-details', { product });
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-[#E5E7EB]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#000000] group-hover:text-[#000000] transition-colors">
                        {product.name}
                      </h4>
                      <span className="text-xs text-[#000000] font-semibold">
                        ₹{weightObj.price} / {weightObj.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, weightObj, 1);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-[#F9FAFB] text-[#000000] hover:bg-[#000000] hover:text-white rounded-lg transition-colors flex items-center gap-1 border border-[#E5E7EB]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>+ Add</span>
                    </button>
                    <ArrowRight className="w-4 h-4 text-[#8C7A6B] group-hover:text-[#000000] transition-colors" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F9FAFB] border-t border-[#E5E7EB] text-center">
          <button
            onClick={() => {
              setIsSearchOpen(false);
              navigate('shop', { category: 'all' });
            }}
            className="text-xs font-bold text-[#000000] hover:underline"
          >
            View All Products in Shop →
          </button>
        </div>
      </div>
    </div>
  );
}
