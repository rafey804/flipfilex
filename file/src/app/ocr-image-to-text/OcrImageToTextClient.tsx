'use client';

import { useState, useEffect, useRef } from 'react';
import { ApiService } from '@/lib/api';
import { UploadProgress } from '@/types';

export default function OcrImageToTextClient() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ocrResult, setOcrResult] = useState<any | null>(null);
    const [confidence, setConfidence] = useState<number>(0);
    const [wordCount, setWordCount] = useState<number>(0);
    const [characterCount, setCharacterCount] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // OCR options - simplified to just working defaults
    const [language, setLanguage] = useState('eng');
    const [ocrEngine] = useState('tesseract'); // Fixed to tesseract
    const [imageEnhancement] = useState(true); // Always enabled for better results
    const [autoRotate] = useState(true); // Always enabled for better results

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type - accept images and PDFs
        const allowedTypes = ['image/', 'application/pdf'];
        const isValidType = allowedTypes.some(type => file.type.startsWith(type) || file.type === 'application/pdf');
        if (!isValidType) {
            setError('Please select a valid image or PDF file');
            return;
        }

        // Validate file size (200MB max for OCR)
        const maxSize = 200 * 1024 * 1024; // 200MB
        if (file.size > maxSize) {
            setError('File size must be less than 200MB');
            return;
        }

        setSelectedFile(file);
        setError(null);
        setExtractedText('');
        setOcrResult(null);
        setConfidence(0);
        setWordCount(0);
        setCharacterCount(0);

        // Create preview only for image files, not PDFs
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null); // Clear preview for PDFs
        }
    };

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            // Validate file type - accept images and PDFs
            const allowedTypes = ['image/', 'application/pdf'];
            const isValidType = allowedTypes.some(type => file.type.startsWith(type) || file.type === 'application/pdf');
            if (isValidType) {
                setSelectedFile(file);
                setError(null);

                // Only create preview for image files, not PDFs
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setImagePreview(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                } else {
                    setImagePreview(null); // Clear preview for PDFs
                }
            } else {
                setError('Please drop a valid image or PDF file');
            }
        }
    };

    // Handle OCR processing
    const handleExtractText = async () => {
        if (!selectedFile) {
            setError('Please select an image first');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setExtractedText('');

        try {
            const options = {
                language,
                engine: ocrEngine,
                enhance_image: imageEnhancement,
                auto_rotate: autoRotate,
                output_format: 'text'
            };

            console.log('Processing OCR with options:', options);

            const result = await ApiService.extractTextFromImage(
                selectedFile,
                options,
                (progress: UploadProgress) => {
                    console.log('OCR progress:', progress.percentage + '%');
                }
            );

            setOcrResult(result);
            setExtractedText(result.extracted_text || '');
            setConfidence(result.confidence || 0);

            // Calculate text statistics
            const text = result.extracted_text || '';
            setCharacterCount(text.length);
            setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);

        } catch (error: any) {
            console.error('OCR processing error:', error);
            setError(error.message || 'Text extraction failed');
        } finally {
            setIsProcessing(false);
        }
    };

    // Copy text to clipboard
    const handleCopyText = async () => {
        if (extractedText) {
            try {
                await navigator.clipboard.writeText(extractedText);
                // You could add a toast notification here
                console.log('Text copied to clipboard');
            } catch (err) {
                console.error('Failed to copy text:', err);
            }
        }
    };

    // Download text as file
    const handleDownloadText = () => {
        if (extractedText) {
            const blob = new Blob([extractedText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `extracted-text-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    // Reset everything
    const handleReset = () => {
        setSelectedFile(null);
        setExtractedText('');
        setImagePreview(null);
        setError(null);
        setIsProcessing(false);
        setOcrResult(null);
        setConfidence(0);
        setWordCount(0);
        setCharacterCount(0);
        setLanguage('eng');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
        }
    }, [extractedText]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-6 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        OCR - Image to Text Converter
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto px-4">
                        Extract text from images with advanced OCR technology. Convert JPG, PNG, PDF images to editable text with
                        support for 100+ languages and high accuracy recognition.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">

                    {/* Upload and Settings Section */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">

                            {/* File Upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Select Image for Text Extraction
                                </label>
                                <div
                                    className="border-2 border-dashed border-emerald-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer"
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    {selectedFile ? (
                                        <div className="space-y-2">
                                            {selectedFile.type === 'application/pdf' ? (
                                                <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-12 h-12 mx-auto text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            {selectedFile.type === 'application/pdf' && (
                                                <p className="text-xs text-blue-600 font-medium">PDF Document</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                JPG, PNG, PDF, TIFF up to 200MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Image Preview
                                    </label>
                                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                        <img
                                            src={imagePreview}
                                            alt="Selected image"
                                            className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
                                            style={{ maxHeight: '300px' }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* OCR Info */}
                            <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-semibold text-emerald-900">Advanced OCR Features</span>
                                </div>
                                <div className="text-sm text-emerald-800 space-y-1">
                                    <p>✓ High-quality Tesseract OCR engine with multiple detection modes</p>
                                    <p>✓ Support for multipage PDF processing (unlimited pages)</p>
                                    <p>✓ Multiple output formats: <strong>DOCX, TXT, XLSX</strong></p>
                                    <p>✓ Maximum file size: <strong>200MB</strong></p>
                                    <p>✓ Batch processing with ZIP archive support (coming soon)</p>
                                    <p>✓ Image enhancement and automatic orientation detection</p>
                                </div>
                            </div>

                            {/* Language Selection - English Only */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Language</label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                >
                                    <option value="eng">English</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    English language optimized for best OCR accuracy
                                </p>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <div className="flex items-center space-x-2 text-red-800">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm font-medium">{error}</span>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                                {!isProcessing && (
                                    <button
                                        onClick={handleExtractText}
                                        disabled={!selectedFile}
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold
                             hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl
                             transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                             flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Extract Text</span>
                                    </button>
                                )}

                                {isProcessing && (
                                    <div className="flex items-center justify-center space-x-3 text-emerald-600 py-3">
                                        <div className="animate-spin w-5 h-5 sm:w-6 sm:h-6 border-2 border-emerald-200 border-t-emerald-600 rounded-full"></div>
                                        <span className="font-medium text-sm sm:text-base">Processing image...</span>
                                    </div>
                                )}

                                <button
                                    onClick={handleReset}
                                    className="bg-gray-500 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold hover:bg-gray-600
                           transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Reset</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-gray-100 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                                Extracted Text
                            </h3>

                            {/* Statistics */}
                            {extractedText && (
                                <div className="mb-4 p-3 bg-emerald-50 rounded-xl">
                                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                                        <div>
                                            <div className="font-semibold text-emerald-900">Confidence</div>
                                            <div className="text-emerald-700">{confidence.toFixed(1)}%</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-emerald-900">Words</div>
                                            <div className="text-emerald-700">{wordCount}</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-emerald-900">Characters</div>
                                            <div className="text-emerald-700">{characterCount}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Text Area */}
                            <div className="mb-4">
                                <textarea
                                    ref={textAreaRef}
                                    value={extractedText}
                                    onChange={(e) => setExtractedText(e.target.value)}
                                    placeholder="Extracted text will appear here..."
                                    className="w-full min-h-[300px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm resize-none"
                                    style={{ overflow: 'hidden' }}
                                />
                            </div>

                            {/* Action Buttons */}
                            {extractedText && (
                                <div className="space-y-3">
                                    {/* Copy Button */}
                                    <button
                                        onClick={handleCopyText}
                                        className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700
                             transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span>Copy Text</span>
                                    </button>

                                    {/* Download Format Buttons */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/download/${ocrResult?.output_files?.txt}`, '_blank')}
                                            disabled={!ocrResult?.output_files?.txt}
                                            className="bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700
                               transition-all duration-300 flex items-center justify-center space-x-1 text-xs
                               disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>TXT</span>
                                        </button>

                                        <button
                                            onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/download/${ocrResult?.output_files?.docx}`, '_blank')}
                                            disabled={!ocrResult?.output_files?.docx}
                                            className="bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700
                               transition-all duration-300 flex items-center justify-center space-x-1 text-xs
                               disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>DOCX</span>
                                        </button>

                                        <button
                                            onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/download/${ocrResult?.output_files?.xlsx}`, '_blank')}
                                            disabled={!ocrResult?.output_files?.xlsx}
                                            className="bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700
                               transition-all duration-300 flex items-center justify-center space-x-1 text-xs
                               disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>XLSX</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!extractedText && !isProcessing && (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">Upload an image to extract text</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Advanced Features Section */}
                <div className="mt-8 sm:mt-12">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                Advanced OCR Features
                            </h2>
                            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                                Professional-grade optical character recognition with AI-powered text detection,
                                multi-language support, and intelligent image preprocessing for maximum accuracy.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

                            {/* High Accuracy */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">High Accuracy</h3>
                                <p className="text-gray-600 text-sm">
                                    Advanced AI algorithms achieve 99%+ accuracy on clear text images. Smart preprocessing enhances image quality before OCR processing.
                                </p>
                            </div>

                            {/* Multi-Language */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">100+ Languages</h3>
                                <p className="text-gray-600 text-sm">
                                    Support for over 100 languages including English, Spanish, Chinese, Arabic, Hindi, and many more with specialized recognition models.
                                </p>
                            </div>

                            {/* Smart Processing */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Processing</h3>
                                <p className="text-gray-600 text-sm">
                                    Automatic image enhancement, skew correction, noise reduction, and orientation detection for optimal text recognition results.
                                </p>
                            </div>

                            {/* Batch Processing */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Processing</h3>
                                <p className="text-gray-600 text-sm">
                                    Lightning-fast OCR processing with optimized algorithms. Extract text from large documents and images in seconds, not minutes.
                                </p>
                            </div>

                            {/* Security */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
                                <p className="text-gray-600 text-sm">
                                    All images are processed securely with automatic deletion after OCR. Your documents and extracted text remain completely private.
                                </p>
                            </div>

                            {/* Export Options */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Options</h3>
                                <p className="text-gray-600 text-sm">
                                    Copy to clipboard, download as TXT, DOCX, or edit extracted text directly. Multiple output formats for seamless integration into your workflow.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* How to Convert Section */}
                <div className="mt-8 sm:mt-12">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                How to convert Image to text?
                            </h2>
                            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                                Convert any image containing text into editable, searchable text format with our powerful OCR technology.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4">
                                    <span className="text-2xl font-bold text-white">1</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Image</h3>
                                <p className="text-gray-600 text-sm">
                                    Select or drag & drop your image file (JPG, PNG, PDF) up to 200MB
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4">
                                    <span className="text-2xl font-bold text-white">2</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Extract Text</h3>
                                <p className="text-gray-600 text-sm">
                                    Click 'Extract Text' and our AI-powered OCR will analyze your image
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                                    <span className="text-2xl font-bold text-white">3</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Results</h3>
                                <p className="text-gray-600 text-sm">
                                    View extracted text with confidence score and edit if needed
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                                    <span className="text-2xl font-bold text-white">4</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Download & Use</h3>
                                <p className="text-gray-600 text-sm">
                                    Copy, download as TXT, DOCX, or XLSX for your projects
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image to Text Converter - What is this? */}
                <div className="mt-8 sm:mt-12">
                    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 border border-emerald-100">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                            Image to text converter – what is this?
                        </h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <p className="mb-4">
                                An <strong>Image to Text Converter</strong> is a powerful digital tool that uses Optical Character Recognition (OCR) technology to extract text from images, scanned documents, and PDF files. This innovative solution transforms visual text into editable, searchable digital text format.
                            </p>
                            <p className="mb-4">
                                Our advanced OCR system can recognize and convert text from various image formats including photographs of documents, screenshots, scanned papers, and even handwritten notes. The technology works by analyzing the visual patterns in images and converting them into machine-readable text.
                            </p>
                            <p>
                                Perfect for digitizing documents, extracting data from receipts, converting book pages to text, and making any text-containing image searchable and editable. Save time and effort with automatic text recognition that delivers professional results.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Key Features Section */}
                <div className="mt-8 sm:mt-12">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                            Picture to Text Converter - Key Features
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Searchable PDF */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-blue-900">Searchable PDF</h3>
                                </div>
                                <p className="text-blue-800 mb-4">
                                    Convert image-based PDFs into searchable documents. Extract text from scanned PDFs and make them fully searchable and indexable.
                                </p>
                                <ul className="space-y-2 text-blue-700 text-sm">
                                    <li className="flex items-center">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        Multi-page PDF processing
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        Preserve original formatting
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        Full-text search capability
                                    </li>
                                </ul>
                            </div>

                            {/* Data Extraction */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-green-900">Data Extraction</h3>
                                </div>
                                <p className="text-green-800 mb-4">
                                    Automatically extract structured data from documents like invoices, receipts, forms, and business cards with high accuracy.
                                </p>
                                <ul className="space-y-2 text-green-700 text-sm">
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Invoice and receipt processing
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Form data extraction
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Export to XLSX format
                                    </li>
                                </ul>
                            </div>

                        </div>

                        {/* Additional Features Grid */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Lightning Fast</h4>
                                <p className="text-gray-600 text-sm">Process images in seconds with our optimized OCR engine</p>
                            </div>

                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">99%+ Accuracy</h4>
                                <p className="text-gray-600 text-sm">Industry-leading accuracy with advanced AI algorithms</p>
                            </div>

                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Secure & Private</h4>
                                <p className="text-gray-600 text-sm">Your documents are processed securely and automatically deleted</p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Information Sections */}
                <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                    {/* Use Cases */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200">
                        <h3 className="font-semibold text-emerald-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Common Use Cases
                        </h3>
                        <ul className="space-y-2 sm:space-y-3 text-emerald-800 text-xs sm:text-sm">
                            <li className="flex items-start">
                                <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                                <span><strong>Document Digitization:</strong> Convert scanned documents to editable text</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                                <span><strong>Data Entry:</strong> Automate data entry from forms and invoices</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                                <span><strong>Translation:</strong> Extract text for translation purposes</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                                <span><strong>Accessibility:</strong> Make visual content accessible to screen readers</span>
                            </li>
                        </ul>
                    </div>

                    {/* Supported Formats */}
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-teal-200">
                        <h3 className="font-semibold text-teal-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Supported Formats
                        </h3>
                        <ul className="space-y-2 sm:space-y-3 text-teal-800 text-xs sm:text-sm">
                            <li className="flex items-start">
                                <span className="text-teal-500 mr-2 mt-0.5">•</span>
                                <span><strong>Images:</strong> JPG, PNG, BMP, TIFF, WEBP</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-teal-500 mr-2 mt-0.5">•</span>
                                <span><strong>Documents:</strong> PDF (Scanned & Native), Multipage TIFF</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-teal-500 mr-2 mt-0.5">•</span>
                                <span><strong>Output:</strong> TXT, DOCX, XLSX, Searchable PDF</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-teal-500 mr-2 mt-0.5">•</span>
                                <span><strong>Size Limit:</strong> Up to 200MB per file</span>
                            </li>
                        </ul>
                    </div>

                    {/* Pro Tips */}
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-cyan-200">
                        <h3 className="font-semibold text-cyan-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pro Tips
                        </h3>
                        <ul className="space-y-2 sm:space-y-3 text-cyan-800 text-xs sm:text-sm">
                            <li className="flex items-start">
                                <span className="text-cyan-500 mr-2 mt-0.5">•</span>
                                <span>Use high-resolution images (300 DPI+) for best results</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-cyan-500 mr-2 mt-0.5">•</span>
                                <span>Ensure good lighting and contrast in photos</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-cyan-500 mr-2 mt-0.5">•</span>
                                <span>Straighten images before uploading for better accuracy</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-cyan-500 mr-2 mt-0.5">•</span>
                                <span>Check extracted text against original for verification</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}
