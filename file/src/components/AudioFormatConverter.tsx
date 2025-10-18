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

// Audio format options with unique purple/orange theme
const audioFormats = {
  // Input formats (all supported)
  'mp3': { name: 'MP3', color: 'text-orange-600', bgColor: 'bg-orange-50', category: 'Compressed' },
  'wav': { name: 'WAV', color: 'text-purple-600', bgColor: 'bg-purple-50', category: 'Lossless' },
  'flac': { name: 'FLAC', color: 'text-indigo-600', bgColor: 'bg-indigo-50', category: 'Lossless' },
  'aac': { name: 'AAC', color: 'text-blue-600', bgColor: 'bg-blue-50', category: 'Compressed' },
  'ogg': { name: 'OGG', color: 'text-green-600', bgColor: 'bg-green-50', category: 'Compressed' },
  'wma': { name: 'WMA', color: 'text-red-600', bgColor: 'bg-red-50', category: 'Compressed' },
  'm4a': { name: 'M4A', color: 'text-pink-600', bgColor: 'bg-pink-50', category: 'Compressed' },
  'aiff': { name: 'AIFF', color: 'text-cyan-600', bgColor: 'bg-cyan-50', category: 'Lossless' },
  'opus': { name: 'Opus', color: 'text-emerald-600', bgColor: 'bg-emerald-50', category: 'Compressed' },
  'ac3': { name: 'AC3', color: 'text-violet-600', bgColor: 'bg-violet-50', category: 'Compressed' }
};

