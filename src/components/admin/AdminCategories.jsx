import React, { useState, useRef, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  Image as ImageIcon, 
  Pencil, 
  Trash2, 
  Plus, 
  X, 
  Upload, 
  Eye, 
  Package, 
  Star, 
  Search, 
  LayoutGrid, 
  List, 
  Check, 
  Copy, 
  Layers, 
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../api';

export default function AdminCategories() {
  const { 
    categories, 
    products, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addProduct, 
    toggleCategoryPremium,
    navigate 
  } = useCart();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryTab, setCategoryTab] = useState('all'); // 'all' | 'premium' | 'empty'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Form Modal state (Add / Edit)
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

  // Device File Upload Refs
  const [quickUploadCategoryId, setQuickUploadCategoryId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Delete Confirm Modal State
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState(null);

  // Clean list without 'all' meta category
  const rawCategories = useMemo(() => {
    return categories.filter(c => c.id !== 'all');
  }, [categories]);

  // Product mapper by category
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

  // KPIs
  const totalCategoriesCount = rawCategories.length;
  const premiumCategoriesCount = rawCategories.filter(c => c.isPremium).length;
  const totalProductsCataloged = useMemo(() => {
    return products ? products.filter(p => p.status !== 'Inactive' && p.active !== false).length : 0;
  }, [products]);

  // Filtered & Searched categories
  const displayedCategories = useMemo(() => {
    return rawCategories.filter(cat => {
      const matchesSearch = 
        (cat.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.id || '').toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (categoryTab === 'premium') return Boolean(cat.isPremium);
      if (categoryTab === 'empty') {
        const prods = getCategoryProducts(cat);
        return prods.length === 0;
      }
      return true;
    });
  }, [rawCategories, searchTerm, categoryTab, products]);

  // Image compressor
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
      if (file.size > 20 * 1024 * 1024) {
        alert('File size exceeds 20MB limit. Please choose a smaller image.');
        if (e.target) e.target.value = '';
        return;
      }
      try {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        let finalImageUrl = (data && data.success && data.imageUrl) ? data.imageUrl : null;
        if (!finalImageUrl) {
          finalImageUrl = await compressImageFile(file);
        }

        if (finalImageUrl) {
          if (quickUploadCategoryId) {
            updateCategory(quickUploadCategoryId, { image: finalImageUrl });
            setQuickUploadCategoryId(null);
          } else {
            setCategoryImage(finalImageUrl);
          }
        }
      } catch (err) {
        console.error('Failed to upload category image to Cloudinary, fallback to local compressor:', err);
        const compressedBase64 = await compressImageFile(file);
        if (compressedBase64) {
          if (quickUploadCategoryId) {
            updateCategory(quickUploadCategoryId, { image: compressedBase64 });
            setQuickUploadCategoryId(null);
          } else {
            setCategoryImage(compressedBase64);
          }
        }
      } finally {
        setUploadingImage(false);
      }
    }
    if (e.target) e.target.value = '';
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCategoryName('');
    setIconLucideName('');
    setCategoryImage('');
    setIsCategoryPremium(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name || '');
    setIconLucideName(cat.iconLucideName || cat.icon || '');
    setCategoryImage(cat.image || '');
    setIsCategoryPremium(Boolean(cat.isPremium));
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setCategoryName('');
    setIconLucideName('');
    setCategoryImage('');
    setIsCategoryPremium(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const finalImage = categoryImage || (editingCategory ? editingCategory.image : 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: categoryName.trim(),
        iconLucideName: iconLucideName.trim() || 'Sparkles',
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

    handleCloseForm();
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      
      {/* Hidden File Input for Device Image Selection */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* COMMAND HEADER & ACTION BAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 tracking-tight flex items-center gap-2">
              <span>Category Catalog Manager</span>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                {rawCategories.length} Total
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize storefront collections, manage imagery, and feature gourmet categories in the footer.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* + Add Category Button */}
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer tracking-wider uppercase"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search category by name or ID..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#128C7E] rounded-xl text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills & View Switcher */}
          <div className="flex items-center justify-between md:justify-end gap-2 flex-wrap">
            
            {/* Filter Pills */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/60">
              <button
                type="button"
                onClick={() => setCategoryTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  categoryTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({rawCategories.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryTab('premium')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  categoryTab === 'premium'
                    ? 'bg-white text-amber-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>Footer Featured ({premiumCategoriesCount})</span>
              </button>
            </div>

            {/* View Mode Toggle: Grid vs Table */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/60">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Grid Card View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#128C7E] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Table List View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[#128C7E] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* 3. CONTENT AREA: GRID CARDS OR HIGH-DENSITY TABLE */}
      {displayedCategories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Categories Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm 
              ? `No categories match the keyword "${searchTerm}". Try a different keyword.` 
              : categoryTab === 'premium' 
              ? 'No categories are currently marked as Footer Premium. Click the star icon on any category to feature it.' 
              : 'Click "+ Add Category" above to create your first category.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs font-bold text-[#128C7E] hover:underline"
            >
              Clear Search Filter
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        
        /* MODERN LUXURY CARD GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayedCategories.map((cat, idx) => {
            const catProds = getCategoryProducts(cat);
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-[#128C7E]/50 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col relative"
              >
                {/* Image Banner */}
                <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                  {cat.image ? (
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <ImageIcon className="w-10 h-10" />
                      <span className="text-[10px] font-bold mt-1 uppercase tracking-wider text-slate-400">No Image</span>
                    </div>
                  )}

                  {/* Top Badges Overlay */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                    {/* Products Count Tag */}
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold shadow-sm inline-flex items-center gap-1 pointer-events-auto">
                      <Package className="w-3 h-3 text-emerald-400" />
                      <span>{catProds.length} Products</span>
                    </span>

                    {/* Footer Premium Star Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleCategoryPremium(cat.id)}
                      title={cat.isPremium ? "Active in Footer: Click to remove" : "Click to feature in Footer Premium banner"}
                      className={`p-1.5 rounded-full shadow-sm backdrop-blur-md transition-all cursor-pointer pointer-events-auto ${
                        cat.isPremium
                          ? 'bg-amber-500 text-white hover:bg-amber-600 ring-2 ring-amber-300/60'
                          : 'bg-white/80 hover:bg-white text-slate-500 hover:text-amber-500'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${cat.isPremium ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Quick Change Image overlay button */}
                  <button
                    onClick={() => handleQuickImageUpload(cat.id)}
                    className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-800 text-[10px] font-bold backdrop-blur-md shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1"
                    title="Change category image from device"
                  >
                    <Upload className="w-3 h-3 text-[#128C7E]" />
                    <span>Change Photo</span>
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-black text-sm text-slate-900 uppercase tracking-tight line-clamp-1 group-hover:text-[#128C7E] transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                      id: {cat.id}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    
                    {/* View Products button */}
                    <button
                      onClick={() => {
                        setViewingCategory(cat);
                        setIsAddingProdInCat(false);
                      }}
                      className="flex-1 py-1.5 px-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#128C7E] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200/60 hover:border-emerald-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Items</span>
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      title="Edit Category Details"
                      className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/60 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => setDeleteConfirmCategory(cat)}
                      title="Delete Category"
                      className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200/60 hover:border-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      ) : (

        /* HIGH-DENSITY POLISHED TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-5 w-20">Banner</th>
                  <th className="py-3.5 px-5">Category Name & Slug</th>
                  <th className="py-3.5 px-5">Products Assigned</th>
                  <th className="py-3.5 px-5">Footer Showcase</th>
                  <th className="py-3.5 px-5 text-right w-44">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {displayedCategories.map((cat) => {
                  const catProds = getCategoryProducts(cat);
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors group">
                      
                      {/* Image Thumbnail */}
                      <td className="py-3.5 px-5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group-hover:shadow-xs transition-shadow">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Category Name & Slug */}
                      <td className="py-3.5 px-5">
                        <div>
                          <h4 className="font-serif font-black text-xs text-slate-900 uppercase tracking-tight group-hover:text-[#128C7E] transition-colors">
                            {cat.name}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            /category/{cat.id}
                          </span>
                        </div>
                      </td>

                      {/* Products Count Button */}
                      <td className="py-3.5 px-5">
                        <button
                          onClick={() => {
                            setViewingCategory(cat);
                            setIsAddingProdInCat(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#128C7E] font-bold text-xs border border-slate-200 hover:border-emerald-200 transition-all cursor-pointer shadow-2xs"
                          title="Click to view all items in this category"
                        >
                          <Package className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{catProds.length} Products</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </td>

                      {/* Footer Premium Star Toggle */}
                      <td className="py-3.5 px-5">
                        <button
                          type="button"
                          onClick={() => toggleCategoryPremium(cat.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                            cat.isPremium
                              ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Toggle featured showcase in website footer"
                        >
                          <Star className={`w-3.5 h-3.5 ${cat.isPremium ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                          <span>{cat.isPremium ? 'Featured in Footer' : 'Standard'}</span>
                        </button>
                      </td>

                      {/* Row Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Upload */}
                          <button
                            onClick={() => handleQuickImageUpload(cat.id)}
                            title="Upload new image from device"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            title="Edit Category Name & Settings"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#128C7E] transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmCategory(cat)}
                            title="Delete Category"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      )}

      {/* 4. SLIDE-OVER MODAL: ADD / EDIT CATEGORY */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div>
                  <h3 className="text-lg font-black font-serif text-slate-900">
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure title, imagery, and storefront placement.
                  </p>
                </div>
                <button
                  onClick={handleCloseForm}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Category Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. CASHEWS & ROASTED DRY FRUITS"
                    className="w-full px-4 py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#128C7E] rounded-xl text-xs font-semibold text-slate-900 outline-none transition-all"
                  />
                  {categoryName && (
                    <span className="text-[10px] font-mono text-slate-400 block">
                      Slug ID: /category/{categoryName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')}
                    </span>
                  )}
                </div>

                {/* Category Image URL / Device Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                    Category Image (URL or Device Upload)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={categoryImage}
                      onChange={(e) => setCategoryImage(e.target.value)}
                      placeholder="https://images.unsplash.com/... or upload"
                      className="flex-1 px-4 py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#128C7E] rounded-xl text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => {
                        setQuickUploadCategoryId(null);
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                      className="px-3.5 py-3 bg-emerald-50 hover:bg-emerald-100 text-[#128C7E] border border-emerald-200 rounded-xl font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                    >
                      <Upload className={`w-3.5 h-3.5 ${uploadingImage ? 'animate-bounce' : ''}`} />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    </button>
                  </div>

                  {/* Image Preview */}
                  {categoryImage && (
                    <div className="mt-2 flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={categoryImage} 
                          alt="Preview" 
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200" 
                        />
                        <span className="text-xs font-bold text-slate-700">Image Attached</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCategoryImage('')}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer Premium Star Checkbox */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="premiumFooterCheck"
                    checked={isCategoryPremium}
                    onChange={(e) => setIsCategoryPremium(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="premiumFooterCheck" className="text-xs cursor-pointer select-none">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5">
                      <Star className={`w-3.5 h-3.5 ${isCategoryPremium ? 'fill-amber-500 text-amber-500' : 'text-amber-700'}`} />
                      Feature in Website Footer ("SHOP PREMIUM CATEGORIES")
                    </span>
                    <p className="text-[11px] text-amber-800/80 mt-0.5">
                      Check this box to highlight this collection in the global website footer banner for quick patron access.
                    </p>
                  </label>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider"
                  >
                    {editingCategory ? 'Update Category' : 'Save Category'}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. CATEGORY PRODUCTS MODAL / DRAWER */}
      <AnimatePresence>
        {viewingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            {/* Hidden Product Image Upload Input */}
            <input
              type="file"
              accept="image/*"
              ref={prodFileInputRef}
              onChange={async (e) => {
                const f = e.target.files && e.target.files[0];
                if (f) {
                  try {
                    const formData = new FormData();
                    formData.append('image', f);
                    const res = await fetch(`${API_BASE_URL}/upload`, {
                      method: 'POST',
                      body: formData
                    });
                    const data = await res.json();
                    if (data && data.success && data.imageUrl) {
                      setNewProdImage(data.imageUrl);
                    } else {
                      const base64 = await compressImageFile(f);
                      if (base64) setNewProdImage(base64);
                    }
                  } catch (err) {
                    const base64 = await compressImageFile(f);
                    if (base64) setNewProdImage(base64);
                  }
                }
                if (e.target) e.target.value = '';
              }}
              className="hidden"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    <img 
                      src={viewingCategory.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600'} 
                      alt={viewingCategory.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-base text-slate-900 uppercase">
                      {viewingCategory.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {getCategoryProducts(viewingCategory).length} items currently mapped to this collection
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddingProdInCat(!isAddingProdInCat)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      isAddingProdInCat 
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                        : 'bg-[#128C7E] hover:bg-[#075E54] text-white shadow-xs'
                    }`}
                  >
                    {isAddingProdInCat ? <span>Cancel</span> : <><Plus className="w-3.5 h-3.5" /><span>Add Product</span></>}
                  </button>
                  <button
                    onClick={() => {
                      setViewingCategory(null);
                      setIsAddingProdInCat(false);
                    }}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Expandable Add Product Form */}
              {isAddingProdInCat && (
                <form onSubmit={handleAddProductToCategory} className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-3 mb-4 shrink-0 animate-in fade-in slide-in-from-top-2 duration-150">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Quick Add Item to "{viewingCategory.name}"</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="e.g. Royal Kashmiri Saffron"
                        className="w-full bg-white border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Base Price ₹ (250g) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        placeholder="e.g. 450"
                        className="w-full bg-white border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={newProdBadge}
                        onChange={(e) => setNewProdBadge(e.target.value)}
                        placeholder="Best Seller / Premium"
                        className="w-full bg-white border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Image URL or Device Upload</label>
                      <div className="flex gap-1.5">
                        <input
                          type="url"
                          value={newProdImage}
                          onChange={(e) => setNewProdImage(e.target.value)}
                          placeholder="Image URL..."
                          className="flex-1 bg-white border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (prodFileInputRef.current) prodFileInputRef.current.click();
                          }}
                          className="px-3 py-2 bg-white hover:bg-emerald-100 text-[#128C7E] border border-emerald-200 rounded-xl font-bold text-xs cursor-pointer shrink-0"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      placeholder="Taste, freshness, origin notes..."
                      className="w-full bg-white border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                    />
                  </div>

                  <div className="pt-1 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProdInCat(false)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer border border-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                      Save Item
                    </button>
                  </div>
                </form>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {getCategoryProducts(viewingCategory).length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No products currently assigned to "{viewingCategory.name}".<br />
                    Click "+ Add Product" above to catalog your first item.
                  </div>
                ) : (
                  getCategoryProducts(viewingCategory).map(product => (
                    <div 
                      key={product.id} 
                      className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/80 transition-all gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-11 h-11 object-cover rounded-xl border border-slate-200 shrink-0" 
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {product.name}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-500">
                            ₹{product.price || product.weights?.[0]?.price} • {product.badge || 'Active Item'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full shrink-0 border border-emerald-200">
                        Active
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Close */}
              <div className="pt-4 border-t border-slate-100 mt-2 shrink-0">
                <button
                  onClick={() => {
                    setViewingCategory(null);
                    setIsAddingProdInCat(false);
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. DELETE CATEGORY CONFIRMATION DIALOG */}
      <AnimatePresence>
        {deleteConfirmCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200"
            >
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
                <Trash2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black font-serif text-slate-900">
                  Delete Category?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to remove <strong className="text-slate-800">"{deleteConfirmCategory.name}"</strong>?
                  {getCategoryProducts(deleteConfirmCategory).length > 0 && (
                    <span className="block mt-1 text-amber-600 font-bold">
                      ⚠️ Note: {getCategoryProducts(deleteConfirmCategory).length} items currently mapped to this collection will need re-categorization.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmCategory(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteCategory(deleteConfirmCategory.id);
                    if (editingCategory?.id === deleteConfirmCategory.id) {
                      handleCloseForm();
                    }
                    setDeleteConfirmCategory(null);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
