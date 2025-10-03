'use client';

import { useState, useEffect } from 'react';
import { X, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ProgressPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  operationId: string | null;
  checkStatusUrl: (id: string) => string;
  downloadUrl?: string;
  onComplete?: () => void;
  onDownload?: () => void;
}

interface ProcessStatus {
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  download_url?: string;
  error?: string;
  compression_results?: {
    original_size: number;
    compressed_size: number;
    size_reduction: string;
    compression_ratio: number;
  };
}

export default function ProgressPopup({
  isOpen,
  onClose,
  title,
  operationId,
  checkStatusUrl,
  downloadUrl,
  onComplete,
  onDownload
}: ProgressPopupProps) {
  const [status, setStatus] = useState<ProcessStatus>({
    status: 'queued',
    progress: 0,
    message: 'Initializing...'
  });
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!isOpen || !operationId) return;

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    const checkStatus = async () => {
      try {
        const response = await fetch(checkStatusUrl(operationId));
        if (response.ok) {
          const data: ProcessStatus = await response.json();
          setStatus(data);

          // Auto-close and reset after completion with delay
          if (data.status === 'completed' && onComplete) {
            setTimeout(() => {
              onComplete();
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Status check failed:', error);
        setStatus(prev => ({
          ...prev,
          status: 'failed',
          message: 'Failed to check status',
          error: 'Network error'
        }));
      }
    };

    // Initial check
    checkStatus();

    // Poll every 1 second while processing (faster updates)
    const interval = setInterval(() => {
      if (status.status === 'queued' || status.status === 'processing') {
        checkStatus();
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, operationId, checkStatusUrl, status.status, onComplete]);

  const handleDownload = async () => {
    if (!status.download_url && !downloadUrl) return;

    setIsDownloading(true);
    try {
      const url = status.download_url || downloadUrl!;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}${url}`);

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = url.split('/').pop() || 'processed-file.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        if (onDownload) onDownload();

        // Close popup after successful download
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
    }
  };

  const getProgressColor = () => {
    switch (status.status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gradient-to-r from-green-400 to-green-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-indigo-100 text-sm opacity-90">
                  {status.status === 'completed' ? 'Process completed!' :
                   status.status === 'failed' ? 'Process failed' :
                   status.status === 'processing' ? 'Processing...' : 'Queued'}
                </p>
              </div>
            </div>
            {status.status !== 'processing' && (
              <button
                onClick={onClose}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(status.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${getProgressColor()}`}
                style={{ width: `${Math.max(status.progress, 5)}%` }}
              >
                <div className="w-full h-full bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="mb-4">
            <p className="text-gray-700 text-center">{status.message}</p>
            {status.error && (
              <p className="text-red-500 text-sm text-center mt-2">{status.error}</p>
            )}
          </div>

          {/* Compression Results */}
          {status.compression_results && status.status === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-green-800 mb-2">Compression Results</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Original Size:</div>
                <div className="font-medium">{formatFileSize(status.compression_results.original_size)}</div>
                <div className="text-gray-600">Compressed Size:</div>
                <div className="font-medium text-green-600">{formatFileSize(status.compression_results.compressed_size)}</div>
                <div className="text-gray-600">Size Reduction:</div>
                <div className="font-bold text-green-600">{status.compression_results.size_reduction}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {status.status === 'completed' && (status.download_url || downloadUrl) && (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className={`${status.status === 'completed' && (status.download_url || downloadUrl) ? 'flex-1' : 'w-full'} bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors`}
            >
              {status.status === 'processing' ? 'Hide' : 'Close'}
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}