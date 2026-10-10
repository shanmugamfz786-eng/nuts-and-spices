import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, UserPlus, Package, ChevronRight, X, LogOut, ShoppingBag, Settings, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const { user, loginUser, logoutUser, navigate, loginAdmin, updateUserProfile } = useCart();
  const [showPassword, setShowPassword] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Profile Edit State
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // My Orders State
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setIsSaving(true);
    const res = await updateUserProfile(editName.trim());
    setIsSaving(false);
    if (res && res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(res?.message || 'Failed to update profile');
    }
  };

  useEffect(() => {
    if (user) {
      setLoadingOrders(true);
      const token = localStorage.getItem('nuts_spices_auth_token') || '';
      const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/api\/?$/, '') || '';
      fetch(BASE + '/api/orders/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders) {
          setMyOrders(data.orders);
        }
        setLoadingOrders(false);
      })
      .catch(() => {
        setLoadingOrders(false);
      });
    }
  }, [user]);

  if (user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR: USER INFO */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-lg text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#25D366]/20 to-transparent"></div>
              
              <div className="relative z-10 w-24 h-24 bg-white border-4 border-white shadow-md text-[#25D366] rounded-full flex items-center justify-center mx-auto text-4xl font-black font-serif mt-4 mb-4">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              
              <div className="relative z-10">
                <span className="text-[10px] font-extrabold text-[#25D366] uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full inline-block mb-2">
                  Premium Member
                </span>
                <h1 className="text-xl font-black font-serif text-[#000000]">
                  {user.name}
                </h1>
                <p className="text-xs text-[#8C7A6B] mt-1">{user.email || 'No email added'}</p>
                <p className="text-xs text-[#8C7A6B] mt-0.5">{user.phone}</p>
              </div>

              <div className="mt-8 space-y-2 relative z-10">
                <button
                  onClick={() => navigate('shop', { category: 'all' })}
                  className="w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-extrabold text-xs rounded-xl transition-all shadow-md uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Now</span>
                </button>
                <button
                  onClick={logoutUser}
                  className="w-full py-3 bg-white border border-[#E5E7EB] hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-[#000000] font-bold text-xs rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-md hidden lg:block">
               <h3 className="text-sm font-black font-serif text-[#000000] mb-4">Account Features</h3>
               <ul className="space-y-3 text-sm font-bold text-[#8C7A6B]">
                 <li 
                   onClick={() => setActiveTab('orders')}
                   className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${activeTab === 'orders' ? 'text-[#25D366] bg-green-50' : 'hover:text-[#000000]'}`}
                 >
                   <Package className="w-4 h-4"/> My Orders
                 </li>
                 <li 
                   onClick={() => setActiveTab('profile')}
                   className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${activeTab === 'profile' ? 'text-[#25D366] bg-green-50' : 'hover:text-[#000000]'}`}
                 >
                   <UserIcon className="w-4 h-4"/> Profile Details
                 </li>
                 <li 
                   onClick={() => setActiveTab('settings')}
                   className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${activeTab === 'settings' ? 'text-[#25D366] bg-green-50' : 'hover:text-[#000000]'}`}
                 >
                   <Settings className="w-4 h-4"/> Settings
                 </li>
               </ul>
            </div>
          </motion.div>

          {/* MAIN CONTENT: MY ORDERS */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E7EB] shadow-lg h-full">
              
              {activeTab === 'orders' ? (
                <>
                  <div className="flex justify-between items-end mb-8 border-b border-[#E5E7EB] pb-4">
                    <div>
                      <h2 className="text-2xl font-black font-serif text-[#000000] flex items-center gap-3">
                        <Package className="w-6 h-6 text-[#25D366]" />
                        Order History
                      </h2>
                      <p className="text-xs text-[#8C7A6B] mt-1">View and track your recent purchases.</p>
                    </div>
                  </div>
              
              {loadingOrders ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-10 h-10 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : myOrders.length === 0 ? (
                <div className="bg-[#F9FAFB] p-12 rounded-3xl border border-dashed border-[#E5E7EB] text-center space-y-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#000000]">No Orders Yet</h3>
                    <p className="text-sm font-medium text-[#8C7A6B] mt-1">Looks like you haven't made your first purchase.</p>
                  </div>
                  <button onClick={() => navigate('shop')} className="px-6 py-3 bg-[#25D366] text-white font-bold text-xs rounded-xl hover:bg-[#128C7E] transition-colors shadow-md mt-4 cursor-pointer inline-flex items-center gap-2">
                    Start Shopping <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((order, idx) => {
                    const orderDate = new Date(order.created_at || order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    const total = Number(order.total_amount || order.totalAmount || order.total || 0).toLocaleString('en-IN');
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className="bg-white border border-[#E5E7EB] hover:border-[#25D366] p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                            order.status === 'pending' ? 'bg-amber-100 text-amber-500' : 
                            order.status === 'delivered' ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'
                          }`}>
                            <Package className="w-6 h-6" />
                          </div>
                          
                          <div>
                            <span className="text-xs font-black text-[#000000] tracking-widest font-mono block mb-1">
                              #{order.order_id || order.orderId || order.id}
                            </span>
                            <p className="text-xs font-bold text-[#8C7A6B] flex items-center gap-2">
                              {orderDate}
                              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                              <span className="text-[#000000]">₹{total}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-t-0 border-[#E5E7EB] pt-4 sm:pt-0">
                          <span className={`text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 ${
                            order.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                            order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {order.status}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors text-gray-400">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
                </>
              ) : activeTab === 'profile' ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-end mb-8 border-b border-[#E5E7EB] pb-4">
                    <div>
                      <h2 className="text-2xl font-black font-serif text-[#000000] flex items-center gap-3">
                        <UserIcon className="w-6 h-6 text-[#25D366]" />
                        Profile Details
                      </h2>
                      <p className="text-xs text-[#8C7A6B] mt-1">Update your personal information.</p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="max-w-md space-y-5">
                    
                    {saveSuccess && (
                      <div className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Profile updated successfully!</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#25D366] transition-colors shadow-sm"
                      />
                    </div>

                    <div className="space-y-1.5 opacity-60 pointer-events-none">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={user.phone}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none"
                      />
                      <p className="text-[10px] text-[#8C7A6B] mt-1">Phone number cannot be changed.</p>
                    </div>

                    <div className="space-y-1.5 opacity-60 pointer-events-none">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email || ''}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md hover:shadow-lg uppercase tracking-wider cursor-pointer flex justify-center items-center gap-2"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : activeTab === 'settings' ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-end mb-8 border-b border-[#E5E7EB] pb-4">
                    <div>
                      <h2 className="text-2xl font-black font-serif text-[#000000] flex items-center gap-3">
                        <Settings className="w-6 h-6 text-[#25D366]" />
                        Account Settings
                      </h2>
                      <p className="text-xs text-[#8C7A6B] mt-1">Manage preferences and account security.</p>
                    </div>
                  </div>

                  <div className="space-y-8 max-w-lg">
                    {/* Notifications */}
                    <div>
                      <h3 className="text-xs font-black uppercase text-[#000000] tracking-wider mb-4 border-b border-[#E5E7EB] pb-2">Notification Preferences</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer group">
                          <div>
                            <p className="text-sm font-bold text-[#000000]">Order Updates via SMS</p>
                            <p className="text-xs text-[#8C7A6B] mt-0.5">Receive text messages when your order status changes.</p>
                          </div>
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
                          </div>
                        </label>
                        
                        <label className="flex items-center justify-between cursor-pointer group">
                          <div>
                            <p className="text-sm font-bold text-[#000000]">Promotional Emails</p>
                            <p className="text-xs text-[#8C7A6B] mt-0.5">Get early access to offers and new arrivals.</p>
                          </div>
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Security */}
                    <div>
                      <h3 className="text-xs font-black uppercase text-[#000000] tracking-wider mb-4 border-b border-[#E5E7EB] pb-2">Security</h3>
                      <button 
                        onClick={() => alert('Password reset link has been sent to your registered email or phone number.')}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#000000] font-bold text-xs rounded-xl transition-colors shadow-sm cursor-pointer"
                      >
                        Change Password
                      </button>
                    </div>

                    {/* Danger Zone */}
                    <div>
                      <h3 className="text-xs font-black uppercase text-red-600 tracking-wider mb-4 border-b border-red-100 pb-2">Danger Zone</h3>
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
                            logoutUser();
                          }
                        }}
                        className="px-6 py-2.5 bg-white border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl transition-colors shadow-sm cursor-pointer"
                      >
                        Deactivate Account
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>

        {/* ORDER DETAILS MODAL */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-[#E5E7EB] max-h-[90vh] flex flex-col shadow-2xl"
              >
                
                <div className="bg-gradient-to-r from-[#F9FAFB] to-white p-6 border-b border-[#E5E7EB] flex justify-between items-center shrink-0">
                  <div>
                    <h3 className="font-black text-xl text-[#000000]">Order Summary</h3>
                    <p className="text-xs text-[#8C7A6B] font-mono mt-1">#{selectedOrder.order_id || selectedOrder.orderId || selectedOrder.id}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white border border-[#E5E7EB] shadow-sm">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-8">
                  
                  {/* Status Banner */}
                  <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
                    selectedOrder.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-800' : 
                    selectedOrder.status === 'delivered' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider opacity-70">Current Status</p>
                      <p className="text-sm font-black capitalize">{selectedOrder.status}</p>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase text-[#8C7A6B] tracking-wider mb-3">Delivery Address</h4>
                    <div className="bg-gray-50 border border-[#E5E7EB] rounded-2xl p-4">
                      <p className="font-black text-[#000000] text-sm mb-1">{selectedOrder.customer_name || selectedOrder.customerName}</p>
                      <p className="text-xs text-[#6B5A4B] leading-relaxed">{selectedOrder.address}</p>
                      <p className="text-xs text-[#6B5A4B] leading-relaxed">{selectedOrder.city}, {selectedOrder.state || 'Tamil Nadu'} - {selectedOrder.pincode}</p>
                      <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#8C7A6B] uppercase">Phone:</span>
                        <span className="text-xs font-mono font-bold text-[#000000]">{selectedOrder.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase text-[#8C7A6B] tracking-wider mb-3">Items Ordered</h4>
                    <div className="space-y-3">
                      {(() => {
                        let items = [];
                        try {
                          items = typeof selectedOrder.items_json === 'string' ? JSON.parse(selectedOrder.items_json) 
                                : (typeof selectedOrder.items === 'string' ? JSON.parse(selectedOrder.items) : selectedOrder.items) || [];
                        } catch(e) {}
                        
                        return items.map((item, idx) => (
                          <div key={idx} className="p-3 bg-white border border-[#E5E7EB] rounded-xl flex items-center gap-4 hover:border-[#25D366] transition-colors shadow-sm">
                            <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                              {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><Package className="w-6 h-6"/></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-[#000000] truncate">{item.name}</p>
                              <p className="text-xs font-bold text-[#8C7A6B] mt-0.5">{item.weight} <span className="mx-1">×</span> {item.quantity}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-black text-[#25D366]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="bg-[#000000] text-white p-5 rounded-2xl space-y-3 shadow-lg">
                     <div className="flex justify-between text-xs font-medium text-gray-400">
                       <span>Subtotal</span>
                       <span>₹{Number(selectedOrder.subtotal || 0).toLocaleString('en-IN')}</span>
                     </div>
                     <div className="flex justify-between text-xs font-medium text-gray-400">
                       <span>Delivery Charge</span>
                       <span>₹{Number(selectedOrder.delivery_charge || selectedOrder.deliveryCharge || 0).toLocaleString('en-IN')}</span>
                     </div>
                     <div className="flex justify-between text-base font-black pt-3 border-t border-gray-800">
                       <span>Total Amount</span>
                       <span className="text-[#25D366]">₹{Number(selectedOrder.total_amount || selectedOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
                     </div>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const id = loginIdentifier.trim();
    if (!id || !loginPassword) {
      setErrorMessage('Please enter your mobile/email and password.');
      return;
    }

    if (id.toLowerCase() === 'admin702@admin.com') {
      const adminRes = loginAdmin(id, loginPassword);
      if (adminRes.success) {
        setSuccessMessage('Admin Access Granted!');
        setTimeout(() => {
          navigate('admin');
        }, 600);
      } else {
        setErrorMessage(adminRes.message || 'Invalid Admin Password');
      }
      return;
    }

    const res = loginUser({
      identifier: id,
      password: loginPassword
    });

    if (res && res.success) {
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        navigate('home');
      }, 600);
    } else {
      setErrorMessage(res?.message || 'Invalid mobile/email or password.');
    }
  };

  const handleWhatsAppQuickLogin = () => {
    setSuccessMessage('Authenticating via WhatsApp...');
    setTimeout(() => {
      loginUser({
        name: 'WhatsApp Member',
        identifier: '9876543210',
        email: 'whatsapp@nutsandspices.in',
        phone: '9876543210'
      });
      navigate('home');
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E5E7EB]">
        
        {/* Login Form */}
        <div className="p-8 sm:p-10 bg-[#F9FAFB] flex flex-col justify-center">
          
          <div className="mb-6">
            <h3 className="text-2xl font-black font-serif text-[#000000]">
              Account Login
            </h3>
            <p className="text-xs text-[#8C7A6B] mt-1">
              Enter your registered mobile number or email address below.
            </p>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="bg-red-50 text-red-700 border border-red-200 text-xs font-semibold p-3.5 rounded-2xl mb-4">
              ⚠️ {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Mobile / Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                Mobile Phone or Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Enter mobile no. or email"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] placeholder-[#8C7A6B] outline-none focus:border-[#25D366] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your mobile via WhatsApp.')}
                  className="text-[11px] font-bold text-[#25D366] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] placeholder-[#8C7A6B] outline-none focus:border-[#25D366] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#000000] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="login-remember"
                defaultChecked
                className="rounded text-[#000000] focus:ring-[#25D366]"
              />
              <label htmlFor="login-remember" className="text-xs font-medium text-[#000000]">
                Remember me on this browser
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md hover:shadow-lg uppercase tracking-wider cursor-pointer mt-2"
            >
              LOGIN TO ACCOUNT
            </button>



            {/* Mobile Link to Register */}
            <div className="text-center pt-4 border-t border-[#E5E7EB]">
              <span className="text-xs text-[#8C7A6B]">Don't have an account? </span>
              <button
                type="button"
                onClick={() => navigate('register')}
                className="text-xs font-bold text-[#25D366] hover:underline cursor-pointer"
              >
                Register Here →
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
