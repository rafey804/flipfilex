'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { ApiService } from '@/lib/api';

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Types
interface FileWithId {
  file: File;
  id: string;
}

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export default function PDFCompressor() {
  const router = useRouter();
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [optimizeImages, setOptimizeImages] = useState(true);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionStatus, setCompressionStatus] = useState('');
  const [compressionResults, setCompressionResults] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const progressSectionRef = useRef<HTMLDivElement>(null);
  const compressButtonRef = useRef<HTMLDivElement>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-close notification after 20 seconds
  useEffect(() => {
    if (notification) {
      // Clear any existing timeout
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }

      // Set new timeout for 20 seconds
      notificationTimeoutRef.current = setTimeout(() => {
        setNotification(null);
      }, 20000);
    }

    // Cleanup timeout on unmount or when notification changes
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [notification]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileWithId[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Auto-scroll to compress button when files are uploaded
    setTimeout(() => {
      if (compressButtonRef.current) {
        compressButtonRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 500);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const compressFiles = async () => {
    if (files.length === 0) return;

    const fileItem = files[0];
    setIsCompressing(true);
    setCompressionProgress(1);
    setCompressionStatus('Starting compression...');
    setCompressionResults(null);
    setDownloadUrl(null);

    // Auto-scroll to progress section
    setTimeout(() => {
      if (progressSectionRef.current) {
        progressSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);

    // Simulate real-time progress from 1 to 30
    let progressValue = 1;
    const progressInterval = setInterval(() => {
      progressValue += 1;
      if (progressValue <= 30) {
        setCompressionProgress(progressValue);
      } else {
        clearInterval(progressInterval);
      }
    }, 100);

    try {
      // Wait for initial progress to complete
      setTimeout(() => {
        setCompressionStatus('Uploading file...');
        setCompressionProgress(35);
      }, 3000);

      // Call the PDF compression API using ApiService
      const result = await ApiService.compressPdf(
        fileItem.file,
        {
          compression_level: compressionLevel,
          remove_metadata: removeMetadata,
          optimize_images: optimizeImages,
        },
        (progress) => {
          // Update progress during upload
          setCompressionProgress(Math.min(35 + (progress.percentage * 0.15), 50));
        }
      );

      setCompressionProgress(50);
      setCompressionStatus('Processing PDF...');

      // Check if compression is completed immediately or requires polling
      if (result.status === 'completed' && result.output_filename) {
        // Direct completion
        setCompressionProgress(100);
        setCompressionStatus('Compression completed!');
        setDownloadUrl(ApiService.getDownloadUrl(result.output_filename));
        setIsCompressing(false);

        setNotification({
          message: `PDF compressed successfully!`,
          type: 'success',
          onClose: () => setNotification(null)
        });
      } else if (result.compression_id) {
        // Poll for status
        await pollCompressionStatus(result.compression_id);
      } else {
        throw new Error('No compression ID or download URL received');
      }

    } catch (error: any) {
      setNotification({
        message: `Compression failed: ${error.message}`,
        type: 'error',
        onClose: () => setNotification(null)
      });
      setIsCompressing(false);
      setCompressionProgress(0);
      setCompressionStatus('');
    }
  };

  const pollCompressionStatus = async (compressionId: string) => {
    let currentProgress = 50;
    let progressValue = 50;
    let pollAttempts = 0;
    const maxPollAttempts = 60; // Maximum 60 seconds of polling

    // Start a progress animation that continues until completion
    const progressUpdateInterval = setInterval(() => {
      if (progressValue < 95) {
        progressValue += 1;
        setCompressionProgress(progressValue);
      }
    }, 200);

    const checkStatus = async () => {
      try {
        pollAttempts++;

        // If we've been polling for too long, assume direct completion
        if (pollAttempts > maxPollAttempts) {
          clearInterval(progressUpdateInterval);
          setCompressionProgress(100);
          setCompressionStatus('Compression completed!');

          // Try to construct download URL directly
          const downloadUrl = ApiService.getDownloadUrl(`${compressionId}_compressed.pdf`);
          setDownloadUrl(downloadUrl);
          setIsCompressing(false);

          setNotification({
            message: 'PDF compression completed! Download your file below.',
            type: 'success',
            onClose: () => setNotification(null)
          });

          return true; // Stop polling
        }

        const data = await ApiService.getCompressionStatus(compressionId);
        setCompressionStatus(data.message || 'Processing...');

        if (data.status === 'completed') {
          clearInterval(progressUpdateInterval);
          setCompressionProgress(100);
          setCompressionStatus('Compression completed!');
          setCompressionResults(data.compression_results);
          setDownloadUrl(data.download_url || ApiService.getDownloadUrl(`${compressionId}_compressed.pdf`));
          setIsCompressing(false);

          // Show different messages based on compression results
          const compressionMethod = data.compression_results?.compression_method;
          let message = '';

          if (compressionMethod === 'copy_encrypted') {
            message = 'PDF is encrypted and cannot be compressed. Original file preserved.';
          } else if (compressionMethod === 'already_optimized') {
            message = 'PDF is already well-optimized and cannot be compressed further.';
          } else {
            message = `PDF compressed successfully! ${data.compression_results?.size_reduction || ''}`;
          }

          setNotification({
            message,
            type: compressionMethod === 'copy_encrypted' || compressionMethod === 'already_optimized' ? 'info' : 'success',
            onClose: () => setNotification(null)
          });

          return true; // Stop polling
        } else if (data.status === 'failed') {
          clearInterval(progressUpdateInterval);
          throw new Error(data.error || 'Compression failed');
        }
        return false; // Continue polling
      } catch (error: any) {
        clearInterval(progressUpdateInterval);

        // If status endpoint is not available, assume direct completion
        if (error.message.includes('Failed to get compression status') || error.message.includes('404')) {
          setCompressionProgress(100);
          setCompressionStatus('Compression completed!');

          // Try to construct download URL directly
          const downloadUrl = ApiService.getDownloadUrl(`${compressionId}_compressed.pdf`);
          setDownloadUrl(downloadUrl);
          setIsCompressing(false);

          setNotification({
            message: 'PDF compression completed! Download your file below.',
            type: 'success',
            onClose: () => setNotification(null)
          });
        } else {
          setNotification({
            message: `Compression failed: ${error.message}`,
            type: 'error',
            onClose: () => setNotification(null)
          });
          setIsCompressing(false);
          setCompressionProgress(0);
          setCompressionStatus('');
        }
        return true; // Stop polling
      }
    };

    // Initial check
    const completed = await checkStatus();
    if (completed) return;

    // Poll every second
    const interval = setInterval(async () => {
      const completed = await checkStatus();
      if (completed) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const clearAll = () => {
    setFiles([]);
    setCompressionProgress(0);
    setCompressionStatus('');
    setCompressionResults(null);
    setDownloadUrl(null);
  };

  const handleDownload = async () => {
    if (!downloadUrl) {
      setNotification({
        message: 'No download URL available. Please try compressing again.',
        type: 'error',
        onClose: () => setNotification(null)
      });
      return;
    }

    try {
      const filename = downloadUrl.split('/').pop() || 'compressed-file.pdf';

      // Try using the API download first
      try {
        const blob = await ApiService.downloadFile(filename);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setNotification({
          message: 'File downloaded successfully!',
          type: 'success',
          onClose: () => setNotification(null)
        });
      } catch (apiError) {
        // Fallback: try direct download URL
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setNotification({
          message: 'Download started!',
          type: 'success',
          onClose: () => setNotification(null)
        });
      }
    } catch (error: any) {
      setNotification({
        message: `Download failed: ${error.message}. Please try right-clicking the download button and selecting "Save link as..."`,
        type: 'error',
        onClose: () => setNotification(null)
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-6 sm:py-12">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-400/10 to-green-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl text-white text-4xl mb-6 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">
              🗜️
            </div>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-6">
              PDF Compressor
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Reduce PDF file size up to 80% while maintaining quality. Fast, secure, and professional compression.
            </p>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer
                ${isDragActive
                  ? 'border-emerald-500 bg-emerald-50 scale-105'
                  : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-25'
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="text-6xl">📄</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isDragActive ? 'Drop PDF files here' : 'Choose PDF files to compress'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your PDF files here, or click to select files
                  </p>
                  <div className="text-sm text-gray-500">
                    Maximum file size: 100MB • Supported format: PDF
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compression Settings */}
          {files.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Compression Settings</h3>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Compression Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Compression Level
                  </label>
                  <select
                    value={compressionLevel}
                    onChange={(e) => setCompressionLevel(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="low">Low (30-50% reduction)</option>
                    <option value="medium">Medium (50-70% reduction)</option>
                    <option value="high">High (70-85% reduction)</option>
                  </select>
                </div>

                {/* Remove Metadata */}
                <div className="flex items-center">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Options
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={removeMetadata}
                        onChange={(e) => setRemoveMetadata(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">Remove metadata</span>
                    </label>
                  </div>
                </div>

                {/* Optimize Images */}
                <div className="flex items-center">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 invisible">
                      Placeholder
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={optimizeImages}
                        onChange={(e) => setOptimizeImages(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">Optimize images</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Files List */}
          {files.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Files ({files.length})</h3>
                <button
                  onClick={clearAll}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                {files.map((fileItem) => (
                  <div key={fileItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📄</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{fileItem.file.name}</h4>
                        <p className="text-sm text-gray-500">{formatFileSize(fileItem.file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(fileItem.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compress Button */}
          {files.length > 0 && (
            <div ref={compressButtonRef} className="text-center mb-8">
              <button
                onClick={compressFiles}
                disabled={isCompressing}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 mx-auto animate-pulse hover:animate-none"
              >
                {isCompressing ? (
                  <>
                    <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Compress PDFs</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Inline Progress Section */}
          {isCompressing && (
            <div ref={progressSectionRef} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Compression Progress</h3>
                <span className="text-emerald-600 font-medium">{compressionProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${compressionProgress}%` }}
                >
                  <div className="w-full h-full bg-white opacity-30 animate-pulse"></div>
                </div>
              </div>

              {/* Status Message */}
              <p className="text-gray-700 text-center">{compressionStatus}</p>
            </div>
          )}

          {/* Download Section - Show when download is available */}
          {downloadUrl && !isCompressing && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="text-center mb-4">
                <div className="text-emerald-600 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Compression Complete!</h3>
                <p className="text-gray-600 mb-4">Your PDF has been compressed successfully.</p>
              </div>

              <button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Compressed PDF</span>
              </button>

              <div className="mt-4 text-center">
                <button
                  onClick={clearAll}
                  className="text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  Compress Another File
                </button>
              </div>
            </div>
          )}

          {/* Compression Results */}
          {compressionResults && !isCompressing && (
            <div className={`border rounded-2xl p-6 mb-8 ${
              compressionResults.compression_ratio > 0
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${
                  compressionResults.compression_ratio > 0
                    ? 'text-emerald-800'
                    : 'text-blue-800'
                }`}>
                  {compressionResults.compression_ratio > 0 ? 'Compression Complete!' : 'Processing Complete!'}
                </h3>
                <div className={`font-bold text-lg ${
                  compressionResults.compression_ratio > 0
                    ? 'text-emerald-600'
                    : 'text-blue-600'
                }`}>
                  {compressionResults.compression_ratio > 0 ? compressionResults.size_reduction : 'Already Optimized'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Original Size</p>
                  <p className="font-semibold text-gray-900">{formatFileSize(compressionResults.original_size)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    {compressionResults.compression_ratio > 0 ? 'Compressed Size' : 'Final Size'}
                  </p>
                  <p className={`font-semibold ${
                    compressionResults.compression_ratio > 0 ? 'text-emerald-600' : 'text-blue-600'
                  }`}>
                    {formatFileSize(compressionResults.compressed_size)}
                  </p>
                </div>
              </div>

              {downloadUrl && (
                <button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Compressed PDF</span>
                </button>
              )}
            </div>
          )}

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Advanced compression algorithms ensure blazing-fast processing without compromising quality.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Processing</h3>
              <p className="text-gray-600">Files are automatically deleted after processing. Your documents remain completely private.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Perfect Quality</h3>
              <p className="text-gray-600">Intelligent compression maintains document quality while significantly reducing file size.</p>
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 mb-16">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Professional PDF Compression Technology</h2>

            <div className="space-y-16">
              {/* How PDF Compression Works */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-200">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">How Advanced PDF Compression Works</h3>
                <div className="max-w-4xl mx-auto">
                  <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                    Our PDF compression technology employs sophisticated algorithms that analyze document structure,
                    optimize embedded images, remove redundant data, and compress text streams while preserving
                    document integrity. The process intelligently balances file size reduction with visual quality,
                    ensuring your documents remain professional and readable.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">1</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload PDF Files</h4>
                      <p className="text-gray-600 text-sm">Securely upload your PDF files up to 100MB in size for professional compression processing.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">2</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Intelligent Processing</h4>
                      <p className="text-gray-600 text-sm">Advanced algorithms analyze and compress images, text, and metadata while maintaining document quality.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">3</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Download Results</h4>
                      <p className="text-gray-600 text-sm">Download your optimized PDF files with significant size reduction and preserved visual quality.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why File Size Matters */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-orange-200">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Large PDF File Size Challenges</h3>
                  <div className="max-w-2xl mx-auto">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Large PDF files create significant obstacles in professional workflows, including slow email
                      transmission, storage limitations, poor user experience, increased bandwidth costs, and
                      difficulty sharing documents across platforms and devices.
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-green-200">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Optimized PDF Benefits</h3>
                  <div className="max-w-2xl mx-auto">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Compressed PDFs enable faster loading times, reduced storage costs, improved email
                      deliverability, enhanced mobile accessibility, better user experience, and seamless
                      document sharing across all platforms while maintaining professional quality.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compression Benefits */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-200">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Enterprise-Grade PDF Compression Benefits</h3>
                <div className="max-w-4xl mx-auto">
                  <p className="text-gray-700 leading-relaxed text-lg mb-8">
                    Professional PDF compression significantly reduces file sizes by 50-85% while maintaining document
                    quality, improving workflow efficiency, reducing storage costs, and enabling seamless document
                    sharing across all business platforms and mobile devices.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="text-3xl mr-4">💰</div>
                        <h4 className="text-xl font-semibold text-gray-900">Cost Reduction</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Reduce storage costs by up to 85% while improving email deliverability and reducing
                        bandwidth usage for document sharing and collaboration.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="text-3xl mr-4">🚀</div>
                        <h4 className="text-xl font-semibold text-gray-900">Performance Enhancement</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Faster document loading, improved mobile accessibility, better user experience,
                        and seamless integration with business workflow systems.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="text-3xl mr-4">🌍</div>
                        <h4 className="text-xl font-semibold text-gray-900">Universal Compatibility</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Compressed PDFs maintain perfect compatibility across all devices, operating systems,
                        and PDF viewers while ensuring professional presentation quality.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="text-3xl mr-4">🔐</div>
                        <h4 className="text-xl font-semibold text-gray-900">Secure Processing</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Bank-level security protocols protect your documents during compression, with automatic
                        file deletion ensuring complete confidentiality and data privacy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-200">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Advanced Compression Technology Specifications</h3>
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="text-2xl mr-3">📤</span>Input Specifications
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 text-sm leading-relaxed">Maximum file size support up to 100MB for comprehensive document processing</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 text-sm leading-relaxed">Support for all PDF versions and encryption standards including password-protected files</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 text-sm leading-relaxed">Intelligent handling of complex documents with embedded fonts, images, and vector graphics</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="text-2xl mr-3">📥</span>Output Optimization
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 text-sm leading-relaxed">Compression ratios of 50-85% while maintaining professional document quality</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 text-sm leading-relaxed">Optimized image compression with JPEG2000 and JBIG2 encoding for superior results</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 text-sm leading-relaxed">Metadata removal and font optimization while preserving document accessibility features</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Use Cases */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-cyan-200">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Professional PDF Compression Applications</h3>
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="text-3xl mb-4">🏢</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Business Documentation</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Optimize reports, proposals, contracts, and presentations for email sharing, cloud storage,
                        and mobile accessibility while maintaining professional quality standards.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="text-3xl mb-4">🎓</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Academic Publishing</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Compress research papers, theses, dissertations, and academic materials for journal
                        submission, online publication, and institutional repository storage.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="text-3xl mb-4">🏥</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Healthcare Records</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Optimize medical records, patient files, imaging reports, and documentation while
                        maintaining HIPAA compliance and document integrity requirements.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="text-3xl mb-4">⚖️</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Legal Documentation</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Compress legal briefs, case files, contracts, and court documents for efficient
                        case management, client sharing, and electronic filing systems.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="text-3xl mb-4">🏗️</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Engineering Drawings</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Optimize technical drawings, blueprints, CAD exports, and engineering specifications
                        while preserving critical technical details and measurement accuracy.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="text-3xl mb-4">📚</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Digital Publishing</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Compress eBooks, manuals, catalogues, and digital publications for faster loading,
                        reduced bandwidth usage, and improved user experience across devices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">PDF Compression: Professional Guide</h3>
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Will PDF compression affect document quality?</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Our advanced compression algorithms are designed to significantly reduce file size while maintaining
                        professional document quality. The technology intelligently optimizes images, text, and metadata
                        without compromising readability or visual appearance, ensuring your documents remain professional
                        and suitable for business use.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">What compression levels are available and when should I use them?</h4>
                      <p className="text-gray-700 leading-relaxed">
                        We offer three compression levels: Low (30-50% reduction) for documents requiring maximum quality,
                        Medium (50-70% reduction) for balanced optimization suitable for most business needs, and High
                        (70-85% reduction) for maximum file size reduction. Choose based on your quality requirements and
                        intended use case.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Is my document data secure during compression?</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Absolutely! All documents are processed with bank-level security protocols using encrypted connections.
                        Your files are automatically deleted from our servers immediately after processing, ensuring complete
                        confidentiality. We never store, access, or analyze your document content, maintaining strict privacy
                        standards for all business and personal documents.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">What file size limits apply to PDF compression?</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Our system supports PDF files up to 100MB in size, accommodating most business documents, technical
                        drawings, academic papers, and digital publications. This limit covers everything from simple text
                        documents to complex files with embedded images, graphics, and multimedia elements.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">How long does PDF compression typically take?</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Compression time varies based on file size and complexity, typically ranging from 10-60 seconds for
                        most documents. Our optimized processing infrastructure ensures fast turnaround while maintaining
                        quality standards. Real-time progress indicators keep you informed throughout the compression process.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Can I compress password-protected or encrypted PDFs?</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Our system can handle encrypted PDFs in most cases. For password-protected files, the system will
                        preserve the original security settings while optimizing the internal file structure. If compression
                        is not possible due to encryption restrictions, you'll receive the original file with an explanation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Notification */}
        {notification && (
          <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-md animate-slide-in ${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                {notification.type === 'success' && (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button onClick={notification.onClose} className="ml-2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes slide-in {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </>
  );
}