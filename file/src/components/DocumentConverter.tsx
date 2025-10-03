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

interface DocumentConverterProps {
  conversionType?: string;
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

// Document conversion types - moved outside component to prevent recreation
const conversionTypes = {
  'excel_to_pdf': {
    name: 'Excel to PDF',
    inputFormats: ['xlsx', 'xls', 'xlsm'],
    outputFormat: 'pdf',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    icon: '📊',
    description: 'Convert spreadsheets to PDF documents'
  },
  'powerpoint_to_pdf': {
    name: 'PowerPoint to PDF',
    inputFormats: ['pptx', 'ppt', 'pptm'],
    outputFormat: 'pdf',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    icon: '📽️',
    description: 'Convert presentations to PDF documents'
  },
  'text_to_pdf': {
    name: 'Text to PDF',
    inputFormats: ['txt', 'text'],
    outputFormat: 'pdf',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: '📝',
    description: 'Convert text files to PDF documents'
  },
  'html_to_pdf': {
    name: 'HTML to PDF',
    inputFormats: ['html', 'htm'],
    outputFormat: 'pdf',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    icon: '🌐',
    description: 'Convert web pages to PDF documents'
  },
  'csv_to_excel': {
    name: 'CSV to Excel',
    inputFormats: ['csv'],
    outputFormat: 'xlsx',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: '📈',
    description: 'Convert data files to Excel spreadsheets'
  },
  'json_to_csv': {
    name: 'JSON to CSV',
    inputFormats: ['json'],
    outputFormat: 'csv',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    icon: '🔄',
    description: 'Convert JSON data to CSV format'
  }
};

export default function DocumentConverter({
  conversionType: initialConversionType
}: DocumentConverterProps = {}) {
  const router = useRouter();

  // State management
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionType, setConversionType] = useState(() => {
    // Initialize with the prop value, fallback to excel_to_pdf
    return initialConversionType || 'excel_to_pdf';
  });
  const [dragActive, setDragActive] = useState(false);
  const [supportedFormats, setSupportedFormats] = useState<any>({ conversion_types: {} });
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({ show: false, message: '', type: 'info' });

  const [conversionStats] = useState({
    totalConverted: 12847,
    successRate: 99.5,
    averageTime: 25
  });

  // Generate SEO configuration
  const generateSEOConfig = useCallback((type: string): ConversionConfig => {
    const typeInfo = conversionTypes[type as keyof typeof conversionTypes];

    if (!typeInfo) {
      return {
        title: 'Document Converter | Free Online Converter',
        description: 'Convert documents online for free',
        metaDescription: 'Convert documents online for free. Fast, secure, and high-quality conversion with no software required.',
        keywords: 'document converter, online converter, free converter',
        urlSlug: 'document-converter',
        h1Title: 'Document Converter',
        breadcrumbText: 'Document Converter'
      };
    }

    const nameParts = typeInfo.name.split(' to ');
    const fromFormat = nameParts[0] || '';
    const toFormat = nameParts[1] || '';

    return {
      title: `${typeInfo.name} | Free Online Converter`,
      description: `Convert ${fromFormat} to ${toFormat} online for free`,
      metaDescription: `${typeInfo.description}. Fast, secure, and high-quality conversion with no software required.`,
      keywords: `${type.replace(/_/g, ' ')}, ${fromFormat.toLowerCase()}, ${toFormat.toLowerCase()}, document converter, online converter, free converter`,
      urlSlug: type.replace(/_/g, '-'),
      h1Title: typeInfo.name,
      breadcrumbText: typeInfo.name
    };
  }, []); // Empty dependency array since conversionTypes is now stable

  const [seoConfig, setSeoConfig] = useState<ConversionConfig>(() => {
    const initialType = initialConversionType || 'excel_to_pdf';
    return generateSEOConfig(initialType);
  });

  // Update conversion type when prop changes (URL changes)
  useEffect(() => {
    if (initialConversionType && initialConversionType !== conversionType) {
      setConversionType(initialConversionType);
    }
  }, [initialConversionType, conversionType]);

