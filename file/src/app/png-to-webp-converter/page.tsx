'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { ApiService } from '@/lib/api';
import { FileWithId, UploadProgress } from '@/types';
import { validateFile, getAcceptedFileTypes } from '@/lib/api';

export default function PngToWebpPage() {
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
      const validation = validateFile(file.file, getAcceptedFileTypes('png-to-webp'));
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
      const result = await ApiService.convertPngToWebp(
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
        downloadUrl: ApiService.getDownloadUrl(result.filename), // Fixed: Use getDownloadUrl method
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

    // Trigger conversion for this specific file
    await handleConvert();
  };

  const completedFiles = files.filter(f => f.status === 'completed');
  const hasErrors = files.some(f => f.status === 'error');
  const allFilesProcessed = files.length > 0 && files.every(f => 
    f.status === 'completed' || f.status === 'error'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            PNG to WebP Converter
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Convert PNG images to WebP format for better compression and faster web loading times. 
            Reduce file sizes by up to 80% while maintaining image quality.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
          
          {/* File Upload Section */}
          <FileUpload
            acceptedFileTypes={getAcceptedFileTypes('png-to-webp')}
            maxFiles={1}
            onFilesSelected={handleFilesSelected}
            onFilesChange={handleFilesChange}
            selectedFiles={files}
            isProcessing={isProcessing}
            title="Drop your PNG image here"
            description="Select a PNG image (.png) to convert to WebP format for optimized web performance"
          />

          {/* Action Buttons */}
          {files.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              {!isProcessing && files.every(f => f.status === 'pending') && (
                <button
                  onClick={handleConvert}
                  disabled={files.length === 0}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold 
                           hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl 
                           transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                           flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Convert to WebP</span>
                </button>
              )}

              {isProcessing && (
                <div className="flex items-center justify-center space-x-3 text-blue-600 py-3">
                  <div className="animate-spin w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-200 border-t-blue-600 rounded-full"></div>
                  <span className="font-medium text-sm sm:text-base">Converting your image...</span>
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
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              WebP Benefits
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-green-800 text-xs sm:text-sm">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">•</span>
                <span><strong>Smaller file sizes:</strong> Up to 80% reduction compared to PNG</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">•</span>
                <span><strong>Faster loading:</strong> Improved website performance</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">•</span>
                <span><strong>Better compression:</strong> Superior algorithm than PNG</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">•</span>
                <span><strong>Modern support:</strong> Works in all current browsers</span>
              </li>
            </ul>
          </div>

          {/* Usage Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Best Practices
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-blue-800 text-xs sm:text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>High-quality PNGs:</strong> Better input = better output</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>Web graphics:</strong> Perfect for logos, icons, and illustrations</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>Transparency:</strong> WebP preserves PNG transparency</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
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
            Technical Specifications
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700">
            <div className="text-center">
              <div className="font-semibold text-gray-900">Input Format</div>
              <div>PNG (.png)</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">Output Format</div>
              <div>WebP (.webp)</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">Max File Size</div>
              <div>50 MB</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">Processing Time</div>
              <div>Usually &lt; 30s</div>
            </div>
          </div>
        </div>

        {/* How to Convert Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              How to Convert PNG to WebP Online
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                Converting PNG images to WebP format is simple with our free online converter. Follow these easy steps to optimize your images for better web performance:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload PNG File</h3>
                  <p className="text-gray-600 text-sm">Click the upload area or drag and drop your PNG image. Files up to 50MB are supported.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Convert to WebP</h3>
                  <p className="text-gray-600 text-sm">Click the "Convert to WebP" button and our server will process your image instantly.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Download WebP</h3>
                  <p className="text-gray-600 text-sm">Download your optimized WebP file immediately. No registration or software installation required.</p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Our PNG to WebP converter maintains transparency and image quality while significantly reducing file size. The conversion process is completely free, secure, and works directly in your browser. Your original PNG files are automatically deleted from our servers after one hour, ensuring complete privacy. The resulting WebP files are compatible with all modern browsers and provide faster loading times for your websites.
              </p>
            </div>
          </div>
        </div>

        {/* What is WebP Format Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              What is WebP Format?
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                WebP is a modern image format developed by Google that provides superior compression compared to traditional formats like PNG and JPEG. Originally released in 2010, WebP has become the preferred choice for web developers seeking optimal image performance.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Innovation</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    WebP uses advanced compression algorithms that analyze image content to achieve optimal file size reduction. It supports both lossy and lossless compression modes, allowing you to choose between maximum compression or perfect quality preservation.
                  </p>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Transparency Support</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Unlike JPEG, WebP fully supports alpha transparency, making it an excellent replacement for PNG images that require transparent backgrounds while offering much smaller file sizes.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Universal Browser Support</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    WebP is now supported by all major browsers including Chrome, Firefox, Safari, and Edge. This widespread adoption means you can confidently use WebP images across all platforms without compatibility concerns.
                  </p>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Performance Benefits</h4>
                  <p className="text-gray-700 leading-relaxed">
                    WebP images load significantly faster than PNG equivalents, improving Core Web Vitals scores and user experience. This enhanced performance directly contributes to better SEO rankings and reduced bounce rates.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                The WebP format represents the evolution of web imagery, combining the best features of PNG and JPEG while eliminating their limitations. For web developers and content creators, WebP offers the perfect balance of quality, file size, and compatibility for modern web applications.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-green-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Benefits of Converting PNG to WebP
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Dramatic Size Reduction</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    WebP compression can reduce PNG file sizes by up to 80% without visible quality loss. This dramatic reduction means faster page loads, reduced bandwidth costs, and improved user experience across all devices.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">SEO Performance Boost</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Faster-loading images improve Core Web Vitals scores, directly impacting your search engine rankings. Google prioritizes fast-loading websites, making WebP conversion essential for competitive SEO performance.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Reduced Hosting Costs</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Smaller file sizes mean lower bandwidth usage and reduced hosting costs. For high-traffic websites, WebP conversion can result in significant savings on data transfer fees and server resources.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Enhanced User Experience</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Faster image loading improves user satisfaction and reduces bounce rates. Visitors are more likely to stay on your site when images load quickly, leading to better engagement and conversion rates.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed text-center">
                Converting PNG to WebP is one of the most effective optimizations you can make for web performance. The benefits extend beyond technical improvements to include real business value through better user engagement and reduced operational costs.
              </p>
            </div>
          </div>
        </div>

        {/* When to Use Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              When to Use WebP vs PNG
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                <div className="bg-green-100 rounded-xl p-6 border-2 border-green-300">
                  <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Choose WebP For:
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span>Web applications and websites requiring fast loading</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span>E-commerce product images and galleries</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span>Mobile-optimized content and responsive designs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span>Content delivery networks (CDN) optimization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span>SEO-focused websites prioritizing Core Web Vitals</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-100 rounded-xl p-6 border-2 border-orange-300">
                  <h3 className="text-xl font-semibold text-orange-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Keep PNG For:
                  </h3>
                  <ul className="space-y-2 text-orange-700">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">•</span>
                      <span>Professional print design and high-quality graphics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">•</span>
                      <span>Legacy system compatibility requirements</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">•</span>
                      <span>Image editing workflows requiring lossless quality</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">•</span>
                      <span>Situations where maximum quality is more important than file size</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Making the Right Choice</h3>
                <p className="text-gray-700 leading-relaxed">
                  For most web applications, WebP is the superior choice due to its excellent balance of quality and file size. Modern browsers fully support WebP, making it safe to use as your primary image format. Consider using WebP with PNG fallbacks only if you need to support very old browsers or specific legacy systems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Technical Details & Specifications
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">WebP Format Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">File Extension:</span>
                      <span className="text-gray-600">.webp</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">MIME Type:</span>
                      <span className="text-gray-600">image/webp</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Compression:</span>
                      <span className="text-gray-600">Lossy & Lossless</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Transparency:</span>
                      <span className="text-gray-600">8-bit Alpha Channel</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Animation:</span>
                      <span className="text-gray-600">Supported</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-700">Max Dimensions:</span>
                      <span className="text-gray-600">16,383 × 16,383 pixels</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Compression Technology</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    WebP uses advanced prediction coding and entropy encoding to achieve superior compression ratios. The format employs both intra-frame prediction and transform coding similar to VP8 video compression.
                  </p>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Key Technologies:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span>Block-based prediction for efficient compression</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span>Arithmetic entropy coding for optimal data representation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span>Smart color space optimization</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Browser Support & Compatibility</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm font-medium text-gray-900">Chrome 23+</div>
                    <div className="text-xs text-gray-600">2012</div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm font-medium text-gray-900">Firefox 65+</div>
                    <div className="text-xs text-gray-600">2019</div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm font-medium text-gray-900">Safari 14+</div>
                    <div className="text-xs text-gray-600">2020</div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm font-medium text-gray-900">Edge 18+</div>
                    <div className="text-xs text-gray-600">2018</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  WebP enjoys comprehensive browser support with over 95% global compatibility. Mobile browsers including iOS Safari, Chrome Mobile, and Samsung Internet fully support WebP, making it safe for production use across all platforms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Common Use Cases Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-indigo-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Common Use Cases
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">E-commerce Websites</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Product images, catalog galleries, and promotional banners benefit significantly from WebP's compression. Faster image loading improves conversion rates and reduces shopping cart abandonment.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Content Management</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Blog images, news photos, and editorial content load faster in WebP format, improving reader engagement and SEO performance while reducing hosting bandwidth costs.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mobile Applications</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    App interfaces, icons, and graphics benefit from WebP's smaller file sizes, reducing app download sizes and improving performance on mobile devices with limited bandwidth.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Media Platforms</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Profile pictures, post images, and user-generated content load faster when optimized with WebP, improving user experience and reducing server costs for high-traffic platforms.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Portfolio Websites</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Artist portfolios, photography galleries, and design showcases maintain visual quality while loading significantly faster, keeping visitors engaged with smooth browsing experiences.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-teal-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Corporate Websites</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Company logos, team photos, and marketing materials in WebP format contribute to professional website performance and better search engine rankings.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Industry Applications</h3>
                <p className="text-gray-700 leading-relaxed">
                  WebP conversion is particularly valuable for industries with image-heavy websites including real estate, fashion, automotive, and tourism. These sectors benefit from faster page loads, improved user engagement, and reduced hosting costs while maintaining the visual quality essential for their business success.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Is WebP better than PNG for web use?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Yes, WebP is generally superior to PNG for web applications. WebP provides 25-50% better compression than PNG while maintaining comparable image quality. It supports transparency like PNG but with much smaller file sizes, making it ideal for web performance optimization.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Will converting PNG to WebP lose image quality?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our converter uses lossless compression by default, meaning no quality is lost during conversion. The WebP format can maintain identical visual quality to the original PNG while significantly reducing file size. You can also choose lossy compression for even smaller files with minimal quality impact.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Do all browsers support WebP images?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Yes, all modern browsers support WebP including Chrome, Firefox, Safari, and Edge. WebP has over 95% global browser support as of 2024. For maximum compatibility, you can implement WebP with PNG fallbacks, though this is rarely necessary for modern web applications.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I convert multiple PNG files to WebP at once?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Currently, our converter processes one PNG file at a time to ensure optimal quality and processing speed. For bulk conversions, you can use our converter repeatedly, or consider our API for automated batch processing in development environments.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my uploaded PNG file secure and private?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Absolutely. All file uploads are processed securely over HTTPS, and your original PNG files are automatically deleted from our servers after one hour. We don't store, share, or analyze your images in any way, ensuring complete privacy for your content.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What's the maximum file size for PNG to WebP conversion?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our converter supports PNG files up to 50MB in size. This limit accommodates most web images including high-resolution graphics, detailed illustrations, and large photography files while ensuring fast processing times.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Can WebP images be edited like PNG files?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Yes, WebP images can be edited in most modern image editing software including Photoshop, GIMP, and online editors. Many applications now natively support WebP format for both importing and exporting, making it as versatile as traditional PNG files.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How much smaller will my PNG become as WebP?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Typically, PNG to WebP conversion results in 25-80% file size reduction depending on the image content. Simple graphics and logos may see larger reductions, while complex photographs might see more modest but still significant size improvements. The exact reduction varies based on image complexity and content type.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tools Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Related Tools
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 leading-relaxed mb-8 text-center">
                Explore our complete suite of image conversion tools for all your format optimization needs:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <a href="/webp-to-png" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">WebP to PNG Converter</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Convert WebP back to PNG format for compatibility with older systems or specific requirements.</p>
                </a>

                <a href="/jpg-to-webp" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">JPG to WebP Converter</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Convert JPEG images to WebP format for even better compression and web performance optimization.</p>
                </a>

                <a href="/avif-to-png" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">AVIF to PNG Converter</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Convert modern AVIF format images back to PNG for broader compatibility and editing flexibility.</p>
                </a>

                <a href="/png-to-jpg" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">PNG to JPG Converter</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Convert PNG to JPEG format for smaller file sizes when transparency is not required.</p>
                </a>

                <a href="/compress-image" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-teal-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-300">Image Compressor</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Reduce image file sizes while maintaining quality across multiple formats including PNG, JPG, and WebP.</p>
                </a>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600 leading-relaxed">
                  Need help choosing the right format? Our image conversion tools support all modern formats with optimized compression algorithms for the best balance of quality and file size.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Convert Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              How to Convert PNG to WebP Online
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                Converting PNG images to WebP format is simple with our free online converter. Follow these easy steps to optimize your images for better web performance:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload PNG File</h3>
                  <p className="text-gray-600 text-sm">Click the upload area or drag and drop your PNG image. Files up to 50MB are supported.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Convert to WebP</h3>
                  <p className="text-gray-600 text-sm">Click the "Convert to WebP" button and our server will process your image instantly.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Download WebP</h3>
                  <p className="text-gray-600 text-sm">Download your optimized WebP file immediately. No registration or software installation required.</p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Our PNG to WebP converter maintains transparency and image quality while significantly reducing file size. The conversion process is completely free, secure, and works directly in your browser. Your original PNG files are automatically deleted from our servers after one hour, ensuring complete privacy. The resulting WebP files are compatible with all modern browsers and provide faster loading times for your websites.
              </p>
            </div>
          </div>
        </div>

        {/* What is WebP Format Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              What is WebP Format?
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                WebP is a modern image format developed by Google that provides superior compression compared to traditional formats like PNG and JPEG. Originally released in 2010, WebP has become the preferred choice for web developers seeking optimal image performance.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Innovation</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    WebP uses advanced compression algorithms that analyze image content to achieve optimal file size reduction. It supports both lossy and lossless compression modes, allowing you to choose between maximum compression or perfect quality preservation.
                  </p>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Transparency Support</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Unlike JPEG, WebP fully supports alpha transparency, making it an excellent replacement for PNG images that require transparent backgrounds while offering much smaller file sizes.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Universal Browser Support</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    WebP is now supported by all major browsers including Chrome, Firefox, Safari, and Edge. This widespread adoption means you can confidently use WebP images across all platforms without compatibility concerns.
                  </p>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Performance Benefits</h4>
                  <p className="text-gray-700 leading-relaxed">
                    WebP images load significantly faster than PNG equivalents, improving Core Web Vitals scores and user experience. This enhanced performance directly contributes to better SEO rankings and reduced bounce rates.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                The WebP format represents the evolution of web imagery, combining the best features of PNG and JPEG while eliminating their limitations. For web developers and content creators, WebP offers the perfect balance of quality, file size, and compatibility for modern web applications.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-green-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Benefits of Converting PNG to WebP
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Dramatic Size Reduction</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    WebP compression can reduce PNG file sizes by up to 80% without visible quality loss. This dramatic reduction means faster page loads, reduced bandwidth costs, and improved user experience across all devices.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">SEO Performance Boost</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Faster-loading images improve Core Web Vitals scores, directly impacting your search engine rankings. Google prioritizes fast-loading websites, making WebP conversion essential for competitive SEO performance.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Reduced Hosting Costs</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Smaller file sizes mean lower bandwidth usage and reduced hosting costs. For high-traffic websites, WebP conversion can result in significant savings on data transfer fees and server resources.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Enhanced User Experience</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Faster image loading improves user satisfaction and reduces bounce rates. Visitors are more likely to stay on your site when images load quickly, leading to better engagement and conversion rates.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed text-center">
                Converting PNG to WebP is one of the most effective optimizations you can make for web performance. The benefits extend beyond technical improvements to include real business value through better user engagement and reduced operational costs.
              </p>
            </div>
          </div>
        </div>

        {/* When to Use Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              When to Use WebP vs PNG
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                <div className="bg-green-100 rounded-xl p-6 border-2 border-green-300">
                  <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Choose WebP For:
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span>Web applications and websites requiring fast loading</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span>E-commerce product images and galleries</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span>Mobile-optimized content and responsive designs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span>Content delivery networks (CDN) optimization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span>SEO-focused websites prioritizing Core Web Vitals</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-100 rounded-xl p-6 border-2 border-orange-300">
                  <h3 className="text-xl font-semibold text-orange-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Keep PNG For:
                  </h3>
                  <ul className="space-y-2 text-orange-700">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">•</span>
                      <span>Professional print design and high-quality graphics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">•</span>
                      <span>Legacy system compatibility requirements</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">•</span>
                      <span>Image editing workflows requiring lossless quality</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">•</span>
                      <span>Situations where maximum quality is more important than file size</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Making the Right Choice</h3>
                <p className="text-gray-700 leading-relaxed">
                  For most web applications, WebP is the superior choice due to its excellent balance of quality and file size. Modern browsers fully support WebP, making it safe to use as your primary image format. Consider using WebP with PNG fallbacks only if you need to support very old browsers or specific legacy systems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Technical Details & Specifications
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">WebP Format Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">File Extension:</span>
                      <span className="text-gray-600">.webp</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">MIME Type:</span>
                      <span className="text-gray-600">image/webp</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Compression:</span>
                      <span className="text-gray-600">Lossy & Lossless</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Transparency:</span>
                      <span className="text-gray-600">8-bit Alpha Channel</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Animation:</span>
                      <span className="text-gray-600">Supported</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-700">Max Dimensions:</span>
                      <span className="text-gray-600">16,383 × 16,383 pixels</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Compression Technology</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    WebP uses advanced prediction coding and entropy encoding to achieve superior compression ratios. The format employs both intra-frame prediction and transform coding similar to VP8 video compression.
                  </p>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Key Technologies:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span>Block-based prediction for efficient compression</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span>Arithmetic entropy coding for optimal data representation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span>Smart color space optimization</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Browser Support & Compatibility</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm font-medium text-gray-900">Chrome 23+</div>
                    <div className="text-xs text-gray-600">2012</div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm font-medium text-gray-900">Firefox 65+</div>
                    <div className="text-xs text-gray-600">2019</div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm font-medium text-gray-900">Safari 14+</div>
                    <div className="text-xs text-gray-600">2020</div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-sm font-medium text-gray-900">Edge 18+</div>
                    <div className="text-xs text-gray-600">2018</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  WebP enjoys comprehensive browser support with over 95% global compatibility. Mobile browsers including iOS Safari, Chrome Mobile, and Samsung Internet fully support WebP, making it safe for production use across all platforms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Common Use Cases Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-indigo-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Common Use Cases
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">E-commerce Websites</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Product images, catalog galleries, and promotional banners benefit significantly from WebP's compression. Faster image loading improves conversion rates and reduces shopping cart abandonment.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Content Management</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Blog images, news photos, and editorial content load faster in WebP format, improving reader engagement and SEO performance while reducing hosting bandwidth costs.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mobile Applications</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    App interfaces, icons, and graphics benefit from WebP's smaller file sizes, reducing app download sizes and improving performance on mobile devices with limited bandwidth.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Media Platforms</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Profile pictures, post images, and user-generated content load faster when optimized with WebP, improving user experience and reducing server costs for high-traffic platforms.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Portfolio Websites</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Artist portfolios, photography galleries, and design showcases maintain visual quality while loading significantly faster, keeping visitors engaged with smooth browsing experiences.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-teal-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Corporate Websites</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Company logos, team photos, and marketing materials in WebP format contribute to professional website performance and better search engine rankings.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Industry Applications</h3>
                <p className="text-gray-700 leading-relaxed">
                  WebP conversion is particularly valuable for industries with image-heavy websites including real estate, fashion, automotive, and tourism. These sectors benefit from faster page loads, improved user engagement, and reduced hosting costs while maintaining the visual quality essential for their business success.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Is WebP better than PNG for web use?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Yes, WebP is generally superior to PNG for web applications. WebP provides 25-50% better compression than PNG while maintaining comparable image quality. It supports transparency like PNG but with much smaller file sizes, making it ideal for web performance optimization.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Will converting PNG to WebP lose image quality?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our converter uses lossless compression by default, meaning no quality is lost during conversion. The WebP format can maintain identical visual quality to the original PNG while significantly reducing file size. You can also choose lossy compression for even smaller files with minimal quality impact.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Do all browsers support WebP images?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Yes, all modern browsers support WebP including Chrome, Firefox, Safari, and Edge. WebP has over 95% global browser support as of 2024. For maximum compatibility, you can implement WebP with PNG fallbacks, though this is rarely necessary for modern web applications.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I convert multiple PNG files to WebP at once?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Currently, our converter processes one PNG file at a time to ensure optimal quality and processing speed. For bulk conversions, you can use our converter repeatedly, or consider our API for automated batch processing in development environments.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my uploaded PNG file secure and private?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Absolutely. All file uploads are processed securely over HTTPS, and your original PNG files are automatically deleted from our servers after one hour. We don't store, share, or analyze your images in any way, ensuring complete privacy for your content.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What's the maximum file size for PNG to WebP conversion?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our converter supports PNG files up to 50MB in size. This limit accommodates most web images including high-resolution graphics, detailed illustrations, and large photography files while ensuring fast processing times.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Can WebP images be edited like PNG files?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Yes, WebP images can be edited in most modern image editing software including Photoshop, GIMP, and online editors. Many applications now natively support WebP format for both importing and exporting, making it as versatile as traditional PNG files.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How much smaller will my PNG become as WebP?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Typically, PNG to WebP conversion results in 25-80% file size reduction depending on the image content. Simple graphics and logos may see larger reductions, while complex photographs might see more modest but still significant size improvements. The exact reduction varies based on image complexity and content type.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tools Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Related Tools
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 leading-relaxed mb-8 text-center">
                Explore our complete suite of image conversion tools for all your format optimization needs:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <a href="/webp-to-png" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">WebP to PNG Converter</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Convert WebP back to PNG format for compatibility with older systems or specific requirements.</p>
                </a>

                <a href="/jpg-to-webp" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">JPG to WebP Converter</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Convert JPEG images to WebP format for even better compression and web performance optimization.</p>
                </a>

                <a href="/avif-to-png" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">AVIF to PNG Converter</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Convert modern AVIF format images back to PNG for broader compatibility and editing flexibility.</p>
                </a>

                <a href="/png-to-jpg" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">PNG to JPG Converter</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Convert PNG to JPEG format for smaller file sizes when transparency is not required.</p>
                </a>

                <a href="/compress-image" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-teal-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-300">Image Compressor</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Reduce image file sizes while maintaining quality across multiple formats including PNG, JPG, and WebP.</p>
                </a>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600 leading-relaxed">
                  Need help choosing the right format? Our image conversion tools support all modern formats with optimized compression algorithms for the best balance of quality and file size.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-green-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Why Choose Our PNG to WebP Converter?
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Modern Web Format Excellence</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  WebP is the future of web imagery, offering superior compression and quality compared to traditional PNG files. Our converter transforms your PNG images into this cutting-edge format, delivering up to 80% smaller file sizes while preserving transparency and visual fidelity.
                </p>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Browser Compatibility & Performance</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  WebP is now supported by all major browsers including Chrome, Firefox, Safari, and Edge. This universal support means your optimized images will display perfectly across all platforms while significantly improving page load speeds and user experience.
                </p>
                <h5 className="text-base font-medium text-gray-900 mb-2">Advanced Compression Technology</h5>
                <p className="text-gray-700 leading-relaxed">
                  WebP uses both lossy and lossless compression techniques, smart transparency handling, and advanced prediction algorithms to achieve optimal file size reduction without quality compromise.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Web Development</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Essential for modern web development, WebP conversion improves Core Web Vitals scores, reduces bandwidth usage, and enhances SEO rankings. Perfect for responsive websites, e-commerce platforms, and high-traffic applications where performance matters.
                </p>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Cost-Effective Web Optimization</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Reduce hosting costs and improve user engagement with faster-loading pages. WebP's efficiency means lower bandwidth bills, reduced server load, and happier users who don't abandon slow-loading sites.
                </p>
                <h5 className="text-base font-medium text-gray-900 mb-2">Quality Preservation</h5>
                <p className="text-gray-700 leading-relaxed">
                  Maintains PNG transparency features while delivering superior compression. Perfect for logos, graphics, and images requiring transparent backgrounds.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-green-200 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Conversion Benefits</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">80%</div>
                  <div className="text-sm text-gray-600">Size Reduction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600">Browser Support</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">50MB</div>
                  <div className="text-sm text-gray-600">Max File Size</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">∞</div>
                  <div className="text-sm text-gray-600">Free Conversions</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Speed & Efficiency</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Lightning-fast conversion process that handles PNG images of any size instantly. Our optimized algorithms ensure quick processing while maintaining the highest quality standards for professional use.
                </p>
                <h5 className="text-base font-medium text-gray-900 mb-2">Batch Processing Ready</h5>
                <p className="text-gray-700 leading-relaxed">
                  Built for scalability, perfect for converting multiple PNG files efficiently. Ideal for web developers and designers working with large image libraries.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Security & Privacy</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All conversions happen securely with automatic file deletion after processing. Your PNG images and converted WebP files remain completely private throughout the entire conversion process.
                </p>
                <h5 className="text-base font-medium text-gray-900 mb-2">Technical Excellence</h5>
                <p className="text-gray-700 leading-relaxed">
                  Supports all PNG variants including indexed color, grayscale, and full-color with alpha transparency. Perfect conversion results every time.
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-700 leading-relaxed text-lg">
                Join the web performance revolution with WebP format. Convert your PNG images today and experience faster loading times, reduced bandwidth costs, and improved user engagement. Your website visitors will thank you for the lightning-fast image loading experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}