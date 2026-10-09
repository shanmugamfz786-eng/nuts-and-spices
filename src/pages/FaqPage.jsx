import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 1,
    question: "1. How do I track my order?",
    answer: "Once your order is shipped, tracking details will be shared through the provided contact information whenever available."
  },
  {
    id: 2,
    question: "2. Are your products fresh and high quality?",
    answer: "Yes, we carefully source and supply premium quality dates, nuts, imported chocolates, and snacks to ensure freshness and customer satisfaction."
  },
  {
    id: 3,
    question: "3. Do you offer delivery across India?",
    answer: "Yes, we provide delivery services across India based on courier availability and serviceable locations."
  },
  {
    id: 4,
    question: "4. How can I track my order?",
    answer: "Once your order is shipped, tracking details will be shared through the provided contact information whenever available."
  },
  {
    id: 5,
    question: "5. What should I do if I receive a damaged or wrong product?",
    answer: "If you receive a damaged or incorrect item, please contact us within 24 hours of delivery with product photos for quick support and resolution."
  },
  {
    id: 6,
    question: "6. What payment methods do you accept?",
    answer: "We support Direct WhatsApp ordering, Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), and major Credit/Debit Cards for a smooth checkout."
  },
  {
    id: 7,
    question: "7. How can I place a bulk or corporate gifting order?",
    answer: "You can visit our dedicated Bulk Orders page or contact our customer support directly via WhatsApp for custom festival hampers and bulk discounts."
  }
];

export default function FaqPage() {
  // Default first FAQ item open matching screenshot 1
  const [openId, setOpenId] = useState(1);

  const toggleFaq = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* CENTERED PAGE HEADER MATCHING USER REFERENCE SCREENSHOTS */}
        <div className="text-center space-y-2">
          <span className="text-xs sm:text-sm font-extrabold text-[#000000] uppercase tracking-widest font-serif block">
            Help Center
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-[#000000] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#8C7A6B] font-medium pt-1">
            Find answers to common questions about our products and services.
          </p>
        </div>

        {/* ACCORDION FAQ ITEMS LIST */}
        <div className="space-y-4 pt-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'border-[#000000]/60 shadow-md ring-1 ring-[#000000]/20' 
                    : 'border-[#E5E7EB] shadow-xs hover:border-[#000000]/40'
                }`}
              >
                {/* QUESTION ACCORDION HEADER */}
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isOpen 
                        ? 'bg-[#000000] text-[#F9FAFB]' 
                        : 'bg-[#F9FAFB] text-[#000000] border border-[#E5E7EB]'
                    }`}>
                      <HelpCircle className="w-4.5 h-4.5" />
                    </div>
                    
                    <h3 className="text-sm sm:text-base font-bold font-serif text-[#000000] leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  <div className="text-[#8C7A6B] shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#000000]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#8C7A6B]" />
                    )}
                  </div>
                </button>

                {/* ANSWER EXPANDED PANEL */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1">
                    <div className="p-4 bg-[#F9FAFB]/70 rounded-xl border border-[#E5E7EB]/50 text-xs sm:text-sm text-[#000000] leading-relaxed font-serif">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
