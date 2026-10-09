import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Ticket, Plus, Calendar, Trash2, Edit, X } from 'lucide-react';

export default function AdminOffers() {
  const { offers, categories, addOffer, deleteOffer, updateOffer } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [deleteConfirmOffer, setDeleteConfirmOffer] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    discountPercent: 20,
    applicableCategory: 'nuts-dry-fruits',
    minOrderAmount: 999,
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'ACTIVE'
  });

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setFormData({
      name: '20% OFF – Premium Nuts',
      discountPercent: 20,
      applicableCategory: 'nuts-dry-fruits',
      minOrderAmount: 999,
      startDate: '2026-09-01',
      endDate: '2026-09-30',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (off) => {
    setEditingOffer(off);
    setFormData({
      name: off.name,
      discountPercent: off.discountPercent,
      applicableCategory: off.applicableCategory || 'nuts-dry-fruits',
      minOrderAmount: off.minOrderAmount || 500,
      startDate: off.startDate || '2026-09-01',
      endDate: off.endDate || '2026-09-30',
      status: off.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const catObj = categories.find(c => c.id === formData.applicableCategory);
    const categoryName = catObj ? catObj.name : 'All Products';

    const payload = {
      name: formData.name,
      discountPercent: Number(formData.discountPercent),
      applicableCategory: formData.applicableCategory,
      applicableCategoryName: categoryName,
      minOrderAmount: Number(formData.minOrderAmount),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status
    };

    if (editingOffer) {
      updateOffer(editingOffer.id, payload);
    } else {
      addOffer(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#075E54] p-6 rounded-2xl text-white shadow-md">
        <div>
          <h2 className="text-2xl font-black font-serif text-white tracking-wide flex items-center gap-2">
            <Ticket className="w-6 h-6 text-[#F9FAFB]" />
            🎟️ ADMIN — OFFERS & COUPONS ({offers.length})
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            Create promotional discount vouchers, campaign start/end dates, and threshold minimum order rules.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#F9FAFB] hover:bg-white text-[#25D366] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer shrink-0 transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5 text-[#25D366]" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* OFFERS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((off) => (
          <div 
            key={off.id}
            className="bg-white border border-[#E5E7EB] hover:border-[#000000] rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between relative overflow-hidden group transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="px-3 py-1 bg-amber-50 text-[#000000] border border-amber-300 rounded-full text-xs font-black uppercase">
                  {off.discountPercent}% DISCOUNT
                </span>
                <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-md border ${
                  off.status === 'ACTIVE' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  {off.status}
                </span>
              </div>

              <h3 className="text-lg font-black font-serif text-gray-900 tracking-wide leading-snug">
                {off.name}
              </h3>

              <div className="bg-[#F9FAFB]/70 p-3 rounded-xl border border-[#E5E7EB] space-y-1 text-xs text-gray-600">
                <div>Applicable: <strong className="text-gray-900">{off.applicableCategoryName || 'All Categories'}</strong></div>
                <div>Min Order: <strong className="text-gray-900 font-serif">₹{off.minOrderAmount}</strong></div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-gray-500">
              <div className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#000000]" />
                <span>{off.startDate} to {off.endDate}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleOpenEdit(off)}
                  className="p-1.5 bg-[#F9FAFB] hover:bg-amber-100 border border-[#E5E7EB] text-gray-700 rounded-lg cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmOffer(off)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-lg cursor-pointer"
                  title="Delete Offer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteConfirmOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl my-auto text-gray-800 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Offer?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete offer <strong className="text-gray-800">"{deleteConfirmOffer.name}"</strong>?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmOffer(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteOffer(deleteConfirmOffer.id);
                  setDeleteConfirmOffer(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT OFFER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl text-gray-800 relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-black font-serif text-[#000000] flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#000000]" />
                {editingOffer ? 'Edit Promotional Offer' : 'Create New Offer'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">Offer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 20% OFF – Premium Nuts"
                  className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-2.5 text-gray-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Discount % *</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                    className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-2.5 text-gray-900 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-2.5 text-gray-900 outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">Applicable Category</label>
                <select
                  value={formData.applicableCategory}
                  onChange={(e) => setFormData({ ...formData, applicableCategory: e.target.value })}
                  className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-2.5 text-gray-900 outline-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-2.5 text-gray-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-2.5 text-gray-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-2.5 text-gray-900 outline-none font-bold"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#25D366] hover:bg-[#25D366] text-white font-extrabold uppercase rounded-xl shadow-md"
                >
                  Save Offer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
