import React, { useState, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { Image as ImageIcon, Pencil, Trash2, Plus, X, Upload, Eye, Package, Star } from 'lucide-react';

export default function AdminCategories() {
  const { categories, products, addCategory, updateCategory, deleteCategory, addProduct, toggleCategoryPremium } = useCart();
  
  // Tab state: 'all' | 'premium'
  const [categoryTab, setCategoryTab] = useState('all');

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [iconLucideName, setIconLucideName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [isCategoryPremium, setIsCategoryPremium] = useState(false);

  // View Category Products Modal State
  const [viewingCategory, setViewingCategory] = useState(null);
  const [isAddingProdInCat, setIsAddingProdInCat] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('Best Seller');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const prodFileInputRef = useRef(null);

  // Hidden File Input Ref for Device Image Picker
  const [quickUploadCategoryId, setQuickUploadCategoryId] = useState(null);
  const fileInputRef = useRef(null);

  const filteredCategories = categories.filter(c => c.id !== 'all');
  const premiumCategories = filteredCategories.filter(c => c.isPremium);
  const displayedCategories = categoryTab === 'premium' ? premiumCategories : filteredCategories;

  const getCategoryProducts = (cat) => {
    if (!cat || !products) return [];
    const cId = (cat.id || '').toLowerCase();
    const cName = (cat.name || '').toLowerCase();
    return products.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const pCatName = (p.categoryName || '').toLowerCase();
      return pCat === cId || pCat === cName || pCatName === cName || pCatName === cId;
    });
  };

  const handleAddProductToCategory = (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice || !viewingCategory) return;

    const basePrice = Number(newProdPrice) || 290;
    const finalImg = newProdImage.trim() || 'https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=800';

    addProduct({
      name: newProdName.trim(),
      category: viewingCategory.id,
      categoryName: viewingCategory.name,
      price: basePrice,
      badge: newProdBadge.trim() || 'Best Seller',
      image: finalImg,
      description: newProdDesc.trim() || `Authentic ${newProdName.trim()} packed for premium quality and freshness.`,
      weights: [
        { label: '250g', price: basePrice, originalPrice: Math.round(basePrice * 1.2) },
        { label: '500g', price: Math.round(basePrice * 1.8), originalPrice: Math.round(basePrice * 2.1) },
        { label: '1 kg', price: Math.round(basePrice * 3.4), originalPrice: Math.round(basePrice * 4.0) }
      ]
    });

    setNewProdName('');
    setNewProdPrice('');
    setNewProdImage('');
    setNewProdDesc('');
    setIsAddingProdInCat(false);
  };

  const handleOpenAdd = () => {
    if (isFormOpen && !editingCategory) {
      setIsFormOpen(false);
      return;
    }
    setEditingCategory(null);
    setCategoryName('');
    setIconLucideName('');
    setCategoryImage('');
    setIsCategoryPremium(false);
    setIsFormOpen(true);
  };

  const handleOpenAddPremium = () => {
    setEditingCategory(null);
    setCategoryName('');
    setIconLucideName('');
    setCategoryImage('');
    setIsCategoryPremium(true);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name || '');
    setIconLucideName(cat.iconLucideName || cat.icon || '');
    setCategoryImage(cat.image || '');
    setIsCategoryPremium(Boolean(cat.isPremium));
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setCategoryName('');
    setIconLucideName('');
    setCategoryImage('');
    setIsCategoryPremium(false);
  };

  const compressImageFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = Math.round(width);
          canvas.height = Math.round(height);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = () => resolve(e.target.result);
      };
      reader.onerror = () => resolve('');
    });
  };

  const handleQuickImageUpload = (catId) => {
    setQuickUploadCategoryId(catId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImageFile(file);
        if (compressedBase64) {
          if (quickUploadCategoryId) {
            updateCategory(quickUploadCategoryId, { image: compressedBase64 });
            setQuickUploadCategoryId(null);
          } else {
            setCategoryImage(compressedBase64);
          }
        }
      } catch (err) {
        console.error('Failed to process image:', err);
      }
    }
    if (e.target) e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const finalImage = categoryImage || (editingCategory ? editingCategory.image : 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: categoryName.trim(),
        iconLucideName: iconLucideName.trim(),
        image: finalImage,
        isPremium: isCategoryPremium
      });
    } else {
      const generatedId = categoryName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
      addCategory({
        id: generatedId,
        name: categoryName.trim(),
        iconLucideName: iconLucideName.trim() || 'Sparkles',
        icon: '🌰',
        image: finalImage,
        isPremium: isCategoryPremium
      });
    }

    handleCancel();
  };

  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState(null);

  const handleDelete = (cat) => {
    setDeleteConfirmCategory(cat);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Hidden File Input for Device Image Selection */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Manage Categories
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Upload images or edit category titles. Click "Copy Config for Git" to push changes to all devices.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const categoryJson = JSON.stringify(categories, null, 2);
              navigator.clipboard.writeText(categoryJson);
              alert('Category Config copied to clipboard! Share or tell Antigravity to commit and push to Git.');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-lg border border-amber-300/80 cursor-pointer transition-all"
          >
            <span>📋 Copy Config for Git</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddPremium}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-lg shadow-2xs cursor-pointer transition-all border border-amber-800/30"
          >
            <Star className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
            <span>+ Add Premium Category</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs rounded-lg shadow-2xs cursor-pointer transition-all border border-red-700/20"
          >
            {isFormOpen ? (
              <span>Cancel</span>
            ) : (
              <>
                <Plus className="w-4 h-4 text-white" />
                <span>Add Category</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CATEGORY TABS: ALL vs PREMIUM */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setCategoryTab('all')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            categoryTab === 'all'
              ? 'bg-gray-900 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          All Categories ({filteredCategories.length})
        </button>
        <button
          type="button"
          onClick={() => setCategoryTab('premium')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            categoryTab === 'premium'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${categoryTab === 'premium' ? 'fill-white text-white' : 'fill-amber-500 text-amber-500'}`} />
          <span>Shop Premium Categories ({premiumCategories.length})</span>
        </button>
      </div>

      {/* EDIT / ADD CATEGORY FORM CARD (Matches Screenshot Exactly) */}
      {isFormOpen && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-2xs p-6 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>{editingCategory ? 'Edit Category' : 'Add Category'}</span>
              {isCategoryPremium && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  Premium Footer
                </span>
              )}
            </h2>
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Category Name
              </label>
              <input
                type="text"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. ADIYAL / NUTS & DRY FRUITS"
                className="w-full bg-white border border-gray-200 focus:border-amber-500 rounded-lg px-3 py-2 text-xs font-normal text-gray-800 outline-none transition-all"
              />
            </div>

            {/* Category Image URL & File Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Category Image (URL or Upload from Device)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={categoryImage}
                  onChange={(e) => setCategoryImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or upload image"
                  className="flex-1 bg-white border border-gray-200 focus:border-amber-500 rounded-lg px-3 py-2 text-xs font-normal text-gray-800 outline-none transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    setQuickUploadCategoryId(null);
                    if (fileInputRef.current) fileInputRef.current.click();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-purple-600" />
                  <span>Choose File</span>
                </button>
              </div>
              {categoryImage && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={categoryImage} alt="Preview" className="w-10 h-10 object-cover rounded-md border border-gray-200" />
                  <button
                    type="button"
                    onClick={() => setCategoryImage('')}
                    className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Premium Category Checkbox */}
            <div className="flex items-center gap-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg">
              <input
                type="checkbox"
                id="isPremiumCheckbox"
                checked={isCategoryPremium}
                onChange={(e) => setIsCategoryPremium(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="isPremiumCheckbox" className="text-xs font-bold text-amber-900 cursor-pointer flex items-center gap-1.5 select-none">
                <Star className={`w-3.5 h-3.5 ${isCategoryPremium ? 'text-amber-500 fill-amber-500' : 'text-amber-700'}`} />
                <span>Feature in Website Footer ("SHOP PREMIUM CATEGORIES")</span>
              </label>
            </div>

            {/* Action Submit Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs rounded-lg shadow-2xs cursor-pointer transition-all"
              >
                {editingCategory ? 'Update Category' : 'Save Category'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg cursor-pointer transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CATEGORIES TABLE CANVAS */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/40 text-gray-700 font-bold text-xs">
                <th className="py-3.5 px-6 w-24">Icon / Image</th>
                <th className="py-3.5 px-6">Category Name</th>
                <th className="py-3.5 px-6">Products</th>
                <th className="py-3.5 px-6">Footer Premium</th>
                <th className="py-3.5 px-6 text-right w-44">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {displayedCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    {categoryTab === 'premium'
                      ? 'No premium categories marked yet. Click "+ Add Premium Category" or click the star button on any category below to feature it in the footer.'
                      : 'No categories found. Click "+ Add Category" to create one.'}
                  </td>
                </tr>
              ) : (
                displayedCategories.map((cat) => {
                  const catProds = getCategoryProducts(cat);
                  return (
                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* Icon / Image */}
                      <td className="py-4 px-6">
                        <div className="w-9 h-9 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400 stroke-[1.5]" />
                          )}
                        </div>
                      </td>

                      {/* Category Name */}
                      <td className="py-4 px-6 font-bold text-gray-900 text-xs tracking-tight uppercase">
                        {cat.name}
                      </td>

                      {/* Products Count - Click to View & Add Products */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => {
                            setViewingCategory(cat);
                            setIsAddingProdInCat(false);
                          }}
                          title="Click to view & add products in this category"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-full font-bold text-xs border border-amber-300/80 shadow-2xs transition-all cursor-pointer group hover:scale-105"
                        >
                          <Package className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition-transform" />
                          <span>{catProds.length} Products</span>
                          <Eye className="w-3.5 h-3.5 text-amber-700 opacity-60 group-hover:opacity-100" />
                        </button>
                      </td>

                      {/* Footer Premium Status & 1-Click Toggle */}
                      <td className="py-4 px-6">
                        <button
                          type="button"
                          onClick={() => toggleCategoryPremium(cat.id)}
                          title={cat.isPremium ? "Click to remove from Footer Shop Premium Categories" : "Click to feature in Footer Shop Premium Categories"}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                            cat.isPremium
                              ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200 shadow-2xs'
                              : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${cat.isPremium ? 'text-amber-600 fill-amber-500' : 'text-gray-400'}`} />
                          <span>{cat.isPremium ? 'Active in Footer' : 'Standard'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Upload Image Button */}
                          <button
                            onClick={() => handleQuickImageUpload(cat.id)}
                            title="Upload/Change Category Image"
                            className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 rounded-md transition-colors cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                          </button>

                          {/* Edit Notepad Icon Button */}
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            title="Edit Category"
                            className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-400 hover:text-sky-500 rounded-md transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete Trash Icon Button */}
                          <button
                            onClick={() => handleDelete(cat)}
                            title="Delete Category"
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW & ADD CATEGORY PRODUCTS MODAL */}
      {viewingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs">
          {/* Hidden File Input for Product Device Image Selection */}
          <input
            type="file"
            accept="image/*"
            ref={prodFileInputRef}
            onChange={async (e) => {
              const f = e.target.files && e.target.files[0];
              if (f) {
                const base64 = await compressImageFile(f);
                if (base64) setNewProdImage(base64);
              }
              if (e.target) e.target.value = '';
            }}
            className="hidden"
          />

          <div className="bg-white border border-gray-200 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl my-auto text-gray-800 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                  <img src={viewingCategory.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600'} alt={viewingCategory.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight">{viewingCategory.name}</h3>
                  <p className="text-xs text-gray-500">{getCategoryProducts(viewingCategory).length} Items in this category</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingProdInCat(!isAddingProdInCat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isAddingProdInCat 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-xs'
                  }`}
                >
                  {isAddingProdInCat ? (
                    <span>Cancel</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-white" />
                      <span>Add Product</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setViewingCategory(null);
                    setIsAddingProdInCat(false);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Expandable Add Product Form */}
            {isAddingProdInCat && (
              <form onSubmit={handleAddProductToCategory} className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 shrink-0">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Add New Product to "{viewingCategory.name}"
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Royal Kashmiri Saffron"
                      className="w-full bg-white border border-gray-200 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Price ₹ (250g) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="e.g. 450"
                      className="w-full bg-white border border-gray-200 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={newProdBadge}
                      onChange={(e) => setNewProdBadge(e.target.value)}
                      placeholder="Best Seller / Premium"
                      className="w-full bg-white border border-gray-200 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Product Image</label>
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        placeholder="Image URL or upload"
                        className="flex-1 bg-white border border-gray-200 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (prodFileInputRef.current) prodFileInputRef.current.click();
                        }}
                        className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg font-bold text-[11px] cursor-pointer shrink-0"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Short Description</label>
                  <input
                    type="text"
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Short description of taste, origin, wellness..."
                    className="w-full bg-white border border-gray-200 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 outline-none"
                  />
                </div>

                {newProdImage && (
                  <div className="flex items-center gap-2 pt-1">
                    <img src={newProdImage} alt="Preview" className="w-8 h-8 object-cover rounded-md border border-gray-200" />
                    <span className="text-[11px] text-[#000000] font-bold">Image Attached!</span>
                  </div>
                )}

                <div className="pt-1 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingProdInCat(false)}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                  >
                    Save & Add Product
                  </button>
                </div>
              </form>
            )}

            {/* Product List Content */}
            <div className="flex-1 overflow-y-auto space-y-3 py-1 pr-1">
              {getCategoryProducts(viewingCategory).length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs font-medium">
                  No products are currently assigned to "{viewingCategory.name}". Click "+ Add Product" above to add one!
                </div>
              ) : (
                getCategoryProducts(viewingCategory).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{product.name}</h4>
                        <span className="text-[11px] text-gray-500">₹{product.price || product.weights?.[0]?.price} • {product.badge || 'Active'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full shrink-0">
                      Active
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setViewingCategory(null);
                  setIsAddingProdInCat(false);
                }}
                className="w-full py-2.5 bg-[#F9FAFB] hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs cursor-pointer border border-[#E5E7EB] transition-all"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteConfirmCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl my-auto text-gray-800 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Category?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete <strong className="text-gray-800">"{deleteConfirmCategory.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmCategory(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCategory(deleteConfirmCategory.id);
                  if (editingCategory?.id === deleteConfirmCategory.id) {
                    handleCancel();
                  }
                  setDeleteConfirmCategory(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
