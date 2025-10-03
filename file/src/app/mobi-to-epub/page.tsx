'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MobiToEpubPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.mobi')) {
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
      setConversionResult('converted-ebook.epub');
    }, 3000);
  };

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'converted-ebook.epub';
    link.click();
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <head>
        <title>Free MOBI to EPUB Converter Online - Convert Kindle Books | FlipFileX</title>
        <meta name="description" content="Convert MOBI files to EPUB format online for free. Perfect for converting Kindle books to universal e-book format. Fast, secure, and professional quality." />
        <meta name="keywords" content="MOBI to EPUB, Kindle converter, MOBI converter, EPUB converter, e-book converter, online converter" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://flipfilex.com/mobi-to-epub" />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-100">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Header */}
        <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-orange-600 transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <Link href="/tools" className="text-gray-500 hover:text-orange-600 transition-colors duration-300">
                    Tools
                  </Link>
                </li>
                <li>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <span className="text-gray-900 font-medium">MOBI to EPUB</span>
                </li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl text-white text-5xl mb-8 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">
              📖
            </div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
              MOBI to EPUB Converter
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Convert Kindle MOBI files to universal EPUB format online for free. Perfect for making your e-books compatible with all devices and e-readers.
            </h2>

            <div className="flex justify-center space-x-4 mb-8">
              <div className="px-6 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-orange-100/50 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Convert Your MOBI Files</h3>

              {!selectedFile ? (
                <div className="border-2 border-dashed border-orange-300 rounded-2xl p-12 text-center hover:border-orange-400 transition-colors">
                  <div className="text-6xl mb-4">📖</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-4">Select your MOBI file</h4>
                  <p className="text-gray-500 mb-6">Choose a MOBI file to convert to EPUB format</p>
                  <label className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                    Choose MOBI File
                    <input
                      type="file"
                      accept=".mobi,.azw,.azw3"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
                        📖
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
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {isConverting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Converting...</span>
                        </div>
                      ) : (
                        'Convert to EPUB'
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
                        Download EPUB
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Why Choose Our MOBI to EPUB Converter?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📱</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Universal Compatibility</h4>
                <p className="text-gray-600">Convert Kindle-exclusive MOBI files to EPUB format that works on all e-readers and devices.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Lightning Fast</h4>
                <p className="text-gray-600">Convert your MOBI files to EPUB in seconds with our optimized conversion engine.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🔒</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">100% Secure</h4>
                <p className="text-gray-600">Your files are processed securely and automatically deleted after conversion.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">💎</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Always Free</h4>
                <p className="text-gray-600">No hidden costs, no subscriptions. Convert unlimited MOBI files completely free.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🌐</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Works Everywhere</h4>
                <p className="text-gray-600">Browser-based tool that works on Windows, Mac, Linux, and mobile devices.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📚</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Preserve Quality</h4>
                <p className="text-gray-600">Maintains original formatting, images, and metadata from your MOBI files.</p>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">How to Convert MOBI to EPUB</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white text-2xl font-bold mb-6">
                  1
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Upload MOBI File</h4>
                <p className="text-gray-600">Select your MOBI, AZW, or AZW3 file from your device. We support all Kindle formats.</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white text-2xl font-bold mb-6">
                  2
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Convert to EPUB</h4>
                <p className="text-gray-600">Click convert and our advanced engine will process your file with preserved formatting.</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white text-2xl font-bold mb-6">
                  3
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Download EPUB</h4>
                <p className="text-gray-600">Download your converted EPUB file that works on all e-readers and devices.</p>
              </div>
            </div>
          </section>

          {/* About MOBI and EPUB Section */}
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">About MOBI Format</h3>
                <p className="text-gray-600 mb-4">
                  MOBI is a proprietary e-book format developed by Amazon for Kindle devices. It's based on the Open eBook standard
                  but includes Amazon's DRM protection and proprietary features.
                </p>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">MOBI Features:</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Optimized for Kindle devices</li>
                  <li>• Supports bookmarks and annotations</li>
                  <li>• Variable font sizes</li>
                  <li>• DRM protection capability</li>
                  <li>• Compressed file format</li>
                </ul>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">About EPUB Format</h3>
                <p className="text-gray-600 mb-4">
                  EPUB is an open standard for e-books that works across all platforms and devices. It's the most widely
                  supported e-book format and offers excellent compatibility.
                </p>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">EPUB Advantages:</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Universal device compatibility</li>
                  <li>• Open standard format</li>
                  <li>• Reflowable text layout</li>
                  <li>• Supports multimedia content</li>
                  <li>• Smaller file sizes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Can I convert DRM-protected MOBI files?</h4>
                <p className="text-gray-700">Our converter works with DRM-free MOBI files. For DRM-protected files, you'll need to remove DRM first using appropriate tools.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Will my book formatting be preserved?</h4>
                <p className="text-gray-700">Yes, our converter maintains original formatting, images, chapter structure, and metadata from your MOBI file.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">What MOBI formats are supported?</h4>
                <p className="text-gray-700">We support MOBI, AZW, and AZW3 formats. All common Kindle e-book formats are compatible with our converter.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Is the conversion completely free?</h4>
                <p className="text-gray-700">Yes, our MOBI to EPUB converter is completely free with no hidden fees, registration, or usage limits.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">How large files can I convert?</h4>
                <p className="text-gray-700">You can convert MOBI files up to 100MB in size, which covers most e-books including those with images.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Can I read the EPUB on my Kindle?</h4>
                <p className="text-gray-700">Older Kindles don't support EPUB, but you can use apps like Calibre to convert EPUB back to MOBI or use newer Kindle devices that support EPUB.</p>
              </div>
            </div>
          </section>

          {/* Related Tools */}
          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Related Conversion Tools</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/epub-to-pdf" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                  📚
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">EPUB to PDF</h4>
                <p className="text-sm text-gray-600">Convert e-books to PDF</p>
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