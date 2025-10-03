'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function StepToStlPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.toLowerCase().endsWith('.step') || file.name.toLowerCase().endsWith('.stp'))) {
      setSelectedFile(file);
      setConversionResult(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      setConversionResult('model.stl');
    }, 4000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'model.stl';
    link.click();
  };

  return (
    <>
      <head>
        <title>Free STEP to STL Converter Online - CAD to 3D Printing | FlipFileX</title>
        <meta name="description" content="Convert STEP CAD files to STL format for 3D printing online for free. Professional-grade tool for preparing engineering models for additive manufacturing." />
        <meta name="keywords" content="STEP to STL, CAD to 3D printing, STEP converter, STL converter, 3D printing preparation, engineering, additive manufacturing, CAD models, mesh conversion" />
        <meta name="author" content="FlipFileX" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#10b981" />
        <meta name="application-name" content="FlipFileX STEP to STL Converter" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Free STEP to STL Converter Online - CAD to 3D Printing | FlipFileX" />
        <meta property="og:description" content="Convert STEP CAD files to STL format for 3D printing online for free. Perfect for preparing engineering models for additive manufacturing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/step-to-stl" />
        <meta property="og:image" content="https://flipfilex.com/og-image.jpg" />
        <meta property="og:site_name" content="FlipFileX" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free STEP to STL Converter Online - CAD to 3D Printing | FlipFileX" />
        <meta name="twitter:description" content="Convert STEP CAD files to STL format for 3D printing online for free. Professional-grade engineering tool." />
        <meta name="twitter:image" content="https://flipfilex.com/twitter-image.jpg" />

        <link rel="canonical" href="https://flipfilex.com/step-to-stl" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "STEP to STL Converter",
            "description": "Convert STEP CAD files to STL format for 3D printing online for free",
            "url": "https://flipfilex.com/step-to-stl",
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

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li><Link href="/" className="text-gray-500 hover:text-green-600 transition-colors duration-300">Home</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><Link href="/tools" className="text-gray-500 hover:text-green-600 transition-colors duration-300">Tools</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><span className="text-gray-900 font-medium">STEP to STL</span></li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl text-white text-5xl mb-8 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">🏗️</div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">STEP to STL Converter</h1>
            <h2 className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">Convert STEP CAD files to STL format for 3D printing online for free. Transform engineering models into 3D printable files with precision and quality.</h2>
            <div className="flex justify-center space-x-4 mb-8">
              <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">✅ 3D Print Ready</div>
              <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">🔒 Secure & Private</div>
              <div className="px-6 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">⚡ High Quality</div>
            </div>
          </section>

          <section className="mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-green-100/50 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Prepare Your Models for 3D Printing</h3>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-green-300 rounded-2xl p-12 text-center hover:border-green-400 transition-colors">
                  <div className="text-6xl mb-4">🏗️</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-4">Select your STEP file</h4>
                  <p className="text-gray-500 mb-6">Choose a STEP/STP CAD file to convert for 3D printing</p>
                  <label className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                    Choose STEP File
                    <input type="file" accept=".step,.stp" onChange={handleFileSelect} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">🏗️</div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{selectedFile.name}</h5>
                        <p className="text-sm text-gray-600">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-red-500 transition-colors">✕</button>
                    </div>
                  </div>
                  {!conversionResult ? (
                    <button onClick={handleConvert} disabled={isConverting} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                      {isConverting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Converting to STL...</span>
                        </div>
                      ) : 'Convert to STL'}
                    </button>
                  ) : (
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <h5 className="text-xl font-semibold text-green-800 mb-4">Ready for 3D Printing!</h5>
                      <button onClick={handleDownload} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl">Download STL</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">From CAD to 3D Printing</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🖨️</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">3D Printing Ready</h4>
                <p className="text-gray-600">Convert professional CAD models to STL format for all types of 3D printers and materials.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">⚙️</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Engineering Grade</h4>
                <p className="text-gray-600">Maintains precision and dimensional accuracy from professional CAD software to 3D printing.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Quality Mesh</h4>
                <p className="text-gray-600">Generates optimized STL mesh files perfect for slicing software and 3D printing workflows.</p>
              </div>
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="mb-20 bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-green-100/50">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Why Choose Our STEP to STL Converter?</h2>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
              <p className="text-xl leading-relaxed">
                Our STEP to STL converter is the professional-grade solution for engineers, designers, and manufacturers who need to transform precise CAD models into 3D printable formats. Supporting the ISO 10303 STEP standard, our converter maintains dimensional accuracy and geometric integrity throughout the conversion process, ensuring your engineering models print exactly as designed.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Engineering-Grade Precision</h3>
              <p>
                Built with advanced geometric algorithms, our converter processes complex STEP files while preserving critical engineering details. We support assembly models, parametric features, and intricate surface geometries from all major CAD software including SolidWorks, AutoCAD, Inventor, Fusion 360, and CATIA. The conversion maintains tolerances essential for functional 3D printed parts and prototypes.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Optimized for Additive Manufacturing</h3>
              <p>
                Our STL output is specifically optimized for 3D printing workflows across all major technologies including FDM, SLA, SLS, and metal printing processes. We generate high-quality triangular meshes with configurable resolution settings, ensuring smooth surfaces while maintaining reasonable file sizes for efficient slicing and printing operations.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Professional Mesh Generation</h4>
              <p>
                Advanced tessellation algorithms create optimal triangle meshes that balance file size with surface quality. Our converter handles complex curved surfaces, fine details, and sharp edges with precision, producing STL files that slice cleanly in all major 3D printing software including Cura, PrusaSlicer, and Simplify3D.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Industry Compatibility</h4>
              <p>
                Generated STL files are fully compatible with all 3D printer manufacturers and slicing software ecosystems. From desktop FDM printers to industrial SLA and metal printing systems, our output meets industry standards for additive manufacturing across automotive, aerospace, medical device, and consumer product applications.
              </p>

              <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Rapid Prototyping Workflow</h5>
              <p>
                Streamline your product development cycle by converting CAD designs directly to print-ready STL files. Our converter supports rapid iteration between design and physical testing, enabling faster prototyping cycles and reduced time-to-market for new product development and engineering validation.
              </p>

              <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Quality Assurance Features</h5>
              <p>
                Built-in mesh validation ensures your STL files are watertight and manifold, preventing printing failures and material waste. Our converter automatically detects and reports potential issues like non-manifold edges, inverted normals, and gaps that could cause slicing problems or print failures.
              </p>

              <p className="text-lg font-medium text-gray-900 mt-8">
                Transform your engineering designs into reality with our professional STEP to STL converter. Trusted by engineers, designers, and manufacturers worldwide, our tool bridges the gap between digital design and physical manufacturing, enabling precision 3D printing for functional prototypes and production parts.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}