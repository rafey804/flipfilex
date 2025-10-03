'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';


import { DropzoneProps, FileWithId } from '@/types';
import { validateFile, formatFileSize } from '@/lib/api';

interface FileUploadProps extends DropzoneProps {
  onFilesChange: (files: FileWithId[]) => void;
  selectedFiles: FileWithId[];
}

export default function FileUpload({
  acceptedFileTypes,
  maxFiles,
  onFilesSelected,
  onFilesChange,
  selectedFiles,
  isProcessing = false,
  title,
  description
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadAnimation, setUploadAnimation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadAnimation(true);

    const validFiles: File[] = [];
    const errors: string[] = [];

    acceptedFiles.forEach((file) => {
      const error = validateFile(file, acceptedFileTypes);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      showNotification(errors.join('\n'), 'error');
    }

    if (validFiles.length > 0) {
      const newFiles: FileWithId[] = validFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: 'pending' as const
      }));

      const totalFiles = [...selectedFiles, ...newFiles];
      if (totalFiles.length > maxFiles) {
        showNotification(`Maximum ${maxFiles} files allowed`, 'warning');
        return;
      }

      onFilesChange([...selectedFiles, ...newFiles]);
      onFilesSelected(validFiles);
      
      // Success feedback
      showNotification(`${validFiles.length} file(s) added successfully`, 'success');
    }

    setTimeout(() => setUploadAnimation(false), 1000);
  }, [acceptedFileTypes, maxFiles, onFilesSelected, onFilesChange, selectedFiles]);

  // Enhanced notification system
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    // This would integrate with your notification system (e.g., react-hot-toast)
    console.log(`${type}: ${message}`);
  };

  // UPDATED: Create accept object with proper typing including PNG support
  const acceptConfig: Record<string, string[]> = {};
  
  if (acceptedFileTypes.includes('pdf')) {
    acceptConfig['application/pdf'] = ['.pdf'];
  }
  
  if (acceptedFileTypes.includes('docx')) {
    acceptConfig['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = ['.docx'];
  }
  
  if (acceptedFileTypes.includes('doc')) {
    acceptConfig['application/msword'] = ['.doc'];
  }

  // NEW: Add PNG support
  if (acceptedFileTypes.includes('png')) {
    acceptConfig['image/png'] = ['.png'];
  }
  // NEW: Add WAV support
if (acceptedFileTypes.includes('wav')) {
  acceptConfig['audio/wav'] = ['.wav'];
}

const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptConfig,
    maxFiles,
    disabled: isProcessing,
    multiple: maxFiles > 1,
    noClick: false,
    noKeyboard: false,
    preventDropOnDocument: true,
  });


  const removeFile = (fileId: string) => {
    const updatedFiles = selectedFiles.filter(f => f.id !== fileId);
    onFilesChange(updatedFiles);
    showNotification('File removed', 'info');
  };

  const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case 'docx':
    case 'doc':
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case 'png':
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case 'wav':
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        </div>
      );
  }
};

  const getStatusInfo = (fileWithId: FileWithId) => {
    switch (fileWithId.status) {
      case 'pending':
        return {
          text: 'Ready to convert',
          color: 'text-gray-700',
          bgColor: 'bg-gray-100',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'uploading':
        return {
          text: `Uploading ${fileWithId.progress}%`,
          color: 'text-blue-700',
          bgColor: 'bg-blue-100',
          icon: (
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          )
        };
      case 'processing':
        return {
          text: `Converting ${fileWithId.progress}%`,
          color: 'text-purple-700',
          bgColor: 'bg-purple-100',
          icon: (
            <div className="animate-pulse w-4 h-4 bg-purple-600 rounded-full"></div>
          )
        };
      case 'completed':
        return {
          text: 'Completed',
          color: 'text-green-700',
          bgColor: 'bg-green-100',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'error':
        return {
          text: 'Failed',
          color: 'text-red-700',
          bgColor: 'bg-red-100',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      default:
        return {
          text: 'Ready',
          color: 'text-gray-700',
          bgColor: 'bg-gray-100',
          icon: null
        };
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'uploading':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'processing':
        return 'bg-gradient-to-r from-purple-500 to-indigo-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Enhanced Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-in-out group
          ${isDragActive || dragActive
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-[1.02] shadow-2xl' 
            : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50'
          }
          ${isProcessing ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl'}
          ${uploadAnimation ? 'animate-pulse' : ''}
        `}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center space-y-6">
          {/* Upload Icon */}
          <div className={`
            w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg
            transition-all duration-300 group-hover:scale-110
            ${isDragActive || dragActive 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 group-hover:from-blue-100 group-hover:to-purple-100 group-hover:text-blue-600'
            }
          `}>
            {uploadAnimation ? (
              <div className="animate-bounce">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>
          
          {/* Upload Text */}
          <div className="text-center max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
              {title}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {description}
            </p>
            
            {isDragActive ? (
              <div className="space-y-2">
                <p className="text-blue-600 font-semibold text-lg animate-pulse">
                  Drop files here to upload
                </p>
                <div className="flex justify-center">
                  <div className="w-8 h-1 bg-blue-500 rounded animate-pulse"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600">
                  Drag & drop your files here, or{' '}
                  <button
                    type="button"
                    className="text-blue-600 font-semibold hover:text-blue-700 underline decoration-2 underline-offset-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse files
                  </button>
                </p>
                <div className="inline-flex items-center space-x-4 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border">
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span>{acceptedFileTypes.join(', ').toUpperCase()}</span>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span>Max {maxFiles} file{maxFiles > 1 ? 's' : ''}</span>
                  <span className="text-gray-300">•</span>
                  <span>100MB limit</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/95 flex items-center justify-center rounded-3xl backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
                <div className="absolute inset-0 animate-ping w-12 h-12 border-4 border-blue-400 rounded-full opacity-20"></div>
              </div>
              <div className="text-center">
                <p className="text-blue-600 font-semibold text-lg">Processing Files...</p>
                <p className="text-gray-500 text-sm">Please wait while we convert your documents</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-bold text-gray-900">
              Selected Files ({selectedFiles.length})
            </h4>
            {selectedFiles.some(f => f.status === 'completed') && (
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m1-4H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" />
                </svg>
                <span>Download All</span>
              </button>
            )}
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {selectedFiles.map((fileWithId) => {
              const statusInfo = getStatusInfo(fileWithId);
              
              return (
                <div
                  key={fileWithId.id}
                  className={`
                    bg-white border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg
                    ${fileWithId.status === 'completed' ? 'border-green-200 bg-green-50' : 
                      fileWithId.status === 'error' ? 'border-red-200 bg-red-50' : 
                      fileWithId.status === 'processing' || fileWithId.status === 'uploading' ? 'border-blue-200 bg-blue-50' : 
                      'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  {/* Mobile Layout */}
                  <div className="block lg:hidden">
                    {/* File Info */}
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base break-all">
                          {fileWithId.file.name}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatFileSize(fileWithId.file.size)}
                          </p>
                          <div className={`inline-flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
                            {statusInfo.icon}
                            <span>{statusInfo.text}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Mobile */}
                    <div className="flex flex-col space-y-2">
                      {/* Download Button */}
                      {fileWithId.status === 'completed' && fileWithId.downloadUrl && (
                        <a
                          href={fileWithId.downloadUrl}
                          download
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m1-4H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" />
                          </svg>
                          <span>Download</span>
                        </a>
                      )}

                      {/* Retry Button */}
                      {fileWithId.status === 'error' && (
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Retry</span>
                        </button>
                      )}

                      {/* Remove Button */}
                      {(fileWithId.status === 'pending' || fileWithId.status === 'error') && (
                        <button
                          onClick={() => removeFile(fileWithId.id)}
                          className="self-end bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 p-2 rounded-lg transition-colors"
                          title="Remove file"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:flex items-center justify-between">
                    {/* File Info */}
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      {getFileIcon(fileWithId.file.name)}
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate text-lg">
                          {fileWithId.file.name}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {formatFileSize(fileWithId.file.size)}
                          </p>
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
                            {statusInfo.icon}
                            <span>{statusInfo.text}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Desktop */}
                    <div className="flex items-center space-x-3">
                      {/* Download Button */}
                      {fileWithId.status === 'completed' && fileWithId.downloadUrl && (
                        <a
                          href={fileWithId.downloadUrl}
                          download
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m1-4H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" />
                          </svg>
                          <span>Download</span>
                        </a>
                      )}

                      {/* Retry Button */}
                      {fileWithId.status === 'error' && (
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Retry</span>
                        </button>
                      )}

                      {/* Remove Button */}
                      {(fileWithId.status === 'pending' || fileWithId.status === 'error') && (
                        <button
                          onClick={() => removeFile(fileWithId.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-3 rounded-xl hover:bg-red-50"
                          title="Remove file"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(fileWithId.status === 'uploading' || 
                    fileWithId.status === 'processing' || 
                    fileWithId.status === 'completed') && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {fileWithId.status === 'uploading' ? 'Uploading...' : 
                           fileWithId.status === 'processing' ? 'Converting...' : 'Complete'}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {fileWithId.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressBarColor(fileWithId.status)}`}
                          style={{ width: `${fileWithId.progress}%` }}
                        >
                          <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {fileWithId.error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-red-800">Conversion Error</p>
                          <p className="text-sm text-red-700 mt-1">{fileWithId.error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      {selectedFiles.length === 0 && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Quick Tips for Best Results
          </h4>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">•</span>
              <span>Use high-quality images for better conversion results</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">•</span>
              <span>PNG files will be converted to WebP format for better compression</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">•</span>
              <span>Files are automatically deleted after 1 hour for your privacy</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}