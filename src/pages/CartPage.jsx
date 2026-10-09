import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, navigate, user, orders } = useCart();

  const myOrders = (orders || []).filter(o => 
    user && o.customer && (
      (user.phone && o.customer.phone === user.phone) || 
      (user.email && o.customer.email === user.email)
    )
  ).sort((a, b) => {
    const da = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const db = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return db - da;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {cart.length === 0 ? (
        <div className="max-w-4xl mx-auto text-center space-y-6 py-8">
          <div className="w-24 h-24 bg-[#F9FAFB] rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner border border-[#E5E7EB]">
            🛒
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black font-serif text-[#000000]">Your Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-[#8C7A6B]">
              Looks like you haven't added any premium nuts, spices, or dry fruits to your cart yet.
            </p>
          </div>
          <button
            onClick={() => navigate('shop', { category: 'all' })}
            className="px-8 py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-2xl transition-all shadow-lg text-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Shop Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#000000] uppercase tracking-widest block">
                Shopping Cart
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#000000]">
                Your Selected Items ({cart.length})
              </h1>
            </div>

            <button
              onClick={clearCart}
              className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Item List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const lineTotal = item.price * item.quantity;
                return (
                  <div
                    key={item.cartItemId}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover border border-[#E5E7EB] shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#000000] uppercase tracking-wider bg-[#F9FAFB] px-2 py-0.5 rounded border border-[#E5E7EB]">
                          {item.categoryName}
                        </span>
                        <h3 className="font-bold text-[#000000] text-base leading-snug">
                          {item.name}
                        </h3>
                        <div className="text-xs text-[#8C7A6B]">
                          Pack Size: <span className="font-bold text-[#000000]">{item.weight}</span>
                        </div>
                        <div className="text-xs font-bold text-[#000000]">
                          ₹{item.price} per unit
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F9FAFB]">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] p-1">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="w-7 h-7 rounded-lg bg-white font-bold text-sm text-[#000000] hover:bg-[#E5E7EB] flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#000000]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="w-7 h-7 rounded-lg bg-white font-bold text-sm text-[#000000] hover:bg-[#E5E7EB] flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total & Delete */}
                      <div className="text-right">
                        <div className="text-base font-black text-[#000000]">
                          ₹{lineTotal.toLocaleString('en-IN')}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-[11px] text-red-500 hover:underline font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => navigate('shop', { category: 'all' })}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#000000] hover:underline pt-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </button>
            </div>

            {/* Order Summary Box */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-lg h-fit space-y-6">
              <h2 className="text-lg font-black font-serif text-[#000000] border-b border-[#F9FAFB] pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#000000]">
                  <span>Items Total:</span>
                  <span className="font-bold text-[#000000]">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-[#000000]">
                  <span>Packaging & Freshness Seals:</span>
                  <span className="font-bold text-[#000000]">FREE</span>
                </div>

                <div className="flex justify-between text-[#000000]">
                  <span>Doorstep Delivery Charges:</span>
                  <span className="font-bold text-[#000000]">FREE</span>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-baseline">
                  <span className="text-sm font-black text-[#000000]">Grand Total:</span>
                  <span className="text-2xl font-black text-[#000000]">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB] text-[11px] text-[#000000] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#25D366] shrink-0" />
                <span>No advance payment needed. Confirm delivery address on next screen.</span>
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    navigate('login');
                  } else {
                    navigate('checkout');
                  }
                }}
                className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* RECENT ORDERS SECTION */}
      {user && myOrders.length > 0 && (
        <div className="space-y-6 pt-10 mt-10 border-t-2 border-[#F9FAFB]">
          <div>
            <h2 className="text-2xl font-black font-serif text-[#000000]">Your Recent Orders</h2>
            <p className="text-xs text-[#8C7A6B] mt-1">Track the status of your previous purchases.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myOrders.map(order => (
              <div key={order.orderId} className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start border-b border-[#F9FAFB] pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#000000] uppercase tracking-wider block">Order ID</span>
                    <span className="text-sm font-bold text-[#000000]">#{order.orderId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-[#000000] uppercase tracking-wider block">Date</span>
                    <span className="text-sm font-bold text-[#000000]">{order.timestamp || 'Just now'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider">
                    Items Included
                  </div>
                  <div className="text-xs font-semibold text-[#000000] line-clamp-2">
                    {order.items && order.items.length > 0 
                      ? order.items.map(i => `${i.quantity}x ${i.name}`).join(', ') 
                      : 'Assorted Gourmet Products'}
                  </div>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-[#F9FAFB]">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#000000] uppercase tracking-wider block mb-1">Status</span>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {(order.status || 'Processing')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-[#000000] uppercase tracking-wider block">Total Amount</span>
                    <span className="text-base font-black text-[#000000]">
                      ₹{order.total ? order.total.toLocaleString('en-IN') : 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
