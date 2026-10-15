import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, Package, ChevronRight, X, LogOut, ShoppingBag, Settings, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { user, loginUser, loginAdmin, logoutUser, navigate, updateUserProfile } = useCart();
  const [showPassword, setShowPassword] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Profile Edit State
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('tab') === 'orders') return 'orders';
    }
    return 'profile';
  });
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSent, setPasswordSent] = useState(false);

  // My Orders State
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

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
      const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/api\/?$/, '') || (
        typeof window !== 'undefined' && window.location.hostname !== 'localhost'
          ? 'https://nuts-and-spices-dqzp.onrender.com'
          : ''
      );
      fetch(BASE + '/api/orders/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders) {
          const paidOrders = data.orders.filter(o => {
            const pStatus = String(o.payment_status || o.paymentStatus || '').toLowerCase();
            const oStatus = String(o.status || '').toLowerCase();
            return ['paid', 'refund_pending', 'refunded'].includes(pStatus) || 
                   (!pStatus && !['pending', 'new', 'cancelled'].includes(oStatus));
          });
          setMyOrders(paidOrders);
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
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 pt-2 pb-20 sm:py-10">
        
        {/* MOBILE EXCLUSIVE HEADER & SEGMENTED TABS (< lg) */}
        <div className="block lg:hidden mb-4 space-y-2.5">
          {/* Compact Luxury Patron Card */}
          <div className="bg-gradient-to-br from-[#128C7E] via-[#075E54] to-[#075E54] text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-md relative overflow-hidden border border-[#075E54]/40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between gap-2.5 relative z-10">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-xl bg-white text-[#128C7E] shadow-md flex items-center justify-center text-lg font-black font-serif shrink-0 border border-white/40">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-base font-black font-serif text-white truncate">
                    {user.name}
                  </h1>
                  <p className="text-[11px] text-[#F9FAFB]/90 font-medium truncate mt-0.5">
                    {user.phone || user.email}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => navigate('shop', { category: 'all' })}
                  title="Shop Gourmet Catalog"
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/25 shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={logoutUser}
                  title="Log Out"
                  className="p-2 rounded-xl bg-white/15 hover:bg-rose-500/80 text-white transition-colors cursor-pointer border border-white/25 shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* iOS / Luxury Segmented Tab Navigation Control */}
          <div className="bg-gray-100 p-1 rounded-2xl flex border border-gray-200/80 shadow-inner">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 px-1 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white text-[#128C7E] shadow-sm ring-1 ring-black/5'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 shrink-0" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-2 px-1 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-[#128C7E] shadow-sm ring-1 ring-black/5'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Package className="w-3.5 h-3.5 shrink-0" />
              <span>Orders</span>
              {myOrders.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                  activeTab === 'orders' ? 'bg-[#128C7E] text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {myOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-2 px-1 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-white text-[#128C7E] shadow-sm ring-1 ring-black/5'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Settings className="w-3.5 h-3.5 shrink-0" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* DESKTOP 4-COLUMN GRID / TABLET */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* DESKTOP SIDEBAR: USER INFO (Visible on lg screens only) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block lg:col-span-1 space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-lg text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#128C7E]/20 to-transparent"></div>
              
              <div className="relative z-10 w-24 h-24 bg-white border-4 border-white shadow-md text-[#128C7E] rounded-full flex items-center justify-center mx-auto text-4xl font-black font-serif mt-4 mb-4">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              
              <div className="relative z-10">
                <h1 className="text-xl font-black font-serif text-[#000000]">
                  {user.name}
                </h1>
                <p className="text-xs text-[#8C7A6B] mt-1">{user.email || 'No email added'}</p>
                <p className="text-xs text-[#8C7A6B] mt-0.5">{user.phone}</p>
              </div>

              <div className="mt-8 space-y-2 relative z-10">
                <button
                  onClick={() => navigate('shop', { category: 'all' })}
                  className="w-full py-3 bg-[#128C7E] hover:bg-[#075E54] text-white font-extrabold text-xs rounded-xl transition-all shadow-md uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
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
            
            <div className="bg-white rounded-3xl p-5 border border-[#E5E7EB] shadow-md">
               <h3 className="text-xs sm:text-sm font-black font-serif text-[#000000] mb-3">Account Features</h3>
               <ul className="flex flex-col gap-2 text-xs sm:text-sm font-bold text-[#8C7A6B]">
                 <li 
                   onClick={() => setActiveTab('profile')}
                   className={`flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl transition-all ${activeTab === 'profile' ? 'text-[#128C7E] bg-green-50 shadow-2xs font-black' : 'hover:text-[#000000] hover:bg-gray-50'}`}
                 >
                   <UserIcon className="w-4 h-4 shrink-0"/> Profile Details
                 </li>
                 <li 
                   onClick={() => setActiveTab('orders')}
                   className={`flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl transition-all ${activeTab === 'orders' ? 'text-[#128C7E] bg-green-50 shadow-2xs font-black' : 'hover:text-[#000000] hover:bg-gray-50'}`}
                 >
                   <Package className="w-4 h-4 shrink-0"/> My Orders
                 </li>
                 <li 
                   onClick={() => setActiveTab('settings')}
                   className={`flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl transition-all ${activeTab === 'settings' ? 'text-[#128C7E] bg-green-50 shadow-2xs font-black' : 'hover:text-[#000000] hover:bg-gray-50'}`}
                 >
                   <Settings className="w-4 h-4 shrink-0"/> Settings
                 </li>
               </ul>
            </div>
          </motion.div>

          {/* MAIN CONTENT AREA */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl p-4 sm:p-10 border border-[#E5E7EB] shadow-md sm:shadow-lg h-auto lg:h-full">
              
              {activeTab === 'orders' ? (
                <>
                  <div className="flex justify-between items-end mb-6 sm:mb-8 border-b border-[#E5E7EB] pb-3 sm:pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black font-serif text-[#000000] flex items-center gap-2.5">
                        <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#128C7E]" />
                        Order History
                      </h2>
                      <p className="text-xs text-[#8C7A6B] mt-0.5">View and track your recent purchases.</p>
                    </div>
                  </div>
              
              {loadingOrders ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-10 h-10 border-4 border-[#128C7E] border-t-transparent rounded-full animate-spin"></div>
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
                  <button onClick={() => navigate('shop')} className="px-6 py-3 bg-[#128C7E] text-white font-bold text-xs rounded-xl hover:bg-[#075E54] transition-colors shadow-md mt-4 cursor-pointer inline-flex items-center gap-2">
                    Start Shopping <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((order, idx) => {
                    const orderDate = new Date(order.created_at || order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    const total = Number(order.total_amount || order.totalAmount || order.total || 0).toLocaleString('en-IN');
                    const isRefunded = (order.status || '').toLowerCase() === 'refunded';
                    const isCancelled = (order.status || '').toLowerCase() === 'cancelled';
                    const canCancel = (order.status || '').toLowerCase() === 'pending' || (order.status || '').toLowerCase() === 'confirmed';

                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={order.id} 
                        onClick={() => navigate('order-details', { order, orderId: order.order_id || order.orderId || order.id })}
                        className={`p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4 border ${
                          isRefunded
                            ? 'bg-red-50/95 border-red-500 shadow-red-100 ring-2 ring-red-400/30'
                            : isCancelled
                            ? 'bg-gray-50/90 border-gray-300'
                            : 'bg-white border-[#E5E7EB] hover:border-[#128C7E]'
                        }`}
                      >
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                            isRefunded ? 'bg-red-200 text-red-700' :
                            isCancelled ? 'bg-gray-200 text-gray-600' :
                            order.status === 'pending' ? 'bg-amber-100 text-amber-500' : 
                            order.status === 'delivered' ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'
                          }`}>
                            <Package className="w-6 h-6" />
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-black tracking-widest font-mono block ${isRefunded ? 'text-red-900 font-extrabold' : 'text-[#000000]'}`}>
                                #{order.order_id || order.orderId || order.id}
                              </span>
                              {isRefunded && (
                                <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-black rounded uppercase tracking-wider">
                                  Refunded
                                </span>
                              )}
                            </div>
                            <p className={`text-xs font-bold flex items-center gap-2 ${isRefunded ? 'text-red-700' : 'text-[#8C7A6B]'}`}>
                              {orderDate}
                              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                              <span className={isRefunded ? 'text-red-900 font-black' : 'text-[#000000]'}>₹{total}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto w-full border-t sm:border-t-0 border-[#E5E7EB] pt-4 sm:pt-0">
                          {canCancel && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('order-details', { 
                                  order, 
                                  orderId: order.order_id || order.orderId || order.id, 
                                  openCancel: true 
                                });
                              }}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-300 text-[11px] font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Cancel Delivery</span>
                            </button>
                          )}
                          <span className={`text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 ${
                            isRefunded ? 'bg-red-600 text-white shadow-sm' :
                            isCancelled ? 'bg-gray-200 text-gray-700 border border-gray-300' :
                            order.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                            order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {order.status}
                          </span>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isRefunded ? 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-[#128C7E] group-hover:text-white'
                          }`}>
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
                  <div className="flex justify-between items-end mb-4 sm:mb-8 border-b border-[#E5E7EB] pb-2.5 sm:pb-4">
                    <div>
                      <h2 className="text-lg sm:text-2xl font-black font-serif text-[#000000] flex items-center gap-2">
                        <UserIcon className="w-4 h-4 sm:w-6 sm:h-6 text-[#128C7E]" />
                        Profile Details
                      </h2>
                      <p className="text-[11px] sm:text-xs text-[#8C7A6B] mt-0.5">Update your personal contact information.</p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="max-w-md space-y-3.5 sm:space-y-5">
                    
                    {saveSuccess && (
                      <div className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold p-3 rounded-2xl flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Profile updated successfully!</span>
                      </div>
                    )}

                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#000000]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white border border-[#E5E7EB] rounded-xl sm:rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#128C7E] transition-colors shadow-xs"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-1.5 opacity-60">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#000000]">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={user.phone}
                        readOnly
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl sm:rounded-2xl text-xs font-semibold text-[#000000] outline-none cursor-not-allowed"
                      />
                      <p className="text-[10px] text-[#8C7A6B] mt-0.5 sm:mt-1">Phone number cannot be changed.</p>
                    </div>

                    <div className="space-y-1 sm:space-y-1.5 opacity-60">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#000000]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email || ''}
                        readOnly
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl sm:rounded-2xl text-xs font-semibold text-[#000000] outline-none cursor-not-allowed"
                      />
                    </div>

                    <div className="pt-2 sm:pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-[#128C7E] hover:bg-[#075E54] disabled:opacity-50 text-white font-extrabold text-xs rounded-xl sm:rounded-2xl transition-all shadow-md hover:shadow-lg uppercase tracking-wider cursor-pointer flex justify-center items-center gap-2"
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
                  <div className="flex justify-between items-end mb-6 sm:mb-8 border-b border-[#E5E7EB] pb-3 sm:pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black font-serif text-[#000000] flex items-center gap-2.5">
                        <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-[#128C7E]" />
                        Account Settings
                      </h2>
                      <p className="text-xs text-[#8C7A6B] mt-0.5">Manage preferences and account security.</p>
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
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#128C7E]"></div>
                          </div>
                        </label>
                        
                        <label className="flex items-center justify-between cursor-pointer group">
                          <div>
                            <p className="text-sm font-bold text-[#000000]">Promotional Emails</p>
                            <p className="text-xs text-[#8C7A6B] mt-0.5">Get early access to offers and new arrivals.</p>
                          </div>
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#128C7E]"></div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Security */}
                    <div>
                      <h3 className="text-xs font-black uppercase text-[#000000] tracking-wider mb-4 border-b border-[#E5E7EB] pb-2">Security</h3>
                      
                      {passwordSent && (
                        <div className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 mb-4">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Password reset link sent to your registered email/phone!</span>
                        </div>
                      )}

                      <button 
                        onClick={() => {
                          setPasswordSent(true);
                          setTimeout(() => setPasswordSent(false), 3000);
                        }}
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



      </div>
    );
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const id = loginIdentifier.trim();
    if (!id || !loginPassword) {
      setErrorMessage('Please enter your mobile/email and password.');
      return;
    }
    if (/^\d+$/.test(id) && id.length !== 10) {
      setErrorMessage('Mobile number must be exactly 10 digits.');
      return;
    }

    if (
      id.toLowerCase() === 'admin702@admin.com' || 
      id.toLowerCase() === 'admin@nutsandspices.in' || 
      id.toLowerCase() === 'admin@admin.com' || 
      id.toLowerCase().includes('admin')
    ) {
      const adminRes = await loginAdmin(id, loginPassword);
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

    const res = await loginUser({
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
              <CheckCircle2 className="w-4 h-4 text-[#128C7E]" />
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
                  placeholder="Enter 10-digit mobile no. or email"
                  value={loginIdentifier}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d+$/.test(val)) {
                      setLoginIdentifier(val.slice(0, 10));
                    } else {
                      setLoginIdentifier(val);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] placeholder-[#8C7A6B] outline-none focus:border-[#128C7E] transition-colors"
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
                  className="text-[11px] font-bold text-[#128C7E] hover:underline cursor-pointer"
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
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] placeholder-[#8C7A6B] outline-none focus:border-[#128C7E] transition-colors"
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
                className="rounded text-[#000000] focus:ring-[#128C7E]"
              />
              <label htmlFor="login-remember" className="text-xs font-medium text-[#000000]">
                Remember me on this browser
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md hover:shadow-lg uppercase tracking-wider cursor-pointer mt-2"
            >
              LOGIN TO ACCOUNT
            </button>



            {/* Mobile Link to Register */}
            <div className="text-center pt-4 border-t border-[#E5E7EB]">
              <span className="text-xs text-[#8C7A6B]">Don't have an account? </span>
              <button
                type="button"
                onClick={() => navigate('register')}
                className="text-xs font-bold text-[#128C7E] hover:underline cursor-pointer"
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
