'use client';

import { useState, useEffect, useRef } from 'react';
import { ApiService } from '@/lib/api';
import { FileWithId, UploadProgress } from '@/types';

export default function ImageCompressorClient() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [compressedFile, setCompressedFile] = useState<FileWithId | null>(null);
    const [originalPreview, setOriginalPreview] = useState<string | null>(null);
    const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [compressionLevel, setCompressionLevel] = useState(50); // Default to medium compression
    const [originalSize, setOriginalSize] = useState<number>(0);
    const [compressedSize, setCompressedSize] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Image format options
    const [outputFormat, setOutputFormat] = useState('jpeg');
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [customWidth, setCustomWidth] = useState<number | null>(null);
    const [customHeight, setCustomHeight] = useState<number | null>(null);

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file');
            return;
        }

        // Validate file size (200MB max)
        const maxSize = 200 * 1024 * 1024; // 200MB
        if (file.size > maxSize) {
            setError('File size must be less than 200MB');
            return;
        }

        setSelectedFile(file);
        setOriginalSize(file.size);
        setError(null);
        setCompressedFile(null);
        setCompressedPreview(null);
        setCompressedSize(0);

        // Create preview for original image
        const reader = new FileReader();
        reader.onload = (e) => {
            setOriginalPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Handle compression
    const handleCompress = async () => {
        if (!selectedFile) {
            setError('Please select an image first');
            return;
        }

        setIsCompressing(true);
        setError(null);
        setCompressedFile(null);
        setCompressedPreview(null);

        try {
            // Prepare compression options - convert compression level to quality
            // Lower compression level = higher compression = lower quality value
            let qualityValue = compressionLevel;

            if (outputFormat === 'jpeg' || outputFormat === 'webp') {
                // For JPEG/WebP: 10% compression = 90% quality, 80% compression = 20% quality
                qualityValue = 110 - compressionLevel; // Invert the scale
                qualityValue = Math.max(10, Math.min(100, qualityValue)); // Clamp to valid range
            } else if (outputFormat === 'png') {
                // For PNG: Convert percentage to compression level (1-9)
                // 10% = level 9 (max compression), 100% = level 1 (min compression)
                qualityValue = Math.round(((110 - compressionLevel) / 100) * 8) + 1;
                qualityValue = Math.max(1, Math.min(9, qualityValue));
            }

            const options = {
                quality: qualityValue,
                format: outputFormat,
                width: customWidth,
                height: customHeight,
                maintain_aspect_ratio: maintainAspectRatio
            };

            console.log('Compression Level:', compressionLevel + '%');
            console.log('Converted Quality Value:', qualityValue);
            console.log('Compressing image with options:', options);

            const result = await ApiService.compressImage(
                selectedFile,
                options,
                (progress: UploadProgress) => {
                    // Progress handling
                    console.log('Compression progress:', progress.percentage + '%');
                }
            );

            // Construct full download URL
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            const fullDownloadUrl = result.download_url.startsWith('http')
                ? result.download_url
                : `${API_BASE_URL}${result.download_url}`;

            const newFile: FileWithId = {
                id: Date.now().toString(),
                file: new File([], result.filename),
                status: 'completed',
                downloadUrl: fullDownloadUrl,
                progress: 100
            };

            setCompressedFile(newFile);

            // Get compressed file size and create preview
            try {
                const response = await fetch(fullDownloadUrl);
                const blob = await response.blob();
                setCompressedSize(blob.size);

                // Create compressed preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    setCompressedPreview(e.target?.result as string);
                };
                reader.readAsDataURL(blob);
            } catch (previewError) {
                console.error('Failed to create compressed preview:', previewError);
            }

        } catch (error: any) {
            console.error('Image compression error:', error);
            setError(error.message || 'Image compression failed');
        } finally {
            setIsCompressing(false);
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
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
                setOriginalSize(file.size);
                setError(null);

                const reader = new FileReader();
                reader.onload = (e) => {
                    setOriginalPreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setError('Please drop a valid image file');
            }
        }
    };

    // Reset everything
    const handleReset = () => {
        setSelectedFile(null);
        setCompressedFile(null);
        setOriginalPreview(null);
        setCompressedPreview(null);
        setError(null);
        setIsCompressing(false);
        setCompressionLevel(50);
        setOutputFormat('jpeg');
        setMaintainAspectRatio(true);
        setCustomWidth(null);
        setCustomHeight(null);
        setOriginalSize(0);
        setCompressedSize(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Calculate compression ratio
    const getCompressionRatio = (): number => {
        if (originalSize === 0 || compressedSize === 0) return 0;
        return Math.round(((originalSize - compressedSize) / originalSize) * 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-6 sm:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Image Compressor
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                        Compress images while maintaining quality. Reduce file size up to 90% with our advanced compression algorithm.
                        Support for JPEG, PNG, WebP formats up to 200MB.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                    {/* Upload and Settings Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">

                            {/* File Upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Select Image to Compress
                                </label>
                                <div
                                    className="border-2 border-dashed border-orange-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors cursor-pointer"
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    {selectedFile ? (
                                        <div className="space-y-2">
                                            <svg className="w-12 h-12 mx-auto text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
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
                                                PNG, JPG, WEBP up to 200MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Compression Settings */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                                {/* Compression Level */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Compression Level ({compressionLevel}%)
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={compressionLevel}
                                        onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
                                        className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Max Compression (Small Size)</span>
                                        <span>Min Compression (High Quality)</span>
                                    </div>
                                    <div className="text-center text-xs text-gray-600 mt-1">
                                        {compressionLevel <= 30 ? '🔥 Very High Compression (Smallest Size)' :
                                            compressionLevel <= 50 ? '⚡ High Compression (Small Size)' :
                                                compressionLevel <= 70 ? '📊 Medium Compression (Balanced)' : '🎨 Low Compression (Best Quality)'}
                                    </div>
                                    <div className="text-center text-xs text-orange-600 mt-1 font-medium">
                                        Expected size reduction: ~{compressionLevel <= 30 ? '80-90%' :
                                            compressionLevel <= 50 ? '60-80%' :
                                                compressionLevel <= 70 ? '40-60%' : '20-40%'}
                                    </div>
                                </div>

                                {/* Output Format */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Output Format</label>
                                    <select
                                        value={outputFormat}
                                        onChange={(e) => setOutputFormat(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                    >
                                        <option value="jpeg">JPEG</option>
                                        <option value="png">PNG</option>
                                        <option value="webp">WebP</option>
                                    </select>
                                </div>

                                {/* Maintain Aspect Ratio */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Aspect Ratio</label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={maintainAspectRatio}
                                            onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                                            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">Maintain ratio</span>
                                    </label>
                                </div>

                            </div>

                            {/* Custom Dimensions */}
                            {!maintainAspectRatio && (
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">Width (px)</label>
                                        <input
                                            type="number"
                                            value={customWidth || ''}
                                            onChange={(e) => setCustomWidth(e.target.value ? parseInt(e.target.value) : null)}
                                            placeholder="Auto"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">Height (px)</label>
                                        <input
                                            type="number"
                                            value={customHeight || ''}
                                            onChange={(e) => setCustomHeight(e.target.value ? parseInt(e.target.value) : null)}
                                            placeholder="Auto"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>
                            )}

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
                                {!isCompressing && (
                                    <button
                                        onClick={handleCompress}
                                        disabled={!selectedFile}
                                        className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold
                             hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl
                             transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                             flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Compress Image</span>
                                    </button>
                                )}

                                {isCompressing && (
                                    <div className="flex items-center justify-center space-x-3 text-orange-600 py-3">
                                        <div className="animate-spin w-5 h-5 sm:w-6 sm:h-6 border-2 border-orange-200 border-t-orange-600 rounded-full"></div>
                                        <span className="font-medium text-sm sm:text-base">Compressing image...</span>
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

                    {/* Preview Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-gray-100 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                                Live Preview
                            </h3>

                            {/* Original Image Preview */}
                            {originalPreview && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Original</h4>
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <img
                                            src={originalPreview}
                                            alt="Original"
                                            className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
                                            style={{ maxHeight: '200px' }}
                                        />
                                    </div>
                                    <div className="mt-2 p-2 bg-gray-50 rounded-lg text-left">
                                        <div className="space-y-1 text-xs text-gray-700">
                                            <div><strong>Size:</strong> {formatFileSize(originalSize)}</div>
                                            <div><strong>Type:</strong> {selectedFile?.type}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Compressed Image Preview */}
                            {compressedPreview && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Compressed</h4>
                                    <div className="p-3 bg-green-50 rounded-xl">
                                        <img
                                            src={compressedPreview}
                                            alt="Compressed"
                                            className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
                                            style={{ maxHeight: '200px' }}
                                        />
                                    </div>
                                    <div className="mt-2 p-2 bg-green-50 rounded-lg text-left">
                                        <div className="space-y-1 text-xs text-green-800">
                                            <div><strong>Size:</strong> {formatFileSize(compressedSize)}</div>
                                            <div><strong>Reduced by:</strong> {getCompressionRatio()}%</div>
                                            <div><strong>Format:</strong> {outputFormat.toUpperCase()}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Download Button */}
                            {compressedFile && (
                                <div className="text-center">
                                    <a
                                        href={compressedFile.downloadUrl}
                                        download
                                        className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold
                             hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Download {outputFormat.toUpperCase()}</span>
                                    </a>
                                </div>
                            )}

                            {!originalPreview && (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">Select an image to see preview</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detailed Features Section */}
                <div className="mt-8 sm:mt-12">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                Advanced Image Compression Features
                            </h2>
                            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                                Our professional image compressor uses cutting-edge algorithms to reduce file sizes dramatically while preserving visual quality.
                                Perfect for web optimization, storage management, and faster loading times.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

                            {/* Smart Compression */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Compression</h3>
                                <p className="text-gray-600 text-sm">
                                    AI-powered compression algorithms that analyze your image content to achieve optimal file size reduction while maintaining visual quality.
                                </p>
                            </div>

                            {/* Batch Processing */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Formats</h3>
                                <p className="text-gray-600 text-sm">
                                    Support for JPEG, PNG, WebP input formats with conversion to optimized JPEG, PNG, or modern WebP output for maximum compatibility.
                                </p>
                            </div>

                            {/* Quality Control */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Control</h3>
                                <p className="text-gray-600 text-sm">
                                    Precise compression level control from 10% to 100% with real-time preview to find the perfect balance between file size and quality.
                                </p>
                            </div>

                            {/* Large Files */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Large File Support</h3>
                                <p className="text-gray-600 text-sm">
                                    Handle massive image files up to 200MB with fast processing. Perfect for high-resolution photos, RAW conversions, and professional photography.
                                </p>
                            </div>

                            {/* Security */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Processing</h3>
                                <p className="text-gray-600 text-sm">
                                    All images are processed securely with automatic deletion after compression. Your privacy and data security are our top priorities.
                                </p>
                            </div>

                            {/* Speed */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                                <p className="text-gray-600 text-sm">
                                    Optimized processing engines deliver compressed images in seconds. No waiting, no delays - just instant results for immediate download.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Information Sections */}
                <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                    {/* Features */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-200">
                        <h3 className="font-semibold text-orange-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Key Features
                        </h3>
                        <ul className="space-y-2 sm:space-y-3 text-orange-800 text-xs sm:text-sm">
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2 mt-0.5">•</span>
                                <span><strong>Smart Compression:</strong> Reduce file size up to 90%</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2 mt-0.5">•</span>
                                <span><strong>Quality Control:</strong> Adjustable compression levels</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2 mt-0.5">•</span>
                                <span><strong>Multiple Formats:</strong> JPEG, PNG, WebP support</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2 mt-0.5">•</span>
                                <span><strong>Large Files:</strong> Support up to 200MB</span>
                            </li>
                        </ul>
                    </div>

                    {/* Compression Tips */}
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-200">
                        <h3 className="font-semibold text-red-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Compression Tips
                        </h3>
                        <ul className="space-y-2 sm:space-y-3 text-red-800 text-xs sm:text-sm">
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2 mt-0.5">•</span>
                                <span><strong>JPEG:</strong> Best for photos with many colors</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2 mt-0.5">•</span>
                                <span><strong>PNG:</strong> Ideal for graphics with transparency</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2 mt-0.5">•</span>
                                <span><strong>WebP:</strong> Modern format with better compression</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2 mt-0.5">•</span>
                                <span><strong>Quality:</strong> 80-90% gives best size/quality ratio</span>
                            </li>
                        </ul>
                    </div>

                    {/* Technical Info */}
                    <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-pink-200">
                        <h3 className="font-semibold text-pink-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            Technical Specifications
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-pink-700">
                            <div className="text-center">
                                <div className="font-semibold text-pink-900">Max Size</div>
                                <div>200 MB</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-pink-900">Formats</div>
                                <div>JPEG, PNG, WebP</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-pink-900">Compression</div>
                                <div>10% - 100%</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-pink-900">Processing</div>
                                <div>Instant</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comprehensive FAQ Section */}
                <div className="mt-12 sm:mt-16">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Everything you need to know about our advanced image compression tool
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

                            {/* Left Column */}
                            <div className="space-y-6">

                                <div className="border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                        How does image compression work?
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Our image compressor uses advanced algorithms to analyze and optimize image data. It removes redundant information,
                                        applies lossy or lossless compression techniques depending on the format, and optimizes color palettes to reduce file
                                        size while maintaining visual quality. The compression level you choose determines how aggressively these optimizations are applied.
                                    </p>
                                </div>

                                <div className="border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                        What's the difference between compression levels?
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Compression levels determine the balance between file size and image quality. Lower percentages (10-30%) provide maximum
                                        compression with 80-90% size reduction but may show slight quality loss. Higher percentages (70-100%) maintain better
                                        quality with moderate compression. For web use, 40-60% usually provides the best balance.
                                    </p>
                                </div>

                                <div className="border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                        Which format should I choose for compression?
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        <strong>JPEG:</strong> Best for photographs and images with many colors. Offers excellent compression ratios.<br />
                                        <strong>PNG:</strong> Ideal for graphics, logos, and images requiring transparency. Uses lossless compression.<br />
                                        <strong>WebP:</strong> Modern format offering superior compression and quality. Perfect for web use with browser support.
                                    </p>
                                </div>

                                <div className="border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                        Is this image compressor free to use?
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Yes, our image compressor is completely free to use with no registration required. You can compress unlimited images
                                        up to 200MB each. There are no watermarks, hidden fees, or usage limits. All processing is done securely with automatic
                                        file deletion after compression.
                                    </p>
                                </div>

                                <div className="border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                        How much can I reduce my image file size?
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        File size reduction depends on the original image and compression settings. Typically, you can achieve 50-90% size
                                        reduction. For example, a 2MB photo can be compressed to 200KB-1MB while maintaining good visual quality. The actual
                                        reduction varies based on image content, format, and compression level.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
