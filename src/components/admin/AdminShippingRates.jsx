import React, { useState, useEffect } from 'react';
import { 
  Truck, Plus, Trash2, Edit2, CheckCircle2, 
  MapPin, Shield, RefreshCw, X, AlertCircle, Info, Scale
} from 'lucide-react';
import { 
  fetchAdminShippingRates, 
  createAdminShippingRate, 
  updateAdminShippingRate, 
  deleteAdminShippingRate 
} from '../../api/shippingRatesApi.js';
import { useCart } from '../../context/CartContext';

const PRESETS = [
  {
    name: 'Tamil Nadu (State-Wide)',
    from: '600001',
    to: '643999',
    baseRate: 50,
    addRate: 30,
    freeAbove: 0
  },
  {
    name: 'Kerala',
    from: '670001',
    to: '695999',
    baseRate: 70,
    addRate: 40,
    freeAbove: 0
  },
  {
    name: 'Karnataka',
    from: '560001',
    to: '591999',
    baseRate: 70,
    addRate: 40,
    freeAbove: 0
  },
  {
    name: 'Andhra Pradesh & Telangana',
    from: '500001',
    to: '535999',
    baseRate: 70,
    addRate: 40,
    freeAbove: 0
  },
  {
    name: 'Rest of India / Standard',
    from: 'DEFAULT',
    to: 'DEFAULT',
    baseRate: 80,
    addRate: 50,
    freeAbove: 0
  }
];

export default function AdminShippingRates() {
  const { refreshShippingRates } = useCart();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    zone_name: '',
    pincode_from: '',
    pincode_to: '',
    base_weight_grams: 1000,
    base_rate: 50,
    additional_weight_grams: 1000,
    additional_rate: 30,
    free_shipping_threshold: 0,
    is_active: 1
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
      is_active: 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rate) => {
    setEditingId(rate.id);
    setFormData({
      zone_name: rate.zone_name,
      pincode_from: rate.pincode_from,
      pincode_to: rate.pincode_to || rate.pincode_from,
      base_weight_grams: Number(rate.base_weight_grams) || 1000,
      base_rate: Number(rate.base_rate),
      additional_weight_grams: Number(rate.additional_weight_grams) || 1000,
      additional_rate: Number(rate.additional_rate),
      free_shipping_threshold: Number(rate.free_shipping_threshold) || 0,
      is_active: rate.is_active ? 1 : 0
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
      free_shipping_threshold: preset.freeAbove
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.zone_name.trim() || !formData.pincode_from.trim()) {
      showNotification('error', 'Zone name and Pincode are required.');
      return;
    }

    try {
      if (editingId) {
        const res = await updateAdminShippingRate(editingId, formData);
        if (res.success) {
          showNotification('success', 'Shipping rate updated successfully!');
        } else {
          showNotification('error', res.message || 'Failed to update rule.');
        }
      } else {
        const res = await createAdminShippingRate(formData);
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
                Set commercial courier shipping rates based on destination pincode and total package weight slabs.
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
            <span>Add Delivery Zone / Rate</span>
          </button>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-gray-50/50">
          <span className="text-xs font-black uppercase tracking-wider text-gray-700">
            Active Delivery Zones ({rates.length})
          </span>
          <span className="text-[11px] text-gray-500 font-medium">
            Couriers charge by base 1kg + each additional 1kg
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
                  <th className="py-3.5 px-6">1st 1 Kg (Base Fee)</th>
                  <th className="py-3.5 px-6">Extra 1 Kg (Additional)</th>
                  <th className="py-3.5 px-6">Free Delivery Above</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {rates.map((rate) => {
                  const isRange = rate.pincode_from !== rate.pincode_to && rate.pincode_to;
                  const isDefault = String(rate.pincode_from).toUpperCase() === 'DEFAULT';
                  return (
                    <tr key={rate.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900 text-sm">{rate.zone_name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">ID: {rate.id}</div>
                      </td>
                      <td className="py-4 px-6">
                        {isDefault ? (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-md font-mono font-bold text-[11px]">
                            DEFAULT FALLBACK
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
                      <td className="py-4 px-6">
                        <span className="font-black text-emerald-800 font-mono text-sm">
                          ₹{Number(rate.base_rate).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-sans">up to 1.0 kg</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-black text-[#128C7E] font-mono text-sm">
                          +₹{Number(rate.additional_rate).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-sans">per extra 1.0 kg</span>
                      </td>
                      <td className="py-4 px-6">
                        {Number(rate.free_shipping_threshold) > 0 ? (
                          <span className="text-emerald-700 font-bold font-mono">
                            Above ₹{Number(rate.free_shipping_threshold).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">No Free Delivery</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(rate)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            rate.is_active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {rate.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
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
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
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
                <span>{editingId ? 'Edit Shipping Rate' : 'New Delivery Zone & Rate'}</span>
              </h3>
              <p className="text-xs text-[#8C7A6B] mt-0.5">
                Set base fee for 1st 1kg and incremental charge for each extra kilogram.
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

            <form onSubmit={handleSubmit} className="space-y-4">
              
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

              {/* Rate Slabs */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold uppercase text-emerald-950 flex items-center justify-between">
                    <span>Base 1 Kg Rate (₹) *</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      placeholder="50"
                      value={formData.base_rate}
                      onChange={(e) => setFormData({ ...formData, base_rate: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-emerald-200 focus:border-[#128C7E] rounded-xl text-xs font-mono font-black text-gray-900 outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 block">Charged for package up to 1kg</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold uppercase text-emerald-950 flex items-center justify-between">
                    <span>Extra per 1 Kg (₹) *</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      placeholder="30"
                      value={formData.additional_rate}
                      onChange={(e) => setFormData({ ...formData, additional_rate: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-emerald-200 focus:border-[#128C7E] rounded-xl text-xs font-mono font-black text-gray-900 outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 block">Charged for each extra 1kg slab</span>
                </div>
              </div>

              {/* Free Shipping Minimum Threshold */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-700 flex items-center justify-between">
                  <span>Free Shipping Order Threshold (₹)</span>
                  <span className="text-[10px] text-gray-400 lowercase font-normal">(0 = no free shipping)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.free_shipping_threshold}
                    onChange={(e) => setFormData({ ...formData, free_shipping_threshold: e.target.value })}
                    className="w-full pl-7 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#128C7E] rounded-xl text-xs font-mono font-bold outline-none"
                  />
                </div>
              </div>

              {/* Calculation Preview Simulation */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 space-y-1">
                <span className="font-bold text-gray-800 block">Preview for this zone:</span>
                <div className="flex items-center justify-between text-gray-700 font-mono">
                  <span>500g package: ₹{Number(formData.base_rate || 0)}</span>
                  <span>1.5kg package: ₹{Number(formData.base_rate || 0) + Number(formData.additional_rate || 0)}</span>
                  <span>2.5kg package: ₹{Number(formData.base_rate || 0) + (Number(formData.additional_rate || 0) * 2)}</span>
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
                  {editingId ? 'Save Changes' : 'Create Shipping Rule'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
