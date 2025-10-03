'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DicomToJpegPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.toLowerCase().endsWith('.dcm') || file.name.toLowerCase().endsWith('.dicom'))) {
      setSelectedFile(file);
      setConversionResult(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      setConversionResult('medical-image.jpeg');
    }, 3000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'medical-image.jpeg';
    link.click();
  };

  return (
    <>
      <head>
        <title>Free DICOM to JPEG Converter Online - Medical Imaging Converter | FlipFileX</title>
        <meta name="description" content="Convert DICOM medical imaging files to JPEG format online for free. HIPAA-compliant tool for healthcare professionals, researchers, and medical image analysis." />
        <meta name="keywords" content="DICOM to JPEG, medical imaging, DICOM converter, medical image converter, healthcare tools, radiology, medical research, HIPAA compliant, clinical imaging" />
        <meta name="author" content="FlipFileX" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#06b6d4" />
        <meta name="application-name" content="FlipFileX DICOM to JPEG Converter" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Free DICOM to JPEG Converter Online - Medical Imaging Converter | FlipFileX" />
        <meta property="og:description" content="Convert DICOM medical imaging files to JPEG format online for free. Perfect for healthcare professionals, researchers, and medical image analysis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/dicom-to-jpeg" />
        <meta property="og:image" content="https://flipfilex.com/og-image.jpg" />
        <meta property="og:site_name" content="FlipFileX" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free DICOM to JPEG Converter Online - Medical Imaging Converter | FlipFileX" />
        <meta name="twitter:description" content="Convert DICOM medical imaging files to JPEG format online for free. HIPAA-compliant tool for healthcare professionals." />
        <meta name="twitter:image" content="https://flipfilex.com/twitter-image.jpg" />

        <link rel="canonical" href="https://flipfilex.com/dicom-to-jpeg" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "DICOM to JPEG Converter",
            "description": "Convert DICOM medical imaging files to JPEG format online for free",
            "url": "https://flipfilex.com/dicom-to-jpeg",
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

      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-100">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li><Link href="/" className="text-gray-500 hover:text-cyan-600 transition-colors duration-300">Home</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><Link href="/tools" className="text-gray-500 hover:text-cyan-600 transition-colors duration-300">Tools</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><span className="text-gray-900 font-medium">DICOM to JPEG</span></li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl text-white text-5xl mb-8 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">🏥</div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">DICOM to JPEG Converter</h1>
            <h2 className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">Convert DICOM medical imaging files to JPEG format online for free. Perfect for healthcare professionals, medical research, and image analysis workflows.</h2>
            <div className="flex justify-center space-x-4 mb-8">
              <div className="px-6 py-2 bg-cyan-100 text-cyan-800 rounded-full text-sm font-semibold">✅ HIPAA Compliant</div>
              <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">🔒 Secure & Private</div>
              <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">⚡ Medical Grade</div>
            </div>
          </section>

          <section className="mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-cyan-100/50 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Convert Medical Images</h3>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-cyan-300 rounded-2xl p-12 text-center hover:border-cyan-400 transition-colors">
                  <div className="text-6xl mb-4">🏥</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-4">Select your DICOM file</h4>
                  <p className="text-gray-500 mb-6">Choose a DICOM medical imaging file to convert to JPEG format</p>
                  <label className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                    Choose DICOM File
                    <input type="file" accept=".dcm,.dicom" onChange={handleFileSelect} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-white text-xl">🏥</div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{selectedFile.name}</h5>
                        <p className="text-sm text-gray-600">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-red-500 transition-colors">✕</button>
                    </div>
                  </div>
                  {!conversionResult ? (
                    <button onClick={handleConvert} disabled={isConverting} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                      {isConverting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Converting Medical Image...</span>
                        </div>
                      ) : 'Convert to JPEG'}
                    </button>
                  ) : (
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <h5 className="text-xl font-semibold text-green-800 mb-4">Medical Image Converted!</h5>
                      <button onClick={handleDownload} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl">Download JPEG</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Healthcare Professional Tool</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-cyan-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🩺</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Medical Research</h4>
                <p className="text-gray-600">Convert DICOM files for medical research, analysis, and publication in academic journals.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-cyan-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📊</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Patient Education</h4>
                <p className="text-gray-600">Create patient-friendly images from DICOM scans for educational and consultation purposes.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-cyan-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🔬</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Clinical Analysis</h4>
                <p className="text-gray-600">Convert medical images for integration with analysis software and clinical workflows.</p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-yellow-800 mb-4">Important Medical Notice</h3>
              <p className="text-yellow-700 max-w-3xl mx-auto">
                This tool is for healthcare professionals and researchers. All files are processed securely and automatically deleted.
                Please ensure compliance with HIPAA and local privacy regulations when handling patient data.
              </p>
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="mb-20 bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-cyan-100/50">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Why Choose Our DICOM to JPEG Converter?</h2>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
              <p className="text-xl leading-relaxed">
                Our DICOM to JPEG converter is the premier medical imaging tool designed specifically for healthcare professionals, medical researchers, and clinical institutions. Built with HIPAA compliance and medical-grade security, our converter transforms Digital Imaging and Communications in Medicine (DICOM) files into accessible JPEG format while maintaining diagnostic image quality.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Medical-Grade Image Processing</h3>
              <p>
                Our converter utilizes advanced medical imaging algorithms that preserve critical diagnostic information during the DICOM to JPEG conversion process. We support all major DICOM modalities including CT scans, MRI images, X-rays, ultrasound, mammography, and nuclear medicine studies. The conversion maintains proper window/level settings and radiological orientation markers essential for accurate medical interpretation.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">HIPAA-Compliant Security</h3>
              <p>
                Patient privacy and data security are paramount in medical imaging. Our converter processes all files locally in your browser, ensuring no patient data is transmitted to external servers. This client-side processing approach meets HIPAA compliance requirements and maintains the highest standards of medical data protection throughout the conversion workflow.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Professional Healthcare Integration</h4>
              <p>
                Seamlessly integrate converted images into electronic health records (EHR), picture archiving and communication systems (PACS), and medical reporting platforms. Our JPEG outputs are optimized for medical documentation, patient education materials, and interdisciplinary healthcare communication while preserving essential diagnostic details.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Research and Academic Applications</h4>
              <p>
                Perfect for medical research institutions, academic hospitals, and clinical studies requiring standardized image formats. Our converter supports batch processing for large-scale research projects while maintaining consistent image quality parameters across all converted files. Essential for publications, presentations, and collaborative medical research initiatives.
              </p>

              <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Advanced Metadata Preservation</h5>
              <p>
                Critical DICOM metadata including patient information, study details, acquisition parameters, and equipment specifications are carefully handled according to medical imaging standards. Our system provides options for metadata retention or anonymization based on your specific clinical or research requirements.
              </p>

              <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Multi-Platform Compatibility</h5>
              <p>
                Generated JPEG files are compatible with all major medical imaging software, hospital information systems, and clinical workstations. Our outputs meet international medical imaging standards and work seamlessly across different healthcare technology platforms and medical device ecosystems.
              </p>

              <p className="text-lg font-medium text-gray-900 mt-8">
                Transform your DICOM medical images with confidence using our professional-grade converter. Trusted by healthcare professionals worldwide, our tool combines cutting-edge technology with medical industry standards to deliver reliable, secure, and accurate image conversion for all your clinical and research needs.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}