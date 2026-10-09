import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Users, Search, Phone, Mail, MapPin, Calendar, ChevronRight, X, UserCheck, Eye, Trash2 } from 'lucide-react';

export default function AdminCustomers({ onViewOrderDetails }) {
  const { orders, registeredUsers, deleteCustomer } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteConfirmCustomer, setDeleteConfirmCustomer] = useState(null);

  // Compile full customer list from orders + registeredUsers
  const customersMap = {};

  // 1. Process orders to group customer order history & total spending
  orders.forEach(ord => {
    const key = (ord.phone || ord.customerName).trim().toLowerCase();
    if (!customersMap[key]) {
      customersMap[key] = {
        name: ord.customerName || 'Customer',
        phone: ord.phone || 'N/A',
        email: ord.email || 'customer@nutsandspices.store',
        address: ord.address || 'Chennai',
        city: ord.city || 'Chennai',
        pincode: ord.pincode || '600001',
        totalOrders: 0,
        totalPurchase: 0,
        lastOrderDate: ord.date,
        orderHistory: []
      };
    }

    customersMap[key].totalOrders += 1;
    customersMap[key].totalPurchase += (ord.total || 0);
    customersMap[key].orderHistory.push(ord);

    // Update last order date if newer
    if (new Date(ord.date) > new Date(customersMap[key].lastOrderDate)) {
      customersMap[key].lastOrderDate = ord.date;
    }
  });

  // 2. Add registered users who haven't placed orders yet
  registeredUsers.forEach(u => {
    const key = (u.phone || u.name).trim().toLowerCase();
    if (!customersMap[key]) {
      customersMap[key] = {
        name: u.name,
        phone: u.phone || 'N/A',
        email: u.email || 'customer@nutsandspices.store',
        address: 'Registered Store User',
        city: 'Chennai',
        pincode: '600001',
        totalOrders: 0,
        totalPurchase: 0,
        lastOrderDate: 'No orders yet',
        orderHistory: []
      };
    }
  });

  const customerList = Object.values(customersMap);

  const filteredCustomers = customerList.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Customer Directory ({customerList.length})
          </h1>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, phone number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-gray-900 outline-none"
          />
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden text-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200/80 bg-gray-50/80 text-gray-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-4 px-4">Customer Name</th>
                <th className="py-4 px-4">Phone Number</th>
                <th className="py-4 px-4 text-center">Order Date</th>
                <th className="py-4 px-4 text-right">Total Purchase</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((cust, idx) => (
                <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                  
                  {/* Customer Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F9FAFB] text-[#000000] border border-[#E5E7EB] font-extrabold flex items-center justify-center text-xs uppercase shadow-xs shrink-0">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-xs">{cust.name}</h4>
                        <span className="text-[10px] text-gray-500">{cust.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Phone Number */}
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-800">
                    {cust.phone}
                  </td>

                  {/* Order Date */}
                  <td className="py-3.5 px-4 text-center text-gray-600 font-medium text-xs">
                    {cust.lastOrderDate}
                  </td>

                  {/* Total Purchase Amount */}
                  <td className="py-3.5 px-4 text-right font-black text-[#000000] text-sm font-serif">
                    ₹{cust.totalPurchase.toLocaleString('en-IN')}
                  </td>

                  {/* Profile & Delete Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/80 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 font-bold text-xs"
                        title="View Customer Profile"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Customer Profile</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmCustomer(cust)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-700 border border-rose-200/80 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="Delete Customer Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER PROFILE MODAL & ORDER HISTORY */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-auto text-gray-800 relative animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F9FAFB] text-[#000000] border border-[#E5E7EB] flex items-center justify-center text-xl font-black shadow-sm">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                  <span className="text-xs text-amber-600 font-semibold">Customer Profile Card</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Phone Number</span>
                <span className="font-mono font-bold text-gray-900 text-sm">{selectedCustomer.phone}</span>
              </div>
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Email Address</span>
                <span className="font-bold text-gray-900 truncate block">{selectedCustomer.email}</span>
              </div>
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Order Date</span>
                <span className="font-semibold text-gray-900 text-sm">{selectedCustomer.lastOrderDate}</span>
              </div>
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Total Lifetime Purchase</span>
                <span className="font-serif font-black text-[#000000] text-sm">₹{selectedCustomer.totalPurchase.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Order History Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase text-gray-700 tracking-wider flex items-center justify-between">
                <span>Order History ({selectedCustomer.orderHistory.length})</span>
                <span className="text-[10px] text-amber-600 font-normal">Click order to view full bill</span>
              </h4>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {selectedCustomer.orderHistory.length === 0 ? (
                  <div className="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500 border border-gray-200/60">
                    No placed orders recorded for this user yet.
                  </div>
                ) : (
                  selectedCustomer.orderHistory.map((ord) => (
                    <div 
                      key={ord.orderId}
                      onClick={() => {
                        setSelectedCustomer(null);
                        onViewOrderDetails(ord);
                      }}
                      className="bg-gray-50 hover:bg-amber-50/60 p-3.5 rounded-xl border border-gray-200/80 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-amber-700 text-xs">#{ord.orderId}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 font-bold uppercase">
                            {ord.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mt-1">Date: {ord.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-gray-900 font-serif text-sm block">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-amber-600 font-bold">View Bill →</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl border border-gray-200"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CUSTOM DELETE CUSTOMER CONFIRMATION MODAL */}
      {deleteConfirmCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl my-auto text-gray-800 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Customer Record?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete customer <strong className="text-gray-800">"{deleteConfirmCustomer.name}"</strong>? This will remove their profile and associated order records.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmCustomer(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCustomer(deleteConfirmCustomer);
                  if (selectedCustomer?.name === deleteConfirmCustomer.name) {
                    setSelectedCustomer(null);
                  }
                  setDeleteConfirmCustomer(null);
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

