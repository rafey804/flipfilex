'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Undo2, Redo2, Loader2, Scissors, Image as ImageIcon, Wand2, Sliders, Layout, Plus } from 'lucide-react';
import { BackgroundRemovalAPI } from '@/lib/background-removal-api';

// Gradient presets
const GRADIENT_PRESETS = [
  { name: 'Purple Dream', start: '138,43,226', end: '75,0,130', type: 'linear' as const, preview: 'linear-gradient(135deg, #8a2be2, #4b0082)' },
  { name: 'Ocean Blue', start: '0,119,190', end: '0,85,255', type: 'linear' as const, preview: 'linear-gradient(135deg, #0077be, #0055ff)' },
  { name: 'Sunset', start: '255,94,77', end: '255,154,68', type: 'linear' as const, preview: 'linear-gradient(135deg, #ff5e4d, #ff9a44)' },
  { name: 'Forest', start: '34,139,34', end: '107,142,35', type: 'linear' as const, preview: 'linear-gradient(135deg, #228b22, #6b8e23)' },
  { name: 'Rose Gold', start: '255,111,97', end: '238,156,167', type: 'radial' as const, preview: 'radial-gradient(circle, #ff6f61, #ee9ca7)' },
  { name: 'Midnight', start: '25,25,112', end: '0,0,0', type: 'radial' as const, preview: 'radial-gradient(circle, #191970, #000000)' }
];

// Color presets for solid backgrounds
const COLOR_PRESETS = [
  { name: 'White', value: '255,255,255,255', hex: '#FFFFFF' },
  { name: 'Black', value: '0,0,0,255', hex: '#000000' },
  { name: 'Red', value: '239,68,68,255', hex: '#EF4444' },
  { name: 'Blue', value: '59,130,246,255', hex: '#3B82F6' },
  { name: 'Green', value: '34,197,94,255', hex: '#22C55E' },
  { name: 'Purple', value: '168,85,247,255', hex: '#A855F7' }
];

// Background suggestions for sidebar
const BACKGROUND_SUGGESTIONS = [
  { id: 1, color: '#FFFFFF', name: 'White' },
  { id: 2, color: '#F3F4F6', name: 'Light Gray' },
  { id: 3, color: '#E5E7EB', name: 'Gray' },
  { id: 4, color: '#3B82F6', name: 'Blue' },
  { id: 5, color: '#8B5CF6', name: 'Purple' },
  { id: 6, color: '#EC4899', name: 'Pink' },
];

// Sample images for quick start
const SAMPLE_IMAGES = [
  { id: 1, url: '/samples/person.jpg', alt: 'Person' },
  { id: 2, url: '/samples/dog.jpg', alt: 'Dog' },
  { id: 3, url: '/samples/car.jpg', alt: 'Car' },
  { id: 4, url: '/samples/coffee.jpg', alt: 'Coffee' },
];

interface ProcessedImage {
  id: string;
  original: File;
  processed: string;
  timestamp: number;
}

