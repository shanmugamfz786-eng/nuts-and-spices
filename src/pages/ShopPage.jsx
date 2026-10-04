import React, { useState, useEffect } from 'react';
import { useCart, isProductActive } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { LayoutGrid, List, ChevronDown, X } from 'lucide-react';

export default function ShopPage() {
  const { products, categories, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useCart();
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'all');
  const [sortBy, setSortBy] = useState('relevant');
  const [searchFilter, setSearchFilter] = useState(searchQuery || '');
  const [viewMode, setViewMode] = useState('list'); // 'grid' | 'list'

  useEffect(() => {
    if (searchQuery !== undefined) {
      setSearchFilter(searchQuery || '');
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  // Filtering
  let filtered = (products || []).filter(isProductActive).filter(p => {
    if (!activeCategory || activeCategory === 'all') {
      const matchesSearch = !searchFilter.trim() || 
                            p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            (p.categoryName || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
                            (p.description || '').toLowerCase().includes(searchFilter.toLowerCase());
      return matchesSearch;
    }

    const catObj = (categories || []).find(c => c.id === activeCategory);
    const cId = (activeCategory || '').toLowerCase().trim();
    const cName = catObj ? (catObj.name || '').toLowerCase().trim() : cId;
    const pCat = (p.category || '').toLowerCase().trim();
    const pCatName = (p.categoryName || '').toLowerCase().trim();

    const matchesCat = pCat === cId || 
                       pCat === cName || 
                       (cName && pCatName === cName) || 
                       (cId && pCatName === cId);

    const matchesSearch = !searchFilter.trim() || 
                          p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          pCatName.includes(searchFilter.toLowerCase()) ||
                          (p.description || '').toLowerCase().includes(searchFilter.toLowerCase());

    return matchesCat && matchesSearch;
  });

  // Sorting
  const getPrice = (item) => Number(item?.weights?.[0]?.price) || Number(item?.price) || 0;
  if (sortBy === 'relevant') {
    const categoryOrder = categories ? categories.map(c => c.id) : [];
    filtered.sort((a, b) => {
       let idxA = categoryOrder.indexOf(a.category);
       let idxB = categoryOrder.indexOf(b.category);
       if (idxA === -1) idxA = 999;
       if (idxB === -1) idxB = 999;
       return idxA - idxB;
    });
  } else if (sortBy === 'price-low') {
    filtered.sort((a, b) => getPrice(a) - getPrice(b));
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => getPrice(b) - getPrice(a));
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Search Filter Clear Tag (Only shown if search query exists) */}
      {searchFilter.trim() && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-[#8B3A13] w-fit">
          <span>Search: "{searchFilter}"</span>
          <button 
            onClick={() => { setSearchFilter(''); if (setSearchQuery) setSearchQuery(''); }}
            className="p-0.5 hover:bg-amber-100 rounded-full cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP SORT & VIEW HEADER BAR */}
      <div className="flex items-center justify-end gap-3 border-b border-gray-200/70 pb-4">
        
        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">
            Sort by:
          </span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 py-2 pl-3 pr-8 appearance-none focus:outline-none focus:border-[#8B3A13] shadow-2xs cursor-pointer min-w-[130px]"
            >
              <option value="relevant">Relevant</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#8B3A13] text-white shadow-xs'
                : 'text-gray-400 hover:text-gray-700'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#8B3A13] text-white shadow-xs'
                : 'text-gray-400 hover:text-gray-700'
            }`}
            title="List View"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="4" width="18" height="6.5" rx="1.5" />
              <rect x="3" y="13.5" width="18" height="6.5" rx="1.5" />
            </svg>
          </button>
        </div>

      </div>

      {/* PRODUCT LIST / GRID CONTAINER */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E6D7C3] space-y-3">
          <p className="text-lg font-bold text-gray-800">No products found</p>
          <p className="text-xs text-gray-500">Try selecting a different category or clearing search filters.</p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchFilter(''); }}
            className="px-4 py-2 bg-[#8B3A13] text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4.5"
            : "space-y-3 sm:space-y-4"
        }>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} />
          ))}
        </div>
      )}

    </div>
  );
}
