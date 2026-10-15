import React, { useState } from 'react';
import { useCart, isProductActive } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { ArrowLeft, SlidersHorizontal, Sparkles, ShoppingBag } from 'lucide-react';

export default function CategoryPage() {
  const { navigate, products, categories, selectedCategory } = useCart();
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-low' | 'price-high' | 'rating'

  // Find category metadata
  const currentCategory = (categories || []).find(c => 
    c.id === selectedCategory || 
    (c.name && c.name.toLowerCase() === (selectedCategory || '').toLowerCase())
  ) || {
    id: selectedCategory || 'all',
    name: selectedCategory ? selectedCategory.replace(/-/g, ' ').toUpperCase() : 'SPECIAL COLLECTION',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600',
    description: 'Explore our handpicked gourmet collection crafted with 100% natural ingredients.'
  };

  // Filter products for ONLY this category
  const filteredProducts = (products || [])
    .filter(isProductActive)
    .filter(p => {
      if (!selectedCategory || selectedCategory === 'all') return true;
      const cId = (selectedCategory || '').toLowerCase().trim();
      const cName = (currentCategory.name || '').toLowerCase().trim();
      const pCat = (p.category || '').toLowerCase().trim();
      const pCatName = (p.categoryName || '').toLowerCase().trim();

      if (cId === 'featured-today' || cId === 'featured') {
        return p.isFeaturedToday === true || p.is_featured_today === 1;
      }

      return (
        pCat === cId ||
        pCat === cName ||
        (cName && pCatName === cName) ||
        (cId && pCatName === cId) ||
        (pCat && cId && (pCat.includes(cId) || cId.includes(pCat))) ||
        (pCatName && cName && (pCatName.includes(cName) || cName.includes(pCatName)))
      );
    });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.weights && a.weights[0] ? a.weights[0].price : (a.price || 0);
    const bPrice = b.weights && b.weights[0] ? b.weights[0].price : (b.price || 0);

    if (sortBy === 'price-low') return aPrice - bPrice;
    if (sortBy === 'price-high') return bPrice - aPrice;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // default featured
  });

  return (
    <div className="bg-[#FAF7F2]/40 min-h-screen pb-16 space-y-8">
      
      {/* CLEAN LIGHT GOURMET BREADCRUMB & CATEGORY HEADER (NO DARK BG) */}
      <section className="bg-gradient-to-r from-[#FAF7F2] via-emerald-50/50 to-[#FAF7F2] border-b border-emerald-100/80 py-7 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate('home', { category: 'all' })}
              className="p-2.5 text-gray-700 hover:text-[#128C7E] transition-all bg-white hover:bg-emerald-50 rounded-2xl border border-gray-200/80 shadow-xs cursor-pointer active:scale-95 shrink-0"
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5 text-[#128C7E]" />
            </button>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-[#128C7E] text-[10px] font-black uppercase tracking-widest border border-emerald-200/80 mb-1">
                <span>Handpicked Collection</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-serif uppercase tracking-wide text-gray-950">
                {currentCategory.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-white/90 px-3.5 py-2 rounded-xl border border-gray-200/80 shadow-2xs self-start sm:self-auto font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{sortedProducts.length} Products Available</span>
          </div>
        </div>
      </section>

      {/* FILTER & SORT BAR + PRODUCT GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Controls Bar */}
        <div className="flex justify-end pb-4 border-b border-[#E5E7EB]">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <SlidersHorizontal className="w-4 h-4 text-[#128C7E]" />
              <span>Sort By:</span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#E5E7EB] rounded-xl text-xs font-extrabold text-[#000000] px-3 py-2 focus:outline-none focus:border-[#128C7E] shadow-sm cursor-pointer"
            >
              <option value="featured">Featured / Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* PRODUCTS GRID */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-16 px-4 bg-[#FAF7F2] rounded-3xl border border-[#E5E7EB] max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#128C7E] flex items-center justify-center mx-auto border border-emerald-200/60">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-serif text-[#000000]">
              No Products Found in {currentCategory.name}
            </h3>
            <p className="text-xs text-[#8C7A6B]">
              We are currently updating stock for this category. Please check back soon or browse our other available collections!
            </p>
            <button
              onClick={() => navigate('categories', { category: 'all' })}
              className="px-6 py-2.5 rounded-full bg-[#128C7E] hover:bg-[#0e7064] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Explore Other Categories
            </button>
          </div>
        )}

      </main>

    </div>
  );
}
