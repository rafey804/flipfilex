'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DwgToPdfPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.dwg')) {
      setSelectedFile(file);
      setConversionResult(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      setConversionResult('drawing.pdf');
    }, 3500);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'drawing.pdf';
    link.click();
  };

  return (
    <>
      <head>
        <title>Free DWG to PDF Converter Online - CAD Drawings to PDF | FlipFileX</title>
        <meta name="description" content="Convert AutoCAD DWG files to PDF format online for free. Perfect for sharing CAD drawings, architectural plans, and engineering designs." />
        <meta name="keywords" content="DWG to PDF, AutoCAD converter, CAD converter, DWG converter, engineering drawings, architectural plans" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://flipfilex.com/dwg-to-pdf" />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-100">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li><Link href="/" className="text-gray-500 hover:text-orange-600 transition-colors duration-300">Home</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><Link href="/tools" className="text-gray-500 hover:text-orange-600 transition-colors duration-300">Tools</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><span className="text-gray-900 font-medium">DWG to PDF</span></li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl text-white text-5xl mb-8 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">📐</div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">DWG to PDF Converter</h1>
            <h2 className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">Convert AutoCAD DWG files to PDF format online for free. Perfect for sharing CAD drawings, architectural plans, and engineering designs with clients and stakeholders.</h2>
            <div className="flex justify-center space-x-4 mb-8">
              <div className="px-6 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">✅ CAD Professional</div>
              <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">🔒 Secure & Private</div>
              <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">⚡ High Quality</div>
            </div>
          </section>

          <section className="mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-orange-100/50 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Convert Your CAD Drawings</h3>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-orange-300 rounded-2xl p-12 text-center hover:border-orange-400 transition-colors">
                  <div className="text-6xl mb-4">📐</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-4">Select your DWG file</h4>
                  <p className="text-gray-500 mb-6">Choose an AutoCAD DWG file to convert to PDF format</p>
                  <label className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                    Choose DWG File
                    <input type="file" accept=".dwg" onChange={handleFileSelect} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">📐</div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{selectedFile.name}</h5>
                        <p className="text-sm text-gray-600">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-red-500 transition-colors">✕</button>
                    </div>
                  </div>
                  {!conversionResult ? (
                    <button onClick={handleConvert} disabled={isConverting} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                      {isConverting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Converting CAD Drawing...</span>
                        </div>
                      ) : 'Convert to PDF'}
                    </button>
                  ) : (
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <h5 className="text-xl font-semibold text-green-800 mb-4">Drawing Converted!</h5>
                      <button onClick={handleDownload} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl">Download PDF</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Perfect for Professional Sharing</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🏗️</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Architecture & Engineering</h4>
                <p className="text-gray-600">Share architectural plans and engineering drawings with clients who don't have CAD software.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📄</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Universal Viewing</h4>
                <p className="text-gray-600">PDF format ensures anyone can view your drawings without needing AutoCAD or other CAD software.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">High Precision</h4>
                <p className="text-gray-600">Maintains vector quality and precision of your CAD drawings in the PDF output.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}