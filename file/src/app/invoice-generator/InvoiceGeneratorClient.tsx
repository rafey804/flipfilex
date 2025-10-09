'use client';

import { useState, useRef } from 'react';
import InvoiceGenerator from '@/components/InvoiceGenerator';

export default function InvoiceGeneratorClient() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Professional Invoice Generator
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Create professional invoices with customizable colors, themes, and branding.
            Export to PDF, email to clients, and share with public links.
          </p>
        </div>

        {/* Main Invoice Generator Component */}
        <InvoiceGenerator />

        {/* How to Use Section */}
        <section className="mb-20 mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg">
            <h2 className="text-4xl font-black text-gray-900 mb-6">How to Create Professional Invoices Online Free</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Our free online invoice generator simplifies the invoicing process for freelancers, small businesses, and enterprises. Create unlimited professional invoices with automatic calculations, customizable templates, and instant PDF export. No registration required, no watermarks, and completely free to use forever.
              </p>
              <p className="mb-4">
                Whether you're a freelancer billing clients, a small business managing accounts, or an enterprise processing multiple invoices, our tool streamlines your workflow. Add your company logo, customize colors to match your brand, and include detailed line items with automatic tax and discount calculations. Export finished invoices as high-quality PDFs or share them directly via email.
              </p>
              <h3 className="text-2xl font-bold mt-8 mb-4">Step-by-Step Guide:</h3>
              <ol className="space-y-3 ml-6 list-decimal">
                <li><strong>Enter Business Details:</strong> Add your company name, address, logo, and contact information. Include client details for a complete professional invoice.</li>
                <li><strong>Add Invoice Items:</strong> List products or services with descriptions, quantities, and unit prices. The calculator automatically computes totals as you type.</li>
                <li><strong>Apply Discounts and Taxes:</strong> Add percentage or fixed-amount discounts. Include tax rates that calculate automatically on subtotals for accurate billing.</li>
                <li><strong>Customize and Export:</strong> Choose your color theme, add payment terms, and include notes. Download as PDF, email to clients, or generate a shareable link instantly.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Why Use Our Invoice Generator?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Generate professional invoices in under 2 minutes. Instant calculations, real-time preview, and immediate PDF export make invoicing effortless for busy professionals.' },
              { icon: '🔒', title: '100% Secure', desc: 'Your invoice data is stored locally in your browser. We never access, store, or share your sensitive business information, ensuring complete privacy and security.' },
              { icon: '💎', title: 'Completely Free', desc: 'Create unlimited invoices with no hidden costs, subscription fees, or usage limits. All premium features including PDF export and custom branding are free forever.' },
              { icon: '✨', title: 'Professional Quality', desc: 'Choose from multiple elegant templates with customizable colors and layouts. Upload your logo for branded invoices that impress clients and enhance credibility.' },
              { icon: '🎯', title: 'Easy to Use', desc: 'Intuitive interface requires no training or technical skills. Automatic calculations eliminate errors, while smart field suggestions speed up invoice creation dramatically.' },
              { icon: '🚀', title: 'Multi-Currency Support', desc: 'Invoice clients worldwide with support for 25+ currencies including USD, EUR, GBP, JPR, INR, and more. Automatic currency symbol formatting ensures accuracy.' }
            ].map((benefit, i) => (
              <div key={i} className="bg-white/80 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { q: 'What is the best free invoice generator?', a: 'FlipFileX offers the best free invoice generator with professional templates, automatic calculations, PDF export, email sharing, and multi-currency support. Create unlimited invoices without watermarks or registration. Perfect for freelancers and businesses of all sizes.' },
              { q: 'How do I create a professional invoice online?', a: 'Simply enter your business and client information, add line items with quantities and prices, apply any discounts or taxes, customize the design, and download as PDF. Our automated calculator handles all math while you focus on content.' },
              { q: 'Is it free forever with no hidden costs?', a: 'Yes, absolutely! Our invoice generator is completely free with no hidden fees, subscription requirements, or usage limits. All features including PDF export, custom branding, and unlimited invoices are free forever. No credit card needed.' },
              { q: 'What is the maximum invoice size I can create?', a: 'There are no limits! Create invoices with unlimited line items, multiple currencies, complex discount structures, and detailed notes. Our system handles invoices of any size with instant calculations and smooth performance.' },
              { q: 'Is my business data secure and private?', a: 'Absolutely! All invoice data is stored locally in your browser only. We never upload, store, or access your business information on our servers. Your sensitive financial data remains completely private and secure.' },
              { q: 'Do I need to register or create an account?', a: 'No registration required! Start creating professional invoices immediately without any signup process. No email verification, no passwords to remember, and no personal information needed. Just visit and start invoicing.' },
              { q: 'What file formats are supported for export?', a: 'Export your invoices as high-quality PDF files optimized for printing and digital sharing. PDFs maintain perfect formatting across all devices and can be emailed directly to clients or saved for your records.' },
              { q: 'Can I customize invoices with my company branding?', a: 'Yes! Upload your company logo, choose from multiple professional color themes, add custom notes and payment terms, and include your business information. Create branded invoices that reinforce your professional image with every client interaction.' }
            ].map((faq, i) => (
              <div key={i} className="bg-white/80 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mb-20">
          <div className="bg-white/80 rounded-3xl p-8 md:p-12 shadow-lg">
            <h2 className="text-4xl font-black text-gray-900 mb-6">Common Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: '👨‍💼', title: 'Freelancers & Consultants', desc: 'Bill clients for services rendered with professional invoices that include hourly rates, project milestones, and payment terms. Track multiple clients and maintain organized financial records for tax purposes.' },
                { icon: '🏢', title: 'Small Business Owners', desc: 'Create branded invoices for product sales or service delivery. Include company logos, manage inventory billing, apply business-specific tax rates, and maintain professional client relationships with polished invoicing.' },
                { icon: '🎨', title: 'Creative Professionals', desc: 'Invoice clients for design work, photography sessions, video production, or creative consulting. Itemize project phases, include usage rights, and present services professionally with custom-branded invoices.' },
                { icon: '⚙️', title: 'Service Providers', desc: 'Bill customers for repairs, maintenance, installations, or professional services. List labor hours, parts used, service fees, and provide transparent pricing breakdown that builds trust and facilitates prompt payment.' }
              ].map((useCase, i) => (
                <div key={i}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {useCase.icon} {useCase.title}
                  </h3>
                  <p className="text-gray-700">{useCase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
