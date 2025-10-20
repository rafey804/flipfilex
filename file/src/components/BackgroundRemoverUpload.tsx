'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BackgroundRemoverUpload() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and navigate to editor
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

    // Convert file to base64 and store in session storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      sessionStorage.setItem('uploadedFile', JSON.stringify({
        name: file.name,
        type: file.type,
        dataUrl
      }));

      // Navigate to editing page
      router.push('/ai-background-remover/edit');
    };
    reader.readAsDataURL(file);
  }, [router]);

  // Drag and drop handlers
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left Section */}
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

          {/* Right Section - Upload */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-12">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
              </div>

              <div
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

              <p className="text-center text-gray-600 mb-2">
                or drop a file,
              </p>
              <p className="text-center text-gray-500 text-sm">
                paste image or <span className="text-blue-600 hover:underline cursor-pointer">URL</span>
              </p>

              {/* Error Message */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
