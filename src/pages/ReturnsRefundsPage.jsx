import React from 'react';

export default function ReturnsRefundsPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* CENTERED PAGE HEADER MATCHING USER REFERENCE SCREENSHOT */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-[#000000] tracking-tight">
            Returns & Refunds
          </h1>
          <div className="w-16 h-1 bg-[#000000] mx-auto rounded-full" />
        </div>

        {/* MAIN DOCUMENT WHITE CARD CONTAINER */}
        <div className="bg-white p-8 sm:p-12 md:p-14 rounded-3xl sm:rounded-[36px] shadow-lg border border-[#E5E7EB] space-y-8 text-[#000000]">
          
          {/* CARD SUBTITLE */}
          <div className="border-b border-[#E5E7EB] pb-4">
            <h2 className="text-xl sm:text-2xl font-black font-serif text-[#000000]">
              Returns & Refunds Policy – HAJI NUTS & SPICES
            </h2>
          </div>

          {/* 1. RETURN ELIGIBILITY */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              1. Return Eligibility
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              Returns are accepted only for damaged, defective, or incorrect products received by the customer. Customers must report the issue within 24 hours of delivery with proper proof or images.
            </p>
          </div>

          {/* 2. NON-RETURNABLE ITEMS */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              2. Non-Returnable Items
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              Due to hygiene and food safety reasons, opened or used food products, including dates, nuts, chocolates, and snacks, cannot be returned or exchanged.
            </p>
          </div>

          {/* 3. REFUND PROCESS */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              3. Refund Process
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              Once the issue is verified and approved, refunds will be processed to the original payment method or provided as store credit, depending on the situation.
            </p>
          </div>

          {/* 4. REPLACEMENT SUPPORT */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              4. Replacement Support
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              If eligible, customers may receive a replacement product instead of a refund based on product availability.
            </p>
          </div>

          {/* 5. REFUND TIMELINE */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              5. Refund Timeline
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              Approved refunds are usually processed within 5–7 business days. Processing time may vary depending on the payment provider or bank.
            </p>
          </div>

          {/* CLOSING STATEMENT */}
          <div className="pt-6 border-t border-[#E5E7EB]">
            <p className="font-serif font-bold text-[#000000] text-xs sm:text-sm leading-relaxed">
              Customer satisfaction and product quality are always our priority.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
