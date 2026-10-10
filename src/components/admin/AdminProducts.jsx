import React, { useState, useRef, useMemo } from 'react';
import { useCart, isProductActive } from '../../context/CartContext';
import { Package, Plus, Search, Edit, Trash2, X, Upload, Star } from 'lucide-react';
import { API_BASE_URL } from '../../api';

export default function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct, toggleProductStatus, setAdminTab } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Hidden file input for quick row image upload
  const [quickUploadProductId, setQuickUploadProductId] = useState(null);
  const fileInputRef = useRef(null);

  // Form State for Add / Edit Product
  const [formData, setFormData] = useState({
    name: '',
    category: 'nuts-dry-fruits',
    description: '',
    image: 'https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=800',
    discountPercent: 10,
    weightOptions: [
      { label: '', price: '' }
    ],
    stock: 50,
    ingredients: '100% Natural Premium Grade',
    origin: 'India',
    shelfLife: '9 Months',
    storage: 'Store in airtight jar in cool dry place',
    status: 'Active'
  });

  // Filter products by search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.id && p.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories[1]?.id || 'nuts-dry-fruits',
      description: '',
      image: 'https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=800',
      discountPercent: 10,
      weightOptions: [
        { label: '', price: '' }
      ],
      stock: 50,
      ingredients: '100% Natural Premium Grade',
      origin: 'India',
      shelfLife: '9 Months',
      storage: 'Store in airtight jar in cool dry place',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    const existingWeights = Array.isArray(product.weights) && product.weights.length > 0 
      ? product.weights.map(w => ({ label: w.label || '250g', price: Number(w.price) || 250 }))
      : [{ label: '250g', price: Number(product.price) || 250 }];

    let initialDiscount = 0;
    if (product.discountPercent !== undefined && product.discountPercent !== null) {
      initialDiscount = Number(product.discountPercent);
    } else if (product.discount) {
      initialDiscount = parseInt(product.discount) || 0;
    } else if (Array.isArray(product.weights) && product.weights[0]) {
      const orig = Number(product.weights[0].originalPrice);
      const cur = Number(product.weights[0].price);
      if (orig > cur) {
        initialDiscount = Math.round(((orig - cur) / orig) * 100);
      }
    }

    setFormData({
      name: product.name || '',
      category: product.category || 'nuts-dry-fruits',
      description: product.description || '',
      image: product.image || '',
      discountPercent: initialDiscount,
      weightOptions: existingWeights,
      stock: product.stock !== undefined ? product.stock : 45,
      ingredients: product.ingredients || '100% Natural',
      origin: product.origin || 'India',
      shelfLife: product.shelfLife || '9 Months',
      storage: product.storage || 'Cool dry place',
      status: product.status || (product.active !== false ? 'Active' : 'Inactive')
    });
    setIsModalOpen(true);
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

  const handleQuickImageUpload = (productId) => {
    setQuickUploadProductId(productId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('File size exceeds the 20MB limit. Please choose a smaller image.');
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
        
        if (data.success) {
          if (quickUploadProductId) {
            updateProduct(quickUploadProductId, { image: data.imageUrl });
            setQuickUploadProductId(null);
          } else {
            setFormData(prev => ({ ...prev, image: data.imageUrl }));
          }
        } else {
          alert('Failed to upload image to Cloudinary.');
        }
      } catch (err) {
        console.error('Failed to process product image:', err);
        alert('Error uploading image.');
      } finally {
        setUploadingImage(false);
      }
    }
    if (e.target) e.target.value = '';
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const discountPct = Math.max(0, Math.min(90, Number(formData.discountPercent) || 0));
    const discountFactor = discountPct > 0 ? (100 - discountPct) / 100 : 1;

    const weights = formData.weightOptions.map(w => {
      const p = Number(w.price) || 100;
      const original = discountPct > 0 ? Math.round(p / discountFactor) : p;
      return {
        label: (w.label || '250g').trim(),
        price: p,
        originalPrice: original
      };
    });

    const basePrice = weights[0] ? weights[0].price : 250;

    const categoryObj = categories.find(c => c.id === formData.category);
    const categoryName = categoryObj ? categoryObj.name : 'General';

    const finalImage = formData.image || 'https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=800';

    const payload = {
      name: formData.name,
      category: formData.category,
      categoryName: categoryName,
      description: formData.description,
      image: finalImage,
      price: basePrice,
      discountPercent: discountPct,
      discount: discountPct > 0 ? `${discountPct}% OFF` : '',
      weights: weights.length > 0 ? weights : [{ label: '250g', price: basePrice, originalPrice: basePrice }],
      stock: Number(formData.stock),
      ingredients: formData.ingredients,
      origin: formData.origin,
      shelfLife: formData.shelfLife,
      storage: formData.storage,
      status: formData.status,
      active: formData.status === 'Active'
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      // If the image was changed or removed, delete the old image from Cloudinary
      if (editingProduct.image && editingProduct.image !== finalImage && editingProduct.image.includes('res.cloudinary.com')) {
        fetch(`${API_BASE_URL}/upload/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: editingProduct.image })
        }).catch(err => console.error('Failed to delete old image from Cloudinary', err));
      }
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Hidden File Input for Quick Row Image Upload */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* HEADER & ADD PRODUCT BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Manage Products
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 text-[#000000] rounded-xl font-extrabold text-xs shadow-sm flex items-center gap-2 tracking-wide uppercase">
            <Package className="w-4 h-4 text-[#000000]" />
            Total Products: <span className="text-[#000000] text-sm">{products.length}</span>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all shrink-0 border border-red-700/30"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-gray-900 outline-none"
          />
        </div>
        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl py-2.5 px-3 text-xs font-bold text-gray-800 outline-none"
          >
            <option value="all">All Categories</option>
            {categories.filter(c => c.id !== 'all').map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden text-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200/80 bg-gray-50/80 text-gray-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-4 px-4">Image</th>
                <th className="py-4 px-4">Product Name</th>
                <th className="py-4 px-4">Weights & Prices</th>
                <th className="py-4 px-4">Discount</th>
                <th className="py-4 px-4 text-center">Visibility</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const isInactive = !isProductActive(p);
                
                const sellingPrice = p.weights && p.weights[0] ? p.weights[0].price : p.price || 0;
                const mrp = p.weights && p.weights[0] && p.weights[0].originalPrice 
                  ? p.weights[0].originalPrice 
                  : sellingPrice;
                
                const discountPct = (p.discountPercent !== undefined && p.discountPercent !== null)
                  ? Number(p.discountPercent)
                  : (p.discount ? parseInt(p.discount) : (mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0));

                return (
                  <tr key={p.id} className={`hover:bg-gray-50/60 transition-colors ${isInactive ? 'opacity-60' : ''}`}>
                    
                    {/* 1. Image */}
                    <td className="py-3.5 px-4">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-gray-50 shrink-0" 
                      />
                    </td>

                    {/* 2. Product Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-800 text-xs">{p.name}</div>
                      <div className="text-[10px] font-bold text-amber-700 uppercase mt-0.5">{p.categoryName || p.category}</div>
                    </td>

                    {/* 3. Weights & Prices */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {p.weights && p.weights.length > 0 ? (
                          p.weights.map((w, wIdx) => (
                            <span key={`${p.id}-${w.label}-${wIdx}`} className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200/60 rounded text-[10px] font-bold">
                              {w.label}: ₹{w.price}
                            </span>
                          ))
                        ) : (
                          <span className="font-bold text-gray-900 text-xs">₹{sellingPrice}</span>
                        )}
                      </div>
                    </td>

                    {/* 4. Discount */}
                    <td className="py-3.5 px-4 font-semibold text-gray-700">
                      {discountPct > 0 ? `${discountPct}% OFF` : 'No Discount'}
                    </td>

                    {/* 5. Visibility Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleProductStatus(p.id)}
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
                          !isInactive 
                            ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {!isInactive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* 6. Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Quick Image Change */}
                        <button
                          onClick={() => handleQuickImageUpload(p.id)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Change Product Image"
                        >
                          <Upload className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteConfirmProduct(p)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT / ADD PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-800 rounded-xl border border-amber-200/60">
                  <Package className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  {editingProduct ? 'Edit Product Details' : 'Add New Product'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="space-y-5 text-xs font-semibold">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                


                {/* 1. Product Name */}
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase text-gray-600 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. VEG CHIPS / California Jumbo Almonds"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl p-2.5 text-gray-900 outline-none font-bold"
                  />
                </div>

                {/* 2. Category */}
                <div>
                  <label className="block font-bold uppercase text-gray-600 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl p-2.5 text-gray-900 outline-none"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Discount % */}
                <div>
                  <label className="block font-bold uppercase text-gray-600 mb-1">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl p-2.5 text-gray-900 outline-none"
                  />
                </div>

                {/* 4. Stock Units */}
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase text-gray-600 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl p-2.5 text-gray-900 outline-none"
                  />
                </div>

                {/* 5. DYNAMIC WEIGHT & PRICE OPTIONS LIST (REPLACES BASE PRICE) */}
                <div className="sm:col-span-2 space-y-3 bg-amber-50/40 p-4 rounded-2xl border border-amber-200/60">
                  <div className="flex items-center justify-between">
                    <label className="block font-extrabold uppercase text-xs text-[#000000]">
                      Weight & Price Options *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          weightOptions: [...formData.weightOptions, { label: '', price: '' }]
                        });
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#128C7E] hover:bg-[#128C7E] text-[#000000] font-extrabold text-[11px] uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#000000]" />
                      <span>Add Weight</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {formData.weightOptions.map((wOpt, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200 shadow-xs">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Weight Pack Label</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 250g, 500g, 1kg"
                            value={wOpt.label}
                            onChange={(e) => {
                              const updated = [...formData.weightOptions];
                              updated[idx].label = e.target.value;
                              setFormData({ ...formData, weightOptions: updated });
                            }}
                            className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-lg p-2 text-xs font-semibold text-gray-900 outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Price (₹)</label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="Price ₹ (e.g. 250)"
                            value={wOpt.price}
                            onChange={(e) => {
                              const updated = [...formData.weightOptions];
                              updated[idx].price = e.target.value;
                              setFormData({ ...formData, weightOptions: updated });
                            }}
                            className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-lg p-2 text-xs font-extrabold text-gray-900 outline-none"
                          />
                        </div>
                        {formData.weightOptions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.weightOptions.filter((_, i) => i !== idx);
                              setFormData({ ...formData, weightOptions: updated });
                            }}
                            className="p-2 mt-4 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove Option"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Description */}
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase text-gray-600 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed gourmet product description..."
                    className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl p-2.5 text-gray-900 outline-none"
                  />
                </div>

                {/* 7. Ingredients */}
                <div>
                  <label className="block font-bold uppercase text-gray-600 mb-1">Ingredients</label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    placeholder="e.g. 100% Natural Premium Grade"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl p-2.5 text-gray-900 outline-none"
                  />
                </div>

                {/* 8. Origin */}
                <div>
                  <label className="block font-bold uppercase text-gray-600 mb-1">Origin</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g. India / California / Kashmir"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl p-2.5 text-gray-900 outline-none"
                  />
                </div>

                {/* 9. Shelf Life */}
                <div>
                  <label className="block font-bold uppercase text-gray-600 mb-1">Shelf Life</label>
                  <input
                    type="text"
                    value={formData.shelfLife}
                    onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                    placeholder="e.g. 6 Months / 9 Months"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl p-2.5 text-gray-900 outline-none"
                  />
                </div>

                {/* 10. Storage Instructions */}
                <div>
                  <label className="block font-bold uppercase text-gray-600 mb-1">Storage Instructions</label>
                  <input
                    type="text"
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    placeholder="e.g. Cool dry place / Airtight container"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl p-2.5 text-gray-900 outline-none"
                  />
                </div>

                {/* 11. Product Image */}
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase text-gray-600 mb-1">Product Image</label>
                  <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-2.5">
                    {formData.image && formData.image !== 'https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=800' ? (
                      <img src={formData.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-200 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 border border-gray-300">
                        <Upload className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                    
                    <label className="flex-1 cursor-pointer">
                      <div className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 font-extrabold text-xs rounded-lg hover:bg-gray-100 transition-colors text-center flex items-center justify-center gap-2">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Uploading...' : 'Click to Upload Image (Max 20MB)'}</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange} 
                      />
                    </label>

                    {formData.image && formData.image !== 'https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=800' && (
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Image"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#128C7E] hover:bg-[#128C7E] text-[#000000] font-extrabold rounded-xl shadow-md transition-all cursor-pointer border border-[#000000]/40"
                >
                  {editingProduct ? 'Save Product Changes' : 'Create Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">Delete Product?</h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to delete <strong className="text-gray-900">{deleteConfirmProduct.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmProduct.image && deleteConfirmProduct.image.includes('res.cloudinary.com')) {
                    fetch(`${API_BASE_URL}/upload/delete`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ imageUrl: deleteConfirmProduct.image })
                    }).catch(err => console.error('Failed to delete old image from Cloudinary', err));
                  }
                  deleteProduct(deleteConfirmProduct.id);
                  setDeleteConfirmProduct(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl transition-all cursor-pointer text-xs shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
