// app/tools/page.tsx - Complete All Converters Page
'use client';

import Link from 'next/link';
import { useState } from 'react';
import Head from 'next/head';

export default function ToolsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Image converter tools
  const imageConverters = [
    { from: 'avif', to: 'png', fromName: 'AVIF', toName: 'PNG', description: 'Modern to universal format', icon: '🖼️', gradient: 'from-blue-500 to-cyan-500' },
    { from: 'webp', to: 'png', fromName: 'WebP', toName: 'PNG', description: 'Web format to universal', icon: '🌐', gradient: 'from-green-500 to-blue-500' },
    { from: 'png', to: 'webp', fromName: 'PNG', toName: 'WebP', description: 'Universal to web format', icon: '📱', gradient: 'from-purple-500 to-pink-500' },
    { from: 'jpg', to: 'png', fromName: 'JPG', toName: 'PNG', description: 'JPEG to lossless format', icon: '📸', gradient: 'from-orange-500 to-red-500' },
    { from: 'png', to: 'jpg', fromName: 'PNG', toName: 'JPG', description: 'Lossless to compressed', icon: '🎨', gradient: 'from-indigo-500 to-purple-500' },
    { from: 'jpeg', to: 'webp', fromName: 'JPEG', toName: 'WebP', description: 'Legacy to modern web', icon: '⚡', gradient: 'from-yellow-500 to-orange-500' },
    { from: 'svg', to: 'png', fromName: 'SVG', toName: 'PNG', description: 'Vector to raster', icon: '🎯', gradient: 'from-teal-500 to-green-500' },
    { from: 'gif', to: 'png', fromName: 'GIF', toName: 'PNG', description: 'Animated to static', icon: '🎭', gradient: 'from-pink-500 to-rose-500' },
    { from: 'bmp', to: 'png', fromName: 'BMP', toName: 'PNG', description: 'Bitmap to compressed', icon: '🔧', gradient: 'from-gray-500 to-blue-500' },
    { from: 'tiff', to: 'png', fromName: 'TIFF', toName: 'PNG', description: 'Professional to universal', icon: '🏆', gradient: 'from-amber-500 to-yellow-500' },
    { from: 'heic', to: 'jpg', fromName: 'HEIC', toName: 'JPG', description: 'iPhone photos', icon: '📱', gradient: 'from-blue-600 to-indigo-600' },
    { from: 'ico', to: 'png', fromName: 'ICO', toName: 'PNG', description: 'Icon to image', icon: '🎪', gradient: 'from-violet-500 to-purple-500' }
  ];

  // Video converter tools
  const videoConverters = [
    { from: 'mp4', to: 'mov', fromName: 'MP4', toName: 'MOV', description: 'Universal to Apple format', icon: '🎬', gradient: 'from-red-500 to-pink-500' },
    { from: 'mov', to: 'mp4', fromName: 'MOV', toName: 'MP4', description: 'Apple to universal format', icon: '🍎', gradient: 'from-gray-700 to-gray-500' },
    { from: 'avi', to: 'mp4', fromName: 'AVI', toName: 'MP4', description: 'Legacy to modern format', icon: '🔄', gradient: 'from-blue-500 to-purple-500' },
    { from: 'mkv', to: 'mp4', fromName: 'MKV', toName: 'MP4', description: 'Container to streaming', icon: '📦', gradient: 'from-green-500 to-teal-500' },
    { from: 'webm', to: 'mp4', fromName: 'WebM', toName: 'MP4', description: 'Web to universal format', icon: '🌐', gradient: 'from-orange-500 to-red-500' },
    { from: 'flv', to: 'mp4', fromName: 'FLV', toName: 'MP4', description: 'Flash to modern format', icon: '⚡', gradient: 'from-yellow-500 to-orange-500' },
    { from: 'wmv', to: 'mp4', fromName: 'WMV', toName: 'MP4', description: 'Windows to universal', icon: '🪟', gradient: 'from-blue-600 to-cyan-500' },
    { from: 'mp4', to: 'webm', fromName: 'MP4', toName: 'WebM', description: 'Universal to web format', icon: '📱', gradient: 'from-purple-500 to-pink-500' }
  ];

  // Audio converter tools
 const audioConverters = [
  { from: 'wav', to: 'mp3', fromName: 'WAV', toName: 'MP3', description: 'Lossless to compressed', icon: '🎵', gradient: 'from-purple-500 to-orange-500' },
  { from: 'mp3', to: 'wav', fromName: 'MP3', toName: 'WAV', description: 'Compressed to lossless', icon: '🎶', gradient: 'from-orange-500 to-purple-500' },
  { from: 'flac', to: 'mp3', fromName: 'FLAC', toName: 'MP3', description: 'Lossless to portable', icon: '🎼', gradient: 'from-indigo-500 to-orange-500' },
  { from: 'aac', to: 'mp3', fromName: 'AAC', toName: 'MP3', description: 'Apple to universal', icon: '🎤', gradient: 'from-blue-500 to-orange-500' },
  { from: 'm4a', to: 'mp3', fromName: 'M4A', toName: 'MP3', description: 'iTunes to universal', icon: '🎧', gradient: 'from-pink-500 to-orange-500' },
  { from: 'ogg', to: 'mp3', fromName: 'OGG', toName: 'MP3', description: 'Open source to standard', icon: '🔊', gradient: 'from-green-500 to-orange-500' },
  { from: 'wma', to: 'mp3', fromName: 'WMA', toName: 'MP3', description: 'Windows to universal', icon: '🎺', gradient: 'from-red-500 to-orange-500' },
  { from: 'mp3', to: 'aac', fromName: 'MP3', toName: 'AAC', description: 'Universal to Apple', icon: '🎻', gradient: 'from-orange-500 to-blue-500' }
];

  // Font converter tools
  const fontConverters = [
    { from: 'ttf', to: 'woff', fromName: 'TTF', toName: 'WOFF', description: 'Desktop to web format', icon: '🔤', gradient: 'from-slate-500 to-zinc-500' },
    { from: 'otf', to: 'woff2', fromName: 'OTF', toName: 'WOFF2', description: 'OpenType to modern web', icon: '📝', gradient: 'from-gray-500 to-slate-500' },
    { from: 'woff', to: 'ttf', fromName: 'WOFF', toName: 'TTF', description: 'Web to desktop format', icon: '💻', gradient: 'from-zinc-500 to-gray-500' },
    { from: 'woff2', to: 'otf', fromName: 'WOFF2', toName: 'OTF', description: 'Modern web to OpenType', icon: '🌐', gradient: 'from-slate-600 to-zinc-600' },
    { from: 'ttf', to: 'otf', fromName: 'TTF', toName: 'OTF', description: 'TrueType to OpenType', icon: '✍️', gradient: 'from-gray-600 to-slate-600' },
    { from: 'eot', to: 'woff', fromName: 'EOT', toName: 'WOFF', description: 'Legacy IE to modern web', icon: '⚡', gradient: 'from-zinc-600 to-gray-600' },
    { from: 'ps1', to: 'otf', fromName: 'PS1', toName: 'OTF', description: 'PostScript to modern', icon: '🖨️', gradient: 'from-slate-700 to-zinc-700' },
    { from: 'svg', to: 'ttf', fromName: 'SVG', toName: 'TTF', description: 'Vector to standard font', icon: '🎨', gradient: 'from-gray-700 to-slate-700' }
  ];

  // PDF converter tools
  const pdfConverters = [
    { path: '/convert-pdf-to-word-online', fromName: 'PDF', toName: 'Word', description: 'Convert PDF to editable Word documents', icon: '📄', gradient: 'from-blue-600 to-indigo-600' },
    { path: '/word-to-pdf-online', fromName: 'Word', toName: 'PDF', description: 'Convert Word documents to PDF format', icon: '📝', gradient: 'from-indigo-600 to-blue-600' },
    { path: '/merge-pdf-files-free', fromName: 'Merge', toName: 'PDF', description: 'Combine multiple PDF files into one', icon: '📚', gradient: 'from-green-500 to-emerald-500' },
    { path: '/split-pdf-pages', fromName: 'Split', toName: 'PDF', description: 'Split PDF into individual pages or custom ranges', icon: '✂️', gradient: 'from-cyan-500 to-teal-600' },
    { path: '/pdf-to-images-converter', fromName: 'PDF', toName: 'Images', description: 'Extract images from PDF documents', icon: '🖼️', gradient: 'from-purple-500 to-violet-500' },
    { path: '/excel-to-pdf', fromName: 'Excel', toName: 'PDF', description: 'Convert Excel spreadsheets to PDF format', icon: '📊', gradient: 'from-emerald-600 to-teal-600' },
    { path: '/powerpoint-to-pdf', fromName: 'PowerPoint', toName: 'PDF', description: 'Convert PowerPoint presentations to PDF', icon: '📺', gradient: 'from-orange-600 to-red-600' },
    { path: '/text-to-pdf', fromName: 'Text', toName: 'PDF', description: 'Convert plain text files to PDF documents', icon: '📃', gradient: 'from-gray-600 to-slate-600' },
    { path: '/html-to-pdf', fromName: 'HTML', toName: 'PDF', description: 'Convert HTML web pages to PDF format', icon: '🌐', gradient: 'from-cyan-600 to-blue-600' },
    { path: '/csv-to-excel', fromName: 'CSV', toName: 'Excel', description: 'Convert CSV data files to Excel format', icon: '📋', gradient: 'from-lime-600 to-green-600' },
    { path: '/json-to-csv', fromName: 'JSON', toName: 'CSV', description: 'Convert JSON data to CSV format', icon: '🔄', gradient: 'from-violet-600 to-purple-600' },
    { path: '/compress-pdf', fromName: 'Compress', toName: 'PDF', description: 'Reduce PDF file size up to 80% while maintaining quality', icon: '🗜️', gradient: 'from-emerald-600 to-teal-600' },
    { path: '/pdf-password-protection', fromName: 'Lock/Unlock', toName: 'PDF', description: 'Add password protection or remove passwords from PDFs', icon: '🔒', gradient: 'from-indigo-600 to-purple-600' }
  ];

  // Document converter tools
  const documentConverters = [
    { path: '/epub-to-pdf', fromName: 'EPUB', toName: 'PDF', description: 'Convert e-books to portable document format', icon: '📚', gradient: 'from-blue-600 to-indigo-600' },
    { path: '/mobi-to-epub', fromName: 'MOBI', toName: 'EPUB', description: 'Convert Kindle books to universal e-book format', icon: '📖', gradient: 'from-orange-600 to-red-600' },
    { path: '/txt-to-epub', fromName: 'TXT', toName: 'EPUB', description: 'Transform plain text files into e-books', icon: '📝', gradient: 'from-green-600 to-emerald-600' },
    { path: '/docx-to-epub', fromName: 'DOCX', toName: 'EPUB', description: 'Convert Word documents to e-book format', icon: '📄', gradient: 'from-purple-600 to-pink-600' },
    { path: '/bib-to-pdf', fromName: 'BIB', toName: 'PDF', description: 'Convert bibliography files to PDF format', icon: '📓', gradient: 'from-teal-600 to-cyan-600' },
    { path: '/latex-to-pdf', fromName: 'LaTeX', toName: 'PDF', description: 'Compile LaTeX documents to professional PDFs', icon: '🔬', gradient: 'from-indigo-600 to-blue-600' }
  ];

  // Research and academic tools
  const researchTools = [
    { path: '/ris-to-bibtex', fromName: 'RIS', toName: 'BibTeX', description: 'Convert research references between formats', icon: '🔬', gradient: 'from-violet-600 to-purple-600' },
    { path: '/mathml-to-image', fromName: 'MathML', toName: 'Image', description: 'Convert mathematical markup to images', icon: '∑', gradient: 'from-emerald-600 to-teal-600' }
  ];

  // 3D and CAD tools
  const cadTools = [
    { path: '/stl-to-obj', fromName: 'STL', toName: 'OBJ', description: 'Convert 3D printing files to object format', icon: '🎯', gradient: 'from-blue-600 to-purple-600' },
    { path: '/dwg-to-pdf', fromName: 'DWG', toName: 'PDF', description: 'Convert CAD drawings to PDF format', icon: '📐', gradient: 'from-orange-600 to-red-600' },
    { path: '/step-to-stl', fromName: 'STEP', toName: 'STL', description: 'Convert CAD files for 3D printing', icon: '🏗️', gradient: 'from-green-600 to-emerald-600' },
    { path: '/ply-to-obj', fromName: 'PLY', toName: 'OBJ', description: 'Convert polygon mesh files', icon: '🔷', gradient: 'from-purple-600 to-pink-600' }
  ];

  // Financial and crypto tools
  const financeTools = [
    { path: '/defi-yield-calculator', fromName: 'DeFi', toName: 'Yield', description: 'Calculate DeFi staking and yield farming returns', icon: '💰', gradient: 'from-yellow-600 to-orange-600' },
    { path: '/jwt-token-decoder', fromName: 'JWT', toName: 'Decoded', description: 'Decode and analyze JWT authentication tokens', icon: '🔐', gradient: 'from-indigo-600 to-purple-600' }
  ];

  // Medical and imaging tools
  const medicalTools = [
    { path: '/dicom-to-jpeg', fromName: 'DICOM', toName: 'JPEG', description: 'Convert medical imaging files to standard format', icon: '🏥', gradient: 'from-cyan-600 to-blue-600' }
  ];

  // Utility tools
  const utilityTools = [
    { path: '/invoice-generator', fromName: 'Data', toName: 'Invoice', description: 'Create professional invoices with custom themes', icon: '📄', gradient: 'from-emerald-600 to-teal-600' },
    { path: '/resume-builder', fromName: 'Profile', toName: 'Resume', description: 'AI-powered professional resume builder with ATS optimization', icon: '📝', gradient: 'from-blue-600 to-indigo-600' },
    { path: '/ocr-image-to-text', fromName: 'Image', toName: 'Text', description: 'Extract text from images and PDFs using OCR', icon: '📖', gradient: 'from-emerald-600 to-teal-600' },
    { path: '/qr-code-generator', fromName: 'Text', toName: 'QR Code', description: 'Generate QR codes from text, URLs, and data', icon: '📱', gradient: 'from-indigo-600 to-purple-600' },
    { path: '/barcode-generator', fromName: 'Text', toName: 'Barcode', description: 'Generate various barcode formats for products and inventory', icon: '📊', gradient: 'from-orange-600 to-red-600' },
    { path: '/password-generator', fromName: 'Settings', toName: 'Password', description: 'Create secure random passwords with custom options', icon: '🔐', gradient: 'from-red-600 to-pink-600' },
    { path: '/hash-generator', fromName: 'Text', toName: 'Hash', description: 'Generate MD5, SHA256, and other cryptographic hashes', icon: '🔒', gradient: 'from-purple-600 to-indigo-600' },
    { path: '/url-shortener', fromName: 'URL', toName: 'Short Link', description: 'Shorten long URLs for easy sharing and tracking', icon: '🔗', gradient: 'from-emerald-600 to-teal-600' },
    { path: '/color-palette-generator', fromName: 'Colors', toName: 'Palette', description: 'Create professional color schemes and harmonies', icon: '🎨', gradient: 'from-pink-600 to-purple-600' },
    { path: '/base64-encoder-decoder', fromName: 'Text/File', toName: 'Base64', description: 'Encode and decode Base64 strings and files', icon: '🔄', gradient: 'from-cyan-600 to-teal-600' },
    { path: '/image-compressor', fromName: 'Image', toName: 'Compressed', description: 'Reduce image file sizes without quality loss', icon: '🗜️', gradient: 'from-orange-600 to-yellow-600' }
  ];

  // Filter converters based on search
  const filteredImageConverters = imageConverters.filter(converter => 
    converter.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    converter.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    converter.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVideoConverters = videoConverters.filter(converter => 
    converter.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    converter.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    converter.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAudioConverters = audioConverters.filter(converter =>
    converter.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    converter.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    converter.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFontConverters = fontConverters.filter(converter =>
    converter.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    converter.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    converter.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPdfConverters = pdfConverters.filter(converter =>
    converter.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    converter.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    converter.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocumentConverters = documentConverters.filter(converter =>
    converter.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    converter.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    converter.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResearchTools = researchTools.filter(tool =>
    tool.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCadTools = cadTools.filter(tool =>
    tool.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFinanceTools = financeTools.filter(tool =>
    tool.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMedicalTools = medicalTools.filter(tool =>
    tool.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUtilityTools = utilityTools.filter(tool =>
    tool.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>All Tools - 200+ Free Online Converters & Utilities | FlipFileX</title>
        <meta name="description" content="Explore 200+ free online tools: PDF, Image, Video, Audio converters, QR code generator, password generator, URL shortener & more. No registration required." />
        <meta name="keywords" content="online tools, free converters, file converter, PDF tools, image tools, video converter, audio converter, QR code, password generator, URL shortener, FlipFileX tools" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/tools" />
        <meta property="og:title" content="All Tools - 200+ Free Online Converters & Utilities" />
        <meta property="og:description" content="Explore 200+ free tools for file conversion, image processing, video editing & more." />
        <meta property="og:image" content="https://flipfilex.com/og-tools.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="All Tools - 200+ Free Online Converters" />
        <meta name="twitter:description" content="PDF, Image, Video, Audio converters & 200+ free tools." />
        <meta name="twitter:image" content="https://flipfilex.com/og-tools.png" />

        <link rel="canonical" href="https://flipfilex.com/tools" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors duration-300 hover:scale-105 transform">
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-5 h-5 text-gray-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-900 font-medium">All Tools</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl text-white text-5xl mb-8 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">
            🛠️
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-fade-in">
            All Conversion Tools
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8 animate-slide-up">
            Complete collection of our image, video, audio, font, PDF and document conversion tools.
            Fast, secure, and professional quality conversions.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8 animate-slide-up delay-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search converters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-12 text-lg border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white/80 backdrop-blur-sm shadow-lg"
              />
              <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex justify-center space-x-4 animate-slide-up delay-300">
            <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold animate-pulse">
              {imageConverters.length + videoConverters.length + audioConverters.length + fontConverters.length + pdfConverters.length + documentConverters.length + researchTools.length + cadTools.length + financeTools.length + medicalTools.length + utilityTools.length}+ Tools
            </div>
            <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold animate-pulse delay-100">
              100% Free
            </div>
            <div className="px-6 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold animate-pulse delay-200">
              No Registration
            </div>
          </div>
        </div>

        {/* Image Converters Section */}
        {filteredImageConverters.length > 0 && (
          <section id="image-converters" className="mb-20 animate-slide-up">
            <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-blue-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white text-3xl mb-4 animate-spin-slow hover:animate-bounce">
                  🖼️
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Image Converters
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Convert between all popular image formats with perfect quality preservation
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredImageConverters.map((converter, index) => (
                  <Link
                    key={index}
                    href={`/${converter.from}-to-${converter.to}`}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${converter.gradient} rounded-xl text-white text-xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      {converter.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {converter.fromName} → {converter.toName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{converter.description}</p>
                    <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1 inline-block">
                      .{converter.from} to .{converter.to}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Video Converters Section */}
        {filteredVideoConverters.length > 0 && (
          <section id="video-converters" className="mb-20 animate-slide-up delay-200">
            <div className="bg-gradient-to-r from-red-50/50 to-pink-50/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-red-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl text-white text-3xl mb-4 animate-pulse hover:animate-bounce">
                  🎬
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Video Converters
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Convert video files between formats while maintaining quality and optimizing for platforms
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredVideoConverters.map((converter, index) => (
                  <Link
                    key={index}
                    href={`/${converter.from}-to-${converter.to}`}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${converter.gradient} rounded-xl text-white text-xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      {converter.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                      {converter.fromName} → {converter.toName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{converter.description}</p>
                    <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1 inline-block">
                      .{converter.from} to .{converter.to}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Audio Converters Section */}
        {filteredAudioConverters.length > 0 && (
          <section id="audio-converters" className="mb-20 animate-slide-up delay-300">
            <div className="bg-gradient-to-r from-purple-50/50 to-orange-50/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-purple-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl text-white text-3xl mb-4 animate-pulse hover:animate-bounce">
                  🎵
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                  Audio Converters
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  High-quality audio format conversion with perfect sound preservation and optimized compression
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredAudioConverters.map((converter, index) => (
                  <Link
                    key={index}
                    href={`/${converter.from}-to-${converter.to}`}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${converter.gradient} rounded-xl text-white text-xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      {converter.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-orange-600 group-hover:bg-clip-text transition-all duration-300">
                      {converter.fromName} → {converter.toName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{converter.description}</p>
                    <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1 inline-block">
                      .{converter.from} to .{converter.to}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Font Converters Section */}
        {filteredFontConverters.length > 0 && (
          <section id="font-converters" className="mb-20 animate-slide-up delay-350">
            <div className="bg-gradient-to-r from-slate-50/50 to-zinc-50/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-500 to-zinc-500 rounded-2xl text-white text-3xl mb-4 animate-pulse hover:animate-bounce">
                  🔤
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-slate-600 to-zinc-600 bg-clip-text text-transparent">
                  Font Converters
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Convert font files between formats for web, desktop, and professional use
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredFontConverters.map((converter, index) => (
                  <Link
                    key={index}
                    href={`/${converter.from}-to-${converter.to}`}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${converter.gradient} rounded-xl text-white text-xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      {converter.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-slate-600 group-hover:to-zinc-600 group-hover:bg-clip-text transition-all duration-300">
                      {converter.fromName} → {converter.toName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{converter.description}</p>
                    <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1 inline-block">
                      .{converter.from} to .{converter.to}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PDF Converters Section */}
        {filteredPdfConverters.length > 0 && (
          <section id="pdf-converters" className="mb-20 animate-slide-up delay-400">
            <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white text-3xl mb-4 animate-bounce hover:animate-spin">
                  📄
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  PDF Tools
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Professional PDF conversion and manipulation tools for all your document needs
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {filteredPdfConverters.map((converter, index) => (
                  <Link
                    key={index}
                    href={converter.path}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${converter.gradient} rounded-xl text-white text-xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      {converter.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text transition-all duration-300">
                      {converter.fromName} → {converter.toName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{converter.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Document Converters Section */}
        {filteredDocumentConverters.length > 0 && (
          <section id="document-converters" className="mb-20 animate-slide-up delay-500">
            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-blue-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl text-white text-3xl mb-4 animate-pulse hover:animate-bounce">
                  📚
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Document Converters
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Convert e-books, academic papers, and document formats with professional quality
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDocumentConverters.map((converter, index) => (
                  <Link
                    key={index}
                    href={converter.path}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${converter.gradient} rounded-xl text-white text-xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      {converter.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text transition-all duration-300">
                      {converter.fromName} → {converter.toName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{converter.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Research Tools Section */}
        {filteredResearchTools.length > 0 && (
          <section id="research-tools" className="mb-20 animate-slide-up delay-550">
            <div className="bg-gradient-to-r from-violet-50/50 to-purple-50/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-violet-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl text-white text-3xl mb-4 animate-pulse hover:animate-bounce">
                  🔬
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Research & Academic Tools
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Professional tools for academic research, citations, and mathematical content
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredResearchTools.map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.path}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl text-white text-xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      {tool.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {tool.fromName} → {tool.toName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CAD & 3D Tools Section */}
        {filteredCadTools.length > 0 && (
          <section id="cad-tools" className="mb-20 animate-slide-up delay-600">
            <div className="bg-gradient-to-r from-orange-50/50 to-red-50/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-orange-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white text-3xl mb-4 animate-pulse hover:animate-bounce">
                  🎯
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  CAD & 3D Tools
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Professional 3D modeling and CAD file conversion for engineering and design
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {filteredCadTools.map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.path}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl text-white text-xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      {tool.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 group-hover:bg-clip-text transition-all duration-300">
                      {tool.fromName} → {tool.toName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Finance & Crypto Tools Section */}
        {filteredFinanceTools.length > 0 && (
          <section id="finance-tools" className="mb-20 animate-slide-up delay-650">
            <div className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-yellow-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl text-white text-3xl mb-4 animate-pulse hover:animate-bounce">
                  💰
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Finance & Crypto Tools
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Advanced financial calculators and crypto tools for yield farming and token analysis
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {filteredFinanceTools.map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.path}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl text-white text-xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      {tool.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-orange-600 group-hover:bg-clip-text transition-all duration-300">
                      {tool.fromName} → {tool.toName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Medical & Imaging Tools Section */}
        {filteredMedicalTools.length > 0 && (
          <section id="medical-tools" className="mb-20 animate-slide-up delay-700">
            <div className="bg-gradient-to-r from-cyan-50/50 to-blue-50/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-cyan-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl text-white text-3xl mb-4 animate-pulse hover:animate-bounce">
                  🏥
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Medical & Imaging Tools
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Professional medical imaging conversion tools for healthcare professionals
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-1">
                {filteredMedicalTools.map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.path}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl text-white text-xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      {tool.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                      {tool.fromName} → {tool.toName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Utility Tools Section */}
        {filteredUtilityTools.length > 0 && (
          <section id="utility-tools" className="mb-20 animate-slide-up delay-750">
            <div className="bg-gradient-to-r from-indigo-50/50 to-cyan-50/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-indigo-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl text-white text-3xl mb-4 animate-pulse hover:animate-bounce">
                  🛠️
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  Utility Tools
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Advanced tools for text extraction, QR code generation, and image optimization
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredUtilityTools.map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.path}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl text-white text-xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      {tool.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-cyan-600 group-hover:bg-clip-text transition-all duration-300">
                      {tool.fromName} → {tool.toName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* No Results Message */}
        {searchTerm && filteredImageConverters.length === 0 && filteredVideoConverters.length === 0 &&
         filteredAudioConverters.length === 0 && filteredFontConverters.length === 0 && filteredPdfConverters.length === 0 &&
         filteredDocumentConverters.length === 0 && filteredResearchTools.length === 0 && filteredCadTools.length === 0 &&
         filteredFinanceTools.length === 0 && filteredMedicalTools.length === 0 && filteredUtilityTools.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No converters found</h3>
            <p className="text-gray-600 mb-6">Try searching for a different format like "MP3", "PDF", or "PNG"</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Enhanced Stats */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-100/50 text-center mb-16 animate-slide-up delay-500">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-count-up">
                {imageConverters.length}
              </div>
              <div className="text-gray-600 group-hover:text-blue-600 transition-colors text-sm">Image Converters</div>
            </div>
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-count-up">
                {videoConverters.length}
              </div>
              <div className="text-gray-600 group-hover:text-red-600 transition-colors text-sm">Video Converters</div>
            </div>
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent mb-2 animate-count-up">
                {audioConverters.length}
              </div>
              <div className="text-gray-600 group-hover:text-purple-600 transition-colors text-sm">Audio Converters</div>
            </div>
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-slate-600 to-zinc-600 bg-clip-text text-transparent mb-2 animate-count-up">
                {fontConverters.length}
              </div>
              <div className="text-gray-600 group-hover:text-slate-600 transition-colors text-sm">Font Converters</div>
            </div>
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 animate-count-up">
                {pdfConverters.length}
              </div>
              <div className="text-gray-600 group-hover:text-green-600 transition-colors text-sm">PDF Tools</div>
            </div>
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 animate-count-up">
                {documentConverters.length}
              </div>
              <div className="text-gray-600 group-hover:text-blue-600 transition-colors text-sm">Document Tools</div>
            </div>
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-count-up">
                {researchTools.length}
              </div>
              <div className="text-gray-600 group-hover:text-violet-600 transition-colors text-sm">Research Tools</div>
            </div>
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2 animate-count-up">
                {cadTools.length}
              </div>
              <div className="text-gray-600 group-hover:text-orange-600 transition-colors text-sm">CAD & 3D Tools</div>
            </div>
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2 animate-count-up">
                {financeTools.length}
              </div>
              <div className="text-gray-600 group-hover:text-yellow-600 transition-colors text-sm">Finance Tools</div>
            </div>
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2 animate-count-up">
                {medicalTools.length}
              </div>
              <div className="text-gray-600 group-hover:text-cyan-600 transition-colors text-sm">Medical Tools</div>
            </div>
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2 animate-count-up">
                {utilityTools.length}
              </div>
              <div className="text-gray-600 group-hover:text-indigo-600 transition-colors text-sm">Utility Tools</div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-20 animate-slide-up delay-700">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Trusted by Millions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our users say about our conversion tools
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 text-lg">★★★★★</div>
                <span className="ml-2 text-sm text-gray-600">5.0/5</span>
              </div>
              <p className="text-gray-700 mb-4 italic">"The audio converter is incredibly fast! Converted my entire music library from FLAC to MP3 in minutes while maintaining perfect quality."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  M
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Music Producer</div>
                  <div className="text-sm text-gray-600">Professional User</div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 text-lg">★★★★★</div>
                <span className="ml-2 text-sm text-gray-600">5.0/5</span>
              </div>
              <p className="text-gray-700 mb-4 italic">"Best video converter I've used! The quality is outstanding and it handles all formats seamlessly. Saved me hours of work."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  S
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Content Creator</div>
                  <div className="text-sm text-gray-600">YouTube Channel</div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 text-lg">★★★★★</div>
                <span className="ml-2 text-sm text-gray-600">5.0/5</span>
              </div>
              <p className="text-gray-700 mb-4 italic">"The image converter handles everything perfectly. From HEIC to JPG, WebP to PNG - it just works! No more compatibility issues."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Photographer</div>
                  <div className="text-sm text-gray-600">Professional Studio</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 animate-slide-up delay-800">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500">
            <div className="text-5xl mb-6 group-hover:animate-bounce">⚡</div>
            <h3 className="font-black text-xl text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-orange-600 group-hover:bg-clip-text">
              Lightning Fast
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">Optimized algorithms ensure blazing-fast conversions without compromising quality</p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500">
            <div className="text-5xl mb-6 group-hover:animate-spin">🔒</div>
            <h3 className="font-black text-xl text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text">
              Bank-Level Security
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">Files automatically deleted after processing. Your privacy is our top priority</p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500">
            <div className="text-5xl mb-6 group-hover:animate-pulse">🎯</div>
            <h3 className="font-black text-xl text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text">
              Perfect Quality
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">Advanced compression maintains perfect quality while optimizing file size</p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500">
            <div className="text-5xl mb-6 group-hover:animate-bounce">💎</div>
            <h3 className="font-black text-xl text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text">
              Always Free
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">Premium features at zero cost. No hidden fees, no subscriptions required</p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20 animate-slide-up delay-900">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Common questions about our conversion tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Are the conversions really free?</h3>
              <p className="text-gray-700 leading-relaxed">Yes, absolutely! All our conversion tools are completely free to use with no hidden fees, registration requirements, or usage limits. We believe in providing premium quality tools accessible to everyone.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How secure are my files?</h3>
              <p className="text-gray-700 leading-relaxed">Your files are processed securely and automatically deleted from our servers after conversion. We use industry-standard security protocols and never store, share, or access your personal files.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What file sizes are supported?</h3>
              <p className="text-gray-700 leading-relaxed">We support large files: up to 5GB for videos, 1GB for audio files, 100MB for images, and 50MB for documents. This covers most use cases for both personal and professional needs.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Do I need to install any software?</h3>
              <p className="text-gray-700 leading-relaxed">No installation required! All conversions happen directly in your browser. Simply upload your files, select the target format, and download the converted files - it's that simple.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How fast are the conversions?</h3>
              <p className="text-gray-700 leading-relaxed">Conversion speeds vary by file size and format, but most files process within seconds to minutes. Our optimized servers ensure the fastest possible processing times while maintaining quality.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Is quality preserved during conversion?</h3>
              <p className="text-gray-700 leading-relaxed">Yes! We use advanced conversion algorithms that preserve maximum quality. For lossy formats, we use high-quality settings by default, and for lossless formats, quality is maintained perfectly.</p>
            </div>
          </div>
        </section>

        {/* Popular Conversions */}
        <section className="mb-20 animate-slide-up delay-1000">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Most Popular Conversions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick access to our most frequently used conversion tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/png-to-webp" className="group bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="text-3xl mb-3">🖼️</div>
              <h3 className="font-bold text-lg mb-2">PNG to WebP</h3>
              <p className="text-blue-100 text-sm">Reduce file size by 70%</p>
            </Link>

            <Link href="/mp4-to-mov" className="group bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="text-3xl mb-3">🎬</div>
              <h3 className="font-bold text-lg mb-2">MP4 to MOV</h3>
              <p className="text-red-100 text-sm">Perfect for Apple devices</p>
            </Link>

            <Link href="/wav-to-mp3" className="group bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl p-6 text-white text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="font-bold text-lg mb-2">WAV to MP3</h3>
              <p className="text-purple-100 text-sm">Compress without quality loss</p>
            </Link>

            <Link href="/convert-pdf-to-word-online" className="group bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="font-bold text-lg mb-2">PDF to Word</h3>
              <p className="text-green-100 text-sm">Make PDFs editable</p>
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl animate-slide-up delay-1100">
          <div className="text-white">
            <h2 className="text-4xl font-black mb-4">Ready to Convert Your Files?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Choose from {imageConverters.length + videoConverters.length + audioConverters.length + fontConverters.length + pdfConverters.length + documentConverters.length + researchTools.length + cadTools.length + financeTools.length + medicalTools.length + utilityTools.length}+ conversion tools and start converting now!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#image-converters" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Convert Images
              </a>
              <a href="#video-converters" className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Convert Videos
              </a>
              <a href="#audio-converters" className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Convert Audio
              </a>
              <a href="#font-converters" className="bg-white text-slate-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Convert Fonts
              </a>
              <a href="#pdf-converters" className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Convert PDFs
              </a>
              <a href="#document-converters" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Document Tools
              </a>
              <a href="#research-tools" className="bg-white text-violet-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Research Tools
              </a>
              <a href="#cad-tools" className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                CAD & 3D Tools
              </a>
              <a href="#finance-tools" className="bg-white text-yellow-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Finance Tools
              </a>
              <a href="#medical-tools" className="bg-white text-cyan-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Medical Tools
              </a>
              <a href="#utility-tools" className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Utility Tools
              </a>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <section className="text-center py-12 animate-slide-up delay-1200">
          <div className="text-gray-600">
            <p className="text-lg mb-4">
              FlipFileX - Your trusted partner for all file conversion needs
            </p>
            <p className="text-sm">
              Supporting {imageConverters.length + videoConverters.length + audioConverters.length + fontConverters.length + pdfConverters.length + documentConverters.length + researchTools.length + cadTools.length + financeTools.length + medicalTools.length + utilityTools.length}+ conversion formats |
              Millions of files converted daily |
              100% Free Forever
            </p>
          </div>
        </section>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes count-up {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-count-up {
          animation: count-up 0.8s ease-out;
        }
        
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-800 { animation-delay: 800ms; }
        .delay-900 { animation-delay: 900ms; }
        .delay-1000 { animation-delay: 1000ms; }
        .delay-1100 { animation-delay: 1100ms; }
        .delay-1200 { animation-delay: 1200ms; }
      `}</style>
    </div>
    </>
  );
}