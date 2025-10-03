'use client';

import { useState, useRef } from 'react';
import Head from 'next/head';
import InvoiceGenerator from '@/components/InvoiceGenerator';

export default function InvoiceGeneratorPage() {
  return (
    <>
      <Head>
        <title>Free Professional Invoice Generator Online - Create & Download Invoices | FlipFileX</title>
        <meta name="description" content="Create professional invoices online for free with our advanced invoice generator. Customizable templates, automatic calculations, PDF export, and multi-currency support for businesses." />
        <meta name="keywords" content="invoice generator, free invoice maker, professional invoices, business invoices, invoice template, PDF invoice, online invoicing, invoice creator" />
        <meta name="author" content="FlipFileX" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#10b981" />
        <meta name="application-name" content="FlipFileX Invoice Generator" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Free Professional Invoice Generator Online - Create & Download Invoices | FlipFileX" />
        <meta property="og:description" content="Create professional invoices online for free with customizable templates, automatic calculations, and PDF export. Perfect for freelancers and small businesses." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/invoice-generator" />
        <meta property="og:image" content="https://flipfilex.com/og-image.jpg" />
        <meta property="og:site_name" content="FlipFileX" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Professional Invoice Generator Online - Create & Download Invoices | FlipFileX" />
        <meta name="twitter:description" content="Create professional invoices online for free with customizable templates and automatic calculations." />
        <meta name="twitter:image" content="https://flipfilex.com/twitter-image.jpg" />

        <link rel="canonical" href="https://flipfilex.com/invoice-generator" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Invoice Generator",
            "description": "Create professional invoices online for free with customizable templates",
            "url": "https://flipfilex.com/invoice-generator",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Head>

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

        {/* Features Section */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Key Features */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200">
            <h3 className="font-semibold text-emerald-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Key Features
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-emerald-800 text-xs sm:text-sm">
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                <span><strong>Professional Design:</strong> Multiple color themes and layouts</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                <span><strong>Auto Calculations:</strong> Tax, discount, and totals computed automatically</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                <span><strong>Export & Share:</strong> PDF download and email sharing</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                <span><strong>Customizable:</strong> Logo upload, multiple currencies, custom notes</span>
              </li>
            </ul>
          </div>

          {/* Export Options */}
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-teal-200">
            <h3 className="font-semibold text-teal-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export & Sharing
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-teal-800 text-xs sm:text-sm">
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-0.5">•</span>
                <span><strong>PDF Export:</strong> High-quality PDF generation</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-0.5">•</span>
                <span><strong>Email Direct:</strong> Send invoices directly to clients</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-0.5">•</span>
                <span><strong>Public Links:</strong> Generate shareable online views</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2 mt-0.5">•</span>
                <span><strong>Print Ready:</strong> Optimized for professional printing</span>
              </li>
            </ul>
          </div>

          {/* Customization */}
          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M11 7L9 9l-4-4v8l4-4 2 2" />
              </svg>
              Customization
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-blue-800 text-xs sm:text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>Color Themes:</strong> Professional color schemes</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>Company Logo:</strong> Upload and position branding</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>Multi-Currency:</strong> USD, EUR, PKR, INR, and more</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>Custom Terms:</strong> Add notes and conditions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 sm:mt-16">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about our Invoice Generator
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

              {/* Left Column */}
              <div className="space-y-6">

                <div className="border border-gray-200 rounded-xl p-6 hover:border-emerald-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                    Is this invoice generator free to use?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Yes, our professional invoice generator is completely free. Create unlimited invoices with no watermarks, registration required, or hidden fees. Perfect for freelancers, small businesses, and enterprises.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-emerald-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                    Can I customize the invoice design?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Absolutely! Choose from multiple professional color themes, upload your company logo, select different currencies, and add custom notes and terms. The design is fully responsive and print-ready.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-emerald-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                    How do calculations work?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    All calculations are automatic. Add line items with quantity and unit price, apply discounts and taxes, and the subtotal, tax amount, and grand total are calculated instantly. Support for percentage and fixed amount discounts.
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">

                <div className="border border-gray-200 rounded-xl p-6 hover:border-emerald-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                    What export options are available?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Export your invoices as high-quality PDFs for professional presentation. Email invoices directly to clients with PDF attachments, or generate public share links for online viewing and payment processing.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-emerald-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                    Which currencies are supported?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We support major international currencies including USD, EUR, GBP, PKR, INR, CAD, AUD, and many more. The currency symbol automatically updates throughout the invoice based on your selection.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-emerald-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                    Can I save my invoice data?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your invoice data is automatically saved in your browser's local storage, so you won't lose your work when you refresh the page. For permanent storage, export your invoices as PDFs or use the sharing features.
                  </p>
                </div>
              </div>
            </div>

            {/* SEO Content Section */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 sm:p-8">
                <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">
                  Why Choose Our Professional Invoice Generator?
                </h2>

                <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                  <p className="text-xl leading-relaxed">
                    Our professional invoice generator is the comprehensive business solution for entrepreneurs, freelancers, and companies who demand excellence in financial documentation. Built with advanced automation and customization features, our platform transforms the tedious task of invoice creation into a streamlined, professional experience that enhances your business image and accelerates payment processing.
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Enterprise-Grade Invoice Automation</h3>
                  <p>
                    Experience the power of automated invoice generation with intelligent calculation engines that handle complex tax structures, multi-tier discount applications, and international currency conversions. Our system automatically computes subtotals, applies percentage or fixed-amount discounts, calculates tax obligations, and generates accurate grand totals, eliminating mathematical errors and saving valuable time.
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Professional Brand Integration</h3>
                  <p>
                    Elevate your business presentation with fully customizable invoice templates that reflect your brand identity. Upload high-resolution logos, select from professional color schemes, customize typography, and add personalized business information to create invoices that reinforce your professional image and build client confidence in your services.
                  </p>

                  <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Multi-Currency Global Support</h4>
                  <p>
                    Seamlessly conduct international business with comprehensive currency support covering major global markets. Our system supports USD, EUR, GBP, JPY, CAD, AUD, PKR, INR, and dozens of other currencies with real-time symbol formatting and region-appropriate number formatting conventions.
                  </p>

                  <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Advanced Export and Sharing</h4>
                  <p>
                    Transform your invoices into professional PDF documents optimized for printing and digital distribution. Email invoices directly to clients with customizable messages, generate secure public sharing links for online payment integration, and maintain complete control over your invoice distribution workflow.
                  </p>

                  <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Smart Data Management</h5>
                  <p>
                    Our intelligent local storage system preserves your invoice data automatically, ensuring no work is lost during editing sessions. Client information, product catalogs, and invoice templates are securely stored in your browser, providing instant access to frequently used data while maintaining complete privacy.
                  </p>

                  <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Responsive Professional Design</h5>
                  <p>
                    Every invoice generated adapts perfectly to any screen size or printing format. Our responsive design ensures your invoices look professional whether viewed on mobile devices, desktop computers, or printed on standard business letterhead, maintaining consistent formatting and readability across all platforms.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 p-6 bg-white rounded-xl border border-emerald-200">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600">∞</div>
                      <div className="text-sm font-medium text-gray-600">Unlimited Invoices</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600">25+</div>
                      <div className="text-sm font-medium text-gray-600">Currency Options</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600">6</div>
                      <div className="text-sm font-medium text-gray-600">Color Themes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600">100%</div>
                      <div className="text-sm font-medium text-gray-600">Free Forever</div>
                    </div>
                  </div>

                  <p className="text-lg font-medium text-gray-900 mt-8">
                    Start creating professional invoices that reflect your business excellence. Our free invoice generator combines powerful automation with beautiful design, helping you get paid faster while maintaining the professional image your business deserves. Join thousands of businesses who trust our platform for their invoicing needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}