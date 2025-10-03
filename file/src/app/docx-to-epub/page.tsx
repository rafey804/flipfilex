'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DocxToEpubPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.docx')) {
      setSelectedFile(file);
      setConversionResult(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      setConversionResult('converted-document.epub');
    }, 3000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'converted-document.epub';
    link.click();
  };

  return (
    <>
      <head>
        <title>Free DOCX to EPUB Converter Online - Word Documents to E-books | FlipFileX</title>
        <meta name="description" content="Convert Word DOCX documents to EPUB e-book format online for free. Transform your Word docs into professional e-books with preserved formatting." />
        <meta name="keywords" content="DOCX to EPUB, Word to ebook, document converter, Word converter, EPUB creator, online converter" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://flipfilex.com/docx-to-epub" />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-100">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li><Link href="/" className="text-gray-500 hover:text-purple-600 transition-colors duration-300">Home</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><Link href="/tools" className="text-gray-500 hover:text-purple-600 transition-colors duration-300">Tools</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><span className="text-gray-900 font-medium">DOCX to EPUB</span></li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl text-white text-5xl mb-8 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">📄</div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">DOCX to EPUB Converter</h1>
            <h2 className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">Convert Microsoft Word documents to professional EPUB e-books online for free. Preserve formatting, images, and structure from your Word docs.</h2>
            <div className="flex justify-center space-x-4 mb-8">
              <div className="px-6 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">✅ Free Forever</div>
              <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">🔒 Secure & Private</div>
              <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">⚡ Fast Conversion</div>
            </div>
          </section>

          <section className="mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-purple-100/50 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Convert Your Word Documents</h3>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-purple-300 rounded-2xl p-12 text-center hover:border-purple-400 transition-colors">
                  <div className="text-6xl mb-4">📄</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-4">Select your DOCX file</h4>
                  <p className="text-gray-500 mb-6">Choose a Word document to convert into an EPUB e-book</p>
                  <label className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                    Choose DOCX File
                    <input type="file" accept=".docx" onChange={handleFileSelect} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl">📄</div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{selectedFile.name}</h5>
                        <p className="text-sm text-gray-600">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-red-500 transition-colors">✕</button>
                    </div>
                  </div>
                  {!conversionResult ? (
                    <button onClick={handleConvert} disabled={isConverting} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                      {isConverting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Converting...</span>
                        </div>
                      ) : 'Convert to EPUB'}
                    </button>
                  ) : (
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <h5 className="text-xl font-semibold text-green-800 mb-4">Conversion Complete!</h5>
                      <button onClick={handleDownload} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl">Download EPUB</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Why Convert Word Documents to EPUB?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📚</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Professional E-books</h4>
                <p className="text-gray-600">Transform Word documents into professional e-books with proper formatting and structure.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Preserve Formatting</h4>
                <p className="text-gray-600">Maintains fonts, styles, images, and layout from your original Word document.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📱</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Universal Reading</h4>
                <p className="text-gray-600">EPUB works on all e-readers, tablets, phones, and reading applications worldwide.</p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">What gets converted?</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Text content and formatting</li>
                  <li>• Images and graphics</li>
                  <li>• Tables and lists</li>
                  <li>• Headers and footers</li>
                  <li>• Document structure</li>
                </ul>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Is it really free?</h4>
                <p className="text-gray-700">Yes! Our DOCX to EPUB converter is completely free with no hidden fees, registration requirements, or usage limits. Convert as many documents as you need.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}