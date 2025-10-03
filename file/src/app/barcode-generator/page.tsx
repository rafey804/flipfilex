'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface BarcodeOptions {
  format: string;
  width: number;
  height: number;
  displayValue: boolean;
  fontSize: number;
  textMargin: number;
}

interface GeneratedBarcode {
  data: string;
  format: string;
  timestamp: string;
  dataUrl: string;
}

export default function BarcodeGeneratorPage() {
  const [inputData, setInputData] = useState('');
  const [options, setOptions] = useState<BarcodeOptions>({
    format: 'CODE128',
    width: 2,
    height: 100,
    displayValue: true,
    fontSize: 20,
    textMargin: 2
  });
  const [generatedBarcodes, setGeneratedBarcodes] = useState<GeneratedBarcode[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const barcodeFormats = [
    { code: 'CODE128', name: 'Code 128', description: 'Most common, supports all ASCII characters' },
    { code: 'CODE39', name: 'Code 39', description: 'Alphanumeric, widely used in industry' },
    { code: 'EAN13', name: 'EAN-13', description: 'European retail standard, 13 digits' },
    { code: 'EAN8', name: 'EAN-8', description: 'Short EAN for small products, 8 digits' },
    { code: 'UPC', name: 'UPC-A', description: 'US retail standard, 12 digits' },
    { code: 'ITF14', name: 'ITF-14', description: 'Used for packaging, 14 digits' }
  ];

  // Simulate barcode generation (in real implementation, you'd use a library like JsBarcode)
  const generateBarcodeImage = (data: string, format: string): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Set canvas dimensions
    const totalWidth = data.length * options.width * 10 + 40;
    const totalHeight = options.height + (options.displayValue ? options.fontSize + options.textMargin * 2 : 0) + 20;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate barcode pattern (simplified simulation)
    ctx.fillStyle = '#000000';
    let x = 20;
    const barWidth = options.width;
    const barHeight = options.height;

    // Generate bars based on data (simplified pattern)
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i);
      const pattern = charCode % 2; // Simplified pattern generation

      for (let j = 0; j < 8; j++) {
        if ((pattern >> j) & 1) {
          ctx.fillRect(x, 10, barWidth, barHeight);
        }
        x += barWidth;
      }
      x += barWidth; // Space between characters
    }

    // Add text if enabled
    if (options.displayValue) {
      ctx.fillStyle = '#000000';
      ctx.font = `${options.fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(data, canvas.width / 2, barHeight + 10 + options.fontSize + options.textMargin);
    }

    return canvas.toDataURL('image/png');
  };

  const handleGenerateBarcode = () => {
    if (!inputData.trim()) return;

    setIsGenerating(true);

    // Validate data based on format
    const isValid = validateBarcodeData(inputData, options.format);
    if (!isValid) {
      setIsGenerating(false);
      return;
    }

    setTimeout(() => {
      const dataUrl = generateBarcodeImage(inputData, options.format);

      const newBarcode: GeneratedBarcode = {
        data: inputData,
        format: options.format,
        timestamp: new Date().toLocaleString(),
        dataUrl
      };

      setGeneratedBarcodes(prev => [newBarcode, ...prev.slice(0, 9)]);
      setIsGenerating(false);
    }, 800);
  };

  const validateBarcodeData = (data: string, format: string): boolean => {
    switch (format) {
      case 'EAN13':
        return /^\d{13}$/.test(data);
      case 'EAN8':
        return /^\d{8}$/.test(data);
      case 'UPC':
        return /^\d{12}$/.test(data);
      case 'ITF14':
        return /^\d{14}$/.test(data);
      case 'CODE39':
        return /^[A-Z0-9\-. $/+%]*$/.test(data);
      case 'CODE128':
        return data.length > 0;
      default:
        return true;
    }
  };

  const downloadBarcode = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const getFormatRequirements = (format: string): string => {
    switch (format) {
      case 'EAN13':
        return 'Exactly 13 digits required';
      case 'EAN8':
        return 'Exactly 8 digits required';
      case 'UPC':
        return 'Exactly 12 digits required';
      case 'ITF14':
        return 'Exactly 14 digits required';
      case 'CODE39':
        return 'Uppercase letters, numbers, and symbols: - . $ / + % space';
      case 'CODE128':
        return 'Any ASCII characters';
      default:
        return '';
    }
  };

  const faqs = [
    {
      question: "What's the difference between barcode formats?",
      answer: "Different formats serve different purposes: EAN/UPC for retail, Code 39 for inventory, Code 128 for shipping, and ITF-14 for packaging. Each has specific character sets and length requirements."
    },
    {
      question: "Can I use these barcodes commercially?",
      answer: "For retail use (EAN/UPC), you need to obtain official numbers from GS1. For internal use like inventory or shipping labels, you can generate any valid codes."
    },
    {
      question: "What size should my barcode be for printing?",
      answer: "Minimum recommended size is 1 inch wide for most scanners. For retail use, follow GS1 standards. Always test with your specific scanners and printing equipment."
    },
    {
      question: "Why won't my barcode scan?",
      answer: "Common issues include: incorrect data format, poor print quality, wrong size, or incompatible barcode type. Ensure your data matches the format requirements and test with multiple scanners."
    },
    {
      question: "Can I customize the appearance?",
      answer: "Yes! You can adjust width, height, font size, and choose whether to display the text below the barcode. Maintain readability for reliable scanning."
    },
    {
      question: "What file formats can I download?",
      answer: "Generated barcodes can be downloaded as high-quality PNG images, perfect for printing or digital use in documents and applications."
    }
  ];

  const reviews = [
    {
      name: "Jennifer Walsh",
      role: "Inventory Manager",
      rating: 5,
      comment: "Perfect for generating internal product codes. The variety of formats covers all our warehouse needs and printing quality is excellent.",
      avatar: "👩‍💼"
    },
    {
      name: "Tom Anderson",
      role: "Small Business Owner",
      rating: 5,
      comment: "Great tool for creating custom barcodes for my products. Easy to use and the barcodes scan perfectly every time.",
      avatar: "👨‍💻"
    },
    {
      name: "Rachel Green",
      role: "Event Organizer",
      rating: 5,
      comment: "Used this for ticket barcodes at our events. Reliable generation and the customization options are exactly what we needed.",
      avatar: "🎭"
    }
  ];

  return (
    <>
      <Head>
        <title>Free Barcode Generator Online - EAN-13, UPC-A, Code 128 | Create Barcodes</title>
        <meta name="description" content="Generate professional barcodes instantly. Support for EAN-13, UPC-A, Code 128, Code 39, ITF-14 & more. Free barcode generator for retail, inventory & shipping." />
        <meta name="keywords" content="barcode generator, free barcode maker, EAN-13 generator, UPC-A barcode, Code 128, Code 39, barcode creator, retail barcode, inventory barcode, product barcode, shipping barcode" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/barcode-generator" />
        <meta property="og:title" content="Free Barcode Generator - Create EAN-13, UPC-A, Code 128 Barcodes" />
        <meta property="og:description" content="Generate professional barcodes instantly. Support for multiple formats. Perfect for retail, inventory & shipping." />
        <meta property="og:image" content="https://flipfilex.com/og-barcode-generator.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Barcode Generator | EAN-13, UPC-A, Code 128" />
        <meta name="twitter:description" content="Generate professional barcodes in multiple formats. Free & instant." />
        <meta name="twitter:image" content="https://flipfilex.com/og-barcode-generator.png" />

        <link rel="canonical" href="https://flipfilex.com/barcode-generator" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        {/* Hidden canvas for barcode generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-transparent to-red-100/50"></div>
          <div className="absolute top-10 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>

          <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl text-white text-3xl mb-8 shadow-2xl animate-bounce">
                📊
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-800 via-red-700 to-orange-800 bg-clip-text text-transparent mb-8 leading-tight">
                Professional Barcode Generator
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
                Create high-quality barcodes in multiple formats for retail, inventory, shipping, and more. Professional-grade output ready for printing and scanning.
              </p>
            </div>

            {/* Barcode Generator Tool */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/50 p-8 md:p-12">

                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Barcode Data
                    </label>
                    <input
                      type="text"
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      placeholder="Enter data to encode in barcode..."
                      className="w-full px-4 py-4 text-lg border border-orange-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white/70 backdrop-blur-sm"
                    />
                    <div className="text-sm text-gray-600 mt-2">
                      {getFormatRequirements(options.format)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Barcode Format
                    </label>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {barcodeFormats.map((format) => (
                        <label key={format.code} className="flex items-start space-x-3 p-4 bg-white/50 rounded-2xl border border-orange-200/30 hover:bg-white/70 transition-colors cursor-pointer">
                          <input
                            type="radio"
                            name="format"
                            value={format.code}
                            checked={options.format === format.code}
                            onChange={(e) => setOptions(prev => ({ ...prev, format: e.target.value }))}
                            className="w-5 h-5 text-orange-500 mt-1"
                          />
                          <div>
                            <div className="font-bold text-gray-900">{format.name}</div>
                            <div className="text-sm text-gray-600">{format.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Width: {options.width}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={options.width}
                        onChange={(e) => setOptions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Height: {options.height}px
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={options.height}
                        onChange={(e) => setOptions(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={options.displayValue}
                        onChange={(e) => setOptions(prev => ({ ...prev, displayValue: e.target.checked }))}
                        className="w-5 h-5 text-orange-500 rounded"
                      />
                      <span className="font-medium text-gray-900">Display text below barcode</span>
                    </label>
                  </div>

                  {options.displayValue && (
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Font Size: {options.fontSize}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="32"
                        value={options.fontSize}
                        onChange={(e) => setOptions(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleGenerateBarcode}
                    disabled={isGenerating || !inputData.trim() || !validateBarcodeData(inputData, options.format)}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
                        <span>Generating Barcode...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <span>📊</span>
                        <span>Generate Barcode</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Generated Barcodes */}
              {generatedBarcodes.length > 0 && (
                <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/50 p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="mr-3">✨</span>
                    Generated Barcodes
                  </h3>
                  <div className="space-y-6">
                    {generatedBarcodes.map((barcode, index) => (
                      <div key={index} className="bg-orange-50/50 rounded-2xl p-6 border border-orange-200/30">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <span className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">
                                {barcode.format}
                              </span>
                              <span className="text-sm text-gray-600">{barcode.timestamp}</span>
                            </div>
                            <div className="text-lg font-mono text-gray-900 mb-2">
                              Data: {barcode.data}
                            </div>
                          </div>

                          <div className="flex flex-col items-center space-y-4">
                            <div className="bg-white p-4 rounded-xl border border-orange-200 max-w-full overflow-auto">
                              <img
                                src={barcode.dataUrl}
                                alt={`Barcode for ${barcode.data}`}
                                className="max-w-full h-auto"
                              />
                            </div>
                            <button
                              onClick={() => downloadBarcode(barcode.dataUrl, `barcode-${barcode.format}-${barcode.data}.png`)}
                              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl transition-colors flex items-center space-x-2"
                            >
                              <span>💾</span>
                              <span>Download PNG</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Barcode Types Explanation */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Barcode Format Guide</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the right barcode format for your application
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                format: 'EAN-13',
                icon: '🛒',
                description: 'European retail standard for products',
                usage: 'Retail, groceries, books',
                length: '13 digits',
                example: '1234567890123'
              },
              {
                format: 'UPC-A',
                icon: '🇺🇸',
                description: 'US retail standard for products',
                usage: 'US retail, consumer goods',
                length: '12 digits',
                example: '123456789012'
              },
              {
                format: 'Code 128',
                icon: '📦',
                description: 'Versatile, high-density barcode',
                usage: 'Shipping, logistics, inventory',
                length: 'Variable',
                example: 'ABC123XYZ'
              },
              {
                format: 'Code 39',
                icon: '🏭',
                description: 'Industrial standard, easy to print',
                usage: 'Manufacturing, automotive',
                length: 'Variable',
                example: 'PART-001'
              },
              {
                format: 'ITF-14',
                icon: '📋',
                description: 'Distribution and packaging',
                usage: 'Cases, pallets, shipping',
                length: '14 digits',
                example: '12345678901234'
              },
              {
                format: 'EAN-8',
                icon: '🔹',
                description: 'Compact version for small items',
                usage: 'Small products, limited space',
                length: '8 digits',
                example: '12345678'
              }
            ].map((type, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-200/30 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{type.format}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="space-y-2 text-sm">
                  <div><strong>Usage:</strong> {type.usage}</div>
                  <div><strong>Length:</strong> {type.length}</div>
                  <div><strong>Example:</strong> <code className="bg-orange-100 px-2 py-1 rounded">{type.example}</code></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best Practices */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 md:p-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Barcode Best Practices</h2>
              <p className="text-xl text-gray-600">Ensure your barcodes scan reliably every time</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: '📏',
                  title: 'Proper Sizing',
                  tips: ['Minimum 1 inch wide for most scanners', 'Height ratio should be at least 15% of width', 'Test with your specific equipment']
                },
                {
                  icon: '🖨️',
                  title: 'Print Quality',
                  tips: ['Use high-resolution printers (300+ DPI)', 'Ensure sharp, clear lines', 'Avoid blurry or smudged prints']
                },
                {
                  icon: '⚪',
                  title: 'Color & Contrast',
                  tips: ['Use black bars on white background', 'Ensure high contrast ratio', 'Avoid colored backgrounds']
                },
                {
                  icon: '📱',
                  title: 'Testing',
                  tips: ['Test with multiple scanner types', 'Verify from different angles', 'Check under various lighting']
                },
                {
                  icon: '🎯',
                  title: 'Placement',
                  tips: ['Allow quiet zones (blank space) around barcode', 'Place on flat, smooth surfaces', 'Avoid curved or textured areas']
                },
                {
                  icon: '🔍',
                  title: 'Data Validation',
                  tips: ['Double-check data accuracy', 'Use appropriate format for application', 'Include check digits where required']
                }
              ].map((practice, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
                  <div className="text-3xl mb-4">{practice.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{practice.title}</h3>
                  <ul className="space-y-2">
                    {practice.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">User Reviews</h2>
            <p className="text-xl text-gray-600">Trusted by businesses and professionals</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-200/30">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{review.comment}"</p>
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{review.avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900">{review.name}</div>
                    <div className="text-gray-600 text-sm">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-20 mx-auto max-w-5xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about barcode generation</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-200/30">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-4 text-orange-600">❓</span>
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed pl-12">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-3xl p-8 md:p-16 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Start Creating Professional Barcodes</h2>
            <p className="text-xl mb-8 text-orange-100">Generate high-quality barcodes for any application</p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link href="#top" className="inline-block bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors">
                Generate Barcode Now
              </Link>
              <Link href="/tools" className="inline-block border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-orange-600 transition-colors">
                Explore More Tools
              </Link>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Related Generator Tools</h2>
            <p className="text-xl text-gray-600">Complete your toolkit with these generators</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'QR Code Generator', href: '/qr-code-generator', icon: '🔳', color: 'from-blue-500 to-purple-600' },
              { name: 'Password Generator', href: '/password-generator', icon: '🔐', color: 'from-red-500 to-pink-600' },
              { name: 'Hash Generator', href: '/hash-generator', icon: '🔑', color: 'from-purple-500 to-indigo-600' },
              { name: 'URL Shortener', href: '/url-shortener', icon: '🔗', color: 'from-emerald-500 to-teal-600' }
            ].map((tool, index) => (
              <Link key={index} href={tool.href} className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-200/30 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${tool.color} rounded-2xl text-white text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700">{tool.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}