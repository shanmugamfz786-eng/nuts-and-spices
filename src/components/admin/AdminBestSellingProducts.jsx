import React, { useState, useEffect, useRef } from 'react';
import { useCart, isProductBestSeller } from '../../context/CartContext';
import { Search, Award, ArrowLeft, CheckCircle2, Save, Loader2, Check } from 'lucide-react';

export default function AdminBestSellingProducts() {
  const { products, batchUpdateProducts, toggleBestSellingProduct, setAdminTab } = useCart();
  const [bestsellingSearchTerm, setBestsellingSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Local selection map: productId -> boolean
  const [selectedMap, setSelectedMap] = useState({});

  // Sync selection from products, preserving user's current session choices
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      setSelectedMap(prev => {
        const next = { ...prev };
        products.forEach(p => {
          if (next[p.id] === undefined) {
            next[p.id] = isProductBestSeller(p);
          }
        });
        return next;
      });
    }
  }, [products]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleToggle = async (productId) => {
    const prod = products.find(p => p.id === productId);
    const currentVal = selectedMap[productId] !== undefined ? Boolean(selectedMap[productId]) : isProductBestSeller(prod);
    const nextVal = !currentVal;

    // 1. Instant local UI update
    setSelectedMap(prev => ({
      ...prev,
      [productId]: nextVal
    }));

    // 2. Direct real-time sync with CartContext & TiDB Cloud
    try {
      await toggleBestSellingProduct(productId, nextVal);
      showNotification(`${prod ? prod.name : 'Product'} ${nextVal ? 'marked as Top Bestseller' : 'removed from Top Bestsellers'}!`);
    } catch (err) {
      showNotification('Failed to sync changes.', 'error');
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedProducts = products.map(p => {
        const isBest = selectedMap[p.id] !== undefined ? Boolean(selectedMap[p.id]) : isProductBestSeller(p);
        return {
          ...p,
          isBestSelling: isBest,
          is_best_selling: isBest ? 1 : 0
        };
      });

      const res = await batchUpdateProducts(updatedProducts);
      if (res && res.success !== false) {
        const count = updatedProducts.filter(p => p.isBestSelling).length;
        showNotification(`All saved! ${count} best selling products are now live across all devices.`);
      } else {
        showNotification('Failed to save. Please try again.', 'error');
      }
    } catch (err) {
      showNotification('Error saving changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const bestsellingModalProducts = products.filter(p => {
    return p.name.toLowerCase().includes(bestsellingSearchTerm.toLowerCase()) || 
           (p.id && p.id.toLowerCase().includes(bestsellingSearchTerm.toLowerCase()));
  });

  const selectedCount = products.filter(p => selectedMap[p.id] !== undefined ? Boolean(selectedMap[p.id]) : isProductBestSeller(p)).length;

  return (
    <div className="relative space-y-6 max-w-5xl mx-auto h-full flex flex-col pt-6 pb-20 md:pb-6 px-4 sm:px-6 md:px-8">
      {/* Toast Notification Popup */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border animate-in fade-in slide-in-from-top-4 duration-300 ${
          notification.type === 'error' ? 'bg-red-900 text-white border-red-700' : 'bg-gray-900 text-white border-gray-700'
        }`}>
          <CheckCircle2 className={`w-5 h-5 shrink-0 ${notification.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`} />
          <span className="text-sm font-bold tracking-wide">{notification.msg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAdminTab('products')}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            title="Back to Products"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Manage Top Sellers
            </h1>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">
              Click any product to toggle bestseller status. Changes sync live instantly to all devices!
            </p>
          </div>
        </div>

        {/* Top Save & Count Actions */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            {selectedCount} Bestsellers
          </span>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#128C7E] hover:bg-[#0e7065] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to All Devices...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs flex-1 flex flex-col min-h-0">
        <div className="relative shrink-0 mb-4">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products to mark as best selling..."
            value={bestsellingSearchTerm}
            onChange={(e) => setBestsellingSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200/80 bg-gray-50/50 p-3 space-y-3">
          {bestsellingModalProducts.length === 0 ? (
            <div className="text-center py-16">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <div className="text-gray-500 font-bold">No products found.</div>
            </div>
          ) : (
            bestsellingModalProducts.map(p => {
              const isSelected = selectedMap[p.id] !== undefined ? Boolean(selectedMap[p.id]) : isProductBestSeller(p);
              return (
                <div 
                  key={p.id} 
                  onClick={() => handleToggle(p.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected 
                      ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300 shadow-sm' 
                      : 'bg-white border-gray-200 hover:border-gray-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border border-gray-200 bg-gray-50 shrink-0" 
                    />
                    <div className="min-w-0">
                      <div className="font-extrabold text-gray-800 text-sm sm:text-base truncate">{p.name}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase mt-1">
                        {p.categoryName || p.category} • ₹{p.price}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-3 border-l border-gray-100 shrink-0">
                    {isSelected && (
                      <span className="text-[10px] sm:text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-700" />
                        Bestseller
                      </span>
                    )}
                    <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs' 
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
