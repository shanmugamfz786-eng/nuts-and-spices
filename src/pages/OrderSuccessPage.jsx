import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, MessageSquare, ArrowRight, ShoppingBag, Copy, Check } from 'lucide-react';
import { STORE_WHATSAPP_NUMBER } from '../data/products';

export default function OrderSuccessPage() {
  const { lastOrder, getWhatsAppUrl, navigate, storeSettings } = useCart();
  const [copied, setCopied] = React.useState(false);

  if (!lastOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#2B1509]">No recent order found</h2>
        <button
          onClick={() => navigate('home')}
          className="px-6 py-2.5 bg-[#8B3A13] text-white font-bold text-xs rounded-xl"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const whatsappUrl = getWhatsAppUrl(lastOrder);

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      
      {/* Success Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-[#8B3A13] animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Order Saved Successfully
          </span>
          <h1 className="text-3xl font-black font-serif text-[#2B1509]">
            Order #{lastOrder.orderId} Created!
          </h1>
          <p className="text-xs sm:text-sm text-[#4A3525] max-w-md mx-auto">
            Click the WhatsApp button below to automatically launch WhatsApp and send your order directly to our store.
          </p>
        </div>

        {/* Primary WhatsApp Action CTA (Warm Gold Gourmet Tone - ZERO GREEN) */}
        <div className="pt-4">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-[#B8860B] text-white font-extrabold text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
          >
            <MessageSquare className="w-6 h-6 fill-current" />
            <span>SEND ORDER VIA WHATSAPP NOW</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Message Preview Box (Clean Warm Ivory Card - ZERO DARK SHADES) */}
      <div className="bg-[#FAF5EF] text-[#4A3525] p-6 rounded-3xl border border-[#E6D7C3] space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E6D7C3] pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#8B3A13]" />
            <span className="text-xs font-bold text-[#8B3A13] uppercase tracking-wider">
              WhatsApp Message Preview Payload
            </span>
          </div>
          <span className="text-[10px] text-[#8C7A6B]">Target: +{storeSettings?.whatsappNumber || '919876543210'}</span>
        </div>

        <div className="bg-white p-4 rounded-xl font-mono text-xs text-[#4A3525] leading-relaxed whitespace-pre-line border border-[#E6D7C3] shadow-2xs">
          🛒 *NUTS & SPICES - NEW ORDER*{'\n'}
          🆔 *Order ID:* #{lastOrder.orderId}{'\n'}
          ------------------------------------{'\n'}
          👤 *Customer:* {lastOrder.customer.name}{'\n'}
          📞 *Phone:* {lastOrder.customer.phone}{'\n'}
          📍 *Address:* {lastOrder.customer.address}, {lastOrder.customer.city} - {lastOrder.customer.pincode}{'\n'}
          {lastOrder.customer.notes ? `📝 *Notes:* ${lastOrder.customer.notes}\n` : ''}
          ------------------------------------{'\n'}
          📦 *Items Ordered:*{'\n'}
          {lastOrder.items.map((item, idx) => (
            `${idx + 1}. ${item.name} (${item.weight}) x ${item.quantity} = ₹${item.price * item.quantity}\n`
          ))}
          ------------------------------------{'\n'}
          💰 *Total Amount:* ₹{lastOrder.total.toLocaleString('en-IN')}{'\n'}
          ------------------------------------{'\n'}
          Thank you! Please confirm order & delivery timeline.
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#E6D7C3] shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#2B1509] uppercase tracking-wider border-b border-[#FAF5EF] pb-2">
          Recipient Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#4A3525]">
          <div>
            <span className="text-[#8C7A6B] block">Name:</span>
            <span className="font-bold text-[#2B1509]">{lastOrder.customer.name}</span>
          </div>
          <div>
            <span className="text-[#8C7A6B] block">Phone:</span>
            <span className="font-bold text-[#2B1509]">{lastOrder.customer.phone}</span>
          </div>
          <div>
            <span className="text-[#8C7A6B] block">Delivery Address:</span>
            <span className="font-bold text-[#2B1509]">{lastOrder.customer.address}, {lastOrder.customer.city} - {lastOrder.customer.pincode}</span>
          </div>
          <div>
            <span className="text-[#8C7A6B] block">Order Date:</span>
            <span className="font-bold text-[#2B1509]">{lastOrder.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Back to Home CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#8B3A13] hover:underline"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Return to Store Front</span>
        </button>
      </div>

    </div>
  );
}
