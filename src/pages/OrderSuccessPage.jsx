import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Package, Truck, Home, ArrowRight, Copy } from 'lucide-react';
import { STORE_WHATSAPP_NUMBER } from '../data/products';
import { API_BASE_URL } from '../api/index';

export default function OrderSuccessPage() {
  const { lastOrder, getWhatsAppUrl, navigate, storeSettings, clearCart } = useCart();
  const [orderData, setOrderData] = useState(lastOrder || null);
  const [paymentStatus, setPaymentStatus] = useState('verifying');
  const [isCashfreeCallback, setIsCashfreeCallback] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlOrderId = urlParams.get('order_id');
    
    if (urlOrderId) {
      const isTrackingOnly = urlParams.get('track') === 'true';
      if (isTrackingOnly) {
        setPaymentStatus('success');
        setIsCashfreeCallback(false);
        // Only fetch order data
        fetch(API_BASE_URL + '/orders/' + urlOrderId, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('nuts_spices_auth_token') } })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.order) {
              const order = { ...data.order };
              if (typeof order.items === 'string') { try { order.items = JSON.parse(order.items); } catch(e){} }
              if (typeof order.customer === 'string') { try { order.customer = JSON.parse(order.customer); } catch(e){} }
              order.orderId = order.id || urlOrderId;
              setOrderData(order);
            }
          });
        return;
      }
      setIsCashfreeCallback(true);
      const token = localStorage.getItem('nuts_spices_auth_token');
      
      // 1. Verify Payment
      fetch(`${API_BASE_URL}/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId: urlOrderId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.isPaid) {
          setPaymentStatus('success');
          clearCart();
        } else {
          setPaymentStatus('failed');
        }
      })
      .catch(() => setPaymentStatus('failed'));

      // 2. Fetch Order Data to avoid white screen crash
      fetch(`${API_BASE_URL}/orders/${urlOrderId}`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.order) {
            // Parse items if it's a string
            const order = { ...data.order };
            if (typeof order.items === 'string') {
              try { order.items = JSON.parse(order.items); } catch(e) {}
            }
            if (typeof order.customer === 'string') {
               try { order.customer = JSON.parse(order.customer); } catch(e) {}
            } else if (!order.customer) {
               order.customer = { name: order.customerName, phone: order.phone, address: order.address, city: order.city, pincode: order.pincode };
            }
            order.orderId = order.id || urlOrderId;
            setOrderData(order);
          }
        });

    } else {
      setIsCashfreeCallback(false);
      setPaymentStatus('success');
    }
  }, []);

  if (isCashfreeCallback && paymentStatus === 'verifying') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#000000] animate-pulse">Verifying Payment with Cashfree...</h2>
        <div className="w-12 h-12 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (isCashfreeCallback && paymentStatus === 'failed') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500">
          <span className="text-4xl font-bold">!</span>
        </div>
        <h2 className="text-xl font-bold text-[#000000]">Payment Failed or Pending</h2>
        <p className="text-sm text-[#000000]">We could not verify your payment. If money was deducted, it will be refunded within 3-5 business days.</p>
        <button onClick={() => navigate('checkout')} className="px-6 py-2.5 bg-red-500 text-white font-bold text-xs rounded-xl">Try Again</button>
      </div>
    );
  }

  if (!orderData && !isCashfreeCallback) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#000000]">No recent order found</h2>
        <button onClick={() => navigate('home')} className="px-6 py-2.5 bg-[#25D366] text-white font-bold text-xs rounded-xl">Go to Home</button>
      </div>
    );
  }

  const activeWhatsAppNumber = storeSettings?.whatsappNumber || STORE_WHATSAPP_NUMBER;
  let whatsappUrl = `https://wa.me/${activeWhatsAppNumber}`;
  if (orderData) {
     try {
         whatsappUrl = getWhatsAppUrl(orderData);
     } catch (e) {
         console.error(e);
     }
  }

  // Tracking Status Logic (Flipkart Style)
  const currentStatus = orderData?.status || 'pending';
  const steps = [
    { id: 'pending', label: 'Order Confirmed', icon: Package, done: true },
    { id: 'processing', label: 'Packed', icon: Package, done: ['processing', 'shipped', 'delivered'].includes(currentStatus) },
    { id: 'shipped', label: 'Shipped', icon: Truck, done: ['shipped', 'delivered'].includes(currentStatus) },
    { id: 'delivered', label: 'Delivered', icon: Home, done: currentStatus === 'delivered' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      
      {/* Success Popup Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-4 border border-[#E5E7EB]">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-[#25D366] animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        {new URLSearchParams(window.location.search).get('track') === 'true' ? (
          <>
            <h1 className="text-3xl font-black font-serif text-[#000000]">Order Tracking</h1>
            <p className="text-[#8C7A6B]">View your order status below.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-black font-serif text-[#000000]">Payment Successful!</h1>
            <p className="text-[#8C7A6B]">Your order has been placed successfully.</p>
          </>
        )}
        
        {orderData && (
          <div className="inline-flex items-center gap-3 bg-[#F9FAFB] px-6 py-3 rounded-2xl border border-[#E5E7EB] mt-4">
            <span className="text-sm font-extrabold text-[#000000]">Order ID:</span>
            <span className="text-base font-black text-[#25D366]">#{orderData.orderId || orderData.id}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(orderData.orderId || orderData.id);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title="Copy Order ID"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-[#25D366]" /> : <Copy className="w-4 h-4 text-[#8C7A6B]" />}
            </button>
          </div>
        )}
      </div>

      {/* Flipkart Style Order Tracking */}
      {orderData && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#E5E7EB] space-y-6">
          <h2 className="text-lg font-black font-serif text-[#000000]">Order Tracking</h2>
          
          <div className="relative flex justify-between items-center px-2 sm:px-8 mt-8">
            {/* Connecting Line */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
            
            {steps.map((step, idx) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${step.done ? 'bg-[#25D366] text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400 border-2 border-white'}`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold ${step.done ? 'text-[#000000]' : 'text-gray-400'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#E5E7EB] text-center space-y-6">
        <div className="space-y-2">
          <h3 className="font-black text-[#000000] text-lg">Send details via WhatsApp</h3>
          <p className="text-xs text-[#8C7A6B]">Optional: You can send your order receipt to our WhatsApp support for faster updates.</p>
        </div>
        <button
          onClick={() => window.open(whatsappUrl, '_blank')}
          className="w-full sm:w-auto mx-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-green-200"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5 filter brightness-0 invert" />
          Message on WhatsApp
        </button>
      </div>

    </div>
  );
}
