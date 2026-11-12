import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Plus, Search, Edit, Trash2, X, Check, AlertCircle, 
  Layers, RefreshCw, Sparkles, ArrowRight
} from 'lucide-react';
import { 
  fetchAdminPincodePricings, 
  createAdminPincodePricing, 
  updateAdminPincodePricing, 
  deleteAdminPincodePricing 
} from '../../api/pincodePricingApi';

export default function AdminPincodePricing() {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deleteConfirmRule, setDeleteConfirmRule] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    pricingType: 'single', // 'single' | 'range'
    pincode: '',
    pincodeTo: '',
    price: '',
    status: 'active'
  });

  // Load pricing rules from backend
  const loadRules = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminPincodePricings();
      if (res && res.success && Array.isArray(res.rules)) {
        setRules(res.rules);
      } else {
        setRules([]);
      }
    } catch (err) {
      console.warn('Failed to load pincode pricing rules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  // Open modal for new rule
  const handleOpenAdd = () => {
    setEditingRule(null);
    setFormError('');
    setFormSuccess('');
    setFormData({
      pricingType: 'single',
      pincode: '',
      pincodeTo: '',
      price: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing rule
  const handleOpenEdit = (rule) => {
    setEditingRule(rule);
    setFormError('');
    setFormSuccess('');
    setFormData({
      pricingType: rule.pincodeTo ? 'range' : 'single',
      pincode: rule.pincode,
      pincodeTo: rule.pincodeTo || '',
      price: String(rule.price),
      status: rule.status || 'active'
    });
    setIsModalOpen(true);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const isRange = formData.pricingType === 'range';
    const cleanPin = String(formData.pincode || '').trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setFormError('Starting delivery pincode must be exactly 6 digits (e.g. 600001).');
      return;
    }

    let cleanPinTo = null;
    if (isRange) {
      cleanPinTo = String(formData.pincodeTo || '').trim();
      if (!/^\d{6}$/.test(cleanPinTo)) {
        setFormError('Ending delivery pincode must be exactly 6 digits (e.g. 600100).');
        return;
      }
      if (Number(cleanPin) > Number(cleanPinTo)) {
        setFormError('Starting pincode cannot be greater than ending pincode.');
        return;
      }
      if (cleanPin === cleanPinTo) cleanPinTo = null;
    }

    const numPrice = Number(formData.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError('Please enter a valid price amount to add (greater than 0).');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingRule) {
        // Update
        const res = await updateAdminPincodePricing(editingRule.id, {
          productId: 'ALL',
          variantWeight: 'ALL',
          price: numPrice,
          status: formData.status,
          pincode: cleanPin,
          pincodeTo: cleanPinTo,
          adjustmentType: 'flat_increase'
        });
        if (res && res.success) {
          setFormSuccess('Pincode price updated successfully!');
          setTimeout(() => {
            setIsModalOpen(false);
            loadRules();
          }, 600);
        } else {
          setFormError(res?.message || 'Failed to update pricing rule.');
        }
      } else {
        // Create
        const res = await createAdminPincodePricing({
          productId: 'ALL',
          variantWeight: 'ALL',
          pincode: cleanPin,
          pincodeTo: cleanPinTo,
          price: numPrice,
          adjustmentType: 'flat_increase',
          status: formData.status
        });
        if (res && res.success) {
          setFormSuccess('Pincode price rule added successfully!');
          setTimeout(() => {
            setIsModalOpen(false);
            loadRules();
          }, 600);
        } else {
          setFormError(res?.message || 'Failed to create pricing rule.');
        }
      }
    } catch (err) {
      setFormError(err.message || 'Error saving rule.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmRule) return;
    try {
      const res = await deleteAdminPincodePricing(deleteConfirmRule.id);
      if (res && res.success) {
        setRules(prev => prev.filter(r => r.id !== deleteConfirmRule.id));
        setDeleteConfirmRule(null);
      } else {
        alert(res?.message || 'Failed to delete rule.');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete rule.');
    }
  };

  // Filtered rules
  const filteredRules = useMemo(() => {
    return rules.filter(r => {
      // Status filter
      if (statusFilter !== 'ALL' && r.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const numQ = Number(q);
        const pinMatch = (r.pincode || '').includes(q) || 
          (r.pincodeTo && r.pincodeTo.includes(q)) || 
          (!isNaN(numQ) && r.pincodeTo && numQ >= Number(r.pincode) && numQ <= Number(r.pincodeTo));
        return pinMatch;
      }
      return true;
    });
  }, [rules, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-serif text-black uppercase tracking-wide">
              Pincode-Wise Product Price Rules
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Set the price amount to automatically add to all products when customers enter their delivery pincode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadRules}
            disabled={isLoading}
            title="Refresh rules"
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            Add Pincode Price
          </button>
        </div>
      </div>

      {/* 2. STATS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-black font-serif">{rules.length}</div>
            <div className="text-xs text-gray-500 font-medium">Configured Pincode Rules</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-black font-serif">
              {rules.filter(r => r.status === 'active').length}
            </div>
            <div className="text-xs text-gray-500 font-medium">Active Price Rules</div>
          </div>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH ROW */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by 6-digit delivery pincode..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#128C7E]/20 focus:border-[#128C7E]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#128C7E]/20"
          >
            <option value="ALL">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* 4. RULES DATA TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-gray-500 space-y-3">
            <RefreshCw className="w-8 h-8 text-[#128C7E] animate-spin mx-auto" />
            <p className="text-sm font-medium">Loading pincode price rules...</p>
          </div>
        ) : filteredRules.length === 0 ? (
          <div className="py-16 text-center text-gray-500 space-y-4 max-w-sm mx-auto px-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400 flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">No pincode rules found</h3>
              <p className="text-xs text-gray-500 mt-1">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'No rules match your search filter.'
                  : 'Add a pincode or range to automatically increase product prices for that location.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs rounded-xl shadow cursor-pointer uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Rule
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 uppercase text-[11px] font-extrabold tracking-wider">
                  <th className="py-3.5 px-4">Delivery Location (Pincode / Range)</th>
                  <th className="py-3.5 px-4">Price Added to All Products</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRules.map(rule => {
                  return (
                    <tr key={rule.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Pincode / Range */}
                      <td className="py-3.5 px-4">
                        {rule.pincodeTo ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-mono font-bold text-indigo-700 text-sm">
                              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                              <span>{rule.pincode} – {rule.pincodeTo}</span>
                            </div>
                            <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                              Range ({Math.max(1, Number(rule.pincodeTo) - Number(rule.pincode) + 1)} Pincodes)
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 font-mono font-bold text-emerald-800 text-sm">
                            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{rule.pincode}</span>
                            <span className="text-[10px] text-gray-400 font-sans font-normal">(Single Pincode)</span>
                          </div>
                        )}
                      </td>

                      {/* Price Added */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-[#128C7E] font-serif">
                            +₹{Number(rule.price).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            added to every product
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          When customer enters this pincode, all product prices increase by ₹{rule.price}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                            rule.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {rule.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(rule)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#128C7E] hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Edit Price Rule"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmRule(rule)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Rule"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. ADD / EDIT RULE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black font-serif text-black uppercase text-base tracking-wide">
                    {editingRule ? 'Edit Pincode Price' : 'Set Pincode Price'}
                  </h3>
                  <p className="text-[11px] text-gray-500">Configure price addition for customer delivery location</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* Pricing Scope Type: Single vs Range */}
              <div className="space-y-1.5">
                <label className="font-extrabold uppercase tracking-wider text-[11px] text-gray-700 block">
                  Delivery Location Scope *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, pricingType: 'single', pincodeTo: '' }))}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formData.pricingType === 'single'
                        ? 'bg-[#128C7E] text-white border-[#128C7E] shadow-xs'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Single Pincode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, pricingType: 'range' }))}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formData.pricingType === 'range'
                        ? 'bg-[#128C7E] text-white border-[#128C7E] shadow-xs'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Pincode Range (From – To)</span>
                  </button>
                </div>
              </div>

              {/* Pincode Input (Single or Range) */}
              {formData.pricingType === 'single' ? (
                <div className="space-y-1">
                  <label className="font-extrabold uppercase tracking-wider text-[11px] text-gray-700">
                    Delivery Pincode (6 Digits) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))}
                      placeholder="e.g. 600017"
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs sm:text-sm tracking-wider focus:ring-2 focus:ring-[#128C7E]/20 focus:border-[#128C7E]"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400">Must be a valid 6-digit Indian postal code.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="font-extrabold uppercase tracking-wider text-[11px] text-gray-700 block">
                    Pincode Range (From – To) *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">From Pincode:</span>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          maxLength={6}
                          value={formData.pincode}
                          onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))}
                          placeholder="e.g. 600001"
                          className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs sm:text-sm tracking-wider focus:ring-2 focus:ring-[#128C7E]/20 focus:border-[#128C7E]"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">To Pincode:</span>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          maxLength={6}
                          value={formData.pincodeTo}
                          onChange={(e) => setFormData(prev => ({ ...prev, pincodeTo: e.target.value.replace(/\D/g, '') }))}
                          placeholder="e.g. 600100"
                          className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs sm:text-sm tracking-wider focus:ring-2 focus:ring-[#128C7E]/20 focus:border-[#128C7E]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Regional Presets */}
                  <div className="pt-1">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">
                      ⚡ Quick Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Chennai City', from: '600001', to: '600130' },
                        { label: 'All Tamil Nadu', from: '600001', to: '643999' },
                        { label: 'Bangalore / Karnataka', from: '560001', to: '591999' },
                        { label: 'Kerala State', from: '670001', to: '695999' },
                        { label: 'Andhra & Telangana', from: '500001', to: '535999' }
                      ].map(preset => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, pincode: preset.from, pincodeTo: preset.to }))}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                        >
                          {preset.label} ({preset.from}–{preset.to})
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Any customer entering a delivery pincode between From and To will have the entered amount added to all product prices!
                  </p>
                </div>
              )}

              {/* Amount to Add to All Products */}
              <div className="space-y-1">
                <label className="font-extrabold uppercase tracking-wider text-[11px] text-gray-700">
                  Amount to Add to Every Product (₹) *
                </label>
                <div className="relative">
                  <span className="font-serif font-extrabold text-[#128C7E] absolute left-3.5 top-1/2 -translate-y-1/2">
                    +₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 30"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-serif text-sm font-extrabold text-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/20 focus:border-[#128C7E]"
                  />
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200/80 text-[11px] text-emerald-900 mt-1 leading-relaxed">
                  <strong>Automatic Price Addition:</strong> When a customer accesses the store with this pincode, <strong>₹{formData.price || '0'}</strong> will be automatically added to every product price (e.g. a ₹340 product will be shown and charged as ₹{340 + (Number(formData.price) || 0)}).
                </div>
              </div>

              {/* Status Toggle */}
              <div className="space-y-1 pt-1">
                <label className="font-extrabold uppercase tracking-wider text-[11px] text-gray-700">
                  Rule Status
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={() => setFormData(prev => ({ ...prev, status: 'active' }))}
                      className="text-[#128C7E] focus:ring-[#128C7E]"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={() => setFormData(prev => ({ ...prev, status: 'inactive' }))}
                      className="text-gray-500 focus:ring-gray-500"
                    />
                    Inactive
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {editingRule ? 'Update Price' : 'Save Price Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. DELETE CONFIRMATION DIALOG */}
      {deleteConfirmRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-black font-serif text-black uppercase text-base">
                Delete Pricing Rule?
              </h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to remove the price increase of <strong>+₹{deleteConfirmRule.price}</strong> for pincode <strong>{deleteConfirmRule.pincode}{deleteConfirmRule.pincodeTo ? ` – ${deleteConfirmRule.pincodeTo}` : ''}</strong>?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmRule(null)}
                className="flex-1 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all shadow cursor-pointer uppercase tracking-wider"
              >
                Delete Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
