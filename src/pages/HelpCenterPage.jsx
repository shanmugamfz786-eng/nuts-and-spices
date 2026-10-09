import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { HelpCircle, Phone, MessageSquare, Truck, ShieldCheck, ChevronDown, ArrowLeft } from 'lucide-react';

export default function HelpCenterPage() {
  const { navigate, activeWhatsAppNumber } = useCart();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How do I place an order on NUTS & SPICES?",
      answer: "Browsing and placing an order is super simple! Select your desired items and pack weights, click 'Add to Cart', and proceed to Checkout. When you click 'Place Order', your order summary is formatted and automatically sent via WhatsApp directly to our support team for instant confirmation!"
    },
    {
      question: "What are the shipping charges and delivery timelines?",
      answer: "We offer FREE SHIPPING across India on all orders above ₹3500. Standard delivery typically takes 2-5 business days depending on your location. Metro cities receive delivery within 48 hours."
    },
    {
      question: "Are your products 100% natural and preservative-free?",
      answer: "Yes! All our dates, nuts, dry fruits, spices, and wellness malts are sourced directly from trusted estate farms and tested for zero added preservatives, artificial colors, or chemicals."
    },
    {
      question: "How do I place bulk or corporate gifting orders?",
      answer: "We offer customized hampers and bulk discounts for weddings, festive occasions, and corporate gifting. Please visit our 'Bulk Orders' section or contact our sales team directly on WhatsApp!"
    },
    {
      question: "What payment methods do you accept?",
      answer: "Since orders are placed via WhatsApp, we support UPI (GPay, PhonePe, Paytm), Net Banking, and Bank Transfer upon order confirmation."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleWhatsAppHelp = () => {
    const msg = encodeURIComponent("Hello! I need help with my order on NUTS & SPICES.");
    window.open(`https://wa.me/${activeWhatsAppNumber || '919876543210'}?text=${msg}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen pb-16 space-y-12">
      
      {/* PAGE HEADER BANNER (Warm Spice Gradient - ZERO DARK SHADES) */}
      <section className="relative bg-gradient-to-br from-[#000000] via-[#000000] to-[#222222] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl border-b border-[#000000]/30">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[#F9FAFB] text-[11px] font-extrabold uppercase tracking-wider border border-white/25">
                <HelpCircle className="w-3.5 h-3.5 text-[#000000]" />
                <span>Customer Care & Support</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-wide uppercase">
                Help Center
              </h1>
              <p className="text-xs sm:text-sm text-[#F9FAFB] leading-relaxed font-serif">
                Have questions about ordering, shipping, payments, or product freshness? We're here 24/7 to assist you.
              </p>
            </div>

            <button
              onClick={handleWhatsAppHelp}
              className="px-6 py-3 bg-[#000000] hover:bg-[#222222] text-white font-extrabold text-xs rounded-2xl shadow-xl flex items-center gap-2.5 transition-transform hover:scale-105 shrink-0 cursor-pointer border border-white/20"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Chat with Support on WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* QUICK HELP CARDS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-[#E5E7EB] space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#000000] text-[#000000] flex items-center justify-center mx-auto shadow-md">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold font-serif text-[#000000] text-lg">Shipping & Delivery</h3>
            <p className="text-xs text-[#8C7A6B] leading-relaxed">
              Free nationwide delivery on orders over ₹3500. Track your shipment live via WhatsApp updates.
            </p>
          </div>

          <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-[#E5E7EB] space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#000000] text-[#000000] flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold font-serif text-[#000000] text-lg">Freshness Guarantee</h3>
            <p className="text-xs text-[#8C7A6B] leading-relaxed">
              100% money-back freshness guarantee on all natural dates, nuts, seeds, and gourmet blends.
            </p>
          </div>

          <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-[#E5E7EB] space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#000000] text-[#000000] flex items-center justify-center mx-auto shadow-md">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold font-serif text-[#000000] text-lg">Direct Phone Support</h3>
            <p className="text-xs text-[#8C7A6B] leading-relaxed">
              Reach our customer support team directly at +91 {activeWhatsAppNumber || '9876543210'} for any queries.
            </p>
          </div>

        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#000000]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#8C7A6B]">
              Find answers to the most common questions regarding your shopping experience.
            </p>
          </div>

          <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-3xl overflow-hidden bg-white shadow-sm">
            {faqs.map((faq, index) => (
              <div key={index} className="transition-colors">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#000000] hover:bg-[#F9FAFB] cursor-pointer"
                >
                  <span className="font-serif">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#000000] shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#8C7A6B] leading-relaxed bg-[#F9FAFB]/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}
