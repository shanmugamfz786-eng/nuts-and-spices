import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* CENTERED PAGE HEADER MATCHING USER REFERENCE SCREENSHOT */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-[#000000] tracking-tight">
            Privacy Policy
          </h1>
          <div className="w-16 h-1 bg-[#000000] mx-auto rounded-full" />
        </div>

        {/* MAIN DOCUMENT WHITE CARD CONTAINER */}
        <div className="bg-white p-8 sm:p-12 md:p-14 rounded-3xl sm:rounded-[36px] shadow-lg border border-[#E5E7EB] space-y-8 text-[#000000]">
          
          {/* CARD SUBTITLE & INTRO */}
          <div className="border-b border-[#E5E7EB] pb-6 space-y-3">
            <h2 className="text-xl sm:text-2xl font-black font-serif text-[#000000]">
              Privacy Policy – HAJI NUTS & SPICES
            </h2>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              At <strong className="text-[#000000]">HAJI NUTS & SPICES</strong>, we value your privacy and are committed to protecting your personal information. Our privacy policy explains how we collect, use, and safeguard your details.
            </p>
          </div>

          {/* 1. INFORMATION COLLECTION */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              1. Information Collection
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              We may collect basic customer information such as name, phone number, email address, and delivery address for order processing and customer support purposes.
            </p>
          </div>

          {/* 2. USE OF INFORMATION */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              2. Use of Information
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              Customer information is used only to process orders, improve our services, provide updates, and ensure a smooth shopping experience.
            </p>
          </div>

          {/* 3. DATA PROTECTION */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              3. Data Protection
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              We maintain appropriate security measures to protect your personal information from unauthorized access, misuse, or disclosure.
            </p>
          </div>

          {/* 4. THIRD-PARTY SHARING */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              4. Third-Party Sharing
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              We do not sell or share customer information with third parties except for trusted delivery or payment service providers required to complete your orders.
            </p>
          </div>

          {/* 5. CUSTOMER TRUST & UPDATES */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              5. Customer Trust & Updates
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              By using our services, you agree to our privacy practices. We may update this policy occasionally to improve transparency and customer protection.
            </p>
          </div>

          {/* CLOSING STATEMENT */}
          <div className="pt-6 border-t border-[#E5E7EB]">
            <p className="font-serif font-bold text-[#000000] text-xs sm:text-sm leading-relaxed">
              Your privacy and trust are important to us.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
