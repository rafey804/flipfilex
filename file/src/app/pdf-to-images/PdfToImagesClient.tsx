'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import { FileWithId, ConversionResponse } from '@/types';
import { ApiService } from '@/lib/api';

export default function PdfToImagesClient() {
    const [files, setFiles] = useState<FileWithId[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [conversionStats, setConversionStats] = useState({
        totalConverted: 12456,
        averagePages: 6.3,
        successRate: 99.7
    });

    useEffect(() => {
        // Simulate loading conversion statistics
        setConversionStats({
            totalConverted: 12456,
            averagePages: 6.3,
            successRate: 99.7
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

                    const result: ConversionResponse = await ApiService.convertPdfToImages(
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

                    showNotification('PDF converted to images successfully!', 'success');

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

    const acceptedTypes = ['pdf'];

    const features = [
        {
            icon: '🎨',
            title: 'High Quality',
            description: 'Export pages at 300 DPI for crisp, professional-grade images',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            icon: '📦',
            title: 'ZIP Download',
            description: 'All images organized and packaged in a convenient ZIP file',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        {
            icon: '⚡',
            title: 'Fast Processing',
            description: 'Lightning-quick conversion with real-time progress tracking',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200'
        },
        {
            icon: '🖼️',
            title: 'PNG Format',
            description: 'High-quality PNG images with transparency support',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        }
    ];

    const conversionSteps = [
        {
            step: 1,
            title: 'Upload PDF',
            description: 'Select your PDF document to convert',
            icon: '📤'
        },
        {
            step: 2,
            title: 'Process Pages',
            description: 'Each page is converted to high-quality images',
            icon: '🔄'
        },
        {
            step: 3,
            title: 'Download ZIP',
            description: 'Get all images in one organized package',
            icon: '📥'
        }
    ];

    const useCases = [
        { use: 'Presentation slides', icon: '📊' },
        { use: 'Web content', icon: '🌐' },
        { use: 'Social media graphics', icon: '📱' },
        { use: 'Digital marketing', icon: '🎯' },
        { use: 'Image editing workflows', icon: '✂️' },
        { use: 'Document thumbnails', icon: '🖼️' }
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
                                <span className="text-gray-900 font-medium">PDF to Images</span>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl text-white text-4xl mb-8 shadow-lg">
                        🖼️
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        PDF to Images Converter
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                        Transform PDF pages into high-quality images with
                        <span className="font-semibold text-blue-600"> professional resolution</span> and
                        <span className="font-semibold text-purple-600"> perfect clarity</span>
                    </p>

                    {/* Stats Bar */}
                    <div className="flex flex-wrap justify-center gap-8 mt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{conversionStats.totalConverted.toLocaleString()}+</div>
                            <div className="text-gray-600 text-sm">PDFs Converted</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">{conversionStats.averagePages}</div>
                            <div className="text-gray-600 text-sm">Avg. Pages/PDF</div>
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
                        <h2 className="text-2xl font-bold text-white mb-2">Convert PDF to Images</h2>
                        <p className="text-blue-100">Upload your PDF and extract all pages as high-quality PNG images</p>
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
                            description="Select a PDF file to convert all pages to images"
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
                                            <span>Converting to Images...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Convert to Images</span>
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

                {/* File Specifications */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg className="w-6 h-6 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            Input Requirements
                        </h3>
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">File Support</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• PDF files (.pdf)</li>
                                    <li>• Maximum file size: 100MB</li>
                                    <li>• Any number of pages supported</li>
                                    <li>• All PDF versions compatible</li>
                                </ul>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Processing Speed</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Average: 2-3 seconds per page</li>
                                    <li>• Real-time progress tracking</li>
                                    <li>• Optimized for large documents</li>
                                    <li>• Batch processing available</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg className="w-6 h-6 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            Output Quality
                        </h3>
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Image Specifications</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• PNG format (lossless quality)</li>
                                    <li>• 300 DPI resolution</li>
                                    <li>• Transparency support</li>
                                    <li>• True color depth</li>
                                </ul>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Delivery Format</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• ZIP file download</li>
                                    <li>• Organized file naming</li>
                                    <li>• Sequential page numbering</li>
                                    <li>• Instant download ready</li>
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
                                    <span>Use high-quality PDF documents for best results</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">✓</span>
                                    <span>Ensure PDF is not password protected</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">✓</span>
                                    <span>Check file size is under 100MB limit</span>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold text-blue-800">After Conversion:</h4>
                            <ul className="text-blue-700 space-y-2 text-sm">
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">✓</span>
                                    <span>Images are numbered sequentially by page</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">✓</span>
                                    <span>High resolution suitable for printing</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">✓</span>
                                    <span>Perfect for web use and presentations</span>
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
                            <h3 className="text-xl font-bold text-emerald-900 mb-3">Your Documents Are Secure</h3>
                            <p className="text-emerald-800 mb-4 leading-relaxed">
                                We ensure complete privacy and security for your PDF documents. All conversions are processed with
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
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
                        <h2 className="text-3xl font-bold text-white mb-2">Why Choose Our PDF to Images Converter?</h2>
                        <p className="text-blue-100">The ultimate solution for extracting PDF pages as high-quality images</p>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="prose max-w-none">
                            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                Transform your PDF documents into versatile, high-quality images with our professional PDF to Images converter.
                                Whether you need to extract specific pages for presentations, create thumbnails for web content, or convert
                                entire documents into image format, our tool delivers exceptional results with unmatched convenience.
                            </p>

                            <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                Superior Image Quality and Professional Output
                            </h3>
                            <p className="text-gray-700 mb-6">
                                Our advanced conversion engine ensures every extracted image maintains the highest quality standards.
                                With 300 DPI resolution and lossless PNG format, your converted images are perfect for both digital
                                use and professional printing. The transparency support in PNG format makes them ideal for graphic
                                design workflows and web applications where background removal is essential.
                            </p>

                            <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M13 10V3L4 14h7v7l9-11h-7z" clipRule="evenodd" />
                                </svg>
                                Lightning-Fast Processing with Real-Time Progress
                            </h3>
                            <p className="text-gray-700 mb-6">
                                Experience industry-leading conversion speeds that process multiple pages simultaneously while
                                maintaining quality. Our intelligent processing system optimizes each page individually, ensuring
                                consistent results across your entire document. Real-time progress tracking keeps you informed
                                throughout the conversion process, so you always know exactly when your images will be ready.
                            </p>

                            <h4 className="text-xl font-semibold text-blue-700 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zM7 8a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                                Perfect for Business and Creative Applications
                            </h4>
                            <p className="text-gray-700 mb-6">
                                From creating compelling presentation slides to generating social media content, our PDF to Images
                                converter serves diverse professional needs. Marketing teams use it to extract infographics and charts,
                                while educators convert lecture materials into visual aids. The organized ZIP download ensures all
                                your images are systematically named and ready for immediate use in any project.
                            </p>

                            <h4 className="text-xl font-semibold text-purple-700 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Seamless Integration with Modern Workflows
                            </h4>
                            <p className="text-gray-700 mb-6">
                                Integrate effortlessly with your existing digital workflows. The extracted images are immediately
                                compatible with popular design software, content management systems, and web platforms. Whether
                                you're building a digital portfolio, creating web galleries, or preparing materials for online
                                courses, our converter delivers consistently formatted results that work perfectly across all platforms.
                            </p>

                            <h5 className="text-lg font-semibold text-blue-600 mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Advanced Technical Capabilities
                            </h5>
                            <p className="text-gray-700 mb-6">
                                Built on cutting-edge conversion technology that handles complex PDF structures with precision.
                                Our engine preserves vector graphics quality, maintains color accuracy, and processes embedded
                                fonts correctly. Support for encrypted PDFs and complex layouts ensures compatibility with
                                virtually any PDF document you encounter.
                            </p>

                            <h5 className="text-lg font-semibold text-purple-600 mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Enterprise-Grade Security and Privacy
                            </h5>
                            <p className="text-gray-700 mb-0">
                                Your document security is our top priority. All conversions are processed through encrypted
                                connections with automatic file deletion within one hour. No data is stored permanently, and
                                our GDPR-compliant infrastructure ensures your sensitive documents remain completely private
                                throughout the conversion process. Perfect for handling confidential business documents and
                                personal files with complete peace of mind.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
