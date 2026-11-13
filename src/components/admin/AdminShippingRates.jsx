import React, { useState, useEffect, useMemo } from 'react';
import { 
  Truck, Plus, Trash2, Edit2, CheckCircle2, 
  MapPin, RefreshCw, X, AlertCircle, Scale, Layers, Search
} from 'lucide-react';
import { 
  fetchAdminShippingRates, 
  createAdminShippingRate, 
  updateAdminShippingRate, 
  deleteAdminShippingRate 
} from '../../api/shippingRatesApi.js';
import { useCart } from '../../context/CartContext';
import { parseWeightSlabs, formatWeight } from '../../utils/weight.js';

const STANDARD_SLABS_TN = [
  { minWeightGrams: 0, maxWeightGrams: 250, rate: 35 },
  { minWeightGrams: 251, maxWeightGrams: 500, rate: 45 },
  { minWeightGrams: 501, maxWeightGrams: 1000, rate: 50 },
  { minWeightGrams: 1001, maxWeightGrams: 2000, rate: 80 },
  { minWeightGrams: 2001, maxWeightGrams: 3000, rate: 110 }
];

const STANDARD_SLABS_SOUTH = [
  { minWeightGrams: 0, maxWeightGrams: 250, rate: 45 },
  { minWeightGrams: 251, maxWeightGrams: 500, rate: 55 },
  { minWeightGrams: 501, maxWeightGrams: 1000, rate: 70 },
  { minWeightGrams: 1001, maxWeightGrams: 2000, rate: 110 },
  { minWeightGrams: 2001, maxWeightGrams: 3000, rate: 150 }
];

const STANDARD_SLABS_REST = [
  { minWeightGrams: 0, maxWeightGrams: 250, rate: 55 },
  { minWeightGrams: 251, maxWeightGrams: 500, rate: 65 },
  { minWeightGrams: 501, maxWeightGrams: 1000, rate: 85 },
  { minWeightGrams: 1001, maxWeightGrams: 2000, rate: 135 },
  { minWeightGrams: 2001, maxWeightGrams: 3000, rate: 185 }
];

const PRESETS = [
  {
    name: 'Tamil Nadu (All Districts)',
    from: '600001',
    to: '643999',
    baseRate: 50,
    addRate: 30,
    freeAbove: 0,
    slabs: STANDARD_SLABS_TN
  },
  {
    name: 'Kerala',
    from: '670001',
    to: '695999',
    baseRate: 70,
    addRate: 40,
    freeAbove: 0,
    slabs: STANDARD_SLABS_SOUTH
  },
  {
    name: 'Karnataka',
    from: '560001',
    to: '591999',
    baseRate: 70,
    addRate: 40,
    freeAbove: 0,
    slabs: STANDARD_SLABS_SOUTH
  },
  {
    name: 'Andhra Pradesh & Telangana',
    from: '500001',
    to: '535999',
    baseRate: 70,
    addRate: 40,
    freeAbove: 0,
    slabs: STANDARD_SLABS_SOUTH
  },
  {
    name: 'Rest of India / Standard',
    from: 'DEFAULT',
    to: 'DEFAULT',
    baseRate: 85,
    addRate: 50,
    freeAbove: 0,
    slabs: STANDARD_SLABS_REST
  }
];

function slabToEditable(s) {
  const minG = Number(s.minWeightGrams) || 0;
  const maxG = Number(s.maxWeightGrams) || 0;
  const minIsKg = minG >= 1000 && minG % 1000 === 0;
  const maxIsKg = maxG >= 1000 && maxG % 1000 === 0;

  return {
    minVal: minIsKg ? (minG / 1000) : minG,
    minUnit: minIsKg ? 'kg' : 'g',
    maxVal: maxIsKg ? (maxG / 1000) : maxG,
    maxUnit: maxIsKg ? 'kg' : 'g',
    rate: Number(s.rate) || 0
  };
}

