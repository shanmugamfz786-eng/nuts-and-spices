import React, { useState, useEffect } from 'react';
import { 
  Truck, Plus, Trash2, Edit2, CheckCircle2, 
  MapPin, RefreshCw, X, AlertCircle, Info, Scale, Sparkles, Layers
} from 'lucide-react';
import { 
  fetchAdminShippingRates, 
  createAdminShippingRate, 
  updateAdminShippingRate, 
  deleteAdminShippingRate 
} from '../../api/shippingRatesApi.js';
import { useCart } from '../../context/CartContext';
import { parseWeightSlabs, calculateDeliveryFeeFromRule, formatWeight } from '../../utils/weight.js';

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

export default function AdminShippingRates() {
  const { refreshShippingRates } = useCart();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Live Simulator state
  const [simPincode, setSimPincode] = useState('600001');
  const [simWeightGrams, setSimWeightGrams] = useState(250);

  const [formData, setFormData] = useState({
    zone_name: '',
    pincode_from: '',
    pincode_to: '',
    base_weight_grams: 1000,
    base_rate: 50,
    additional_weight_grams: 1000,
    additional_rate: 30,
    free_shipping_threshold: 0,
    is_active: 1,
    weight_slabs: [...STANDARD_SLABS_TN]
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
      base_rate: 50,
      additional_weight_grams: 1000,
      additional_rate: 30,
      free_shipping_threshold: 0,
      is_active: 1,
      weight_slabs: [...STANDARD_SLABS_TN]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rate) => {
    setEditingId(rate.id);
    const existingSlabs = parseWeightSlabs(rate.weight_slabs_json || rate.weightSlabs);
    setFormData({
      zone_name: rate.zone_name,
      pincode_from: rate.pincode_from,
      pincode_to: rate.pincode_to || rate.pincode_from,
      base_weight_grams: Number(rate.base_weight_grams) || 1000,
      base_rate: Number(rate.base_rate),
      additional_weight_grams: Number(rate.additional_weight_grams) || 1000,
      additional_rate: Number(rate.additional_rate),
      free_shipping_threshold: Number(rate.free_shipping_threshold) || 0,
      is_active: rate.is_active ? 1 : 0,
      weight_slabs: existingSlabs.length > 0 ? existingSlabs : [...STANDARD_SLABS_TN]
    });
    setIsModalOpen(true);
  };

  const applyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      zone_name: preset.name,
      pincode_from: preset.from,
      pincode_to: preset.to,
      base_rate: preset.baseRate,
      additional_rate: preset.addRate,
      free_shipping_threshold: preset.freeAbove,
      weight_slabs: preset.slabs ? [...preset.slabs] : [...STANDARD_SLABS_TN]
    }));
  };

  const handleAddSlab = () => {
    setFormData(prev => {
      const current = prev.weight_slabs || [];
      const last = current[current.length - 1];
      const nextMin = last ? Number(last.maxWeightGrams) + 1 : 0;
      const nextMax = last ? Number(last.maxWeightGrams) + 1000 : 500;
      const nextRate = last ? Number(last.rate) + 30 : 50;
      return {
        ...prev,
        weight_slabs: [
          ...current,
          { minWeightGrams: nextMin, maxWeightGrams: nextMax, rate: nextRate }
        ]
      };
    });
  };

  const handleUpdateSlab = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.weight_slabs];
      updated[index] = {
        ...updated[index],
        [field]: Number(value) || 0
      };
      return { ...prev, weight_slabs: updated };
    });
  };

  const handleRemoveSlab = (index) => {
    setFormData(prev => {
      const updated = prev.weight_slabs.filter((_, i) => i !== index);
      return { ...prev, weight_slabs: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.zone_name.trim() || !formData.pincode_from.trim()) {
      showNotification('error', 'Zone name and Pincode are required.');
      return;
    }

    const payload = {
      ...formData,
      weight_slabs_json: JSON.stringify(formData.weight_slabs || [])
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

  // Find simulation match
  const matchedSimRule = (() => {
    const pin = String(simPincode || '').trim();
    const pinNum = parseInt(pin, 10);
    const activeRates = rates.filter(r => r.is_active === 1 || r.is_active === true);
    
    // Exact
    const exact = activeRates.find(r => String(r.pincode_from).trim() === pin && (!r.pincode_to || String(r.pincode_to).trim() === pin));
    if (exact) return exact;

    // Range
    if (!isNaN(pinNum)) {
      const range = activeRates.find(r => {
        const f = parseInt(r.pincode_from, 10);
        const t = parseInt(r.pincode_to, 10);
        return !isNaN(f) && !isNaN(t) && pinNum >= Math.min(f, t) && pinNum <= Math.max(f, t);
      });
      if (range) return range;
    }

    // Default
    return activeRates.find(r => String(r.pincode_from).toUpperCase() === 'DEFAULT' || String(r.zone_name).toLowerCase().includes('default')) || null;
  })();

  const simFee = matchedSimRule 
    ? calculateDeliveryFeeFromRule({ weightGrams: simWeightGrams, subtotal: 500, rule: matchedSimRule })
    : 50;

  const simSlabs = matchedSimRule ? parseWeightSlabs(matchedSimRule.weight_slabs_json || matchedSimRule.weightSlabs) : [];
  const matchedSimSlab = simSlabs.find(s => simWeightGrams >= Number(s.minWeightGrams) && simWeightGrams <= Number(s.maxWeightGrams));

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
                Set manual weight slabs (e.g. 0-250g, 250-500g, 500g-1kg, 1-2kg) with exact delivery charges per zone.
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

      {/* Live Rate Simulator */}
      <div className="bg-gradient-to-r from-emerald-900 to-[#075E54] text-white rounded-3xl p-5 sm:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                Live Rate Simulator
              </span>
            </div>
            <h3 className="text-lg font-black font-serif mt-1">
              Test Any Pincode & Weight Combo
            </h3>
          </div>

          {/* Quick Weight Selectors */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: '250 g', g: 250 },
              { label: '500 g', g: 500 },
              { label: '1 Kg', g: 1000 },
              { label: '1.5 Kg', g: 1500 },
              { label: '2 Kg', g: 2000 },
              { label: '3 Kg', g: 3000 }
            ].map(w => (
              <button
                key={w.g}
                type="button"
                onClick={() => setSimWeightGrams(w.g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  simWeightGrams === w.g 
                    ? 'bg-white text-[#075E54] shadow-md scale-105' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 items-center">
          {/* Destination Pincode Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-emerald-200">
              Customer Pincode:
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                maxLength={6}
                value={simPincode}
                onChange={(e) => setSimPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 600001"
                className="w-full pl-9 pr-3 py-2 bg-white text-gray-900 rounded-xl font-mono font-bold text-xs outline-none shadow-inner"
              />
            </div>
          </div>

          {/* Package Weight Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-emerald-200">
              Package Weight (Grams):
            </label>
            <div className="relative">
              <Scale className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                min="50"
                step="50"
                value={simWeightGrams}
                onChange={(e) => setSimWeightGrams(Math.max(1, Number(e.target.value) || 0))}
                className="w-full pl-9 pr-3 py-2 bg-white text-gray-900 rounded-xl font-mono font-bold text-xs outline-none shadow-inner"
              />
            </div>
          </div>

          {/* Result Calculation Pill */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">
                {matchedSimRule ? matchedSimRule.zone_name : 'Default Rule'}
              </span>
              <span className="text-xs text-white/80 font-mono">
                {matchedSimSlab 
                  ? `Slab: ${formatWeight(matchedSimSlab.minWeightGrams)} - ${formatWeight(matchedSimSlab.maxWeightGrams)}` 
                  : `${formatWeight(simWeightGrams)}`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-300 font-bold block uppercase">Delivery Fee</span>
              <span className="text-2xl font-black font-mono text-emerald-300">
                ₹{simFee}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-gray-50/50">
          <span className="text-xs font-black uppercase tracking-wider text-gray-700">
            Active Delivery Zones & Manual Weight Slabs ({rates.length})
          </span>
          <span className="text-[11px] text-gray-500 font-medium">
            Direct weight-tier pricing with zero guesswork
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading delivery rates...</div>
        ) : rates.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Scale className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-700">No Shipping Rates Configured</p>
            <p className="text-xs text-gray-400">Click "+ Add Delivery Zone" to configure your first rate.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBFB] text-gray-500 uppercase font-black text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">Zone / Region Name</th>
                  <th className="py-3.5 px-6">Pincode Coverage</th>
                  <th className="py-3.5 px-6">Manual Weight Slabs & Prices</th>
                  <th className="py-3.5 px-6">Extra Above Max Slab</th>
                  <th className="py-3.5 px-6">Free Delivery Above</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {rates.map((rate) => {
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
                                className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-lg text-[11px] font-mono"
                              >
                                <span className="text-gray-500 font-sans font-medium">
                                  {formatWeight(s.minWeightGrams)}–{formatWeight(s.maxWeightGrams)}:
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
                Set manual weight ranges (grams) and exact courier charges for this destination zone.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="mb-5 p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">
                Quick Region Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-[#128C7E] border border-gray-200 hover:border-emerald-300 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
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

              {/* Manual Weight Slabs Section */}
              <div className="p-4 bg-emerald-50/40 border border-emerald-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-emerald-950 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#128C7E]" />
                      <span>Manual Weight Slabs (Custom Grams ➡️ Price)</span>
                    </h4>
                    <p className="text-[10.5px] text-gray-500 mt-0.5">
                      Client can set exact prices for 250g, 500g, 1kg, 2kg etc.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSlab}
                    className="px-3 py-1 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slab</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-black uppercase text-gray-500 px-1">
                    <span className="col-span-4">Min Weight (g)</span>
                    <span className="col-span-4">Max Weight (g)</span>
                    <span className="col-span-3">Delivery Fee (₹)</span>
                    <span className="col-span-1 text-center">Del</span>
                  </div>

                  {(formData.weight_slabs || []).map((slab, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-xl border border-gray-200/80 shadow-2xs">
                      
                      {/* Min Weight */}
                      <div className="col-span-4">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={slab.minWeightGrams}
                            onChange={(e) => handleUpdateSlab(idx, 'minWeightGrams', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-900 outline-none focus:border-[#128C7E]"
                          />
                          <span className="text-[9px] text-gray-400 absolute right-2 top-1/2 -translate-y-1/2">g</span>
                        </div>
                      </div>

                      {/* Max Weight */}
                      <div className="col-span-4">
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={slab.maxWeightGrams}
                            onChange={(e) => handleUpdateSlab(idx, 'maxWeightGrams', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-900 outline-none focus:border-[#128C7E]"
                          />
                          <span className="text-[9px] text-gray-400 absolute right-2 top-1/2 -translate-y-1/2">
                            {slab.maxWeightGrams >= 1000 ? `${(slab.maxWeightGrams / 1000).toFixed(1)}kg` : 'g'}
                          </span>
                        </div>
                      </div>

                      {/* Delivery Rate */}
                      <div className="col-span-3">
                        <div className="relative">
                          <span className="text-xs text-gray-400 absolute left-2 top-1/2 -translate-y-1/2 font-bold">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
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
                          className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Delete slab"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, weight_slabs: [...STANDARD_SLABS_TN] }))}
                    className="text-[10px] text-[#128C7E] hover:underline font-bold cursor-pointer"
                  >
                    ⚡ Reset to Standard Slabs (250g, 500g, 1kg, 2kg, 3kg)
                  </button>
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
                      step="1"
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
