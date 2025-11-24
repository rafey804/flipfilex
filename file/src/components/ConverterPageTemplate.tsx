'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ApiService, formatFileSize, validateFile } from '@/lib/api';
import { getFormatInfo } from '../lib/formatInfo';
import FormatSelector from './FormatSelector';

interface FileWithId {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  downloadUrl?: string;
}

interface ConverterPageProps {
  slug: string;
  sourceFormat: string;
  targetFormat: string;
  category: 'image' | 'document' | 'audio' | 'video' | 'pdf' | 'font' | 'ai';
  title: string;
}

// Related converters by category
const relatedConverters = {
  image: [
    { slug: 'heic-to-jpg', title: 'HEIC to JPG' },
    { slug: 'jpg-to-png', title: 'JPG to PNG' },
    { slug: 'png-to-jpg', title: 'PNG to JPG' },
    { slug: 'webp-to-png', title: 'WebP to PNG' },
    { slug: 'webp-to-jpg', title: 'WebP to JPG' },
    { slug: 'jpg-to-webp', title: 'JPG to WebP' },
    { slug: 'png-to-webp', title: 'PNG to WebP' },
    { slug: 'avif-to-jpg', title: 'AVIF to JPG' },
    { slug: 'avif-to-png', title: 'AVIF to PNG' },
    { slug: 'svg-to-png', title: 'SVG to PNG' },
    { slug: 'svg-to-jpg', title: 'SVG to JPG' },
    { slug: 'gif-to-png', title: 'GIF to PNG' },
    { slug: 'gif-to-jpg', title: 'GIF to JPG' },
    { slug: 'bmp-to-jpg', title: 'BMP to JPG' },
    { slug: 'bmp-to-png', title: 'BMP to PNG' },
    { slug: 'tiff-to-jpg', title: 'TIFF to JPG' },
    { slug: 'tiff-to-png', title: 'TIFF to PNG' },
    { slug: 'ico-to-png', title: 'ICO to PNG' },
    { slug: 'psd-to-jpg', title: 'PSD to JPG' },
    { slug: 'psd-to-png', title: 'PSD to PNG' },
  ],
  document: [
    { slug: 'docx-to-pdf', title: 'DOCX to PDF' },
    { slug: 'pdf-to-docx', title: 'PDF to DOCX' },
    { slug: 'pdf-to-txt', title: 'PDF to TXT' },
    { slug: 'txt-to-pdf', title: 'TXT to PDF' },
    { slug: 'epub-to-pdf', title: 'EPUB to PDF' },
    { slug: 'docx-to-epub', title: 'DOCX to EPUB' },
    { slug: 'txt-to-epub', title: 'TXT to EPUB' },
    { slug: 'mobi-to-epub', title: 'MOBI to EPUB' },
    { slug: 'latex-to-pdf', title: 'LaTeX to PDF' },
    { slug: 'html-to-docx', title: 'HTML to DOCX' },
    { slug: 'html-to-pdf', title: 'HTML to PDF' },
    { slug: 'markdown-to-pdf', title: 'Markdown to PDF' },
    { slug: 'markdown-to-html', title: 'Markdown to HTML' },
  ],
  pdf: [
    { slug: 'pdf-to-docx', title: 'PDF to Word' },
    { slug: 'docx-to-pdf', title: 'Word to PDF' },
    { slug: 'pdf-to-jpg', title: 'PDF to JPG' },
    { slug: 'pdf-to-png', title: 'PDF to PNG' },
    { slug: 'pdf-to-excel', title: 'PDF to Excel' },
    { slug: 'excel-to-pdf', title: 'Excel to PDF' },
    { slug: 'pdf-to-txt', title: 'PDF to TXT' },
    { slug: 'txt-to-pdf', title: 'TXT to PDF' },
    { slug: 'compress-pdf', title: 'Compress PDF' },
    { slug: 'merge-pdf', title: 'Merge PDF' },
    { slug: 'split-pdf', title: 'Split PDF' },
    { slug: 'html-to-pdf', title: 'HTML to PDF' },
    { slug: 'markdown-to-pdf', title: 'Markdown to PDF' },
    { slug: 'epub-to-pdf', title: 'EPUB to PDF' },
    { slug: 'latex-to-pdf', title: 'LaTeX to PDF' },
  ],
  audio: [
    { slug: 'mp3-to-wav', title: 'MP3 to WAV' },
    { slug: 'wav-to-mp3', title: 'WAV to MP3' },
    { slug: 'flac-to-mp3', title: 'FLAC to MP3' },
    { slug: 'flac-to-wav', title: 'FLAC to WAV' },
    { slug: 'aac-to-mp3', title: 'AAC to MP3' },
    { slug: 'm4a-to-mp3', title: 'M4A to MP3' },
    { slug: 'ogg-to-mp3', title: 'OGG to MP3' },
    { slug: 'wma-to-mp3', title: 'WMA to MP3' },
    { slug: 'opus-to-mp3', title: 'Opus to MP3' },
    { slug: 'mp3-to-flac', title: 'MP3 to FLAC' },
    { slug: 'mp3-to-ogg', title: 'MP3 to OGG' },
  ],
  video: [
    { slug: 'mp4-to-avi', title: 'MP4 to AVI' },
    { slug: 'avi-to-mp4', title: 'AVI to MP4' },
    { slug: 'mov-to-mp4', title: 'MOV to MP4' },
    { slug: 'mkv-to-mp4', title: 'MKV to MP4' },
    { slug: 'webm-to-mp4', title: 'WebM to MP4' },
    { slug: 'mp4-to-webm', title: 'MP4 to WebM' },
    { slug: 'mp4-to-gif', title: 'MP4 to GIF' },
    { slug: 'flv-to-mp4', title: 'FLV to MP4' },
    { slug: 'wmv-to-mp4', title: 'WMV to MP4' },
    { slug: 'mpeg-to-mp4', title: 'MPEG to MP4' },
  ],
  font: [
    { slug: 'ttf-to-woff', title: 'TTF to WOFF' },
    { slug: 'ttf-to-woff2', title: 'TTF to WOFF2' },
    { slug: 'otf-to-ttf', title: 'OTF to TTF' },
    { slug: 'woff-to-ttf', title: 'WOFF to TTF' },
  ],
  ai: [
    { slug: 'stl-to-obj', title: 'STL to OBJ' },
    { slug: 'obj-to-stl', title: 'OBJ to STL' },
    { slug: 'dxf-to-pdf', title: 'DXF to PDF' },
    { slug: 'dwg-to-pdf', title: 'DWG to PDF' },
  ],
};

