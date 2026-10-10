import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Star, CheckCircle, EyeOff, Trash2 } from 'lucide-react';

export default function AdminReviews() {
  const { reviews, updateReviewStatus, deleteReview } = useCart();
  const [deleteConfirmReview, setDeleteConfirmReview] = useState(null);

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
            ⭐ ADMIN — REVIEWS ({reviews.length})
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            Moderate customer reviews, approve ratings to display on storefront, hide or remove feedback.
          </p>
        </div>
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

    </div>
  );
}
