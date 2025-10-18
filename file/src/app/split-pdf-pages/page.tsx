'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import { FileWithId, ConversionResponse } from '@/types';
import { ApiService, getAcceptedFileTypes } from '@/lib/api';

export default function SplitPDFPage() {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitMode, setSplitMode] = useState('all');
  const [pageRanges, setPageRanges] = useState('');
  const [splitStats, setSplitStats] = useState({
    totalSplit: 7234,
    averagePages: 8.4,
    successRate: 99.5
  });

  useEffect(() => {
    // Simulate loading split statistics
    setSplitStats({
      totalSplit: 7234,
      averagePages: 8.4,
      successRate: 99.5
    });
  }, []);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    // Files are handled in handleFilesChange
  };

  const handleFilesChange = (updatedFiles: FileWithId[]) => {
    setFiles(updatedFiles);
  };

  const splitFiles = async () => {
    if (files.length === 0) {
      showNotification('Please select a PDF file to split', 'warning');
      return;
    }

    if (splitMode === 'custom' && !pageRanges.trim()) {
      showNotification('Please specify page ranges for custom split', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      const updatedFiles = files.map(f => ({ ...f, status: 'uploading' as const, progress: 0 }));
      setFiles(updatedFiles);

      for (let i = 0; i < files.length; i++) {
        const fileWithId = files[i];

        try {
          const updateProgress = (progress: any) => {
            setFiles(prev => prev.map(f =>
              f.id === fileWithId.id
                ? { ...f, progress: progress.percentage, status: 'processing' as const }
                : f
            ));
          };

          const result: ConversionResponse = await ApiService.splitPdf(
            fileWithId.file,
            splitMode,
            pageRanges,
            updateProgress
          );

          setFiles(prev => prev.map(f =>
            f.id === fileWithId.id
              ? {
                  ...f,
                  status: 'completed' as const,
                  progress: 100,
                  downloadUrl: ApiService.getDownloadUrl(result.filename)
                }
              : f
          ));

          showNotification('PDF split successfully!', 'success');

        } catch (error: any) {
          setFiles(prev => prev.map(f =>
            f.id === fileWithId.id
              ? {
                  ...f,
                  status: 'error' as const,
                  error: error.message || 'Split failed'
                }
              : f
          ));
          showNotification(`Split failed: ${error.message}`, 'error');
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const resetFiles = () => {
    setFiles([]);
    setPageRanges('');
    showNotification('Files cleared', 'info');
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    // This would integrate with your notification system
    console.log(`${type}: ${message}`);
  };

  const acceptedTypes = getAcceptedFileTypes('split-pdf');

  const features = [
    {
      icon: '✂️',
      title: 'Flexible Splitting',
      description: 'Split by individual pages, custom ranges, or extract specific sections',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      icon: '📄',
      title: 'Multiple Outputs',
      description: 'Generate separate PDF files for each page or specified range',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: '⚡',
      title: 'Fast Processing',
      description: 'Lightning-quick splitting with real-time progress tracking',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      icon: '🎯',
      title: 'Precise Control',
      description: 'Extract exactly the pages you need with perfect accuracy',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const splitSteps = [
    {
      step: 1,
      title: 'Upload PDF',
      description: 'Select your PDF document to split',
      icon: '📤'
    },
    {
      step: 2,
      title: 'Choose Method',
      description: 'Select split options and page ranges',
      icon: '⚙️'
    },
    {
      step: 3,
      title: 'Download Files',
      description: 'Get your split PDF files as a ZIP package',
      icon: '📥'
    }
  ];

  const useCases = [
    { use: 'Extract specific chapters', icon: '📖' },
    { use: 'Separate document sections', icon: '📋' },
    { use: 'Create individual invoices', icon: '🧾' },
    { use: 'Split large presentations', icon: '📊' },
    { use: 'Isolate important pages', icon: '⭐' },
    { use: 'Archive management', icon: '📁' }
  ];

  return (
    <>
      <Head>
        <title>Free Split PDF Pages | FlipFileX</title>
        <meta name="description" content="Split PDF files into individual pages or custom ranges for free. Extract specific pages, split by page numbers, or create separate documents. Fast, secure, and easy to use." />
        <meta name="keywords" content="split PDF, PDF splitter, extract PDF pages, separate PDF pages, divide PDF, PDF page extractor, online PDF splitter, free PDF splitter, split PDF by pages, PDF page separator" />
        <meta name="author" content="FlipFileX" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Free Split PDF Pages | FlipFileX" />
        <meta property="og:description" content="Split PDF files into individual pages or custom ranges for free. Extract specific pages, split by page numbers, or create separate documents." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/split-pdf-pages" />
        <meta property="og:image" content="https://flipfilex.com/images/split-pdf-og.jpg" />
        <meta property="og:site_name" content="FlipFileX" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Split PDF Pages | FlipFileX" />
        <meta name="twitter:description" content="Split PDF files into individual pages or custom ranges for free. Extract specific pages and create separate documents." />
        <meta name="twitter:image" content="https://flipfilex.com/images/split-pdf-twitter.jpg" />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="application-name" content="FlipFileX" />
        <meta name="format-detection" content="telephone=no" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://flipfilex.com/split-pdf-pages" />

        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "PDF Splitter Tool",
              "description": "Split PDF files into individual pages or custom ranges for free",
              "url": "https://flipfilex.com/split-pdf-pages",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "provider": {
                "@type": "Organization",
                "name": "FlipFileX"
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-indigo-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <span className="text-gray-900 font-medium">Split PDF Pages</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl text-white text-4xl mb-8 shadow-lg">
              ✂️
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              PDF Splitter
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Split PDF files into individual pages or custom ranges with
              <span className="font-semibold text-indigo-600"> precise control</span> and
              <span className="font-semibold text-purple-600"> perfect accuracy</span>
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{splitStats.totalSplit.toLocaleString()}+</div>
                <div className="text-gray-600 text-sm">PDFs Split</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{splitStats.averagePages}</div>
                <div className="text-gray-600 text-sm">Avg. Pages Extracted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{splitStats.successRate}%</div>
                <div className="text-gray-600 text-sm">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Main Split Area */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Split Your PDF</h2>
              <p className="text-indigo-100">Upload your PDF and extract specific pages or ranges</p>
            </div>

            <div className="p-8">
              <FileUpload
                acceptedFileTypes={acceptedTypes}
                maxFiles={1}
                onFilesSelected={handleFilesSelected}
                onFilesChange={handleFilesChange}
                selectedFiles={files}
                isProcessing={isProcessing}
                title="Drop your PDF file here"
                description="Select a PDF file to split into separate pages"
              />

              {/* Split Options */}
              {files.length > 0 && (
                <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Split Options</h3>

                  <div className="space-y-6">
                    {/* Split Mode Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Split Method</label>
                      <div className="grid md:grid-cols-3 gap-4">
                        <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                          splitMode === 'all' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'
                        }`}>
                          <input
                            type="radio"
                            name="splitMode"
                            value="all"
                            checked={splitMode === 'all'}
                            onChange={(e) => setSplitMode(e.target.value)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="text-2xl mb-2">📄</div>
                            <div className="font-semibold text-gray-900">All Pages</div>
                            <div className="text-sm text-gray-600">Split every page separately</div>
                          </div>
                        </label>

                        <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                          splitMode === 'odd' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'
                        }`}>
                          <input
                            type="radio"
                            name="splitMode"
                            value="odd"
                            checked={splitMode === 'odd'}
                            onChange={(e) => setSplitMode(e.target.value)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="text-2xl mb-2">🔢</div>
                            <div className="font-semibold text-gray-900">Odd Pages</div>
                            <div className="text-sm text-gray-600">Extract odd-numbered pages</div>
                          </div>
                        </label>

                        <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                          splitMode === 'even' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'
                        }`}>
                          <input
                            type="radio"
                            name="splitMode"
                            value="even"
                            checked={splitMode === 'even'}
                            onChange={(e) => setSplitMode(e.target.value)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="text-2xl mb-2">🔢</div>
                            <div className="font-semibold text-gray-900">Even Pages</div>
                            <div className="text-sm text-gray-600">Extract even-numbered pages</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Custom Range Option */}
                    <div>
                      <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                        splitMode === 'custom' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'
                      }`}>
                        <input
                          type="radio"
                          name="splitMode"
                          value="custom"
                          checked={splitMode === 'custom'}
                          onChange={(e) => setSplitMode(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl mb-2">🎯</div>
                            <div className="font-semibold text-gray-900">Custom Range</div>
                            <div className="text-sm text-gray-600">Specify page ranges</div>
                          </div>
                          {splitMode === 'custom' && (
                            <div className="flex-1">
                              <input
                                type="text"
                                value={pageRanges}
                                onChange={(e) => setPageRanges(e.target.value)}
                                placeholder="e.g., 1-3, 5, 7-10"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Examples: "1-5" (pages 1 to 5), "2,4,6" (specific pages), "1-3,8-10" (multiple ranges)
                              </p>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {files.length > 0 && (
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={splitFiles}
                    disabled={isProcessing || (splitMode === 'custom' && !pageRanges.trim())}
                    className={`
                      bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg
                      hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300
                      shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      flex items-center justify-center space-x-3
                    `}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Splitting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Split PDF</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetFiles}
                    disabled={isProcessing}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg
                             transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset Files
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.bgColor} ${feature.borderColor} border-2 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`font-bold text-lg ${feature.color} mb-3`}>
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* How it Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {splitSteps.map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                    {step.step}
                  </div>
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>

                  {/* Connection Line */}
                  {index < splitSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-gradient-to-r from-indigo-200 to-purple-200 transform -translate-x-1/2 z-0"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Perfect For</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {useCases.map((useCase, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="text-3xl">{useCase.icon}</div>
                    <span className="font-medium text-gray-900">{useCase.use}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200 mb-16">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">Your Files Are Safe</h3>
                <p className="text-emerald-800 mb-4 leading-relaxed">
                  We ensure complete privacy and security for your PDF documents. All splitting is processed with
                  enterprise-grade encryption, and files are automatically deleted within 1 hour.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-emerald-700">SSL Encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-emerald-700">Auto-Delete Files</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-emerald-700">No Data Storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 0 1 2 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-emerald-700">GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
              <h2 className="text-3xl font-bold text-white mb-2">Why Choose Our PDF Splitter?</h2>
              <p className="text-indigo-100">The most precise solution for extracting and organizing PDF pages</p>
            </div>

            <div className="p-8 md:p-12">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Efficiently extract and organize specific pages from your PDF documents with our advanced splitting
                  technology. Whether you need to separate chapters, extract important sections, or reorganize large
                  documents, our intelligent page extraction system delivers precise results while maintaining original
                  quality and formatting across all split files.
                </p>

                <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" clipRule="evenodd" />
                  </svg>
                  Flexible Splitting Options with Precision Control
                </h3>
                <p className="text-gray-700 mb-6">
                  Our comprehensive splitting system offers multiple extraction methods tailored to different needs.
                  Split entire documents into individual pages, extract specific page ranges, or separate odd and even
                  pages for duplex printing workflows. Advanced parsing algorithms ensure accurate page extraction
                  while preserving all document elements including bookmarks, annotations, and formatting.
                </p>

                <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Professional Document Management and Organization
                </h3>
                <p className="text-gray-700 mb-6">
                  Transform complex document workflows with intelligent page extraction capabilities designed for
                  professional environments. Separate contracts by sections, extract specific invoice pages, or
                  reorganize presentation materials with surgical precision. The automated file naming system ensures
                  organized output that integrates seamlessly with existing document management systems.
                </p>

                <h4 className="text-xl font-semibold text-indigo-700 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zM7 8a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Advanced Range Processing for Complex Extractions
                </h4>
                <p className="text-gray-700 mb-6">
                  Handle sophisticated extraction scenarios with our intuitive range specification system. Extract
                  non-consecutive pages, create multiple output files from different sections, or process complex
                  page patterns with ease. The flexible syntax supports various extraction patterns, making it
                  perfect for academic research, legal document processing, and multi-section report management.
                </p>

                <h4 className="text-xl font-semibold text-purple-700 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M13 10V3L4 14h7v7l9-11h-7z" clipRule="evenodd" />
                  </svg>
                  High-Performance Processing with Quality Preservation
                </h4>
                <p className="text-gray-700 mb-6">
                  Experience lightning-fast page extraction powered by optimized processing engines that handle
                  large documents effortlessly. Advanced compression algorithms maintain file size efficiency while
                  preserving full document quality. Real-time progress tracking and batch processing capabilities
                  make it ideal for high-volume document operations and time-critical projects.
                </p>

                <h5 className="text-lg font-semibold text-indigo-600 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Intelligent Output Organization and Distribution
                </h5>
                <p className="text-gray-700 mb-6">
                  Streamline document distribution with smart output packaging that organizes extracted pages
                  logically. Automatically generate organized ZIP archives with descriptive file names, or download
                  individual pages as needed. The system maintains document relationships and provides clear
                  extraction summaries, making it easy to manage and distribute processed documents to teams
                  and stakeholders.
                </p>

                <h5 className="text-lg font-semibold text-purple-600 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Cost-Effective Solution for Universal Document Needs
                </h5>
                <p className="text-gray-700 mb-8">
                  Access professional-grade PDF splitting capabilities completely free, eliminating expensive software
                  licensing costs. Our web-based platform provides enterprise functionality accessible from any device,
                  making advanced document processing available to individuals, small businesses, and large organizations
                  alike. Save time and money while accessing powerful tools that enhance productivity and streamline
                  document workflows across all your projects.
                </p>

                {/* Enhanced SEO Content Sections */}
                <div className="space-y-16 mt-12">
                  {/* Professional Use Cases */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-200">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Professional PDF Splitting Applications</h3>
                    <div className="max-w-4xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                          <div className="text-3xl mb-4">📚</div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Academic Research</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            Extract specific chapters, research sections, or bibliography pages from academic papers,
                            dissertations, and research documents for focused study and citation management.
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                          <div className="text-3xl mb-4">⚖️</div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Legal Document Processing</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            Separate contract sections, extract evidence pages, and organize case files for
                            efficient legal document management and court submission preparation.
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                          <div className="text-3xl mb-4">🏢</div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Business Documentation</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            Split large reports, extract specific proposal sections, and organize financial
                            documents for targeted stakeholder distribution and review processes.
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                          <div className="text-3xl mb-4">🏥</div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Healthcare Records</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            Extract patient information pages, separate test results, and organize medical
                            documentation while maintaining HIPAA compliance and confidentiality standards.
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                          <div className="text-3xl mb-4">📊</div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Financial Services</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            Split financial statements, extract specific account pages, and organize audit
                            documents for compliance reporting and regulatory submission requirements.
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                          <div className="text-3xl mb-4">🎓</div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Educational Materials</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            Extract lesson plans, separate course modules, and organize educational content
                            for efficient curriculum development and student resource distribution.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Benefits */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-200">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Advanced PDF Splitting Technology Benefits</h3>
                    <div className="max-w-4xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                          <div className="flex items-center mb-4">
                            <div className="text-3xl mr-4">⚡</div>
                            <h4 className="text-xl font-semibold text-gray-900">Lightning-Fast Processing</h4>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            Advanced algorithms process large PDF documents in seconds, handling complex files
                            with hundreds of pages while maintaining perfect quality and accuracy throughout
                            the splitting process.
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                          <div className="flex items-center mb-4">
                            <div className="text-3xl mr-4">🎯</div>
                            <h4 className="text-xl font-semibold text-gray-900">Precision Page Extraction</h4>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            Intelligent parsing technology preserves all document elements including bookmarks,
                            annotations, metadata, and formatting, ensuring extracted pages maintain complete
                            integrity and professional appearance.
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                          <div className="flex items-center mb-4">
                            <div className="text-3xl mr-4">📁</div>
                            <h4 className="text-xl font-semibold text-gray-900">Smart Organization</h4>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            Automatic file naming and organized ZIP packaging simplify document management,
                            with clear extraction summaries and logical file structures for efficient
                            distribution and archival.
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                          <div className="flex items-center mb-4">
                            <div className="text-3xl mr-4">🔐</div>
                            <h4 className="text-xl font-semibold text-gray-900">Enterprise Security</h4>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            Bank-level encryption protects sensitive documents during processing, with automatic
                            file deletion and complete privacy protection meeting enterprise security standards
                            and compliance requirements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">PDF Splitting: Professional Guide</h3>
                    <div className="max-w-4xl mx-auto">
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Will splitting preserve the original document quality and formatting?</h4>
                          <p className="text-gray-700 leading-relaxed">
                            Yes! Our advanced splitting technology preserves all original document elements including formatting,
                            fonts, images, hyperlinks, and annotations. Each extracted page maintains identical quality to the
                            source document, ensuring professional results suitable for business and academic use.
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Can I extract non-consecutive pages or complex page ranges?</h4>
                          <p className="text-gray-700 leading-relaxed">
                            Absolutely! Our flexible range specification system supports complex extraction patterns. You can
                            extract specific pages (e.g., "2,5,8"), page ranges (e.g., "1-5,10-15"), or combine both methods
                            for sophisticated document organization and selective content extraction.
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">What file size limitations apply to PDF splitting?</h4>
                          <p className="text-gray-700 leading-relaxed">
                            Our system efficiently handles PDF files up to 100MB in size, accommodating large documents,
                            technical manuals, academic papers, and multi-section reports. The optimized processing engine
                            maintains fast performance regardless of document complexity or page count.
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">How are the split files organized and delivered?</h4>
                          <p className="text-gray-700 leading-relaxed">
                            Split pages are automatically organized with descriptive file names and packaged in a convenient
                            ZIP archive for easy download. The system provides clear extraction summaries and maintains
                            logical file organization, making it simple to distribute and manage the resulting documents.
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Is my document data secure during the splitting process?</h4>
                          <p className="text-gray-700 leading-relaxed">
                            Yes! All documents are processed with enterprise-grade security including SSL encryption and
                            automatic file deletion within one hour. We never store, access, or analyze your document
                            content, ensuring complete confidentiality for sensitive business and personal documents.
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Can I split password-protected or encrypted PDF files?</h4>
                          <p className="text-gray-700 leading-relaxed">
                            Our system can handle many password-protected PDFs. For encrypted files, you may need to unlock
                            them first or provide the password during upload. The splitting process preserves original
                            security settings where possible while maintaining document integrity throughout extraction.
                          </p>
                        </div>
                      </div>
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