'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
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

interface FontFormatConverterProps {
  sourceFormat?: string;
  targetFormat?: string;
}

const Notification = ({ message, type, onClose }: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }[type];

  return (
    <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg border ${bgColor} shadow-lg max-w-md`}>
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Helper functions for SEO content
const getSourceFormatDescription = (format?: string) => {
  const descriptions = {
    'ttf': 'TrueType Font (TTF) is a standard font format developed by Apple and Microsoft, offering excellent cross-platform compatibility and precise character rendering for both desktop and web applications.',
    'otf': 'OpenType Font (OTF) is an advanced font format that supports complex typography features, extensive character sets, and cross-platform compatibility, making it ideal for professional design work.',
    'woff': 'Web Open Font Format (WOFF) is a compressed font format specifically designed for web use, providing faster loading times while maintaining font quality and supporting all modern browsers.',
    'woff2': 'WOFF2 is the latest web font format offering superior compression compared to WOFF, resulting in faster website loading times and better performance for web typography.',
    'eot': 'Embedded OpenType (EOT) is a legacy font format developed by Microsoft for Internet Explorer, providing basic web font support but largely superseded by modern formats.',
    'svg': 'SVG Font format stores font data as vector graphics, allowing for creative effects and animations but with limited browser support and larger file sizes compared to other formats.',
    'ps1': 'PostScript Type 1 fonts are a professional font format widely used in printing and publishing, offering high-quality output and extensive character sets for professional typography.'
  };
  return descriptions[format as keyof typeof descriptions] || 'A professional font format with specific use cases and compatibility requirements.';
};

const getTargetFormatDescription = (format?: string) => {
  const descriptions = {
    'ttf': 'TrueType Font format provides universal compatibility across all operating systems and applications, making it the ideal choice for desktop publishing, software applications, and general typography needs.',
    'otf': 'OpenType Font format offers advanced typography features including ligatures, alternate characters, and extensive language support, perfect for professional design, branding, and high-quality publications.',
    'woff': 'WOFF format is optimized for web delivery with built-in compression, faster loading times, and broad browser support, making it excellent for website typography and web applications.',
    'woff2': 'WOFF2 provides the best compression and fastest loading for web fonts, offering superior performance for modern websites while maintaining perfect font quality and extensive browser support.',
    'eot': 'EOT format provides compatibility with older Internet Explorer versions, though it\'s largely been replaced by more modern and efficient web font formats.',
    'svg': 'SVG Font format enables vector-based typography with animation possibilities, though it\'s primarily used for special effects rather than general text display.',
    'ps1': 'PostScript Type 1 format delivers professional-grade typography with precise character rendering, ideal for high-quality printing, professional publishing, and design applications.'
  };
  return descriptions[format as keyof typeof descriptions] || 'A specialized font format optimized for specific use cases and platform requirements.';
};

const getSourceFormatFeatures = (format?: string) => {
  const features = {
    'ttf': ['Cross-platform', 'Desktop optimized', 'Universal support', 'Standard format'],
    'otf': ['Advanced typography', 'OpenType features', 'Professional grade', 'Extensive character sets'],
    'woff': ['Web optimized', 'Compressed', 'Browser compatible', 'Fast loading'],
    'woff2': ['Superior compression', 'Modern web', 'Best performance', 'Latest standard'],
    'eot': ['IE compatible', 'Legacy support', 'Microsoft format', 'Basic compression'],
    'svg': ['Vector based', 'Scalable', 'Animation support', 'Creative effects'],
    'ps1': ['Professional printing', 'High quality', 'Industry standard', 'Precise rendering']
  };
  return features[format as keyof typeof features] || ['Standard format', 'Cross-platform', 'General use'];
};

const getTargetFormatFeatures = (format?: string) => {
  const features = {
    'ttf': ['Universal compatibility', 'Desktop applications', 'Standard support', 'Reliable rendering'],
    'otf': ['Advanced features', 'Professional quality', 'Rich typography', 'Extensive support'],
    'woff': ['Web delivery', 'Optimized size', 'Fast loading', 'Browser support'],
    'woff2': ['Best compression', 'Fastest loading', 'Modern standard', 'Superior performance'],
    'eot': ['Legacy compatibility', 'IE support', 'Basic web fonts', 'Microsoft standard'],
    'svg': ['Vector graphics', 'Scalable design', 'Animation ready', 'Creative potential'],
    'ps1': ['Print quality', 'Professional output', 'Precise control', 'Industry standard']
  };
  return features[format as keyof typeof features] || ['Specialized format', 'Optimized output', 'Platform specific'];
};

const getConversionBenefits = (sourceFormat?: string, targetFormat?: string) => {
  const benefits = [
    {
      icon: '🚀',
      title: 'Improved Performance',
      description: `Converting to ${targetFormat?.toUpperCase()} optimizes your font for its intended use case, improving loading times and rendering performance.`
    },
    {
      icon: '🌐',
      title: 'Better Compatibility',
      description: `${targetFormat?.toUpperCase()} format ensures broader compatibility across different platforms, browsers, and applications.`
    },
    {
      icon: '📦',
      title: 'Optimized File Size',
      description: 'Advanced compression reduces file size while maintaining perfect font quality, saving bandwidth and storage space.'
    },
    {
      icon: '✨',
      title: 'Enhanced Features',
      description: `Access additional typography features and capabilities available in ${targetFormat?.toUpperCase()} format.`
    },
    {
      icon: '🔧',
      title: 'Professional Quality',
      description: 'Maintain all font characteristics including kerning, ligatures, and special characters during conversion.'
    },
    {
      icon: '⚡',
      title: 'Future-Ready',
      description: `${targetFormat?.toUpperCase()} format ensures your fonts work with current and future technologies and standards.`
    }
  ];
  return benefits;
};

const getUseCases = (format?: string) => {
  const useCases = {
    'ttf': [
      { icon: '💻', title: 'Desktop Applications', description: 'Perfect for software interfaces, desktop publishing, and system fonts.' },
      { icon: '📄', title: 'Document Creation', description: 'Ideal for word processors, presentations, and PDF documents.' },
      { icon: '🎨', title: 'Design Software', description: 'Compatible with all major design and graphics applications.' }
    ],
    'otf': [
      { icon: '📚', title: 'Professional Publishing', description: 'Advanced features for books, magazines, and high-end publications.' },
      { icon: '🏢', title: 'Corporate Branding', description: 'Extensive character sets for global brand consistency.' },
      { icon: '🎭', title: 'Creative Design', description: 'Access to ligatures, alternates, and stylistic sets.' }
    ],
    'woff': [
      { icon: '🌐', title: 'Website Typography', description: 'Optimized web fonts for better loading performance.' },
      { icon: '📱', title: 'Web Applications', description: 'Consistent typography across web platforms and devices.' },
      { icon: '🔍', title: 'SEO-Friendly', description: 'Fast loading fonts improve website performance and SEO rankings.' }
    ],
    'woff2': [
      { icon: '⚡', title: 'High-Performance Websites', description: 'Superior compression for fastest possible loading times.' },
      { icon: '🚀', title: 'Modern Web Apps', description: 'Latest standard for progressive web applications.' },
      { icon: '📊', title: 'Analytics-Driven Sites', description: 'Improved Core Web Vitals and performance metrics.' }
    ],
    'eot': [
      { icon: '🔧', title: 'Legacy Support', description: 'Compatibility with older Internet Explorer versions.' },
      { icon: '🏛️', title: 'Enterprise Systems', description: 'Support for legacy corporate web applications.' },
      { icon: '🔄', title: 'Migration Projects', description: 'Transitional format during font modernization.' }
    ],
    'svg': [
      { icon: '🎨', title: 'Creative Projects', description: 'Vector-based fonts for artistic and creative applications.' },
      { icon: '🎯', title: 'Interactive Design', description: 'Fonts with animation and interactive capabilities.' },
      { icon: '🎪', title: 'Special Effects', description: 'Unique typography effects and visual treatments.' }
    ],
    'ps1': [
      { icon: '🖨️', title: 'Professional Printing', description: 'High-quality output for commercial printing and publishing.' },
      { icon: '📖', title: 'Book Publishing', description: 'Industry standard for professional book and magazine production.' },
      { icon: '🎓', title: 'Academic Publications', description: 'Precise typography for research papers and academic materials.' }
    ]
  };
  return useCases[format as keyof typeof useCases] || [
    { icon: '💼', title: 'Professional Use', description: 'Suitable for various professional applications and projects.' },
    { icon: '🔧', title: 'Technical Applications', description: 'Optimized for specific technical requirements and platforms.' }
  ];
};

const getBrowserSupport = (format?: string) => {
  const support = {
    'ttf': 'TTF fonts are supported by all modern browsers including Chrome, Firefox, Safari, and Edge, as well as older browsers like Internet Explorer 9+.',
    'otf': 'OTF fonts have excellent support in all modern browsers (Chrome, Firefox, Safari, Edge) and partial support in Internet Explorer 9+.',
    'woff': 'WOFF format is supported by all modern browsers including Chrome 5+, Firefox 3.6+, Safari 5.1+, and Internet Explorer 9+.',
    'woff2': 'WOFF2 is supported by all modern browsers: Chrome 36+, Firefox 39+, Safari 10+, and Edge 14+. Not supported in Internet Explorer.',
    'eot': 'EOT format is primarily supported by Internet Explorer versions 6-11. Not supported by modern browsers like Chrome, Firefox, or Safari.',
    'svg': 'SVG fonts have limited support: Safari (desktop and mobile), Chrome 4-37 (deprecated), and partial support in older browsers.',
    'ps1': 'PostScript Type 1 fonts require specific plugins or converters for web use. Better suited for desktop applications and printing.'
  };
  return support[format as keyof typeof support] || 'Browser support varies depending on the specific font format and implementation.';
};

const getTechnicalDetails = (format?: string) => {
  const details = {
    'ttf': [
      { label: 'File Extension', value: '.ttf' },
      { label: 'MIME Type', value: 'font/ttf' },
      { label: 'Compression', value: 'None (uncompressed)' },
      { label: 'Platform Support', value: 'Universal' },
      { label: 'OpenType Features', value: 'Basic support' },
      { label: 'Typical File Size', value: '50-200KB per font' }
    ],
    'otf': [
      { label: 'File Extension', value: '.otf' },
      { label: 'MIME Type', value: 'font/otf' },
      { label: 'Compression', value: 'None (uncompressed)' },
      { label: 'Platform Support', value: 'Universal' },
      { label: 'OpenType Features', value: 'Full support' },
      { label: 'Typical File Size', value: '60-300KB per font' }
    ],
    'woff': [
      { label: 'File Extension', value: '.woff' },
      { label: 'MIME Type', value: 'font/woff' },
      { label: 'Compression', value: 'Zlib compression' },
      { label: 'Platform Support', value: 'Web browsers' },
      { label: 'OpenType Features', value: 'Full support' },
      { label: 'Typical File Size', value: '30-150KB per font' }
    ],
    'woff2': [
      { label: 'File Extension', value: '.woff2' },
      { label: 'MIME Type', value: 'font/woff2' },
      { label: 'Compression', value: 'Brotli compression' },
      { label: 'Platform Support', value: 'Modern browsers' },
      { label: 'OpenType Features', value: 'Full support' },
      { label: 'Typical File Size', value: '20-100KB per font' }
    ],
    'eot': [
      { label: 'File Extension', value: '.eot' },
      { label: 'MIME Type', value: 'application/vnd.ms-fontobject' },
      { label: 'Compression', value: 'Basic compression' },
      { label: 'Platform Support', value: 'Internet Explorer' },
      { label: 'OpenType Features', value: 'Limited support' },
      { label: 'Typical File Size', value: '40-180KB per font' }
    ],
    'svg': [
      { label: 'File Extension', value: '.svg' },
      { label: 'MIME Type', value: 'image/svg+xml' },
      { label: 'Compression', value: 'Text-based (gzip)' },
      { label: 'Platform Support', value: 'Limited browsers' },
      { label: 'OpenType Features', value: 'Not applicable' },
      { label: 'Typical File Size', value: '100-500KB per font' }
    ],
    'ps1': [
      { label: 'File Extension', value: '.ps1, .pfa, .pfb' },
      { label: 'MIME Type', value: 'application/postscript' },
      { label: 'Compression', value: 'Binary or ASCII' },
      { label: 'Platform Support', value: 'Desktop applications' },
      { label: 'OpenType Features', value: 'Limited support' },
      { label: 'Typical File Size', value: '40-200KB per font' }
    ]
  };
  return details[format as keyof typeof details] || [
    { label: 'File Extension', value: 'Various' },
    { label: 'Platform Support', value: 'Depends on format' }
  ];
};

export default function FontFormatConverter({ sourceFormat, targetFormat }: FontFormatConverterProps) {
  const router = useRouter();
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  // Font format mappings
  const fontFormats = {
    'ttf': { name: 'TTF', fullName: 'TrueType Font', mimeType: 'font/ttf', color: 'from-blue-500 to-blue-600' },
    'otf': { name: 'OTF', fullName: 'OpenType Font', mimeType: 'font/otf', color: 'from-green-500 to-green-600' },
    'woff': { name: 'WOFF', fullName: 'Web Open Font Format', mimeType: 'font/woff', color: 'from-purple-500 to-purple-600' },
    'woff2': { name: 'WOFF2', fullName: 'Web Open Font Format 2', mimeType: 'font/woff2', color: 'from-indigo-500 to-indigo-600' },
    'eot': { name: 'EOT', fullName: 'Embedded OpenType', mimeType: 'application/vnd.ms-fontobject', color: 'from-red-500 to-red-600' },
    'svg': { name: 'SVG Font', fullName: 'SVG Font Format', mimeType: 'image/svg+xml', color: 'from-yellow-500 to-yellow-600' },
    'ps1': { name: 'PS Type 1', fullName: 'PostScript Type 1 Font', mimeType: 'application/postscript', color: 'from-gray-500 to-gray-600' }
  };

  const sourceInfo = fontFormats[sourceFormat as keyof typeof fontFormats];
  const targetInfo = fontFormats[targetFormat as keyof typeof fontFormats];

  const conversionConfig: ConversionConfig = {
    title: `Convert ${sourceInfo?.name || sourceFormat?.toUpperCase()} to ${targetInfo?.name || targetFormat?.toUpperCase()}`,
    description: `Free online ${sourceInfo?.name || sourceFormat?.toUpperCase()} to ${targetInfo?.name || targetFormat?.toUpperCase()} font converter. Convert your font files quickly and securely.`,
    metaDescription: `Convert ${sourceInfo?.name || sourceFormat?.toUpperCase()} to ${targetInfo?.name || targetFormat?.toUpperCase()} font format online for free. Fast, secure, and high-quality font conversion tool.`,
    keywords: `${sourceFormat} to ${targetFormat}, font converter, ${sourceInfo?.name}, ${targetInfo?.name}, font conversion, web fonts, typography`,
    urlSlug: `${sourceFormat}-to-${targetFormat}`,
    h1Title: `${sourceInfo?.name || sourceFormat?.toUpperCase()} to ${targetInfo?.name || targetFormat?.toUpperCase()} Converter`,
    breadcrumbText: `${sourceInfo?.name || sourceFormat?.toUpperCase()} to ${targetInfo?.name || targetFormat?.toUpperCase()}`
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileWithId[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      progress: 0,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'font/ttf': ['.ttf'],
      'font/otf': ['.otf'],
      'font/woff': ['.woff'],
      'font/woff2': ['.woff2'],
      'application/vnd.ms-fontobject': ['.eot'],
      'image/svg+xml': ['.svg'],
      'application/postscript': ['.ps1', '.ps', '.pfa', '.pfb']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const convertFiles = async () => {
    if (files.length === 0) return;

    setIsConverting(true);

    for (const fileItem of files) {
      if (fileItem.status !== 'pending') continue;

      try {
        // Update status to uploading
        setFiles(prev => prev.map(f =>
          f.id === fileItem.id ? { ...f, status: 'uploading' as const } : f
        ));

        const formData = new FormData();
        formData.append('file', fileItem.file);
        formData.append('target_format', targetFormat || '');

        // Call the font conversion API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/convert/font`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setFiles(prev => prev.map(f =>
            f.id === fileItem.id ? {
              ...f,
              status: 'completed' as const,
              downloadUrl: result.download_url,
              conversionId: result.conversion_id
            } : f
          ));
          setNotification({
            message: `Successfully converted ${fileItem.file.name}`,
            type: 'success',
            onClose: () => setNotification(null)
          });
        } else {
          throw new Error(result.error || 'Conversion failed');
        }
      } catch (error: any) {
        setFiles(prev => prev.map(f =>
          f.id === fileItem.id ? {
            ...f,
            status: 'error' as const,
            error: error.message || 'Conversion failed'
          } : f
        ));
        setNotification({
          message: `Failed to convert ${fileItem.file.name}: ${error.message}`,
          type: 'error',
          onClose: () => setNotification(null)
        });
      }
    }

    setIsConverting(false);
  };

  const downloadFile = (downloadUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}${downloadUrl}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    setFiles([]);
  };

  return (
    <>
      <Head>
        <title>{conversionConfig.title} | Free Online Font Converter - FlipFileX</title>
        <meta name="description" content={conversionConfig.metaDescription} />
        <meta name="keywords" content={conversionConfig.keywords} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${conversionConfig.title} | FlipFileX`} />
        <meta property="og:description" content={conversionConfig.metaDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${conversionConfig.title} | FlipFileX`} />
        <meta name="twitter:description" content={conversionConfig.metaDescription} />
        <link rel="canonical" href={`https://flipfilex.com/${conversionConfig.urlSlug}`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-zinc-50 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${targetInfo?.color || 'from-slate-500 to-zinc-600'} rounded-2xl mb-4 sm:mb-6 shadow-lg`}>
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {conversionConfig.h1Title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto px-4">
              Convert {sourceInfo?.fullName || sourceFormat?.toUpperCase()} files to {targetInfo?.fullName || targetFormat?.toUpperCase()} format with our free online font converter.
              Professional quality conversion with support for all major font formats.
            </p>
          </div>

          {/* Conversion Interface */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">

              {/* Format Selection Display */}
              <div className="flex items-center justify-center mb-8 flex-wrap gap-4">
                <div className={`flex items-center space-x-3 bg-gradient-to-r ${sourceInfo?.color || 'from-gray-500 to-gray-600'} text-white px-6 py-3 rounded-xl shadow-lg`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-semibold">{sourceInfo?.name || sourceFormat?.toUpperCase()}</span>
                </div>

                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>

                <div className={`flex items-center space-x-3 bg-gradient-to-r ${targetInfo?.color || 'from-slate-500 to-zinc-600'} text-white px-6 py-3 rounded-xl shadow-lg`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-semibold">{targetInfo?.name || targetFormat?.toUpperCase()}</span>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-slate-400 bg-slate-50'
                    : 'border-gray-300 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isDragActive ? 'Drop your font files here' : 'Choose font files or drag & drop'}
                </h3>
                <p className="text-gray-600 mb-4">
                  Support for TTF, OTF, WOFF, WOFF2, EOT, SVG, and PS Type 1 fonts
                </p>
                <p className="text-sm text-gray-500">
                  Maximum file size: 50MB per file
                </p>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Files ({files.length})
                    </h3>
                    <button
                      onClick={clearAll}
                      className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {files.map((fileItem) => (
                      <div key={fileItem.id} className="bg-gray-50 rounded-xl p-4 border">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {fileItem.file.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(fileItem.file.size)}
                            </p>
                          </div>

                          <div className="flex items-center space-x-3">
                            {fileItem.status === 'completed' && fileItem.downloadUrl && (
                              <button
                                onClick={() => downloadFile(fileItem.downloadUrl!, `${fileItem.file.name.replace(/\.[^/.]+$/, '')}.${targetFormat}`)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                              >
                                Download
                              </button>
                            )}

                            {fileItem.status === 'error' && (
                              <span className="text-red-600 text-sm">{fileItem.error}</span>
                            )}

                            <button
                              onClick={() => removeFile(fileItem.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Status indicator */}
                        <div className="mt-2">
                          {fileItem.status === 'pending' && (
                            <div className="text-xs text-gray-500">Ready to convert</div>
                          )}
                          {fileItem.status === 'uploading' && (
                            <div className="text-xs text-blue-600">Uploading...</div>
                          )}
                          {fileItem.status === 'processing' && (
                            <div className="text-xs text-yellow-600">Converting...</div>
                          )}
                          {fileItem.status === 'completed' && (
                            <div className="text-xs text-green-600">✓ Converted successfully</div>
                          )}
                          {fileItem.status === 'error' && (
                            <div className="text-xs text-red-600">✗ Conversion failed</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Convert Button */}
                  <div className="mt-6 text-center">
                    <button
                      onClick={convertFiles}
                      disabled={isConverting || files.every(f => f.status !== 'pending')}
                      className="bg-gradient-to-r from-slate-600 to-zinc-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:from-slate-700 hover:to-zinc-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 mx-auto"
                    >
                      {isConverting ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Converting...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span>Convert to {targetInfo?.name || targetFormat?.toUpperCase()}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Information Section */}
          <div className="mt-16 space-y-16">

            {/* About the Conversion */}
            <section className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Convert {sourceInfo?.name || sourceFormat?.toUpperCase()} to {targetInfo?.name || targetFormat?.toUpperCase()}?
                </h2>
                <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                  Transform your font files to the optimal format for your specific needs - whether it's web optimization, cross-platform compatibility, or professional typography.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${sourceInfo?.color || 'from-gray-500 to-gray-600'} mr-3`}></div>
                      {sourceInfo?.fullName || sourceFormat?.toUpperCase()} Source Format
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">
                        {getSourceFormatDescription(sourceFormat)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {getSourceFormatFeatures(sourceFormat).map((feature, index) => (
                          <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${targetInfo?.color || 'from-slate-500 to-zinc-600'} mr-3`}></div>
                      {targetInfo?.fullName || targetFormat?.toUpperCase()} Target Format
                    </h3>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">
                        {getTargetFormatDescription(targetFormat)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {getTargetFormatFeatures(targetFormat).map((feature, index) => (
                          <span key={index} className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-gradient-to-br from-slate-50 to-zinc-50 rounded-2xl p-8 border border-slate-100">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Benefits of Converting to {targetInfo?.name || targetFormat?.toUpperCase()}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {getConversionBenefits(sourceFormat, targetFormat).map((benefit, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="text-3xl mb-4">{benefit.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* How to Use Section */}
            <section className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                How to Convert {sourceInfo?.name || sourceFormat?.toUpperCase()} to {targetInfo?.name || targetFormat?.toUpperCase()}
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Upload Font File</h3>
                  <p className="text-gray-600 text-sm">Drag and drop your {sourceInfo?.name || sourceFormat?.toUpperCase()} file or click to browse and select it from your device.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Automatic Processing</h3>
                  <p className="text-gray-600 text-sm">Our converter automatically processes your font file and converts it to {targetInfo?.name || targetFormat?.toUpperCase()} format.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quality Conversion</h3>
                  <p className="text-gray-600 text-sm">Advanced algorithms ensure your font maintains perfect quality and all typography features during conversion.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Download Result</h3>
                  <p className="text-gray-600 text-sm">Download your converted {targetInfo?.name || targetFormat?.toUpperCase()} font file instantly and use it in your projects.</p>
                </div>
              </div>
            </section>

            {/* Use Cases Section */}
            <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                When to Use {targetInfo?.name || targetFormat?.toUpperCase()} Format
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getUseCases(targetFormat).map((useCase, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="text-2xl mb-3">{useCase.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Font Converter Features
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                  <p className="text-gray-600 text-sm">Convert font files in seconds with our optimized processing engine.</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
                  <p className="text-gray-600 text-sm">Your font files are automatically deleted after conversion for complete privacy.</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Perfect Quality</h3>
                  <p className="text-gray-600 text-sm">Maintain font quality and all typography features during conversion.</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                  <div className="text-4xl mb-4">💝</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Completely Free</h3>
                  <p className="text-gray-600 text-sm">No registration, no watermarks, no limits - just free font conversion.</p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Frequently Asked Questions
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Is the {sourceInfo?.name || sourceFormat?.toUpperCase()} to {targetInfo?.name || targetFormat?.toUpperCase()} conversion free?
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Yes, our font converter is completely free to use. There are no hidden fees, registration requirements, or usage limits.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      What is the maximum file size supported?
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      You can convert font files up to 50MB in size, which covers virtually all font files including large font families.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Are my font files secure during conversion?
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Yes, all uploaded files are automatically deleted from our servers after conversion. We never store or access your font files.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Does conversion affect font quality?
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      No, our converter maintains perfect font quality and preserves all typography features, kerning, and glyph information.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Can I convert multiple font files at once?
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Yes, you can upload and convert multiple font files simultaneously for batch processing convenience.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      What browsers support {targetInfo?.name || targetFormat?.toUpperCase()} fonts?
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {getBrowserSupport(targetFormat)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Details */}
            <section className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Technical Specifications
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {sourceInfo?.fullName || sourceFormat?.toUpperCase()} Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    {getTechnicalDetails(sourceFormat).map((detail, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-600">{detail.label}:</span>
                        <span className="text-gray-900 font-medium">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {targetInfo?.fullName || targetFormat?.toUpperCase()} Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    {getTechnicalDetails(targetFormat).map((detail, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-600">{detail.label}:</span>
                        <span className="text-gray-900 font-medium">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={notification.onClose}
        />
      )}
    </>
  );
}