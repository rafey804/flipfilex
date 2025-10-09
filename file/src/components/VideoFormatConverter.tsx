'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

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
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  downloadUrl?: string;
  conversionId?: string;
}

interface ConversionConfig {
  title: string;
  description: string;
  metaDescription: string;
  keywords: string;
  urlSlug: string;
  h1Title: string;
  breadcrumbText: string;
}

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

interface VideoFormatConverterProps {
  sourceFormat?: string;
  targetFormat?: string;
}

const Notification = ({ message, type, onClose }: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
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

// Video format options - moved outside component to prevent recreation
const videoFormats = {
  'mp4': { name: 'MP4', color: 'text-blue-600', bgColor: 'bg-blue-50', category: 'Consumer' },
  'mov': { name: 'MOV', color: 'text-purple-600', bgColor: 'bg-purple-50', category: 'Consumer' },
  'wmv': { name: 'WMV', color: 'text-green-600', bgColor: 'bg-green-50', category: 'Consumer' },
  'avi': { name: 'AVI', color: 'text-red-600', bgColor: 'bg-red-50', category: 'Consumer' },
  'mkv': { name: 'MKV', color: 'text-indigo-600', bgColor: 'bg-indigo-50', category: 'Consumer' },
  'flv': { name: 'FLV', color: 'text-yellow-600', bgColor: 'bg-yellow-50', category: 'Consumer' },
  'webm': { name: 'WebM', color: 'text-emerald-600', bgColor: 'bg-emerald-50', category: 'Consumer' },
  'mpeg': { name: 'MPEG-2', color: 'text-gray-600', bgColor: 'bg-gray-50', category: 'Professional' },
  'h264': { name: 'H.264', color: 'text-cyan-600', bgColor: 'bg-cyan-50', category: 'Professional' },
  'h265': { name: 'H.265/HEVC', color: 'text-pink-600', bgColor: 'bg-pink-50', category: 'Professional' }
};

export default function VideoFormatConverter({
  sourceFormat: initialSource,
  targetFormat: initialTarget
}: VideoFormatConverterProps = {}) {
  const router = useRouter();

  // State management - REMOVED quality state as requested
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceFormat, setSourceFormat] = useState(initialSource || 'mp4');
  const [targetFormat, setTargetFormat] = useState(initialTarget || 'mov');
  const [dragActive, setDragActive] = useState(false);
  const [supportedFormats, setSupportedFormats] = useState<any>({ input_formats: [], output_formats: [] });
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({ show: false, message: '', type: 'info' });

  // Define notification functions early
  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({ show: true, message, type });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification({ show: false, message: '', type: 'info' });
  }, []);

  const [conversionStats] = useState({
    totalConverted: 45623,
    successRate: 98.7,
    averageTime: 45
  });

  // Generate SEO configuration
  const generateSEOConfig = useCallback((from: string, to: string): ConversionConfig => {
    const fromFormat = videoFormats[from as keyof typeof videoFormats]?.name || from.toUpperCase();
    const toFormat = videoFormats[to as keyof typeof videoFormats]?.name || to.toUpperCase();

    return {
      title: `Convert ${fromFormat} to ${toFormat} | Free Online Video Converter`,
      description: `Convert ${fromFormat} videos to ${toFormat} format online for free`,
      metaDescription: `Convert ${fromFormat} to ${toFormat} online for free, fast and secure. No software required. Maintain video quality while optimizing file size. Supporting batch conversion.`,
      keywords: `${from} to ${to}, ${fromFormat} to ${toFormat}, convert ${from}, ${to} converter, video converter, online converter, free converter`,
      urlSlug: `${from}-to-${to}`,
      h1Title: `Convert ${fromFormat} to ${toFormat}`,
      breadcrumbText: `${fromFormat} to ${toFormat}`
    };
  }, []); // Empty dependency array since videoFormats is now stable

  const [seoConfig, setSeoConfig] = useState<ConversionConfig>(() => 
    generateSEOConfig(sourceFormat, targetFormat)
  );

  // Update SEO config when formats change
  useEffect(() => {
    const newConfig = generateSEOConfig(sourceFormat, targetFormat);
    setSeoConfig(newConfig);
  }, [sourceFormat, targetFormat, generateSEOConfig]);

  // Update conversion type and URL
  const updateConversionType = useCallback((newFrom: string, newTo: string) => {
    // Prevent same format selection
    if (newFrom === newTo) {
      showNotification('Source and target formats cannot be the same. Please select a different format.', 'warning');
      return;
    }

    const newConfig = generateSEOConfig(newFrom, newTo);
    setSeoConfig(newConfig);

    if (router) {
      const cleanUrl = `/${newFrom}-to-${newTo}`;
      router.push(cleanUrl);
    }

    setFiles([]);
    setSourceFormat(newFrom);
    setTargetFormat(newTo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, generateSEOConfig]);

  // Load supported formats
  useEffect(() => {
    const loadSupportedFormats = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${API_BASE_URL}/convert/supported-video-formats`);
        if (response.ok) {
          const formats = await response.json();
          setSupportedFormats(formats);
          if (!formats.notes?.ffmpeg_available) {
            showNotification('FFmpeg is not available. Please install it for video conversion.', 'warning');
          }
        } else {
          throw new Error('Failed to load supported formats');
        }
      } catch (error) {
        console.error('Failed to load supported formats:', error);
        setSupportedFormats({
          input_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'mpeg', 'h264', 'h265'],
          output_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'mpeg', 'h264', 'h265'],
          quality_options: ['high', 'medium', 'low', 'web']
        });
        showNotification('Failed to load supported formats. Using defaults.', 'warning');
      }
    };

    loadSupportedFormats();
  }, [showNotification]);

  // Enhanced file validation
  const validateVideoFile = useCallback((file: File): string | null => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension) {
      return 'File must have a valid extension';
    }
    
    if (supportedFormats.input_formats && !supportedFormats.input_formats.includes(fileExtension)) {
      return `Unsupported format: ${fileExtension.toUpperCase()}. Supported formats: ${supportedFormats.input_formats.join(', ')}`;
    }
    
    // 5GB limit
    const maxSize = 5 * 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      return `File too large (${formatFileSize(file.size)}). Maximum size is 5GB`;
    }
    
    return null;
  }, [supportedFormats]);

  // Dropzone handlers
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    acceptedFiles.forEach((file) => {
      const error = validateVideoFile(file);
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
        status: 'pending'
      }));

      setFiles(prev => [...prev, ...newFiles]);
      showNotification(`${validFiles.length} video file(s) added successfully`, 'success');
    }
  }, [validateVideoFile, showNotification]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': supportedFormats.input_formats?.map((format: string) => `.${format}`) || []
    },
    maxFiles: 3,
    disabled: isProcessing,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDragOver: () => setDragActive(true),
  });

  // File management
  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    showNotification('File removed', 'info');
  }, [showNotification]);

  const clearFiles = useCallback(() => {
    setFiles([]);
    showNotification('Files cleared', 'info');
  }, [showNotification]);

  // FIXED: Convert files function with hardcoded high quality
  const convertFiles = async () => {
    if (files.length === 0) {
      showNotification('Please select video files to convert', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      for (const fileWithId of files) {
        if (fileWithId.status !== 'pending') continue;

        try {
          setFiles(prev => prev.map(f => 
            f.id === fileWithId.id 
              ? { ...f, status: 'uploading', progress: 0 }
              : f
          ));

          const formData = new FormData();
          formData.append('file', fileWithId.file);
          formData.append('target_format', targetFormat);
          formData.append('quality', 'high'); // HARDCODED to high quality

          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
          
          console.log('Starting conversion request...');
          const response = await fetch(`${API_BASE_URL}/convert/convert-video`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Conversion failed');
          }

          const result = await response.json();
          console.log('Conversion started:', result);
          
          setFiles(prev => prev.map(f => 
            f.id === fileWithId.id 
              ? { ...f, conversionId: result.conversion_id, status: 'processing', progress: 10 }
              : f
          ));

          // Polling for progress
          const pollProgress = async () => {
            let attempts = 0;
            const maxAttempts = 180;
            
            const poll = async () => {
              try {
                attempts++;
                console.log(`Polling attempt ${attempts} for ${result.conversion_id}`);
                
                const progressResponse = await fetch(`${API_BASE_URL}/convert/video-progress/${result.conversion_id}`);
                if (!progressResponse.ok) {
                  throw new Error('Failed to get progress');
                }
                
                const progressData = await progressResponse.json();
                console.log('Progress data:', progressData);
                
                setFiles(prev => prev.map(f => 
                  f.id === fileWithId.id 
                    ? { 
                        ...f, 
                        status: progressData.status as any,
                        progress: progressData.progress || 0,
                        error: progressData.error,
                        downloadUrl: progressData.download_url
                      }
                    : f
                ));

                if (progressData.status === 'completed') {
                  showNotification(`${fileWithId.file.name} converted successfully!`, 'success');
                  return;
                } else if (progressData.status === 'error') {
                  showNotification(`Conversion failed: ${progressData.error || progressData.message}`, 'error');
                  return;
                } else if (attempts >= maxAttempts) {
                  setFiles(prev => prev.map(f => 
                    f.id === fileWithId.id 
                      ? { ...f, status: 'error', error: 'Conversion timed out' }
                      : f
                  ));
                  showNotification('Conversion timed out', 'error');
                  return;
                }
                
                setTimeout(poll, 5000);
                
              } catch (error) {
                console.error('Polling error:', error);
                attempts++;
                if (attempts >= 3) {
                  setFiles(prev => prev.map(f => 
                    f.id === fileWithId.id 
                      ? { ...f, status: 'error', error: 'Lost connection to server' }
                      : f
                  ));
                  showNotification('Lost connection to conversion service', 'error');
                } else {
                  setTimeout(poll, 2000);
                }
              }
            };
            
            setTimeout(poll, 2000);
          };

          await pollProgress();

        } catch (error: any) {
          console.error('Conversion error:', error);
          setFiles(prev => prev.map(f => 
            f.id === fileWithId.id 
              ? { ...f, status: 'error', error: error.message }
              : f
          ));
          showNotification(`Conversion failed: ${error.message}`, 'error');
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // FIXED: Download function - direct link approach
  const handleDownload = useCallback(async (fileWithId: FileWithId) => {
    if (!fileWithId.downloadUrl) {
      showNotification('Download URL not available', 'error');
      return;
    }
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const fullUrl = fileWithId.downloadUrl.startsWith('http') 
        ? fileWithId.downloadUrl 
        : `${API_BASE_URL}${fileWithId.downloadUrl}`;

      console.log('Download URL:', fullUrl);

      // Create and trigger download link
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = `${fileWithId.file.name.split('.')[0]}_converted.${targetFormat}`;
      link.target = '_blank';
      
      // Append to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('Download started', 'success');
    } catch (error: any) {
      console.error('Download error:', error);
      showNotification(`Download failed: ${error.message}`, 'error');
    }
  }, [targetFormat, showNotification]);

  const getFileIcon = () => {
    return (
      <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-200 rounded-xl flex items-center justify-center shadow-md">
        <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <style jsx>{`
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

      {notification.show && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <a href="/" className="text-gray-500 hover:text-red-600 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-900 font-medium">{seoConfig.breadcrumbText}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl text-white text-4xl mb-8 shadow-lg">
            🎬
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-6">
            {seoConfig.h1Title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            {seoConfig.description} with 
            <span className="font-semibold text-red-600"> perfect quality</span> and 
            <span className="font-semibold text-pink-600"> optimized compression</span>
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{conversionStats.totalConverted.toLocaleString()}+</div>
              <div className="text-gray-600 text-sm">Videos Converted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{conversionStats.successRate}%</div>
              <div className="text-gray-600 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{conversionStats.averageTime}s</div>
              <div className="text-gray-600 text-sm">Avg. Speed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">Select Video Formats</h2>
            <p className="text-red-100">Choose your source and target video formats - automatically converts in high quality</p>
          </div>
          
          <div className="p-8">
            {/* REMOVED quality selector as requested - only 2 columns now */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">From Format</label>
                <select
                  value={sourceFormat}
                  onChange={(e) => {
                    const newSource = e.target.value;
                    // If target is same as new source, auto-select first available different format
                    if (newSource === targetFormat) {
                      const availableFormats = Object.keys(videoFormats).filter(key => key !== newSource);
                      const newTarget = availableFormats[0] || 'mp4';
                      updateConversionType(newSource, newTarget);
                    } else {
                      updateConversionType(newSource, targetFormat);
                    }
                  }}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring focus:ring-red-200 text-lg"
                >
                  {Object.entries(videoFormats).map(([key, format]) => (
                    <option key={key} value={key}>{format.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">To Format</label>
                <select
                  value={targetFormat}
                  onChange={(e) => {
                    const newTarget = e.target.value;
                    // If source is same as new target, auto-select first available different format
                    if (newTarget === sourceFormat) {
                      const availableFormats = Object.keys(videoFormats).filter(key => key !== newTarget);
                      const newSource = availableFormats[0] || 'mov';
                      updateConversionType(newSource, newTarget);
                    } else {
                      updateConversionType(sourceFormat, newTarget);
                    }
                  }}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:ring focus:ring-pink-200 text-lg"
                >
                  {Object.entries(videoFormats).filter(([key]) => key !== sourceFormat).map(([key, format]) => (
                    <option key={key} value={key}>{format.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div
              {...getRootProps()}
              className={`
                relative border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer
                transition-all duration-300 ease-in-out group
                ${isDragActive || dragActive
                  ? 'border-red-500 bg-gradient-to-br from-red-50 to-pink-50 scale-[1.02] shadow-2xl' 
                  : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-red-400 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50'
                }
                ${isProcessing ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl'}
              `}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center space-y-6">
                <div className={`
                  w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg
                  transition-all duration-300 group-hover:scale-110
                  ${isDragActive || dragActive 
                    ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 group-hover:from-red-100 group-hover:to-pink-100 group-hover:text-red-600'
                  }
                `}>
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-900 transition-colors">
                    Drop your {videoFormats[sourceFormat as keyof typeof videoFormats]?.name} videos here
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Select {videoFormats[sourceFormat as keyof typeof videoFormats]?.name} videos to convert to {videoFormats[targetFormat as keyof typeof videoFormats]?.name}
                  </p>
                  
                  {isDragActive ? (
                    <div className="space-y-2">
                      <p className="text-red-600 font-semibold text-lg animate-pulse">
                        Drop videos here to upload
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        Drag & drop your videos here, or{' '}
                        <button
                          type="button"
                          className="text-red-600 font-semibold hover:text-red-700 underline decoration-2 underline-offset-2"
                        >
                          browse files
                        </button>
                      </p>
                      <div className="inline-flex items-center space-x-4 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border">
                        <span>{sourceFormat.toUpperCase()}</span>
                        <span className="text-gray-300">•</span>
                        <span>Max 3 files</span>
                        <span className="text-gray-300">•</span>
                        <span>5GB limit</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isProcessing && (
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center rounded-3xl backdrop-blur-sm">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="animate-spin w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-red-600 font-semibold text-lg">Converting Videos...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={convertFiles}
                  disabled={isProcessing || files.some(f => f.status === 'processing' || f.status === 'uploading')}
                  className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Converting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Convert to {videoFormats[targetFormat as keyof typeof videoFormats]?.name} (High Quality)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={clearFiles}
                  disabled={isProcessing}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Files
                </button>
              </div>
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold text-gray-900">
                Selected Files ({files.length})
              </h4>
            </div>
            
            <div className="space-y-4">
              {files.map((fileWithId) => {
                const statusInfo = getStatusInfo(fileWithId);
                
                return (
                  <div
                    key={fileWithId.id}
                    className={`
                      bg-white border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg
                      ${fileWithId.status === 'completed' ? 'border-green-200 bg-green-50' : 
                        fileWithId.status === 'error' ? 'border-red-200 bg-red-50' : 
                        fileWithId.status === 'processing' || fileWithId.status === 'uploading' ? 'border-red-200 bg-red-50' : 
                        'border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        {getFileIcon()}
                        
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

                      <div className="flex items-center space-x-3">
                        {fileWithId.status === 'completed' && (
                          <button 
                            onClick={() => handleDownload(fileWithId)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m1-4H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" />
                            </svg>
                            <span>Download</span>
                          </button>
                        )}

                        {(fileWithId.status === 'pending' || fileWithId.status === 'error') && (
                          <button
                            onClick={() => removeFile(fileWithId.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-3 rounded-xl hover:bg-red-50"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

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
                          />
                        </div>
                      </div>
                    )}

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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">⚡</div>
            <h3 className="font-bold text-lg text-red-600 mb-4">Lightning Fast</h3>
            <p className="text-gray-700 text-sm leading-relaxed">High-quality conversion with optimized processing</p>
          </div>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🎯</div>
            <h3 className="font-bold text-lg text-blue-600 mb-4">Perfect Quality</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Maintain video quality with automatic high-quality settings</p>
          </div>
          
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🔄</div>
            <h3 className="font-bold text-lg text-green-600 mb-4">Multiple Formats</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Support for MP4, MOV, AVI, MKV, WebM, WMV, and more</p>
          </div>
          
          <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🔒</div>
            <h3 className="font-bold text-lg text-pink-600 mb-4">Large File Support</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Support for files up to 5GB with secure processing</p>
          </div>
        </div>
      </div>
    </div>
  );
}