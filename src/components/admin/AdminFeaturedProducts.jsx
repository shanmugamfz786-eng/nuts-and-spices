import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Search, Star, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminFeaturedProducts() {
  const { products, updateProduct, setAdminTab } = useCart();
  const [featuredSearchTerm, setFeaturedSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleToggle = async (product) => {
    const nextState = !product.isFeaturedToday;
    await updateProduct(product.id, { isFeaturedToday: nextState });

    if (nextState) {
      showNotification(`"${product.name}" added to Featured Today! Live on all devices.`);
    } else {
      showNotification(`"${product.name}" removed from Featured Today.`);
    }
  };

  const featuredModalProducts = products.filter(p => {
    return p.name.toLowerCase().includes(featuredSearchTerm.toLowerCase()) || 
           (p.id && p.id.toLowerCase().includes(featuredSearchTerm.toLowerCase()));
  });

  return (
    <div className="relative space-y-6 max-w-5xl mx-auto h-full flex flex-col pt-6 pb-20 md:pb-6 px-4 sm:px-6 md:px-8">
      {/* Toast Notification Popup */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-bold tracking-wide">{notification.msg}</span>
        </div>
      )}

      <div className="flex items-center justify-between bg-white p-4 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAdminTab('products')}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            title="Back to Products"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Manage Featured Showcase
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs flex-1 flex flex-col min-h-0">
        <div className="relative shrink-0 mb-4">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products to feature..."
            value={featuredSearchTerm}
            onChange={(e) => setFeaturedSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200/80 bg-gray-50/50 p-3 space-y-3">
          {featuredModalProducts.length === 0 ? (
            <div className="text-center py-16">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <div className="text-gray-500 font-bold">No products found.</div>
            </div>
          ) : (
            featuredModalProducts.map(p => (
              <label key={p.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 shadow-sm cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                  <img src={p.image} alt={p.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border border-gray-200 bg-gray-50 shrink-0" />
                  <div>
                    <div className="font-extrabold text-gray-800 text-sm sm:text-base">{p.name}</div>
                    <div className="text-[10px] sm:text-xs font-bold text-amber-700 uppercase mt-1">{p.categoryName || p.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-2 border-l border-gray-100 ml-2">
                  {p.isFeaturedToday && <span className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase hidden sm:block shrink-0">Featured</span>}
                  <input 
                    type="checkbox" 
                    checked={!!p.isFeaturedToday}
                    onChange={() => handleToggle(p)}
                    className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 bg-gray-100 border-gray-300 rounded-md focus:ring-amber-500 cursor-pointer shrink-0"
                  />
                </div>
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
