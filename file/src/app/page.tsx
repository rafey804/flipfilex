'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ApiService } from '@/lib/api';
import { HealthStatus } from '@/types';
import './globals.css';

export default function HomePage() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState<any[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const status = await ApiService.checkHealth();
        setHealthStatus(status);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
  }, []);

  // All tools for search
  const allTools = [
    { name: 'PDF to Word', href: '/convert-pdf-to-word-online', description: 'Convert PDF to editable Word documents', category: 'PDF' },
    { name: 'Word to PDF', href: '/word-to-pdf-online', description: 'Convert Word to PDF format', category: 'PDF' },
    { name: 'Merge PDFs', href: '/merge-pdf-files-free', description: 'Combine multiple PDF files', category: 'PDF' },
    { name: 'Split PDF', href: '/split-pdf-pages', description: 'Split PDF into separate pages', category: 'PDF' },
    { name: 'Compress PDF', href: '/compress-pdf', description: 'Reduce PDF file size', category: 'PDF' },
    { name: 'PDF to Images', href: '/pdf-to-images', description: 'Convert PDF pages to images', category: 'PDF' },
    { name: 'AI Background Remover', href: '/ai-background-remover', description: 'Remove backgrounds with AI in seconds', category: 'Image' },
    { name: 'Image Compress', href: '/image-compressor', description: 'Compress images up to 90%', category: 'Image' },
    { name: 'PNG to WebP', href: '/png-to-webp-converter', description: 'Convert PNG to WebP format', category: 'Image' },
    { name: 'AVIF to PNG', href: '/avif-to-png', description: 'Convert AVIF to PNG format', category: 'Image' },
    { name: 'WebP to PNG', href: '/webp-to-png', description: 'Convert WebP to PNG format', category: 'Image' },
    { name: 'JPG to PNG', href: '/jpg-to-png', description: 'Convert JPG to PNG format', category: 'Image' },
    { name: 'PNG to JPG', href: '/png-to-jpg', description: 'Convert PNG to JPG format', category: 'Image' },
    { name: 'HEIC to JPG', href: '/heic-to-jpg', description: 'Convert iPhone photos to JPG', category: 'Image' },
    { name: 'MP4 to MOV', href: '/mp4-to-mov', description: 'Convert MP4 to MOV format', category: 'Video' },
    { name: 'MOV to MP4', href: '/mov-to-mp4', description: 'Convert MOV to MP4 format', category: 'Video' },
    { name: 'MKV to MP4', href: '/mkv-to-mp4', description: 'Convert MKV to MP4 format', category: 'Video' },
    { name: 'WAV to MP3', href: '/wav-to-mp3', description: 'Convert WAV to MP3 format', category: 'Audio' },
    { name: 'MP3 to WAV', href: '/mp3-to-wav', description: 'Convert MP3 to WAV format', category: 'Audio' },
    { name: 'FLAC to MP3', href: '/flac-to-mp3', description: 'Convert FLAC to MP3 format', category: 'Audio' },
    { name: 'Resume Builder', href: '/resume-builder', description: 'Create professional resumes', category: 'Utility' },
    { name: 'Invoice Generator', href: '/invoice-generator', description: 'Generate business invoices', category: 'Utility' },
    { name: 'QR Code Generator', href: '/qr-code-generator', description: 'Create custom QR codes', category: 'Utility' },
    { name: 'Barcode Generator', href: '/barcode-generator', description: 'Generate various barcodes', category: 'Utility' },
    { name: 'Password Generator', href: '/password-generator', description: 'Create secure passwords', category: 'Utility' },
    { name: 'Hash Generator', href: '/hash-generator', description: 'Generate cryptographic hashes', category: 'Utility' },
    { name: 'Color Picker', href: '/color-palette-generator', description: 'Generate color palettes', category: 'Utility' },
    { name: 'Font Converter', href: '/font-converter', description: 'Convert fonts between different formats', category: 'Font' }
  ];

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredTools([]);
    } else {
      const filtered = allTools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTools(filtered);
    }
  };

  const features = [
    {
      title: 'PDF to Word',
      description: 'Convert PDF documents to editable Word files while preserving formatting and layout integrity with advanced OCR technology',
      icon: '📝',
      href: '/convert-pdf-to-word-online',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      gradient: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',
    },
    {
      title: 'Word to PDF',
      description: 'Transform Word documents into professional, print-ready PDF files with maintained formatting and cross-platform compatibility',
      icon: '📄',
      href: '/word-to-pdf-online',
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      gradient: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5',
    },
    {
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into a single document with customizable page order and advanced compression options',
      icon: '🔗',
      href: '/merge-pdf-files-free',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      gradient: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5',
    },
    {
      title: 'PDF to Images',
      description: 'Convert PDF pages to high-quality PNG images with adjustable resolution settings and batch processing capabilities',
      icon: '🖼️',
      href: '/pdf-to-images-converter',
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'hover:from-pink-600 hover:to-pink-700',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      gradient: 'bg-gradient-to-br from-pink-500/10 to-pink-600/5',
    },
    {
      title: 'PNG to WebP',
      description: 'Convert PNG images to modern WebP format for faster loading, smaller file sizes, and better web performance',
      icon: '🌐',
      href: '/png-to-webp',
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      gradient: 'bg-gradient-to-br from-teal-500/10 to-teal-600/5',
    },
    {
      title: 'AVIF to PNG',
      description: 'Convert modern AVIF images to widely supported PNG format for better compatibility across all platforms and browsers',
      icon: '🎨',
      href: '/avif-to-png',
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      gradient: 'bg-gradient-to-br from-indigo-500/10 to-indigo-600/5',
    },
    {
      title: 'WebP to PNG',
      description: 'Convert WebP images to PNG format while preserving transparency, image quality, and metadata information',
      icon: '📸',
      href: '/webp-to-png',
      color: 'from-cyan-500 to-cyan-600',
      hoverColor: 'hover:from-cyan-600 hover:to-cyan-700',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
      gradient: 'bg-gradient-to-br from-cyan-500/10 to-cyan-600/5',
    },
    {
      title: 'WAV to MP3',
      description: 'Convert WAV audio files to compressed MP3 format with customizable quality settings and metadata preservation',
      icon: '🎵',
      href: '/wav-to-mp3-converter',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      gradient: 'bg-gradient-to-br from-orange-500/10 to-orange-600/5',
    },
    {
      title: 'MP3 to WAV',
      description: 'Convert compressed MP3 files to lossless WAV format for professional audio editing and production',
      icon: '🎶',
      href: '/mp3-to-wav',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      gradient: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5',
    },
    {
      title: 'FLAC to MP3',
      description: 'Convert lossless FLAC audio files to portable MP3 format while maintaining excellent sound quality',
      icon: '🎼',
      href: '/flac-to-mp3',
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      gradient: 'bg-gradient-to-br from-indigo-500/10 to-indigo-600/5',
    },
    {
      title: 'AAC to MP3',
      description: 'Convert Apple AAC audio format to universal MP3 for better compatibility across all devices and platforms',
      icon: '🎤',
      href: '/aac-to-mp3',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      gradient: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',
    },
    {
      title: 'M4A to MP3',
      description: 'Convert iTunes M4A audio files to MP3 format for universal playback on any device or media player',
      icon: '🎧',
      href: '/m4a-to-mp3',
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'hover:from-pink-600 hover:to-pink-700',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      gradient: 'bg-gradient-to-br from-pink-500/10 to-pink-600/5',
    },
    {
      title: 'JPG to PNG',
      description: 'Convert JPG images to PNG format for better quality, transparency support, and lossless image compression',
      icon: '🖼️',
      href: '/jpg-to-png',
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      gradient: 'bg-gradient-to-br from-red-500/10 to-red-600/5',
    },
    {
      title: 'Excel to PDF',
      description: 'Convert Excel spreadsheets to professional PDF documents with preserved formatting and layout',
      icon: '📊',
      href: '/excel-to-pdf',
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'hover:from-emerald-600 hover:to-teal-700',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      gradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-600/5',
    },
    {
      title: 'PowerPoint to PDF',
      description: 'Transform PowerPoint presentations into secure, shareable PDF documents with maintained quality',
      icon: '📺',
      href: '/powerpoint-to-pdf',
      color: 'from-orange-500 to-red-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      gradient: 'bg-gradient-to-br from-orange-500/10 to-red-600/5',
    },
    {
      title: 'Text to PDF',
      description: 'Convert plain text files to formatted PDF documents with customizable styling and layout options',
      icon: '📃',
      href: '/text-to-pdf',
      color: 'from-gray-500 to-slate-600',
      hoverColor: 'hover:from-gray-600 hover:to-slate-700',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      gradient: 'bg-gradient-to-br from-gray-500/10 to-slate-600/5',
    },
    {
      title: 'HTML to PDF',
      description: 'Convert HTML web pages to PDF format while preserving styling, layout, and interactive elements',
      icon: '🌐',
      href: '/html-to-pdf',
      color: 'from-cyan-500 to-blue-600',
      hoverColor: 'hover:from-cyan-600 hover:to-blue-700',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
      gradient: 'bg-gradient-to-br from-cyan-500/10 to-blue-600/5',
    },
    {
      title: 'CSV to Excel',
      description: 'Transform CSV data files into Excel spreadsheets with proper formatting and data organization',
      icon: '📋',
      href: '/csv-to-excel',
      color: 'from-lime-500 to-green-600',
      hoverColor: 'hover:from-lime-600 hover:to-green-700',
      bgColor: 'bg-lime-50',
      textColor: 'text-lime-600',
      gradient: 'bg-gradient-to-br from-lime-500/10 to-green-600/5',
    },
    {
      title: 'JSON to CSV',
      description: 'Convert JSON data structures to CSV format for easy data analysis and spreadsheet compatibility',
      icon: '🔄',
      href: '/json-to-csv',
      color: 'from-violet-500 to-purple-600',
      hoverColor: 'hover:from-violet-600 hover:to-purple-700',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
      gradient: 'bg-gradient-to-br from-violet-500/10 to-purple-600/5',
    },
    {
      title: 'OGG to MP3',
      description: 'Convert open-source OGG audio files to universal MP3 format for better compatibility and portability',
      icon: '🔊',
      href: '/ogg-to-mp3',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      gradient: 'bg-gradient-to-br from-green-500/10 to-green-600/5',
    },
    {
      title: 'WMA to MP3',
      description: 'Convert Windows Media Audio files to MP3 format for universal compatibility across all platforms',
      icon: '🎺',
      href: '/wma-to-mp3',
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      gradient: 'bg-gradient-to-br from-red-500/10 to-red-600/5',
    },
    {
      title: 'PNG to JPG',
      description: 'Convert PNG images to JPG format for smaller file sizes and better web performance optimization',
      icon: '📷',
      href: '/png-to-jpg',
      color: 'from-yellow-500 to-yellow-600',
      hoverColor: 'hover:from-yellow-600 hover:to-yellow-700',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      gradient: 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5',
    },
    {
      title: 'SVG to PNG',
      description: 'Convert scalable vector SVG images to PNG raster format for wider compatibility and usage',
      icon: '🎯',
      href: '/svg-to-png',
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      gradient: 'bg-gradient-to-br from-teal-500/10 to-teal-600/5',
    },
    {
      title: 'GIF to PNG',
      description: 'Convert animated or static GIF images to PNG format for better quality and modern web standards',
      icon: '🎭',
      href: '/gif-to-png',
      color: 'from-pink-500 to-rose-600',
      hoverColor: 'hover:from-pink-600 hover:to-rose-700',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      gradient: 'bg-gradient-to-br from-pink-500/10 to-rose-600/5',
    },
    {
      title: 'QR Code Generator',
      description: 'Create professional QR codes for URLs, text, contact info, WiFi credentials, and more with custom styling',
      icon: '🔳',
      href: '/qr-code-generator',
      color: 'from-violet-500 to-purple-600',
      hoverColor: 'hover:from-violet-600 hover:to-purple-700',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
      gradient: 'bg-gradient-to-br from-violet-500/10 to-purple-600/5',
    },
    {
      title: 'Image Compressor',
      description: 'Reduce image file sizes up to 90% while maintaining quality. Support for JPEG, PNG, WebP formats up to 200MB',
      icon: '🗜️',
      href: '/image-compressor',
      color: 'from-orange-500 to-red-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      gradient: 'bg-gradient-to-br from-orange-500/10 to-red-600/5',
    },
    {
      title: 'OCR - Image to Text',
      description: 'Extract text from images using advanced AI technology. Support for 100+ languages with high accuracy recognition',
      icon: '📄',
      href: '/ocr-image-to-text',
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'hover:from-emerald-600 hover:to-teal-700',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      gradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-600/5',
    }
  ];

  const imageConverterTools = [
    { name: 'Image Compressor', href: '/image-compressor', description: 'Reduce file sizes up to 90%', icon: '🗜️', popular: true },
    { name: 'PNG to WebP', href: '/png-to-webp', description: 'Next-gen web format', icon: '🌐', popular: true },
    { name: 'AVIF to PNG', href: '/avif-to-png', description: 'Universal compatibility', icon: '🎨', popular: true },
    { name: 'WebP to PNG', href: '/webp-to-png', description: 'Wide support', icon: '📸', popular: true },
    { name: 'JPG to PNG', href: '/jpg-to-png', description: 'Quality preservation', icon: '🖼️', popular: false },
    { name: 'PNG to JPG', href: '/png-to-jpg', description: 'Smaller file sizes', icon: '📷', popular: false },
    { name: 'SVG to PNG', href: '/svg-to-png', description: 'Vector to raster', icon: '🎯', popular: false },
    { name: 'GIF to PNG', href: '/gif-to-png', description: 'Static conversion', icon: '🎭', popular: false },
    { name: 'BMP to PNG', href: '/bmp-to-png', description: 'Modern format', icon: '🎪', popular: false },
    { name: 'TIFF to PNG', href: '/tiff-to-png', description: 'Professional format', icon: '📋', popular: false },
    { name: 'HEIC to JPG', href: '/heic-to-jpg', description: 'iPhone photos', icon: '📱', popular: true },
    { name: 'ICO to PNG', href: '/ico-to-png', description: 'Icon conversion', icon: '🔷', popular: false },
    { name: 'JPEG to WebP', href: '/jpeg-to-webp', description: 'Web optimization', icon: '⚡', popular: false }
  ];

  const videoConverterTools = [
    { name: 'MP4 to MOV', href: '/mp4-to-mov', description: 'Apple QuickTime', icon: '🎬', popular: true },
    { name: 'MOV to MP4', href: '/mov-to-mp4', description: 'Universal playback', icon: '📺', popular: true },
    { name: 'AVI to MP4', href: '/avi-to-mp4', description: 'Modern compression', icon: '🎞️', popular: false },
    { name: 'MKV to MP4', href: '/mkv-to-mp4', description: 'Streaming ready', icon: '📹', popular: true },
    { name: 'WebM to MP4', href: '/webm-to-mp4', description: 'Cross-platform', icon: '🌐', popular: false },
    { name: 'FLV to MP4', href: '/flv-to-mp4', description: 'Legacy conversion', icon: '📼', popular: false },
    { name: 'WMV to MP4', href: '/wmv-to-mp4', description: 'Windows format', icon: '🪟', popular: false },
    { name: 'MP4 to WebM', href: '/mp4-to-webm', description: 'Web optimized', icon: '⚡', popular: false }
  ];

  const audioConverterTools = [
    { name: 'WAV to MP3', href: '/wav-to-mp3', description: 'Lossless to compressed', icon: '🎵', popular: true },
    { name: 'MP3 to WAV', href: '/mp3-to-wav', description: 'Compressed to lossless', icon: '🎶', popular: true },
    { name: 'FLAC to MP3', href: '/flac-to-mp3', description: 'Lossless to portable', icon: '🎼', popular: true },
    { name: 'AAC to MP3', href: '/aac-to-mp3', description: 'Apple to universal', icon: '🎤', popular: false },
    { name: 'M4A to MP3', href: '/m4a-to-mp3', description: 'iTunes to universal', icon: '🎧', popular: true },
    { name: 'OGG to MP3', href: '/ogg-to-mp3', description: 'Open source to standard', icon: '🔊', popular: false },
    { name: 'WMA to MP3', href: '/wma-to-mp3', description: 'Windows to universal', icon: '🎺', popular: false },
    { name: 'MP3 to AAC', href: '/mp3-to-aac', description: 'Universal to Apple', icon: '🎻', popular: false }
  ];

  const benefits = [
    {
      icon: '⚡',
      title: 'Lightning Fast Processing',
      description: 'Advanced multi-core algorithms ensure quick processing without compromising quality. Average conversion time: 15-30 seconds.',
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200'
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Military-grade encryption with automatic file deletion after processing. Zero-knowledge architecture ensures complete privacy.',
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    {
      icon: '🎯',
      title: 'Smart Interface',
      description: 'AI-powered drag-and-drop interface with real-time processing feedback and intelligent format detection.',
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: '📱',
      title: 'Universal Access',
      description: 'Seamlessly works on desktop, tablet, and mobile devices with progressive web app technology.',
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director at TechCorp",
      content: "FlipFileX has revolutionized our document workflow. The PDF to Word conversion maintains perfect formatting, saving us hours of manual work every day.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Michael Chen",
      role: "Freelance Designer",
      content: "The image conversion tools are phenomenal! Converting AVIF to PNG and WebP conversions are lightning-fast with pristine quality. A game-changer for my workflow.",
      rating: 5,
      avatar: "👨‍🎨"
    },
    {
      name: "Emily Rodriguez",
      role: "Legal Assistant", 
      content: "Security and reliability are paramount in legal work. FlipFileX delivers both with enterprise-grade encryption and consistent professional quality results.",
      rating: 5,
      avatar: "👩‍⚖️"
    }
  ];

  const faqs = [
    {
      question: "How fast is your conversion process?",
      answer: "Our advanced multi-core processing engines deliver industry-leading speeds. Most conversions complete within 15-30 seconds, with simple image conversions taking just 5-10 seconds. File size and complexity affect timing, but our optimized infrastructure ensures consistently fast performance. We use distributed cloud servers across multiple regions to ensure minimal latency regardless of your location. For bulk conversions, our parallel processing system can handle up to 50 files simultaneously, making it ideal for professional workflows."
    },
    {
      question: "What file size limits do you have?",
      answer: "You can convert files up to 100MB per upload. For PDF conversions, this typically handles 200+ page documents. Image files can be up to 50MP resolution. For larger enterprise needs, contact us for custom solutions with higher limits. We've optimized our infrastructure to handle large files efficiently while maintaining fast processing speeds. Business users can request increased limits through our enterprise plan."
    },
    {
      question: "How secure are my files during conversion?",
      answer: "We employ bank-level AES-256 encryption for all transfers and processing. Files are automatically deleted from our servers within 1 hour, with zero human access. We're GDPR compliant and SOC 2 certified, ensuring your data remains completely private. Our servers are hosted in secure data centers with 24/7 monitoring, DDoS protection, and regular security audits. We never store, analyze, or share your files with third parties. All connections use HTTPS with TLS 1.3 for maximum security."
    },
    {
      question: "Do you support bulk/batch conversions?",
      answer: "Absolutely! Upload multiple files simultaneously for batch processing. Perfect for converting entire photo albums, document sets, or media libraries. The interface shows individual progress for each file with estimated completion times. You can convert up to 50 files at once with our batch processor. The system intelligently queues and processes files in parallel to maximize speed while maintaining quality. Great for photographers, designers, and businesses processing large volumes of files daily."
    },
    {
      question: "What image and video formats are supported?",
      answer: "We support 25+ formats including PNG, WebP, AVIF, JPG, JPEG, SVG, GIF, BMP, TIFF, HEIC, ICO for images. Video formats include MP4, MOV, AVI, MKV, WebM, FLV, WMV with full metadata preservation and quality options. For documents, we support PDF, DOCX, DOC, XLSX, XLS, PPTX, PPT, ODT, RTF, TXT. Audio formats include MP3, WAV, FLAC, AAC, OGG, M4A. We constantly add new formats based on user requests and industry standards."
    },
    {
      question: "Is there a quality loss during conversion?",
      answer: "Our smart algorithms minimize quality loss through advanced compression techniques. For lossless formats (PNG, TIFF), quality is preserved completely. For lossy formats, we offer customizable quality settings from web-optimized to maximum quality. Our AI-powered optimization analyzes each file to determine the best compression parameters that maintain visual quality while reducing file size. You have full control over the quality-size tradeoff with our advanced settings panel."
    },
    {
      question: "Can I use this on mobile devices?",
      answer: "Yes! Our responsive design works flawlessly on all devices including iPhone, iPad, Android phones and tablets. We also offer a Progressive Web App (PWA) that can be installed on your phone for app-like experience with offline capabilities for recently converted files. The mobile interface is optimized for touch interactions with large buttons and intuitive gestures. You can convert files on-the-go without downloading any app from the app store."
    },
    {
      question: "Do you offer API access for developers?",
      answer: "We provide REST APIs for enterprise customers with comprehensive documentation, SDKs for popular languages (Python, JavaScript, PHP, Ruby, Java), and dedicated support. Contact our enterprise team for API keys, pricing, and integration assistance. Our API supports all conversion types with webhook callbacks for async processing. Perfect for integrating file conversion into your applications, websites, or automated workflows."
    },
    {
      question: "Are the conversions really free?",
      answer: "Yes! FlipFileX offers completely free file conversions with no hidden charges, subscriptions, or limits on daily usage. We support our platform through optional premium features and non-intrusive ads. You never need to create an account or provide payment information for basic conversions. Our mission is to make professional-grade file conversion accessible to everyone worldwide."
    },
    {
      question: "What makes FlipFileX different from other converters?",
      answer: "FlipFileX stands out with enterprise-grade security, faster processing speeds, support for 200+ conversion tools, no registration required, and completely free access. We use advanced AI algorithms for optimal quality, provide detailed conversion settings for professionals, and maintain 99.9% uptime. Unlike competitors, we don't compress or watermark your files unless you specifically request it. Our platform is built by developers for developers, designers, and professionals who need reliable, high-quality conversions."
    },
    {
      question: "How do you handle document formatting during PDF conversions?",
      answer: "Our advanced OCR and layout recognition technology preserves formatting, fonts, images, tables, headers, footers, and document structure during PDF conversions. We use machine learning models trained on millions of documents to accurately detect and maintain formatting elements. For PDF to Word conversions, we preserve editability while maintaining the original layout. Complex documents with multiple columns, embedded images, and custom fonts are handled with exceptional accuracy."
    },
    {
      question: "Can I convert password-protected or encrypted files?",
      answer: "For security reasons, password-protected files must be unlocked before conversion. We provide a secure password input option where the password is used only for decryption and immediately discarded. The converted file can optionally be re-encrypted with the same or different password. This ensures your sensitive documents remain protected throughout the conversion process while giving you full control over file security."
    }
  ];

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 bg-pattern-dots">
        {/* Particle Background */}
        <div className="particles fixed inset-0 pointer-events-none z-0">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-0 right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
          </div>

          <div className="px-4 py-12 sm:py-16 md:py-20 lg:py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="mb-6 sm:mb-8 animate-fade-in">
                <div className="mb-6 sm:mb-8">
                  <img src="/logo.webp" alt="FlipFileX Logo" className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 mx-auto hover:scale-110 transition-transform duration-300 animate-logo-loop" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight tracking-tight px-2">
                  All-in-One Digital Tools Platform
                </h1>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto leading-relaxed font-light px-4">
                  Convert, Create, and Optimize - Everything You Need in One Place
                </p>

                {/* Enhanced Search Bar */}
                <div className="max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
                  <div className="relative">
                    {/* Search Input Container */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl sm:rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                      <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/50 p-1.5 sm:p-2 search-glow">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0">
                          {/* Search Icon and Input */}
                          <div className="flex items-center flex-1">
                            <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg md:text-xl ml-1.5 sm:ml-2 shadow-lg search-icon-bounce flex-shrink-0">
                              🔍
                            </div>

                            {/* Input Field */}
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => handleSearch(e.target.value)}
                              placeholder="Search tools..."
                              className="flex-1 px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 sm:placeholder-gray-500 font-medium search-input transition-all duration-300"
                            />

                            {/* Clear Button */}
                            {searchQuery && (
                              <button
                                onClick={() => {
                                  setSearchQuery('');
                                  setFilteredTools([]);
                                }}
                                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors mr-1.5 sm:mr-2 flex-shrink-0"
                              >
                                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>

                          {/* Search Button - Below on mobile, inline on desktop */}
                          <button
                            onClick={() => handleSearch(searchQuery)}
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 sm:px-6 md:px-8 py-3 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl click-effect sm:mr-2"
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quick Suggestions */}
                    {!searchQuery && (
                      <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 w-full text-center">Popular searches:</div>
                        {['PDF to Word', 'Image Compress', 'QR Code', 'Resume Builder', 'PNG to WebP'].map((suggestion, index) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSearch(suggestion)}
                            className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 text-gray-700 hover:text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Enhanced Search Results */}
                    {searchQuery && (
                      <div className="mt-4 sm:mt-6 relative px-2">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl sm:rounded-3xl blur-sm">
                        </div>
                        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/50 overflow-hidden">
                          {filteredTools.length > 0 ? (
                            <div>
                              {/* Results Header */}
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200/50">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm mr-2 sm:mr-3">
                                      {filteredTools.length}
                                    </div>
                                    <span className="hidden sm:inline">Search Results</span>
                                    <span className="sm:hidden">Results</span>
                                  </h3>
                                  <div className="text-xs sm:text-sm text-gray-600">
                                    {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
                                  </div>
                                </div>
                              </div>

                              {/* Results List */}
                              <div className="max-h-80 overflow-y-auto">
                                {filteredTools.map((tool, index) => (
                                  <Link
                                    key={tool.name}
                                    href={tool.href}
                                    className="block hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 border-b border-gray-100/50 last:border-b-0 group result-item"
                                    onClick={() => {
                                      setSearchQuery('');
                                      setFilteredTools([]);
                                    }}
                                  >
                                    <div className="p-3 sm:p-4 md:p-6 flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                                      {/* Tool Icon */}
                                      <div className="flex-shrink-0">
                                        <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl md:text-2xl shadow-md sm:shadow-lg transition-transform group-hover:scale-110 ${
                                          tool.category === 'PDF' ? 'bg-gradient-to-r from-red-400 to-pink-500' :
                                          tool.category === 'Image' ? 'bg-gradient-to-r from-green-400 to-blue-500' :
                                          tool.category === 'Video' ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
                                          tool.category === 'Audio' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                          'bg-gradient-to-r from-blue-400 to-purple-500'
                                        }`}>
                                          {
                                            tool.category === 'PDF' ? '📄' :
                                            tool.category === 'Image' ? '🖼️' :
                                            tool.category === 'Video' ? '🎦' :
                                            tool.category === 'Audio' ? '🎧' :
                                            '🛠️'
                                          }
                                        </div>
                                      </div>

                                      {/* Tool Info */}
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-0.5 sm:mb-1">
                                          {tool.name}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-700 transition-colors line-clamp-1 sm:line-clamp-none">
                                          {tool.description}
                                        </p>
                                      </div>

                                      {/* Category & Arrow */}
                                      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
                                        <span className={`hidden sm:inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                                          tool.category === 'PDF' ? 'bg-red-100 text-red-700' :
                                          tool.category === 'Image' ? 'bg-green-100 text-green-700' :
                                          tool.category === 'Video' ? 'bg-purple-100 text-purple-700' :
                                          tool.category === 'Audio' ? 'bg-yellow-100 text-yellow-700' :
                                          'bg-blue-100 text-blue-700'
                                        }`}>
                                          {tool.category}
                                        </span>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="p-6 sm:p-8 md:p-12 text-center">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6 animate-pulse">
                                🔍
                              </div>
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">No tools found</h3>
                              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">We couldn't find any tools matching your search.</p>
                              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                                <span className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 w-full">Try searching for:</span>
                                {['PDF', 'Image', 'Convert', 'Generator', 'Compress'].map((suggestion) => (
                                  <button
                                    key={suggestion}
                                    onClick={() => handleSearch(suggestion)}
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-10 md:mb-12 mt-6 sm:mt-8 px-4">
                  <Link href="/convert-pdf-to-word-online" className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg sm:shadow-xl text-base sm:text-lg hover-lift click-effect animate-pulse-glow text-center">
                    🔥 Start Converting
                  </Link>
                  <Link href="/tools" className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 text-base sm:text-lg hover-glow click-effect text-center">
                    📋 Browse All Tools
                  </Link>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Popular/Featured Tools Section */}
        <section className="px-4 py-12 sm:py-14 md:py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3 px-4">
              🔥 Most Popular Tools
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">Our top-rated tools trusted by millions</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-12 sm:mb-14 md:mb-16">
            {[
              { name: 'PDF to Word', href: '/convert-pdf-to-word-online', icon: '📝', badge: 'HOT', badgeColor: 'bg-red-500' },
              { name: 'Image Compress', href: '/image-compressor', icon: '🗜️', badge: 'HOT', badgeColor: 'bg-red-500' },
              { name: 'Compress PDF', href: '/compress-pdf', icon: '📄', badge: 'TOP', badgeColor: 'bg-orange-500' },
              { name: 'Resume Builder', href: '/resume-builder', icon: '📋', badge: 'Featured', badgeColor: 'bg-purple-500' },
              { name: 'QR Code Generator', href: '/qr-code-generator', icon: '🔳', badge: 'Popular', badgeColor: 'bg-green-500' },
              { name: 'Color Picker', href: '/color-palette-generator', icon: '🎨', badge: 'New', badgeColor: 'bg-blue-500' },
              { name: 'Invoice Generator', href: '/invoice-generator', icon: '🧾', badge: 'Featured', badgeColor: 'bg-purple-500' },
              { name: 'Password Generator', href: '/password-generator', icon: '🔐', badge: 'Secure', badgeColor: 'bg-emerald-500' }
            ].map((tool, index) => (
              <Link key={tool.name} href={tool.href} className="relative group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 hover-lift hover-glow click-effect animate-bounce-in" style={{animationDelay: `${index * 100}ms`}}>
                <div className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 ${tool.badgeColor} text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full`}>
                  {tool.badge}
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">{tool.icon}</div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm md:text-sm group-hover:text-blue-600 transition-colors leading-tight">{tool.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Tools Categories Grid */}
        <section className="px-4 py-12 sm:py-16 md:py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Tools Categories</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Professional-grade tools organized by category for all your conversion needs
            </p>
          </div>

          {/* Row 1: Document Tools */}
          <div className="mb-10 sm:mb-12 md:mb-16">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8">
              <div className="flex items-center mb-6 sm:mb-8">
                <div className="text-3xl sm:text-4xl mr-3 sm:mr-4">📄</div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">PDF Tools</h3>
                  <p className="text-sm sm:text-base text-gray-600">Complete PDF processing suite</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                {[
                  { name: 'PDF to Word', href: '/convert-pdf-to-word-online', desc: 'Convert with precision' },
                  { name: 'Word to PDF', href: '/word-to-pdf-online', desc: 'Professional formatting' },
                  { name: 'Merge PDFs', href: '/merge-pdf-files-free', desc: 'Combine multiple files' },
                  { name: 'Split PDF', href: '/split-pdf-pages', desc: 'Extract specific pages' },
                  { name: 'PDF to Images', href: '/pdf-to-images', desc: 'High-quality conversion' },
                  { name: 'Compress PDF', href: '/compress-pdf', desc: 'Reduce file size' }
                ].map((tool, index) => (
                  <Link key={tool.name} href={tool.href} className="group bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md sm:hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-100">
                    <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors text-sm sm:text-base">{tool.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{tool.desc}</p>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link href="/tools#pdf-tools" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors bg-blue-50 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-blue-200 text-sm sm:text-base">
                  View All PDF Tools →
                </Link>
              </div>
            </div>
          </div>

          {/* Row 2: Media Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16">
            {/* Image Tools */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8">
              <div className="flex items-center mb-6 sm:mb-8">
                <div className="text-3xl sm:text-4xl mr-3 sm:mr-4">🖼️</div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Image Tools</h3>
                  <p className="text-sm sm:text-base text-gray-600">Modern image conversion</p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-6 sm:mb-8">
                {[
                  { name: 'PNG to WebP', href: '/png-to-webp-converter' },
                  { name: 'AVIF to PNG', href: '/avif-to-png' },
                  { name: 'WebP to PNG', href: '/webp-to-png' },
                  { name: 'JPG to PNG', href: '/jpg-to-png' },
                  { name: 'PNG to JPG', href: '/png-to-jpg' },
                  { name: 'HEIC to JPG', href: '/heic-to-jpg' }
                ].map((tool, index) => (
                  <Link key={tool.name} href={tool.href} className="block bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-2.5 sm:p-3 hover:shadow-sm sm:hover:shadow-md transition-all duration-300 hover:scale-105 border border-green-100">
                    <span className="font-semibold text-gray-900 hover:text-green-600 transition-colors text-sm sm:text-base">{tool.name}</span>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link href="/tools#image-tools" className="text-green-600 font-bold hover:text-green-700 transition-colors text-sm sm:text-base">
                  View All →
                </Link>
              </div>
            </div>

            {/* Video & Audio Tools */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8">
              <div className="flex items-center mb-6 sm:mb-8">
                <div className="text-3xl sm:text-4xl mr-3 sm:mr-4">🎦</div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Video & Audio</h3>
                  <p className="text-sm sm:text-base text-gray-600">Media format conversion</p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-6 sm:mb-8">
                {[
                  { name: 'MP4 to MOV', href: '/mp4-to-mov' },
                  { name: 'MOV to MP4', href: '/mov-to-mp4' },
                  { name: 'MKV to MP4', href: '/mkv-to-mp4' },
                  { name: 'WAV to MP3', href: '/wav-to-mp3' },
                  { name: 'MP3 to WAV', href: '/mp3-to-wav' },
                  { name: 'FLAC to MP3', href: '/flac-to-mp3' }
                ].map((tool, index) => (
                  <Link key={tool.name} href={tool.href} className="block bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-2.5 sm:p-3 hover:shadow-sm sm:hover:shadow-md transition-all duration-300 hover:scale-105 border border-red-100">
                    <span className="font-semibold text-gray-900 hover:text-red-600 transition-colors text-sm sm:text-base">{tool.name}</span>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link href="/tools#video-audio-tools" className="text-red-600 font-bold hover:text-red-700 transition-colors text-sm sm:text-base">
                  View All →
                </Link>
              </div>
            </div>
          </div>

          {/* Row 3: Utility Tools */}
          <div className="mb-10 sm:mb-12 md:mb-16">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8">
              <div className="flex items-center mb-6 sm:mb-8">
                <div className="text-3xl sm:text-4xl mr-3 sm:mr-4">🛠️</div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Business & Utility Tools</h3>
                  <p className="text-sm sm:text-base text-gray-600">Essential productivity tools</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                {[
                  { name: 'Resume Builder', href: '/resume-builder', desc: 'Professional templates', icon: '📋' },
                  { name: 'Invoice Generator', href: '/invoice-generator', desc: 'Business invoicing', icon: '🧾' },
                  { name: 'QR Code Generator', href: '/qr-code-generator', desc: 'Custom QR codes', icon: '🔳' },
                  { name: 'Barcode Generator', href: '/barcode-generator', desc: 'Multiple formats', icon: '🏷️' },
                  { name: 'Password Generator', href: '/password-generator', desc: 'Secure passwords', icon: '🔐' },
                  { name: 'Hash Generator', href: '/hash-generator', desc: 'Cryptographic hashes', icon: '⚙️' }
                ].map((tool, index) => (
                  <Link key={tool.name} href={tool.href} className="group bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md sm:hover:shadow-lg transition-all duration-300 hover:scale-105 border border-purple-100">
                    <div className="flex items-center mb-1 sm:mb-2">
                      <span className="text-xl sm:text-2xl mr-2">{tool.icon}</span>
                      <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors text-sm sm:text-base">{tool.name}</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{tool.desc}</p>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link href="/tools" className="inline-flex items-center text-purple-600 font-bold hover:text-purple-700 transition-colors bg-purple-50 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-purple-200 text-sm sm:text-base">
                  View All Tools →
                </Link>
              </div>
            </div>
          </div>

          {/* Row 4: Font Tools */}
          <div className="mb-10 sm:mb-12 md:mb-16">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8">
              <div className="flex items-center mb-6 sm:mb-8">
                <div className="text-3xl sm:text-4xl mr-3 sm:mr-4">🔤</div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Font Tools</h3>
                  <p className="text-sm sm:text-base text-gray-600">Professional typography conversion</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Link href="/font-converter" className="group bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-md sm:hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-100">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">🔤</span>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Font Converter</h4>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Convert fonts between different formats like TTF, OTF, WOFF, WOFF2, EOT, and SVG</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">TTF</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">OTF</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">WOFF</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">WOFF2</span>
                  </div>
                </Link>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 opacity-60">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">🎨</span>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-700">Font Preview</h4>
                  </div>
                  <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">Preview fonts with custom text and styling options</p>
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">Coming Soon</span>
                </div>
              </div>

              <div className="text-center">
                <Link href="/font-converter" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors bg-blue-50 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-blue-200 text-sm sm:text-base">
                  Try Font Converter →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Font Converters Section */}
        <section className="px-4 py-12 sm:py-16 md:py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg sm:shadow-xl">
              <span className="text-2xl sm:text-3xl">🔤</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Font Converters</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Convert font files between formats for web, desktop, and professional use
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
            {/* TTF → WOFF */}
            <div className="group bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors">
                <span className="text-xl sm:text-2xl">📝</span>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">TTF → WOFF</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Desktop to web format</p>
              <p className="text-xs text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-full inline-block">.ttf to .woff</p>
            </div>

            {/* OTF → WOFF2 */}
            <div className="group bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-purple-200 transition-colors">
                <span className="text-xl sm:text-2xl">💻</span>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">OTF → WOFF2</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">OpenType to modern web</p>
              <p className="text-xs text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-full inline-block">.otf to .woff2</p>
            </div>

            {/* WOFF → TTF */}
            <div className="group bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-green-200 transition-colors">
                <span className="text-xl sm:text-2xl">🌐</span>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">WOFF → TTF</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Web to desktop format</p>
              <p className="text-xs text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-full inline-block">.woff to .ttf</p>
            </div>

            {/* WOFF2 → OTF */}
            <div className="group bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-indigo-200 transition-colors">
                <span className="text-xl sm:text-2xl">✍️</span>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">WOFF2 → OTF</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Modern web to OpenType</p>
              <p className="text-xs text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-full inline-block">.woff2 to .otf</p>
            </div>

            {/* TTF → OTF */}
            <div className="group bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-yellow-200 transition-colors">
                <span className="text-xl sm:text-2xl">⚡</span>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">TTF → OTF</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">TrueType to OpenType</p>
              <p className="text-xs text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-full inline-block">.ttf to .otf</p>
            </div>

            {/* EOT → WOFF */}
            <div className="group bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-red-200 transition-colors">
                <span className="text-xl sm:text-2xl">🖨️</span>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">EOT → WOFF</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Legacy IE to modern web</p>
              <p className="text-xs text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-full inline-block">.eot to .woff</p>
            </div>

            {/* PS1 → OTF */}
            <div className="group bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-pink-200 transition-colors">
                <span className="text-xl sm:text-2xl">🎨</span>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">PS1 → OTF</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">PostScript to modern</p>
              <p className="text-xs text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-full inline-block">.ps1 to .otf</p>
            </div>

            {/* SVG → TTF */}
            <div className="group bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-200 transition-colors">
                <span className="text-xl sm:text-2xl">🎨</span>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">SVG → TTF</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Vector to standard font</p>
              <p className="text-xs text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-full inline-block">.svg to .ttf</p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/tools#font-tools" className="inline-flex items-center text-blue-700 font-bold hover:text-blue-800 transition-colors bg-white/80 backdrop-blur-sm px-5 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-blue-200 group text-sm sm:text-base">
              Explore All Font Tools
              <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-12 sm:py-16 md:py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Why Choose Our Platform?</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Trusted by millions for fast processing, secure handling, and professional results
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: '⚡',
                title: 'Fast Processing',
                description: 'Lightning-fast conversion with advanced algorithms',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: '🔒',
                title: 'Secure',
                description: 'Bank-level security with automatic file deletion',
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: '🎆',
                title: 'Free to Use',
                description: 'No hidden fees, completely free forever',
                color: 'from-blue-400 to-purple-500'
              },
              {
                icon: '📱',
                title: 'Mobile Friendly',
                description: 'Works perfectly on all devices and browsers',
                color: 'from-pink-400 to-red-500'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100">
                <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-xl sm:rounded-2xl text-white text-2xl sm:text-3xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About FlipFileX Section - Rich Content for AdSense */}
        <section className="px-4 py-12 sm:py-16 md:py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-blue-100">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">About FlipFileX: Professional File Conversion Made Simple</h2>

              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <p className="text-base sm:text-lg leading-relaxed">
                  FlipFileX is a comprehensive online file conversion platform designed for professionals, businesses, and individuals who need reliable, high-quality file transformations. Founded in 2024, we've quickly become one of the most trusted conversion platforms worldwide, processing over 2.8 million files monthly for users across 150+ countries.
                </p>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  We believe file conversion should be accessible, secure, and effortless for everyone. Our mission is to eliminate the frustration of incompatible file formats by providing enterprise-grade conversion tools that are completely free to use. Whether you're converting a PDF for work, optimizing images for your website, or transforming video formats for social media, FlipFileX delivers professional results in seconds.
                </p>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-8 mb-4">Comprehensive Format Support</h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Our platform supports over 200 conversion combinations across multiple categories. For documents, we handle PDF, Word (DOCX/DOC), Excel (XLSX/XLS), PowerPoint (PPTX/PPT), and more. Image conversions include modern formats like WebP, AVIF, and HEIC alongside traditional PNG, JPG, and GIF formats. Video support spans MP4, MOV, AVI, MKV, and WebM, while audio conversions cover MP3, WAV, FLAC, and AAC. We also specialize in font conversions (TTF, OTF, WOFF, WOFF2) and utility tools like QR codes, barcodes, and document generators.
                </p>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-8 mb-4">Advanced Technology Stack</h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  FlipFileX leverages cutting-edge technology to deliver superior conversion quality and speed. Our AI-powered image processing algorithms optimize compression ratios while preserving visual quality. For PDF conversions, we use advanced OCR (Optical Character Recognition) technology that maintains document formatting, fonts, and layout integrity. Our distributed cloud infrastructure with multi-region servers ensures fast processing regardless of your location, typically completing conversions in under 30 seconds.
                </p>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-8 mb-4">Security & Privacy First</h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  We take data security seriously. All file transfers use AES-256 encryption, the same standard used by banks and government agencies. Files are processed in isolated containers and automatically deleted from our servers within 60 minutes. We're fully GDPR compliant and SOC 2 certified, meaning we adhere to strict international privacy standards. Our zero-knowledge architecture ensures that no human ever accesses your files, and we never share, sell, or analyze your data.
                </p>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-8 mb-4">Who Uses FlipFileX?</h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Our platform serves a diverse user base including graphic designers converting images for client projects, photographers optimizing photos for web galleries, business professionals transforming documents for presentations, content creators converting video formats for different platforms, developers integrating our API into their applications, students converting research papers and assignments, and enterprises processing thousands of files through batch conversions. From freelancers to Fortune 500 companies, FlipFileX adapts to any workflow.
                </p>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-8 mb-4">Commitment to Quality</h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Quality is non-negotiable at FlipFileX. We continuously update our conversion engines with the latest codec improvements and format specifications. Our team monitors industry standards to ensure compatibility with emerging file formats like AVIF and AV1. User feedback drives our development roadmap—we've added over 50 new conversion tools in the past year based on community requests. Our 99.9% uptime guarantee means FlipFileX is available whenever you need it, with robust infrastructure that handles traffic spikes seamlessly.
                </p>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-8 mb-4">Environmental Responsibility</h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  We're committed to sustainable technology. Our data centers run on renewable energy, and we optimize our code for energy efficiency. By providing online conversions, we help reduce the need for resource-intensive desktop software installations. Our smart caching system minimizes redundant processing, and we continuously work to reduce our carbon footprint while maintaining exceptional performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-4 py-12 sm:py-16 md:py-20 mx-auto max-w-7xl sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">⚡ Simple 3-Step Process</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Get your files converted in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {[
              {
                step: '1️⃣',
                title: 'Upload Your File',
                description: 'Drag and drop or click to select your file. Supports all major formats up to 100MB.',
                icon: '📤'
              },
              {
                step: '2️⃣',
                title: 'Choose Tool & Convert',
                description: 'Select your desired output format and let our AI-powered engines do the work.',
                icon: '⚙️'
              },
              {
                step: '3️⃣',
                title: 'Download Result',
                description: 'Your converted file is ready! Download instantly with perfect quality preservation.',
                icon: '⬇️'
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6 sm:mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full shadow-lg sm:shadow-xl border-3 sm:border-4 border-blue-100 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl sm:text-4xl">{step.icon}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">{step.title}</h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-4">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Image Converter Tools Section */}
        <section className="px-4 py-12 sm:py-16 md:py-20 lg:py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl sm:rounded-3xl border border-blue-200/50 shadow-xl sm:shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
              <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-delayed"></div>
              <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
            </div>

            <div className="relative z-10 p-6 sm:p-8 md:p-12 lg:p-16">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl text-white text-2xl sm:text-3xl mb-6 sm:mb-8 shadow-lg sm:shadow-xl animate-pulse">
                  🎨
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-6 sm:mb-8 px-2">
                  Image Conversion Studio
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light px-4">
                  Transform images between all popular formats with AI-powered optimization and pixel-perfect quality preservation
                </p>
              </div>

              <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-10 sm:mb-12 md:mb-16">
                {imageConverterTools.map((tool, index) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="relative group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center shadow-md sm:shadow-lg border border-white/50 hover:shadow-lg sm:hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:-rotate-1 overflow-hidden"
                  >
                    {tool.popular && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-md">
                        POPULAR
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        {tool.icon}
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-700 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 group-hover:text-gray-700">{tool.description}</p>
                      <div className="inline-flex items-center text-blue-600 font-semibold text-xs sm:text-sm group-hover:gap-3 gap-2 transition-all bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full group-hover:bg-blue-100">
                        Convert Now
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/tools#image-converters"
                  className="inline-flex items-center text-blue-700 font-bold hover:text-blue-800 transition-colors bg-white/80 backdrop-blur-sm px-5 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-blue-200 group text-sm sm:text-base"
                >
                  Explore All Image Tools
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Video Converter Tools Section */}
        <section className="px-4 py-12 sm:py-16 md:py-20 lg:py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50 rounded-2xl sm:rounded-3xl border border-red-200/50 shadow-xl sm:shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute top-20 right-10 w-36 h-36 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
              <div className="absolute bottom-10 left-20 w-28 h-28 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-delayed"></div>
              <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
            </div>

            <div className="relative z-10 p-6 sm:p-8 md:p-12 lg:p-16">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl sm:rounded-3xl text-white text-2xl sm:text-3xl mb-6 sm:mb-8 shadow-lg sm:shadow-xl animate-pulse">
                  🎬
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-700 to-orange-700 bg-clip-text text-transparent mb-6 sm:mb-8 px-2">
                  Video Processing Lab
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light px-4">
                  Convert video formats with advanced codecs while maintaining quality and optimizing for different platforms
                </p>
              </div>

              <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-10 sm:mb-12 md:mb-16">
                {videoConverterTools.map((tool, index) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="relative group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center shadow-md sm:shadow-lg border border-white/50 hover:shadow-lg sm:hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:rotate-1 overflow-hidden"
                  >
                    {tool.popular && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-md animate-pulse">
                        HOT
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                        {tool.icon}
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-red-700 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 group-hover:text-gray-700">{tool.description}</p>
                      <div className="inline-flex items-center text-red-600 font-semibold text-xs sm:text-sm group-hover:gap-3 gap-2 transition-all bg-red-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full group-hover:bg-red-100">
                        Convert Now
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/tools#video-converters"
                  className="inline-flex items-center text-red-700 font-bold hover:text-red-800 transition-colors bg-white/80 backdrop-blur-sm px-5 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-red-200 group text-sm sm:text-base"
                >
                  Explore All Video Tools
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Audio Converter Tools Section */}
        <section className="px-4 py-12 sm:py-16 md:py-20 lg:py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-orange-50 rounded-2xl sm:rounded-3xl border border-purple-200/50 shadow-xl sm:shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
              <div className="absolute top-40 right-20 w-24 h-24 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-delayed"></div>
              <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
            </div>

            <div className="relative z-10 p-6 sm:p-8 md:p-12 lg:p-16">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-orange-600 rounded-2xl sm:rounded-3xl text-white text-2xl sm:text-3xl mb-6 sm:mb-8 shadow-lg sm:shadow-xl animate-pulse">
                  🎵
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-700 to-orange-700 bg-clip-text text-transparent mb-6 sm:mb-8 px-2">
                  Audio Processing Studio
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light px-4">
                  High-quality audio format conversion with perfect sound preservation and optimized compression for all your music needs
                </p>
              </div>

              <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-10 sm:mb-12 md:mb-16">
                {audioConverterTools.map((tool, index) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="relative group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center shadow-md sm:shadow-lg border border-white/50 hover:shadow-lg sm:hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:-rotate-1 overflow-hidden"
                  >
                    {tool.popular && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-purple-400 to-orange-500 text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-md animate-pulse">
                        POPULAR
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        {tool.icon}
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-purple-700 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 group-hover:text-gray-700">{tool.description}</p>
                      <div className="inline-flex items-center text-purple-600 font-semibold text-xs sm:text-sm group-hover:gap-3 gap-2 transition-all bg-purple-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full group-hover:bg-purple-100">
                        Convert Now
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/tools#audio-converters"
                  className="inline-flex items-center text-purple-700 font-bold hover:text-purple-800 transition-colors bg-white/80 backdrop-blur-sm px-5 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-purple-200 group text-sm sm:text-base"
                >
                  Explore All Audio Tools
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-4 py-12 sm:py-16 md:py-20 lg:py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-200">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>

            <div className="relative z-10 p-6 sm:p-8 md:p-12 lg:p-16">
              <div className="text-center mb-12 sm:mb-16 md:mb-20 px-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
                  Why FlipFileX Pro Leads the Industry
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
                  Experience the perfect fusion of cutting-edge technology, military-grade security, and intuitive design crafted for professionals who demand excellence.
                </p>
              </div>

              <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className={`text-center group p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl ${benefit.bgColor} border ${benefit.borderColor} shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-rotate-1`}>
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl text-3xl sm:text-4xl mb-6 sm:mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 group-hover:text-gray-700 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics/Counter Section */}
        <section className="px-4 py-12 sm:py-16 md:py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3">
              📊 Trusted by Millions
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Join the community that relies on our professional-grade conversion platform
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-2 md:grid-cols-4">
            {[
              { number: '500k+', label: 'Files Processed', icon: '📁', color: 'from-blue-500 to-cyan-500' },
              { number: '50+', label: 'Tools Available', icon: '🛠️', color: 'from-green-500 to-emerald-500' },
              { number: '99.9%', label: 'Uptime', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
              { number: '100%', label: 'Free to Use', icon: '🎆', color: 'from-purple-500 to-pink-500' }
            ].map((stat, index) => (
              <div key={index} className="relative group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-lg sm:shadow-xl border border-gray-100 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">{stat.icon}</div>
                  <div className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 sm:mb-3`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-semibold text-base sm:text-lg">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Reviews/Testimonials */}
        <section className="px-4 py-12 sm:py-16 md:py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3">
              ⭐ What Users Say
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Real feedback from our satisfied users worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Ahmad',
                comment: 'Best free tool collection!',
                rating: 5,
                avatar: '👨‍💼'
              },
              {
                name: 'Fatima',
                comment: 'Super fast conversion',
                rating: 5,
                avatar: '👩‍💼'
              },
              {
                name: 'Hassan',
                comment: 'Very easy to use',
                rating: 5,
                avatar: '👨‍💻'
              }
            ].map((review, index) => (
              <div key={index} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg sm:text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg italic">"{review.comment}"</p>
                <div className="flex items-center">
                  <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">{review.avatar}</span>
                  <div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base">{review.name}</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Verified User</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blog/Tips Section */}
        <section className="px-4 py-12 sm:py-16 md:py-20 mx-auto max-w-7xl sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3">
              📝 Tips & Guides
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Learn best practices and maximize your productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
            {[
              {
                title: 'How to Compress PDF without Quality Loss',
                excerpt: 'Learn the best techniques to reduce PDF file size while maintaining document quality...',
                readTime: '3 min read',
                category: 'PDF Tips',
                slug: 'how-to-compress-pdf-without-quality-loss',
                href: '/blog/how-to-compress-pdf-without-quality-loss'
              },
              {
                title: 'Best Image Formats for Web',
                excerpt: 'Discover which image formats work best for different use cases on the web...',
                readTime: '5 min read',
                category: 'Image Guide',
                slug: 'best-image-formats-for-web',
                href: '/blog/best-image-formats-for-web'
              },
              {
                title: 'Creating Professional Resumes',
                excerpt: 'Step-by-step guide to building a resume that stands out to employers...',
                readTime: '7 min read',
                category: 'Career Tips',
                slug: 'creating-professional-resumes',
                href: '/blog/creating-professional-resumes'
              }
            ].map((article, index) => (
              <Link key={index} href={article.href} className="block group">
                <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 hover-lift animate-bounce-in cursor-pointer" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full mb-3 sm:mb-4">
                    {article.category}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{article.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs sm:text-sm">{article.readTime}</span>
                    <span className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors flex items-center text-sm sm:text-base">
                      Read More
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/blog" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors bg-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg border border-blue-200 text-sm sm:text-base">
              Read More Articles →
            </Link>
          </div>
        </section>


        {/* CTA Section */}
        <section className="px-4 py-12 sm:py-16 md:py-20 lg:py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40 animate-pulse" style={{animationDelay: '2s'}}></div>

            <div className="relative z-10 p-6 sm:p-8 md:p-12 lg:p-16 text-white text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 px-2">
                Ready to Transform Your Workflow?
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-10 sm:mb-12 md:mb-16 text-blue-100 max-w-3xl mx-auto font-light px-4">
                Join over 50,000 professionals who trust our secure, lightning-fast, and enterprise-grade conversion platform
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mb-8 sm:mb-10 md:mb-12">
                {[
                  { text: 'PDF to Word', href: '/convert-pdf-to-word-online' },
                  { text: 'Word to PDF', href: '/word-to-pdf-online' },
                  { text: 'PNG to WebP', href: '/png-to-webp' },
                  { text: 'AVIF to PNG', href: '/avif-to-png' },
                  { text: 'WebP to PNG', href: '/webp-to-png' },
                  { text: 'JPG to PNG', href: '/jpg-to-png' },
                  { text: 'MP4 to MOV', href: '/mp4-to-mov' },
                  { text: 'MOV to MP4', href: '/mov-to-mp4' }
                ].map((link, index) => (
                  <Link key={index} href={link.href} className="bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg text-center border border-white/20 text-sm sm:text-base">
                    {link.text}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
                <Link href="/convert-pdf-to-word-online" className="w-full sm:w-auto bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl text-base sm:text-lg text-center">
                  Start Converting Now
                </Link>
                <Link href="/tools" className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:scale-105 text-base sm:text-lg text-center">
                  Browse All Tools
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Privacy */}
        <section className="px-4 py-12 sm:py-16 md:py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 via-white to-blue-50 rounded-2xl sm:rounded-3xl border-2 border-emerald-200 shadow-xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>

            <div className="relative z-10 p-6 sm:p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center space-y-6 sm:space-y-8 lg:space-y-0 lg:space-x-8 xl:space-x-12">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl text-white shadow-xl sm:shadow-2xl animate-pulse">
                    🛡️
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 text-center lg:text-left">Enterprise-Grade Security & Privacy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-emerald-800">
                    {[
                      { title: 'Military-Grade Encryption', desc: 'AES-256 encryption for all file transfers and processing' },
                      { title: 'Zero-Knowledge Architecture', desc: 'Files automatically deleted within 60 minutes of processing' },
                      { title: 'GDPR & SOC 2 Compliant', desc: 'Full compliance with international privacy regulations' },
                      { title: 'No Data Retention', desc: 'We never save, share, access, or analyze your documents' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/80 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-emerald-100">
                        <div className="text-emerald-600 text-xl sm:text-2xl flex-shrink-0">✓</div>
                        <div>
                          <strong className="text-base sm:text-lg block mb-1 sm:mb-2">{item.title}:</strong>
                          <span className="text-emerald-700 text-sm sm:text-base">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section id="faq" className="px-4 py-12 sm:py-16 md:py-20 lg:py-24 mx-auto max-w-4xl sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl text-white text-xl sm:text-2xl mb-4 sm:mb-6 shadow-lg animate-pulse">
              ❓
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">Frequently Asked Questions</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">Everything you need to know about our professional conversion platform</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 overflow-hidden hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 animate-bounce-in" style={{animationDelay: `${index * 100}ms`}}>
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                      <span className="text-sm sm:text-lg font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 pr-2 sm:pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-500 transition-transform duration-200 ${
                        openFaqIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${
                  openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="ml-11 sm:ml-14 pt-2 border-l-2 border-blue-100 pl-4 sm:pl-6">
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>

                {openFaqIndex === index && (
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="text-center mt-10 sm:mt-12 md:mt-16 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center text-blue-700 font-bold hover:text-blue-800 transition-colors bg-blue-50 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-blue-200 group text-base sm:text-lg hover-lift click-effect">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.93 8.93 0 01-4.95-1.492L3 21l2.492-5.05A8.93 8.93 0 013 11c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
                Contact Support
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === null ? 0 : null)}
                className="w-full sm:w-auto inline-flex items-center justify-center text-purple-700 font-bold hover:text-purple-800 transition-colors bg-purple-50 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-purple-200 group text-base sm:text-lg hover-lift click-effect"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {openFaqIndex === null ? 'Expand All' : 'Collapse All'}
              </button>
            </div>

            <p className="text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4 px-4">Can't find what you're looking for? Our support team is here to help 24/7</p>
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="px-4 py-6 sm:py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 text-base sm:text-lg">© 2024 FlipFileX Pro v3.0.0 - All-in-One Digital Tools Platform</p>
            <p className="text-gray-500 mt-2 text-sm sm:text-base px-4">Trusted by professionals worldwide • Enterprise security • Lightning-fast processing</p>
          </div>
        </footer>

        {/* Custom CSS for animations */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }

          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }

          @keyframes moveBackground {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .animate-float-delayed {
            animation: float-delayed 6s ease-in-out infinite;
            animation-delay: 2s;
          }

          .animate-fade-in {
            animation: fadeIn 1s ease-in;
          }

          .animate-moving-bg {
            background-size: 200% 200%;
            animation: moveBackground 8s ease-in-out infinite;
          }

          .animate-pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes bounce-in {
            0% { transform: scale(0.3) rotate(-5deg); opacity: 0; }
            50% { transform: scale(1.05) rotate(2deg); }
            70% { transform: scale(0.9) rotate(-1deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }

          .animate-bounce-in {
            animation: bounce-in 0.6s ease-out;
          }

          /* Enhanced Hover Effects */
          .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .hover-lift:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }

          .hover-glow:hover {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
            border-color: rgba(59, 130, 246, 0.6);
          }

          /* Button Click Feedback */
          .click-effect:active {
            transform: scale(0.98);
            transition: transform 0.1s ease-in-out;
          }

          /* Subtle Background Patterns */
          .bg-pattern-dots {
            background-image: radial-gradient(circle, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
          }

          .bg-pattern-grid {
            background-image:
              linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
            background-size: 30px 30px;
          }

          .bg-grid-slate-100 {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23e2e8f0'%3e%3cpath d='m0 .5 32 0M.5 0v32'/%3e%3c/svg%3e");
          }

          /* Smooth Navigation Transitions */
          .smooth-transition {
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          }

          /* Particle Background Animation */
          .particles {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          .particle {
            position: absolute;
            background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
            border-radius: 50%;
            animation: float 8s ease-in-out infinite;
          }

          .particle:nth-child(1) { width: 6px; height: 6px; top: 20%; left: 10%; animation-delay: 0s; }
          .particle:nth-child(2) { width: 8px; height: 8px; top: 40%; left: 20%; animation-delay: 2s; }
          .particle:nth-child(3) { width: 4px; height: 4px; top: 60%; left: 30%; animation-delay: 4s; }
          .particle:nth-child(4) { width: 10px; height: 10px; top: 80%; left: 40%; animation-delay: 6s; }
          .particle:nth-child(5) { width: 5px; height: 5px; top: 30%; left: 60%; animation-delay: 1s; }
          .particle:nth-child(6) { width: 7px; height: 7px; top: 70%; left: 80%; animation-delay: 3s; }
          .particle:nth-child(7) { width: 9px; height: 9px; top: 50%; left: 90%; animation-delay: 5s; }

          /* Enhanced Search Animations */
          @keyframes searchGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(147, 51, 234, 0.4); }
          }

          @keyframes resultSlide {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes iconBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1) rotate(5deg); }
          }

          .search-glow:focus-within {
            animation: searchGlow 2s ease-in-out infinite;
          }

          .result-item {
            animation: resultSlide 0.3s ease-out;
          }

          .search-icon-bounce:hover {
            animation: iconBounce 0.6s ease-in-out;
          }

          /* Glassmorphism Effect */
          .glass-effect {
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.18);
          }

          /* Search Input Focus Effect */
          .search-input:focus {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.95));
          }

          /* Category Colors */
          .category-pdf { background: linear-gradient(135deg, #ef4444, #ec4899); }
          .category-image { background: linear-gradient(135deg, #10b981, #3b82f6); }
          .category-video { background: linear-gradient(135deg, #8b5cf6, #ec4899); }
          .category-audio { background: linear-gradient(135deg, #f59e0b, #ef4444); }
          .category-utility { background: linear-gradient(135deg, #3b82f6, #8b5cf6); }

          /* Logo Loop Animation */
          @keyframes logoLoop {
            0% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.05) rotate(2deg); }
            50% { transform: scale(1.1) rotate(0deg); }
            75% { transform: scale(1.05) rotate(-2deg); }
            100% { transform: scale(1) rotate(0deg); }
          }

          .animate-logo-loop {
            animation: logoLoop 4s ease-in-out infinite;
          }

          .animate-logo-loop:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </>
  );
}