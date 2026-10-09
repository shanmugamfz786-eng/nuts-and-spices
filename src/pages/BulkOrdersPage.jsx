import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Package, MessageSquare, Gift, CheckCircle2, ArrowLeft, Send } from 'lucide-react';

export default function BulkOrdersPage() {
  const { navigate, activeWhatsAppNumber } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [quantity, setQuantity] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    const msg = `📦 *NUTS & SPICES - BULK / CORPORATE ORDER INQUIRY*\n` +
                `👤 Name: ${name}\n` +
                `📞 Phone: ${phone}\n` +
                `🏢 Company / Event: ${company || 'N/A'}\n` +
                `📊 Quantity Needed: ${quantity || 'N/A'}\n` +
                `📝 Details: ${details || 'N/A'}`;

    const waUrl = `https://wa.me/${activeWhatsAppNumber || '919876543210'}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen pb-16 space-y-12">
      
      {/* PAGE HEADER BANNER */}
      <section className="relative bg-gradient-to-br from-[#000000] via-[#000000] to-[#222222] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl border-b border-[#000000]/40">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-[#E5E7EB] hover:text-white text-xs font-bold transition-all border border-white/15 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#000000] text-[#000000] text-[11px] font-extrabold uppercase tracking-wider border border-[#000000]/40">
                <Package className="w-3.5 h-3.5 text-[#000000]" />
                <span>Wholesale & Corporate Gifting</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-wide uppercase">
                Bulk Orders
              </h1>
              <p className="text-xs sm:text-sm text-[#E5E7EB] leading-relaxed font-serif">
                Special wholesale pricing and luxury customized gift hampers for corporate events, weddings, and festive celebrations.
              </p>
            </div>

            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-[#000000]/15 border-2 border-[#000000]/40 flex items-center justify-center shrink-0 shadow-2xl backdrop-blur-md">
              <Gift className="w-12 h-12 sm:w-16 sm:h-16 text-[#000000]" />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* WHY CHOOSE US FOR BULK */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-[#E5E7EB] space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#000000] text-white font-black flex items-center justify-center mx-auto text-sm">
              %
            </div>
            <h3 className="font-bold font-serif text-[#000000] text-base">Wholesale Pricing</h3>
            <p className="text-xs text-[#8C7A6B]">
              Direct farm-to-table discounts on orders exceeding 10kg or 25+ gift hampers.
            </p>
          </div>

          <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-[#E5E7EB] space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#000000] text-white font-black flex items-center justify-center mx-auto text-sm">
              🎁
            </div>
            <h3 className="font-bold font-serif text-[#000000] text-base">Custom Branding</h3>
            <p className="text-xs text-[#8C7A6B]">
              Custom corporate logo branding, personalized gift cards, and premium box packaging.
            </p>
          </div>

          <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-[#E5E7EB] space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#000000] text-white font-black flex items-center justify-center mx-auto text-sm">
              🚀
            </div>
            <h3 className="font-bold font-serif text-[#000000] text-base">Fast PAN-India Express</h3>
            <p className="text-xs text-[#8C7A6B]">
              Pan-India logistics delivery ensuring 100% fresh delivery right to your office or venue.
            </p>
          </div>
        </div>

        {/* BULK ORDER INQUIRY FORM */}
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-[#E5E7EB] shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black font-serif text-[#000000]">
              Request Bulk Order Quotation
            </h2>
            <p className="text-xs text-[#8C7A6B]">
              Fill in your details below to receive an instant wholesale quote via WhatsApp.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-3 bg-[#F9FAFB] rounded-2xl border border-amber-200">
              <CheckCircle2 className="w-12 h-12 text-[#000000] mx-auto" />
              <h3 className="text-lg font-bold text-[#000000]">Inquiry Sent Successfully!</h3>
              <p className="text-xs text-[#8C7A6B]">Our bulk sales representative will get in touch with you shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-[#000000] text-white text-xs font-bold rounded-xl"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#000000] mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] text-xs font-medium text-[#000000] rounded-xl border border-[#E5E7EB] outline-none focus:border-[#000000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#000000] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 bg-[#F9FAFB] text-xs font-medium text-[#000000] rounded-xl border border-[#E5E7EB] outline-none focus:border-[#000000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#000000] mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Tech Solutions"
                    className="w-full px-4 py-2.5 bg-[#F9FAFB] text-xs font-medium text-[#000000] rounded-xl border border-[#E5E7EB] outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#000000] mb-1">Estimated Quantity / Boxes</label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 50 Gift Hampers or 25kg Almonds"
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] text-xs font-medium text-[#000000] rounded-xl border border-[#E5E7EB] outline-none focus:border-[#000000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#000000] mb-1">Additional Requirements / Notes</label>
                <textarea
                  rows="3"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Mention custom packaging preferences, budget range, or delivery date..."
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] text-xs font-medium text-[#000000] rounded-xl border border-[#E5E7EB] outline-none focus:border-[#000000]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#000000] hover:bg-[#000000] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 tracking-wider uppercase transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Submit Bulk Inquiry via WhatsApp</span>
              </button>
            </form>
          )}

        </div>

      </main>

    </div>
  );
}