export default function ConverterPageTemplate({
  slug,
  sourceFormat,
  targetFormat,
  category,
  title
}: ConverterPageProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error' | 'info'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    acceptedFiles.forEach((file) => {
      const error = validateFile(file, [sourceFormat]);
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

      setSelectedFiles([...selectedFiles, ...newFiles]);
      showNotification(`${validFiles.length} file(s) added successfully`, 'success');
    }
  }, [sourceFormat, selectedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      [`${getCategoryMimeType(category)}/${sourceFormat}`]: [`.${sourceFormat}`]
    },
    disabled: isProcessing,
    multiple: true,
  });

  const removeFile = (fileId: string) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== fileId));
    showNotification('File removed', 'info');
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);

    for (const fileWithId of selectedFiles) {
      if (fileWithId.status === 'completed') continue;

      try {
        // Update to uploading
        updateFileStatus(fileWithId.id, 'uploading', 0);

        // Simulate upload progress
        for (let i = 0; i <= 50; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          updateFileStatus(fileWithId.id, 'uploading', i);
        }

        // Convert file
        updateFileStatus(fileWithId.id, 'processing', 50);

        const result = await ApiService.convertFile(fileWithId.file, targetFormat);

        // Simulate processing progress
        for (let i = 60; i <= 90; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          updateFileStatus(fileWithId.id, 'processing', i);
        }

        // Get download URL - convert relative path to absolute URL and add cache buster
        let downloadUrl: string;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        if (result.download_url) {
          // If download_url starts with '/', it's relative - make it absolute
          if (result.download_url.startsWith('/')) {
            downloadUrl = `${API_URL}${result.download_url}`;
          } else {
            downloadUrl = result.download_url;
          }
        } else {
          // Fallback: construct from filename
          downloadUrl = ApiService.getDownloadUrl(result.filename);
        }

        // Add cache buster to prevent browser caching issues
        downloadUrl = downloadUrl.includes('?')
          ? `${downloadUrl}&t=${Date.now()}`
          : `${downloadUrl}?t=${Date.now()}`;

        // Enhanced debug logging
        console.log('=== CONVERSION COMPLETE ===');
        console.log('File ID:', fileWithId.id);
        console.log('File Name:', fileWithId.file.name);
        console.log('API Response:', result);
        console.log('Download URL (final):', downloadUrl);
        console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
        console.log('========================');

        updateFileStatus(fileWithId.id, 'completed', 100, undefined, downloadUrl);
      } catch (error) {
        console.error('=== CONVERSION ERROR ===');
        console.error('File:', fileWithId.file.name);
        console.error('Error:', error);
        console.error('======================');

        let errorMessage = 'Conversion failed';
        if (error instanceof Error) {
          errorMessage = error.message;

          // Make error messages more user-friendly
          if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('Network Error')) {
            errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
          } else if (errorMessage.includes('timeout')) {
            errorMessage = 'Conversion took too long. Please try with a smaller file.';
          } else if (errorMessage.includes('AVIF') || errorMessage.includes('avif')) {
            errorMessage = 'AVIF format requires special libraries. Please try PNG or JPG instead.';
          }
        }

        updateFileStatus(fileWithId.id, 'error', 0, errorMessage);
      }
    }

    setIsProcessing(false);
    showNotification('All conversions completed!', 'success');
  };

  const updateFileStatus = (
    fileId: string,
    status: FileWithId['status'],
    progress: number,
    error?: string,
    downloadUrl?: string
  ) => {
    setSelectedFiles(files =>
      files.map(f =>
        f.id === fileId
          ? { ...f, status, progress, error, downloadUrl }
          : f
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 text-white hover:text-gray-200">×</button>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert {sourceFormat.toUpperCase()} to {targetFormat.toUpperCase()} online for free.
            Fast, secure, and easy-to-use converter with no file size limits.
          </p>
        </div>

        {/* Format Selector - Compact */}
        <div className="mb-6">
          <FormatSelector
            currentSourceFormat={sourceFormat}
            currentTargetFormat={targetFormat}
            currentSlug={slug}
          />
        </div>

        {/* Upload Area - Compact */}
        <div className="max-w-4xl mx-auto mb-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
              transition-all duration-300 ease-in-out
              ${isDragActive
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-[1.01] shadow-xl'
                : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-lg'
              }
              ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center space-y-4">
              {/* Upload Icon */}
              <div className={`
                w-16 h-16 rounded-xl flex items-center justify-center shadow-md
                transition-all duration-300
                ${isDragActive
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500'
                }
              `}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              {/* Upload Text */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Drop your {sourceFormat.toUpperCase()} files here
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  or click to browse files
                </p>
                <div className="inline-flex items-center space-x-3 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                  <span>{sourceFormat.toUpperCase()}</span>
                  <span className="text-gray-300">•</span>
                  <span>Unlimited files</span>
                  <span className="text-gray-300">•</span>
                  <span>1GB each</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Selected Files ({selectedFiles.length})
            </h3>

            <div className="space-y-4 mb-8">
              {selectedFiles.map((fileWithId) => (
                <div
                  key={fileWithId.id}
                  className={`
                    bg-white border-2 rounded-2xl p-6 transition-all duration-300
                    ${fileWithId.status === 'completed' ? 'border-green-200 bg-green-50' :
                      fileWithId.status === 'error' ? 'border-red-200 bg-red-50' :
                      'border-gray-200'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {fileWithId.file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(fileWithId.file.size)} • {getStatusText(fileWithId.status)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 ml-4">
                      {/* Debug info - remove after testing */}
                      {fileWithId.status === 'completed' && (
                        <div className="text-xs text-gray-500 mr-2">
                          {fileWithId.downloadUrl ? '✓ URL Ready' : '✗ No URL'}
                        </div>
                      )}

                      {fileWithId.status === 'completed' && fileWithId.downloadUrl && (
                        <a
                          href={fileWithId.downloadUrl}
                          download
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                          Download
                        </a>
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
                  {(fileWithId.status === 'uploading' || fileWithId.status === 'processing') && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${fileWithId.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {fileWithId.error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-700">{fileWithId.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={isProcessing || selectedFiles.every(f => f.status === 'completed')}
              className={`
                w-full py-4 px-8 rounded-xl font-bold text-lg transition-all shadow-lg
                ${isProcessing || selectedFiles.every(f => f.status === 'completed')
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                }
              `}
            >
              {isProcessing ? 'Converting...' : 'Convert Files'}
            </button>
          </div>
        )}

        {/* Features Section - Compact */}
        <div className="max-w-6xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Why Use Our {sourceFormat.toUpperCase()} to {targetFormat.toUpperCase()} Converter?
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Fast Conversion</h3>
              <p className="text-gray-600 text-sm">Convert your files in seconds with our optimized engine.</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Secure & Private</h3>
              <p className="text-gray-600 text-sm">Files are automatically deleted after 1 hour.</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">100% Free</h3>
              <p className="text-gray-600 text-sm">No registration, no watermarks, no hidden fees.</p>
            </div>
          </div>
        </div>

        {/* SEO Content Sections */}
        <SEOContent
          sourceFormat={sourceFormat}
          targetFormat={targetFormat}
          category={category}
          title={title}
        />
      </div>
    </div>
  );
}

// SEO Content Component
function SEOContent({ sourceFormat, targetFormat, category, title }: {
  sourceFormat: string;
  targetFormat: string;
  category: string;
  title: string;
}) {
  const content = generateSEOContent(sourceFormat, targetFormat, category);

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-6">
      {/* About Section */}
      <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          About {sourceFormat.toUpperCase()} to {targetFormat.toUpperCase()} Conversion
        </h2>
        <div className="prose max-w-none text-gray-700 space-y-3 text-sm">
          {content.about.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* How to Use Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          How to Convert {sourceFormat.toUpperCase()} to {targetFormat.toUpperCase()}
        </h2>
        <div className="space-y-4">
          {content.howTo.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-gray-700 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Benefits of Converting {sourceFormat.toUpperCase()} to {targetFormat.toUpperCase()}
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {content.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">{benefit.title}</h3>
                <p className="text-gray-700 text-xs">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Common Use Cases
        </h2>
        <div className="space-y-3">
          {content.useCases.map((useCase, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-base font-bold text-gray-900 mb-1">{useCase.title}</h3>
              <p className="text-gray-700 text-sm">{useCase.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Technical Details: {sourceFormat.toUpperCase()} vs {targetFormat.toUpperCase()}
        </h2>
        <div className="prose max-w-none text-gray-700 space-y-3 text-sm">
          {content.technical.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {content.faq.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-1">{item.question}</h3>
              <p className="text-gray-700 text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function getCategoryMimeType(category: string): string {
  const mimeTypes: Record<string, string> = {
    'image': 'image',
    'document': 'application',
    'audio': 'audio',
    'video': 'video',
    'pdf': 'application',
    'font': 'font',
    'ai': 'application'
  };
  return mimeTypes[category] || 'application';
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'Ready to convert',
    'uploading': 'Uploading...',
    'processing': 'Converting...',
    'completed': 'Completed',
    'error': 'Failed'
  };
  return statusMap[status] || 'Unknown';
}

// Generate unique SEO content for each converter
function generateSEOContent(sourceFormat: string, targetFormat: string, category: string) {
  const source = sourceFormat.toUpperCase();
  const target = targetFormat.toUpperCase();
  const sourceLower = sourceFormat.toLowerCase();
  const targetLower = targetFormat.toLowerCase();

  // Format-specific information
  const formatInfo = getFormatInfo(sourceFormat, targetFormat, category);

  return {
    about: [
      `Converting ${source} files to ${target} format is a common need for ${formatInfo.audience}. ${formatInfo.sourceDesc} ${formatInfo.targetDesc} Our free online ${source} to ${target} converter makes this process simple, fast, and secure.`,
      `The ${source} format ${formatInfo.sourceDetails} while ${target} ${formatInfo.targetDetails} This conversion is particularly useful when ${formatInfo.conversionReason}`,
      `With our online ${source} to ${target} converter, you can convert ${source} to ${target} free without any software installation. The entire conversion process happens in your browser, ensuring your files remain private and secure. Whether you need to convert one file or multiple files, our converter handles batch conversions efficiently while maintaining the highest quality output.`,
      `Our ${sourceLower} to ${targetLower} converter tool supports files of all sizes and provides fast conversion speeds. The converted ${target} files are ready for immediate download, and we automatically delete all uploaded files after 1 hour to protect your privacy. This makes it perfect for ${formatInfo.perfectFor}`
    ],

    howTo: [
      {
        title: `Upload Your ${source} Files`,
        description: `Click the upload area or drag and drop your ${source} files directly into the converter. You can select multiple ${sourceLower} files at once for batch conversion. Our converter accepts ${source} files up to 1GB each and supports unlimited files simultaneously.`
      },
      {
        title: 'Start the Conversion Process',
        description: `Once your ${sourceLower} files are uploaded, click the "Convert Files" button. Our advanced conversion engine will automatically process each file and convert ${source} to ${target} format while preserving ${formatInfo.preserves}.`
      },
      {
        title: `Download Your ${target} Files`,
        description: `After conversion completes, download buttons will appear next to each converted file. Click to download your ${targetLower} files individually, or use the batch download option. The ${target} files are optimized for ${formatInfo.optimizedFor}.`
      },
      {
        title: 'Automatic File Cleanup',
        description: `All uploaded ${sourceLower} files and converted ${targetLower} files are automatically deleted from our servers after 1 hour. This ensures complete privacy and security for your ${formatInfo.fileType} conversions.`
      }
    ],

    benefits: [
      {
        title: 'Universal Compatibility',
        description: `${target} format is ${formatInfo.compatibility} making your converted files accessible across all major platforms, devices, and applications.`
      },
      {
        title: `Better ${formatInfo.qualityAspect}`,
        description: `Converting ${source} to ${target} provides ${formatInfo.qualityBenefit} ensuring your ${formatInfo.fileType} look professional and maintain their intended appearance.`
      },
      {
        title: 'Smaller File Sizes',
        description: `${target} files ${formatInfo.sizeComparison} than ${source} format, making them easier to share via email, upload to websites, or store in cloud services.`
      },
      {
        title: 'No Quality Loss',
        description: `Our conversion algorithm preserves ${formatInfo.preservedElements} during the ${sourceLower} to ${targetLower} conversion process, ensuring your output matches the original quality.`
      },
      {
        title: 'Batch Processing',
        description: `Convert multiple ${source} files to ${target} format simultaneously. Our batch converter saves time when you need to process ${formatInfo.batchUseCase}.`
      },
      {
        title: 'Free & Unlimited',
        description: `Use our ${source} to ${target} converter completely free with no registration required. Convert as many files as you need without any restrictions or watermarks.`
      }
    ],

    useCases: [
      {
        title: formatInfo.useCase1.title,
        description: formatInfo.useCase1.description
      },
      {
        title: formatInfo.useCase2.title,
        description: formatInfo.useCase2.description
      },
      {
        title: formatInfo.useCase3.title,
        description: formatInfo.useCase3.description
      },
      {
        title: formatInfo.useCase4.title,
        description: formatInfo.useCase4.description
      },
      {
        title: formatInfo.useCase5.title,
        description: formatInfo.useCase5.description
      }
    ],

    technical: [
      `${source} (${formatInfo.sourceFullName}) ${formatInfo.techSource1}`,
      `${target} (${formatInfo.targetFullName}) ${formatInfo.techTarget1}`,
      `When converting ${source} to ${target}, ${formatInfo.conversionProcess} Our converter uses advanced algorithms to ensure ${formatInfo.technicalBenefit}`,
      `The main technical difference between ${source} and ${target} formats is ${formatInfo.technicalDifference} This makes ${target} ideal for ${formatInfo.technicalIdealFor}`
    ],

    faq: [
      {
        question: `Is it safe to convert ${source} to ${target} online?`,
        answer: `Yes, absolutely! Our online ${sourceLower} to ${targetLower} converter uses secure HTTPS encryption to protect your files during upload and conversion. All files are automatically deleted from our servers after 1 hour, ensuring complete privacy. We never access, share, or store your ${formatInfo.fileType} permanently.`
      },
      {
        question: `How long does ${source} to ${target} conversion take?`,
        answer: `Conversion speed depends on file size, but most ${sourceLower} files convert to ${targetLower} format in just a few seconds. Small files (under 5MB) typically convert in 2-5 seconds, while larger files may take 10-30 seconds. Batch conversions process multiple files sequentially, so total time depends on the number and size of files.`
      },
      {
        question: `Will converting ${source} to ${target} reduce quality?`,
        answer: `Our converter is optimized to preserve ${formatInfo.preservedElements} during conversion. ${formatInfo.qualityAnswer} The output ${target} files maintain professional quality suitable for ${formatInfo.suitableFor}.`
      },
      {
        question: `Can I convert multiple ${source} files at once?`,
        answer: `Yes! Our batch converter supports converting up to 10 ${source} files to ${target} format simultaneously. Simply select multiple files when uploading, and our system will process them all efficiently. This is perfect when you need to convert ${formatInfo.batchExample}.`
      },
      {
        question: `Do I need to install software to convert ${source} to ${target}?`,
        answer: `No installation required! Our ${sourceLower} to ${targetLower} converter works entirely in your web browser. Simply visit our website, upload your files, and convert instantly. This works on Windows, Mac, Linux, and mobile devices with any modern browser.`
      },
      {
        question: `What's the maximum file size for ${source} to ${target} conversion?`,
        answer: `Our converter accepts ${source} files up to 1GB each. You can upload unlimited files at once for batch conversion. For very large files, ensure you have a stable internet connection for optimal upload and download speeds.`
      },
      {
        question: `Are there any costs or hidden fees?`,
        answer: `No, our ${source} to ${target} converter is completely free forever. There are no hidden costs, subscription fees, or premium tiers. You can convert unlimited files without registration, and we never add watermarks to your converted ${targetLower} files.`
      },
      {
        question: `Can I use this converter on mobile devices?`,
        answer: `Yes! Our ${sourceLower} to ${targetLower} converter is fully responsive and works perfectly on smartphones and tablets. Whether you're using iOS, Android, or any mobile browser, you can convert ${source} to ${target} format on the go with the same fast speeds and high quality.`
      },
      {
        question: formatInfo.faqExtra.question,
        answer: formatInfo.faqExtra.answer
      }
    ]
  };
}
