// components/SEOOptimizedImageConverter.tsx - SYNTAX ERROR FIXED
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { ApiService, formatFileSize, validateFile } from '@/lib/api';

// Types remain the same...
interface FileWithId {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  downloadUrl?: string;
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

interface SEOOptimizedImageConverterProps {
  sourceFormat?: string;
  targetFormat?: string;
}

export default function SEOOptimizedImageConverter({
  sourceFormat: initialSource,
  targetFormat: initialTarget
}: SEOOptimizedImageConverterProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  
  // State management
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceFormat, setSourceFormat] = useState(initialSource || 'avif');
  const [targetFormat, setTargetFormat] = useState(initialTarget || 'png');
  const [dragActive, setDragActive] = useState(false);
  const [supportedFormats, setSupportedFormats] = useState<string[]>([]);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({ show: false, message: '', type: 'info' });
  
  const [conversionStats] = useState({
    totalConverted: 25847,
    successRate: 99.2,
    averageTime: 8
  });

  // CORRECTED: Image format definitions with proper categorization
  const imageFormats = {
    // Standard raster formats (CAN BE INPUT AND OUTPUT)
    'avif': { name: 'AVIF', color: 'text-purple-600', bgColor: 'bg-purple-50', canOutput: true },
    'webp': { name: 'WebP', color: 'text-green-600', bgColor: 'bg-green-50', canOutput: true },
    'png': { name: 'PNG', color: 'text-blue-600', bgColor: 'bg-blue-50', canOutput: true },
    'jpg': { name: 'JPG', color: 'text-red-600', bgColor: 'bg-red-50', canOutput: true },
    'jpeg': { name: 'JPEG', color: 'text-red-600', bgColor: 'bg-red-50', canOutput: true },
    'gif': { name: 'GIF', color: 'text-yellow-600', bgColor: 'bg-yellow-50', canOutput: true },
    'bmp': { name: 'BMP', color: 'text-indigo-600', bgColor: 'bg-indigo-50', canOutput: true },
    'tiff': { name: 'TIFF', color: 'text-gray-600', bgColor: 'bg-gray-50', canOutput: true },
    'ico': { name: 'ICO', color: 'text-cyan-600', bgColor: 'bg-cyan-50', canOutput: true },
    'heic': { name: 'HEIC', color: 'text-pink-600', bgColor: 'bg-pink-50', canOutput: true },
    'pdf': { name: 'PDF', color: 'text-rose-600', bgColor: 'bg-rose-50', canOutput: true },
    'pcx': { name: 'PCX', color: 'text-amber-600', bgColor: 'bg-amber-50', canOutput: true },
    
    // UPDATED: SVG now supports output (embedded raster)
    'svg': { name: 'SVG', color: 'text-emerald-600', bgColor: 'bg-emerald-50', canOutput: true },
    
    // INPUT ONLY formats (cannot be created from raster images)
    'psd': { name: 'PSD', color: 'text-blue-800', bgColor: 'bg-blue-50', canOutput: false },
    'ai': { name: 'AI', color: 'text-orange-600', bgColor: 'bg-orange-50', canOutput: false },
    'eps': { name: 'EPS', color: 'text-purple-800', bgColor: 'bg-purple-50', canOutput: false },
    'cdr': { name: 'CDR', color: 'text-green-800', bgColor: 'bg-green-50', canOutput: false },
    'xcf': { name: 'XCF', color: 'text-gray-800', bgColor: 'bg-gray-50', canOutput: false },
    'gltf': { name: 'GLTF', color: 'text-violet-600', bgColor: 'bg-violet-50', canOutput: false },
    'obj': { name: 'OBJ', color: 'text-slate-600', bgColor: 'bg-slate-50', canOutput: false },
    'fbx': { name: 'FBX', color: 'text-stone-600', bgColor: 'bg-stone-50', canOutput: false },
    'stl': { name: 'STL', color: 'text-zinc-600', bgColor: 'bg-zinc-50', canOutput: false }
  };

  // FIXED: Only include formats that can actually be output
  const outputFormats = Object.fromEntries(
    Object.entries(imageFormats).filter(([key, format]) => format.canOutput)
  );

