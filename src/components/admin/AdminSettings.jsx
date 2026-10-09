import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  Settings, Save, Phone, MessageSquare, 
  Truck, Share2, CheckCircle 
} from 'lucide-react';

export default function AdminSettings() {
  const { storeSettings, updateStoreSettings } = useCart();
  const [formData, setFormData] = useState({ ...storeSettings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStoreSettings(formData);
    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#075E54] p-6 rounded-2xl text-white shadow-md">
        <div>
          <h2 className="text-2xl font-black font-serif text-white tracking-wide flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#F9FAFB]" />
            ⚙️ ADMIN — STORE SETTINGS
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            Configure global store parameters, live WhatsApp order contact, delivery rates, and store address.
          </p>
        </div>
      </div>

      {isSaved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2314]/35 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">Settings Saved!</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              All storefront links and WhatsApp numbers have been updated. The changes are now live on the user pages.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsSaved(false)}
                className="w-full px-5 py-2.5 bg-[#25D366] hover:bg-[#25D366] text-[#000000] font-extrabold rounded-xl transition-all cursor-pointer shadow-md text-sm"
              >
                OK, Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: STORE IDENTITY & WHATSAPP CONFIG */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-[#E5E7EB] flex items-center justify-between">
            <h3 className="text-base font-black font-serif text-[#000000] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#000000]" />
              Store Identity & WhatsApp Connection
            </h3>
            <span className="text-[10px] bg-amber-100 text-[#000000] px-2.5 py-1 rounded-full font-extrabold border border-amber-200 uppercase">
              Dynamic Live Sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Store Name */}
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Store Name *</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-3 text-gray-900 outline-none font-bold"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block font-bold uppercase text-[#000000] mb-1">WhatsApp Order Number *</label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-[#000000] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="919876543210"
                  className="w-full bg-[#F9FAFB]/50 border border-amber-300 focus:border-[#000000] rounded-xl p-3 pl-10 text-gray-900 outline-none font-mono font-bold"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Include country code without '+' (e.g. <code>919876543210</code>). All checkout orders direct here!
              </p>
            </div>

            {/* Logo URL */}
            <div className="sm:col-span-2">
              <label className="block font-bold uppercase text-gray-700 mb-1">Logo Image URL</label>
              <input
                type="text"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-3 text-gray-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACT & ADDRESS */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-black font-serif text-[#000000] pb-3 border-b border-[#E5E7EB] flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#000000]" />
            Contact & Location Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Phone */}
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Support Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-3 text-gray-900 outline-none font-bold"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Store Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-3 text-gray-900 outline-none font-bold"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block font-bold uppercase text-gray-700 mb-1">Store Full Address</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-3 text-gray-900 outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: DELIVERY & SHIPPING CONFIG */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-black font-serif text-[#000000] pb-3 border-b border-[#E5E7EB] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#000000]" />
            Delivery Rates & Free Shipping Minimums
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Delivery Charge */}
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.deliveryCharge}
                onChange={(e) => setFormData({ ...formData, deliveryCharge: Number(e.target.value) })}
                className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-3 text-gray-900 font-serif font-bold text-sm outline-none"
              />
            </div>

            {/* Minimum Order Amount for Free Delivery */}
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-3 text-gray-900 font-serif font-bold text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: SOCIAL MEDIA */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-black font-serif text-[#000000] pb-3 border-b border-[#E5E7EB] flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#000000]" />
            Social Media Handles & Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Instagram Profile URL</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-3 text-gray-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-gray-700 mb-1">Facebook Page URL</label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="w-full bg-[#F9FAFB]/50 border border-[#E5E7EB] focus:border-[#000000] rounded-xl p-3 text-gray-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>Save & Apply Store Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}
