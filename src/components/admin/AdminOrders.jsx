import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  Search, Trash2, Eye, Phone, MapPin, 
  Calendar, X, MessageSquare, ChevronDown, Check
} from 'lucide-react';

export default function AdminOrders({ selectedOrder, setSelectedOrder }) {
  const { orders, updateOrderStatus, deleteOrder, storeSettings } = useCart();
  const [activeFilter, setActiveFilter] = useState('All Statuses');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingStatusUpdates, setPendingStatusUpdates] = useState({});

  const statusOptions = ['All Statuses', 'Pending', 'NEW', 'CONFIRMED', 'PREPARING', 'OUT FOR DELIVERY', 'DELIVERED', 'CANCELLED'];

  const filteredOrders = orders.filter(o => {
    const statusNormalized = (o.status || '').toLowerCase();
    const filterNormalized = activeFilter.toLowerCase();
    
    let matchesFilter = true;
    if (activeFilter !== 'All Statuses') {
      if (filterNormalized === 'pending') {
        matchesFilter = statusNormalized === 'pending' || statusNormalized === 'new';
      } else {
        matchesFilter = statusNormalized === filterNormalized;
      }
    }

    const matchesSearch = 
      (o.orderId && o.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.city && o.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.phone && o.phone.includes(searchTerm));
    
    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeStyle = (status) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'PENDING':
      case 'NEW':
        return 'bg-[#fef3c7] text-[#b45309] hover:bg-[#fde68a]';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'PREPARING':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'OUT FOR DELIVERY':
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      case 'DELIVERED':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 hover:bg-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
    }
  };

  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState(null);

  const handleDelete = (orderId, e) => {
    e.stopPropagation();
    setDeleteConfirmOrder(orderId);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '19 Sept 2026';
    if (dateStr.includes('Sept') || dateStr.includes('Jan') || dateStr.includes('Oct') || dateStr.includes('Aug')) {
      return dateStr;
    }
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const activeWhatsApp = storeSettings.whatsappNumber || '919876543210';

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* HEADER WITH TITLE & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Manage Orders
        </h1>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-56 sm:w-64 bg-white border border-gray-200/90 focus:border-amber-500 rounded-lg py-2 pl-10 pr-4 text-xs font-normal text-gray-800 shadow-2xs outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200/90 focus:border-amber-500 text-xs font-semibold text-gray-800 rounded-lg py-2 pl-3.5 pr-8 outline-none cursor-pointer shadow-2xs transition-all"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PREPARING">Preparing</option>
              <option value="OUT FOR DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ORDERS TABLE CARD CONTAINER */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-900 font-bold text-xs tracking-normal">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Total Value</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No orders matching your search or filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const displayId = ord.orderId.startsWith('#') ? ord.orderId : `#${ord.orderId}`;
                  const formattedDate = formatDate(ord.date);
                  const displayCity = ord.city || ord.address || 'Location';

                  return (
                    <tr 
                      key={ord.orderId} 
                      onClick={() => setSelectedOrder(ord)}
                      className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                    >
                      
                      {/* Order ID */}
                      <td className="py-4 px-6 font-bold text-[#e11d48] text-xs tracking-tight">
                        {displayId}
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900 text-xs">{ord.customerName}</div>
                        <div className="text-[11px] text-gray-400 font-normal mt-0.5">
                          {displayCity}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-gray-600 font-medium">
                        {formattedDate}
                      </td>

                      {/* Total Value */}
                      <td className="py-4 px-6 font-bold text-gray-900 text-xs">
                        ₹{ord.total ? ord.total.toLocaleString('en-IN') : '0'}
                      </td>

                      {/* Status Dropdown Pill */}
                      <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <div className="relative inline-block">
                            <select
                              value={pendingStatusUpdates[ord.orderId] || ord.status}
                              onChange={(e) => setPendingStatusUpdates({ ...pendingStatusUpdates, [ord.orderId]: e.target.value })}
                              className={`appearance-none text-[11px] font-semibold rounded-md pl-3 pr-6 py-1 cursor-pointer outline-none transition-colors ${getStatusBadgeStyle(pendingStatusUpdates[ord.orderId] || ord.status)}`}
                            >
                              <option value="Pending" className="bg-white text-gray-800">Pending</option>
                              <option value="NEW" className="bg-white text-gray-800">NEW</option>
                              <option value="CONFIRMED" className="bg-white text-gray-800">Confirmed</option>
                              <option value="PREPARING" className="bg-white text-gray-800">Preparing</option>
                              <option value="OUT FOR DELIVERY" className="bg-white text-gray-800">Out for Delivery</option>
                              <option value="DELIVERED" className="bg-white text-gray-800">Delivered</option>
                              <option value="CANCELLED" className="bg-white text-gray-800">Cancelled</option>
                            </select>
                            <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
                          </div>
                          {pendingStatusUpdates[ord.orderId] && pendingStatusUpdates[ord.orderId] !== ord.status && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateOrderStatus(ord.orderId, pendingStatusUpdates[ord.orderId]);
                                const newPending = { ...pendingStatusUpdates };
                                delete newPending[ord.orderId];
                                setPendingStatusUpdates(newPending);
                              }}
                              title="Confirm Status Update"
                              className="p-1 text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            title="View Order Details"
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(ord.orderId, e)}
                            title="Delete Order"
                            className="p-1.5 text-red-400 hover:text-red-500 bg-red-50/80 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs">
          <div className="bg-white border border-gray-100 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl my-auto text-gray-800 relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Order Specification</span>
                <h3 className="text-xl font-extrabold text-gray-900 font-mono">
                  #{selectedOrder.orderId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                <span className="font-bold text-gray-900 text-sm">{selectedOrder.customerName}</span>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadgeStyle(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-900 font-mono">{selectedOrder.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>Date: {formatDate(selectedOrder.date)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-gray-200/60 text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>{selectedOrder.address}, {selectedOrder.city} - {selectedOrder.pincode}</span>
              </div>

              {selectedOrder.notes && (
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200/70 text-amber-900 text-[11px]">
                  <strong>Notes:</strong> {selectedOrder.notes}
                </div>
              )}
            </div>

            {/* Items Ordered */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                Items Ordered ({selectedOrder.items ? selectedOrder.items.length : 0})
              </h4>
              <div className="divide-y divide-gray-100 bg-gray-50 rounded-xl border border-gray-100 p-3 text-xs max-h-44 overflow-y-auto">
                {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block">{item.name}</span>
                      <span className="text-[10px] text-gray-500">Weight: {item.weight} | Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 flex justify-between items-center">
              <div>
                <span className="text-[11px] font-medium text-gray-500 block">Total Payable</span>
                <span className="text-xl font-extrabold text-gray-900">
                  ₹{selectedOrder.total ? selectedOrder.total.toLocaleString('en-IN') : '0'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={pendingStatusUpdates[selectedOrder.orderId] || selectedOrder.status}
                    onChange={(e) => setPendingStatusUpdates({ ...pendingStatusUpdates, [selectedOrder.orderId]: e.target.value })}
                    className={`appearance-none text-xs font-bold rounded-lg pl-3 pr-7 py-2 cursor-pointer outline-none transition-colors ${getStatusBadgeStyle(pendingStatusUpdates[selectedOrder.orderId] || selectedOrder.status)}`}
                  >
                    <option value="Pending" className="bg-white text-gray-800">Pending</option>
                    <option value="NEW" className="bg-white text-gray-800">NEW</option>
                    <option value="CONFIRMED" className="bg-white text-gray-800">Confirmed</option>
                    <option value="PREPARING" className="bg-white text-gray-800">Preparing</option>
                    <option value="OUT FOR DELIVERY" className="bg-white text-gray-800">Out for Delivery</option>
                    <option value="DELIVERED" className="bg-white text-gray-800">Delivered</option>
                    <option value="CANCELLED" className="bg-white text-gray-800">Cancelled</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
                </div>
                {pendingStatusUpdates[selectedOrder.orderId] && pendingStatusUpdates[selectedOrder.orderId] !== selectedOrder.status && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateOrderStatus(selectedOrder.orderId, pendingStatusUpdates[selectedOrder.orderId]);
                      setSelectedOrder({ ...selectedOrder, status: pendingStatusUpdates[selectedOrder.orderId] });
                      const newPending = { ...pendingStatusUpdates };
                      delete newPending[selectedOrder.orderId];
                      setPendingStatusUpdates(newPending);
                    }}
                    title="Confirm Status Update"
                    className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-1">
              <a
                href={`https://wa.me/${selectedOrder.phone || activeWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#25D366] hover:bg-[#25D366] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Customer</span>
              </a>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteConfirmOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl my-auto text-gray-800 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Order?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete Order <strong className="text-gray-800">#{deleteConfirmOrder}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmOrder(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteOrder(deleteConfirmOrder);
                  if (selectedOrder?.orderId === deleteConfirmOrder) {
                    setSelectedOrder(null);
                  }
                  setDeleteConfirmOrder(null);
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