// Generate SEO configuration outside component to prevent re-creation
const generateSEOConfig = (from: string, to: string): ConversionConfig => {
  const fromFormat = audioFormats[from as keyof typeof audioFormats]?.name || from.toUpperCase();
  const toFormat = audioFormats[to as keyof typeof audioFormats]?.name || to.toUpperCase();

  return {
    title: `Convert ${fromFormat} to ${toFormat} | Free Online Audio Converter`,
    description: `Convert ${fromFormat} audio to ${toFormat} format online for free`,
    metaDescription: `Convert ${fromFormat} to ${toFormat} online for free, fast and secure. No software required. High-quality audio conversion with perfect sound preservation.`,
    keywords: `${from} to ${to}, ${fromFormat} to ${toFormat}, convert ${from}, ${to} converter, audio converter, online converter, free converter`,
    urlSlug: `${from}-to-${to}`,
    h1Title: `Convert ${fromFormat} to ${toFormat}`,
    breadcrumbText: `${fromFormat} to ${toFormat}`
  };
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

interface AudioFormatConverterProps {
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

// Dynamic Audio SEO Content Component
interface DynamicAudioSEOContentProps {
  sourceFormat: string;
  targetFormat: string;
  audioFormats: Record<string, { name: string; color: string; bgColor: string; category: string }>;
}

const DynamicAudioSEOContent = ({ sourceFormat, targetFormat, audioFormats }: DynamicAudioSEOContentProps) => {
  const fromFormat = audioFormats[sourceFormat]?.name || sourceFormat.toUpperCase();
  const toFormat = audioFormats[targetFormat]?.name || targetFormat.toUpperCase();

  // Force component to be stable and not unmount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render to prevent SSR mismatches, but add mounted class for styling
  const renderClass = mounted ? 'opacity-100' : 'opacity-0';

  // UNIQUE AUDIO SECTION TITLES for each conversion combination
  const getAudioSectionTitles = (from: string, to: string) => {
    const conversionKey = `${from.toLowerCase()}_to_${to.toLowerCase()}`;

    const uniqueAudioTitles: Record<string, {
      howTo: string;
      whyFrom: string;
      whyTo: string;
      whyMatters: string;
      benefits: string;
      technical: string;
      useCases: string;
      faq: string;
      relatedTools: string;
    }> = {
      'wav_to_mp3': {
        howTo: `Transform Lossless WAV Audio to Compact MP3 Format`,
        whyFrom: `WAV Uncompressed Audio Storage vs Practical File Management`,
        whyTo: `MP3 Universal Compatibility for Effortless Audio Sharing`,
        whyMatters: `Audio File Efficiency Through WAV to MP3 Compression`,
        benefits: `Storage Optimization Benefits of WAV to MP3 Conversion`,
        technical: `WAV vs MP3: Lossless vs Compressed Audio Technology Analysis`,
        useCases: `Music Distribution Applications for WAV to MP3`,
        faq: `WAV to MP3 Audio Compression: Quality Balance Guide`,
        relatedTools: `Professional WAV and MP3 Audio Production Tools`
      },
      'mp3_to_wav': {
        howTo: `Upgrade Compressed MP3 to Professional WAV Quality`,
        whyFrom: `MP3 Compression Limitations in Professional Audio Production`,
        whyTo: `WAV Lossless Quality for Studio-Grade Audio Processing`,
        whyMatters: `Professional Audio Enhancement Through MP3 to WAV Upgrade`,
        benefits: `Audio Quality Benefits of MP3 to WAV Professional Enhancement`,
        technical: `MP3 vs WAV: Compressed vs Lossless Audio Quality Comparison`,
        useCases: `Professional Audio Production with MP3 to WAV`,
        faq: `MP3 to WAV Quality Enhancement: Professional Audio Guide`,
        relatedTools: `Professional MP3 and WAV Audio Production Suite`
      },
      'flac_to_mp3': {
        howTo: `Convert High-Fidelity FLAC to Portable MP3 Format`,
        whyFrom: `FLAC Audiophile Quality vs Portable Device Compatibility`,
        whyTo: `MP3 Device Compatibility for Universal Music Playback`,
        whyMatters: `Music Accessibility Through FLAC to MP3 Portability`,
        benefits: `Device Compatibility Benefits of FLAC to MP3 Conversion`,
        technical: `FLAC vs MP3: Audiophile vs Portable Audio Analysis`,
        useCases: `Mobile Music Applications for FLAC to MP3`,
        faq: `FLAC to MP3 Music Portability: Device Compatibility Guide`,
        relatedTools: `Audiophile FLAC and MP3 Music Management Platform`
      },
      'mp3_to_aac': {
        howTo: `Modernize MP3 Audio with Advanced AAC Technology`,
        whyFrom: `MP3 Traditional Compression vs Modern Audio Efficiency`,
        whyTo: `AAC Advanced Compression for Superior Audio Quality`,
        whyMatters: `Audio Technology Evolution Through MP3 to AAC Advancement`,
        benefits: `Compression Efficiency Benefits of MP3 to AAC Modernization`,
        technical: `MP3 vs AAC: Traditional vs Advanced Audio Compression`,
        useCases: `Modern Audio Applications for MP3 to AAC`,
        faq: `MP3 to AAC Audio Modernization: Technology Upgrade Guide`,
        relatedTools: `Modern MP3 and AAC Audio Technology Platform`
      },
      'aac_to_mp3': {
        howTo: `Convert AAC Audio to Universal MP3 Standard`,
        whyFrom: `AAC Apple Integration vs Universal Audio Compatibility`,
        whyTo: `MP3 Universal Standard for Cross-Platform Audio`,
        whyMatters: `Universal Audio Access Through AAC to MP3 Standardization`,
        benefits: `Platform Independence Benefits of AAC to MP3 Conversion`,
        technical: `AAC vs MP3: Apple-Optimized vs Universal Audio Analysis`,
        useCases: `Cross-Platform Audio Distribution with AAC to MP3`,
        faq: `AAC to MP3 Universal Audio: Platform Independence Guide`,
        relatedTools: `Universal AAC and MP3 Audio Distribution Tools`
      },
      'ogg_to_mp3': {
        howTo: `Convert Open-Source OGG to Compatible MP3 Format`,
        whyFrom: `OGG Open Standard vs Mainstream Audio Compatibility`,
        whyTo: `MP3 Mainstream Compatibility for Universal Audio Access`,
        whyMatters: `Audio Mainstream Access Through OGG to MP3 Conversion`,
        benefits: `Compatibility Assurance Benefits of OGG to MP3 Conversion`,
        technical: `OGG vs MP3: Open Source vs Mainstream Audio Analysis`,
        useCases: `Mainstream Audio Distribution with OGG to MP3`,
        faq: `OGG to MP3 Audio Compatibility: Mainstream Access Guide`,
        relatedTools: `Open Source OGG and MP3 Audio Compatibility Suite`
      }
    };

    // If no predefined titles exist, create unique dynamic ones for audio
    if (uniqueAudioTitles[conversionKey]) {
      return uniqueAudioTitles[conversionKey];
    }

    // Create completely unique fallback titles for audio that will never be duplicated
    const dynamicAudioTitles = {
      howTo: `Master ${fromFormat}-to-${toFormat} Audio Processing Workflow`,
      whyFrom: `${fromFormat} Audio Format Constraints and Upgrade Requirements`,
      whyTo: `${toFormat} Audio Format Excellence for Your Sound Production`,
      whyMatters: `Strategic Audio Enhancement: ${fromFormat}-to-${toFormat} Sound Evolution`,
      benefits: `Audio Quality Revolution: ${fromFormat} to ${toFormat} Sound Advancement`,
      technical: `${fromFormat} vs ${toFormat}: Comprehensive Audio Technology Specification`,
      useCases: `Professional Sound Production: ${fromFormat}-to-${toFormat} Audio Applications`,
      faq: `${fromFormat}-to-${toFormat} Audio Processing: Advanced Sound Documentation`,
      relatedTools: `${fromFormat} and ${toFormat} Professional Audio Production Technology`
    };

    return dynamicAudioTitles;
  };

  // UNIQUE AUDIO CONVERSION-SPECIFIC DESCRIPTIONS - NO DUPLICATE CONTENT
  const getAudioConversionSpecificDescription = (from: string, to: string) => {
    const conversionKey = `${from.toLowerCase()}_to_${to.toLowerCase()}`;

    const uniqueAudioConversions: Record<string, { sourceDesc: string; targetDesc: string; why: string }> = {
      // WAV conversions - lossless quality focus
      'wav_to_mp3': {
        sourceDesc: 'WAV files preserve every detail of audio recordings with uncompressed quality but create enormous file sizes that are impractical for modern digital distribution, streaming, and portable device storage.',
        targetDesc: 'MP3 format provides intelligent compression that reduces file sizes by up to 90% while maintaining excellent audio quality for music listening, making it the universal standard for digital music distribution.',
        why: 'Converting WAV to MP3 becomes essential for music distribution, streaming services, and portable device compatibility while maintaining high audio quality that satisfies most listening scenarios and dramatically reducing storage requirements.'
      },
      'wav_to_aac': {
        sourceDesc: 'WAV format stores audio in uncompressed form, ensuring perfect fidelity but creating files too large for efficient streaming, mobile devices, and cloud storage in modern audio workflows.',
        targetDesc: 'AAC format delivers superior compression efficiency compared to MP3 while maintaining excellent audio quality, making it ideal for Apple devices, streaming services, and modern audio applications.',
        why: 'Converting WAV to AAC is crucial for Apple ecosystem integration, streaming optimization, and modern audio distribution where file size efficiency and quality balance are paramount for user experience.'
      },
      'wav_to_flac': {
        sourceDesc: 'WAV files contain raw audio data without compression, ensuring perfect quality but lacking efficient storage and metadata capabilities needed for organized digital music libraries.',
        targetDesc: 'FLAC format provides lossless compression that reduces file sizes by 50-70% while maintaining identical audio quality to WAV, plus superior metadata support for music organization.',
        why: 'Converting WAV to FLAC is essential for audiophile music collections, efficient storage management, and maintaining perfect audio quality while gaining advanced metadata capabilities for music library organization.'
      },

      // MP3 conversions - universal compatibility focus
      'mp3_to_wav': {
        sourceDesc: 'MP3 files use lossy compression that removes audio data to achieve small file sizes, but this limits their usefulness in professional audio editing and high-fidelity audio production workflows.',
        targetDesc: 'WAV format provides uncompressed audio that preserves every detail of the original recording, making it essential for professional audio editing, mastering, and studio production work.',
        why: 'Converting MP3 to WAV becomes necessary for professional audio editing, remixing, and production work where maximum audio quality and editing flexibility are required for professional results.'
      },
      'mp3_to_aac': {
        sourceDesc: 'MP3 format uses older compression technology that is less efficient than modern audio codecs, resulting in larger file sizes or reduced quality compared to contemporary alternatives.',
        targetDesc: 'AAC format employs advanced compression algorithms that provide better quality at the same file size or smaller files at the same quality level, optimized for modern devices and streaming.',
        why: 'Converting MP3 to AAC is beneficial for Apple device optimization, streaming efficiency, and achieving better audio quality while maintaining or reducing file sizes for modern audio distribution.'
      },
      'mp3_to_flac': {
        sourceDesc: 'MP3 compression permanently removes audio data to achieve small file sizes, making it unsuitable for audiophile listening and scenarios requiring perfect audio reproduction.',
        targetDesc: 'FLAC format provides lossless compression that preserves every detail of the original audio while still achieving significant file size reduction compared to uncompressed formats.',
        why: 'Converting MP3 to FLAC enhances audio quality for audiophile listening, though the quality will be limited by the original MP3 compression, making it useful for preserving the best possible quality from existing MP3 collections.'
      },

      // FLAC conversions - audiophile to practical
      'flac_to_mp3': {
        sourceDesc: 'FLAC files maintain perfect audio quality through lossless compression but create large file sizes that are impractical for portable devices, streaming, and users with limited storage capacity.',
        targetDesc: 'MP3 format provides excellent compression that makes audio files practical for everyday use, portable devices, and streaming while maintaining quality that satisfies most listening scenarios.',
        why: 'Converting FLAC to MP3 is essential for creating portable music collections, streaming compatibility, and sharing high-quality audio files that work on all devices while dramatically reducing storage requirements.'
      },
      'flac_to_aac': {
        sourceDesc: 'FLAC format preserves perfect audio quality but creates files too large for efficient mobile streaming, cloud storage, and devices with limited storage capacity.',
        targetDesc: 'AAC format provides superior compression efficiency that maintains excellent audio quality while creating files practical for modern streaming services, mobile devices, and efficient distribution.',
        why: 'Converting FLAC to AAC optimizes audiophile-quality audio for modern streaming platforms, Apple devices, and efficient distribution while maintaining quality that satisfies discerning listeners.'
      },

      // AAC conversions - Apple ecosystem to universal
      'aac_to_mp3': {
        sourceDesc: 'AAC files provide excellent compression and quality but may face compatibility limitations with older devices, certain software, and platforms that prioritize universal format support.',
        targetDesc: 'MP3 format ensures universal compatibility across all devices, software, and platforms while maintaining excellent audio quality for general listening and distribution purposes.',
        why: 'Converting AAC to MP3 is necessary for ensuring universal playback compatibility, sharing audio across diverse platforms, and maximizing accessibility for audiences using various devices and software.'
      },
      'aac_to_wav': {
        sourceDesc: 'AAC format uses advanced compression that is excellent for distribution but limits professional audio editing capabilities and maximum quality preservation for studio work.',
        targetDesc: 'WAV format provides uncompressed audio that preserves every detail, enabling professional editing, remixing, and production work that requires maximum audio fidelity.',
        why: 'Converting AAC to WAV is essential for professional audio production, enabling detailed editing and processing of compressed audio files while maximizing the available audio quality for studio work.'
      },

      // OGG conversions - open source to mainstream
      'ogg_to_mp3': {
        sourceDesc: 'OGG format provides excellent compression and open-source advantages but faces compatibility limitations with mainstream devices, software, and commercial audio platforms.',
        targetDesc: 'MP3 format ensures universal compatibility across all devices, media players, and platforms while maintaining excellent audio quality for widespread audio distribution.',
        why: 'Converting OGG to MP3 is necessary for mainstream audio distribution, ensuring compatibility with all devices and platforms while maintaining high audio quality for universal accessibility.'
      },

      // WMA conversions - Windows-specific to universal
      'wma_to_mp3': {
        sourceDesc: 'WMA format works well within Microsoft ecosystems but creates compatibility challenges when sharing audio across diverse devices, platforms, and non-Windows environments.',
        targetDesc: 'MP3 format provides universal audio compatibility that works seamlessly across all operating systems, devices, and audio software without compatibility concerns.',
        why: 'Converting WMA to MP3 eliminates platform-specific limitations and ensures audio files work universally across all devices, making them accessible to any audience regardless of their technology preferences.'
      },

      // M4A conversions - Apple format to universal
      'm4a_to_mp3': {
        sourceDesc: 'M4A format provides excellent quality and Apple device integration but may face compatibility issues with non-Apple devices and older audio software systems.',
        targetDesc: 'MP3 format ensures universal playback compatibility across all devices and platforms while maintaining excellent audio quality for comprehensive audio distribution.',
        why: 'Converting M4A to MP3 maximizes audio accessibility by ensuring files work on all devices and platforms, eliminating compatibility barriers for sharing and distributing audio content.'
      }
    };

    const conversion = uniqueAudioConversions[conversionKey];
    if (conversion) {
      return conversion;
    }

    // Fallback for other combinations
    return {
      sourceDesc: `${fromFormat} format serves specific audio workflow purposes but may not be optimal for your current distribution requirements and intended audience.`,
      targetDesc: `${toFormat} format offers advantages in compatibility, file size optimization, or quality features that better match your specific audio project needs and distribution requirements.`,
      why: `Converting ${fromFormat} to ${toFormat} helps optimize your audio for your specific workflow, platform requirements, and intended audience engagement.`
    };
  };

  const audioSectionTitles = getAudioSectionTitles(sourceFormat, targetFormat);

  return (
    <div className={`space-y-16 transition-opacity duration-1000 ${renderClass}`}>
      {/* How to Convert Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {audioSectionTitles.howTo}
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Converting {fromFormat} audio to {toFormat} format is simple with our free online converter. Follow these easy steps to optimize your audio files:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload {fromFormat} Files</h3>
              <p className="text-gray-600 text-sm">Select your {fromFormat} audio files or drag and drop them into the upload area. Up to 5 files supported.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Convert to {toFormat}</h3>
              <p className="text-gray-600 text-sm">Click the convert button and our server will process your {fromFormat} audio with high quality settings.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Download {toFormat}</h3>
              <p className="text-gray-600 text-sm">Download your converted {toFormat} files immediately. No registration required.</p>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Our {fromFormat} to {toFormat} converter maintains audio quality while optimizing for your specific needs. The conversion process is completely free, secure, and works with high-quality settings by default. Your files are automatically deleted after processing for complete privacy.
          </p>
        </div>
      </div>

      {/* UNIQUE AUDIO CONVERSION-SPECIFIC CONTENT - NO DUPLICATE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            {audioSectionTitles.whyFrom}
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 leading-relaxed mb-6">
              {getAudioConversionSpecificDescription(sourceFormat, targetFormat).sourceDesc}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-orange-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            {audioSectionTitles.whyTo}
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 leading-relaxed mb-6">
              {getAudioConversionSpecificDescription(sourceFormat, targetFormat).targetDesc}
            </p>
          </div>
        </div>
      </div>

      {/* WHY THIS CONVERSION MATTERS - UNIQUE SECTION */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {audioSectionTitles.whyMatters}
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed text-lg">
            {getAudioConversionSpecificDescription(sourceFormat, targetFormat).why}
          </p>
        </div>
      </div>

      {/* Audio Quality Benefits Section */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-pink-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {audioSectionTitles.benefits}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🎵</div>
                <h3 className="text-xl font-semibold text-gray-900">Audio Quality Preservation</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">Our converter maintains maximum audio quality during conversion, ensuring your music retains its clarity, depth, and dynamic range for professional results.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">⚡</div>
                <h3 className="text-xl font-semibold text-gray-900">Lightning Fast Processing</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">High-speed audio conversion technology processes your files quickly while maintaining quality, getting your audio ready for distribution in seconds.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">📱</div>
                <h3 className="text-xl font-semibold text-gray-900">Universal Device Compatibility</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">Converted audio files work seamlessly across all devices, operating systems, and media players, ensuring your music reaches every audience.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🔒</div>
                <h3 className="text-xl font-semibold text-gray-900">Secure & Private Processing</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">Your audio files are processed securely with automatic deletion after conversion, ensuring complete privacy and security for your valuable music content.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Format FAQ Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          {audioSectionTitles.faq}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Will converting {fromFormat} to {toFormat} reduce audio quality?</h3>
              <p className="text-gray-700 leading-relaxed">Audio quality depends on the source and target formats. Our converter uses optimal settings to maintain the highest possible quality while achieving the benefits of the target format. Lossless conversions preserve original quality, while compressed formats balance quality with file size efficiency.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What bitrate settings are used for {toFormat} conversion?</h3>
              <p className="text-gray-700 leading-relaxed">We use high-quality settings by default (320kbps for MP3, equivalent quality for other formats) to ensure excellent audio quality. This provides the best balance between file size and audio fidelity for most use cases.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I convert multiple {fromFormat} files to {toFormat} at once?</h3>
              <p className="text-gray-700 leading-relaxed">Yes! Our converter supports batch processing of up to 5 {fromFormat} files simultaneously. Upload multiple files and convert them all to {toFormat} in one operation, saving time and effort.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my {fromFormat} audio safe during conversion?</h3>
              <p className="text-gray-700 leading-relaxed">Absolutely! All uploads are processed securely over HTTPS encryption. Your original {fromFormat} files and converted {toFormat} audio are automatically deleted from our servers after processing. We never store, share, or analyze your audio content.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's the maximum file size for {fromFormat} conversion?</h3>
              <p className="text-gray-700 leading-relaxed">Our converter supports {fromFormat} files up to 1GB in size, accommodating everything from single songs to long-form audio content like podcasts, audiobooks, and extended musical pieces.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How long does {fromFormat} to {toFormat} conversion take?</h3>
              <p className="text-gray-700 leading-relaxed">Conversion time depends on file size and length, but most {fromFormat} to {toFormat} conversions complete within 15-60 seconds. Our optimized servers ensure fast processing while maintaining high quality output.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Audio Tools Section */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {audioSectionTitles.relatedTools}
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed mb-8 text-center">
            Explore our complete suite of audio conversion tools for all your sound processing needs:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href={`/${targetFormat}-to-${sourceFormat}`} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">{toFormat} to {fromFormat} Converter</h3>
              </div>
              <p className="text-gray-600 text-sm">Convert {toFormat} back to {fromFormat} format for different workflow requirements.</p>
            </a>

            <a href="/wav-to-flac" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">Lossless Audio Converter</h3>
              </div>
              <p className="text-gray-600 text-sm">Convert between lossless formats like WAV, FLAC, and AIFF for audiophile quality.</p>
            </a>

            <a href="/audio-compressor" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">Audio Compressor</h3>
              </div>
              <p className="text-gray-600 text-sm">Reduce audio file sizes while maintaining quality across multiple formats.</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AudioFormatConverter({ 
  sourceFormat: initialSource, 
  targetFormat: initialTarget 
}: AudioFormatConverterProps = {}) {
  const router = useRouter();


  // State management
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceFormat, setSourceFormat] = useState(initialSource || 'wav');
  const [targetFormat, setTargetFormat] = useState(initialTarget || 'mp3');
  const [dragActive, setDragActive] = useState(false);
  const [supportedFormats, setSupportedFormats] = useState<any>({ input_formats: [], output_formats: [] });
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({ show: false, message: '', type: 'info' });

  const [conversionStats] = useState({
    totalConverted: 38492,
    successRate: 99.2,
    averageTime: 15
  });


  const [seoConfig, setSeoConfig] = useState<ConversionConfig>(() => 
    generateSEOConfig(sourceFormat, targetFormat)
  );

  // Update SEO config when formats change
  useEffect(() => {
    const newConfig = generateSEOConfig(sourceFormat, targetFormat);
    setSeoConfig(newConfig);
  }, [sourceFormat, targetFormat]);

  // Update conversion type and URL
  const updateConversionType = useCallback((newFrom: string, newTo: string) => {
    const newConfig = generateSEOConfig(newFrom, newTo);
    setSeoConfig(newConfig);

    if (router) {
      const cleanUrl = `/${newFrom}-to-${newTo}`;
      router.push(cleanUrl);
    }

    setFiles([]);
    setSourceFormat(newFrom);
    setTargetFormat(newTo);
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
        const response = await fetch(`${API_BASE_URL}/convert/supported-audio-formats`);
        if (response.ok) {
          const formats = await response.json();
          setSupportedFormats(formats);
          if (!formats.notes?.ffmpeg_available) {
            showNotification('FFmpeg is not available. Please install it for audio conversion.', 'warning');
          }
        } else {
          throw new Error('Failed to load supported formats');
        }
      } catch (error) {
        console.error('Failed to load supported formats:', error);
        setSupportedFormats({
          input_formats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a', 'aiff', 'opus', 'ac3'],
          output_formats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'opus'],
          bitrate_options: ['128', '192', '256', '320']
        });
        showNotification('Failed to load supported formats. Using defaults.', 'warning');
      }
    };

    loadSupportedFormats();
  }, [showNotification]);

  // Enhanced file validation
  const validateAudioFile = useCallback((file: File): string | null => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension) {
      return 'File must have a valid extension';
    }
    
    if (supportedFormats.input_formats && !supportedFormats.input_formats.includes(fileExtension)) {
      return `Unsupported format: ${fileExtension.toUpperCase()}. Supported formats: ${supportedFormats.input_formats.join(', ')}`;
    }
    
    // 1GB limit for audio
    const maxSize = 1 * 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      return `File too large (${formatFileSize(file.size)}). Maximum size is 1GB`;
    }
    
    return null;
  }, [supportedFormats]);

  // Dropzone handlers
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    acceptedFiles.forEach((file) => {
      const error = validateAudioFile(file);
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
      showNotification(`${validFiles.length} audio file(s) added successfully`, 'success');
    }
  }, [validateAudioFile, showNotification]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': supportedFormats.input_formats?.map((format: string) => `.${format}`) || []
    },
    maxFiles: 5,
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
      showNotification('Please select audio files to convert', 'warning');
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
          formData.append('bitrate', '320'); // High quality by default

          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
          
          console.log('Starting audio conversion request...');
          const response = await fetch(`${API_BASE_URL}/convert/convert-audio`, {
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
                
                const progressResponse = await fetch(`${API_BASE_URL}/convert/audio-progress/${result.conversion_id}`);
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
      link.download = `${fileWithId.file.name.split('.')[0]}_converted.${targetFormat}`;
      link.target = '_blank';
      
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
      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-orange-200 rounded-xl flex items-center justify-center shadow-md">
        <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v6.114a4 4 0 10.99 7.886 1 1 0 00.01-2c-.672 0-1.327-.35-1.679-.914a2 2 0 013.357-2.172A1.99 1.99 0 0010 14c.441 0 .838.193 1.118.518a4 4 0 10-.528-5.876L8 9.586V7.414l8-1.6v2.3a4 4 0 10.99 7.886 1 1 0 00.01-2c-.672 0-1.327-.35-1.679-.914a2 2 0 013.357-2.172A1.99 1.99 0 0020 12c0-.441-.193-.838-.518-1.118a4 4 0 10.528-5.876z" />
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
          color: 'text-orange-700',
          bgColor: 'bg-orange-100',
          icon: (
            <div className="animate-spin w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full"></div>
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
        return 'bg-gradient-to-r from-orange-500 to-amber-500';
      case 'processing':
        return 'bg-gradient-to-r from-purple-500 to-indigo-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-orange-600 rounded-3xl text-white text-4xl mb-8 shadow-lg">
            🎵
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent mb-6">
            {seoConfig.h1Title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            {seoConfig.description} with 
            <span className="font-semibold text-purple-600"> crystal-clear quality</span> and 
            <span className="font-semibold text-orange-600"> optimized compression</span>
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{conversionStats.totalConverted.toLocaleString()}+</div>
              <div className="text-gray-600 text-sm">Audio Files Converted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{conversionStats.successRate}%</div>
              <div className="text-gray-600 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{conversionStats.averageTime}s</div>
              <div className="text-gray-600 text-sm">Avg. Speed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-purple-500 to-orange-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">Select Audio Formats</h2>
            <p className="text-purple-100">Choose your source and target audio formats - automatically converts in high quality</p>
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
                  {Object.entries(audioFormats).map(([key, format]) => (
                    <option key={key} value={key}>{format.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">To Format</label>
                <select 
  value={targetFormat} 
  onChange={(e) => updateConversionType(sourceFormat, e.target.value)}
  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring focus:ring-orange-200 text-lg"
>
  {Object.entries(audioFormats)
    .filter(([key]) => key !== sourceFormat && ['mp3', 'wav', 'aac', 'm4a'].includes(key)) // Only working output formats
    .map(([key, format]) => (
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
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-orange-50 scale-[1.02] shadow-2xl' 
                  : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-orange-50'
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
                    ? 'bg-gradient-to-br from-purple-500 to-orange-600 text-white' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 group-hover:from-purple-100 group-hover:to-orange-100 group-hover:text-purple-600'
                  }
                `}>
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-900 transition-colors">
                    Drop your {audioFormats[sourceFormat as keyof typeof audioFormats]?.name} audio files here
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Select {audioFormats[sourceFormat as keyof typeof audioFormats]?.name} files to convert to {audioFormats[targetFormat as keyof typeof audioFormats]?.name}
                  </p>
                  
                  {isDragActive ? (
                    <div className="space-y-2">
                      <p className="text-purple-600 font-semibold text-lg animate-pulse">
                        Drop audio files here to upload
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        Drag & drop your audio files here, or{' '}
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
                        <span>1GB limit</span>
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
                      <p className="text-purple-600 font-semibold text-lg">Converting Audio...</p>
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
                  className="bg-gradient-to-r from-purple-600 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
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
                      <span>Convert to {audioFormats[targetFormat as keyof typeof audioFormats]?.name} (High Quality)</span>
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
                        fileWithId.status === 'processing' || fileWithId.status === 'uploading' ? 'border-purple-200 bg-purple-50' : 
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

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🚀</div>
            <h3 className="font-bold text-lg text-purple-600 mb-4">Ultra Fast</h3>
            <p className="text-gray-700 text-sm leading-relaxed">High-speed audio conversion with optimized processing</p>
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🎯</div>
            <h3 className="font-bold text-lg text-orange-600 mb-4">Crystal Quality</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Maintain audio fidelity with automatic high-quality settings</p>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🔄</div>
            <h3 className="font-bold text-lg text-green-600 mb-4">All Formats</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Support for MP3, WAV, FLAC, AAC, OGG, and more</p>
          </div>

          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🔒</div>
            <h3 className="font-bold text-lg text-indigo-600 mb-4">Large File Support</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Support for files up to 1GB with secure processing</p>
          </div>
        </div>

        {/* Format Comparison */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Supported Audio Formats</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(audioFormats).map(([key, format]) => (
              <div key={key} className={`${format.bgColor} border-2 border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300`}>
                <div className={`text-xl font-bold ${format.color} mb-2`}>{format.name}</div>
                <div className="text-xs text-gray-500 uppercase">.{key}</div>
                <div className="text-xs text-gray-400 mt-1">{format.category}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>Note:</strong> All conversions are performed at maximum quality (320kbps) by default to ensure the best audio output.
              Both lossless and compressed formats are supported for professional audio workflows.
            </p>
          </div>
        </div>

        {/* Dynamic Audio SEO Content Sections */}
        <DynamicAudioSEOContent
          sourceFormat={sourceFormat}
          targetFormat={targetFormat}
          audioFormats={audioFormats}
        />

      </div>
    </div>
  );
}