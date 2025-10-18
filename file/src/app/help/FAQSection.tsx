'use client';

import { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'security' | 'billing';
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: 'general',
    question: 'Is FlipFileX really free to use?',
    answer: 'Yes! FlipFileX is completely free to use. All 100+ tools are available without any charges, subscriptions, or hidden fees. We believe file conversion should be accessible to everyone.'
  },
  {
    id: 2,
    category: 'security',
    question: 'Are my files safe and secure?',
    answer: 'Absolutely. Your files are encrypted during upload and processing, then automatically deleted from our servers within 1 hour. We never store, access, or share your files with anyone.'
  },
  {
    id: 3,
    category: 'general',
    question: 'Do I need to create an account?',
    answer: 'No registration required! You can use all our tools immediately without creating an account, providing personal information, or signing up for anything.'
  },
  {
    id: 4,
    category: 'technical',
    question: 'What file formats do you support?',
    answer: 'We support 100+ file formats including PDF, Word, Excel, PowerPoint, images (JPEG, PNG, HEIC, WebP, AVIF), videos (MP4, MOV, AVI), audio (MP3, WAV, FLAC), and many more specialized formats.'
  },
  {
    id: 5,
    category: 'technical',
    question: 'What is the maximum file size limit?',
    answer: 'The maximum file size limit is 100MB per file. This covers most common use cases while ensuring fast processing times for all users.'
  },
  {
    id: 6,
    category: 'technical',
    question: 'How long does conversion take?',
    answer: 'Most conversions complete within 15-30 seconds. Larger files or complex conversions may take up to a few minutes. Processing time depends on file size and conversion complexity.'
  },
  {
    id: 7,
    category: 'security',
    question: 'Can I convert confidential documents?',
    answer: 'Yes, our platform is designed with privacy in mind. All files are processed securely with SSL encryption, and we automatically delete everything within 1 hour. We never access your file contents.'
  },
  {
    id: 8,
    category: 'technical',
    question: 'Why is my converted file quality poor?',
    answer: 'Quality depends on your original file. We maintain the best possible quality during conversion, but some format changes may result in slight quality loss. For best results, start with high-quality source files.'
  },
  {
    id: 9,
    category: 'general',
    question: 'Can I use FlipFileX on mobile devices?',
    answer: 'Yes! FlipFileX works on all devices including smartphones, tablets, laptops, and desktops. Our website is fully responsive and optimized for mobile use.'
  },
  {
    id: 10,
    category: 'technical',
    question: 'What browsers do you support?',
    answer: 'FlipFileX works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. We recommend using the latest version of your preferred browser for the best experience.'
  },
  {
    id: 11,
    category: 'general',
    question: 'How many files can I convert?',
    answer: 'There\'s no limit to how many files you can convert. You can use our tools as often as you need, completely free of charge.'
  },
  {
    id: 12,
    category: 'technical',
    question: 'Can I convert password-protected files?',
    answer: 'Currently, we cannot process password-protected or encrypted files. Please remove the password protection before uploading, or contact us if you need help with secured documents.'
  },
  {
    id: 13,
    category: 'general',
    question: 'Do you offer API access?',
    answer: 'We\'re currently focused on our web-based tools. API access may be available in the future. Contact us if you have specific integration needs for your business.'
  },
  {
    id: 14,
    category: 'security',
    question: 'Do you comply with GDPR and privacy laws?',
    answer: 'Yes, we fully comply with GDPR, CCPA, and other privacy regulations. We have comprehensive privacy policies and data protection measures in place to protect your information.'
  },
  {
    id: 15,
    category: 'technical',
    question: 'My file failed to convert. What should I do?',
    answer: 'First, check if your file is in a supported format and under 100MB. Try refreshing the page and uploading again. If the problem persists, contact our support team with details about the file type and error message.'
  }
];

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions', count: faqData.length },
    { id: 'general', label: 'General', count: faqData.filter(faq => faq.category === 'general').length },
    { id: 'technical', label: 'Technical', count: faqData.filter(faq => faq.category === 'technical').length },
    { id: 'security', label: 'Security', count: faqData.filter(faq => faq.category === 'security').length },
  ];

  const filteredFAQs = activeCategory === 'all'
    ? faqData
    : faqData.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="mb-16">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openFAQ === faq.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFAQ === faq.id && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  <div className="mt-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      faq.category === 'general' ? 'bg-blue-100 text-blue-800' :
                      faq.category === 'technical' ? 'bg-green-100 text-green-800' :
                      faq.category === 'security' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No questions found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}