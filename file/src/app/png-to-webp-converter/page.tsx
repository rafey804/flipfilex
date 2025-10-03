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