export default function BackgroundRemover() {
  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  // Tab state (Cutout, Background, Effects, Adjust, Design)
  const [activeTab, setActiveTab] = useState<'cutout' | 'background' | 'effects' | 'adjust' | 'design'>('cutout');

  // Background options state
  const [backgroundMode, setBackgroundMode] = useState<'transparent' | 'solid' | 'gradient' | 'blur' | 'custom'>('transparent');
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0].value);
  const [customColor, setCustomColor] = useState('#FFFFFF');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0]);
  const [blurIntensity, setBlurIntensity] = useState(20);
  const [customBackground, setCustomBackground] = useState<File | null>(null);

  // Advanced options
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [edgeRefinement, setEdgeRefinement] = useState(0);
  const [quality, setQuality] = useState(95);

  // Image viewer state
  const [zoom, setZoom] = useState(1);

  // History for undo/redo
  const [history, setHistory] = useState<ProcessedImage[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Multiple images
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported format. Please upload JPG, PNG, WEBP, or HEIC');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 10MB');
      return;
    }

    setError('');
    setSelectedFile(file);
    setProcessedImage('');

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Process image
  const processImage = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);
    setError('');

    try {
      let blob: Blob;

      switch (backgroundMode) {
        case 'transparent':
          blob = await BackgroundRemovalAPI.removeBackground(
            selectedFile,
            { outputFormat, edgeRefinement, quality },
            (progress) => setProgress(progress.percentage)
          );
          break;

        case 'solid':
          blob = await BackgroundRemovalAPI.removeBackground(
            selectedFile,
            { outputFormat, backgroundColor: selectedColor, edgeRefinement, quality },
            (progress) => setProgress(progress.percentage)
          );
          break;

        case 'gradient':
          blob = await BackgroundRemovalAPI.addGradientBackground(
            selectedFile,
            {
              gradientType: selectedGradient.type,
              colorStart: selectedGradient.start,
              colorEnd: selectedGradient.end,
              outputFormat
            },
            (progress) => setProgress(progress.percentage)
          );
          break;

        case 'blur':
          blob = await BackgroundRemovalAPI.blurBackground(
            selectedFile,
            blurIntensity,
            outputFormat,
            (progress) => setProgress(progress.percentage)
          );
          break;

        case 'custom':
          if (!customBackground) {
            setError('Please select a background image');
            setIsProcessing(false);
            return;
          }
          blob = await BackgroundRemovalAPI.replaceBackground(
            selectedFile,
            customBackground,
            outputFormat,
            (progress) => setProgress(progress.percentage)
          );
          break;

        default:
          throw new Error('Invalid background mode');
      }

      const url = URL.createObjectURL(blob);
      setProcessedImage(url);

      const newHistoryItem: ProcessedImage = {
        id: Date.now().toString(),
        original: selectedFile,
        processed: url,
        timestamp: Date.now()
      };

      // Add to history
      const newHistory = [...history.slice(0, historyIndex + 1), newHistoryItem];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      setIsProcessing(false);
      setProgress(100);
    } catch (err: any) {
      setError(err.message || 'Processing failed. Please try again.');
      setIsProcessing(false);
      setProgress(0);
    }
  }, [selectedFile, backgroundMode, outputFormat, edgeRefinement, quality, selectedColor, selectedGradient, blurIntensity, customBackground, history, historyIndex]);

  // Download processed image
  const downloadImage = useCallback(() => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `nobg_${selectedFile?.name || 'image'}.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [processedImage, selectedFile, outputFormat]);

  // Undo/Redo functions
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setProcessedImage(history[historyIndex - 1].processed);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setProcessedImage(history[historyIndex + 1].processed);
    }
  }, [historyIndex, history]);

  // Hex to RGB converter
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},255`
      : '255,255,255,255';
  };

  // Update custom color
  React.useEffect(() => {
    setSelectedColor(hexToRgb(customColor));
  }, [customColor]);

  // Clear selection
  const clearSelection = () => {
    setSelectedFile(null);
    setPreview('');
    setProcessedImage('');
    setError('');
    setProgress(0);
    setActiveTab('cutout');
    setHistory([]);
    setHistoryIndex(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Hero Section - Only show when no image is selected */}
      {!selectedFile && (
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left Section (40% - 2 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 relative"
            >
              {/* Yellow Flower Decorative Element */}
              <div className="absolute -left-20 -top-20 w-64 h-64 opacity-30">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="80" fill="#FFD700" opacity="0.3" />
                  <circle cx="100" cy="40" r="40" fill="#FFD700" opacity="0.5" />
                  <circle cx="160" cy="100" r="40" fill="#FFD700" opacity="0.5" />
                  <circle cx="100" cy="160" r="40" fill="#FFD700" opacity="0.5" />
                  <circle cx="40" cy="100" r="40" fill="#FFD700" opacity="0.5" />
                </svg>
              </div>

              {/* Hero Image */}
              <div className="relative z-10">
                <img
                  src="/bgremoverupper.webp"
                  alt="Remove Background Example"
                  className="rounded-3xl shadow-2xl w-full h-auto"
                />
              </div>

              {/* Heading */}
              <div className="mt-8 relative z-10">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                  Remove Image Background
                </h1>
                <p className="text-2xl font-semibold text-gray-700">
                  100% Automatically and{' '}
                  <span className="bg-yellow-300 px-2 py-1 rounded-lg">Free</span>
                </p>
              </div>
            </motion.div>

            {/* Right Section (60% - 3 cols) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              {/* Upload Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-12">
                {/* Upload Icon Above Button */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Upload className="w-10 h-10 text-blue-600" />
                  </div>
                </div>

                {/* Upload Button */}
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer transition-all duration-300 ${
                    isDragging ? 'scale-105' : ''
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold py-5 px-8 rounded-full shadow-lg mb-4 transition-colors"
                  >
                    Upload Image
                  </motion.button>
                </div>

                {/* Secondary text */}
                <p className="text-center text-gray-600 mb-2">
                  or drop a file,
                </p>
                <p className="text-center text-gray-500 text-sm">
                  paste image or <span className="text-blue-600 hover:underline cursor-pointer">URL</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Editor Interface - Show when image is selected */}
      {selectedFile && (
        <div className="min-h-screen bg-white">
          {/* Top Navigation Bar */}
          <div className="border-b bg-gray-50 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Left side - Navigation tabs */}
                <div className="flex items-center gap-2">
                  {[
                    { id: 'cutout' as const, icon: Scissors, label: 'Cutout' },
                    { id: 'background' as const, icon: ImageIcon, label: 'Background' },
                    { id: 'effects' as const, icon: Wand2, label: 'Effects' },
                    { id: 'adjust' as const, icon: Sliders, label: 'Adjust' },
                    { id: 'design' as const, icon: Layout, label: 'Design' }
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all ${
                        activeTab === id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}

                  {/* Separator */}
                  <div className="w-px h-12 bg-gray-300 mx-2" />

                  {/* Undo/Redo */}
                  <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="p-3 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Undo"
                  >
                    <Undo2 className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-3 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Redo"
                  >
                    <Redo2 className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Right side - Download button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearSelection}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-medium"
                  >
                    Clear
                  </button>
                  <div className="relative group">
                    <button
                      onClick={downloadImage}
                      disabled={!processedImage}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      Download
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Center/Left - Main Image Preview (3 cols) */}
              <div className="lg:col-span-3">
                {/* Progress Bar */}
                {isProcessing && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Processing...</span>
                      <span className="text-sm font-medium text-gray-700">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-blue-600 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Image Display */}
                <div
                  className="relative rounded-2xl overflow-hidden bg-white border-2 border-gray-200 flex items-center justify-center shadow-lg"
                  style={{
                    minHeight: '600px',
                    background: processedImage
                      ? 'repeating-conic-gradient(#e5e7eb 0% 25%, #f3f4f6 0% 50%) 50% / 20px 20px'
                      : '#f9fafb'
                  }}
                >
                  <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: zoom }}
                    src={processedImage || preview}
                    alt="Preview"
                    className="max-w-full max-h-[700px] object-contain"
                  />
                </div>

                {/* Bottom Section - Add More Images */}
                <div className="mt-6 bg-white rounded-xl border-2 border-dashed border-gray-300 p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg"
                    >
                      <Plus className="w-6 h-6" />
                    </button>

                    {/* Current image thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-300">
                      <img
                        src={processedImage || preview}
                        alt="Current"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Additional images */}
                    {additionalImages.map((img, idx) => (
                      <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-300">
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400" />
                      </div>
                    ))}

                    <span className="text-sm text-gray-500">Add more images</span>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Options (1 col) */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 sticky top-24">
                  {/* Cutout Tab */}
                  {activeTab === 'cutout' && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Cutout Settings</h3>

                      {!processedImage && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={processImage}
                          disabled={isProcessing}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                        >
                          {isProcessing ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {progress}%
                            </span>
                          ) : (
                            'Remove Background'
                          )}
                        </motion.button>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Output Format
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['png', 'jpg', 'webp'] as const).map((format) => (
                              <button
                                key={format}
                                onClick={() => setOutputFormat(format)}
                                className={`py-2 rounded-lg font-medium text-sm transition-all ${
                                  outputFormat === format
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {format.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Edge Refinement: {edgeRefinement}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={edgeRefinement}
                            onChange={(e) => setEdgeRefinement(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quality: {quality}%
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Background Tab */}
                  {activeTab === 'background' && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Background</h3>

                      {/* Background Mode Selection */}
                      <div className="space-y-2 mb-6">
                        {[
                          { mode: 'transparent' as const, label: 'Transparent', desc: 'No background' },
                          { mode: 'solid' as const, label: 'Solid Color', desc: 'Single color' },
                          { mode: 'gradient' as const, label: 'Gradient', desc: 'Color blend' },
                          { mode: 'blur' as const, label: 'Blur', desc: 'Blurred original' },
                          { mode: 'custom' as const, label: 'Custom Image', desc: 'Upload image' }
                        ].map(({ mode, label, desc }) => (
                          <button
                            key={mode}
                            onClick={() => setBackgroundMode(mode)}
                            className={`w-full text-left p-3 rounded-lg transition-all ${
                              backgroundMode === mode
                                ? 'bg-blue-100 border-2 border-blue-600'
                                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                            }`}
                          >
                            <div className="font-semibold text-gray-900 text-sm">{label}</div>
                            <div className="text-xs text-gray-600">{desc}</div>
                          </button>
                        ))}
                      </div>

                      {/* Color Options */}
                      {backgroundMode === 'solid' && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 text-sm">Select Color</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {BACKGROUND_SUGGESTIONS.map((bg) => (
                              <button
                                key={bg.id}
                                onClick={() => setSelectedColor(hexToRgb(bg.color))}
                                className={`aspect-square rounded-lg border-2 transition-all ${
                                  selectedColor === hexToRgb(bg.color)
                                    ? 'border-blue-600 scale-110'
                                    : 'border-gray-300 hover:border-blue-400'
                                }`}
                                style={{ backgroundColor: bg.color }}
                                title={bg.name}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-gray-700">Custom:</label>
                            <input
                              type="color"
                              value={customColor}
                              onChange={(e) => setCustomColor(e.target.value)}
                              className="w-12 h-8 rounded cursor-pointer"
                            />
                          </div>
                        </div>
                      )}

                      {/* Gradient Options */}
                      {backgroundMode === 'gradient' && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 text-sm mb-2">Select Gradient</h4>
                          {GRADIENT_PRESETS.map((gradient) => (
                            <button
                              key={gradient.name}
                              onClick={() => setSelectedGradient(gradient)}
                              className={`w-full h-12 rounded-lg border-2 transition-all ${
                                selectedGradient.name === gradient.name
                                  ? 'border-blue-600 scale-105'
                                  : 'border-transparent hover:border-blue-400'
                              }`}
                              style={{ background: gradient.preview }}
                            >
                              <div className="text-white text-xs font-semibold drop-shadow-lg">{gradient.name}</div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Blur Options */}
                      {backgroundMode === 'blur' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Blur Intensity: {blurIntensity}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={blurIntensity}
                            onChange={(e) => setBlurIntensity(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      )}

                      {/* Custom Background Upload */}
                      {backgroundMode === 'custom' && (
                        <div>
                          <input
                            ref={backgroundInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files && setCustomBackground(e.target.files[0])}
                            className="hidden"
                          />
                          <button
                            onClick={() => backgroundInputRef.current?.click()}
                            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm"
                          >
                            {customBackground ? (
                              <span className="text-green-600 font-semibold">
                                ✓ {customBackground.name}
                              </span>
                            ) : (
                              <span className="text-gray-600">
                                Click to upload
                              </span>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Effects Tab */}
                  {activeTab === 'effects' && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Effects</h3>
                      <p className="text-gray-600 text-sm">Effects coming soon...</p>
                    </div>
                  )}

                  {/* Adjust Tab */}
                  {activeTab === 'adjust' && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Adjust</h3>
                      <p className="text-gray-600 text-sm">Adjustment tools coming soon...</p>
                    </div>
                  )}

                  {/* Design Tab */}
                  {activeTab === 'design' && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Design</h3>
                      <p className="text-gray-600 text-sm">Design templates coming soon...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
