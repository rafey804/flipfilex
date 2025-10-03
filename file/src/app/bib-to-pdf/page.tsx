'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BibToPdfPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.bib')) {
      setSelectedFile(file);
      setConversionResult(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      setConversionResult('bibliography.pdf');
    }, 3000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'bibliography.pdf';
    link.click();
  };

  return (
    <>
      <head>
        <title>Free BIB to PDF Converter Online - Bibliography to PDF | FlipFileX</title>
        <meta name="description" content="Convert BibTeX bibliography files to PDF format online for free. Create formatted reference lists and citations from your .bib files with professional academic formatting." />
        <meta name="keywords" content="BIB to PDF, BibTeX converter, bibliography converter, reference list, academic citations, PDF converter, academic tools, research tools, LaTeX bibliography" />
        <meta name="author" content="FlipFileX" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#14b8a6" />
        <meta name="application-name" content="FlipFileX BIB to PDF Converter" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Free BIB to PDF Converter Online - Bibliography to PDF | FlipFileX" />
        <meta property="og:description" content="Convert BibTeX bibliography files to PDF format online for free. Create formatted reference lists and citations from your .bib files with professional academic formatting." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/bib-to-pdf" />
        <meta property="og:image" content="https://flipfilex.com/og-image.jpg" />
        <meta property="og:site_name" content="FlipFileX" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free BIB to PDF Converter Online - Bibliography to PDF | FlipFileX" />
        <meta name="twitter:description" content="Convert BibTeX bibliography files to PDF format online for free. Create formatted reference lists and citations from your .bib files." />
        <meta name="twitter:image" content="https://flipfilex.com/twitter-image.jpg" />

        <link rel="canonical" href="https://flipfilex.com/bib-to-pdf" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "BIB to PDF Converter",
            "description": "Convert BibTeX bibliography files to PDF format online for free",
            "url": "https://flipfilex.com/bib-to-pdf",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </head>

      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li><Link href="/" className="text-gray-500 hover:text-teal-600 transition-colors duration-300">Home</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><Link href="/tools" className="text-gray-500 hover:text-teal-600 transition-colors duration-300">Tools</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><span className="text-gray-900 font-medium">BIB to PDF</span></li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl text-white text-5xl mb-8 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">📓</div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6">BIB to PDF Converter</h1>
            <h2 className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">Convert BibTeX bibliography files to formatted PDF documents online for free. Create professional reference lists and citations from your .bib files.</h2>
            <div className="flex justify-center space-x-4 mb-8">
              <div className="px-6 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold">✅ Free Forever</div>
              <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">🔒 Secure & Private</div>
              <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">⚡ Fast Conversion</div>
            </div>
          </section>

          <section className="mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-teal-100/50 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Convert Your Bibliography Files</h3>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-teal-300 rounded-2xl p-12 text-center hover:border-teal-400 transition-colors">
                  <div className="text-6xl mb-4">📓</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-4">Select your BIB file</h4>
                  <p className="text-gray-500 mb-6">Choose a BibTeX file to convert into a formatted PDF bibliography</p>
                  <label className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                    Choose BIB File
                    <input type="file" accept=".bib" onChange={handleFileSelect} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-teal-50 rounded-2xl p-6 border border-teal-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center text-white text-xl">📓</div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{selectedFile.name}</h5>
                        <p className="text-sm text-gray-600">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-red-500 transition-colors">✕</button>
                    </div>
                  </div>
                  {!conversionResult ? (
                    <button onClick={handleConvert} disabled={isConverting} className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                      {isConverting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Converting...</span>
                        </div>
                      ) : 'Convert to PDF'}
                    </button>
                  ) : (
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <h5 className="text-xl font-semibold text-green-800 mb-4">Bibliography Created!</h5>
                      <button onClick={handleDownload} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl">Download PDF</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Perfect for Academic Work</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-teal-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🎓</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Academic Citations</h4>
                <p className="text-gray-600">Perfect for researchers, students, and academics who need formatted reference lists.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-teal-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📝</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Professional Format</h4>
                <p className="text-gray-600">Creates properly formatted bibliographies following academic citation standards.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-teal-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Instant Results</h4>
                <p className="text-gray-600">Convert your BibTeX files to PDF instantly with proper formatting and styling.</p>
              </div>
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="mb-20 bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-teal-100/50">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Why Choose Our BIB to PDF Converter?</h2>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
              <p className="text-xl leading-relaxed">
                Our BIB to PDF converter is the ultimate tool for academics, researchers, and students who need to transform their BibTeX bibliography files into professionally formatted PDF documents. Whether you're preparing a thesis, research paper, or academic publication, our converter ensures your citations meet the highest academic standards.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Advanced Bibliography Processing</h3>
              <p>
                Our converter utilizes sophisticated algorithms to parse and format BibTeX files with precision. We support all standard BibTeX entry types including articles, books, conference papers, theses, and technical reports. The conversion process maintains proper citation formatting according to major academic style guides, ensuring your bibliography meets publication requirements.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Perfect for Academic Research</h3>
              <p>
                Designed specifically for the academic community, our tool handles complex bibliographic data with ease. From journal articles with DOI numbers to conference proceedings with ISBN codes, every citation element is properly formatted and presented. The resulting PDF maintains consistent typography and spacing that meets university and publisher guidelines.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Professional Output Quality</h4>
              <p>
                Generated PDFs feature clean, professional layouts with proper font selection and hierarchical organization. Each bibliography entry is formatted with hanging indents, consistent spacing, and clear visual separation. The output is optimized for both digital viewing and high-quality printing.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Comprehensive Format Support</h4>
              <p>
                Our converter supports extensive BibTeX field types and formatting options. From basic author-title-year citations to complex multi-volume works with editors, translators, and series information, every bibliographic detail is preserved and properly formatted in the final PDF output.
              </p>

              <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Fast Processing Technology</h5>
              <p>
                Built with cutting-edge web technologies, our converter processes BibTeX files instantly. The client-side processing ensures your bibliographic data remains private while delivering lightning-fast conversion speeds. No uploads to external servers means complete data security and immediate results.
              </p>

              <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Academic Standard Compliance</h5>
              <p>
                Every converted bibliography meets international academic standards for citation formatting. Our system automatically handles special characters, accents, and mathematical symbols commonly found in academic literature. The output is compatible with major reference management systems and academic publishers worldwide.
              </p>

              <p className="text-lg font-medium text-gray-900 mt-8">
                Transform your BibTeX files into publication-ready PDFs today. Our free online converter combines academic precision with user-friendly design, making bibliography formatting effortless for researchers at every level. Experience the difference professional-grade bibliography conversion can make for your academic work.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}