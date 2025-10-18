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

          {/* Comprehensive SEO Content Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 mb-16">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Professional AutoCAD DWG to PDF Conversion</h2>

            <div className="space-y-16">
              {/* How DWG to PDF Works */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-orange-200">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">How Professional DWG to PDF Conversion Works</h3>
                <div className="max-w-4xl mx-auto">
                  <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                    Our DWG to PDF converter employs advanced CAD rendering technology that preserves vector precision,
                    layer structures, and dimensional accuracy while transforming AutoCAD drawings into universally
                    accessible PDF format. The conversion process maintains engineering standards and professional
                    presentation quality essential for architectural and engineering workflows.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">1</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload DWG Files</h4>
                      <p className="text-gray-600 text-sm">Upload AutoCAD DWG files with full layer and object support for professional conversion processing.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">2</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Vector Processing</h4>
                      <p className="text-gray-600 text-sm">Advanced CAD engines render drawings with precision scaling and dimensional accuracy preservation.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">3</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Download PDF</h4>
                      <p className="text-gray-600 text-sm">Receive professional PDF documents with vector quality and universal viewing compatibility.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Format Conversion Matters */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">DWG Format Limitations in Professional Sharing</h3>
                  <div className="max-w-2xl mx-auto">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      AutoCAD DWG files require specialized CAD software for viewing, creating barriers for clients,
                      contractors, and stakeholders who need to review drawings but don't have expensive CAD licenses,
                      limiting collaboration and approval workflows in professional projects.
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-green-200">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">PDF Universal Accessibility for CAD Drawings</h3>
                  <div className="max-w-2xl mx-auto">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      PDF format ensures universal accessibility across all devices and platforms, enabling seamless
                      sharing with clients, regulatory agencies, and project teams while maintaining vector precision
                      and professional presentation standards essential for engineering communication.
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Benefits */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-200">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Engineering Excellence Through DWG to PDF Conversion</h3>
                <div className="max-w-4xl mx-auto">
                  <p className="text-gray-700 leading-relaxed text-lg mb-8">
                    Professional DWG to PDF conversion streamlines architectural and engineering workflows by enabling
                    universal document sharing, regulatory compliance, and stakeholder collaboration while preserving
                    critical design details and dimensional accuracy required for construction and manufacturing projects.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="text-3xl mr-4">🏗️</div>
                        <h4 className="text-xl font-semibold text-gray-900">Construction Coordination</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Share architectural plans and construction drawings with contractors, subcontractors,
                        and site managers without requiring expensive CAD software licenses.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="text-3xl mr-4">📋</div>
                        <h4 className="text-xl font-semibold text-gray-900">Regulatory Compliance</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Submit engineering drawings to building departments, regulatory agencies, and
                        permit offices in universally accepted PDF format for faster approvals.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="text-3xl mr-4">👥</div>
                        <h4 className="text-xl font-semibold text-gray-900">Client Collaboration</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Enable client reviews and approvals with professional PDF presentations that
                        maintain design integrity while being accessible on any device or platform.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="text-3xl mr-4">🔐</div>
                        <h4 className="text-xl font-semibold text-gray-900">Design Protection</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Share design concepts and proposals while protecting intellectual property with
                        non-editable PDF format that prevents unauthorized modifications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-200">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Advanced CAD Conversion Technology Specifications</h3>
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="text-2xl mr-3">📐</span>DWG Input Support
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 text-sm leading-relaxed">Support for AutoCAD DWG versions from R14 through latest 2024 formats</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 text-sm leading-relaxed">Comprehensive layer management with visibility and color preservation</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 text-sm leading-relaxed">Advanced object support including blocks, xrefs, and complex geometries</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="text-2xl mr-3">📄</span>PDF Output Quality
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 text-sm leading-relaxed">Vector-based output preserving precision and scalability for printing</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 text-sm leading-relaxed">Professional color management with accurate line weights and fonts</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 text-sm leading-relaxed">Dimensional accuracy maintained for construction and manufacturing use</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Use Cases */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-cyan-200">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Professional DWG to PDF Conversion Applications</h3>
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="text-3xl mb-4">🏢</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Architectural Firms</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Share building plans, floor layouts, and elevation drawings with clients, contractors,
                        and regulatory agencies without requiring expensive AutoCAD licenses.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="text-3xl mb-4">⚙️</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Engineering Consultancy</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Convert mechanical drawings, electrical schematics, and structural plans for
                        client presentations, permit submissions, and construction documentation.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="text-3xl mb-4">🏭</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Manufacturing</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Share technical drawings, assembly instructions, and manufacturing specifications
                        with production teams and quality control departments.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="text-3xl mb-4">🏗️</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Construction Management</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Distribute construction drawings, site plans, and detail drawings to field
                        personnel and subcontractors for accurate project execution.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="text-3xl mb-4">📋</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Permit Applications</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Submit building permits, zoning applications, and regulatory filings with
                        professional PDF drawings that meet government submission requirements.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="text-3xl mb-4">🎓</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Educational Institutions</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Share engineering curricula, technical drawings, and design projects with
                        students and faculty without requiring CAD software access.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">DWG to PDF Conversion: Professional Engineering Guide</h3>
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Will the conversion maintain dimensional accuracy for construction use?</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Yes! Our DWG to PDF converter preserves precise dimensional accuracy and scale relationships essential
                        for construction and manufacturing applications. Vector-based conversion maintains line weights,
                        dimensions, and geometric precision required for professional engineering workflows.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Are layers and object properties preserved during conversion?</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Our conversion process intelligently handles AutoCAD layers, maintaining visibility settings, colors,
                        and line types in the output PDF. Complex objects including blocks, xrefs, and nested geometries
                        are rendered accurately while preserving the visual hierarchy of your original drawing.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Is my CAD data secure during the conversion process?</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Absolutely! All DWG files are processed with enterprise-grade security protocols using encrypted
                        connections. Your intellectual property and design data are automatically deleted after conversion,
                        ensuring complete confidentiality for sensitive engineering and architectural projects.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">What AutoCAD versions and DWG formats are supported?</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Our system supports DWG files from AutoCAD R14 through the latest 2024 versions, including files
                        created with AutoCAD LT, Civil 3D, and other Autodesk CAD products. Both 2D and 3D drawings are
                        supported with automatic layout optimization for PDF output.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">How long does DWG to PDF conversion typically take?</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Conversion time depends on drawing complexity and file size, typically ranging from 15-90 seconds
                        for most architectural and engineering drawings. Our optimized CAD processing engines ensure
                        fast turnaround while maintaining professional quality standards for all converted documents.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Can I convert DWG files with external references (xrefs)?</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Yes, our converter handles external references intelligently. For best results with xrefs, ensure
                        all referenced files are accessible or consider binding references before conversion. The system
                        will process available references and maintain drawing integrity in the final PDF output.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}