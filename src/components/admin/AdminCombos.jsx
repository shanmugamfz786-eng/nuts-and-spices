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
  FolderPlus,
  Package,
  Check,
  Image as ImageIcon,
  Eye,
  Info,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../api';
import { PRODUCTS as SEED_PRODUCTS } from '../../data/products';

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
    products = [],
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
  const [viewingCombo, setViewingCombo] = useState(null);
  const [deleteConfirmCombo, setDeleteConfirmCombo] = useState(null);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState(null);

  // Custom Category State inside modal
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  // Manage Categories Modal State
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Manageable combo categories with persistent local storage
  const [comboCategoriesList, setComboCategoriesList] = useState(() => {
    try {
      const saved = localStorage.getItem('nuts_spices_combo_categories_custom');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_COMBO_CATEGORIES;
  });

  const [deletedCategoryIds, setDeletedCategoryIds] = useState(() => {
    try {
      const saved = localStorage.getItem('nuts_spices_deleted_combo_cat_ids');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // What's Inside - Search & Select State
  const [comboComponents, setComboComponents] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [customItemInput, setCustomItemInput] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

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
    price: '',
    originalPrice: '',
    packLabel: '1 KG ROYAL BOX',
    description: '',
    image: '',
    status: 'ACTIVE'
  });

  // Dynamic list of all categories available for combos (Only pure Combo categories, reactive to deletion)
  const categoryOptions = useMemo(() => {
    const map = new Map();
    comboCategoriesList.forEach(c => {
      if (!deletedCategoryIds.includes(c.id)) {
        map.set(c.id, c);
      }
    });
    
    // Add any custom combo category created for combo deals (excluding generic grocery categories and deleted categories)
    const storeCatIds = new Set((categories || []).map(gc => gc.id));
    (comboDeals || []).forEach(c => {
      if (c.category && !map.has(c.category) && !storeCatIds.has(c.category) && !deletedCategoryIds.includes(c.category)) {
        map.set(c.category, { id: c.category, label: c.categoryLabel || c.category });
      }
    });
    return Array.from(map.values());
  }, [comboCategoriesList, deletedCategoryIds, comboDeals, categories]);

  // Trigger Custom Styled Modal to Delete Category
  const handleDeleteCategory = (catIdToDelete, catLabel) => {
    if (categoryOptions.length <= 1) {
      alert('You must keep at least one category in the list.');
      return;
    }
    setDeleteConfirmCategory({ id: catIdToDelete, label: catLabel });
  };

  // Perform Delete after confirmation in custom styled modal
  const executeDeleteCategory = () => {
    if (!deleteConfirmCategory) return;
    const { id: catIdToDelete } = deleteConfirmCategory;

    const updatedList = comboCategoriesList.filter(c => c.id !== catIdToDelete);
    const updatedDeletedIds = Array.from(new Set([...deletedCategoryIds, catIdToDelete]));

    setComboCategoriesList(updatedList);
    setDeletedCategoryIds(updatedDeletedIds);

    try {
      localStorage.setItem('nuts_spices_combo_categories_custom', JSON.stringify(updatedList));
      localStorage.setItem('nuts_spices_deleted_combo_cat_ids', JSON.stringify(updatedDeletedIds));
    } catch (e) {
      console.warn('Storage error:', e);
    }

    const remaining = categoryOptions.filter(c => c.id !== catIdToDelete);
    if (formData.category === catIdToDelete && remaining.length > 0) {
      setFormData(prev => ({
        ...prev,
        category: remaining[0].id,
        categoryLabel: remaining[0].label
      }));
    }
    setDeleteConfirmCategory(null);
  };

  // Add new category directly
  const handleAddCategoryDirect = (label) => {
    const trimmed = (label || '').trim();
    if (!trimmed) return;
    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (comboCategoriesList.some(c => c.id === slug || c.label.toLowerCase() === trimmed.toLowerCase())) {
      alert('This category already exists in the list.');
      return;
    }
    const newCat = { id: slug, label: trimmed };
    const updatedList = [...comboCategoriesList, newCat];
    const updatedDeleted = deletedCategoryIds.filter(id => id !== slug);

    setComboCategoriesList(updatedList);
    setDeletedCategoryIds(updatedDeleted);

    try {
      localStorage.setItem('nuts_spices_combo_categories_custom', JSON.stringify(updatedList));
      localStorage.setItem('nuts_spices_deleted_combo_cat_ids', JSON.stringify(updatedDeleted));
    } catch {}

    setFormData(prev => ({
      ...prev,
      category: slug,
      categoryLabel: trimmed
    }));
    setNewCategoryInput('');
  };

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
        (combo.name || '').toLowerCase().includes(q) ||
        (combo.description || '').toLowerCase().includes(q) ||
        (combo.items || []).some(it => (it || '').toLowerCase().includes(q));
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

  const allAvailableProducts = useMemo(() => {
    return (products && products.length > 0) ? products : SEED_PRODUCTS;
  }, [products]);

  const filteredSearchProducts = useMemo(() => {
    const list = allAvailableProducts || [];
    if (!productSearchTerm.trim()) return list.slice(0, 12);
    const q = productSearchTerm.trim().toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);

    return list.filter(p => {
      const name = (p.name || '').toLowerCase();
      const id = String(p.id || '').toLowerCase();
      const cat = (p.category || p.categoryName || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();

      return words.every(w => 
        name.includes(w) || 
        cat.includes(w) || 
        desc.includes(w) || 
        id.includes(w)
      );
    }).slice(0, 20);
  }, [allAvailableProducts, productSearchTerm]);

  const handleSelectProduct = (product) => {
    const defaultWeight = product.weights?.[0]?.label || product.weights?.[0]?.weight || '250g';
    const availableWeights = (product.weights || []).map(w => w.label || w.weight).filter(Boolean);
    if (!availableWeights.includes('100g')) availableWeights.unshift('100g');
    if (!availableWeights.includes('250g')) availableWeights.push('250g');
    if (!availableWeights.includes('500g')) availableWeights.push('500g');
    if (!availableWeights.includes('1 Kg')) availableWeights.push('1 Kg');

    setComboComponents(prev => [
      ...prev,
      {
        id: `${product.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        name: product.name,
        weight: defaultWeight,
        availableWeights,
        image: product.image || '/images/products/product_1.jpg',
        isCustom: false
      }
    ]);
  };

  const handleUpdateComponentWeight = (id, newWeight) => {
    setComboComponents(prev => prev.map(c => c.id === id ? { ...c, weight: newWeight } : c));
  };

  const handleRemoveComponent = (id) => {
    setComboComponents(prev => prev.filter(c => c.id !== id));
  };

  const handleAddCustomComponent = () => {
    if (!customItemInput.trim()) return;
    setComboComponents(prev => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        name: customItemInput.trim(),
        weight: '',
        availableWeights: [],
        image: null,
        isCustom: true
      }
    ]);
    setCustomItemInput('');
    setIsAddingCustom(false);
  };

  // Helper to resolve all components/products of a combo with pictures and weights
  const getComboComponentsList = (combo) => {
    if (!combo) return [];
    if (Array.isArray(combo.components) && combo.components.length > 0) {
      return combo.components;
    }
    const items = Array.isArray(combo.items) ? combo.items : [];
    return items.map((it, idx) => {
      const cleanName = String(it).replace(/^[0-9]+(?:\.[0-9]+)?\s*(?:kg|g|gm|ml|l)?\s*/i, '').trim();
      const weightMatch = String(it).match(/^[0-9]+(?:\.[0-9]+)?\s*(?:kg|g|gm|ml|l)?/i);
      const weight = weightMatch ? weightMatch[0].trim() : '';
      const matched = (products || []).find(p => 
        p && p.name && (p.name.toLowerCase() === cleanName.toLowerCase() ||
        p.name.toLowerCase().includes(cleanName.toLowerCase()) ||
        cleanName.toLowerCase().includes(p.name.toLowerCase()))
      );
      return {
        id: matched?.id || `comp_${idx}`,
        name: matched?.name || cleanName,
        weight: weight,
        image: matched?.image || combo.image || '/images/combo_banner.jpg',
        price: matched?.weights?.[0]?.price || 0
      };
    });
  };

  const handleOpenAdd = () => {
    setEditingCombo(null);
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setComboComponents([]);
    setProductSearchTerm('');
    setIsProductDropdownOpen(false);
    setIsAddingCustom(false);
    setCustomItemInput('');
    setFormData({
      name: '',
      category: 'gift-hampers',
      categoryLabel: 'Royal Gift Hampers',
      badge: '👑 FESTIVE BESTSELLER',
      badgeColor: 'bg-amber-500 text-white',
      price: '',
      originalPrice: '',
      packLabel: '1 KG ROYAL BOX',
      description: '',
      image: '',
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

    setProductSearchTerm('');
    setIsProductDropdownOpen(false);
    setIsAddingCustom(false);
    setCustomItemInput('');

    // Parse existing combo items into components
    let existingComponents = [];
    if (Array.isArray(combo.components) && combo.components.length > 0) {
      existingComponents = combo.components.map((c, idx) => {
        const matchedProd = (products || []).find(p => p && (p.id === c.id || p.name.toLowerCase() === c.name.toLowerCase()));
        const availableWeights = (matchedProd?.weights || []).map(w => w.label || w.weight).filter(Boolean);
        if (c.weight && !availableWeights.includes(c.weight)) {
          availableWeights.unshift(c.weight);
        }
        return {
          id: c.id || `comp_${idx}_${Date.now()}`,
          productId: matchedProd?.id || c.id,
          name: c.name,
          weight: c.weight || '250g',
          availableWeights: availableWeights.length > 0 ? availableWeights : ['100g', '250g', '500g', '1 Kg'],
          image: c.image || matchedProd?.image || '/images/products/product_1.jpg',
          isCustom: !matchedProd
        };
      });
    } else {
      existingComponents = (combo.items || []).map((itemStr, idx) => {
        const cleanStr = String(itemStr || '').trim();
        const matchedProd = (products || []).find(p => 
          p && p.name && (cleanStr.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(cleanStr.toLowerCase()))
        );

        if (matchedProd) {
          const weightMatch = cleanStr.match(/^(\d+\s*(?:g|kg|gms|grams|kg\b))/i);
          const extractedWeight = weightMatch ? weightMatch[1].trim() : (matchedProd.weights?.[0]?.label || '250g');
          const availableWeights = (matchedProd.weights || []).map(w => w.label || w.weight).filter(Boolean);
          if (!availableWeights.includes(extractedWeight)) {
            availableWeights.unshift(extractedWeight);
          }
          return {
            id: `${matchedProd.id}_${idx}_${Date.now()}`,
            productId: matchedProd.id,
            name: matchedProd.name,
            weight: extractedWeight,
            availableWeights,
            image: matchedProd.image || '/images/products/product_1.jpg',
            isCustom: false
          };
        }

        const weightMatch = cleanStr.match(/^(\d+\s*(?:g|kg|gms|grams|kg\b))\s+(.*)$/i);
        if (weightMatch) {
          return {
            id: `item_${idx}_${Date.now()}`,
            name: weightMatch[2].trim(),
            weight: weightMatch[1].trim(),
            availableWeights: ['100g', '250g', '500g', '1 Kg'],
            image: null,
            isCustom: false
          };
        }

        return {
          id: `custom_${idx}_${Date.now()}`,
          name: cleanStr,
          weight: '',
          availableWeights: [],
          image: null,
          isCustom: true
        };
      });
    }
    setComboComponents(existingComponents);

    setFormData({
      name: combo.name,
      category: combo.category || 'gift-hampers',
      categoryLabel: combo.categoryLabel || 'Royal Gift Hampers',
      badge: combo.badge || 'SPECIAL COMBO',
      badgeColor: combo.badgeColor || 'bg-amber-500 text-white',
      price: mainWeight.price || '',
      originalPrice: mainWeight.originalPrice || '',
      packLabel: mainWeight.label || '1 KG ROYAL BOX',
      description: combo.description || '',
      image: combo.image || '',
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

    if (!formData.name.trim()) {
      alert('Please enter a combo name.');
      return;
    }

    if (comboComponents.length === 0) {
      alert('Please select at least one product for this combo pack.');
      return;
    }

    const itemsList = comboComponents.map(c => {
      if (c.isCustom || !c.weight) return c.name.trim();
      if (c.name.toLowerCase().includes(c.weight.toLowerCase())) return c.name.trim();
      return `${c.weight} ${c.name}`.trim();
    }).filter(Boolean);

    let finalCategory = formData.category;
    let finalCategoryLabel = formData.categoryLabel;

    if (isCustomCategory && customCategoryName.trim()) {
      finalCategoryLabel = customCategoryName.trim();
      finalCategory = customCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!comboCategoriesList.some(c => c.id === finalCategory)) {
        const updated = [...comboCategoriesList, { id: finalCategory, label: finalCategoryLabel }];
        const updatedDeleted = deletedCategoryIds.filter(id => id !== finalCategory);
        setComboCategoriesList(updated);
        setDeletedCategoryIds(updatedDeleted);
        try {
          localStorage.setItem('nuts_spices_combo_categories_custom', JSON.stringify(updated));
          localStorage.setItem('nuts_spices_deleted_combo_cat_ids', JSON.stringify(updatedDeleted));
        } catch {}
      }
    } else {
      const catObj = categoryOptions.find(c => c.id === formData.category);
      finalCategoryLabel = catObj ? catObj.label : 'Special Combos';
    }

    const pPrice = Number(formData.price) || 0;
    if (pPrice <= 0) {
      alert('Please enter a valid Offer Price (₹).');
      return;
    }
    const pOrigPrice = Number(formData.originalPrice) > 0 ? Number(formData.originalPrice) : pPrice;
    const fallbackImage = comboComponents.find(c => c.image)?.image || '/images/combo_banner.jpg';

    const payload = {
      name: formData.name.trim(),
      category: finalCategory,
      categoryLabel: finalCategoryLabel,
      badge: formData.badge.trim(),
      badgeColor: formData.badgeColor || 'from-amber-500 to-orange-500',
      price: pPrice,
      originalPrice: pOrigPrice,
      description: formData.description.trim() || `Exclusive combo hamper featuring ${itemsList.slice(0, 3).join(', ')}.`,
      items: itemsList.length > 0 ? itemsList : ['Handpicked Luxury Selection'],
      components: comboComponents.map(c => ({
        id: c.productId || c.id,
        name: c.name,
        weight: c.weight,
        image: c.image || null,
        price: c.price || 0,
        category: c.category || ''
      })),
      weights: [
        { label: formData.packLabel.trim() || 'STANDARD BOX', price: pPrice, originalPrice: pOrigPrice },
        { label: '2 KG GRAND FAMILY HAMPER', price: Math.round(pPrice * 1.9), originalPrice: Math.round(pOrigPrice * 1.95) }
      ],
      image: formData.image.trim() || fallbackImage,
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
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        Included Items:
                      </span>
                      <button
                        type="button"
                        onClick={() => setViewingCombo(combo)}
                        className="text-[9px] font-bold text-[#128C7E] hover:underline flex items-center gap-0.5 cursor-pointer"
                        title="View product info"
                      >
                        <Eye className="w-2.5 h-2.5" />
                        <span>View Info</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(combo.items || []).slice(0, 3).map((it, idx) => (
                        <button 
                          key={idx} 
                          type="button"
                          onClick={() => setViewingCombo(combo)}
                          className="text-[9px] font-medium bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 px-1.5 py-0.2 rounded text-slate-600 hover:text-[#128C7E] truncate max-w-[150px] cursor-pointer transition-colors"
                          title="Click to view product info"
                        >
                          ✓ {it}
                        </button>
                      ))}
                      {(combo.items || []).length > 3 && (
                        <button 
                          type="button"
                          onClick={() => setViewingCombo(combo)}
                          className="text-[9px] font-bold text-[#128C7E] hover:underline px-1 cursor-pointer"
                        >
                          +{(combo.items || []).length - 3} more
                        </button>
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
                        onClick={() => setViewingCombo(combo)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="View Products Info"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
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
                        <button
                          type="button"
                          onClick={() => setViewingCombo(combo)}
                          className="text-[11px] text-[#128C7E] hover:underline font-mono font-bold flex items-center gap-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/60 px-2 py-1 rounded-lg transition-colors"
                          title="Click to view all products in this combo"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{(combo.items || []).length} components</span>
                        </button>
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
                            onClick={() => setViewingCombo(combo)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                            title="View Products Info"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(combo)}
                            className="p-1.5 hover:bg-emerald-50 hover:text-[#128C7E] rounded-lg text-slate-600 transition-colors cursor-pointer"
                            title="Edit Combo"
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
                    Combo Title / Hamper Name <span className="text-rose-500">*</span>
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
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setIsCustomCategory(!isCustomCategory)}
                          className="text-[11px] font-bold text-[#128C7E] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          {isCustomCategory ? (
                            <span>← Existing</span>
                          ) : (
                            <>
                              <FolderPlus className="w-3 h-3" />
                              <span>Add New</span>
                            </>
                          )}
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => setIsManageCategoriesOpen(true)}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer flex items-center gap-1"
                          title="Open Category Manager to delete or add categories"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete / Manage</span>
                        </button>
                      </div>
                    </div>

                    {isCustomCategory ? (
                      <div className="flex items-center gap-1.5">
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
                          className="flex-1 bg-slate-50 border border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                          placeholder="Type new category (e.g. Wedding Hampers)"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customCategoryName.trim()) {
                              handleAddCategoryDirect(customCategoryName.trim());
                              setIsCustomCategory(false);
                            }
                          }}
                          className="px-3 py-2 bg-[#128C7E] text-white text-xs font-bold rounded-xl hover:bg-[#075E54] cursor-pointer shrink-0"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '__custom__') {
                            setIsCustomCategory(true);
                            return;
                          }
                          if (val === '__manage__') {
                            setIsManageCategoriesOpen(true);
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
                        <option value="__manage__">⚙️ Manage & Delete Categories...</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Promotional Badge Text <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                      placeholder="e.g. 👑 FESTIVE BESTSELLER (or leave blank)"
                    />
                  </div>
                </div>

                {/* Price, MRP, Pack Label */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Offer Price (₹) <span className="text-rose-500">*</span>
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
                      Original MRP (₹) <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                      placeholder="Leave blank for same price"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Pack Variant Label <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.packLabel}
                      onChange={(e) => setFormData({ ...formData, packLabel: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                      placeholder="e.g. 1 KG ROYAL BOX (Default: STANDARD BOX)"
                    />
                  </div>
                </div>

                {/* What's Inside - Search & Select Store Products with Weight Picker */}
                <div className="space-y-3 p-4 bg-slate-50 border border-slate-200/90 rounded-2xl">
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#128C7E]" />
                      <span>What's Inside This Combo ({comboComponents.length} items) *</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Search and select store products, then pick the exact weight.
                    </p>
                  </div>

                  {/* Product Search & Selection Box */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search product from store catalog (e.g. Badam, Cashew, Pista, Dates, Chips)..."
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#128C7E] rounded-xl py-2.5 pl-10 pr-8 text-xs font-semibold text-slate-900 outline-none shadow-2xs"
                      />
                      {productSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setProductSearchTerm('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Inline Product Results Grid / List - ALWAYS VISIBLE */}
                    <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 max-h-56 overflow-y-auto space-y-1.5 shadow-2xs">
                      <div className="px-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        <span>Select Products to Add ({filteredSearchProducts.length})</span>
                      </div>
                      
                      {filteredSearchProducts.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          No products found matching "{productSearchTerm}".
                        </div>
                      ) : (
                        filteredSearchProducts.map((p) => {
                          const weights = (p.weights || []).map(w => w.label || w.weight).join(', ');
                          const alreadyCount = comboComponents.filter(c => c.productId === p.id).length;

                          return (
                            <div
                              key={p.id}
                              className="p-2 flex items-center justify-between gap-2.5 rounded-lg hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200/80 transition-all"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={p.image || '/images/products/product_1.jpg'}
                                  alt={p.name}
                                  className="w-9 h-9 object-cover rounded-lg border border-slate-200 bg-white shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                                  <p className="text-[10px] text-slate-400 truncate">
                                    Weights: {weights || 'Standard'}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleSelectProduct(p)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer active:scale-95 shadow-2xs ${
                                  alreadyCount > 0 
                                    ? 'bg-emerald-100 hover:bg-emerald-200 text-[#075E54] border border-emerald-300'
                                    : 'bg-[#128C7E] hover:bg-[#075E54] text-white'
                                }`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>{alreadyCount > 0 ? `Added (${alreadyCount})` : 'Add'}</span>
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Selected Components List */}
                  {comboComponents.length === 0 ? (
                    <div className="py-5 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white/60">
                      <Package className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-slate-600">No Items Added Yet</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Search products above to add components to this combo pack.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {comboComponents.map((item, idx) => (
                        <div
                          key={item.id}
                          className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border border-amber-200">
                                🎁
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                                Item #{idx + 1}
                              </span>
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {item.name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 justify-end flex-wrap sm:flex-nowrap">
                            {/* Weight Picker for this product */}
                            {!item.isCustom ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Weight:</span>
                                <select
                                  value={item.weight}
                                  onChange={(e) => handleUpdateComponentWeight(item.id, e.target.value)}
                                  className="bg-slate-50 border border-slate-200 focus:border-[#128C7E] text-slate-800 font-bold text-xs px-2.5 py-1.5 rounded-lg outline-none cursor-pointer"
                                >
                                  {(item.availableWeights || []).map((w, wIdx) => (
                                    <option key={wIdx} value={w}>{w}</option>
                                  ))}
                                  <option value="50g">50g</option>
                                  <option value="100g">100g</option>
                                  <option value="200g">200g</option>
                                  <option value="250g">250g</option>
                                  <option value="500g">500g</option>
                                  <option value="1 Kg">1 Kg</option>
                                  <option value="2 Kg">2 Kg</option>
                                </select>
                              </div>
                            ) : (
                              <span className="px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[10px] font-bold">
                                Packaging / Gift Item
                              </span>
                            )}

                            {/* Preview Pill */}
                            <span className="inline-flex px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-mono font-bold">
                              {item.weight ? `${item.weight} ${item.name}` : item.name}
                            </span>

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveComponent(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Image URL with Device File Upload & Live Preview */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Product Image URL <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
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
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50 p-1 text-center">
                          <ImageIcon className="w-6 h-6 text-slate-300 mb-0.5" />
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight leading-none">No Image</span>
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
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Enter image link (or upload from device above)..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none mb-2"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Product Description <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
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

      {/* 7. MANAGE COMBO CATEGORIES MODAL (DELETE & ADD) */}
      <AnimatePresence>
        {isManageCategoriesOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#128C7E] flex items-center justify-center">
                    <FolderPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Manage Combo Categories</h3>
                    <p className="text-[11px] text-slate-400">Delete or add categories for your Combo Collections</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsManageCategoriesOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Add New Category Direct Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCategoryDirect(newCategoryInput);
                    }
                  }}
                  placeholder="Type new category name..."
                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#128C7E] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddCategoryDirect(newCategoryInput)}
                  className="px-3.5 py-2 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Category List with Direct Delete Buttons */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-64">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Active Collection Categories ({categoryOptions.length})
                </p>
                {categoryOptions.map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-white text-slate-600 font-bold text-[11px] flex items-center justify-center border border-slate-200 shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {cat.label}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.label)}
                      disabled={categoryOptions.length <= 1}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 border border-rose-200 rounded-lg text-[11px] font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                      title={`Delete "${cat.label}" from collection`}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsManageCategoriesOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. CUSTOM STYLED DELETE CATEGORY CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmCategory && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
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
                  Are you sure you want to remove <strong>"{deleteConfirmCategory.label}"</strong> from the Combo Categories collection?
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
                  onClick={executeDeleteCategory}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. VIEW COMBO INFO & PRODUCTS MODAL */}
      <AnimatePresence>
        {viewingCombo && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 bg-slate-900 text-white flex items-start justify-between">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      {viewingCombo.categoryLabel || 'Combo Details'}
                    </span>
                    <span className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase ${viewingCombo.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      {viewingCombo.status}
                    </span>
                  </div>
                  <h3 className="text-base font-black font-serif text-white">
                    {viewingCombo.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Offer Price: <span className="font-bold text-emerald-400">₹{viewingCombo.price || viewingCombo.weights?.[0]?.price || 0}.00</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingCombo(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#128C7E]" />
                    <span>Included Store Products ({getComboComponentsList(viewingCombo).length})</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Selected in Admin
                  </span>
                </div>

                <div className="space-y-2">
                  {getComboComponentsList(viewingCombo).map((prod, idx) => (
                    <div
                      key={prod.id || idx}
                      className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80"
                    >
                      <img
                        src={prod.image || '/images/combo_banner.jpg'}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {prod.name}
                        </p>
                        {prod.weight && (
                          <span className="inline-block text-[11px] font-semibold text-[#128C7E]">
                            Weight: {prod.weight}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                        ✓ In Combo
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const c = viewingCombo;
                    setViewingCombo(null);
                    handleOpenEdit(c);
                  }}
                  className="py-2 px-4 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit in Form</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingCombo(null)}
                  className="py-2 px-5 rounded-xl text-xs font-bold bg-[#128C7E] hover:bg-[#0e7064] text-white cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
