import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, User, Phone, MapPin, Building, Hash, FileText, ShoppingBag, Send, CreditCard } from 'lucide-react';
import { load } from '@cashfreepayments/cashfree-js';

export default function CheckoutPage() {
  const { cart, cartTotal, createNewOrder, clearCart, navigate, user } = useCart();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    pincode: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-[#F9FAFB] border border-[#000000] text-[#000000] rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-inner">
          🔒
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black font-serif text-[#000000]">Login Required for Checkout</h2>
          <p className="text-xs sm:text-sm text-[#8C7A6B]">
            Please log in to your account or register to complete your customer details & shipping address and place your order.
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('login')}
            className="px-8 py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md uppercase tracking-wider cursor-pointer"
          >
            LOGIN NOW
          </button>
          <button
            onClick={() => navigate('register')}
            className="px-8 py-3.5 bg-white border border-[#000000] text-[#000000] font-extrabold text-xs rounded-2xl transition-all uppercase tracking-wider cursor-pointer"
          >
            REGISTER
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#000000]">No active items to checkout</h2>
        <button
          onClick={() => navigate('shop')}
          className="px-6 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs rounded-xl transition-all"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full Name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Valid 10-digit mobile number required';
    if (!formData.address.trim()) errs.address = 'Delivery address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.length < 6) errs.pincode = 'Valid 6-digit pincode required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsProcessingPayment(true);
    
    try {
      const orderId = 'NS_' + Math.floor(100000 + Math.random() * 900000).toString();
      const token = localStorage.getItem('nuts_spices_auth_token');
      
      const response = await fetch((import.meta.env.VITE_API_BASE_URL || '') + '/api/payment/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: backendOrderId, amount: backendTotal,
          customerPhone: formData.phone,
          customerEmail: user?.email || 'guest@nutsandspices.in',
          customerName: formData.name
        })
      });

      const data = await response.json();

      if (data.success && data.paymentSessionId) {
        const cashfree = await load({
          mode: 'production' // or 'sandbox'
        });

        const checkoutOptions = {
          paymentSessionId: data.paymentSessionId,
          redirectTarget: '_self' // redirect to return_url configured in backend
        };

        // Also create the order in DB so it's pending while payment happens
        const orderDetails = {
          orderId,
          customer: formData,
          items: cart,
          total: cartTotal,
          status: 'pending', // Pending payment
          timestamp: new Date().toLocaleString()
        };
        const orderRes = await fetch((import.meta.env.VITE_API_BASE_URL || '') + '/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer: formData, items: cart, notes: formData.notes }) }); const orderData = await orderRes.json(); if (!orderData.success) { alert(orderData.message); setIsProcessingPayment(false); return; } const backendOrderId = orderData.order.id; const backendTotal = orderData.order.totalAmount;
        clearCart();

        alert('Backend success! Redirecting to Cashfree...'); cashfree.checkout(checkoutOptions); alert('Cashfree checkout function called!');
      } else {
        alert('Failed to initialize payment: ' + (data.message || 'Unknown error'));
        setIsProcessingPayment(false);
      }
    } catch (err) {
      console.error('Payment initialization error', err);
      alert('Error initiating payment. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <button
          onClick={() => navigate('cart')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#000000] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#000000]">
          Customer Details & Shipping
        </h1>
        <p className="text-xs text-[#8C7A6B]">
          Please enter your delivery details. Next step will format your order for direct WhatsApp submission.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-md">
          <h2 className="text-lg font-black font-serif text-[#000000] border-b border-[#F9FAFB] pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-[#25D366]" />
            <span>Delivery Recipient Info</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2.5 text-xs font-medium text-[#000000] bg-[#F9FAFB] rounded-xl border outline-none ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB] focus:border-[#000000]'
                  }`}
                />
              </div>
              {errors.name && <p className="text-[11px] text-red-500 font-semibold">{errors.name}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                WhatsApp Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2.5 text-xs font-medium text-[#000000] bg-[#F9FAFB] rounded-xl border outline-none ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB] focus:border-[#000000]'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-red-500 font-semibold">{errors.phone}</p>}
            </div>

          </div>

          {/* Delivery Address */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
              Complete Delivery Address (Door No, Street, Area) *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#8C7A6B]" />
              <textarea
                rows={3}
                placeholder="e.g. Flat 302, Green Avenue, Main Road, T. Nagar"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full pl-9 pr-3 py-2.5 text-xs font-medium text-[#000000] bg-[#F9FAFB] rounded-xl border outline-none ${
                  errors.address ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB] focus:border-[#000000]'
                }`}
              />
            </div>
            {errors.address && <p className="text-[11px] text-red-500 font-semibold">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* City */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                City / Town *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                <input
                  type="text"
                  placeholder="e.g. Chennai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2.5 text-xs font-medium text-[#000000] bg-[#F9FAFB] rounded-xl border outline-none ${
                    errors.city ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB] focus:border-[#000000]'
                  }`}
                />
              </div>
              {errors.city && <p className="text-[11px] text-red-500 font-semibold">{errors.city}</p>}
            </div>

            {/* Pincode */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                Pincode *
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                <input
                  type="text"
                  placeholder="e.g. 600017"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2.5 text-xs font-medium text-[#000000] bg-[#F9FAFB] rounded-xl border outline-none ${
                    errors.pincode ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB] focus:border-[#000000]'
                  }`}
                />
              </div>
              {errors.pincode && <p className="text-[11px] text-red-500 font-semibold">{errors.pincode}</p>}
            </div>

          </div>

          {/* Delivery Notes */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
              Special Delivery Instructions (Optional)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3 top-3 text-[#8C7A6B]" />
              <input
                type="text"
                placeholder="e.g. Leave package with security if unavailable"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-medium text-[#000000] bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] outline-none focus:border-[#000000]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessingPayment}
            className={`w-full py-4 text-white font-bold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${
              isProcessingPayment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#25D366] hover:bg-[#128C7E]'
            }`}
          >
            {isProcessingPayment ? (
              <span className="animate-pulse">Processing Payment...</span>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{cartTotal.toLocaleString('en-IN')} Securely</span>
              </>
            )}
          </button>
        </form>

        {/* Mini Cart Review */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-md h-fit space-y-4">
          <h3 className="text-base font-black font-serif text-[#000000] border-b border-[#F9FAFB] pb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#25D366]" />
            <span>Order Summary ({cart.length} items)</span>
          </h3>

          <div className="divide-y divide-[#F9FAFB] max-h-72 overflow-y-auto pr-1 space-y-2">
            {cart.map(item => (
              <div key={item.cartItemId} className="pt-2 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#000000]">{item.name}</p>
                  <span className="text-[10px] text-[#8C7A6B]">{item.weight} x {item.quantity}</span>
                </div>
                <span className="font-extrabold text-[#000000]">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-base font-black">
            <span className="text-[#000000]">Total Amount:</span>
            <span className="text-[#000000]">₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
