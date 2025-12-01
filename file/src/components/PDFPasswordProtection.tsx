'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import ProgressPopup from './ProgressPopup';
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

export default function PDFPasswordProtection() {
  const router = useRouter();
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'protect' | 'unprotect'>('protect');
  const [userPassword, setUserPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [encryptionLevel, setEncryptionLevel] = useState('standard');
  const [permissions, setPermissions] = useState<string[]>(['print', 'copy']);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStatus, setProcessStatus] = useState('');
  const [processResults, setProcessResults] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [showProgressPopup, setShowProgressPopup] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('');
  const [currentOperationId, setCurrentOperationId] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileWithId[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
    }));

    setFiles(prev => [...prev, ...newFiles]);
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

  const processFiles = async () => {
    if (files.length === 0) return;
    if (mode === 'protect' && !userPassword.trim()) {
      setNotification({
        message: 'Please enter a password to protect the PDF',
        type: 'error',
        onClose: () => setNotification(null)
      });
      return;
    }
    if (mode === 'unprotect' && !userPassword.trim()) {
      setNotification({
        message: 'Please enter the password to unlock the PDF',
        type: 'error',
        onClose: () => setNotification(null)
      });
      return;
    }

    // Process the first file
    const fileItem = files[0];
    setCurrentFileName(fileItem.file.name);

    try {
      setIsProcessing(true);
      setProcessProgress(0);
      setProcessStatus('Starting process...');
      setProcessResults(null);
      setDownloadUrl(null);

      let result;
      const progressCallback = (progress: any) => {
        setProcessProgress(Math.min(progress.percentage * 0.25, 25));
      };

      if (mode === 'protect') {
        // Call protect PDF API
        result = await ApiService.protectPdf(
          fileItem.file,
          {
            user_password: userPassword,
            owner_password: ownerPassword.trim() || undefined,
            encryption_level: encryptionLevel,
            permissions: permissions.join(',')
          },
          progressCallback
        );
      } else {
        // Call unprotect PDF API
        result = await ApiService.unprotectPdf(
          fileItem.file,
          userPassword,
          progressCallback
        );
      }

      setProcessProgress(25);
      setProcessStatus('Processing PDF...');

      if (result.operation_id) {
        // Show progress popup and poll for status
        setCurrentOperationId(result.operation_id);
        setShowProgressPopup(true);
      } else {
        throw new Error('No operation ID received');
      }

    } catch (error: any) {
      setNotification({
        message: `${mode === 'protect' ? 'Protection' : 'Unprotection'} failed: ${error.message}`,
        type: 'error',
        onClose: () => setNotification(null)
      });
      setIsProcessing(false);
      setProcessProgress(0);
      setProcessStatus('');
    }
  };

  const pollProcessStatus = async (operationId: string) => {
    const checkStatus = async () => {
      try {
        const data = await ApiService.getProtectionStatus(operationId);
        setProcessProgress(data.progress || 50);
        setProcessStatus(data.message || 'Processing...');

        if (data.status === 'completed') {
          setProcessProgress(100);
          setProcessStatus(`PDF ${mode === 'protect' ? 'protection' : 'unlock'} completed!`);
          setProcessResults(data);
          setDownloadUrl(data.download_url);
          setIsProcessing(false);

          setNotification({
            message: `PDF ${mode === 'protect' ? 'protected' : 'unlocked'} successfully!`,
            type: 'success',
            onClose: () => setNotification(null)
          });

          return true; // Stop polling
        } else if (data.status === 'failed') {
          throw new Error(data.error || `${mode === 'protect' ? 'Protection' : 'Unlock'} failed`);
        }
        return false; // Continue polling
      } catch (error: any) {
        setNotification({
          message: `${mode === 'protect' ? 'Protection' : 'Unlock'} failed: ${error.message}`,
          type: 'error',
          onClose: () => setNotification(null)
        });
        setIsProcessing(false);
        setProcessProgress(0);
        setProcessStatus('');
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
    setUserPassword('');
    setOwnerPassword('');
    setProcessProgress(0);
    setProcessStatus('');
    setProcessResults(null);
    setDownloadUrl(null);
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;

    try {
      const filename = downloadUrl.split('/').pop() || `${mode === 'protect' ? 'protected' : 'unlocked'}-file.pdf`;
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
    } catch (error: any) {
      setNotification({
        message: `Download failed: ${error.message}`,
        type: 'error',
        onClose: () => setNotification(null)
      });
    }
  };

  const togglePermission = (permission: string) => {
    setPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const closeProgressPopup = () => {
    setShowProgressPopup(false);
    setCurrentOperationId(null);
  };

  const handleProgressComplete = (result: any) => {
    setProcessResults(result);
    setDownloadUrl(result.download_url);
    setShowProgressPopup(false);
    setIsProcessing(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 sm:py-12">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl text-white text-4xl mb-6 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">
              🔒
            </div>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              PDF Password Protection
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Add password protection to secure your PDFs or remove passwords to unlock them.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex">
                <button
                  onClick={() => setMode('protect')}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${mode === 'protect'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  🔒 Lock PDF
                </button>
                <button
                  onClick={() => setMode('unprotect')}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${mode === 'unprotect'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  🔓 Unlock PDF
                </button>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer
                ${isDragActive
                  ? 'border-indigo-500 bg-indigo-50 scale-105'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-25'
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="text-6xl">{mode === 'protect' ? '🔒' : '🔓'}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isDragActive ? 'Drop PDF files here' : `Choose PDF files to ${mode === 'protect' ? 'lock' : 'unlock'}`}
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

          {/* Password Settings */}
          {files.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {mode === 'protect' ? 'Protection Settings' : 'Unlock Settings'}
              </h3>

              <div className="space-y-6">
                {/* Password Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {mode === 'protect' ? 'User Password (Required)' : 'PDF Password'}
                    </label>
                    <input
                      type="password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder={mode === 'protect' ? 'Enter password to open PDF' : 'Enter current PDF password'}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {mode === 'protect' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Owner Password (Optional)
                      </label>
                      <input
                        type="password"
                        value={ownerPassword}
                        onChange={(e) => setOwnerPassword(e.target.value)}
                        placeholder="Enter owner password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>

                {/* Protection Options */}
                {mode === 'protect' && (
                  <>
                    {/* Encryption Level */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Encryption Level
                      </label>
                      <select
                        value={encryptionLevel}
                        onChange={(e) => setEncryptionLevel(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="basic">Basic (40-bit RC4)</option>
                        <option value="standard">Standard (128-bit)</option>
                        <option value="high">High (256-bit AES)</option>
                      </select>
                    </div>

                    {/* Permissions */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Document Permissions
                      </label>
                      <div className="grid md:grid-cols-4 gap-4">
                        {[
                          { id: 'print', label: 'Allow Printing' },
                          { id: 'copy', label: 'Allow Copy' },
                          { id: 'modify', label: 'Allow Modify' },
                          { id: 'annotations', label: 'Allow Annotations' }
                        ].map(perm => (
                          <label key={perm.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={permissions.includes(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
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

          {/* Process Button */}
          {files.length > 0 && (
            <div className="text-center mb-8">
              <button
                onClick={processFiles}
                disabled={isProcessing}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 mx-auto animate-pulse hover:animate-none"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>{mode === 'protect' ? 'Lock PDFs' : 'Unlock PDFs'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Inline Progress Section */}
          {isProcessing && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {mode === 'protect' ? 'Protection' : 'Unlock'} Progress
                </h3>
                <span className="text-indigo-600 font-medium">{processProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${processProgress}%` }}
                >
                  <div className="w-full h-full bg-white opacity-30 animate-pulse"></div>
                </div>
              </div>

              {/* Status Message */}
              <p className="text-gray-700 text-center">{processStatus}</p>
            </div>
          )}

          {/* Process Results */}
          {processResults && !isProcessing && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-indigo-800">
                  {mode === 'protect' ? 'Protection' : 'Unlock'} Complete!
                </h3>
                <div className="text-indigo-600 font-bold text-lg">Success</div>
              </div>

              <div className="text-center mb-4">
                <p className="text-gray-700">
                  Your PDF has been {mode === 'protect' ? 'protected with a password' : 'unlocked'} successfully.
                </p>
              </div>

              {downloadUrl && (
                <button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download {mode === 'protect' ? 'Protected' : 'Unlocked'} PDF</span>
                </button>
              )}
            </div>
          )}

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bank-Level Security</h3>
              <p className="text-gray-600">Advanced AES-256 encryption ensures your documents are protected with military-grade security.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🗝️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Permissions</h3>
              <p className="text-gray-600">Set specific permissions for printing, copying, modifying, and annotating your PDF documents.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy First</h3>
              <p className="text-gray-600">All processing happens securely. Files are automatically deleted after processing for complete privacy.</p>
            </div>
          </div>
        </div>

        {/* Progress Popup */}
        <ProgressPopup
          isOpen={showProgressPopup}
          onClose={closeProgressPopup}
          title={`${mode === 'protect' ? 'Protecting' : 'Unlocking'} ${currentFileName}`}
          operationId={currentOperationId}
          checkStatusUrl={(id) => `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/convert/pdf-password/status/${id}`}
          onComplete={() => handleProgressComplete({})}
          onDownload={() => {
            setNotification({
              message: `PDF ${mode === 'protect' ? 'protected' : 'unlocked'} successfully!`,
              type: 'success',
              onClose: () => setNotification(null)
            });
          }}
        />

        {/* Notification */}
        {notification && (
          <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-md animate-slide-in ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                  'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium">{notification.message}</p>
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