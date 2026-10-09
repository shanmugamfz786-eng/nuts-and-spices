import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, MapPin, Phone, MessageSquare, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { STORE_WHATSAPP_NUMBER } from '../data/products';

export default function ContactPage() {
  const { navigate, storeSettings } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('home')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#000000] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>

      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#25D366] via-[#128C7E] to-[#075E54] text-white p-8 sm:p-14 rounded-3xl space-y-3 relative overflow-hidden border border-[#128C7E] shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#000000]/25 rounded-full blur-3xl pointer-events-none" />

        <h1 className="text-3xl sm:text-5xl font-black font-serif text-white">
          Get In Touch
        </h1>
        <p className="text-xs sm:text-base text-[#E5E7EB] max-w-xl">
          Have a question about our products, custom bulk orders, or corporate gifting? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Business Details & Hours */}
        <div className="lg:col-span-5 space-y-8 bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm">
          
          <h2 className="text-2xl font-black font-serif text-[#000000] border-b border-[#F9FAFB] pb-3">
            Contact Information
          </h2>

          <div className="space-y-6 text-xs sm:text-sm text-[#000000]">
            
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F9FAFB] text-[#000000] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-[#000000] block uppercase tracking-wider text-[11px] mb-0.5">
                  📍 Address
                </span>
                <p className="text-[#000000] font-medium leading-relaxed">
                  {storeSettings?.address || '124, Gourmet Spice Market Road, T. Nagar, Chennai - 600017, Tamil Nadu, India'}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F9FAFB] text-[#000000] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-[#000000] block uppercase tracking-wider text-[11px] mb-0.5">
                  📞 Phone
                </span>
                <p className="text-[#000000] font-bold">
                  {storeSettings?.phone || '+91 98765 43210'}
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#000000] flex items-center justify-center shrink-0 border border-amber-200">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-[#000000] block uppercase tracking-wider text-[11px] mb-0.5">
                  💬 WhatsApp
                </span>
                <a
                  href={`https://wa.me/${storeSettings?.whatsappNumber || '919876543210'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000000] font-bold hover:underline"
                >
                  +{storeSettings?.whatsappNumber || '919876543210'} (Instant Chat)
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F9FAFB] text-[#000000] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-[#000000] block uppercase tracking-wider text-[11px] mb-0.5">
                  📧 Email
                </span>
                <p className="text-[#000000] font-bold">
                  {storeSettings?.email || 'orders@nutsandspices.store'}
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-4 pt-4 border-t border-[#F9FAFB]">
              <div className="w-10 h-10 rounded-2xl bg-[#F9FAFB] text-[#000000] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-[#000000] block uppercase tracking-wider text-[11px] mb-0.5">
                  Business Hours
                </span>
                <p className="text-[#000000] font-bold">
                  Monday – Saturday
                </p>
                <p className="text-xs text-[#8C7A6B]">
                  9:00 AM – 7:00 PM
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-6">
          <h2 className="text-2xl font-black font-serif text-[#000000] border-b border-[#F9FAFB] pb-3">
            Contact Form
          </h2>

          {submitted ? (
            <div className="p-8 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#25D366] mx-auto" />
              <h3 className="text-lg font-bold text-[#000000]">Message Sent Successfully!</h3>
              <p className="text-xs text-[#000000]">
                Thank you for contacting NUTS & SPICES. Our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F9FAFB] text-xs font-medium text-[#000000] rounded-xl border border-[#E5E7EB] outline-none focus:border-[#000000]"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F9FAFB] text-xs font-medium text-[#000000] rounded-xl border border-[#E5E7EB] outline-none focus:border-[#000000]"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter mobile phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F9FAFB] text-xs font-medium text-[#000000] rounded-xl border border-[#E5E7EB] outline-none focus:border-[#000000]"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your message or inquiry here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F9FAFB] text-xs font-medium text-[#000000] rounded-xl border border-[#E5E7EB] outline-none focus:border-[#000000]"
                />
              </div>

              {/* Send Message Button */}
              <button
                type="submit"
                className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
