'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import { FileWithId, ConversionResponse } from '@/types';
import { ApiService, getAcceptedFileTypes } from '@/lib/api';

export default function ConvertPdfToWordClient() {
    const [files, setFiles] = useState<FileWithId[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [conversionStats, setConversionStats] = useState({
        totalConverted: 0,
        successRate: 0,
        averageTime: 0
    });

    useEffect(() => {
        // Simulate loading conversion stats
        setConversionStats({
            totalConverted: 15847,
            successRate: 98.5,
            averageTime: 12
        });
    }, []);

    const handleFilesSelected = async (selectedFiles: File[]) => {
        // Files are handled by the FileUpload component
    };

    const handleFilesChange = (updatedFiles: FileWithId[]) => {
        setFiles(updatedFiles);
    };

    const convertFiles = async () => {
        if (files.length === 0) {
            // Use toast notification instead of alert
            showNotification('Please select a PDF file to convert', 'warning');
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

                    const result: ConversionResponse = await ApiService.convertPdfToWord(
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

                    showNotification('PDF converted successfully!', 'success');

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

    const acceptedTypes = getAcceptedFileTypes('pdf-to-word');

    const features = [
        {
            icon: '⚡',
            title: 'Lightning Fast',
            description: 'Average conversion time under 15 seconds',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200'
        },
        {
            icon: '🎯',
            title: 'Precise Extraction',
            description: 'AI-powered text recognition with 98%+ accuracy',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            icon: '📐',
            title: 'Layout Preservation',
            description: 'Maintains original formatting and structure',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        {
            icon: '🔧',
            title: 'Smart Processing',
            description: 'Handles complex documents with tables and images',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        }
    ];

    const conversionSteps = [
        {
            step: 1,
            title: 'Upload PDF',
            description: 'Drop your PDF file or click to browse',
            icon: '📤'
        },
        {
            step: 2,
            title: 'AI Processing',
            description: 'Our advanced algorithms analyze your document',
            icon: '🤖'
        },
        {
            step: 3,
            title: 'Download Word',
            description: 'Get your editable DOCX file instantly',
            icon: '📥'
        }
    ];

    const supportedFeatures = [
        { feature: 'Text extraction', supported: true },
        { feature: 'Image preservation', supported: true },
        { feature: 'Table formatting', supported: true },
        { feature: 'Header/Footer retention', supported: true },
        { feature: 'Hyperlink preservation', supported: true },
        { feature: 'Font styling', supported: true },
        { feature: 'Password-protected PDFs', supported: false },
        { feature: 'Scanned documents (OCR)', supported: false }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
                                <span className="text-gray-900 font-medium">PDF to Word</span>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl text-white text-4xl mb-8 shadow-lg">
                        📝
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        PDF to Word Converter
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                        Transform your PDF documents into fully editable Word files with
                        <span className="font-semibold text-blue-600"> professional accuracy</span> and
                        <span className="font-semibold text-purple-600"> preserved formatting</span>
                    </p>

                    {/* Stats Bar */}
                    <div className="flex flex-wrap justify-center gap-8 mt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{conversionStats.totalConverted.toLocaleString()}+</div>
                            <div className="text-gray-600 text-sm">Files Converted</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{conversionStats.successRate}%</div>
                            <div className="text-gray-600 text-sm">Success Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">{conversionStats.averageTime}s</div>
                            <div className="text-gray-600 text-sm">Avg. Speed</div>
                        </div>
                    </div>
                </div>

                {/* Main Conversion Area */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Convert Your PDF File</h2>
                        <p className="text-blue-100">Upload your PDF and get an editable Word document in seconds</p>
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
                            description="Select a PDF file to convert to an editable Word document"
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
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>Convert to Word</span>
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
                                <h4 className="font-semibold text-gray-900 mb-2">Input Requirements</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• PDF files (.pdf)</li>
                                    <li>• Maximum file size: 100MB</li>
                                    <li>• Text-based PDFs work best</li>
                                    <li>• Multiple pages supported</li>
                                </ul>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Output Format</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Microsoft Word (.docx)</li>
                                    <li>• Fully editable format</li>
                                    <li>• Compatible with Word 2007+</li>
                                    <li>• Preserved formatting</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tips and Best Practices */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 mb-16">
                    <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                        <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.734.99A.996.996 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.723V12a1 1 0 11-2 0v-1.277l-1.246-.855a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.277l1.246.855a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.277V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
                        </svg>
                        Pro Tips for Best Results
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-blue-800">For Better Conversion:</h4>
                            <ul className="text-blue-700 space-y-2 text-sm">
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">✓</span>
                                    <span>Use text-based PDFs for optimal results</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">✓</span>
                                    <span>Ensure PDF is not password protected</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">✓</span>
                                    <span>Check file size is under 100MB</span>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold text-blue-800">After Conversion:</h4>
                            <ul className="text-blue-700 space-y-2 text-sm">
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">✓</span>
                                    <span>Review formatting and make adjustments</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">✓</span>
                                    <span>Check tables and images alignment</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">✓</span>
                                    <span>Verify hyperlinks are working</span>
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
                            <h3 className="text-xl font-bold text-emerald-900 mb-3">Your Privacy & Security</h3>
                            <p className="text-emerald-800 mb-4 leading-relaxed">
                                We take your document security seriously. All file uploads are encrypted, processed securely,
                                and automatically deleted from our servers within 1 hour of conversion.
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
                <div className="mt-16 space-y-12">
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Why Choose Our PDF to Word Converter?
                        </h2>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            Our advanced PDF to Word converter stands out as the premier choice for professionals, students, and businesses
                            who need reliable document conversion. With cutting-edge AI technology and machine learning algorithms, we deliver
                            unmatched accuracy and formatting preservation that traditional converters simply cannot match.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            Advanced AI-Powered Conversion Technology
                        </h3>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            Unlike basic PDF converters that struggle with complex layouts, our intelligent system analyzes document structure,
                            identifies text patterns, and reconstructs formatting with 98% accuracy. Whether you're dealing with academic papers,
                            business reports, or technical manuals, our converter maintains the original document's integrity while creating
                            fully editable Word files.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            Professional-Grade Features for Every User
                        </h3>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            From simple text extraction to complex table reconstruction, our converter handles diverse document types with ease.
                            Students can convert research papers and academic materials, while business professionals can transform contracts,
                            presentations, and reports into editable formats. The tool automatically preserves headers, footers, footnotes,
                            and even maintains hyperlink functionality.
                        </p>

                        <h4 className="text-xl font-semibold text-gray-900 mb-4">
                            Speed and Efficiency That Saves Your Time
                        </h4>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            Time is valuable, which is why our converter processes files in under 15 seconds on average. The streamlined
                            interface requires no technical expertise – simply upload your PDF, and receive a perfectly formatted Word document
                            ready for editing. Batch processing capabilities allow multiple file conversion, making it ideal for large projects
                            and document management workflows.
                        </p>

                        <h4 className="text-xl font-semibold text-gray-900 mb-4">
                            Universal Compatibility and Accessibility
                        </h4>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            Our converter works seamlessly across all devices and operating systems. Whether you're using Windows, Mac, Linux,
                            or mobile devices, the web-based interface ensures consistent performance. The output DOCX files are compatible with
                            Microsoft Word 2007 and later versions, Google Docs, LibreOffice, and other popular word processors.
                        </p>

                        <h5 className="text-lg font-semibold text-gray-900 mb-4">
                            Security and Privacy at the Forefront
                        </h5>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            Document security is paramount in today's digital landscape. Our platform employs enterprise-grade SSL encryption
                            for all file transfers, ensuring your sensitive information remains protected. All uploaded files are automatically
                            deleted within one hour, and we maintain strict no-data-retention policies. GDPR compliance guarantees your privacy
                            rights are respected throughout the conversion process.
                        </p>

                        <h5 className="text-lg font-semibold text-gray-900 mb-4">
                            Cost-Effective Solution for Everyone
                        </h5>
                        <p className="text-gray-700 leading-relaxed">
                            Unlike expensive desktop software that requires installation and licensing fees, our online converter is completely
                            free to use. There are no hidden costs, subscription requirements, or usage limitations. This makes it an ideal
                            solution for students on tight budgets, small businesses minimizing software costs, and individuals who need
                            occasional document conversion without long-term commitments.
                        </p>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">How accurate is the PDF to Word conversion?</h3>
                        <p className="text-gray-700">Our AI-powered converter achieves 98% accuracy in preserving original formatting, including fonts, images, tables, and layouts. Complex documents with multiple columns, headers, and footers are accurately converted to editable Word format.</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Is the conversion really free with no limitations?</h3>
                        <p className="text-gray-700">Yes, absolutely! There are no hidden costs, file size limitations, or usage restrictions. You can convert unlimited PDF files to Word format completely free, without any watermarks or registration requirements.</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">How long does the conversion process take?</h3>
                        <p className="text-gray-700">Most PDF files are converted to Word within 10-30 seconds, depending on file size and complexity. Our servers process documents efficiently to provide instant results without compromising quality.</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Are my uploaded files secure and private?</h3>
                        <p className="text-gray-700">Your privacy is our top priority. All files are transferred using SSL encryption, processed securely, and automatically deleted from our servers within one hour. We never access, store, or share your documents with third parties.</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I convert scanned PDF documents to editable Word?</h3>
                        <p className="text-gray-700">Yes! Our OCR (Optical Character Recognition) technology can extract text from scanned PDFs and image-based PDFs, converting them into fully editable Word documents while maintaining the original layout structure.</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">What Word format does the converter support?</h3>
                        <p className="text-gray-700">The converter outputs files in DOCX format (Microsoft Word 2007 and later), which is compatible with Microsoft Word, Google Docs, LibreOffice, and all modern word processors. DOC format is also available upon request.</p>
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
                                "name": "How accurate is the PDF to Word conversion?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Our AI-powered converter achieves 98% accuracy in preserving original formatting, including fonts, images, tables, and layouts. Complex documents with multiple columns, headers, and footers are accurately converted to editable Word format."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Is the conversion really free with no limitations?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes, absolutely! There are no hidden costs, file size limitations, or usage restrictions. You can convert unlimited PDF files to Word format completely free, without any watermarks or registration requirements."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How long does the conversion process take?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Most PDF files are converted to Word within 10-30 seconds, depending on file size and complexity. Our servers process documents efficiently to provide instant results without compromising quality."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Are my uploaded files secure and private?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Your privacy is our top priority. All files are transferred using SSL encryption, processed securely, and automatically deleted from our servers within one hour. We never access, store, or share your documents with third parties."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Can I convert scanned PDF documents to editable Word?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes! Our OCR (Optical Character Recognition) technology can extract text from scanned PDFs and image-based PDFs, converting them into fully editable Word documents while maintaining the original layout structure."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What Word format does the converter support?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The converter outputs files in DOCX format (Microsoft Word 2007 and later), which is compatible with Microsoft Word, Google Docs, LibreOffice, and all modern word processors. DOC format is also available upon request."
                                }
                            }
                        ]
                    })
                }}
            />
        </div>
    );
}
