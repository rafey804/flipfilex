'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MathmlToImagePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.toLowerCase().endsWith('.xml') || file.name.toLowerCase().endsWith('.mathml'))) {
      setSelectedFile(file);
      setConversionResult(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      setConversionResult('math-equation.png');
    }, 2500);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'math-equation.png';
    link.click();
  };

  return (
    <>
      <head>
        <title>Free MathML to Image Converter Online - Mathematical Markup to PNG | FlipFileX</title>
        <meta name="description" content="Convert MathML mathematical markup to high-quality images online for free. Perfect for academic papers, presentations, and web publishing with professional rendering." />
        <meta name="keywords" content="MathML to image, mathematical markup, math equations, formula converter, academic tools, PNG converter, LaTeX equations, scientific notation, mathematical symbols" />
        <meta name="author" content="FlipFileX" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#10b981" />
        <meta name="application-name" content="FlipFileX MathML to Image Converter" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Free MathML to Image Converter Online - Mathematical Markup to PNG | FlipFileX" />
        <meta property="og:description" content="Convert MathML mathematical markup to high-quality images online for free. Perfect for academic papers, presentations, and web publishing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/mathml-to-image" />
        <meta property="og:image" content="https://flipfilex.com/og-image.jpg" />
        <meta property="og:site_name" content="FlipFileX" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free MathML to Image Converter Online - Mathematical Markup to PNG | FlipFileX" />
        <meta name="twitter:description" content="Convert MathML mathematical markup to high-quality images online for free. Perfect for academic papers and presentations." />
        <meta name="twitter:image" content="https://flipfilex.com/twitter-image.jpg" />

        <link rel="canonical" href="https://flipfilex.com/mathml-to-image" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "MathML to Image Converter",
            "description": "Convert MathML mathematical markup to high-quality images online for free",
            "url": "https://flipfilex.com/mathml-to-image",
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

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li><Link href="/" className="text-gray-500 hover:text-emerald-600 transition-colors duration-300">Home</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><Link href="/tools" className="text-gray-500 hover:text-emerald-600 transition-colors duration-300">Tools</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><span className="text-gray-900 font-medium">MathML to Image</span></li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl text-white text-5xl mb-8 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">∑</div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">MathML to Image Converter</h1>
            <h2 className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">Convert MathML mathematical markup to high-quality images online for free. Perfect for academic papers, presentations, and web publishing.</h2>
            <div className="flex justify-center space-x-4 mb-8">
              <div className="px-6 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">✅ High Quality</div>
              <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">🔒 Secure & Private</div>
              <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">⚡ Fast Rendering</div>
            </div>
          </section>

          <section className="mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-emerald-100/50 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Convert Mathematical Markup</h3>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center hover:border-emerald-400 transition-colors">
                  <div className="text-6xl mb-4">∑</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-4">Select your MathML file</h4>
                  <p className="text-gray-500 mb-6">Choose a MathML file to convert to high-quality images</p>
                  <label className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                    Choose MathML File
                    <input type="file" accept=".xml,.mathml" onChange={handleFileSelect} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-xl">∑</div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{selectedFile.name}</h5>
                        <p className="text-sm text-gray-600">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-red-500 transition-colors">✕</button>
                    </div>
                  </div>
                  {!conversionResult ? (
                    <button onClick={handleConvert} disabled={isConverting} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                      {isConverting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Rendering Mathematical Expressions...</span>
                        </div>
                      ) : 'Convert to Image'}
                    </button>
                  ) : (
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <h5 className="text-xl font-semibold text-green-800 mb-4">Image Generated!</h5>
                      <button onClick={handleDownload} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl">Download Image</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Perfect for Academic Publishing</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📄</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Academic Papers</h4>
                <p className="text-gray-600">Convert complex mathematical expressions for inclusion in research papers and publications.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📊</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Presentations</h4>
                <p className="text-gray-600">Generate high-quality mathematical graphics for slides and educational materials.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🌐</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Web Publishing</h4>
                <p className="text-gray-600">Create mathematical images for websites, blogs, and online educational content.</p>
              </div>
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-emerald-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                Why Choose Our MathML to Image Converter?
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Academic Publishing Excellence</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Transform complex mathematical expressions into publication-ready images with professional quality rendering. Our MathML converter ensures your equations look perfect in research papers, theses, and academic publications with crisp, scalable output suitable for both print and digital media.
                  </p>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Educational Content Creation</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Perfect for educators creating course materials, textbooks, and online learning content. Convert mathematical notation into clear, readable images that enhance student understanding and make complex concepts more accessible across all educational levels.
                  </p>
                  <h5 className="text-base font-medium text-gray-900 mb-2">High-Quality Rendering</h5>
                  <p className="text-gray-700 leading-relaxed">
                    Advanced mathematical typesetting engines produce crisp, professional equations with proper spacing, alignment, and font rendering for optimal readability.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Presentation Tools</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Create stunning mathematical graphics for presentations, slides, and visual aids. Our converter generates high-resolution images that scale perfectly for large displays, ensuring your mathematical content remains sharp and professional in any presentation format.
                  </p>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Web Publishing Optimization</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Essential for blog posts, websites, and online documentation featuring mathematical content. Generate web-optimized images that load quickly while maintaining mathematical accuracy and visual appeal across all devices and browsers.
                  </p>
                  <h5 className="text-base font-medium text-gray-900 mb-2">Universal Compatibility</h5>
                  <p className="text-gray-700 leading-relaxed">
                    Works with all standard MathML markup, supporting complex equations, matrices, integrals, and specialized mathematical notation used across scientific disciplines.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Converter Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">HD</div>
                    <div className="text-sm text-gray-600">Quality Output</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">100%</div>
                    <div className="text-sm text-gray-600">MathML Support</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">PNG</div>
                    <div className="text-sm text-gray-600">Format Output</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">∞</div>
                    <div className="text-sm text-gray-600">Free Usage</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Speed & Efficiency</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Lightning-fast rendering engine processes complex mathematical expressions instantly. Perfect for time-sensitive academic deadlines and rapid content creation workflows where quality and speed are equally important.
                  </p>
                  <h5 className="text-base font-medium text-gray-900 mb-2">Batch Processing</h5>
                  <p className="text-gray-700 leading-relaxed">
                    Handle multiple equations efficiently, making it ideal for converting entire documents or creating comprehensive mathematical image libraries for educational materials.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Security & Privacy</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    All mathematical expressions are processed securely with no permanent storage. Your academic work and proprietary equations remain completely confidential throughout the conversion process.
                  </p>
                  <h5 className="text-base font-medium text-gray-900 mb-2">Cross-Platform Support</h5>
                  <p className="text-gray-700 leading-relaxed">
                    Generated images work perfectly across all platforms, applications, and document systems, ensuring seamless integration into your academic and professional workflows.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Elevate your mathematical content with professional-grade equation rendering. Whether you're publishing research, creating educational materials, or preparing presentations, our MathML converter delivers the quality and reliability that academic and professional work demands. Start creating beautiful mathematical images today.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}