  // Updated validation function
  const validateConversion = (from: string, to: string): { valid: boolean; error?: string } => {
    const fromFormat = imageFormats[from as keyof typeof imageFormats];
    const toFormat = imageFormats[to as keyof typeof imageFormats];
    
    if (!fromFormat || !toFormat) {
      return { valid: false, error: 'Invalid format selected' };
    }
    
    if (!toFormat.canOutput) {
      return { 
        valid: false, 
        error: `Cannot convert to ${toFormat.name}. This format cannot be created from raster images. Please choose a different output format.` 
      };
    }
    
    // UPDATED: Remove SVG from impossible conversions since we now support it
    if (from === 'svg' && ['ai', 'eps', 'cdr'].includes(to)) {
      return { 
        valid: false, 
        error: 'Vector to vector conversion requires specialized software and is not supported.' 
      };
    }
    
    // UPDATED: Special note for SVG output
    if (to === 'svg' && from !== 'svg') {
      // This is allowed but with a note about the conversion type
      return { valid: true };
    }
    
    return { valid: true };
  };

  // Generate SEO configuration based on conversion type
  const generateSEOConfig = (from: string, to: string): ConversionConfig => {
    const fromFormat = imageFormats[from as keyof typeof imageFormats]?.name || from.toUpperCase();
    const toFormat = imageFormats[to as keyof typeof imageFormats]?.name || to.toUpperCase();
    
    return {
      title: `${fromFormat} to ${toFormat} | Free Online Image Converter`,
      description: `Convert ${fromFormat} images to ${toFormat} format online for free`,
      metaDescription: `Convert ${fromFormat} to ${toFormat} online for free, fast and secure. No software required. Maintain image quality while optimizing file size. Supporting batch conversion.`,
      keywords: `${from} to ${to}, ${fromFormat} to ${toFormat}, convert ${from}, ${to} converter, image converter, online converter, free converter`,
      urlSlug: `${from}-to-${to}`,
      h1Title: `Convert ${fromFormat} to ${toFormat}`,
      breadcrumbText: `${fromFormat} to ${toFormat}`
    };
  };

  const [seoConfig, setSeoConfig] = useState<ConversionConfig>(() => 
    generateSEOConfig('avif', 'png')
  );

  // Update SEO config when formats change
  useEffect(() => {
    const newConfig = generateSEOConfig(sourceFormat, targetFormat);
    setSeoConfig(newConfig);
  }, [sourceFormat, targetFormat]);

  // Updated function to handle clean URL routing with validation
  // Helper function to get alternative format
  const getAlternativeFormat = (currentFormat: string): string => {
    const formatPriority: Record<string, string[]> = {
      'png': ['jpg', 'webp', 'avif'],
      'jpg': ['png', 'webp', 'avif'],
      'jpeg': ['png', 'webp', 'avif'],
      'webp': ['png', 'jpg', 'avif'],
      'avif': ['png', 'webp', 'jpg'],
      'gif': ['png', 'webp', 'jpg'],
      'bmp': ['png', 'jpg', 'webp'],
      'tiff': ['png', 'jpg', 'webp'],
      'ico': ['png', 'jpg', 'webp'],
      'heic': ['jpg', 'png', 'webp'],
      'svg': ['png', 'jpg', 'webp'],
    };

    const alternatives = formatPriority[currentFormat.toLowerCase()] || ['png', 'jpg', 'webp'];

    // Return first available alternative
    for (const alt of alternatives) {
      if (outputFormats[alt]) {
        return alt;
      }
    }

    // Fallback to first available output format
    return Object.keys(outputFormats)[0] || 'png';
  };

  const updateConversionType = (newFrom: string, newTo: string) => {
    // Auto-change output if same as input
    let finalTo = newTo;
    if (newFrom.toLowerCase() === newTo.toLowerCase()) {
      finalTo = getAlternativeFormat(newFrom);
      showNotification(`Output format automatically changed to ${finalTo.toUpperCase()} (same format selected)`, 'info');
    }

    // Validate conversion before updating
    const validation = validateConversion(newFrom, finalTo);
    if (!validation.valid) {
      showNotification(validation.error || 'Invalid conversion', 'error');
      return;
    }

    const newConfig = generateSEOConfig(newFrom, finalTo);
    setSeoConfig(newConfig);

    const cleanUrl = `/${newFrom}-to-${finalTo}`;
    router.push(cleanUrl);

    setFiles([]);
    setSourceFormat(newFrom);
    setTargetFormat(finalTo);
  };

