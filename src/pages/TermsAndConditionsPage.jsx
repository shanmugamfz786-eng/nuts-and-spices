import React from 'react';

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* CENTERED PAGE HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-[#000000] tracking-tight">
            Terms & Conditions
          </h1>
          <div className="w-16 h-1 bg-[#000000] mx-auto rounded-full" />
        </div>

        {/* MAIN DOCUMENT WHITE CARD CONTAINER */}
        <div className="bg-white p-8 sm:p-12 md:p-14 rounded-3xl sm:rounded-[36px] shadow-lg border border-[#E5E7EB] space-y-8 text-[#000000]">
          
          {/* CARD SUBTITLE & INTRO */}
          <div className="border-b border-[#E5E7EB] pb-6 space-y-3">
            <h2 className="text-xl sm:text-2xl font-black font-serif text-[#000000]">
              Terms of Service – HAJI NUTS & SPICES
            </h2>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              Welcome to <strong className="text-[#000000]">HAJI NUTS & SPICES</strong>. By accessing and using this website, you agree to comply with and be bound by the following terms and conditions of use.
            </p>
          </div>

          {/* 1. GENERAL TERMS */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              1. General Terms
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              The content of the pages of this website is for your general information and use only. It is subject to change without notice. We reserve the right to modify or discontinue any product or service at any time.
            </p>
          </div>

          {/* 2. PRODUCT INFORMATION */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              2. Product Information & Pricing
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              We make every effort to display the colors, images, and descriptions of our products as accurately as possible. However, actual packaging may vary. Prices for our products are subject to change without notice.
            </p>
          </div>

          {/* 3. USER ACCOUNTS & SECURITY */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              3. User Accounts
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              If you create an account on our website, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device.
            </p>
          </div>

          {/* 4. PAYMENT TERMS */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              4. Payment & Billing
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              We accept various modes of payment including UPI, Cards, and Net Banking via secure payment gateways. By providing payment details, you represent and warrant that the information is accurate and that you are authorized to use the payment method.
            </p>
          </div>

          {/* 5. GOVERNING LAW */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#000000]">
              5. Governing Law
            </h3>
            <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Chennai, Tamil Nadu.
            </p>
          </div>

          {/* CLOSING STATEMENT */}
          <div className="pt-6 border-t border-[#E5E7EB]">
            <p className="font-serif font-bold text-[#000000] text-xs sm:text-sm leading-relaxed">
              For any questions regarding our terms, please contact us at our official email or phone number.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
