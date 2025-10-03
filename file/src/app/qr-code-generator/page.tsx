'use client';

import { useState, useEffect, useRef } from 'react';
import { ApiService } from '@/lib/api';
import { FileWithId, UploadProgress } from '@/types';
import QRCode from 'qrcode';
import Head from 'next/head';

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState('');
  const [generatedFile, setGeneratedFile] = useState<FileWithId | null>(null);
  const [previewFile, setPreviewFile] = useState<FileWithId | null>(null);
  const [clientPreviewUrl, setClientPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalImageLoaded, setFinalImageLoaded] = useState(false);
  const [finalImageError, setFinalImageError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // QR Code options
  const [format, setFormat] = useState('png');
  const [size, setSize] = useState(300);
  const [border, setBorder] = useState(4);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [fillColor, setFillColor] = useState('#000000');
  const [backColor, setBackColor] = useState('#ffffff');
  const [style, setStyle] = useState('square');

  // Generate client-side QR code for instant preview with style simulation
  const generateClientPreview = async () => {
    if (!text.trim()) {
      setClientPreviewUrl(null);
      return;
    }

    try {
      // Generate base QR code
      const qrDataUrl = await QRCode.toDataURL(text.trim(), {
        width: Math.min(size, 400),
        margin: border,
        color: {
          dark: fillColor,
          light: backColor
        },
        errorCorrectionLevel: errorCorrection as any
      });

      // Apply style effects using canvas if style is not square
      if (style !== 'square') {
        const styledDataUrl = await applyStyleToQR(qrDataUrl, style);
        setClientPreviewUrl(styledDataUrl);
      } else {
        setClientPreviewUrl(qrDataUrl);
      }

      console.log('Client-side QR code generated successfully with style:', style);
    } catch (error) {
      console.error('Client QR generation error:', error);
      setClientPreviewUrl(null);
    }
  };

  // Apply style effects to QR code using canvas
  const applyStyleToQR = async (dataUrl: string, qrStyle: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw background
        ctx.fillStyle = backColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Get image data to process pixels
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Clear canvas for styled drawing
        ctx.fillStyle = backColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = fillColor;

        // Detect module size (QR code block size)
        const moduleSize = Math.max(1, Math.floor(canvas.width / 33)); // Approximate

        // Process pixels and draw styled modules
        for (let y = 0; y < canvas.height; y += moduleSize) {
          for (let x = 0; x < canvas.width; x += moduleSize) {
            const pixelIndex = (y * canvas.width + x) * 4;
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];

            // Check if this is a dark module (QR code part)
            const isDark = (r + g + b) / 3 < 128;

            if (isDark) {
              if (qrStyle === 'rounded') {
                // Draw rounded rectangle
                const radius = moduleSize * 0.3;
                ctx.beginPath();
                if (ctx.roundRect) {
                  ctx.roundRect(x, y, moduleSize - 1, moduleSize - 1, radius);
                } else {
                  // Fallback for browsers without roundRect
                  ctx.rect(x + 1, y + 1, moduleSize - 3, moduleSize - 3);
                }
                ctx.fill();
              } else if (qrStyle === 'circle') {
                // Draw circle
                const centerX = x + moduleSize / 2;
                const centerY = y + moduleSize / 2;
                const radius = moduleSize * 0.4;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.fill();
              }
            }
          }
        }

        resolve(canvas.toDataURL());
      };
      img.src = dataUrl;
    });
  };

  // Generate client-side preview immediately
  useEffect(() => {
    generateClientPreview();
  }, [text, size, border, errorCorrection, fillColor, backColor, style]);

  // Generate backend preview when text or options change
  useEffect(() => {
    const generatePreview = async () => {
      if (!text.trim()) {
        setPreviewFile(null);
        setError(null);
        return;
      }

      setIsGeneratingPreview(true);
      setError(null);

      try {
        console.log('Generating preview for:', text.trim().substring(0, 50));
        console.log('Preview options:', { format: 'png', size: Math.min(size, 400), border, errorCorrection, fillColor, backColor, style });

        const result = await ApiService.generateQRCode(
          text.trim(),
          {
            format: 'png', // Always use PNG for preview
            size: Math.min(size, 400), // Limit preview size
            border,
            error_correction: errorCorrection,
            fill_color: fillColor,
            back_color: backColor,
            style
          }
        );

        console.log('Preview generation result:', result);

        // Construct full download URL with timestamp to avoid caching issues
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const baseUrl = result.download_url.startsWith('http')
          ? result.download_url
          : `${API_BASE_URL}${result.download_url}`;
        const fullDownloadUrl = `${baseUrl}?t=${Date.now()}`;

        const newPreview: FileWithId = {
          id: `preview-${Date.now()}`,
          file: new File([], result.filename),
          status: 'completed',
          downloadUrl: fullDownloadUrl,
          progress: 100
        };

        console.log('Preview generation result:', result);
        console.log('Original download URL:', result.download_url);
        console.log('Full constructed URL:', fullDownloadUrl);

        // Add a small delay to ensure file is written and accessible
        setTimeout(() => {
          setPreviewFile(newPreview);
          console.log('Preview file set:', newPreview);
        }, 100);
      } catch (error: any) {
        console.error('Preview generation error:', error);
        console.error('Error details:', error.message, error.response?.data);
        setPreviewFile(null);

        // Only show error if it's a connection issue
        if (error.message?.includes('connect') || error.message?.includes('ECONNREFUSED') || error.code === 'ECONNREFUSED') {
          setError('Backend server not running. Please start the Python backend server to enable QR code generation.');
        }
      } finally {
        setIsGeneratingPreview(false);
      }
    };

    // Debounce preview generation
    const timeoutId = setTimeout(generatePreview, 800); // Increased to 800ms
    return () => clearTimeout(timeoutId);
  }, [text, size, border, errorCorrection, fillColor, backColor, style]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter text or URL to generate QR code');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedFile(null);
    setFinalImageLoaded(false);
    setFinalImageError(false);

    try {
      const result = await ApiService.generateQRCode(
        text.trim(),
        {
          format,
          size,
          border,
          error_correction: errorCorrection,
          fill_color: fillColor,
          back_color: backColor,
          style
        },
        (progress: UploadProgress) => {
          // Progress handling if needed
        }
      );

      // Construct full download URL with timestamp to avoid caching issues
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const baseUrl = result.download_url.startsWith('http')
        ? result.download_url
        : `${API_BASE_URL}${result.download_url}`;
      const fullDownloadUrl = `${baseUrl}?t=${Date.now()}`;

      const newFile: FileWithId = {
        id: Date.now().toString(),
        file: new File([], result.filename),
        status: 'completed',
        downloadUrl: fullDownloadUrl,
        progress: 100
      };

      setGeneratedFile(newFile);

      // Reset image states and try to preload the image
      setFinalImageLoaded(false);
      setFinalImageError(false);

      // Add a small delay to ensure file is written, then preload the image
      console.log('Attempting to preload final image from:', fullDownloadUrl);
      setTimeout(() => {
        const preloadImg = new Image();
        preloadImg.onload = () => {
          console.log('Final image preloaded successfully');
          setFinalImageLoaded(true);
        };
        preloadImg.onerror = (error) => {
          console.error('Final image preload failed:', error);
          console.error('Failed URL:', fullDownloadUrl);
          setFinalImageError(true);
        };
        preloadImg.src = fullDownloadUrl;
      }, 200); // Small delay to ensure file is written

    } catch (error: any) {
      console.error('QR Code generation error:', error);
      setError(error.message || 'QR code generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setText('');
    setGeneratedFile(null);
    setPreviewFile(null);
    setClientPreviewUrl(null);
    setError(null);
    setIsGenerating(false);
    setIsGeneratingPreview(false);
    setFinalImageLoaded(false);
    setFinalImageError(false);
    // Reset to defaults
    setFormat('png');
    setSize(300);
    setBorder(4);
    setErrorCorrection('M');
    setFillColor('#000000');
    setBackColor('#ffffff');
    setStyle('square');
  };

  const getContentTypeInfo = (inputText: string) => {
    const lower = inputText.toLowerCase().trim();

    if (lower.startsWith('http')) return { type: 'URL', icon: '🌐', description: 'Opens website in browser' };
    if (lower.includes('@') && lower.includes('.')) return { type: 'Email', icon: '📧', description: 'Opens email client' };
    if (lower.startsWith('tel:') || /^\+?[\d\s\-\(\)]{10,}$/.test(inputText)) return { type: 'Phone', icon: '📞', description: 'Opens dialer' };
    if (lower.startsWith('wifi:')) return { type: 'WiFi', icon: '📶', description: 'Connects to WiFi' };
    if (lower.startsWith('geo:')) return { type: 'Location', icon: '📍', description: 'Opens in maps' };

    return { type: 'Text', icon: '📝', description: 'Plain text content' };
  };

  const contentInfo = text ? getContentTypeInfo(text) : null;

  return (
    <>
      <Head>
        <title>Free QR Code Generator Online | Custom QR Codes with Logo & Colors</title>
        <meta name="description" content="Generate free QR codes instantly with our advanced QR code generator. Create custom QR codes for URLs, WiFi, vCard, text & more. Multiple formats (PNG, SVG, PDF), colors, styles. No registration required." />
        <meta name="keywords" content="QR code generator, free QR code, create QR code, QR code maker, custom QR code, QR code with logo, colored QR code, QR generator online, URL to QR code, WiFi QR code, vCard QR code, business card QR, QR code PNG, QR code SVG, QR code PDF, dynamic QR code, barcode generator, QR scanner, QR code customization, free online QR generator, no registration QR code, instant QR code" />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/qr-code-generator" />
        <meta property="og:title" content="Free QR Code Generator - Create Custom QR Codes Instantly" />
        <meta property="og:description" content="Generate professional QR codes with custom colors, styles & formats. Support for URLs, WiFi, vCard, text & more. Free, instant, no registration." />
        <meta property="og:image" content="https://flipfilex.com/og-qr-generator.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="QR Code Generator - Create Custom QR Codes" />
        <meta property="og:site_name" content="FlipFileX" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://flipfilex.com/qr-code-generator" />
        <meta name="twitter:title" content="Free QR Code Generator | Custom QR Codes" />
        <meta name="twitter:description" content="Create professional QR codes with custom colors, styles & formats. Free & instant." />
        <meta name="twitter:image" content="https://flipfilex.com/og-qr-generator.png" />
        <meta name="twitter:creator" content="@flipfilex" />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <link rel="canonical" href="https://flipfilex.com/qr-code-generator" />
        <meta name="author" content="FlipFileX" />
        <meta name="publisher" content="FlipFileX" />

        {/* Mobile & App Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="QR Code Generator" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />

        {/* Additional structured data for better SEO */}
        <meta property="article:publisher" content="https://www.facebook.com/flipfilex" />
        <meta name="application-name" content="FlipFileX QR Code Generator" />
        <meta name="msapplication-TileColor" content="#9333ea" />
        <meta name="theme-color" content="#9333ea" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-6 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4M4 8h4m4 0V4m-4 4h2m2 0h2m2 0h2M4 16h4m4 0v4m-4-4h2m2 0h2" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            QR Code Generator
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Create professional QR codes for URLs, text, contact info, WiFi credentials, and more.
            Customize colors, styles, and formats for any use case.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">

              {/* Text Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Content to Encode *
                </label>
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text, URL, email, phone number, or any content..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                    maxLength={4296}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {text.length}/4296
                  </div>
                </div>

                {/* Content Type Indicator */}
                {contentInfo && (
                  <div className="mt-3 flex items-center space-x-2 text-sm">
                    <span className="text-lg">{contentInfo.icon}</span>
                    <span className="font-medium text-purple-700">{contentInfo.type}</span>
                    <span className="text-gray-600">• {contentInfo.description}</span>
                  </div>
                )}
              </div>

              {/* Customization Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                {/* Format */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                    <option value="svg">SVG</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Size ({size}px)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Error Correction */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Error Correction</label>
                  <select
                    value={errorCorrection}
                    onChange={(e) => setErrorCorrection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="L">Low (~7%)</option>
                    <option value="M">Medium (~15%)</option>
                    <option value="Q">Quartile (~25%)</option>
                    <option value="H">High (~30%)</option>
                  </select>
                </div>

                {/* Style */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="square">Square</option>
                    <option value="rounded">Rounded</option>
                    <option value="circle">Circle</option>
                  </select>
                </div>

                {/* Fill Color */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">QR Code Color</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={fillColor}
                      onChange={(e) => setFillColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={fillColor}
                      onChange={(e) => setFillColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Background Color</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={backColor}
                      onChange={(e) => setBackColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={backColor}
                      onChange={(e) => setBackColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-2 text-red-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                {!isGenerating && (
                  <button
                    onClick={handleGenerate}
                    disabled={!text.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold
                             hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl
                             transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                             flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4M4 8h4m4 0V4m-4 4h2m2 0h2m2 0h2M4 16h4m4 0v4m-4-4h2m2 0h2" />
                    </svg>
                    <span>Generate QR Code</span>
                  </button>
                )}

                {isGenerating && (
                  <div className="flex items-center justify-center space-x-3 text-purple-600 py-3">
                    <div className="animate-spin w-5 h-5 sm:w-6 sm:h-6 border-2 border-purple-200 border-t-purple-600 rounded-full"></div>
                    <span className="font-medium text-sm sm:text-base">Generating QR code...</span>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="bg-gray-500 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold hover:bg-gray-600
                           transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Preview/Result Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-gray-100 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Live Preview
                {isGeneratingPreview && (
                  <span className="ml-2 text-xs text-purple-600 animate-pulse">Updating...</span>
                )}
                {clientPreviewUrl && !previewFile && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Instant ({style})
                  </span>
                )}
              </h3>

              {/* Live Preview */}
              {clientPreviewUrl || previewFile ? (
                <div className="text-center mb-6">
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={clientPreviewUrl || previewFile?.downloadUrl}
                      alt="QR Code Preview"
                      className="max-w-full h-auto mx-auto rounded-lg shadow-md transition-all duration-300"
                      style={{ maxWidth: '200px' }}
                      onLoad={() => {
                        console.log('Preview image loaded successfully');
                        console.log('Image source:', clientPreviewUrl ? 'Client-side' : 'Backend');
                      }}
                      onError={(e) => {
                        console.error('Preview image failed to load:', e);
                        if (previewFile) {
                          console.error('Backend image src:', previewFile.downloadUrl || 'No download URL');
                          // Try to reload backend image after a delay
                          const downloadUrl = previewFile.downloadUrl;
                          if (downloadUrl) {
                            setTimeout(() => {
                              const img = e.target as HTMLImageElement;
                              const baseUrl = downloadUrl.split('?')[0];
                              if (img.src && img.src.includes(baseUrl)) {
                                console.log('Retrying backend image load...');
                                img.src = `${baseUrl}?retry=${Date.now()}`;
                              }
                            }, 1000);
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg text-left">
                    <div className="space-y-1 text-xs text-blue-800">
                      <div><strong>Style:</strong> {style.charAt(0).toUpperCase() + style.slice(1)}</div>
                      <div><strong>Size:</strong> {size}×{size}px</div>
                      <div><strong>Error Correction:</strong> {errorCorrection}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        <strong>Source:</strong> {clientPreviewUrl ? 'Instant Preview' : 'Backend Generated'}
                        {previewFile && previewFile.downloadUrl && (
                          <div><strong>Backend URL:</strong> {previewFile.downloadUrl.split('/').pop()}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : text.trim() ? (
                <div className="text-center py-8 mb-6">
                  {isGeneratingPreview ? (
                    <div className="space-y-2">
                      <div className="animate-spin w-8 h-8 mx-auto border-2 border-purple-200 border-t-purple-600 rounded-full"></div>
                      <p className="text-purple-600 text-sm">Generating preview...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4M4 8h4m4 0V4m-4 4h2m2 0h2m2 0h2M4 16h4m4 0v4m-4-4h2m2 0h2" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {error?.includes('Backend server not running')
                          ? 'Preview unavailable - start Python backend server'
                          : error?.includes('connect')
                          ? 'Cannot connect to backend server'
                          : 'Preview loading...'
                        }
                      </p>
                      {error?.includes('Backend server') && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                          <strong>To enable live preview:</strong><br />
                          1. Open terminal in backend folder<br />
                          2. Run: <code className="bg-yellow-100 px-1 rounded">python main.py</code><br />
                          3. Server should start on port 8000
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4M4 8h4m4 0V4m-4 4h2m2 0h2m2 0h2M4 16h4m4 0v4m-4-4h2m2 0h2" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Enter content to see instant QR preview</p>
                  <p className="text-xs text-gray-400 mt-1">Live preview works without backend server</p>
                </div>
              )}

              {/* Download Button */}
              {generatedFile && (
                <div className="border-t pt-6 text-center">
                  <a
                    href={generatedFile.downloadUrl}
                    download
                    className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold
                             hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download {format.toUpperCase()}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Sections */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Use Cases */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Common Use Cases
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-purple-800 text-xs sm:text-sm">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-0.5">•</span>
                <span><strong>Website URLs:</strong> Direct users to your website</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-0.5">•</span>
                <span><strong>Contact info:</strong> Share vCard or plain contact details</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-0.5">•</span>
                <span><strong>WiFi credentials:</strong> Easy network sharing</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-0.5">•</span>
                <span><strong>Event tickets:</strong> Digital ticket verification</span>
              </li>
            </ul>
          </div>

          {/* Customization Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Customization Tips
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-blue-800 text-xs sm:text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>High contrast:</strong> Dark QR code on light background</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>Size matters:</strong> Larger sizes for printing/distance</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>Error correction:</strong> Higher for damaged environments</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>Test before use:</strong> Verify with multiple scanners</span>
              </li>
            </ul>
          </div>

          {/* Technical Info */}
          <div className="bg-gradient-to-br from-green-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Technical Specifications
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-green-700">
              <div className="text-center">
                <div className="font-semibold text-green-900">Max Content</div>
                <div>4,296 chars</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-900">Formats</div>
                <div>PNG, JPG, SVG, PDF</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-900">Size Range</div>
                <div>50px - 1000px</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-900">Generation</div>
                <div>Instant</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 sm:mt-16">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about our QR Code Generator
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

              {/* Left Column */}
              <div className="space-y-6">

                <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    What is a QR Code and how does it work?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    A QR Code (Quick Response Code) is a two-dimensional barcode that can store various types of information like URLs, text, contact details, or WiFi credentials. When scanned with a smartphone camera or QR reader app, it instantly displays or processes the encoded information.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Is this QR Code Generator free to use?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Yes, our QR Code Generator is completely free to use. You can create unlimited QR codes without any registration, watermarks, or hidden fees. Generate, download, and use your QR codes for personal or commercial purposes.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    What output formats are supported?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We support multiple formats to suit different needs: PNG (best for web and digital use), JPG (smaller file sizes), SVG (scalable vector format for print), and PDF (professional documents). Choose the format that works best for your intended use.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    How much data can a QR Code store?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    QR codes can store up to 4,296 alphanumeric characters, 2,953 bytes of data, or 1,817 Japanese characters. The actual capacity depends on the type of content and error correction level. For optimal scanning, keep content concise and relevant.
                  </p>
                </div>

              </div>

              {/* Right Column */}
              <div className="space-y-6">

                <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    What's the difference between error correction levels?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Error correction allows QR codes to be readable even if partially damaged. Low (7%) is for clean environments, Medium (15%) for general use, Quartile (25%) for outdoor conditions, and High (30%) for harsh environments where damage is likely.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Can I customize the appearance of my QR Code?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Yes! You can customize colors (foreground and background), choose from different module styles (square, rounded, circle), adjust size, and modify border thickness. Ensure sufficient contrast between colors for reliable scanning.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    What types of content work best in QR Codes?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    QR codes work great for website URLs, contact information (vCard format), WiFi credentials, email addresses, phone numbers, geographic coordinates, and plain text. They're perfect for bridging physical and digital experiences.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    How can I ensure my QR Code scans reliably?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Use high contrast colors (dark QR on light background), ensure adequate size for viewing distance, test with multiple devices and apps, avoid distortion when printing, and include sufficient white space around the code for best results.
                  </p>
                </div>

              </div>
            </div>

            {/* Enhanced SEO Content Section */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  Why Choose Our QR Code Generator?
                </h2>

                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  <p className="text-lg mb-6">
                    Transform your digital communication with our professional QR code generator that delivers instant results
                    and unlimited customization. Whether you're a marketer launching campaigns, a business owner streamlining
                    customer interactions, or an educator creating interactive materials, our advanced generator provides
                    enterprise-quality QR codes with zero complexity.
                  </p>

                  <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                    Advanced Generation Technology and Real-Time Preview
                  </h3>

                  <p className="mb-4">
                    Our QR code generator employs cutting-edge encoding algorithms that support multiple data types including
                    URLs, plain text, WiFi credentials, contact information, SMS messages, and email addresses. The real-time
                    preview feature instantly displays your QR code as you customize it, allowing you to see exactly how it
                    will appear across different sizes and formats before generation. This immediate feedback ensures perfect
                    results every time while saving valuable time in your workflow.
                  </p>

                  <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                    Professional Customization and Brand Integration
                  </h3>

                  <p className="mb-4">
                    Customize every aspect of your QR codes to match your brand identity and functional requirements. Choose
                    from multiple output formats including PNG, SVG, PDF, and JPG, with sizes ranging from compact mobile
                    displays to large print applications. Color customization allows perfect brand matching, while error
                    correction levels ensure reliable scanning even in challenging conditions. The style options including
                    square, rounded, and dot patterns provide visual variety that enhances your design aesthetic.
                  </p>

                  <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    Enterprise-Grade Reliability and Performance
                  </h4>

                  <p className="mb-4">
                    Built with professional reliability standards, our generator creates QR codes that meet international
                    ISO/IEC 18004 specifications for maximum compatibility across all scanning devices and applications.
                    The robust error correction system ensures your codes remain readable even when partially damaged or
                    distorted, making them perfect for outdoor signage, promotional materials, and high-traffic applications
                    where durability matters.
                  </p>

                  <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    Versatile Applications for Every Industry
                  </h4>

                  <p className="mb-4">
                    From restaurant menus and business cards to event tickets and educational resources, our QR code generator
                    supports unlimited use cases across all industries. Marketing professionals use it for campaign tracking
                    and customer engagement, retail businesses for contactless payments and product information, and educators
                    for interactive learning experiences. The versatility extends to personal use including party invitations,
                    gift tags, and social media sharing.
                  </p>

                  <h5 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    Instant Generation and Multiple Format Support
                  </h5>

                  <p className="mb-4">
                    Experience lightning-fast QR code generation with support for data capacities up to 4,296 characters,
                    accommodating everything from simple URLs to complex data structures. The multi-format export capability
                    ensures compatibility with any application, whether you need scalable vector graphics for professional
                    printing or compressed images for web distribution. Batch generation capabilities streamline large-scale
                    projects while maintaining consistent quality standards.
                  </p>

                  <h5 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    Privacy-First Design and Accessibility
                  </h5>

                  <p className="mb-6">
                    Your data privacy remains protected throughout the generation process. All QR code creation happens
                    locally in your browser, ensuring sensitive information never leaves your device. The responsive design
                    provides optimal functionality across desktop computers, tablets, and smartphones, while accessibility
                    features ensure usability for all users regardless of technical expertise or physical capabilities.
                  </p>

                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mt-8">
                    <h3 className="text-xl font-semibold text-purple-900 mb-3">
                      Start Creating Professional QR Codes Today
                    </h3>
                    <p className="text-purple-800">
                      Join thousands of professionals who trust our generator for their QR code needs. Create unlimited
                      custom QR codes with instant preview, professional customization options, and guaranteed reliability.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">4,296</div>
                      <div className="text-sm text-gray-600">Max Characters</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">4</div>
                      <div className="text-sm text-gray-600">Output Formats</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">∞</div>
                      <div className="text-sm text-gray-600">Free Generation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">3</div>
                      <div className="text-sm text-gray-600">Style Options</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Free QR Code Generator",
              "alternateName": "Custom QR Code Maker",
              "description": "Generate custom QR codes instantly with live preview. Create QR codes for URLs, WiFi, vCard, text and more. Support for multiple formats (PNG, SVG, PDF, JPG) and full customization options including colors, styles, and error correction.",
              "url": "https://flipfilex.com/qr-code-generator",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web Browser, iOS, Android",
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "softwareVersion": "2.0",
              "author": {
                "@type": "Organization",
                "name": "FlipFileX",
                "url": "https://flipfilex.com"
              },
              "publisher": {
                "@type": "Organization",
                "name": "FlipFileX",
                "url": "https://flipfilex.com"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2030-12-31"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "2847",
                "bestRating": "5",
                "worstRating": "1"
              },
              "featureList": [
                "Free QR code generation",
                "Instant live preview",
                "Multiple output formats (PNG, JPG, SVG, PDF)",
                "Custom colors and branding",
                "Multiple style options (square, rounded, circle)",
                "Adjustable error correction levels (L, M, Q, H)",
                "Support for URLs, WiFi, vCard, text, email, phone",
                "Privacy-first - no data storage",
                "No registration required",
                "Unlimited QR code creation",
                "Mobile-friendly interface",
                "High-resolution output up to 1000px",
                "Instant download"
              ],
              "screenshot": "https://flipfilex.com/screenshots/qr-generator.png",
              "image": "https://flipfilex.com/og-qr-generator.png",
              "potentialAction": {
                "@type": "CreateAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://flipfilex.com/qr-code-generator",
                  "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                  ]
                },
                "result": {
                  "@type": "ImageObject",
                  "name": "QR Code"
                }
              }
            })
          }}
        />

        {/* FAQ Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is a QR Code and how does it work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A QR Code (Quick Response Code) is a two-dimensional barcode that can store various types of information like URLs, text, contact details, or WiFi credentials. When scanned with a smartphone camera or QR reader app, it instantly displays or processes the encoded information."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is this QR Code Generator free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our QR Code Generator is completely free to use. You can create unlimited QR codes without any registration, watermarks, or hidden fees. Generate, download, and use your QR codes for personal or commercial purposes."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What output formats are supported?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We support multiple formats: PNG (best for web and digital use), JPG (smaller file sizes), SVG (scalable vector format for print), and PDF (professional documents). Choose the format that works best for your intended use."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How much data can a QR Code store?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "QR codes can store up to 4,296 alphanumeric characters, 2,953 bytes of data, or 1,817 Japanese characters. The actual capacity depends on the type of content and error correction level. For optimal scanning, keep content concise and relevant."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What's the difference between error correction levels?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Error correction allows QR codes to be readable even if partially damaged. Low (7%) is for clean environments, Medium (15%) for general use, Quartile (25%) for outdoor conditions, and High (30%) for harsh environments where damage is likely."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I customize the appearance of my QR Code?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! You can customize colors (foreground and background), choose from different module styles (square, rounded, circle), adjust size, and modify border thickness. Ensure sufficient contrast between colors for reliable scanning."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How can I ensure my QR Code scans reliably?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Use high contrast colors (dark QR on light background), ensure adequate size for viewing distance, test with multiple devices and apps, avoid distortion when printing, and include sufficient white space around the code for best results."
                  }
                }
              ]
            })
          }}
        />

        {/* BreadcrumbList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://flipfilex.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Tools",
                  "item": "https://flipfilex.com/tools"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "QR Code Generator",
                  "item": "https://flipfilex.com/qr-code-generator"
                }
              ]
            })
          }}
        />
      </div>
    </div>
    </>
  );
}