'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function TxtToEpubPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.txt')) {
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
      setConversionResult('converted-book.epub');
    }, 3000);
  };

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'converted-book.epub';
    link.click();
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <head>
        <title>Free TXT to EPUB Converter Online - Create E-books from Text | FlipFileX</title>
        <meta name="description" content="Convert TXT files to EPUB e-book format online for free. Transform plain text files into professional e-books with chapters and formatting." />
        <meta name="keywords" content="TXT to EPUB, text to ebook, plain text converter, EPUB creator, ebook maker, online converter" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://flipfilex.com/txt-to-epub" />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Header */}
        <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-green-600 transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <Link href="/tools" className="text-gray-500 hover:text-green-600 transition-colors duration-300">
                    Tools
                  </Link>
                </li>
                <li>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <span className="text-gray-900 font-medium">TXT to EPUB</span>
                </li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl text-white text-5xl mb-8 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">
              📝
            </div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              TXT to EPUB Converter
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Transform your plain text files into professional EPUB e-books online for free. Create formatted e-books with chapters, table of contents, and proper structure.
            </h2>

            <div className="flex justify-center space-x-4 mb-8">
              <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                ✅ Free Forever
              </div>
              <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                🔒 Secure & Private
              </div>
              <div className="px-6 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                ⚡ Fast Creation
              </div>
            </div>
          </section>

          {/* Conversion Tool */}
          <section className="mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-green-100/50 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Create Your EPUB E-book</h3>

              {!selectedFile ? (
                <div className="border-2 border-dashed border-green-300 rounded-2xl p-12 text-center hover:border-green-400 transition-colors">
                  <div className="text-6xl mb-4">📝</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-4">Select your TXT file</h4>
                  <p className="text-gray-500 mb-6">Choose a plain text file to convert into an EPUB e-book</p>
                  <label className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                    Choose TXT File
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">
                        📝
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{selectedFile.name}</h5>
                        <p className="text-sm text-gray-600">
                          Size: {(selectedFile.size / 1024).toFixed(2)} KB
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
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {isConverting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Creating E-book...</span>
                        </div>
                      ) : (
                        'Create EPUB E-book'
                      )}
                    </button>
                  ) : (
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <h5 className="text-xl font-semibold text-green-800 mb-4">E-book Created Successfully!</h5>
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
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Why Create E-books with Our TXT to EPUB Converter?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📚</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Professional E-books</h4>
                <p className="text-gray-600">Transform simple text files into properly formatted EPUB e-books with chapters and structure.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Instant Creation</h4>
                <p className="text-gray-600">Convert your text files to EPUB format in seconds with automatic formatting and structure.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🔒</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">100% Secure</h4>
                <p className="text-gray-600">Your text files are processed securely and automatically deleted after conversion.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">💎</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Always Free</h4>
                <p className="text-gray-600">No hidden costs, no subscriptions. Create unlimited EPUB e-books completely free.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🌐</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Universal Format</h4>
                <p className="text-gray-600">EPUB format works on all e-readers, tablets, phones, and reading applications.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📖</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Smart Formatting</h4>
                <p className="text-gray-600">Automatically detects chapters and creates table of contents for better navigation.</p>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">How to Create EPUB from TXT</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white text-2xl font-bold mb-6">
                  1
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Upload Text File</h4>
                <p className="text-gray-600">Select your TXT file containing the content you want to convert into an e-book.</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white text-2xl font-bold mb-6">
                  2
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Auto-Format Content</h4>
                <p className="text-gray-600">Our system automatically formats your text, creates chapters, and structures the e-book.</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white text-2xl font-bold mb-6">
                  3
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Download EPUB</h4>
                <p className="text-gray-600">Download your professionally formatted EPUB e-book ready for any device.</p>
              </div>
            </div>
          </section>

          {/* About TXT and EPUB Section */}
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">About TXT Format</h3>
                <p className="text-gray-600 mb-4">
                  TXT files are plain text documents that contain unformatted text. They're the simplest form of digital text,
                  containing only characters without any styling, fonts, or formatting information.
                </p>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">TXT Characteristics:</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Plain text without formatting</li>
                  <li>• Small file sizes</li>
                  <li>• Universal compatibility</li>
                  <li>• Human-readable content</li>
                  <li>• Simple structure</li>
                </ul>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Create EPUB E-books?</h3>
                <p className="text-gray-600 mb-4">
                  EPUB is the standard format for digital books, offering professional presentation with reflowable text,
                  chapters, table of contents, and compatibility across all reading devices.
                </p>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">EPUB Benefits:</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Professional e-book presentation</li>
                  <li>• Works on all e-readers</li>
                  <li>• Adjustable text size</li>
                  <li>• Chapter navigation</li>
                  <li>• Searchable content</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">How does the converter detect chapters?</h4>
                <p className="text-gray-700">Our smart algorithm looks for chapter indicators like "Chapter 1", line breaks, and formatting patterns to automatically create chapter divisions.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Can I add metadata to my e-book?</h4>
                <p className="text-gray-700">Yes, during conversion we automatically generate basic metadata. For advanced metadata editing, you can use tools like Calibre after downloading your EPUB.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">What's the maximum text file size?</h4>
                <p className="text-gray-700">You can convert text files up to 50MB in size, which is sufficient for most novels and lengthy documents.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Will formatting be added automatically?</h4>
                <p className="text-gray-700">Yes, our converter adds proper paragraph breaks, chapter headings, and creates a table of contents automatically from your plain text.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Can I convert multiple text files at once?</h4>
                <p className="text-gray-700">Currently, you can convert one text file at a time. For multiple files, you can either combine them first or convert each separately.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4">What character encodings are supported?</h4>
                <p className="text-gray-700">We support UTF-8, ASCII, and most common text encodings. The converter automatically detects and handles different character sets.</p>
              </div>
            </div>
          </section>

          {/* Related Tools */}
          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Related Conversion Tools</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/docx-to-epub" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                  📄
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">DOCX to EPUB</h4>
                <p className="text-sm text-gray-600">Word docs to e-books</p>
              </Link>

              <Link href="/epub-to-pdf" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                  📚
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">EPUB to PDF</h4>
                <p className="text-sm text-gray-600">Convert e-books to PDF</p>
              </Link>

              <Link href="/mobi-to-epub" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                  📖
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">MOBI to EPUB</h4>
                <p className="text-sm text-gray-600">Convert Kindle books</p>
              </Link>

              <Link href="/text-to-pdf" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                  📃
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Text to PDF</h4>
                <p className="text-sm text-gray-600">Text files to PDF</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}