function editableToSlab(e) {
  const minG = e.minUnit === 'kg' ? Math.round(Number(e.minVal) * 1000) : Math.round(Number(e.minVal));
  const maxG = e.maxUnit === 'kg' ? Math.round(Number(e.maxVal) * 1000) : Math.round(Number(e.maxVal));
  return {
    minWeightGrams: Math.max(0, minG),
    maxWeightGrams: Math.max(1, maxG),
    rate: Math.max(0, Number(e.rate) || 0)
  };
}

export default function AdminShippingRates() {
  const { refreshShippingRates } = useCart();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    zone_name: '',
    pincode_from: '',
    pincode_to: '',
    base_weight_grams: 1000,
    base_rate: 50,
    additional_weight_grams: 1000,
    additional_rate: '',
    free_shipping_threshold: '',
    is_active: 1,
    editable_slabs: [
      { minVal: 0, minUnit: 'g', maxVal: '', maxUnit: 'g', rate: '' }
    ]
  });

  const loadRates = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminShippingRates();
      if (res && res.success && Array.isArray(res.rates)) {
        setRates(res.rates);
      }
    } catch (e) {
      console.error('Failed to load admin shipping rates:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const showNotification = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      zone_name: '',
      pincode_from: '',
      pincode_to: '',
      base_weight_grams: 1000,
      base_rate: '',
      additional_weight_grams: 1000,
      additional_rate: '',
      free_shipping_threshold: '',
      is_active: 1,
      editable_slabs: [
        { minVal: 0, minUnit: 'g', maxVal: '', maxUnit: 'g', rate: '' }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rate) => {
    setEditingId(rate.id);
    const existingSlabs = parseWeightSlabs(rate.weight_slabs_json || rate.weightSlabs);
    const sourceSlabs = existingSlabs.length > 0 ? existingSlabs : [{ minWeightGrams: 0, maxWeightGrams: 500, rate: Number(rate.base_rate) || 50 }];

    setFormData({
      zone_name: rate.zone_name,
      pincode_from: rate.pincode_from,
      pincode_to: rate.pincode_to || rate.pincode_from,
      base_weight_grams: Number(rate.base_weight_grams) || 1000,
      base_rate: Number(rate.base_rate) || '',
      additional_weight_grams: Number(rate.additional_weight_grams) || 1000,
      additional_rate: rate.additional_rate !== null && rate.additional_rate !== undefined ? Number(rate.additional_rate) : '',
      free_shipping_threshold: Number(rate.free_shipping_threshold) || '',
      is_active: rate.is_active ? 1 : 0,
      editable_slabs: sourceSlabs.map(slabToEditable)
    });
    setIsModalOpen(true);
  };

  const handleAddSlab = () => {
    setFormData(prev => {
      const current = prev.editable_slabs || [];
      const last = current[current.length - 1];
      let nextMinVal = 0;
      let nextMinUnit = 'g';
      let nextMaxUnit = 'g';

      if (last && last.maxVal !== '' && !isNaN(Number(last.maxVal))) {
        const lastMaxNum = Number(last.maxVal);
        if (last.maxUnit === 'kg') {
          nextMinVal = lastMaxNum;
          nextMinUnit = 'kg';
          nextMaxUnit = 'kg';
        } else {
          nextMinVal = lastMaxNum + 1;
          nextMinUnit = 'g';
          nextMaxUnit = 'g';
        }
      }

      return {
        ...prev,
        editable_slabs: [
          ...current,
          { minVal: nextMinVal, minUnit: nextMinUnit, maxVal: '', maxUnit: nextMaxUnit, rate: '' }
        ]
      };
    });
  };

  const handleUpdateSlab = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.editable_slabs];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return { ...prev, editable_slabs: updated };
    });
  };

  const handleRemoveSlab = (index) => {
    setFormData(prev => {
      const updated = prev.editable_slabs.filter((_, i) => i !== index);
      return { ...prev, editable_slabs: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.zone_name.trim() || !formData.pincode_from.trim()) {
      showNotification('error', 'Zone name and Pincode are required.');
      return;
    }

    const slabs = formData.editable_slabs || [];
    if (slabs.length === 0) {
      showNotification('error', 'Please add at least one weight slab.');
      return;
    }

    for (let i = 0; i < slabs.length; i++) {
      const s = slabs[i];
      if (s.maxVal === '' || isNaN(Number(s.maxVal)) || Number(s.maxVal) <= 0) {
        showNotification('error', `Slab #${i + 1}: Please enter a valid Max Weight.`);
        return;
      }
      if (s.rate === '' || isNaN(Number(s.rate)) || Number(s.rate) < 0) {
        showNotification('error', `Slab #${i + 1}: Please enter a valid Delivery Fee.`);
        return;
      }
    }

    const calculatedSlabs = slabs.map(editableToSlab);
    const firstRate = calculatedSlabs[0]?.rate || 50;

    const payload = {
      ...formData,
      base_rate: Number(formData.base_rate) || firstRate,
      additional_rate: Number(formData.additional_rate) || 0,
      free_shipping_threshold: Number(formData.free_shipping_threshold) || 0,
      weight_slabs_json: JSON.stringify(calculatedSlabs)
    };

    try {
      if (editingId) {
        const res = await updateAdminShippingRate(editingId, payload);
        if (res.success) {
          showNotification('success', 'Shipping rate and weight slabs updated successfully!');
        } else {
          showNotification('error', res.message || 'Failed to update rule.');
        }
      } else {
        const res = await createAdminShippingRate(payload);
        if (res.success) {
          showNotification('success', 'New shipping rate created successfully!');
        } else {
          showNotification('error', res.message || 'Failed to create rule.');
        }
      }
      setIsModalOpen(false);
      await loadRates();
      if (refreshShippingRates) refreshShippingRates();
    } catch (err) {
      showNotification('error', err.message || 'Server error occurred.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete shipping rate rule "${name}"?`)) return;
    try {
      const res = await deleteAdminShippingRate(id);
      if (res.success) {
        showNotification('success', 'Rule deleted successfully.');
        await loadRates();
        if (refreshShippingRates) refreshShippingRates();
      } else {
        showNotification('error', res.message || 'Failed to delete rule.');
      }
    } catch (err) {
      showNotification('error', err.message || 'Server error occurred.');
    }
  };

  const handleToggleStatus = async (rate) => {
    const newStatus = rate.is_active ? 0 : 1;
    try {
      const res = await updateAdminShippingRate(rate.id, {
        ...rate,
        is_active: newStatus
      });
      if (res.success) {
        await loadRates();
        if (refreshShippingRates) refreshShippingRates();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRates = useMemo(() => {
    return rates.filter(rate => {
      // 1. Status Filter
      if (statusFilter === 'active' && !rate.is_active) return false;
      if (statusFilter === 'inactive' && rate.is_active) return false;

      // 2. Search Filter
      if (!searchTerm.trim()) return true;
      const term = searchTerm.trim().toLowerCase();

      const zoneMatch = (rate.zone_name || '').toLowerCase().includes(term);
      const idMatch = (rate.id || '').toLowerCase().includes(term);
      const fromMatch = String(rate.pincode_from || '').toLowerCase().includes(term);
      const toMatch = String(rate.pincode_to || '').toLowerCase().includes(term);

      // Check if search term is a numeric pincode within zone range (e.g. typing 626125 matches TN 600001 - 643999)
      const pinNum = parseInt(term, 10);
      let rangeMatch = false;
      if (!isNaN(pinNum) && term.length >= 3) {
        const fromNum = parseInt(rate.pincode_from, 10);
        const toNum = parseInt(rate.pincode_to, 10);
        if (!isNaN(fromNum) && !isNaN(toNum)) {
          rangeMatch = pinNum >= Math.min(fromNum, toNum) && pinNum <= Math.max(fromNum, toNum);
        }
      }

      return zoneMatch || idMatch || fromMatch || toMatch || rangeMatch;
    });
  }, [rates, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      
      {/* Notifications */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold transition-all ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-100 text-[#128C7E] rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-serif text-[#000000]">
                Weight & Pincode Delivery Charges
              </h2>
              <p className="text-xs text-[#8C7A6B] mt-0.5">
                Set manual weight slabs in <b>Grams (g)</b> or <b>Kilograms (Kg)</b> with exact delivery charges per zone.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadRates}
            disabled={loading}
            className="p-2.5 text-gray-500 hover:text-black border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            title="Refresh Rates"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery Zone</span>
          </button>
        </div>
      </div>

      {/* FILTERS & SEARCH BAR (Identical to AdminProducts.jsx) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search delivery zones by name or pincode (e.g. Tamil Nadu, 600001)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 focus:border-[#128C7E] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-gray-900 outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 focus:border-[#128C7E] rounded-xl py-2.5 px-3 text-xs font-bold text-gray-800 outline-none"
          >
            <option value="all">All Delivery Zones ({rates.length})</option>
            <option value="active">Active Zones ({rates.filter(r => r.is_active).length})</option>
            <option value="inactive">Inactive Zones ({rates.filter(r => !r.is_active).length})</option>
          </select>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-gray-700">
              Active Delivery Zones ({filteredRates.length})
            </span>
            {searchTerm && (
              <span className="text-[11px] text-[#128C7E] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                Filtered from {rates.length}
              </span>
            )}
          </div>
          <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
            Configured in Grams & Kilograms with exact rates
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading delivery rates...</div>
        ) : filteredRates.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Scale className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-700">No Shipping Rates Found</p>
            <p className="text-xs text-gray-400">
              {searchTerm ? `No delivery zones match "${searchTerm}".` : 'Click "+ Add Delivery Zone" to configure your first rate.'}
            </p>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBFB] text-gray-500 uppercase font-black text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">Zone / Region Name</th>
                  <th className="py-3.5 px-6">Pincode Coverage</th>
                  <th className="py-3.5 px-6">Manual Weight Slabs (g & Kg)</th>
                  <th className="py-3.5 px-6">Extra Above Max Slab</th>
                  <th className="py-3.5 px-6">Free Delivery Above</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredRates.map((rate) => {
                  const isRange = rate.pincode_from !== rate.pincode_to && rate.pincode_to;
                  const isDefault = String(rate.pincode_from).toUpperCase() === 'DEFAULT';
                  const slabs = parseWeightSlabs(rate.weight_slabs_json || rate.weightSlabs);

                  return (
                    <tr key={rate.id} className="hover:bg-gray-50/70 transition-colors">
                      
                      {/* Zone Name */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900 text-sm">{rate.zone_name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">ID: {rate.id}</div>
                      </td>

                      {/* Pincode Coverage */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {isDefault ? (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-md font-mono font-bold text-[11px]">
                            DEFAULT REST OF INDIA
                          </span>
                        ) : isRange ? (
                          <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                            {rate.pincode_from} → {rate.pincode_to}
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                            {rate.pincode_from}
                          </span>
                        )}
                      </td>

                      {/* Weight Slabs Display */}
                      <td className="py-4 px-6">
                        {slabs.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 max-w-md">
                            {slabs.map((s, idx) => (
                              <span 
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-lg text-[11px] font-mono shadow-2xs"
                              >
                                <span className="text-gray-500 font-sans font-medium">
                                  {formatWeight(s.minWeightGrams)} – {formatWeight(s.maxWeightGrams)}:
                                </span>
                                <span className="font-black text-[#128C7E]">
                                  ₹{s.rate}
                                </span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-600 font-mono text-[11px]">
                            <span>1st 1kg: ₹{Number(rate.base_rate)}</span>
                            <span className="text-gray-400 mx-1">•</span>
                            <span>Extra: +₹{Number(rate.additional_rate)}/kg</span>
                          </div>
                        )}
                      </td>

                      {/* Extra above max slab */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-bold text-gray-800 font-mono">
                          +₹{Number(rate.additional_rate || 30)}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-sans">per extra 1.0 kg</span>
                      </td>

                      {/* Free shipping threshold */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {Number(rate.free_shipping_threshold) > 0 ? (
                          <span className="text-emerald-700 font-bold font-mono">
                            Above ₹{Number(rate.free_shipping_threshold).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">No Free Delivery</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(rate)}
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                            rate.is_active 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {rate.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(rate)}
                            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Rate Rule"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(rate.id, rate.zone_name)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Rate Rule"
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
        )}
      </div>

      {/* Add / Edit Rate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5">
              <h3 className="text-lg font-black font-serif text-[#000000] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#128C7E]" />
                <span>{editingId ? 'Edit Delivery Zone & Weight Slabs' : 'New Delivery Zone & Weight Slabs'}</span>
              </h3>
              <p className="text-xs text-[#8C7A6B] mt-0.5">
                Set manual weight ranges in <b>Grams (g)</b> or <b>Kilograms (Kg)</b> with exact courier charges.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Zone Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-700">
                  Zone / Region Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tamil Nadu (All Districts)"
                  value={formData.zone_name}
                  onChange={(e) => setFormData({ ...formData, zone_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#128C7E] rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              {/* Pincode Range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700">
                    Pincode From *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 600001 (or DEFAULT)"
                    value={formData.pincode_from}
                    onChange={(e) => setFormData({ ...formData, pincode_from: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#128C7E] rounded-xl text-xs font-mono font-bold outline-none uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700">
                    Pincode To (Range End)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 643999"
                    value={formData.pincode_to}
                    onChange={(e) => setFormData({ ...formData, pincode_to: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#128C7E] rounded-xl text-xs font-mono font-bold outline-none uppercase"
                  />
                </div>
              </div>

              {/* Manual Weight Slabs Section (Supports both g and kg) */}
              <div className="p-4 bg-emerald-50/40 border border-emerald-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-emerald-950 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#128C7E]" />
                      <span>Manual Weight Slabs (Grams & Kilograms ➡️ Delivery Price)</span>
                    </h4>
                    <p className="text-[10.5px] text-gray-500 mt-0.5">
                      Enter your custom weight range and delivery fee manually.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSlab}
                    className="px-3.5 py-1.5 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slab</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-black uppercase text-gray-500 px-1">
                    <span className="col-span-4">From (Min Weight)</span>
                    <span className="col-span-4">To (Max Weight)</span>
                    <span className="col-span-3">Delivery Fee (₹)</span>
                    <span className="col-span-1 text-center">Del</span>
                  </div>

                  {(formData.editable_slabs || []).map((slab, idx) => {
                    const parsed = editableToSlab(slab);
                    const canDelete = (formData.editable_slabs || []).length > 1;

                    return (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-gray-200/80 shadow-2xs space-y-1.5">
                        <div className="grid grid-cols-12 gap-2 items-center">
                          
                          {/* Min Weight Input + Unit Select */}
                          <div className="col-span-4">
                            <div className="flex rounded-lg overflow-hidden border border-gray-200 focus-within:border-[#128C7E]">
                              <input
                                type="number"
                                min="0"
                                step="any"
                                placeholder="0"
                                value={slab.minVal}
                                onChange={(e) => handleUpdateSlab(idx, 'minVal', e.target.value)}
                                className="w-full px-2 py-1.5 bg-gray-50 text-xs font-mono font-bold text-gray-900 outline-none"
                              />
                              <select
                                value={slab.minUnit}
                                onChange={(e) => handleUpdateSlab(idx, 'minUnit', e.target.value)}
                                className="bg-gray-100 text-gray-700 text-[11px] font-bold px-1.5 outline-none cursor-pointer border-l border-gray-200"
                              >
                                <option value="g">g</option>
                                <option value="kg">Kg</option>
                              </select>
                            </div>
                          </div>

                          {/* Max Weight Input + Unit Select */}
                          <div className="col-span-4">
                            <div className="flex rounded-lg overflow-hidden border border-gray-200 focus-within:border-[#128C7E]">
                              <input
                                type="number"
                                min="0"
                                step="any"
                                placeholder="e.g. 500"
                                value={slab.maxVal}
                                onChange={(e) => handleUpdateSlab(idx, 'maxVal', e.target.value)}
                                className="w-full px-2 py-1.5 bg-gray-50 text-xs font-mono font-bold text-gray-900 outline-none"
                              />
                              <select
                                value={slab.maxUnit}
                                onChange={(e) => handleUpdateSlab(idx, 'maxUnit', e.target.value)}
                                className="bg-gray-100 text-gray-700 text-[11px] font-bold px-1.5 outline-none cursor-pointer border-l border-gray-200"
                              >
                                <option value="g">g</option>
                                <option value="kg">Kg</option>
                              </select>
                            </div>
                          </div>

                          {/* Delivery Rate */}
                          <div className="col-span-3">
                            <div className="relative">
                              <span className="text-xs text-gray-400 absolute left-2 top-1/2 -translate-y-1/2 font-bold">₹</span>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                placeholder="Fee"
                                value={slab.rate}
                                onChange={(e) => handleUpdateSlab(idx, 'rate', e.target.value)}
                                className="w-full pl-6 pr-2 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-mono font-black text-[#128C7E] outline-none focus:border-[#075E54]"
                              />
                            </div>
                          </div>

                          {/* Delete Slab */}
                          <div className="col-span-1 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveSlab(idx)}
                              disabled={!canDelete}
                              className={`p-1 rounded-md transition-colors ${
                                !canDelete 
                                  ? 'text-gray-300 cursor-not-allowed' 
                                  : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                              }`}
                              title={!canDelete ? "At least one slab is required" : "Delete slab"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>

                        {/* Readable Preview pill */}
                        <div className="flex items-center justify-between text-[10px] text-gray-500 pt-0.5 px-1 border-t border-gray-100">
                          <span className="font-medium">
                            {slab.maxVal !== '' ? (
                              <>
                                Range: <b className="text-gray-800">{formatWeight(parsed.minWeightGrams)}</b> to <b className="text-gray-800">{formatWeight(parsed.maxWeightGrams)}</b>
                              </>
                            ) : (
                              <span className="text-amber-600 font-medium italic">Enter max weight & fee</span>
                            )}
                          </span>
                          <span className="text-emerald-700 font-bold font-mono">
                            {slab.rate !== '' ? `Fee: ₹${slab.rate}` : <span className="text-gray-400">₹—</span>}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Overflow Fallback & Free Delivery */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700">
                    Extra per 1 Kg (Above Max Slab) (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="30"
                      value={formData.additional_rate}
                      onChange={(e) => setFormData({ ...formData, additional_rate: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 bg-gray-50 border border-gray-200 focus:border-[#128C7E] rounded-xl text-xs font-mono font-bold text-gray-900 outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 block">Applied only if weight exceeds last slab</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700 flex items-center justify-between">
                    <span>Free Shipping Threshold (₹)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={formData.free_shipping_threshold}
                      onChange={(e) => setFormData({ ...formData, free_shipping_threshold: e.target.value })}
                      className="w-full pl-7 pr-3.5 py-2 bg-gray-50 border border-gray-200 focus:border-[#128C7E] rounded-xl text-xs font-mono font-bold outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 block">0 = No free delivery</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-black rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all"
                >
                  {editingId ? 'Save Changes' : 'Create Delivery Zone'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
