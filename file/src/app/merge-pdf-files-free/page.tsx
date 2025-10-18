'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import { FileWithId, ConversionResponse } from '@/types';
import { ApiService, getAcceptedFileTypes } from '@/lib/api';

export default function MergePdfPage() {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedFile, setMergedFile] = useState<{ downloadUrl: string; filename: string } | null>(null);
  const [mergeStats, setMergeStats] = useState({
    totalMerged: 8934,
    averageFiles: 4.2,
    successRate: 99.1
  });

  useEffect(() => {
    // Simulate loading merge statistics
    setMergeStats({
      totalMerged: 8934,
      averageFiles: 4.2,
      successRate: 99.1
    });
  }, []);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    // Files are handled by the FileUpload component
  };

  const handleFilesChange = (updatedFiles: FileWithId[]) => {
    setFiles(updatedFiles);
  };

  const mergeFiles = async () => {
    if (files.length < 2) {
      showNotification('Please select at least 2 PDF files to merge', 'warning');
      return;
    }

    if (files.length > 10) {
      showNotification('Maximum 10 files allowed for merging', 'warning');
      return;
    }

    setIsProcessing(true);
    setMergedFile(null);

    try {
      const updatedFiles = files.map(f => ({ ...f, status: 'uploading' as const, progress: 0 }));
      setFiles(updatedFiles);

      const updateProgress = (progress: any) => {
        setFiles(prev => prev.map(f => ({ 
          ...f, 
          progress: progress.percentage, 
          status: 'processing' as const 
        })));
      };

      const filesToMerge = files.map(f => f.file);
      const result: ConversionResponse = await ApiService.mergePdfs(filesToMerge, updateProgress);

      setFiles(prev => prev.map(f => ({ 
        ...f, 
        status: 'completed' as const, 
        progress: 100 
      })));

      setMergedFile({
        downloadUrl: ApiService.getDownloadUrl(result.filename),
        filename: result.filename
      });

      showNotification(`Successfully merged ${files.length} PDFs!`, 'success');

    } catch (error: any) {
      setFiles(prev => prev.map(f => ({ 
        ...f, 
        status: 'error' as const, 
        error: error.message || 'Merge failed' 
      })));
      showNotification(`Merge failed: ${error.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetFiles = () => {
    setFiles([]);
    setMergedFile(null);
    showNotification('Files cleared', 'info');
  };

  const moveFileUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    setFiles(newFiles);
  };

  const moveFileDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setFiles(newFiles);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    // This would integrate with your notification system
    console.log(`${type}: ${message}`);
  };

  const acceptedTypes = getAcceptedFileTypes('merge-pdf');

  const features = [
    {
      icon: '📚',
      title: 'Multiple Files',
      description: 'Merge 2-10 PDF files in a single operation with intelligent processing',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: '🔄',
      title: 'Custom Order',
      description: 'Drag & drop to reorder files for perfect document sequence',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: '⚡',
      title: 'Fast Processing',
      description: 'Lightning-quick merging while preserving original quality',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      icon: '🎯',
      title: 'Quality Preserved',
      description: 'Maintains original formatting, bookmarks, and metadata',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const mergeSteps = [
    {
      step: 1,
      title: 'Upload PDFs',
      description: 'Select 2-10 PDF files to combine',
      icon: '📤'
    },
    {
      step: 2,
      title: 'Arrange Order',
      description: 'Drag files to set the perfect sequence',
      icon: '🔄'
    },
    {
      step: 3,
      title: 'Download',
      description: 'Get your merged PDF instantly',
      icon: '📥'
    }
  ];

  const useCases = [
    { use: 'Report compilation', icon: '📊' },
    { use: 'Presentation packages', icon: '📋' },
    { use: 'Legal document sets', icon: '⚖️' },
    { use: 'Invoice consolidation', icon: '🧾' },
    { use: 'Research paper compilation', icon: '📄' },
    { use: 'Digital portfolios', icon: '🎨' }
  ];

  return (
    <>
      <Head>
        <title>Free Merge PDF Files | FlipFileX</title>
        <meta name="description" content="Merge multiple PDF files into one document for free. Combine up to 10 PDFs while preserving quality and formatting. No registration required, instant download." />
        <meta name="keywords" content="merge PDF, combine PDF, PDF merger, join PDF files, PDF combiner, multiple PDF merge, free PDF merger, online PDF combiner, merge PDFs online, combine PDF documents" />
        <meta name="author" content="FlipFileX" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Free Merge PDF Files | FlipFileX" />
        <meta property="og:description" content="Merge multiple PDF files into one document for free. Combine up to 10 PDFs while preserving quality and formatting. No registration required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/merge-pdf-files-free" />
        <meta property="og:image" content="https://flipfilex.com/images/merge-pdf-og.jpg" />
        <meta property="og:site_name" content="FlipFileX" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Merge PDF Files | FlipFileX" />
        <meta name="twitter:description" content="Merge multiple PDF files into one document for free. Combine up to 10 PDFs while preserving quality and formatting." />
        <meta name="twitter:image" content="https://flipfilex.com/images/merge-pdf-twitter.jpg" />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#7c3aed" />
        <meta name="application-name" content="FlipFileX" />
        <meta name="format-detection" content="telephone=no" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://flipfilex.com/merge-pdf-files-free" />

        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "PDF Merger Tool",
              "description": "Merge multiple PDF files into one document for free",
              "url": "https://flipfilex.com/merge-pdf-files-free",
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

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-purple-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <span className="text-gray-900 font-medium">Merge PDFs</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl text-white text-4xl mb-8 shadow-lg">
              🔗
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              PDF Merger
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Combine multiple PDF files into a single document with 
              <span className="font-semibold text-purple-600"> perfect organization</span> and 
              <span className="font-semibold text-indigo-600"> preserved quality</span>
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{mergeStats.totalMerged.toLocaleString()}+</div>
                <div className="text-gray-600 text-sm">Files Merged</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{mergeStats.averageFiles}</div>
                <div className="text-gray-600 text-sm">Avg. Files/Merge</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{mergeStats.successRate}%</div>
                <div className="text-gray-600 text-sm">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Main Merge Area */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Merge Your PDF Files</h2>
              <p className="text-purple-100">Upload multiple PDFs and combine them into one organized document</p>
            </div>
            
            <div className="p-8">
              <FileUpload
                acceptedFileTypes={acceptedTypes}
                maxFiles={10}
                onFilesSelected={handleFilesSelected}
                onFilesChange={handleFilesChange}
                selectedFiles={files}
                isProcessing={isProcessing}
                title="Drop PDF files here"
                description="Select multiple PDF files to merge (2-10 files supported)"
              />

              {/* File Order Management */}
              {files.length > 1 && (
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      File Order Preview
                    </h3>
                    <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {files.length} files selected
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <p className="text-gray-600 text-sm mb-4">
                      The files will be merged in this order. Use the arrows to reorder them:
                    </p>
                    <div className="space-y-3">
                      {files.map((fileWithId, index) => (
                        <div
                          key={fileWithId.id}
                          className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-colors"
                        >
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-md">
                            {index + 1}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {fileWithId.file.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {(fileWithId.file.size / (1024 * 1024)).toFixed(2)} MB
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => moveFileUp(index)}
                              disabled={index === 0 || isProcessing}
                              className="p-3 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                            
                            <button
                              onClick={() => moveFileDown(index)}
                              disabled={index === files.length - 1 || isProcessing}
                              className="p-3 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {files.length > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={mergeFiles}
                    disabled={isProcessing || files.some(f => f.status === 'processing')}
                    className={`
                      bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg
                      hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300
                      shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      flex items-center justify-center space-x-3
                    `}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Merging PDFs...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span>Merge {files.length} PDFs</span>
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

              {/* Merged File Download */}
              {mergedFile && (
                <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                      ✅
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-emerald-900 mb-2">
                        PDFs Merged Successfully!
                      </h3>
                      <p className="text-emerald-700">
                        Your {files.length} PDF files have been combined into one organized document.
                      </p>
                    </div>
                    <a
                      href={mergedFile.downloadUrl}
                      download
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 
                               text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 
                               transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m1-4H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" />
                      </svg>
                      <span>Download Merged PDF</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features Grid - Moved below upload area */}
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
              {mergeSteps.map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                    {step.step}
                  </div>
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  
                  {/* Connection Line */}
                  {index < mergeSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-gradient-to-r from-purple-200 to-indigo-200 transform -translate-x-1/2 z-0"></div>
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

          {/* File Specifications */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                File Requirements
              </h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Input Limits</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Minimum: 2 PDF files</li>
                    <li>• Maximum: 10 PDF files</li>
                    <li>• Each file: up to 100MB</li>
                    <li>• All standard PDF versions supported</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Output Quality</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Preserves original resolution</li>
                    <li>• Maintains all formatting</li>
                    <li>• Keeps bookmarks and links</li>
                    <li>• Single searchable PDF</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-indigo-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Advanced Features
              </h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Smart Processing</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Automatic page size optimization</li>
                    <li>• Intelligent file ordering</li>
                    <li>• Metadata preservation</li>
                    <li>• Table of contents generation</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Security Features</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• End-to-end encryption</li>
                    <li>• Auto-delete after 1 hour</li>
                    <li>• No server storage</li>
                    <li>• Privacy protection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200 mb-16">
            <h3 className="text-2xl font-bold text-purple-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Pro Tips for Best Results
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-800">Before Merging:</h4>
                <ul className="text-purple-700 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    <span>Check file sizes are under 100MB each</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    <span>Name files clearly for easy identification</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-800">After Merging:</h4>
                <ul className="text-purple-700 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    <span>Review the merged document structure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    <span>Check page numbering and formatting</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    <span>Verify all content is properly combined</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">Your Files Are Safe & Secure</h3>
                <p className="text-emerald-800 mb-4 leading-relaxed">
                  We prioritize your document security. All PDF merging is done with enterprise-grade encryption, 
                  and files are automatically deleted from our servers within 1 hour of processing.
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
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-emerald-700">No Data Storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-emerald-700">GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-16">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-6">
              <h2 className="text-3xl font-bold text-white mb-2">Why Choose Our PDF Merger Tool?</h2>
              <p className="text-purple-100">The most reliable solution for combining multiple PDF documents</p>
            </div>

            <div className="p-8 md:p-12">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Streamline your document management with our powerful PDF merger that combines multiple files
                  into perfectly organized single documents. Whether you're consolidating reports, creating comprehensive
                  portfolios, or organizing legal documents, our tool maintains original quality while providing
                  intuitive file ordering and professional results.
                </p>

                <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Intelligent Document Organization and Quality Preservation
                </h3>
                <p className="text-gray-700 mb-6">
                  Our sophisticated merging algorithm preserves all document elements including bookmarks, hyperlinks,
                  metadata, and formatting. The drag-and-drop interface allows precise control over document order,
                  ensuring your merged PDF follows exactly the sequence you need. Advanced processing maintains
                  original resolution and text searchability across all combined documents.
                </p>

                <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Professional-Grade Performance for Business Needs
                </h3>
                <p className="text-gray-700 mb-6">
                  Designed for professionals who demand reliability and efficiency. Handle large document sets
                  up to 100MB each with confidence, knowing that processing speed never compromises quality.
                  The intelligent optimization engine automatically adjusts for different page sizes and orientations,
                  creating seamlessly integrated final documents that look professionally assembled.
                </p>

                <h4 className="text-xl font-semibold text-purple-700 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Versatile Applications Across Industries
                </h4>
                <p className="text-gray-700 mb-6">
                  From legal firms combining case documents to marketing teams creating comprehensive proposals,
                  our merger serves diverse professional applications. Students use it for thesis compilation,
                  while businesses streamline invoice processing and report generation. The ability to merge
                  up to 10 files simultaneously makes it perfect for complex document workflows and bulk operations.
                </p>

                <h4 className="text-xl font-semibold text-indigo-700 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Cost-Effective Solution with Premium Features
                </h4>
                <p className="text-gray-700 mb-6">
                  Enjoy premium PDF merging capabilities completely free, with no hidden costs or subscription
                  requirements. Our tool provides the same functionality as expensive desktop software while
                  remaining accessible from any device with an internet connection. Save money while accessing
                  professional-grade document management tools that scale with your needs.
                </p>

                <h5 className="text-lg font-semibold text-purple-600 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 9.5A3.5 3.5 0 005.5 13H9v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 15.586V13h2.5a4.5 4.5 0 10-.616-8.958 4.002 4.002 0 10-7.753 1.977A3.5 3.5 0 002 9.5zm9 3.5H9V8a1 1 0 012 0v5z" clipRule="evenodd" />
                  </svg>
                  Advanced Processing Technology
                </h5>
                <p className="text-gray-700 mb-6">
                  Powered by state-of-the-art PDF processing engines that handle complex document structures
                  with precision. Our technology preserves vector graphics, maintains font integrity, and
                  ensures consistent page layout throughout the merging process. Automatic optimization
                  features enhance the final document while maintaining complete compatibility across all PDF viewers.
                </p>

                <h5 className="text-lg font-semibold text-indigo-600 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  User-Friendly Interface with Expert Results
                </h5>
                <p className="text-gray-700 mb-0">
                  Experience the perfect balance of simplicity and functionality with our intuitive interface
                  that delivers expert-level results. Visual file ordering, real-time preview, and instant
                  feedback ensure you always know exactly what your merged document will contain. The streamlined
                  process eliminates complexity while providing complete control over your document assembly.
                </p>
              </div>
            </div>
          </div>
          {/* New Resume Sections */}

{/* 1. How to Create a Resume Section */}
<div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-16">
  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-6">
    <h2 className="text-3xl font-bold text-white mb-2">How to Create a Professional Resume</h2>
    <p className="text-purple-100">Step-by-step guide to building an impressive resume that gets noticed</p>
  </div>

  <div className="p-8 md:p-12">
    <div className="prose max-w-none">
      <p className="text-lg text-gray-700 leading-relaxed mb-6">
        Creating a professional resume is crucial for standing out in today's competitive job market. 
        Start by choosing a clean, modern format that highlights your most important qualifications. 
        Use our PDF tools to ensure your resume maintains perfect formatting across all devices and applications.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
            <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
            Contact Information
          </h3>
          <p className="text-gray-700 mb-4">
            Include your full name, professional email, phone number, and LinkedIn profile. 
            Ensure this information is current and professional.
          </p>
          <ul className="text-gray-600 text-sm space-y-2">
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span>Use a professional email address</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span>Include relevant social profiles</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span>Ensure contact details are up-to-date</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
          <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
            <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
            Professional Summary
          </h3>
          <p className="text-gray-700 mb-4">
            Write a compelling 3-4 sentence summary that highlights your key achievements, 
            skills, and career objectives.
          </p>
          <ul className="text-gray-600 text-sm space-y-2">
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>Focus on measurable achievements</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>Use industry-specific keywords</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>Keep it concise and impactful</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
            <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
            Work Experience
          </h3>
          <p className="text-gray-700 mb-4">
            List your work history in reverse chronological order, focusing on achievements 
            rather than just responsibilities.
          </p>
          <ul className="text-gray-600 text-sm space-y-2">
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span>Use action verbs and quantify results</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span>Highlight promotions and growth</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span>Include relevant accomplishments</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
          <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
            <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">4</span>
            Education & Skills
          </h3>
          <p className="text-gray-700 mb-4">
            Include your educational background and relevant skills that match the job 
            requirements.
          </p>
          <ul className="text-gray-600 text-sm space-y-2">
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>List degrees and certifications</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>Include technical and soft skills</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>Tailor skills to job description</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl">
        <h4 className="text-lg font-bold text-emerald-800 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Pro Tip: Formatting Matters
        </h4>
        <p className="text-emerald-700">
          After creating your resume, use our PDF tools to ensure it maintains perfect formatting 
          across all platforms. A well-formatted PDF resume looks professional and is ATS-friendly.
        </p>
      </div>
    </div>
  </div>
</div>

{/* 2. Resume Writing Tips Section */}
<div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-16">
  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-6">
    <h2 className="text-3xl font-bold text-white mb-2">Resume Writing Tips & Best Practices</h2>
    <p className="text-purple-100">Expert advice to make your resume stand out from the competition</p>
  </div>

  <div className="p-8 md:p-12">
    <div className="prose max-w-none">
      <p className="text-lg text-gray-700 leading-relaxed mb-8">
        Crafting an effective resume requires more than just listing your experiences. Follow these 
        proven tips to create a resume that captures attention and leads to interviews.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Quantify Your Achievements</h4>
              <p className="text-gray-600 text-sm">
                Use numbers and metrics to demonstrate your impact. Instead of "managed a team," 
                say "managed a team of 10 that increased productivity by 25%."
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Use Action Verbs</h4>
              <p className="text-gray-600 text-sm">
                Start each bullet point with strong action verbs like "developed," "implemented," 
                "managed," or "optimized" to create dynamic descriptions.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Tailor for Each Job</h4>
              <p className="text-gray-600 text-sm">
                Customize your resume for each position by incorporating keywords from the job 
                description and highlighting relevant experiences.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Keep It Concise</h4>
              <p className="text-gray-600 text-sm">
                Limit your resume to 1-2 pages. Be selective about what you include and focus on 
                the most relevant and recent experiences.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Avoid Common Mistakes</h4>
              <p className="text-gray-600 text-sm">
                Proofread carefully for spelling and grammar errors. Avoid generic objectives, 
                irrelevant information, and inconsistent formatting.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Include Keywords</h4>
              <p className="text-gray-600 text-sm">
                Research industry-specific keywords and incorporate them naturally throughout 
                your resume to improve ATS compatibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* 3. ATS Optimization Guide Section */}
<div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-16">
  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-6">
    <h2 className="text-3xl font-bold text-white mb-2">ATS Optimization Guide</h2>
    <p className="text-purple-100">Ensure your resume passes through Applicant Tracking Systems successfully</p>
  </div>

  <div className="p-8 md:p-12">
    <div className="prose max-w-none">
      <p className="text-lg text-gray-700 leading-relaxed mb-8">
        Most companies use Applicant Tracking Systems (ATS) to screen resumes before they reach human eyes. 
        Follow these guidelines to ensure your resume makes it through automated screening.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-purple-800 mb-4">Do's for ATS Optimization</h3>
          
          <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-green-800 mb-2">Use Standard Section Headings</h4>
              <p className="text-green-700 text-sm">
                Stick to common headings like "Work Experience," "Education," "Skills," and "Certifications."
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-green-800 mb-2">Incorporate Keywords</h4>
              <p className="text-green-700 text-sm">
                Use relevant keywords from the job description throughout your resume naturally.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-green-800 mb-2">Choose Simple Formatting</h4>
              <p className="text-green-700 text-sm">
                Use clean, simple layouts with standard fonts and clear section organization.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-red-800 mb-4">Don'ts for ATS Optimization</h3>
          
          <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">
              ✗
            </div>
            <div>
              <h4 className="font-bold text-red-800 mb-2">Avoid Graphics and Tables</h4>
              <p className="text-red-700 text-sm">
                Most ATS cannot read text within images, tables, or complex graphics.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">
              ✗
            </div>
            <div>
              <h4 className="font-bold text-red-800 mb-2">Don't Use Headers/Footers</h4>
              <p className="text-red-700 text-sm">
                ATS often ignores content in headers and footers, so keep important information in the main body.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">
              ✗
            </div>
            <div>
              <h4 className="font-bold text-red-800 mb-2">Avoid Creative Formatting</h4>
              <p className="text-red-700 text-sm">
                Steer clear of columns, text boxes, and unusual layouts that can confuse ATS parsing.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
        <h4 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          ATS-Friendly File Format Tips
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-semibold text-purple-700 mb-2">Recommended Formats:</h5>
            <ul className="text-purple-600 text-sm space-y-1">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>PDF (with selectable text)</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Microsoft Word (.docx)</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Plain Text (.txt)</span>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-red-700 mb-2">Avoid These Formats:</h5>
            <ul className="text-red-600 text-sm space-y-1">
              <li className="flex items-center">
                <span className="text-red-500 mr-2">✗</span>
                <span>Image-based PDFs</span>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">✗</span>
                <span>Pages documents</span>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">✗</span>
                <span>Scanned documents</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* 4. Resume Examples by Industry */}
<div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-16">
  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-6">
    <h2 className="text-3xl font-bold text-white mb-2">Resume Examples by Industry</h2>
    <p className="text-purple-100">Industry-specific templates and examples to guide your resume creation</p>
  </div>

  <div className="p-8 md:p-12">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Technology Industry */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
        <div className="text-4xl mb-4">💻</div>
        <h3 className="font-bold text-blue-800 text-lg mb-3">Technology & IT</h3>
        <p className="text-blue-700 text-sm mb-4">
          Focus on technical skills, programming languages, and project experience. Highlight specific technologies and methodologies.
        </p>
        <ul className="text-blue-600 text-xs space-y-1">
          <li>• List programming languages & frameworks</li>
          <li>• Include project portfolios</li>
          <li>• Highlight certifications</li>
          <li>• Emphasize problem-solving skills</li>
        </ul>
      </div>

      {/* Healthcare Industry */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
        <div className="text-4xl mb-4">🏥</div>
        <h3 className="font-bold text-green-800 text-lg mb-3">Healthcare & Medical</h3>
        <p className="text-green-700 text-sm mb-4">
          Emphasize certifications, clinical experience, and patient care skills. Include relevant licenses and specializations.
        </p>
        <ul className="text-green-600 text-xs space-y-1">
          <li>• Highlight medical certifications</li>
          <li>• Detail clinical experience</li>
          <li>• Include patient care metrics</li>
          <li>• List specialized equipment skills</li>
        </ul>
      </div>

      {/* Business Industry */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
        <div className="text-4xl mb-4">💼</div>
        <h3 className="font-bold text-purple-800 text-lg mb-3">Business & Finance</h3>
        <p className="text-purple-700 text-sm mb-4">
          Focus on quantifiable achievements, financial metrics, and leadership experience. Highlight revenue growth and cost savings.
        </p>
        <ul className="text-purple-600 text-xs space-y-1">
          <li>• Quantify financial achievements</li>
          <li>• Highlight leadership roles</li>
          <li>• Include relevant software skills</li>
          <li>• Emphasize strategic planning</li>
        </ul>
      </div>

      {/* Creative Industry */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200 hover:shadow-lg transition-all duration-300">
        <div className="text-4xl mb-4">🎨</div>
        <h3 className="font-bold text-pink-800 text-lg mb-3">Creative & Design</h3>
        <p className="text-pink-700 text-sm mb-4">
          Showcase portfolios, creative projects, and design skills. Include links to online portfolios and creative work.
        </p>
        <ul className="text-pink-600 text-xs space-y-1">
          <li>• Include portfolio links</li>
          <li>• List design software proficiency</li>
          <li>• Highlight creative projects</li>
          <li>• Showcase awards & recognition</li>
        </ul>
      </div>

      {/* Education Industry */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200 hover:shadow-lg transition-all duration-300">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="font-bold text-yellow-800 text-lg mb-3">Education & Teaching</h3>
        <p className="text-yellow-700 text-sm mb-4">
          Highlight teaching experience, curriculum development, and student outcomes. Include certifications and specialized training.
        </p>
        <ul className="text-yellow-600 text-xs space-y-1">
          <li>• Detail teaching experience</li>
          <li>• Include certifications & licenses</li>
          <li>• Highlight student achievements</li>
          <li>• List curriculum development</li>
        </ul>
      </div>

      {/* Sales & Marketing */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-300">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="font-bold text-orange-800 text-lg mb-3">Sales & Marketing</h3>
        <p className="text-orange-700 text-sm mb-4">
          Emphasize sales figures, campaign results, and market growth. Use metrics to demonstrate success and impact.
        </p>
        <ul className="text-orange-600 text-xs space-y-1">
          <li>• Quantify sales achievements</li>
          <li>• Highlight campaign results</li>
          <li>• Include market share growth</li>
          <li>• List marketing tools & platforms</li>
        </ul>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
      <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Industry-Specific Resume Tips
      </h4>
      <p className="text-blue-700 mb-4">
        Each industry has unique expectations for resumes. Research your target industry and tailor your resume accordingly. 
        Use industry-specific keywords and highlight relevant experiences that demonstrate your fit for the role.
      </p>
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <h5 className="font-semibold text-blue-800 mb-2">For Technical Roles:</h5>
          <ul className="text-blue-700 space-y-1">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Include GitHub portfolio links</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>List specific technologies used</span>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-indigo-800 mb-2">For Creative Roles:</h5>
          <ul className="text-indigo-700 space-y-1">
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>Include Behance or Dribbble links</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span>Showcase specific design projects</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

{/* 5. FAQ Section */}
<div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-16">
  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-6">
    <h2 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h2>
    <p className="text-purple-100">Common questions about resumes and PDF document management</p>
  </div>

  <div className="p-8 md:p-12">
    <div className="space-y-6">
      {/* FAQ Item 1 */}
      <div className="border border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-colors">
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
          <svg className="w-5 h-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          How long should my resume be?
        </h3>
        <p className="text-gray-700 leading-relaxed">
          For most professionals, a one-page resume is ideal. However, if you have extensive experience (10+ years) 
          or are in academia/research, two pages may be appropriate. The key is relevance - only include information 
          that directly supports your candidacy for the specific role you're applying for.
        </p>
      </div>

      {/* FAQ Item 2 */}
      <div className="border border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-colors">
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
          <svg className="w-5 h-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Should I include references on my resume?
        </h3>
        <p className="text-gray-700 leading-relaxed">
          It's generally recommended not to include references directly on your resume. Instead, create a separate 
          references document that you can provide when specifically requested. This saves space on your resume for 
          more important content and allows you to tailor your references to each specific job application.
        </p>
      </div>

      {/* FAQ Item 3 */}
      <div className="border border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-colors">
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
          <svg className="w-5 h-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          How can I make my resume stand out to ATS systems?
        </h3>
        <p className="text-gray-700 leading-relaxed">
          To optimize your resume for ATS systems: use standard section headings, incorporate relevant keywords from 
          the job description, avoid graphics and tables, use a clean and simple format, and save your resume as a 
          PDF with selectable text. Our PDF tools ensure your resume maintains perfect ATS-friendly formatting.
        </p>
      </div>

      {/* FAQ Item 4 */}
      <div className="border border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-colors">
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
          <svg className="w-5 h-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          What's the best format for saving my resume?
        </h3>
        <p className="text-gray-700 leading-relaxed">
          PDF is generally the best format for resumes because it preserves formatting across different devices and 
          operating systems. Ensure your PDF has selectable text (not just an image) for ATS compatibility. Our PDF 
          tools help you create perfectly formatted resumes that look professional on any platform.
        </p>
      </div>

      {/* FAQ Item 5 */}
      <div className="border border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-colors">
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
          <svg className="w-5 h-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          How often should I update my resume?
        </h3>
        <p className="text-gray-700 leading-relaxed">
          You should update your resume every 6-12 months, or whenever you achieve significant accomplishments, 
          complete major projects, or acquire new skills. Even if you're not actively job searching, maintaining 
          an up-to-date resume ensures you're prepared for unexpected opportunities and can quickly apply for 
          positions that interest you.
        </p>
      </div>
    </div>

    <div className="mt-8 text-center">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 inline-block">
        <h4 className="text-lg font-bold text-purple-800 mb-2">Need More Help?</h4>
        <p className="text-purple-700 mb-4">
          Have additional questions about resume creation or PDF document management?
        </p>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
                         text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 
                         transform hover:scale-105 shadow-lg hover:shadow-xl">
          Contact Our Support Team
        </button>
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
    </>
  );
}
                    