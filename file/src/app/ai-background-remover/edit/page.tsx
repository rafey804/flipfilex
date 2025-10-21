'use client';

import React, { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Download, ZoomIn, ZoomOut, RotateCcw, RotateCw, FlipHorizontal,
  Crop, Plus, X, ImageIcon, Palette, Droplet, Check, Loader2
} from 'lucide-react';
import { BackgroundRemovalAPI } from '@/lib/background-removal-api';

// Nature background presets
const NATURE_BACKGROUNDS = [
  { id: 1, name: 'Beach Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100' },
  { id: 2, name: 'Mountain', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100' },
  { id: 3, name: 'Forest', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400', thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=100' },
  { id: 4, name: 'Desert', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400', thumb: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=100' },
  { id: 5, name: 'Ocean', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400', thumb: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=100' },
  { id: 6, name: 'Lake', url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400', thumb: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=100' },
  { id: 7, name: 'Waterfall', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400', thumb: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=100' },
  { id: 8, name: 'Sky', url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400', thumb: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=100' },
  { id: 9, name: 'Sunset Sky', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100' },
  { id: 10, name: 'Northern Lights', url: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400', thumb: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=100' },
  { id: 11, name: 'Canyon', url: 'https://images.unsplash.com/photo-1434394673726-e8232a5903b4?w=400', thumb: 'https://images.unsplash.com/photo-1434394673726-e8232a5903b4?w=100' },
  { id: 12, name: 'Tropical', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', thumb: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100' },
];

// Gradient presets
const GRADIENT_PRESETS = [
  { name: 'Blue Gradient', start: '59,130,246', end: '147,197,253', type: 'linear' as const, preview: 'linear-gradient(135deg, #3B82F6, #93C5FD)' },
  { name: 'Purple Gradient', start: '168,85,247', end: '192,132,252', type: 'linear' as const, preview: 'linear-gradient(135deg, #A855F7, #C084FC)' },
  { name: 'Orange Gradient', start: '249,115,22', end: '251,146,60', type: 'linear' as const, preview: 'linear-gradient(135deg, #F97316, #FB923C)' },
  { name: 'Rainbow', start: '236,72,153', end: '59,130,246', type: 'linear' as const, preview: 'linear-gradient(135deg, #EC4899, #3B82F6)' },
  { name: 'Sunset', start: '251,146,60', end: '220,38,38', type: 'linear' as const, preview: 'linear-gradient(135deg, #FB923C, #DC2626)' },
  { name: 'Forest', start: '34,197,94', end: '21,128,61', type: 'linear' as const, preview: 'linear-gradient(135deg, #22C55E, #15803D)' },
];

// Solid color presets
const COLOR_PRESETS = [
  { name: 'White', value: '255,255,255,255', hex: '#FFFFFF' },
  { name: 'Black', value: '0,0,0,255', hex: '#000000' },
  { name: 'Gray', value: '156,163,175,255', hex: '#9CA3AF' },
  { name: 'Red', value: '239,68,68,255', hex: '#EF4444' },
  { name: 'Blue', value: '59,130,246,255', hex: '#3B82F6' },
  { name: 'Green', value: '34,197,94,255', hex: '#22C55E' },
  { name: 'Purple', value: '168,85,247,255', hex: '#A855F7' },
  { name: 'Yellow', value: '234,179,8,255', hex: '#EAB308' },
  { name: 'Pink', value: '236,72,153,255', hex: '#EC4899' },
  { name: 'Orange', value: '249,115,22,255', hex: '#F97316' },
  { name: 'Teal', value: '20,184,166,255', hex: '#14B8A6' },
  { name: 'Indigo', value: '99,102,241,255', hex: '#6366F1' },
];

// Texture backgrounds
const TEXTURE_BACKGROUNDS = [
  { id: 1, name: 'Wood', url: 'https://images.unsplash.com/photo-1497672762574-a2c085b8c08b?w=400', thumb: 'https://images.unsplash.com/photo-1497672762574-a2c085b8c08b?w=100' },
  { id: 2, name: 'Marble', url: 'https://images.unsplash.com/photo-1615799998603-7c6270a45196?w=400', thumb: 'https://images.unsplash.com/photo-1615799998603-7c6270a45196?w=100' },
  { id: 3, name: 'Fabric', url: 'https://images.unsplash.com/photo-1604613428160-ce3a3d67c37d?w=400', thumb: 'https://images.unsplash.com/photo-1604613428160-ce3a3d67c37d?w=100' },
  { id: 4, name: 'Abstract', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400', thumb: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=100' },
];

function EditPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Background options
  const [activeTab, setActiveTab] = useState<'photo' | 'color' | 'blur'>('photo');
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0].value);
  const [customColor, setCustomColor] = useState('#FFFFFF');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0]);
  const [blurIntensity, setBlurIntensity] = useState(20);
  const [currentBackground, setCurrentBackground] = useState<string>('transparent');
  const [isBlurEnabled, setIsBlurEnabled] = useState(false);

  // Editing tools state
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);

  // Canvas state for drag
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // Get file from window memory (no sessionStorage to avoid quota issues)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const uploadedFile = (window as any).__uploadedFile;
    const isFromUpload = searchParams.get('upload') === 'true';

    console.log('[Edit Page] useEffect triggered:', {
      hasFile: !!uploadedFile,
      isFromUpload,
      hasSelectedFile: !!selectedFile,
      hasPreview: !!preview
    });

    // Case 1: File exists in memory - load it
    if (uploadedFile instanceof File && !selectedFile) {
      console.log('[Edit Page] Loading file from memory...');
      setSelectedFile(uploadedFile);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(uploadedFile);

      // Clear from memory and URL param
      delete (window as any).__uploadedFile;
      router.replace('/ai-background-remover/edit', { scroll: false });
      return;
    }

    // Case 2: Coming from upload (URL param) - wait for file
    if (isFromUpload) {
      console.log('[Edit Page] From upload, waiting for file or state...');
      return; // Don't redirect, wait for file to be set
    }

    // Case 3: Direct navigation without file - redirect back
    if (!selectedFile && !preview && !uploadedFile) {
      console.log('[Edit Page] No file found, redirecting back...');
      router.push('/ai-background-remover');
    }
  }, [searchParams]); // Only re-run when URL params change

  // Auto-process on file load
  useEffect(() => {
    if (selectedFile && !processedImage && !isProcessing) {
      processImage();
    }
  }, [selectedFile]);

  // Process image
  const processImage = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const blob = await BackgroundRemovalAPI.removeBackground(
        selectedFile,
        { outputFormat: 'png', edgeRefinement: 0, quality: 95 },
        (progress) => setProgress(progress.percentage)
      );

      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
      setIsProcessing(false);
      setProgress(100);
    } catch (err: any) {
      console.error('Processing failed:', err);
      setIsProcessing(false);
      setProgress(0);
    }
  }, [selectedFile]);

  // Apply background change instantly
  const applyBackground = useCallback(async (mode: string, value?: any) => {
    if (!selectedFile) return;

    try {
      let blob: Blob;

      switch (mode) {
        case 'solid':
          blob = await BackgroundRemovalAPI.removeBackground(
            selectedFile,
            { outputFormat: 'png', backgroundColor: value, edgeRefinement: 0, quality: 95 }
          );
          break;

        case 'gradient':
          blob = await BackgroundRemovalAPI.addGradientBackground(
            selectedFile,
            {
              gradientType: value.type,
              colorStart: value.start,
              colorEnd: value.end,
              outputFormat: 'png'
            }
          );
          break;

        case 'blur':
          blob = await BackgroundRemovalAPI.blurBackground(
            selectedFile,
            value,
            'png'
          );
          break;

        case 'custom':
          if (!value) return;
          const response = await fetch(value);
          const bgBlob = await response.blob();
          const bgFile = new File([bgBlob], 'background.jpg', { type: 'image/jpeg' });

          blob = await BackgroundRemovalAPI.replaceBackground(
            selectedFile,
            bgFile,
            'png'
          );
          break;

        default:
          return;
      }

      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
      setCurrentBackground(mode);
    } catch (err: any) {
      console.error('Background change failed:', err);
    }
  }, [selectedFile]);

  // One-click handlers
  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    applyBackground('solid', color);
  };

  const handleGradientClick = (gradient: typeof GRADIENT_PRESETS[0]) => {
    setSelectedGradient(gradient);
    applyBackground('gradient', gradient);
  };

  const handlePhotoClick = (url: string) => {
    applyBackground('custom', url);
  };

  const handleBlurChange = (intensity: number) => {
    setBlurIntensity(intensity);
    applyBackground('blur', intensity);
  };

  // Download
  const downloadImage = useCallback(() => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `nobg_${selectedFile?.name || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [processedImage, selectedFile]);

  // Reset
  const resetImage = () => {
    if (preview) {
      setProcessedImage('');
      setCurrentBackground('transparent');
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setImagePosition({ x: 0, y: 0 });
      processImage();
    }
  };

  // Hex to RGB
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},255`
      : '255,255,255,255';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Toolbar */}
      <div className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/ai-background-remover')}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-medium"
              >
                ← Back
              </button>
              <div className="w-px h-8 bg-gray-300" />
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-gray-700" />
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
              <div className="w-px h-8 bg-gray-300" />
              <button
                onClick={() => setFlipH(!flipH)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => setRotation(rotation - 90)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                title="Rotate Left"
              >
                <RotateCcw className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => setRotation(rotation + 90)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                title="Rotate Right"
              >
                <RotateCw className="w-5 h-5 text-gray-700" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                title="Crop"
              >
                <Crop className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-medium"
                title="Add New Image"
              >
                <Plus className="w-5 h-5" />
                Add Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setSelectedFile(file);
                    setProcessedImage('');

                    // Create preview URL (no sessionStorage)
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setPreview(event.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={resetImage}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-medium"
              >
                Reset
              </button>
              <button
                onClick={downloadImage}
                disabled={!processedImage}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center h-[calc(100vh-80px)] bg-gray-50">
        <div className="flex w-full max-w-[1400px] mx-auto">
          {/* Canvas Area - 70% */}
          <div className="flex-[0.7] flex flex-col bg-gray-50">
          {/* Image Canvas - Clean minimal design */}
          <div className="flex-1 flex flex-col items-center justify-center px-12 py-8 bg-white">
            {(processedImage || preview) ? (
              <>
                {/* Fixed container - ONLY image drags, NOT container */}
                <div className="relative w-[400px] h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                  {/* Bouncing Stars Animation - Overlay on image during processing */}
                  {isProcessing && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {/* Generate 12 stars with random positions */}
                      {[...Array(12)].map((_, i) => {
                        const positions = [
                          { top: '10%', left: '15%' },
                          { top: '20%', right: '20%' },
                          { top: '15%', left: '80%' },
                          { bottom: '25%', left: '10%' },
                          { bottom: '20%', right: '15%' },
                          { top: '45%', left: '5%' },
                          { top: '50%', right: '8%' },
                          { top: '70%', left: '12%' },
                          { bottom: '30%', right: '25%' },
                          { top: '35%', left: '88%' },
                          { bottom: '40%', left: '85%' },
                          { top: '60%', right: '82%' },
                        ];
                        const sizes = ['12px', '16px', '20px'];
                        const delays = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1];
                        const durations = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2];

                        return (
                          <motion.div
                            key={i}
                            className="absolute"
                            style={{
                              ...positions[i],
                              width: sizes[i % 3],
                              height: sizes[i % 3],
                            }}
                            animate={{
                              y: [-30, 0, -30],
                              opacity: [0.3, 1, 0.3],
                              rotate: [-10, 10, -10],
                            }}
                            transition={{
                              duration: durations[i % 7],
                              repeat: Infinity,
                              delay: delays[i],
                              ease: 'easeInOut',
                            }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ width: '100%', height: '100%' }}
                            >
                              <defs>
                                <linearGradient id={`starGradient${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#9b87f5" />
                                  <stop offset="100%" stopColor="#b8a9ff" />
                                </linearGradient>
                              </defs>
                              {/* 4-pointed star */}
                              <path
                                d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
                                fill={`url(#starGradient${i})`}
                                opacity="0.9"
                              />
                              {/* Inner glow */}
                              <circle cx="12" cy="12" r="3" fill="white" opacity="0.6" />
                            </svg>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Image - ONLY THIS drags, NOT the container */}
                  <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      scale: zoom,
                      rotate: rotation,
                      scaleX: flipH ? -1 : 1,
                      x: imagePosition.x,
                      y: imagePosition.y
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    src={processedImage || preview}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain cursor-move shadow-2xl relative z-0"
                    style={{ maxWidth: '400px', maxHeight: '400px' }}
                    draggable="false"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIsDraggingImage(true);
                      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
                    }}
                    onMouseMove={(e) => {
                      if (isDraggingImage) {
                        e.stopPropagation();
                        setImagePosition({
                          x: e.clientX - dragStart.x,
                          y: e.clientY - dragStart.y
                        });
                      }
                    }}
                    onMouseUp={() => setIsDraggingImage(false)}
                    onMouseLeave={() => setIsDraggingImage(false)}
                  />
                </div>

                {/* Add More Images Button - Below image */}
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all border border-gray-300"
                  >
                    <Plus className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Add more images to create compositions</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading image...</p>
              </div>
            )}
          </div>
        </div>

          {/* Right Sidebar - Background Options - 30% */}
          <div className="flex-[0.3] border-l border-gray-200 bg-white overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Background</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b">
              {[
                { id: 'photo' as const, label: 'Photo', icon: ImageIcon },
                { id: 'color' as const, label: 'Color', icon: Palette },
                { id: 'blur' as const, label: 'Blur', icon: Droplet }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-all ${
                    activeTab === id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* Photo Tab */}
            {activeTab === 'photo' && (
              <div className="space-y-6">
                {/* Transparent Option */}
                <div>
                  <button
                    onClick={() => {
                      setCurrentBackground('transparent');
                      processImage();
                    }}
                    className="w-full h-12 rounded-lg border-2 border-gray-300 hover:border-blue-600 transition-all flex items-center justify-center gap-2"
                    style={{
                      background: 'repeating-conic-gradient(#e5e7eb 0% 25%, #f3f4f6 0% 50%) 50% / 10px 10px'
                    }}
                  >
                    <span className="bg-white px-3 py-1 rounded-md text-sm font-semibold text-gray-700">
                      Transparent
                    </span>
                  </button>
                </div>

                {/* Nature Backgrounds */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Nature</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {NATURE_BACKGROUNDS.map((bg) => (
                      <motion.button
                        key={bg.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePhotoClick(bg.url)}
                        className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-600 transition-all shadow-md"
                      >
                        <img src={bg.thumb} alt={bg.name} className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Gradients */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Gradients</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {GRADIENT_PRESETS.map((gradient) => (
                      <motion.button
                        key={gradient.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGradientClick(gradient)}
                        className="h-16 rounded-lg border-2 border-gray-200 hover:border-blue-600 transition-all shadow-md flex items-center justify-center"
                        style={{ background: gradient.preview }}
                      >
                        <span className="text-white text-xs font-semibold drop-shadow-lg">
                          {gradient.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Textures */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Textures</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {TEXTURE_BACKGROUNDS.map((bg) => (
                      <motion.button
                        key={bg.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePhotoClick(bg.url)}
                        className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-600 transition-all shadow-md"
                      >
                        <img src={bg.thumb} alt={bg.name} className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Custom Upload */}
                <div>
                  <input
                    ref={backgroundInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const url = event.target?.result as string;
                          handlePhotoClick(url);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => backgroundInputRef.current?.click()}
                    className="w-full h-16 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Upload Custom</span>
                  </button>
                </div>
              </div>
            )}

            {/* Color Tab */}
            {activeTab === 'color' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Solid Colors</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {COLOR_PRESETS.map((color) => (
                      <motion.button
                        key={color.name}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleColorClick(color.value)}
                        className="aspect-square rounded-lg border-2 border-gray-300 hover:border-blue-600 transition-all shadow-md relative"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {currentBackground === 'solid' && selectedColor === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-6 h-6 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Custom Color</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        handleColorClick(hexToRgb(e.target.value));
                      }}
                      className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Click to choose any color</p>
                      <p className="text-xs text-gray-500 mt-1">{customColor}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blur Tab */}
            {activeTab === 'blur' && (
              <div className="space-y-6">
                {/* Blur ON/OFF Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Blur Background</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {isBlurEnabled ? 'Blur is active' : 'Click to apply blur'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newState = !isBlurEnabled;
                      setIsBlurEnabled(newState);
                      if (newState) {
                        // Apply blur
                        handleBlurChange(blurIntensity);
                      } else {
                        // Remove blur (go back to transparent)
                        setCurrentBackground('transparent');
                        processImage();
                      }
                    }}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      isBlurEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        isBlurEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Blur Intensity Slider - Only show when blur is enabled */}
                {isBlurEnabled && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Blur Intensity: {blurIntensity}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={blurIntensity}
                      onChange={(e) => handleBlurChange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Light</span>
                      <span>Strong</span>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    💡 Blur keeps your original background while making it less distracting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function EditPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <EditPageContent />
    </Suspense>
  );
}
