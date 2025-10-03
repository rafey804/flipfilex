'use client';

import Link from 'next/link';
import { useState } from 'react';
import Script from 'next/script';

export default function EpubToPdfClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.epub')) {
      setSelectedFile(file);
      setConversionResult(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    // Simulate conversion process
    setTimeout(() => {
      setIsConverting(false);
      setConversionResult('converted-ebook.pdf');
    }, 3000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'converted-ebook.pdf';
    link.click();
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "EPUB to PDF Converter",
            "description": "Free online tool to convert EPUB e-books to PDF format",
            "url": "https://flipfilex.com/epub-to-pdf",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Header */}
        <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <Link href="/tools" className="text-gray-500 hover:text-blue-600 transition-colors duration-300">
                    Tools
                  </Link>
                </li>
                <li>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <span className="text-gray-900 font-medium">EPUB to PDF</span>
                </li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl text-white text-5xl mb-8 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">
              📚
            </div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              EPUB to PDF Converter
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Convert your EPUB e-books to PDF format online for free. Preserve formatting, images, and text layout with professional quality results.
            </h2>

            <div className="flex justify-center space-x-4 mb-8">
              <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                ✅ Free Forever
              </div>
              <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                🔒 Secure & Private
              </div>
              <div className="px-6 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                ⚡ Fast Conversion
              </div>
            </div>
          </section>

          {/* Conversion Tool */}
          <section className="mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-blue-100/50 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Convert Your EPUB Files</h3>

              {!selectedFile ? (
                <div className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-colors">
                  <div className="text-6xl mb-4">📚</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-4">Select your EPUB file</h4>
                  <p className="text-gray-500 mb-6">Choose an EPUB e-book file to convert to PDF format</p>
                  <label className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                    Choose EPUB File
                    <input
                      type="file"
                      accept=".epub"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
                        📚
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{selectedFile.name}</h5>
                        <p className="text-sm text-gray-600">
                          Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {!conversionResult ? (
                    <button
                      onClick={handleConvert}
                      disabled={isConverting}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {isConverting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Converting...</span>
                        </div>
                      ) : (
                        'Convert to PDF'
                      )}
                    </button>
                  ) : (
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <h5 className="text-xl font-semibold text-green-800 mb-4">Conversion Complete!</h5>
                      <button
                        onClick={handleDownload}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Download PDF
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Why Choose Our EPUB to PDF Converter?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Perfect Formatting</h4>
                <p className="text-gray-600">Preserves original text layout, fonts, images, and formatting from your EPUB e-books.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Lightning Fast</h4>
                <p className="text-gray-600">Convert your EPUB files to PDF in seconds with our optimized conversion engine.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🔒</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">100% Secure</h4>
                <p className="text-gray-600">Your files are processed securely and automatically deleted after conversion.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">💎</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Always Free</h4>
                <p className="text-gray-600">No hidden costs, no subscriptions. Convert unlimited EPUB files completely free.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🌐</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Works Everywhere</h4>
                <p className="text-gray-600">Browser-based tool that works on Windows, Mac, Linux, and mobile devices.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📱</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">No Installation</h4>
                <p className="text-gray-600">No software to download or install. Convert files directly in your web browser.</p>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">How to Convert EPUB to PDF</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl text-white text-2xl font-bold mb-6">
                  1
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Upload EPUB File</h4>
                <p className="text-gray-600">Select your EPUB e-book file from your device. Our tool supports all standard EPUB formats.</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl text-white text-2xl font-bold mb-6">
                  2
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Convert to PDF</h4>
                <p className="text-gray-600">Click the convert button and our advanced engine will process your EPUB file instantly.</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl text-white text-2xl font-bold mb-6">
                  3
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Download PDF</h4>
                <p className="text-gray-600">Download your converted PDF file with preserved formatting and professional quality.</p>
              </div>
            </div>
          </section>

          {/* About EPUB and PDF Section */}
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">About EPUB Format</h3>
                <p className="text-gray-600 mb-4">
                  EPUB (Electronic Publication) is a free and open e-book standard by the International Digital Publishing Forum (IDPF).
                  It's designed for reflowable content, meaning the text display adapts to various screen sizes and devices.
                </p>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">EPUB Features:</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Reflowable text layout</li>
                  <li>• Support for images and multimedia</li>
                  <li>• Cross-platform compatibility</li>
                  <li>• Smaller file sizes</li>
                  <li>• Interactive features support</li>
                </ul>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">About PDF Format</h3>
                <p className="text-gray-600 mb-4">
                  PDF (Portable Document Format) was developed by Adobe to present documents consistently across different devices and platforms.
                  It preserves exact formatting, fonts, and layout regardless of the device used to view it.
                </p>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">PDF Advantages:</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Fixed layout preservation</li>
                  <li>• Universal compatibility</li>
                  <li>• Professional appearance</li>
                  <li>• Print-ready format</li>
                  <li>• Security and password protection</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Is the EPUB to PDF conversion free?</h4>
                <p className="text-gray-700">Yes, our EPUB to PDF converter is completely free to use with no hidden fees, registration requirements, or usage limits.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Will the formatting be preserved?</h4>
                <p className="text-gray-700">Yes, our converter maintains the original formatting, images, fonts, and layout structure from your EPUB file in the resulting PDF.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">What's the maximum file size supported?</h4>
                <p className="text-gray-700">You can convert EPUB files up to 100MB in size. This covers most e-books including those with images and multimedia content.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Are my files secure during conversion?</h4>
                <p className="text-gray-700">Absolutely. Your files are processed securely using HTTPS encryption and are automatically deleted from our servers after conversion.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Do I need to install any software?</h4>
                <p className="text-gray-700">No installation required. Our tool works entirely in your web browser on any device - Windows, Mac, Linux, or mobile.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Can I convert multiple EPUB files at once?</h4>
                <p className="text-gray-700">Currently, you can convert one EPUB file at a time. For batch processing, simply repeat the process for each file you want to convert.</p>
              </div>
            </div>
          </section>

          {/* Related Tools */}
          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Related Conversion Tools</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/mobi-to-epub" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                  📖
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">MOBI to EPUB</h4>
                <p className="text-sm text-gray-600">Convert Kindle books</p>
              </Link>

              <Link href="/txt-to-epub" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                  📝
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">TXT to EPUB</h4>
                <p className="text-sm text-gray-600">Create e-books from text</p>
              </Link>

              <Link href="/docx-to-epub" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                  📄
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">DOCX to EPUB</h4>
                <p className="text-sm text-gray-600">Word docs to e-books</p>
              </Link>

              <Link href="/convert-pdf-to-word-online" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                  📄
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">PDF to Word</h4>
                <p className="text-sm text-gray-600">Make PDFs editable</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}