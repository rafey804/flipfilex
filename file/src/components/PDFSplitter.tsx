'use client';

import { useState, useCallback, useRef } from 'react';
import { ApiService } from '@/lib/api';

interface FileWithId {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: any;
  error?: string;
}

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const bgColor = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-cyan-500',
    warning: 'bg-amber-500'
  }[type];

  const icon = {
    success: '✓',
    error: '✗',
    info: 'ℹ',
    warning: '⚠'
  }[type];

  return (
    <div className={`fixed top-20 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-slide-in`}>
      <span className="text-lg">{icon}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default function PDFSplitter() {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [splitOption, setSplitOption] = useState<'all' | 'range' | 'individual'>('all');
  const [pageRange, setPageRange] = useState('');
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({ show: false, message: '', type: 'info' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 5000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification({ show: false, message: '', type: 'info' });
  }, []);

  const scrollToDownloads = useCallback(() => {
    const downloadSection = document.querySelector('.files-section');
    if (downloadSection) {
      downloadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  }, []);

  const handleFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter(file => file.type === 'application/pdf');

    if (validFiles.length !== newFiles.length) {
      showNotification('Only PDF files are supported', 'warning');
    }

    if (validFiles.length === 0) return;

    showNotification('PDF files uploaded successfully', 'success');

    const filesWithId: FileWithId[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...filesWithId]);
  }, [showNotification]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const splitPDF = useCallback(async (fileWithId: FileWithId) => {
    try {
      setFiles(prev => prev.map(f =>
        f.id === fileWithId.id
          ? { ...f, status: 'processing' as const, progress: 10 }
          : f
      ));

      console.log('DEBUG: Split option:', splitOption);
      console.log('DEBUG: Page range:', pageRange);

      const formData = new FormData();
      formData.append('file', fileWithId.file);
      formData.append('split_option', splitOption);

      if (splitOption === 'range' && pageRange) {
        formData.append('page_range', pageRange);
      }

      setFiles(prev => prev.map(f =>
        f.id === fileWithId.id
          ? { ...f, progress: 30 }
          : f
      ));

      const result = await ApiService.splitPDF(formData, (progress) => {
        setFiles(prev => prev.map(f =>
          f.id === fileWithId.id
            ? { ...f, progress: Math.min(30 + progress * 0.6, 90) }
            : f
        ));
      });

      setFiles(prev => prev.map(f =>
        f.id === fileWithId.id
          ? { ...f, status: 'completed' as const, progress: 100, result }
          : f
      ));

      showNotification('PDF split successfully! Download links are ready.', 'success');

      // Auto scroll to downloads section
      setTimeout(() => {
        scrollToDownloads();
      }, 500);

    } catch (error: any) {
      console.error('Split error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to split PDF';

      setFiles(prev => prev.map(f =>
        f.id === fileWithId.id
          ? { ...f, status: 'error' as const, progress: 0, error: errorMessage }
          : f
      ));

      showNotification(errorMessage, 'error');
    }
  }, [splitOption, pageRange, showNotification]);

  const splitAllFiles = useCallback(async () => {
    if (files.length === 0) {
      showNotification('Please upload PDF files first', 'warning');
      return;
    }

    setIsProcessing(true);
    showNotification('Starting PDF splitting process...', 'info');

    try {
      for (const file of files) {
        if (file.status === 'pending') {
          await splitPDF(file);
        }
      }
    } catch (error) {
      console.error('Batch split error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [files, splitPDF, showNotification]);

  const downloadFile = useCallback((result: any, originalName: string) => {
    if (!result.files || result.files.length === 0) return;

    result.files.forEach((fileInfo: any, index: number) => {
      // Add small delay between downloads to prevent browser blocking
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/download/${fileInfo.filename}`;
        link.download = fileInfo.original_name || `${originalName.replace('.pdf', '')}_page_${index + 1}.pdf`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 500); // Staggered downloads every 500ms
    });
  }, []);

  const downloadSingleFile = useCallback((fileInfo: any, originalName: string) => {
    const link = document.createElement('a');
    link.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/download/${fileInfo.filename}`;
    link.download = fileInfo.original_name || originalName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSplitOptionDescription = () => {
    switch (splitOption) {
      case 'all':
        return 'Split into individual pages (one page per file)';
      case 'range':
        return 'Split by custom page ranges (e.g., 1-3, 5, 7-10)';
      case 'individual':
        return 'Extract specific pages as separate files';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-3xl text-white text-3xl mb-6 shadow-xl">
            📄✂️
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent mb-4">
            Split PDF Pages
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Split PDF files into individual pages or custom ranges. Extract specific pages and create separate documents with ease.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Upload Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="text-cyan-600 mr-3">📁</span>
                    Upload PDF Files
                  </h2>

                  {/* Split Options */}
                  <div className="mb-6 p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Split Options</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="splitOption"
                          value="all"
                          checked={splitOption === 'all'}
                          onChange={(e) => setSplitOption(e.target.value as any)}
                          className="text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm font-medium">Split into individual pages</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="splitOption"
                          value="range"
                          checked={splitOption === 'range'}
                          onChange={(e) => setSplitOption(e.target.value as any)}
                          className="text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm font-medium">Split by page ranges</span>
                      </label>

                      {splitOption === 'range' && (
                        <div className="ml-6 mt-2">
                          <input
                            type="text"
                            placeholder="e.g., 1-3, 5, 7-10"
                            value={pageRange}
                            onChange={(e) => setPageRange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter page ranges separated by commas</p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-3 italic">{getSplitOptionDescription()}</p>
                  </div>

                  {/* Drag & Drop Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      dragActive
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-300 hover:border-cyan-400 hover:bg-gray-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="space-y-4">
                      <div className="text-6xl text-cyan-500">📄</div>
                      <div>
                        <p className="text-xl font-semibold text-gray-700 mb-2">
                          Drop PDF files here or click to browse
                        </p>
                        <p className="text-gray-500">
                          Supports multiple PDF files • Max 100MB per file
                        </p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Select PDF Files
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 files-section">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">
                        Uploaded Files ({files.length})
                      </h3>
                      <div className="space-x-3">
                        <button
                          onClick={splitAllFiles}
                          disabled={isProcessing || files.every(f => f.status !== 'pending')}
                          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {isProcessing ? 'Processing...' : 'Split All PDFs'}
                        </button>
                        <button
                          onClick={clearAllFiles}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {files.map((fileWithId) => (
                      <div key={fileWithId.id} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                              <span className="text-xl">📄</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 truncate max-w-xs">
                                {fileWithId.file.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(fileWithId.file.size)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {fileWithId.status === 'completed' && fileWithId.result && (
                              <button
                                onClick={() => downloadFile(fileWithId.result, fileWithId.file.name)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Download All</span>
                              </button>
                            )}

                            {fileWithId.status === 'pending' && (
                              <button
                                onClick={() => splitPDF(fileWithId)}
                                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                              >
                                Split PDF
                              </button>
                            )}

                            <button
                              onClick={() => removeFile(fileWithId.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {(fileWithId.status === 'processing') && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${fileWithId.progress}%` }}
                            ></div>
                          </div>
                        )}

                        {/* Split Files Preview */}
                        {fileWithId.status === 'completed' && fileWithId.result && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-green-800 text-sm font-medium">
                                ✅ Split into {fileWithId.result.files?.length || 0} files successfully
                              </p>
                            </div>

                            {/* Individual File List */}
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {fileWithId.result.files?.map((splitFile: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                      <span className="text-sm">📄</span>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {splitFile.original_name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Page {index + 1} • PDF
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => downloadSingleFile(splitFile, splitFile.original_name)}
                                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors flex items-center space-x-1"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>Download</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {fileWithId.status === 'error' && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm">
                              ❌ {fileWithId.error}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar with Info */}
            <div className="space-y-6">
              {/* Features */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-cyan-600 mr-3">⚡</span>
                  Features
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: '🔄', title: 'Multiple Split Options', desc: 'Individual pages, ranges, or custom splits' },
                    { icon: '🚀', title: 'Fast Processing', desc: 'Quick and efficient PDF splitting' },
                    { icon: '🔒', title: 'Secure & Private', desc: 'Files deleted after processing' },
                    { icon: '📱', title: 'Any Device', desc: 'Works on desktop, tablet, and mobile' },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-lg">{feature.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-cyan-600 mr-3">📊</span>
                  Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Files Processed:</span>
                    <span className="font-bold text-cyan-600">15,247+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-bold text-green-600">99.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Process Time:</span>
                    <span className="font-bold text-blue-600">12s</span>
                  </div>
                </div>
              </div>

              {/* How to Use */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-cyan-600 mr-3">📋</span>
                  How to Use
                </h3>
                <div className="space-y-3">
                  {[
                    'Choose your split option',
                    'Upload your PDF files',
                    'Click "Split PDF" or "Split All"',
                    'Download your split files'
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}