  // Update SEO config when conversion type changes
  useEffect(() => {
    const newConfig = generateSEOConfig(conversionType);
    setSeoConfig(newConfig);
  }, [conversionType]); // Removed generateSEOConfig since it's now stable

  // Handle conversion type change and navigate to new URL
  const handleConversionTypeChange = useCallback((newConversionType: string) => {
    const newUrlSlug = newConversionType.replace(/_/g, '-');
    setConversionType(newConversionType);

    // Navigate to the new URL
    router.push(`/${newUrlSlug}`);
  }, [router]);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({ show: true, message, type });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification({ show: false, message: '', type: 'info' });
    
  }, []);

  // Load supported formats
  useEffect(() => {
    const loadSupportedFormats = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${API_BASE_URL}/convert/supported-document-formats`);
        if (response.ok) {
          const formats = await response.json();
          setSupportedFormats(formats);
        } else {
          throw new Error('Failed to load supported formats');
        }
      } catch (error) {
        console.error('Failed to load supported formats:', error);
        showNotification('Failed to load supported formats. Using defaults.', 'warning');
      }
    };

    loadSupportedFormats();
  }, [showNotification]);

  // Enhanced file validation
  const validateDocumentFile = useCallback((file: File): string | null => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension) {
      return 'File must have a valid extension';
    }
    
    const currentType = conversionTypes[conversionType as keyof typeof conversionTypes];
    if (currentType && !currentType.inputFormats.includes(fileExtension)) {
      return `Unsupported format: ${fileExtension.toUpperCase()}. Supported formats: ${currentType.inputFormats.join(', ')}`;
    }
    
    // 100MB limit for documents
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return `File too large (${formatFileSize(file.size)}). Maximum size is 100MB`;
    }
    
    return null;
  }, [conversionType, conversionTypes]);

  // Dropzone handlers
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    acceptedFiles.forEach((file) => {
      const error = validateDocumentFile(file);
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
      showNotification(`${validFiles.length} document(s) added successfully`, 'success');
    }
  }, [validateDocumentFile, showNotification]);

  const currentType = conversionTypes[conversionType as keyof typeof conversionTypes];
  const acceptedExtensions = currentType ? currentType.inputFormats.map(ext => `.${ext}`) : [];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/*': acceptedExtensions,
      'text/*': acceptedExtensions.includes('.txt') ? ['.txt'] : []
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

  // Convert files function
  const convertFiles = async () => {
    if (files.length === 0) {
      showNotification('Please select document files to convert', 'warning');
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
          formData.append('conversion_type', conversionType);

          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
          
          console.log('Starting document conversion request...');
          const response = await fetch(`${API_BASE_URL}/convert/convert-document`, {
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
            const maxAttempts = 120;
            
            const poll = async () => {
              try {
                attempts++;
                console.log(`Polling attempt ${attempts} for ${result.conversion_id}`);
                
                const progressResponse = await fetch(`${API_BASE_URL}/convert/document-progress/${result.conversion_id}`);
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
                
                setTimeout(poll, 3000);
                
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
            
            setTimeout(poll, 1000);
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

  // Download function
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

      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = `${fileWithId.file.name.split('.')[0]}_converted.${currentType?.outputFormat}`;
      link.target = '_blank';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('Download started', 'success');
    } catch (error: any) {
      console.error('Download error:', error);
      showNotification(`Download failed: ${error.message}`, 'error');
    }
  }, [currentType, showNotification]);

  const getFileIcon = () => {
    return (
      <div className={`w-12 h-12 bg-gradient-to-br from-teal-100 to-amber-200 rounded-xl flex items-center justify-center shadow-md`}>
        <span className="text-2xl">{currentType?.icon || '📄'}</span>
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
          color: 'text-teal-700',
          bgColor: 'bg-teal-100',
          icon: (
            <div className="animate-spin w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full"></div>
          )
        };
      case 'processing':
        return {
          text: `Converting ${fileWithId.progress}%`,
          color: 'text-amber-700',
          bgColor: 'bg-amber-100',
          icon: (
            <div className="animate-pulse w-4 h-4 bg-amber-600 rounded-full"></div>
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
        return 'bg-gradient-to-r from-teal-500 to-cyan-500';
      case 'processing':
        return 'bg-gradient-to-r from-amber-500 to-orange-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50">
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
                <a href="/" className="text-gray-500 hover:text-teal-600 transition-colors">
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-amber-600 rounded-3xl text-white text-4xl mb-8 shadow-lg">
            {currentType?.icon || '📄'}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 to-amber-600 bg-clip-text text-transparent mb-6">
            {seoConfig.h1Title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            {seoConfig.description} with 
            <span className="font-semibold text-teal-600"> professional quality</span> and 
            <span className="font-semibold text-amber-600"> perfect formatting</span>
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">{conversionStats.totalConverted.toLocaleString()}+</div>
              <div className="text-gray-600 text-sm">Documents Converted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{conversionStats.successRate}%</div>
              <div className="text-gray-600 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{conversionStats.averageTime}s</div>
              <div className="text-gray-600 text-sm">Avg. Speed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-teal-500 to-amber-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">Select Conversion Type</h2>
            <p className="text-teal-100">Choose your document conversion type - automatically converts with high quality</p>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Conversion Type</label>
              <select
                value={conversionType}
                onChange={(e) => handleConversionTypeChange(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring focus:ring-teal-200 text-lg"
              >
                {Object.entries(conversionTypes).map(([key, type]) => (
                  <option key={key} value={key}>{type.name}</option>
                ))}
              </select>
            </div>

            <div
              {...getRootProps()}
              className={`
                relative border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer
                transition-all duration-300 ease-in-out group
                ${isDragActive || dragActive
                  ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-amber-50 scale-[1.02] shadow-2xl' 
                  : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-teal-400 hover:bg-gradient-to-br hover:from-teal-50 hover:to-amber-50'
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
                    ? 'bg-gradient-to-br from-teal-500 to-amber-600 text-white' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 group-hover:from-teal-100 group-hover:to-amber-100 group-hover:text-teal-600'
                  }
                `}>
                  <span className="text-4xl">{currentType?.icon || '📄'}</span>
                </div>
                
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-900 transition-colors">
                    Drop your {currentType?.inputFormats.join(', ').toUpperCase()} files here
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {currentType?.description}
                  </p>
                  
                  {isDragActive ? (
                    <div className="space-y-2">
                      <p className="text-teal-600 font-semibold text-lg animate-pulse">
                        Drop files here to upload
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        Drag & drop your files here, or{' '}
                        <button
                          type="button"
                          className="text-teal-600 font-semibold hover:text-teal-700 underline decoration-2 underline-offset-2"
                        >
                          browse files
                        </button>
                      </p>
                      <div className="inline-flex items-center space-x-4 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border">
                        <span>{currentType?.inputFormats.join(', ').toUpperCase()}</span>
                        <span className="text-gray-300">•</span>
                        <span>Max 3 files</span>
                        <span className="text-gray-300">•</span>
                        <span>100MB limit</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isProcessing && (
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center rounded-3xl backdrop-blur-sm">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="animate-spin w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-teal-600 font-semibold text-lg">Converting Document...</p>
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
                  className="bg-gradient-to-r from-teal-600 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-amber-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
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
                      <span>Convert to {currentType?.outputFormat.toUpperCase()} (High Quality)</span>
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
                        fileWithId.status === 'processing' || fileWithId.status === 'uploading' ? 'border-teal-200 bg-teal-50' : 
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
          <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🚀</div>
            <h3 className="font-bold text-lg text-teal-600 mb-4">Ultra Fast</h3>
            <p className="text-gray-700 text-sm leading-relaxed">High-speed document conversion with optimized processing</p>
          </div>
          
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🎯</div>
            <h3 className="font-bold text-lg text-amber-600 mb-4">Perfect Quality</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Maintain document integrity with professional formatting</p>
          </div>
          
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🔄</div>
            <h3 className="font-bold text-lg text-green-600 mb-4">All Formats</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Support for Excel, PowerPoint, Word, HTML, CSV, and JSON</p>
          </div>
          
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🔒</div>
            <h3 className="font-bold text-lg text-indigo-600 mb-4">Secure Processing</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Files processed securely with automatic cleanup</p>
          </div>
        </div>
      </div>
    </div>
  );
}