import React from 'react';

export default function ShippingPolicyPage() {

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* CENTERED PAGE HEADER MATCHING USER REFERENCE SCREENSHOT */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-[#000000] tracking-tight">
            Shipping Policy
          </h1>
          <div className="w-16 h-1 bg-[#000000] mx-auto rounded-full" />
        </div>

        {/* MAIN DOCUMENT WHITE CARD CONTAINER */}
        <div className="bg-white p-8 sm:p-12 md:p-14 rounded-3xl sm:rounded-[36px] shadow-lg border border-[#E5E7EB] space-y-8 text-[#000000]">
          
          {/* CARD SUBTITLE */}
          <div className="border-b border-[#E5E7EB] pb-4">
            <h2 className="text-xl sm:text-2xl font-black font-serif text-[#000000]">
              Shipping Policy – HAJI NUTS & SPICES
            </h2>
          </div>

          {/* 1. ORDER PROCESSING */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              1. Order Processing
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              All orders are processed within 1–3 business days after confirmation. Orders placed on weekends or holidays will be processed on the next working day.
            </p>
          </div>

          {/* 2. DELIVERY TIME */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              2. Delivery Time
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              Estimated delivery time may vary depending on the customer's location and courier availability. Most orders are delivered within 3–7 business days across India.
            </p>
          </div>

          {/* 3. SHIPPING CHARGES */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              3. Shipping Charges
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              Shipping charges, if applicable, will be displayed during checkout based on the order value, weight, and delivery location. Free shipping is available on orders above ₹3500.
            </p>
          </div>

          {/* 4. SAFE PACKAGING */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              4. Safe Packaging
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              We ensure all products are packed carefully and hygienically to maintain freshness, quality, and safe delivery during transit.
            </p>
          </div>

          {/* 5. DELIVERY SUPPORT */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              5. Delivery Support
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              Customers will receive order updates and tracking details whenever available. For delivery-related support, customers can contact our support team for assistance.
            </p>
          </div>

          {/* CLOSING COMMITMENT STATEMENT */}
          <div className="pt-6 border-t border-[#E5E7EB]">
            <p className="font-serif font-bold text-[#000000] text-xs sm:text-sm leading-relaxed">
              We are committed to delivering fresh and premium products with care and reliability.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
