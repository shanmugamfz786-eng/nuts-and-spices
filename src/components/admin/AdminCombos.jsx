import React, { useState, useMemo, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  Gift, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  LayoutGrid, 
  Table as TableIcon,
  Upload,
  Loader2,
  FolderPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../api';

const DEFAULT_COMBO_CATEGORIES = [
  { id: 'gift-hampers', label: 'Royal Gift Hampers' },
  { id: 'wellness', label: 'Health & Wellness' },
  { id: 'spices', label: 'Masterchef Spices' },
  { id: 'budget', label: 'Under ₹999 Deals' }
];

const PRESET_IMAGES = [
  { label: 'Royal Hamper Banner', url: '/images/combo_banner.jpg' },
  { label: 'Saffron & Spices', url: '/images/products/product_1.jpg' },
  { label: 'Energy Nuts Trail', url: '/images/products/product_2.jpg' },
  { label: 'Almond Kishmish Duo', url: '/images/products/product_4.jpg' },
  { label: 'Festive Velvet Potli', url: '/images/products/product_5.jpg' },
  { label: 'Biryani Whole Spices', url: '/images/products/product_6.jpg' },
  { label: 'Snacking Trio', url: '/images/products/product_11.jpg' },
  { label: 'Sowcarpet Sweets', url: '/images/products/product_14.jpg' }
];

export default function AdminCombos() {
  const { 
    comboDeals = [], 
    categories = [],
    addComboDeal, 
    updateComboDeal, 
    deleteComboDeal, 
    toggleComboStatus
  } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState(null);
  const [deleteConfirmCombo, setDeleteConfirmCombo] = useState(null);

  // Custom Category State inside modal
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Form Data State
  const [formData, setFormData] = useState({
    name: '',
    category: 'gift-hampers',
    categoryLabel: 'Royal Gift Hampers',
    badge: '👑 FESTIVE BESTSELLER',
    badgeColor: 'bg-amber-500 text-white',
    price: 999,
    originalPrice: 1299,
    packLabel: '1 KG ROYAL BOX',
    description: '',
    itemsString: '250g Almonds, 250g Cashews, 250g Pista, 250g Dates',
    image: '/images/combo_banner.jpg',
    status: 'ACTIVE'
  });

  // Dynamic list of all categories available for combos
  const categoryOptions = useMemo(() => {
    const map = new Map();
    DEFAULT_COMBO_CATEGORIES.forEach(c => map.set(c.id, c));
    (categories || []).filter(c => c && c.id !== 'all').forEach(c => {
      if (!map.has(c.id)) {
        map.set(c.id, { id: c.id, label: c.name || c.id });
      }
    });
    (comboDeals || []).forEach(c => {
      if (c.category && !map.has(c.category)) {
        map.set(c.category, { id: c.category, label: c.categoryLabel || c.category });
      }
    });
    return Array.from(map.values());
  }, [categories, comboDeals]);

  // Dynamic filter pills list
  const filterCategories = useMemo(() => {
    return [
      { id: 'all', label: 'All Combos' },
      ...categoryOptions
    ];
  }, [categoryOptions]);

  // Filtered Combos
  const filteredCombos = useMemo(() => {
    return (comboDeals || []).filter(combo => {
      const matchCat = selectedCategory === 'all' || combo.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        combo.name.toLowerCase().includes(q) ||
        combo.description.toLowerCase().includes(q) ||
        (combo.items || []).some(it => it.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [comboDeals, selectedCategory, searchQuery]);

  // KPI Calculations
  const totalCount = comboDeals.length;
  const activeCount = comboDeals.filter(c => c.status === 'ACTIVE').length;
  const hamperCount = comboDeals.filter(c => c.category === 'gift-hampers').length;
  const avgDiscount = totalCount > 0
    ? Math.round(
        comboDeals.reduce((acc, c) => {
          const w = c.weights?.[0] || { price: c.price, originalPrice: c.originalPrice };
          const disc = w.originalPrice > w.price ? ((w.originalPrice - w.price) / w.originalPrice) * 100 : 20;
          return acc + disc;
        }, 0) / totalCount
      )
    : 24;

  const handleOpenAdd = () => {
    setEditingCombo(null);
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setFormData({
      name: 'Diwali Grand Royal Celebration Hamper',
      category: 'gift-hampers',
      categoryLabel: 'Royal Gift Hampers',
      badge: '👑 FESTIVE BESTSELLER',
      badgeColor: 'bg-amber-500 text-white',
      price: 1399,
      originalPrice: 1799,
      packLabel: '1 KG LUXURY BOX',
      description: 'Handcrafted luxury gift presentation packed with jumbo California almonds, royal cashews, roasted pistachios and Arabian dates.',
      itemsString: '250g Jumbo Badam, 250g W240 Kaju, 250g Pista, 250g Safawi Dates, Velvet Gift Box',
      image: '/images/combo_banner.jpg',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (combo) => {
    setEditingCombo(combo);
    const mainWeight = combo.weights?.[0] || { price: combo.price, originalPrice: combo.originalPrice, label: 'STANDARD PACK' };
    const matchedPreset = categoryOptions.find(c => c.id === combo.category);
    if (!matchedPreset && combo.category) {
      setIsCustomCategory(true);
      setCustomCategoryName(combo.categoryLabel || combo.category);
    } else {
      setIsCustomCategory(false);
      setCustomCategoryName('');
    }

    setFormData({
      name: combo.name,
      category: combo.category || 'gift-hampers',
      categoryLabel: combo.categoryLabel || 'Royal Gift Hampers',
      badge: combo.badge || 'SPECIAL COMBO',
      badgeColor: combo.badgeColor || 'bg-amber-500 text-white',
      price: mainWeight.price || 999,
      originalPrice: mainWeight.originalPrice || 1299,
      packLabel: mainWeight.label || '1 KG ROYAL BOX',
      description: combo.description || '',
      itemsString: (combo.items || []).join(', '),
      image: combo.image || '/images/combo_banner.jpg',
      status: combo.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('File size exceeds the 20MB limit. Please choose a smaller image.');
      if (e.target) e.target.value = '';
      return;
    }

    // 1. Instant local preview
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);

    // 2. Upload to Cloudinary backend API
    try {
      setUploadingImage(true);
      const data = new FormData();
      data.append('image', file);

      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: data
      });
      const json = await res.json();
      if (json.success && json.imageUrl) {
        setFormData(prev => ({ ...prev, image: json.imageUrl }));
      }
    } catch (err) {
      console.warn('Backend upload notice, using local file preview:', err.message);
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemsList = formData.itemsString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    let finalCategory = formData.category;
    let finalCategoryLabel = formData.categoryLabel;

    if (isCustomCategory && customCategoryName.trim()) {
      finalCategoryLabel = customCategoryName.trim();
      finalCategory = customCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    } else {
      const catObj = categoryOptions.find(c => c.id === formData.category);
      finalCategoryLabel = catObj ? catObj.label : 'Special Combos';
    }

    const pPrice = Number(formData.price) || 899;
    const pOrigPrice = Number(formData.originalPrice) || Math.round(pPrice * 1.25);

    const payload = {
      name: formData.name.trim(),
      category: finalCategory,
      categoryLabel: finalCategoryLabel,
      badge: formData.badge.trim(),
      badgeColor: formData.badgeColor,
      price: pPrice,
      originalPrice: pOrigPrice,
      description: formData.description.trim(),
      items: itemsList.length > 0 ? itemsList : ['Handpicked Luxury Selection'],
      weights: [
        { label: formData.packLabel.trim() || 'STANDARD BOX', price: pPrice, originalPrice: pOrigPrice },
        { label: '2 KG GRAND FAMILY HAMPER', price: Math.round(pPrice * 1.9), originalPrice: Math.round(pOrigPrice * 1.95) }
      ],
      image: formData.image,
      status: formData.status
    };

    if (editingCombo) {
      updateComboDeal(editingCombo.id, payload);
    } else {
      addComboDeal(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. EXECUTIVE HEADER COMMAND BAR (PROJECT THEME: #128C7E -> #075E54) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#128C7E] via-[#075E54] to-[#075E54] p-6 rounded-2xl text-white shadow-md border border-[#128C7E]/40">
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-white/10 text-white border border-white/20 rounded-xl backdrop-blur-xs">
              <Gift className="w-5 h-5 text-amber-300" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-serif text-white tracking-wide">
              Special Combo Deals & Hampers
            </h2>
          </div>
          <p className="text-xs text-amber-100 max-w-xl">
            Control customer storefront access, manage curated festive hampers, set bundle discounts, and configure what's inside each box.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Create Combo Button - Single Clean Plus Icon */}
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-[#128C7E] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-[#128C7E]" />
            <span>Add Combo</span>
          </button>

        </div>

      </div>

      {/* 2. STATS KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#128C7E] transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Combos</span>
          <span className="text-2xl font-black font-serif text-slate-900 mt-1 block">{totalCount}</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Cataloged Bundles</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#128C7E] transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#128C7E] block">Active Status</span>
          <span className="text-2xl font-black font-serif text-[#128C7E] mt-1 block">{activeCount}</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Visible to Patrons</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#128C7E] transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Gift Hampers</span>
          <span className="text-2xl font-black font-serif text-amber-600 mt-1 block">{hamperCount}</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Wedding & Festive</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#128C7E] transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#075E54] block">Avg. Savings</span>
          <span className="text-2xl font-black font-serif text-[#075E54] mt-1 block">~{avgDiscount}%</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Customer Value Gain</span>
        </div>

      </div>

      {/* 3. FILTER, SEARCH & VIEW MODE BAR */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filterCategories.map(cat => {
            const isActive = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? comboDeals.length 
              : comboDeals.filter(c => c.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#128C7E] text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Tools: Search & View Toggle */}
        <div className="flex items-center gap-3">
          
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search combos by name..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-[#128C7E] shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-[#128C7E] shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* 4. COMBOS CATALOG DISPLAY */}
      {filteredCombos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Gift className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No Combos Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No combo deals match your search criteria. Click "Add Combo" above to catalog your first bundle.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCombos.map(combo => {
            const mainW = combo.weights?.[0] || { price: combo.price, originalPrice: combo.originalPrice };
            const isActive = combo.status === 'ACTIVE';

            return (
              <div 
                key={combo.id}
                className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#128C7E]/60 transition-all flex flex-col overflow-hidden"
              >
                
                {/* Image & Status Badge */}
                <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                  <img 
                    src={combo.image} 
                    alt={combo.name} 
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm ${combo.badgeColor || 'bg-amber-500 text-white'}`}>
                    {combo.badge}
                  </span>

                  <button
                    onClick={() => toggleComboStatus(combo.id)}
                    className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isActive ? '● Active' : '○ Hidden'}
                  </button>
                </div>

                {/* Content */}
                <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
                  
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[#128C7E] uppercase tracking-wider block">
                      {combo.categoryLabel}
                    </span>
                    <h4 className="text-sm font-black font-serif text-slate-900 line-clamp-1">
                      {combo.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {combo.description}
                    </p>
                  </div>

                  {/* Included Items Pills */}
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Included Items:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(combo.items || []).slice(0, 3).map((it, idx) => (
                        <span key={idx} className="text-[9px] font-medium bg-slate-50 border border-slate-200 px-1.5 py-0.2 rounded text-slate-600 truncate max-w-[150px]">
                          ✓ {it}
                        </span>
                      ))}
                      {(combo.items || []).length > 3 && (
                        <span className="text-[9px] font-bold text-[#128C7E] px-1">
                          +{(combo.items || []).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Actions Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-base font-black font-serif text-[#128C7E]">
                        ₹{mainW.price}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through font-mono ml-1.5">
                        ₹{mainW.originalPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(combo)}
                        className="p-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-[#128C7E] text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="Edit Combo"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmCombo(combo)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                        title="Delete Combo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      ) : (

        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-16">Preview</th>
                  <th className="py-3 px-4">Combo Name & Category</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4">Items Inside</th>
                  <th className="py-3 px-4">Price & MRP</th>
                  <th className="py-3 px-4">Storefront Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCombos.map(combo => {
                  const mainW = combo.weights?.[0] || { price: combo.price, originalPrice: combo.originalPrice };
                  const isActive = combo.status === 'ACTIVE';

                  return (
                    <tr key={combo.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <img 
                          src={combo.image} 
                          alt={combo.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200" 
                        />
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{combo.name}</p>
                        <p className="text-[10px] text-[#128C7E] font-medium">{combo.categoryLabel}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${combo.badgeColor || 'bg-amber-500 text-white'}`}>
                          {combo.badge}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] text-slate-600 font-mono">
                          {(combo.items || []).length} components
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#128C7E]">₹{mainW.price}</span>
                        <span className="text-[10px] text-slate-400 line-through font-mono ml-1">₹{mainW.originalPrice}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleComboStatus(combo.id)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase cursor-pointer ${
                            isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isActive ? 'Active' : 'Hidden'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(combo)}
                            className="p-1.5 hover:bg-emerald-50 hover:text-[#128C7E] rounded-lg text-slate-600 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmCombo(combo)}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors cursor-pointer"
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

      {/* 5. ADD / EDIT COMBO MODAL (NO '*' LABELS, WITH DEVICE IMAGE UPLOAD & CUSTOM CATEGORY) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5"
            >
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-emerald-50 text-[#128C7E] rounded-xl border border-emerald-100">
                    <Gift className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-black font-serif text-slate-900">
                    {editingCombo ? 'Edit Special Combo Deal' : 'Add New Special Combo Deal'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Combo Title */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Combo Title / Hamper Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                    placeholder="e.g. Royal Mughal Imperial Dry Fruit Hamper"
                  />
                </div>

                {/* Collection Category & Badge Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Collection Category
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCustomCategory(!isCustomCategory)}
                        className="text-[11px] font-bold text-[#128C7E] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        {isCustomCategory ? (
                          <span>← Choose Existing</span>
                        ) : (
                          <>
                            <FolderPlus className="w-3 h-3" />
                            <span>+ Add New Category</span>
                          </>
                        )}
                      </button>
                    </div>

                    {isCustomCategory ? (
                      <input
                        type="text"
                        value={customCategoryName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomCategoryName(val);
                          const slug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
                          setFormData({ 
                            ...formData, 
                            category: slug || 'custom-combo',
                            categoryLabel: val.trim() || 'Custom Category'
                          });
                        }}
                        className="w-full bg-slate-50 border border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                        placeholder="Type category name (e.g. Wedding Hampers)"
                        autoFocus
                      />
                    ) : (
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '__custom__') {
                            setIsCustomCategory(true);
                            return;
                          }
                          const found = categoryOptions.find(c => c.id === val);
                          setFormData({ 
                            ...formData, 
                            category: val,
                            categoryLabel: found ? found.label : val
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                      >
                        {categoryOptions.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                        <option value="__custom__">+ Add Custom Category...</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Promotional Badge Text
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                      placeholder="e.g. 👑 FESTIVE BESTSELLER"
                    />
                  </div>
                </div>

                {/* Price, MRP, Pack Label */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Offer Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Original MRP (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Pack Variant Label
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.packLabel}
                      onChange={(e) => setFormData({ ...formData, packLabel: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                      placeholder="1 KG ROYAL BOX"
                    />
                  </div>
                </div>

                {/* Included Items Pills */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    What's Inside (Comma separated components)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.itemsString}
                    onChange={(e) => setFormData({ ...formData, itemsString: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                    placeholder="250g Almonds, 250g Cashews, 250g Pista, 250g Dates, Gift Box"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Each item separated by a comma will appear as a verified check pill on the storefront card.
                  </span>
                </div>

                {/* Product Image URL with Device File Upload & Live Preview */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Product Image URL
                  </label>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Upload from Device & Preview Container */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl mb-2">
                    {/* Live Preview Box */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-2xs">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Combo Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Gift className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1.5 w-full">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          {uploadingImage ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Image from Device</span>
                            </>
                          )}
                        </button>

                        {formData.image && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image: '' })}
                            className="text-[11px] text-rose-600 hover:text-rose-700 font-bold px-2 py-1 cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Upload directly from device (PNG, JPG, WEBP) or paste an image link below.
                      </p>
                    </div>
                  </div>

                  {/* Direct Image URL input */}
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Or enter image URL (https://... or /images/...)"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none mb-2"
                  />
                  
                  {/* Preset Quick Selectors */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {PRESET_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: img.url })}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
                          formData.image === img.url 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                    placeholder="Write a brief overview of the gift hamper..."
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
                  >
                    {editingCombo ? 'Save Changes' : 'Create Combo'}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {deleteConfirmCombo && (
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
                  Delete Combo Deal?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to remove <strong>"{deleteConfirmCombo.name}"</strong>? This will remove the bundle from the storefront immediately.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmCombo(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteComboDeal(deleteConfirmCombo.id);
                    setDeleteConfirmCombo(null);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
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
