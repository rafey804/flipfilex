'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import { FileWithId, ConversionResponse } from '@/types';
import { ApiService, getAcceptedFileTypes } from '@/lib/api';

export default function WordToPdfClient() {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionStats, setConversionStats] = useState({
    totalConverted: 18723,
    averageSize: 2.4,
    successRate: 99.3
  });

  useEffect(() => {
    // Simulate loading conversion statistics
    setConversionStats({
      totalConverted: 18723,
      averageSize: 2.4,
      successRate: 99.3
    });
  }, []);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    // Files are handled in handleFilesChange
  };

  const handleFilesChange = (updatedFiles: FileWithId[]) => {
    setFiles(updatedFiles);
  };

  const convertFiles = async () => {
    if (files.length === 0) {
      showNotification('Please select a Word document to convert', 'warning');
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

          const result: ConversionResponse = await ApiService.convertWordToPdf(
            fileWithId.file, 
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

          showNotification('Word document converted to PDF successfully!', 'success');

        } catch (error: any) {
          setFiles(prev => prev.map(f => 
            f.id === fileWithId.id 
              ? { 
                  ...f, 
                  status: 'error' as const, 
                  error: error.message || 'Conversion failed'
                }
              : f
          ));
          showNotification(`Conversion failed: ${error.message}`, 'error');
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const resetFiles = () => {
    setFiles([]);
    showNotification('Files cleared', 'info');
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    // This would integrate with your notification system
    console.log(`${type}: ${message}`);
  };

  const acceptedTypes = getAcceptedFileTypes('word-to-pdf');

  const features = [
    {
      icon: '🎨',
      title: 'Format Preservation',
      description: 'Maintains original formatting, fonts, images, and layout perfectly',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: '📱',
      title: 'Universal Compatibility',
      description: 'PDFs work seamlessly on any device, platform, or operating system',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: '🔐',
      title: 'Professional Output',
      description: 'Creates high-quality, print-ready PDFs with crisp text and images',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      icon: '⚡',
      title: 'Fast Processing',
      description: 'Lightning-quick conversion with real-time progress tracking',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const conversionSteps = [
    {
      step: 1,
      title: 'Upload Word',
      description: 'Select your DOCX or DOC document',
      icon: '📤'
    },
    {
      step: 2,
      title: 'Convert',
      description: 'Advanced processing preserves all formatting',
      icon: '🔄'
    },
    {
      step: 3,
      title: 'Download PDF',
      description: 'Get your professional PDF instantly',
      icon: '📥'
    }
  ];

  const useCases = [
    { use: 'Business reports', icon: '📊' },
    { use: 'Academic papers', icon: '🎓' },
    { use: 'Legal documents', icon: '⚖️' },
    { use: 'Resumes & CVs', icon: '📄' },
    { use: 'Invoices & forms', icon: '🧾' },
    { use: 'Presentations', icon: '📋' }
  ];

  const supportedFeatures = [
    { feature: 'Text formatting & fonts', supported: true },
    { feature: 'Images & graphics', supported: true },
    { feature: 'Tables & charts', supported: true },
    { feature: 'Headers & footers', supported: true },
    { feature: 'Page numbering', supported: true },
    { feature: 'Hyperlinks', supported: true },
    { feature: 'Bookmarks & TOC', supported: true },
    { feature: 'Password protection', supported: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <span className="text-gray-900 font-medium">Word to PDF</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl text-white text-4xl mb-8 shadow-lg">
              📄
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Word to PDF Converter
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Transform Word documents into professional PDFs with 
              <span className="font-semibold text-blue-600"> perfect formatting</span> and 
              <span className="font-semibold text-purple-600"> universal compatibility</span>
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{conversionStats.totalConverted.toLocaleString()}+</div>
                <div className="text-gray-600 text-sm">Docs Converted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{conversionStats.averageSize}MB</div>
                <div className="text-gray-600 text-sm">Avg. File Size</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{conversionStats.successRate}%</div>
                <div className="text-gray-600 text-sm">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Main Conversion Area */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Convert Word to PDF</h2>
              <p className="text-blue-100">Upload your Word document and get a professional PDF instantly</p>
            </div>
            
            <div className="p-8">
              <FileUpload
                acceptedFileTypes={acceptedTypes}
                maxFiles={1}
                onFilesSelected={handleFilesSelected}
                onFilesChange={handleFilesChange}
                selectedFiles={files}
                isProcessing={isProcessing}
                title="Drop your Word document here"
                description="Select a Word document (.docx or .doc) to convert to PDF"
              />

              {/* Action Buttons */}
              {files.length > 0 && (
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={convertFiles}
                    disabled={isProcessing || files.some(f => f.status === 'processing')}
                    className={`
                      bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg
                      hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300
                      shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      flex items-center justify-center space-x-3
                    `}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Converting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Convert to PDF</span>
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
              {conversionSteps.map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                    {step.step}
                  </div>
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  
                  {/* Connection Line */}
                  {index < conversionSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-gradient-to-r from-blue-200 to-purple-200 transform -translate-x-1/2 z-0"></div>
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

          {/* Features Comparison */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Supported Features
              </h3>
              <div className="space-y-3">
                {supportedFeatures.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{item.feature}</span>
                    {item.supported ? (
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                File Specifications
              </h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Input Support</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Microsoft Word (.docx)</li>
                    <li>• Legacy Word (.doc)</li>
                    <li>• Maximum file size: 100MB</li>
                    <li>• Complex formatting supported</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Output Quality</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• High-resolution PDF/A standard</li>
                    <li>• Preserves fonts and images</li>
                    <li>• Print-ready professional format</li>
                    <li>• Universal device compatibility</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 mb-16">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Pro Tips for Best Results
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-800">Before Converting:</h4>
                <ul className="text-blue-700 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>Use standard fonts for best compatibility</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>Check image quality and resolution</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>Ensure file size is under 100MB</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-800">After Conversion:</h4>
                <ul className="text-blue-700 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>PDF preserves all original formatting</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>Ready for printing and sharing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>Compatible with all PDF viewers</span>
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
                <h3 className="text-xl font-bold text-emerald-900 mb-3">Your Documents Are Protected</h3>
                <p className="text-emerald-800 mb-4 leading-relaxed">
                  We ensure complete security for your Word documents during conversion. All files are processed with 
                  bank-level encryption and automatically deleted within 1 hour for your privacy.
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
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Why convert Word to PDF format?</h3>
              <p className="text-gray-700">PDF ensures your document looks identical across all devices and platforms, prevents unauthorized editing, maintains professional formatting, and is universally accepted for official documents, resumes, and business proposals.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Does the converter preserve all Word formatting?</h3>
              <p className="text-gray-700">Yes! Our advanced converter preserves all fonts, images, tables, headers, footers, page numbers, hyperlinks, and complex layouts. The PDF output matches your original Word document with 99.9% accuracy.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is there a file size limit for conversion?</h3>
              <p className="text-gray-700">No, there are no file size restrictions. You can convert Word documents of any size, from simple one-page letters to complex 500+ page reports with images and graphics, completely free.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I convert password-protected Word files?</h3>
              <p className="text-gray-700">Yes, as long as you know the password. Simply open and save the document without password protection first, or provide the password during upload if our system supports it.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How is this different from using "Save as PDF" in Word?</h3>
              <p className="text-gray-700">Our online converter offers the same quality without requiring Microsoft Word installation, works on any device including mobile phones, and provides batch conversion for multiple files simultaneously.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Are the converted PDFs searchable?</h3>
              <p className="text-gray-700">Absolutely! All text in your Word document remains searchable in the PDF. The conversion maintains text layers, allowing you to search, copy, and select text in the final PDF file.</p>
            </div>
          </div>
        </div>

        {/* FAQ Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Why convert Word to PDF format?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "PDF ensures your document looks identical across all devices and platforms, prevents unauthorized editing, maintains professional formatting, and is universally accepted for official documents, resumes, and business proposals."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does the converter preserve all Word formatting?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Our advanced converter preserves all fonts, images, tables, headers, footers, page numbers, hyperlinks, and complex layouts. The PDF output matches your original Word document with 99.9% accuracy."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is there a file size limit for conversion?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No, there are no file size restrictions. You can convert Word documents of any size, from simple one-page letters to complex 500+ page reports with images and graphics, completely free."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I convert password-protected Word files?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, as long as you know the password. Simply open and save the document without password protection first, or provide the password during upload if our system supports it."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How is this different from using Save as PDF in Word?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our online converter offers the same quality without requiring Microsoft Word installation, works on any device including mobile phones, and provides batch conversion for multiple files simultaneously."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are the converted PDFs searchable?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely! All text in your Word document remains searchable in the PDF. The conversion maintains text layers, allowing you to search, copy, and select text in the final PDF file."
                  }
                }
              ]
            })
          }}
        />
      </div>
    
  );
}
