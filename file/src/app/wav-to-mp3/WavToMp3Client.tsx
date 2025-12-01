'use client';

// app/wav-to-mp3/WavToMp3Client.tsx - Main WAV to MP3 converter page client component

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { ApiService } from '@/lib/api';
import { FileWithId, UploadProgress } from '@/types';
import { validateFile, getAcceptedFileTypes } from '@/lib/api';

export default function WavToMp3Client() {
    const [files, setFiles] = useState<FileWithId[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFilesSelected = (selectedFiles: File[]) => {
        console.log('Files selected:', selectedFiles);
    };

    const handleFilesChange = (updatedFiles: FileWithId[]) => {
        setFiles(updatedFiles);
    };

    const handleConvert = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);

        try {
            const file = files[0];
            const updatedFiles = [...files];
            const fileIndex = 0;

            // Validate file
            const validation = validateFile(file.file, getAcceptedFileTypes('wav-to-mp3'));
            if (validation) {
                updatedFiles[fileIndex] = {
                    ...file,
                    status: 'error',
                    error: validation
                };
                setFiles(updatedFiles);
                setIsProcessing(false);
                return;
            }

            // Update status to uploading
            updatedFiles[fileIndex] = {
                ...file,
                status: 'uploading'
            };
            setFiles(updatedFiles);

            // Convert file
            const result = await ApiService.convertWavToMp3(
                file.file,
                (progress: UploadProgress) => {
                    updatedFiles[fileIndex] = {
                        ...file,
                        progress: progress.percentage,
                        status: progress.percentage === 100 ? 'processing' : 'uploading'
                    };
                    setFiles([...updatedFiles]);
                }
            );

            // Update with success
            updatedFiles[fileIndex] = {
                ...file,
                status: 'completed',
                downloadUrl: ApiService.getDownloadUrl(result.filename),
                progress: 100
            };
            setFiles(updatedFiles);

        } catch (error: any) {
            console.error('Conversion error:', error);
            const updatedFiles = [...files];
            updatedFiles[0] = {
                ...files[0],
                status: 'error',
                error: error.message || 'Conversion failed'
            };
            setFiles(updatedFiles);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setFiles([]);
        setIsProcessing(false);
    };

    const handleRetry = async (fileId: string) => {
        const fileToRetry = files.find(f => f.id === fileId);
        if (!fileToRetry) return;

        const updatedFiles = files.map(f =>
            f.id === fileId
                ? { ...f, status: 'pending' as const, error: undefined, progress: 0 }
                : f
        );
        setFiles(updatedFiles);

        await handleConvert();
    };

    const completedFiles = files.filter(f => f.status === 'completed');
    const hasErrors = files.some(f => f.status === 'error');
    const allFilesProcessed = files.length > 0 && files.every(f =>
        f.status === 'completed' || f.status === 'error'
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-6 sm:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        WAV to MP3 Converter
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                        Convert WAV audio files to MP3 format for smaller file sizes and universal compatibility.
                        Maintain high audio quality while reducing storage space.
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">

                    {/* File Upload Section */}
                    <FileUpload
                        acceptedFileTypes={getAcceptedFileTypes('wav-to-mp3')}
                        maxFiles={1}
                        onFilesSelected={handleFilesSelected}
                        onFilesChange={handleFilesChange}
                        selectedFiles={files}
                        isProcessing={isProcessing}
                        title="Drop your WAV audio file here"
                        description="Select a WAV audio file (.wav) to convert to MP3 format for better compression"
                    />

                    {/* Action Buttons */}
                    {files.length > 0 && (
                        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                            {!isProcessing && files.every(f => f.status === 'pending') && (
                                <button
                                    onClick={handleConvert}
                                    disabled={files.length === 0}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold 
                           hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl 
                           transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                           flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Convert to MP3</span>
                                </button>
                            )}

                            {isProcessing && (
                                <div className="flex items-center justify-center space-x-3 text-purple-600 py-3">
                                    <div className="animate-spin w-5 h-5 sm:w-6 sm:h-6 border-2 border-purple-200 border-t-purple-600 rounded-full"></div>
                                    <span className="font-medium text-sm sm:text-base">Converting your audio...</span>
                                </div>
                            )}

                            {hasErrors && !isProcessing && (
                                <button
                                    onClick={() => {
                                        const errorFile = files.find(f => f.status === 'error');
                                        if (errorFile) handleRetry(errorFile.id);
                                    }}
                                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold 
                           hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl
                           flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Retry Conversion</span>
                                </button>
                            )}

                            <button
                                onClick={handleReset}
                                className="bg-gray-500 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 
                         transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Start Over</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Information Section */}
                <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Benefits */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
                        <h3 className="font-semibold text-purple-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            MP3 Benefits
                        </h3>
                        <ul className="space-y-2 sm:space-y-3 text-purple-800 text-xs sm:text-sm">
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2 mt-0.5">•</span>
                                <span><strong>Smaller file sizes:</strong> Up to 90% reduction from WAV</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2 mt-0.5">•</span>
                                <span><strong>Universal compatibility:</strong> Works on all devices and platforms</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2 mt-0.5">•</span>
                                <span><strong>High quality:</strong> Maintains excellent audio quality at 192kbps</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2 mt-0.5">•</span>
                                <span><strong>Streaming friendly:</strong> Perfect for web and mobile streaming</span>
                            </li>
                        </ul>
                    </div>

                    {/* Usage Tips */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-200">
                        <h3 className="font-semibold text-indigo-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Best Practices
                        </h3>
                        <ul className="space-y-2 sm:space-y-3 text-indigo-800 text-xs sm:text-sm">
                            <li className="flex items-start">
                                <span className="text-indigo-500 mr-2 mt-0.5">•</span>
                                <span><strong>High-quality WAV:</strong> Better input = better MP3 output</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-indigo-500 mr-2 mt-0.5">•</span>
                                <span><strong>Perfect for:</strong> Music, podcasts, voice recordings</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-indigo-500 mr-2 mt-0.5">•</span>
                                <span><strong>Quality settings:</strong> We use 192kbps for optimal balance</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-indigo-500 mr-2 mt-0.5">•</span>
                                <span><strong>Privacy:</strong> Files deleted after 1 hour automatically</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Technical Specs */}
                <div className="mt-6 sm:mt-8 bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        Audio Conversion Specifications
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700">
                        <div className="text-center">
                            <div className="font-semibold text-gray-900">Input Format</div>
                            <div>WAV (.wav)</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-gray-900">Output Format</div>
                            <div>MP3 (.mp3)</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-gray-900">Max File Size</div>
                            <div>100 MB</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-gray-900">Quality</div>
                            <div>192 kbps VBR</div>
                        </div>
                    </div>
                </div>

                {/* SEO Content Section */}
                <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        Why Choose Our WAV to MP3 Converter?
                    </h2>

                    <div className="prose max-w-none text-gray-700 leading-relaxed">
                        <p className="text-lg mb-6">
                            Transform your high-quality WAV audio files into efficient MP3 format with our professional-grade online converter.
                            Whether you're a musician, podcaster, content creator, or audio enthusiast, our tool delivers exceptional results
                            while dramatically reducing file sizes without compromising audio quality.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Superior Audio Compression Technology
                        </h3>

                        <p className="mb-4">
                            Our advanced WAV to MP3 conversion engine utilizes state-of-the-art encoding algorithms to achieve optimal
                            compression ratios. By converting WAV files to MP3, you can reduce file sizes by up to 90% while maintaining
                            crystal-clear audio quality at 192 kbps Variable Bit Rate (VBR) encoding. This intelligent compression
                            analyzes your audio content and applies the perfect amount of compression to preserve the most important
                            audio information.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Universal Compatibility and Streaming Optimization
                        </h3>

                        <p className="mb-4">
                            MP3 format enjoys universal compatibility across all devices, platforms, and applications. From smartphones
                            and tablets to desktop computers and smart speakers, your converted audio files will play seamlessly everywhere.
                            The optimized file sizes make MP3 perfect for streaming, web embedding, email sharing, and cloud storage,
                            ensuring fast loading times and minimal bandwidth usage.
                        </p>

                        <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                            Professional Features for Audio Professionals
                        </h4>

                        <p className="mb-4">
                            Our converter is designed with professional audio workflows in mind. The high-quality 192 kbps encoding
                            preserves the dynamic range and frequency response of your original recordings, making it suitable for
                            commercial music distribution, podcast publishing, and professional audio archiving. The VBR encoding
                            ensures that complex audio passages receive higher bitrates while simpler sections use lower bitrates,
                            optimizing both quality and file size.
                        </p>

                        <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                            Streamlined Workflow Integration
                        </h4>

                        <p className="mb-4">
                            Integrate our WAV to MP3 converter seamlessly into your content creation workflow. Perfect for converting
                            audio recordings from digital audio workstations (DAWs), field recorders, or studio equipment. The fast
                            processing ensures you can quickly prepare audio files for distribution, whether you're uploading to
                            streaming platforms, creating podcast episodes, or sharing audio content on social media.
                        </p>

                        <h5 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                            Advanced Encoding Algorithms
                        </h5>

                        <p className="mb-4">
                            Our conversion process employs LAME MP3 encoding technology, widely recognized as the gold standard for
                            MP3 compression. This ensures maximum compatibility with all MP3 players and optimal quality-to-size ratios.
                            The psychoacoustic modeling removes frequencies that are imperceptible to human hearing while preserving
                            all audible audio content.
                        </p>

                        <h5 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                            Secure and Private Processing
                        </h5>

                        <p className="mb-6">
                            Your audio files are processed with complete privacy and security. All conversions happen through encrypted
                            connections, and files are automatically deleted from our servers after one hour. No registration required,
                            no watermarks added, and no limitations on usage frequency. Your creative content remains completely private
                            and under your control throughout the entire conversion process.
                        </p>

                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mt-8">
                            <h3 className="text-xl font-semibold text-purple-900 mb-3">
                                Start Converting Your Audio Files Today
                            </h3>
                            <p className="text-purple-800">
                                Experience the perfect balance of quality, compatibility, and file size optimization. Upload your WAV
                                files and discover why thousands of creators trust our converter for their audio processing needs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": "WAV to MP3 Converter",
                            "description": "Convert WAV audio files to MP3 format online for free. Reduce file size by up to 90% while maintaining high audio quality.",
                            "url": "https://flipfilex.com/wav-to-mp3",
                            "applicationCategory": "MultimediaApplication",
                            "operatingSystem": "Web Browser",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "featureList": [
                                "WAV to MP3 conversion",
                                "High-quality audio compression",
                                "192 kbps VBR encoding",
                                "Secure file processing",
                                "No registration required"
                            ]
                        })
                    }}
                />
            </div>
        </div>
    );
}
