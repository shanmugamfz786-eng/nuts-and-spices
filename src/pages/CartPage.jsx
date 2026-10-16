import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, ArrowLeft, ShieldCheck, Tag, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal, 
    appliedCoupon, 
    discountAmount, 
    grandTotal, 
    deliveryCharge,
    applyCoupon, 
    removeCoupon, 
    navigate, 
    user 
  } = useCart();
  const [realOrders, setRealOrders] = useState([]);
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({
      type: res.success ? 'success' : 'error',
      text: res.message
    });
    if (res.success) {
      setCouponInput('');
    }
  };

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        let fetchedOrders = [];
        const token = localStorage.getItem('nuts_spices_auth_token');
        const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/api\/?$/, '') || (
          typeof window !== 'undefined' && window.location.hostname !== 'localhost'
            ? 'https://nuts-and-spices-dqzp.onrender.com'
            : ''
        );
        
        if (user && token) {
          const res = await fetch(BASE + '/api/orders/my-orders', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success && data.orders) {
            fetchedOrders = [...data.orders];
          }
        }
        setRealOrders(fetchedOrders.sort((a,b) => new Date(b.created_at||0) - new Date(a.created_at||0)));
      } catch (e) {
        console.error(e);
      }
    };
    fetchOrders();
  }, [user]);

  const myOrders = (realOrders || [])
    .filter(o => {
      const oPhone = (o.phone || (o.customer && o.customer.phone) || '').replace(/\D/g, '').slice(-10);
      const oEmail = (o.email || (o.customer && o.customer.email) || '').trim().toLowerCase();
      const userPhone = (user?.phone || '').replace(/\D/g, '').slice(-10);
      const userEmail = (user?.email || '').trim().toLowerCase();
      const isOwner = user ? ((userPhone && oPhone === userPhone) || (userEmail && oEmail === userEmail)) : false;

      // Only show orders where payment was completed (paid, refund_pending, refunded)
      const pStatus = String(o.payment_status || o.paymentStatus || '').toLowerCase();
      const oStatus = String(o.status || '').toLowerCase();
      const isPaid = ['paid', 'refund_pending', 'refunded'].includes(pStatus) || 
                     (!pStatus && !['pending', 'new', 'cancelled'].includes(oStatus));

      return isOwner && isPaid;
    })
    .sort((a, b) => {
      const da = a.timestamp || a.created_at || a.createdAt ? new Date(a.timestamp || a.created_at || a.createdAt).getTime() : 0;
      const db = b.timestamp || b.created_at || b.createdAt ? new Date(b.timestamp || b.created_at || b.createdAt).getTime() : 0;
      return db - da;
    });



  return (
    <div className="bg-[#FAF7F2]/40 min-h-screen py-4 sm:py-8 pb-32 sm:pb-16">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8">
        
        {cart.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center space-y-6 py-12 px-4 bg-white rounded-3xl border border-gray-200/80 shadow-sm mt-4">
            <div className="w-20 h-20 bg-emerald-50 text-[#128C7E] rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner border border-emerald-100">
              🛒
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black font-serif text-gray-900">Your Cart is Empty</h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                Looks like you haven't added any fresh gourmet dry fruits, nuts, or spices yet. Explore our harvest catalog!
              </p>
            </div>
            <button
              onClick={() => navigate('shop', { category: 'all' })}
              className="px-8 py-3.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold rounded-2xl transition-all shadow-md text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Shop Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Brand Header Banner */}
            <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-100 block">
                  Shopping Cart
                </span>
                <h1 className="text-xl sm:text-2xl font-black font-serif mt-0.5">
                  Your Basket ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </h1>
              </div>

              <button
                onClick={clearCart}
                className="text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/20 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Cart Item List */}
              <div className="lg:col-span-2 space-y-3.5">
                {cart.map((item) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <div
                      key={item.cartItemId}
                      className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-200/80 shrink-0 bg-[#F9FAFB]"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <span className="text-[9px] sm:text-[10px] font-bold text-[#128C7E] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 inline-block">
                            {item.categoryName || 'Gourmet'}
                          </span>
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug truncate font-serif">
                            {item.name}
                          </h3>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>Pack: <span className="font-bold text-gray-800">{item.weight}</span></span>
                            <span>•</span>
                            <span className="font-bold text-gray-900 font-mono">₹{item.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-gray-200 rounded-xl bg-[#F9FAFB] p-0.5 shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="w-7 h-7 rounded-lg bg-white font-bold text-sm text-gray-800 hover:bg-gray-100 flex items-center justify-center cursor-pointer border border-gray-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="w-7 h-7 rounded-lg bg-white font-bold text-sm text-gray-800 hover:bg-gray-100 flex items-center justify-center cursor-pointer border border-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Total & Delete */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-base font-black text-gray-900 font-mono">
                              ₹{lineTotal.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            title="Remove from Cart"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2">
                  <button
                    onClick={() => navigate('shop', { category: 'all' })}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#128C7E] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Continue Shopping</span>
                  </button>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200/80 shadow-md h-fit space-y-5">
                <h2 className="text-lg font-black font-serif text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-sans font-bold text-gray-500">
                    {cart.length} {cart.length === 1 ? 'item' : 'items'}
                  </span>
                </h2>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 text-xs font-medium uppercase tracking-wider bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#128C7E]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`text-[11px] font-semibold ${couponMessage.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                      {couponMessage.text}
                    </p>
                  )}
                </form>

                {/* Bill Details */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Total:</span>
                    <span className="font-bold text-gray-900 font-mono">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Discount ({appliedCoupon?.code}):</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="ml-1 text-gray-400 hover:text-red-600 cursor-pointer"
                          title="Remove coupon"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Packaging & Freshness Seals:</span>
                    <span className="font-bold text-emerald-700">FREE</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Doorstep Delivery:</span>
                    <span className={`font-bold font-mono ${deliveryCharge === 0 ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-black text-gray-900 block font-serif">Grand Total:</span>
                      {discountAmount > 0 && (
                        <span className="text-[10px] font-semibold text-emerald-700">
                          Total savings: ₹{discountAmount.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      {discountAmount > 0 && (
                        <span className="text-xs text-gray-400 line-through block font-medium font-mono">
                          ₹{cartTotal.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-2xl font-black text-gray-900 font-mono">
                        ₹{grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#128C7E] shrink-0" />
                  <span>100% Secure Checkout via UPI, NetBanking & Cards</span>
                </div>

                <button
                  onClick={() => {
                    if (!user) {
                      navigate('login');
                    } else {
                      navigate('checkout');
                    }
                  }}
                  className="w-full py-3.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Proceed to Checkout (₹{grandTotal.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* RECENT ORDERS SECTION */}
        {user && myOrders.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-gray-900">Your Recent Purchases</h2>
              <p className="text-xs text-gray-500 mt-0.5">Track the status of your confirmed orders.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {myOrders.map(order => (
                <div 
                  key={order.orderId || order.id} 
                  onClick={() => {
                    navigate('order-details', { order, orderId: order.orderId || order.id });
                  }}
                  className={`p-4 rounded-2xl border shadow-xs hover:shadow-md transition-all cursor-pointer ${
                    String(order.status || '').toLowerCase() === 'refunded' ? 'bg-red-50/90 border-red-300' : 
                    String(order.status || '').toLowerCase() === 'cancelled' ? 'bg-gray-50/90 border-gray-300' : 
                    'bg-white border-gray-200 hover:border-[#128C7E]'
                  }`}
                >
                  <div className="flex justify-between items-start border-b border-gray-100 pb-2.5">
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">Order ID</span>
                      <span className="text-sm font-bold text-gray-900">#{order.order_id || order.orderId || order.id}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">Date</span>
                      <span className="text-xs font-bold text-gray-700">
                        {order.created_at || order.createdAt || order.date
                          ? new Date(order.created_at || order.createdAt || order.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                          : (order.timestamp || 'Just now')}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 py-2">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Items Included
                    </div>
                    <div className="text-xs font-semibold text-gray-800 line-clamp-2">
                      {(() => {
                        let parsedItems = [];
                        try {
                          if (Array.isArray(order.items)) parsedItems = order.items;
                          else if (typeof order.items_json === 'string') parsedItems = JSON.parse(order.items_json);
                          else if (typeof order.items === 'string') parsedItems = JSON.parse(order.items);
                        } catch {}
                        return parsedItems.length > 0 
                          ? parsedItems.map(i => `${i.quantity || 1}x ${i.name || 'Gourmet Item'}`).join(', ') 
                          : 'Assorted Gourmet Products';
                      })()}
                    </div>
                  </div>
                  <div className="flex justify-between items-end pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        String(order.status || '').toLowerCase() === 'refunded' ? 'bg-red-600 text-white' :
                        String(order.status || '').toLowerCase() === 'cancelled' ? 'bg-gray-200 text-gray-700' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {(order.status || 'Processing')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Total</span>
                      <span className="text-sm font-black text-gray-900 font-mono">
                        ₹{Number(order.total_amount || order.totalAmount || order.total || order.subtotal || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