  // Update page title dynamically
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = seoConfig.title;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', seoConfig.metaDescription);
      } else {
        const newMetaDesc = document.createElement('meta');
        newMetaDesc.name = 'description';
        newMetaDesc.content = seoConfig.metaDescription;
        document.head.appendChild(newMetaDesc);
      }
      
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', seoConfig.keywords);
      } else {
        const newMetaKeywords = document.createElement('meta');
        newMetaKeywords.name = 'keywords';
        newMetaKeywords.content = seoConfig.keywords;
        document.head.appendChild(newMetaKeywords);
      }
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', seoConfig.title);
      }
      
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', seoConfig.metaDescription);
      }
    }
  }, [seoConfig]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({ show: true, message, type });
  };

  useEffect(() => {
    const loadSupportedFormats = async () => {
      try {
        const formats = await ApiService.getSupportedImageFormats();
        setSupportedFormats(formats.input_formats);
      } catch (error) {
        console.error('Failed to load supported formats:', error);
        setSupportedFormats(['avif', 'webp', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff']);
      }
    };

    loadSupportedFormats();
  }, []);

  const acceptedTypes = [sourceFormat];

  const onDrop = (acceptedFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    acceptedFiles.forEach((file) => {
      const error = validateFile(file, acceptedTypes);
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

      setFiles(prev => [...prev, ...newFiles]);
      showNotification(`${validFiles.length} file(s) added successfully`, 'success');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [`.${sourceFormat}`, '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff', '.avif', '.heic', '.svg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 5,
    disabled: isProcessing,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDragOver: () => setDragActive(true),
  });

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    showNotification('File removed', 'info');
  };

  const convertFiles = async () => {
    if (files.length === 0) {
      showNotification('Please select image files to convert', 'warning');
      return;
    }

    // Final validation before conversion
    const validation = validateConversion(sourceFormat, targetFormat);
    if (!validation.valid) {
      showNotification(validation.error || 'Invalid conversion', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      for (const fileWithId of files) {
        try {
          setFiles(prev => prev.map(f => 
            f.id === fileWithId.id 
              ? { ...f, status: 'uploading' as const, progress: 0 }
              : f
          ));

          const updateProgress = (progress: any) => {
            setFiles(prev => prev.map(f => 
              f.id === fileWithId.id 
                ? { ...f, progress: progress.percentage, status: 'processing' as const }
                : f
            ));
          };

          const result = await ApiService.convertImage(
            fileWithId.file,
            targetFormat,
            updateProgress
          );

          setFiles(prev => prev.map(f => 
            f.id === fileWithId.id 
              ? { 
                  ...f, 
                  status: 'completed' as const, 
                  progress: 100,
                  downloadUrl: ApiService.getDownloadUrl(result.filename)
                }
              : f
          ));

          showNotification(`${fileWithId.file.name} converted successfully!`, 'success');

        } catch (error: any) {
          setFiles(prev => prev.map(f => 
            f.id === fileWithId.id 
              ? { 
                  ...f, 
                  status: 'error' as const, 
                  error: error.message || 'Conversion failed'
                }
              : f
          ));
          showNotification(`Conversion failed: ${error.message}`, 'error');
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    showNotification('Files cleared', 'info');
  };

  const handleDownload = async (fileWithId: FileWithId) => {
    if (!fileWithId.downloadUrl) return;
    
    try {
      const link = document.createElement('a');
      link.href = fileWithId.downloadUrl;
      link.download = `${fileWithId.file.name.split('.')[0]}.${targetFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('Download started', 'success');
    } catch (error) {
      showNotification('Download failed', 'error');
    }
  };

  const getFileIcon = (fileName: string) => {
    return (
      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-md">
        <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
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
          onClose={() => setNotification({ show: false, message: '', type: 'info' })}
        />
      )}

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <a href="/" className="text-gray-500 hover:text-purple-600 transition-colors">
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl text-white text-4xl mb-8 shadow-lg">
            🖼️
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            {seoConfig.h1Title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            {seoConfig.description} with 
            <span className="font-semibold text-purple-600"> perfect quality</span> and 
            <span className="font-semibold text-indigo-600"> optimized compression</span>
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{conversionStats.totalConverted.toLocaleString()}+</div>
              <div className="text-gray-600 text-sm">Images Converted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{conversionStats.successRate}%</div>
              <div className="text-gray-600 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{conversionStats.averageTime}s</div>
              <div className="text-gray-600 text-sm">Avg. Speed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">Select Conversion Formats</h2>
            <p className="text-purple-100">Choose your source and target image formats</p>
          </div>
          
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">From Format</label>
                <select 
                  value={sourceFormat} 
                  onChange={(e) => updateConversionType(e.target.value, targetFormat)}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring focus:ring-purple-200 text-lg"
                >
                  {Object.entries(imageFormats).map(([key, format]) => (
                    <option key={key} value={key}>{format.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">To Format</label>
                <select 
                  value={targetFormat} 
                  onChange={(e) => updateConversionType(sourceFormat, e.target.value)}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring focus:ring-indigo-200 text-lg"
                >
                  {Object.entries(outputFormats).filter(([key]) => key !== sourceFormat).map(([key, format]) => (
                    <option key={key} value={key}>{format.name}</option>
                  ))}
                </select>
                
                {/* ADDED: Warning for impossible conversions */}
                {!imageFormats[targetFormat as keyof typeof imageFormats]?.canOutput && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Cannot convert raster images to {imageFormats[targetFormat as keyof typeof imageFormats]?.name}. 
                      This format requires vector data or specialized software.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Special note for SVG output */}
            {targetFormat === 'svg' && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <strong>SVG Output Note:</strong> The converted SVG will embed your raster image as base64 data. 
                  This creates a valid SVG file but is not true vector conversion.
                </p>
              </div>
            )}

            {/* File Upload Area */}
            <div
              {...getRootProps()}
              className={`
                relative border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer
                transition-all duration-300 ease-in-out group
                ${isDragActive || dragActive
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 scale-[1.02] shadow-2xl' 
                  : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50'
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
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 group-hover:from-purple-100 group-hover:to-indigo-100 group-hover:text-purple-600'
                  }
                `}>
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-900 transition-colors">
                    Drop your {imageFormats[sourceFormat as keyof typeof imageFormats]?.name} images here
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Select {imageFormats[sourceFormat as keyof typeof imageFormats]?.name} images to convert to {imageFormats[targetFormat as keyof typeof imageFormats]?.name}
                  </p>
                  
                  {isDragActive ? (
                    <div className="space-y-2">
                      <p className="text-purple-600 font-semibold text-lg animate-pulse">
                        Drop images here to upload
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        Drag & drop your images here, or{' '}
                        <button
                          type="button"
                          className="text-purple-600 font-semibold hover:text-purple-700 underline decoration-2 underline-offset-2"
                        >
                          browse files
                        </button>
                      </p>
                      <div className="inline-flex items-center space-x-4 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border">
                        <span>{sourceFormat.toUpperCase()}</span>
                        <span className="text-gray-300">•</span>
                        <span>Max 5 files</span>
                        <span className="text-gray-300">•</span>
                        <span>50MB limit</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isProcessing && (
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center rounded-3xl backdrop-blur-sm">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="animate-spin w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-purple-600 font-semibold text-lg">Converting Images...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {files.length > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={convertFiles}
                  disabled={isProcessing || files.some(f => f.status === 'processing') || !validateConversion(sourceFormat, targetFormat).valid}
                  className={`
                    bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg
                    hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300
                    shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    flex items-center justify-center space-x-3
                  `}
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
                      <span>Convert to {imageFormats[targetFormat as keyof typeof imageFormats]?.name}</span>
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

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold text-gray-900">
                Selected Files ({files.length})
              </h4>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {files.map((fileWithId) => {
                const statusInfo = getStatusInfo(fileWithId);
                
                return (
                  <div
                    key={fileWithId.id}
                    className={`
                      bg-white border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg
                      ${fileWithId.status === 'completed' ? 'border-green-200 bg-green-50' : 
                        fileWithId.status === 'error' ? 'border-red-200 bg-red-50' : 
                        fileWithId.status === 'processing' || fileWithId.status === 'uploading' ? 'border-purple-200 bg-purple-50' : 
                        'border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    <div className="flex items-center justify-between">
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
                          />
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

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">⚡</div>
            <h3 className="font-bold text-lg text-purple-600 mb-4">Lightning Fast</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Convert images in seconds with optimized processing</p>
          </div>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🎯</div>
            <h3 className="font-bold text-lg text-blue-600 mb-4">Perfect Quality</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Maintain image quality while optimizing file size</p>
          </div>
          
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🔄</div>
            <h3 className="font-bold text-lg text-green-600 mb-4">Multiple Formats</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Support for AVIF, WebP, PNG, JPG, GIF, BMP, TIFF, SVG</p>
          </div>
          
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🔒</div>
            <h3 className="font-bold text-lg text-indigo-600 mb-4">Secure & Private</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Files processed securely and deleted after 1 hour</p>
          </div>
        </div>

        {/* Format Comparison */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Supported Image Formats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(imageFormats).map(([key, format]) => (
              <div key={key} className={`${format.bgColor} border-2 border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 relative`}>
                <div className={`text-xl font-bold ${format.color} mb-2`}>{format.name}</div>
                <div className="text-xs text-gray-500 uppercase">.{key}</div>
                {!format.canOutput && (
                  <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded">
                    INPUT ONLY
                  </div>
                )}
                {key === 'svg' && format.canOutput && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">
                    EMBEDDED
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Formats marked as "INPUT ONLY" can be read but cannot be created from raster images. 
              SVG output embeds the raster image as base64 data - this is not true vector conversion but allows SVG format output.
              True raster-to-vector conversion requires specialized tracing software.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}