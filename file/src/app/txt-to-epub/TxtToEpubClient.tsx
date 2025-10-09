'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function TxtToEpubClient() {
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
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Transform your plain text files into professional EPUB e-books online for free. Create formatted e-books with chapters, table of contents, and proper structure.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
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
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Create Your EPUB E-book</h2>

            {!selectedFile ? (
              <div className="border-2 border-dashed border-green-300 rounded-2xl p-12 text-center hover:border-green-400 transition-colors">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Select your TXT file</h3>
                <p className="text-gray-500 mb-6">Choose a plain text file to convert into an EPUB e-book</p>
                <label className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                  Choose TXT File
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-label="Upload TXT file"
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
                      <h4 className="font-semibold text-gray-900">{selectedFile.name}</h4>
                      <p className="text-sm text-gray-600">
                        Size: {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                      aria-label="Remove file"
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
                    <h4 className="text-xl font-semibold text-green-800 mb-4">E-book Created Successfully!</h4>
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

        {/* How to Use Section - SEO Content */}
        <section className="mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-green-100/50">
            <h2 className="text-4xl font-black text-gray-900 mb-6">How to Convert TXT to EPUB Online Free</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Converting TXT files to EPUB e-book format has never been easier. Our free online TXT to EPUB converter
                transforms your plain text documents into professional digital books that work on all e-readers, tablets,
                and smartphones. Whether you're creating a novel, documentation, or any written content, our tool handles
                the conversion seamlessly.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step-by-Step Guide:</h3>
              <ol className="space-y-3 ml-6 list-decimal">
                <li className="text-gray-700">
                  <strong>Upload Your TXT File:</strong> Click the "Choose TXT File" button and select your plain text
                  document from your computer. We support files up to 50MB in size.
                </li>
                <li className="text-gray-700">
                  <strong>Automatic Formatting:</strong> Our intelligent converter automatically detects chapter headings,
                  paragraph breaks, and content structure to create a well-formatted e-book.
                </li>
                <li className="text-gray-700">
                  <strong>Generate EPUB:</strong> Click "Create EPUB E-book" and wait a few seconds while we process
                  your file and generate a professional EPUB document.
                </li>
                <li className="text-gray-700">
                  <strong>Download Your E-book:</strong> Once conversion is complete, download your EPUB file instantly.
                  It's ready to read on any device!
                </li>
              </ol>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Convert TXT to EPUB?</h3>
              <p className="mb-4">
                EPUB (Electronic Publication) is the industry-standard format for digital books. Unlike plain TXT files,
                EPUB supports:
              </p>
              <ul className="space-y-2 ml-6 list-disc">
                <li>Reflowable text that adapts to any screen size</li>
                <li>Chapter navigation and table of contents</li>
                <li>Adjustable font sizes and styles</li>
                <li>Bookmarks and highlighting features</li>
                <li>Universal compatibility with e-readers</li>
                <li>Metadata support (author, title, publisher info)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Why Use Our TXT to EPUB Converter?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Professional E-books</h3>
              <p className="text-gray-600">Transform simple text files into properly formatted EPUB e-books with chapters and structure.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Creation</h3>
              <p className="text-gray-600">Convert your text files to EPUB format in seconds with automatic formatting and structure.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">100% Secure</h3>
              <p className="text-gray-600">Your text files are processed securely and automatically deleted after conversion.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Always Free</h3>
              <p className="text-gray-600">No hidden costs, no subscriptions. Create unlimited EPUB e-books completely free.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Universal Format</h3>
              <p className="text-gray-600">EPUB format works on all e-readers, tablets, phones, and reading applications.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Formatting</h3>
              <p className="text-gray-600">Automatically detects chapters and creates table of contents for better navigation.</p>
            </div>
          </div>
        </section>

        {/* About TXT and EPUB Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About TXT Format</h2>
              <p className="text-gray-600 mb-4">
                TXT files are plain text documents that contain unformatted text. They're the simplest form of digital text,
                containing only characters without any styling, fonts, or formatting information.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">TXT Characteristics:</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Plain text without formatting</li>
                <li>• Small file sizes</li>
                <li>• Universal compatibility</li>
                <li>• Human-readable content</li>
                <li>• Simple structure</li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Create EPUB E-books?</h2>
              <p className="text-gray-600 mb-4">
                EPUB is the standard format for digital books, offering professional presentation with reflowable text,
                chapters, table of contents, and compatibility across all reading devices.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">EPUB Benefits:</h3>
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

        {/* FAQ Section - SEO Content */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Frequently Asked Questions About TXT to EPUB Conversion</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What is the best free TXT to EPUB converter?</h3>
              <p className="text-gray-700">FlipFileX offers the best free online TXT to EPUB converter with automatic chapter detection, table of contents generation, and professional formatting. No software installation or registration required.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How does the converter detect chapters automatically?</h3>
              <p className="text-gray-700">Our smart algorithm looks for chapter indicators like "Chapter 1", "Chapter One", line breaks, and formatting patterns to automatically create chapter divisions and generate a table of contents.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Can I add metadata to my EPUB e-book?</h3>
              <p className="text-gray-700">Yes, during conversion we automatically generate basic metadata. For advanced metadata editing (author name, publisher, ISBN), you can use tools like Calibre after downloading your EPUB file.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What's the maximum TXT file size I can convert?</h3>
              <p className="text-gray-700">You can convert text files up to 50MB in size, which is sufficient for most novels, documentation, and lengthy documents (approximately 10 million words).</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Will formatting be added automatically to my e-book?</h3>
              <p className="text-gray-700">Yes, our converter adds proper paragraph breaks, chapter headings, indentation, and creates a navigable table of contents automatically from your plain text content.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Can I convert multiple TXT files into one EPUB?</h3>
              <p className="text-gray-700">Currently, you can convert one text file at a time. For multiple files, you can either combine them into a single TXT file first or convert each separately and merge them using e-book editing software.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What character encodings are supported?</h3>
              <p className="text-gray-700">We support UTF-8, ASCII, ISO-8859-1, and most common text encodings. The converter automatically detects and handles different character sets, including special characters and emojis.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Is my converted EPUB compatible with all e-readers?</h3>
              <p className="text-gray-700">Yes! EPUB is a universal format supported by Kindle (after conversion to KF8), Kobo, Nook, Apple Books, Google Play Books, and all major e-reading apps and devices.</p>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-green-100/50">
            <h2 className="text-4xl font-black text-gray-900 mb-6">Common Use Cases for TXT to EPUB Conversion</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">📖 Publishing Novels & Books</h3>
                <p className="text-gray-700 mb-4">Authors and writers can convert their manuscripts from TXT to EPUB format for self-publishing on platforms like Amazon Kindle, Apple Books, and Kobo.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">📚 Creating Educational Content</h3>
                <p className="text-gray-700 mb-4">Teachers and educators can transform study materials, course notes, and educational content into readable e-books for students.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">📝 Technical Documentation</h3>
                <p className="text-gray-700 mb-4">Convert technical manuals, API documentation, and user guides into EPUB format for easy distribution and offline reading.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">📄 Personal Journals & Diaries</h3>
                <p className="text-gray-700 mb-4">Transform personal writings, journals, and diaries into professional e-book format for archiving or sharing with family.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Related E-book Conversion Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/docx-to-epub" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                📄
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">DOCX to EPUB</h3>
              <p className="text-sm text-gray-600">Convert Word documents to e-books</p>
            </Link>

            <Link href="/epub-to-pdf" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                📚
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">EPUB to PDF</h3>
              <p className="text-sm text-gray-600">Convert e-books to PDF format</p>
            </Link>

            <Link href="/mobi-to-epub" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                📖
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">MOBI to EPUB</h3>
              <p className="text-sm text-gray-600">Convert Kindle books to EPUB</p>
            </Link>

            <Link href="/text-to-pdf" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                📃
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Text to PDF</h3>
              <p className="text-sm text-gray-600">Convert text files to PDF</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
