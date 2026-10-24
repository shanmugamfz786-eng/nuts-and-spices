import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Star, CheckCircle, EyeOff, Trash2, Plus, X } from 'lucide-react';

export default function AdminReviews() {
  const { reviews = [], updateReviewStatus, deleteReview, addReview } = useCart();
  const [deleteConfirmReview, setDeleteConfirmReview] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    customerName: '',
    productName: 'Store Experience & Quality',
    rating: 5,
    comment: '',
    status: 'APPROVED'
  });

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.customerName.trim() || !newReview.comment.trim()) return;

    if (addReview) {
      addReview({
        customerName: newReview.customerName.trim(),
        name: newReview.customerName.trim(),
        productName: newReview.productName.trim() || 'Store Experience & Quality',
        rating: Number(newReview.rating) || 5,
        comment: newReview.comment.trim(),
        quote: newReview.comment.trim(),
        status: newReview.status || 'APPROVED',
        tag: 'Verified Customer',
        date: new Date().toISOString().split('T')[0]
      });
    }

    setIsAddModalOpen(false);
    setNewReview({
      customerName: '',
      productName: 'Store Experience & Quality',
      rating: 5,
      comment: '',
      status: 'APPROVED'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[10px] font-black uppercase">APPROVED</span>;
      case 'PENDING':
        return <span className="px-2.5 py-1 bg-orange-100 text-orange-800 border border-orange-200 rounded-full text-[10px] font-black uppercase">PENDING</span>;
      case 'HIDDEN':
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-[10px] font-black uppercase">HIDDEN</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-[10px] font-black uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#128C7E] via-[#075E54] to-[#075E54] p-6 rounded-2xl text-white shadow-md">
        <div>
          <h2 className="text-2xl font-black font-serif text-white tracking-wide flex items-center gap-2">
            <Star className="w-6 h-6 text-[#F9FAFB]" />
            ⭐ ADMIN — REVIEWS ({(reviews || []).length})
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            Moderate customer reviews, approve ratings to display on storefront, hide or remove feedback.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-amber-50 text-[#075E54] font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#075E54]" />
          <span>Add New Review</span>
        </button>
      </div>

      {/* REVIEWS TABLE */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden text-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]/70 text-gray-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4 text-center">Rating</th>
                <th className="py-3.5 px-4">Review Feedback</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-amber-50/40 transition-colors">
                  
                  {/* Product */}
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-gray-900 text-xs block max-w-xs">{rev.productName}</span>
                    <span className="text-[10px] text-gray-500">Date: {rev.date}</span>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {rev.customerName}
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center text-[#000000]">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#000000]' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </td>

                  {/* Comment */}
                  <td className="py-3.5 px-4 text-xs text-gray-700 max-w-md italic">
                    "{rev.comment}"
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    {getStatusBadge(rev.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right space-x-1 shrink-0">
                    
                    {/* Approve */}
                    <button
                      onClick={() => updateReviewStatus(rev.id, 'APPROVED')}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 rounded-lg text-[10px] font-bold cursor-pointer inline-flex items-center gap-1"
                      title="Approve Review"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[#000000]" />
                      <span>Approve</span>
                    </button>

                    {/* Hide */}
                    <button
                      onClick={() => updateReviewStatus(rev.id, 'HIDDEN')}
                      className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-600 rounded-lg text-[10px] font-bold cursor-pointer inline-flex items-center gap-1"
                      title="Hide Review"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteConfirmReview(rev)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-lg cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteConfirmReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl my-auto text-gray-800 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Review?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete this review by <strong className="text-gray-800">"{deleteConfirmReview.customerName}"</strong>?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmReview(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteReview(deleteConfirmReview.id);
                  setDeleteConfirmReview(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM ADD REVIEW MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl my-auto text-gray-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold font-serif text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Create New Patron Review</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newReview.customerName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#128C7E] bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Product / Service Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. California Jumbo Almonds or Store Experience"
                  value={newReview.productName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, productName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#128C7E] bg-gray-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Rating (Stars)
                  </label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#128C7E] bg-gray-50/50"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newReview.status}
                    onChange={(e) => setNewReview(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#128C7E] bg-gray-50/50"
                  >
                    <option value="APPROVED">APPROVED (Live on Tribe)</option>
                    <option value="PENDING">PENDING</option>
                    <option value="HIDDEN">HIDDEN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Review Comment *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write the customer testimonial quote..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#128C7E] bg-gray-50/50 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-colors"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
