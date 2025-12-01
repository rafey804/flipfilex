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

interface VideoFormatConverterProps {
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

// Video format options - moved outside component to prevent recreation
const videoFormats = {
  'mp4': { name: 'MP4', color: 'text-blue-600', bgColor: 'bg-blue-50', category: 'Consumer' },
  'mov': { name: 'MOV', color: 'text-purple-600', bgColor: 'bg-purple-50', category: 'Consumer' },
  'wmv': { name: 'WMV', color: 'text-green-600', bgColor: 'bg-green-50', category: 'Consumer' },
  'avi': { name: 'AVI', color: 'text-red-600', bgColor: 'bg-red-50', category: 'Consumer' },
  'mkv': { name: 'MKV', color: 'text-indigo-600', bgColor: 'bg-indigo-50', category: 'Consumer' },
  'flv': { name: 'FLV', color: 'text-yellow-600', bgColor: 'bg-yellow-50', category: 'Consumer' },
  'webm': { name: 'WebM', color: 'text-emerald-600', bgColor: 'bg-emerald-50', category: 'Consumer' },
  'mpeg': { name: 'MPEG-2', color: 'text-gray-600', bgColor: 'bg-gray-50', category: 'Professional' },
  'h264': { name: 'H.264', color: 'text-cyan-600', bgColor: 'bg-cyan-50', category: 'Professional' },
  'h265': { name: 'H.265/HEVC', color: 'text-pink-600', bgColor: 'bg-pink-50', category: 'Professional' }
};

// Dynamic Video SEO Content Component
interface DynamicVideoSEOContentProps {
  sourceFormat: string;
  targetFormat: string;
  videoFormats: Record<string, { name: string; color: string; bgColor: string; category: string }>;
}

const DynamicVideoSEOContent = ({ sourceFormat, targetFormat, videoFormats }: DynamicVideoSEOContentProps) => {
  const fromFormat = videoFormats[sourceFormat]?.name || sourceFormat.toUpperCase();
  const toFormat = videoFormats[targetFormat]?.name || targetFormat.toUpperCase();

  // Force component to be stable and not unmount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render to prevent SSR mismatches, but add mounted class for styling
  const renderClass = mounted ? 'opacity-100' : 'opacity-0';

  // UNIQUE VIDEO CONVERSION-SPECIFIC DESCRIPTIONS - NO DUPLICATE CONTENT
  const getVideoConversionSpecificDescription = (from: string, to: string) => {
    const conversionKey = `${from.toLowerCase()}_to_${to.toLowerCase()}`;

    const uniqueVideoConversions: Record<string, { sourceDesc: string; targetDesc: string; why: string }> = {
      // MP4 conversions - universal compatibility focus
      'mp4_to_mov': {
        sourceDesc: 'MP4 files provide excellent compatibility and compression but may require conversion for professional video editing workflows that prefer Apple\'s QuickTime format.',
        targetDesc: 'MOV format offers superior compatibility with Apple ecosystems, professional editing software like Final Cut Pro, and provides better metadata preservation for video production.',
        why: 'Converting MP4 to MOV becomes essential for professional video editors working in Apple-centric workflows, ensuring seamless integration with Final Cut Pro and other professional video tools.'
      },
      'mp4_to_avi': {
        sourceDesc: 'MP4 uses modern compression algorithms that may not be compatible with older video editing systems and legacy software that require more traditional video containers.',
        targetDesc: 'AVI format provides universal compatibility with older systems, Windows Media Player, and legacy video editing software while maintaining excellent video quality.',
        why: 'This conversion is necessary when working with older systems, legacy video editing software, or when you need maximum compatibility across diverse hardware and software environments.'
      },
      'mp4_to_mkv': {
        sourceDesc: 'MP4 format focuses on broad compatibility but has limitations in supporting multiple audio tracks, subtitles, and advanced metadata features needed for complex media.',
        targetDesc: 'MKV container supports unlimited audio tracks, multiple subtitle languages, chapter markers, and extensive metadata, making it ideal for comprehensive media collections.',
        why: 'Converting MP4 to MKV is essential for creating professional media libraries with multiple languages, subtitle tracks, and complex audio configurations for international distribution.'
      },
      'mp4_to_webm': {
        sourceDesc: 'MP4 files work well for general purposes but lack the web-optimized features and open-source codec support that modern web applications increasingly require.',
        targetDesc: 'WebM format provides royalty-free codec support, excellent web streaming performance, and native browser support for modern web applications and online video platforms.',
        why: 'Web developers convert MP4 to WebM for better web performance, reduced licensing costs, and improved compatibility with HTML5 video standards and progressive web applications.'
      },

      // MOV conversions - professional to universal
      'mov_to_mp4': {
        sourceDesc: 'MOV files excel in professional video production environments but create compatibility challenges when sharing content across diverse devices and platforms.',
        targetDesc: 'MP4 format ensures universal playback compatibility across all devices, media players, and platforms while maintaining excellent video quality and efficient compression.',
        why: 'Converting MOV to MP4 is essential for content creators who need to share professional video content across diverse platforms, social media, and devices without compatibility issues.'
      },
      'mov_to_avi': {
        sourceDesc: 'MOV format contains advanced Apple-specific features and codecs that may not translate properly to systems requiring more traditional video container formats.',
        targetDesc: 'AVI provides straightforward video container support with excellent compatibility across Windows systems and traditional video editing workflows.',
        why: 'This conversion is necessary when moving professional video content from Apple ecosystems to Windows-based workflows or legacy video editing systems.'
      },
      'mov_to_webm': {
        sourceDesc: 'MOV files are optimized for professional production workflows but lack the web-specific optimizations needed for efficient online video streaming and delivery.',
        targetDesc: 'WebM format delivers optimal web streaming performance with modern codecs designed specifically for internet video distribution and HTML5 compatibility.',
        why: 'Professional content creators convert MOV to WebM when adapting high-quality video content for web distribution, ensuring optimal streaming performance and broad browser support.'
      },

      // AVI conversions - legacy to modern
      'avi_to_mp4': {
        sourceDesc: 'AVI format provides reliable video storage but uses older compression methods that create larger file sizes unsuitable for modern streaming and mobile applications.',
        targetDesc: 'MP4 format employs advanced compression algorithms that significantly reduce file sizes while maintaining video quality, perfect for modern digital distribution.',
        why: 'Converting AVI to MP4 is essential for modernizing video collections, reducing storage costs, and ensuring compatibility with contemporary devices and streaming platforms.'
      },
      'avi_to_mov': {
        sourceDesc: 'AVI files work well for general purposes but lack the sophisticated metadata handling and professional features required for advanced video editing workflows.',
        targetDesc: 'MOV format provides comprehensive metadata support, professional codec compatibility, and seamless integration with high-end video editing and production software.',
        why: 'Video professionals convert AVI to MOV when upgrading to professional editing workflows that require advanced metadata, color space support, and professional codec compatibility.'
      },
      'avi_to_webm': {
        sourceDesc: 'AVI format uses traditional compression methods that create large files impractical for web streaming and lack the optimization features needed for online video delivery.',
        targetDesc: 'WebM format provides cutting-edge compression specifically designed for web streaming, ensuring fast loading times and excellent quality for online video content.',
        why: 'This conversion enables legacy video content to be optimized for modern web applications, improving loading speeds and user experience for online video platforms.'
      },

      // MKV conversions - feature-rich to compatible
      'mkv_to_mp4': {
        sourceDesc: 'MKV containers support extensive features like multiple audio tracks and subtitles but face compatibility limitations with consumer devices and popular media players.',
        targetDesc: 'MP4 format provides universal device compatibility while maintaining core video and audio quality, ensuring playback across all consumer electronics and mobile devices.',
        why: 'Converting MKV to MP4 is necessary for sharing feature-rich video content on consumer devices, mobile platforms, and standard media players that prioritize compatibility over advanced features.'
      },
      'mkv_to_mov': {
        sourceDesc: 'MKV format excels at containing complex media but may not integrate seamlessly with Apple-centric professional video workflows and editing applications.',
        targetDesc: 'MOV format ensures optimal compatibility with Apple professional video tools while preserving video quality and enabling seamless editing workflow integration.',
        why: 'Professional editors convert MKV to MOV when working with Apple video editing suites, ensuring full feature compatibility and optimal performance in professional production environments.'
      },
      'mkv_to_avi': {
        sourceDesc: 'MKV containers include modern features that may not be compatible with traditional video editing systems and legacy software requiring simpler container formats.',
        targetDesc: 'AVI format provides straightforward video storage that works reliably with older editing systems and traditional video workflows requiring maximum compatibility.',
        why: 'This conversion is essential when working with legacy video editing systems or when you need to ensure compatibility with older hardware and traditional video workflows.'
      },

      // WebM conversions - web to universal
      'webm_to_mp4': {
        sourceDesc: 'WebM format excels for web streaming but may face compatibility limitations with offline video editing software and consumer media players.',
        targetDesc: 'MP4 provides universal compatibility across all video editing software, media players, and devices while maintaining excellent video quality for offline use.',
        why: 'Converting WebM to MP4 is essential when moving web-optimized content to traditional video editing workflows or when broad device compatibility is required.'
      },
      'webm_to_mov': {
        sourceDesc: 'WebM files are optimized for web delivery but lack the professional metadata and codec features required for high-end video editing and post-production work.',
        targetDesc: 'MOV format provides professional-grade metadata support, advanced codec compatibility, and seamless integration with professional video editing suites.',
        why: 'Video professionals convert WebM to MOV when elevating web content to professional editing workflows that require advanced color grading, metadata handling, and professional codec support.'
      },
      'webm_to_avi': {
        sourceDesc: 'WebM format uses modern web-specific codecs that may not be compatible with traditional video editing systems and legacy software requiring established container formats.',
        targetDesc: 'AVI format ensures compatibility with traditional video editing workflows and legacy systems while maintaining video quality for established production pipelines.',
        why: 'This conversion is necessary when integrating modern web content into traditional video production workflows or legacy editing systems that require established container formats.'
      },

      // WMV conversions - Windows-specific to universal
      'wmv_to_mp4': {
        sourceDesc: 'WMV format works excellently within Microsoft ecosystems but creates compatibility challenges when sharing content across diverse devices and non-Windows platforms.',
        targetDesc: 'MP4 format ensures universal compatibility across all operating systems, devices, and media players while maintaining excellent video quality and efficient compression.',
        why: 'Converting WMV to MP4 is essential for sharing Windows-created content across diverse platforms, ensuring universal accessibility and compatibility with modern devices and systems.'
      },
      'wmv_to_mov': {
        sourceDesc: 'WMV files are optimized for Windows environments but lack the professional features and metadata support required for Apple-based video editing workflows.',
        targetDesc: 'MOV format provides comprehensive professional video features, metadata support, and seamless integration with Apple video editing and production environments.',
        why: 'Video professionals convert WMV to MOV when transitioning content from Windows production environments to Apple-based professional editing workflows.'
      },
      'wmv_to_avi': {
        sourceDesc: 'WMV format includes Windows-specific optimizations that may not translate effectively to more universal video container formats needed for cross-platform compatibility.',
        targetDesc: 'AVI provides straightforward video container support that works reliably across different operating systems and traditional video editing applications.',
        why: 'This conversion ensures Windows video content can be used across diverse platforms and traditional editing systems without Microsoft-specific dependencies.'
      },

      // FLV conversions - legacy web to modern
      'flv_to_mp4': {
        sourceDesc: 'FLV format served web streaming well in the Flash era but is now obsolete and incompatible with modern web browsers and mobile devices.',
        targetDesc: 'MP4 format provides modern video compression and universal compatibility across all contemporary devices, browsers, and video platforms.',
        why: 'Converting FLV to MP4 is essential for modernizing legacy web video content, ensuring compatibility with current technology and extending the lifespan of valuable video assets.'
      },
      'flv_to_webm': {
        sourceDesc: 'FLV files are legacy Flash video containers that no longer work with modern web browsers and lack the optimization features needed for contemporary web streaming.',
        targetDesc: 'WebM format provides modern web-optimized video streaming with HTML5 compatibility and efficient compression designed for contemporary internet video distribution.',
        why: 'This conversion enables legacy Flash video content to be modernized for current web standards, ensuring continued accessibility and optimal streaming performance.'
      },
      'flv_to_mov': {
        sourceDesc: 'FLV format is a legacy web video container that lacks the professional features and quality standards required for serious video editing and production work.',
        targetDesc: 'MOV format provides professional-grade video quality, metadata support, and compatibility with advanced video editing software for serious content creation.',
        why: 'Video professionals convert FLV to MOV when salvaging legacy web content for professional editing workflows that require higher quality standards and advanced editing features.'
      },

      // Professional codec conversions
      'h264_to_h265': {
        sourceDesc: 'H.264 codec provides excellent compatibility and quality but uses older compression algorithms that create larger file sizes compared to modern compression standards.',
        targetDesc: 'H.265/HEVC codec delivers up to 50% better compression than H.264 while maintaining the same visual quality, perfect for 4K video and bandwidth-constrained applications.',
        why: 'Converting H.264 to H.265 is essential for 4K video workflows, streaming applications with bandwidth limitations, and storage optimization while maintaining professional quality standards.'
      },
      'h265_to_h264': {
        sourceDesc: 'H.265/HEVC codec provides superior compression but faces compatibility limitations with older devices, editing software, and streaming platforms that require broader support.',
        targetDesc: 'H.264 codec ensures universal compatibility across all devices, editing software, and streaming platforms while maintaining excellent video quality for professional use.',
        why: 'Converting H.265 to H.264 is necessary when broad compatibility is more important than file size optimization, ensuring content works across all devices and platforms.'
      },
      'h264_to_mp4': {
        sourceDesc: 'H.264 codec provides excellent compression but needs to be contained in a widely compatible container format for universal device and software compatibility.',
        targetDesc: 'MP4 container with H.264 codec provides the perfect balance of compression efficiency and universal compatibility across all devices and platforms.',
        why: 'This conversion optimizes professional H.264 content for universal distribution while maintaining compression efficiency and ensuring broad compatibility.'
      },
      'h265_to_mp4': {
        sourceDesc: 'H.265/HEVC codec delivers superior compression but requires appropriate container formatting for optimal compatibility with modern devices and streaming platforms.',
        targetDesc: 'MP4 container with H.265 codec provides cutting-edge compression efficiency while ensuring compatibility with modern devices that support advanced video codecs.',
        why: 'Converting H.265 to MP4 optimizes next-generation video content for modern distribution while maintaining superior compression and quality characteristics.'
      },

      // MPEG conversions - broadcast to consumer
      'mpeg_to_mp4': {
        sourceDesc: 'MPEG-2 format serves broadcast television and professional video well but creates large file sizes impractical for consumer devices and online distribution.',
        targetDesc: 'MP4 format provides modern compression that significantly reduces file sizes while maintaining broadcast quality, perfect for consumer devices and streaming.',
        why: 'Converting MPEG to MP4 is essential for adapting broadcast-quality content for consumer distribution, reducing storage requirements while maintaining professional visual standards.'
      },
      'mpeg_to_mov': {
        sourceDesc: 'MPEG-2 format provides broadcast-quality video but may need professional container features and metadata support for advanced video editing and post-production work.',
        targetDesc: 'MOV format combines broadcast quality with professional editing features, metadata support, and seamless integration with professional video editing workflows.',
        why: 'Video professionals convert MPEG to MOV when incorporating broadcast content into professional editing workflows that require advanced features and metadata handling.'
      },
      'mpeg_to_webm': {
        sourceDesc: 'MPEG-2 format delivers broadcast quality but uses compression methods not optimized for web streaming and lacks the efficiency needed for online video distribution.',
        targetDesc: 'WebM format provides web-optimized compression that maintains broadcast quality while achieving the file sizes and streaming efficiency required for online video.',
        why: 'This conversion enables broadcast-quality content to be optimized for web distribution, ensuring professional quality with the efficiency required for online streaming.'
      }
    };

    const conversion = uniqueVideoConversions[conversionKey];
    if (conversion) {
      return conversion;
    }

    // Fallback for other combinations
    return {
      sourceDesc: `${fromFormat} format serves specific video workflow purposes but may not be optimal for your current distribution requirements and intended audience.`,
      targetDesc: `${toFormat} format offers advantages in compatibility, file size optimization, or features that better match your specific video project needs and distribution requirements.`,
      why: `Converting ${fromFormat} to ${toFormat} helps optimize your videos for your specific workflow, platform requirements, and intended audience engagement.`
    };
  };

  const getVideoConversionBenefits = (from: string, to: string) => {
    const benefits = [];

    // Compression efficiency benefits
    if (['avi', 'wmv', 'flv', 'mpeg'].includes(from) && ['mp4', 'webm', 'h264', 'h265'].includes(to)) {
      benefits.push({
        title: 'Superior Compression',
        description: `Convert ${fromFormat} to ${toFormat} for up to 50-70% smaller file sizes while maintaining excellent video quality.`,
        icon: '📉'
      });
    }

    // Quality benefits
    if (['flv', 'wmv'].includes(from) && ['mp4', 'mov', 'mkv'].includes(to)) {
      benefits.push({
        title: 'Enhanced Quality',
        description: `${toFormat} format provides better video quality and supports modern codecs for superior visual presentation.`,
        icon: '✨'
      });
    }

    // Web optimization
    if (['mov', 'avi', 'wmv', 'mkv'].includes(from) && ['mp4', 'webm'].includes(to)) {
      benefits.push({
        title: 'Web Performance Boost',
        description: `${toFormat} videos load faster and provide better streaming performance for web applications and online platforms.`,
        icon: '🚀'
      });
    }

    // Compatibility benefits
    if (['mov', 'mkv', 'flv', 'wmv'].includes(from) && ['mp4', 'avi'].includes(to)) {
      benefits.push({
        title: 'Universal Compatibility',
        description: `Convert to ${toFormat} for maximum compatibility across all devices, media players, and editing software.`,
        icon: '🔄'
      });
    }

    // Professional features
    if (['avi', 'wmv', 'flv'].includes(from) && ['mov', 'mkv'].includes(to)) {
      benefits.push({
        title: 'Professional Features',
        description: `${toFormat} format supports advanced features like multiple audio tracks, subtitles, and professional metadata.`,
        icon: '🎬'
      });
    }

    // Default benefits if none match
    if (benefits.length === 0) {
      benefits.push(
        {
          title: 'Format Optimization',
          description: `Converting ${fromFormat} to ${toFormat} optimizes your videos for specific use cases and distribution requirements.`,
          icon: '⚡'
        },
        {
          title: 'Professional Quality',
          description: 'Maintain video quality while optimizing for your specific workflow and distribution needs.',
          icon: '🎯'
        }
      );
    }

    return benefits.slice(0, 4); // Return maximum 4 benefits
  };

  const getVideoTechnicalSpecs = (format: string) => {
    const specs: Record<string, Record<string, string>> = {
      'mp4': {
        'Container': 'MPEG-4 Part 14',
        'Codecs': 'H.264, H.265, AAC',
        'Max Resolution': '8K (7680×4320)',
        'Compression': 'Lossy',
        'Streaming': 'Excellent',
        'Compatibility': '100% (Universal)'
      },
      'mov': {
        'Container': 'QuickTime',
        'Codecs': 'Various (ProRes, H.264)',
        'Max Resolution': '8K+ (Professional)',
        'Compression': 'Lossy & Lossless',
        'Streaming': 'Good',
        'Compatibility': 'Excellent (Apple Focused)'
      },
      'avi': {
        'Container': 'Audio Video Interleave',
        'Codecs': 'DivX, Xvid, Uncompressed',
        'Max Resolution': '4K (Limited)',
        'Compression': 'Various',
        'Streaming': 'Limited',
        'Compatibility': '95% (Legacy Support)'
      },
      'mkv': {
        'Container': 'Matroska',
        'Codecs': 'Any (H.264, H.265, VP9)',
        'Max Resolution': 'Unlimited',
        'Compression': 'Any',
        'Streaming': 'Excellent',
        'Compatibility': '85% (Modern Players)'
      },
      'webm': {
        'Container': 'WebM',
        'Codecs': 'VP8, VP9, AV1, Vorbis',
        'Max Resolution': '8K (VP9)',
        'Compression': 'Lossy',
        'Streaming': 'Excellent (Web Optimized)',
        'Compatibility': '95% (Modern Browsers)'
      },
      'wmv': {
        'Container': 'Windows Media Video',
        'Codecs': 'WMV9, VC-1',
        'Max Resolution': '1080p (Typical)',
        'Compression': 'Lossy',
        'Streaming': 'Good (Windows)',
        'Compatibility': '80% (Windows Focused)'
      },
      'flv': {
        'Container': 'Flash Video',
        'Codecs': 'H.264, Sorenson Spark',
        'Max Resolution': '1080p',
        'Compression': 'Lossy',
        'Streaming': 'Legacy Only',
        'Compatibility': 'Obsolete (Flash Required)'
      },
      'h264': {
        'Type': 'Codec (AVC)',
        'Container': 'Various (MP4, MOV)',
        'Max Resolution': '8K',
        'Compression': 'Lossy (Efficient)',
        'Streaming': 'Excellent',
        'Compatibility': '100% (Universal)'
      },
      'h265': {
        'Type': 'Codec (HEVC)',
        'Container': 'Various (MP4, MOV)',
        'Max Resolution': '8K+',
        'Compression': 'Lossy (50% Better)',
        'Streaming': 'Excellent',
        'Compatibility': '85% (Modern Devices)'
      },
      'mpeg': {
        'Container': 'MPEG-2',
        'Codecs': 'MPEG-2 Video/Audio',
        'Max Resolution': '1080i (Broadcast)',
        'Compression': 'Lossy (Broadcast)',
        'Streaming': 'Limited',
        'Compatibility': '100% (Broadcast Standard)'
      }
    };

    return specs[format.toLowerCase()] || {
      'Type': 'Video Format',
      'Support': 'Various Applications',
      'Usage': 'Specialized Applications'
    };
  };

  const getVideoUseCases = (from: string, to: string) => {
    const useCases = [];

    if (to === 'mp4') {
      useCases.push(
        {
          title: 'Social Media Distribution',
          description: 'MP4 format ensures your videos work perfectly across all social media platforms including YouTube, Instagram, TikTok, Facebook, and Twitter. The universal compatibility eliminates upload issues, ensures consistent playback quality, and maximizes audience reach across different devices and platforms.'
        },
        {
          title: 'Mobile Device Optimization',
          description: 'Modern smartphones and tablets prioritize MP4 format for optimal video playback and battery efficiency. Converting to MP4 ensures smooth playback on iOS and Android devices, reduces battery drain during video consumption, and provides the best user experience for mobile audiences.'
        },
        {
          title: 'E-learning and Educational Content',
          description: 'Educational platforms and learning management systems universally support MP4 format for video content delivery. This ensures consistent playback across different devices, reliable streaming for online courses, and seamless integration with educational tools and platforms used by students worldwide.'
        },
        {
          title: 'Professional Video Distribution',
          description: 'Content creators and businesses rely on MP4 for reliable video distribution across multiple channels. The format provides excellent compression for file sharing, consistent quality for client presentations, and universal compatibility for professional video portfolios and marketing materials.'
        }
      );
    }

    if (to === 'mov') {
      useCases.push(
        {
          title: 'Professional Video Editing',
          description: 'MOV format integrates seamlessly with professional video editing software like Final Cut Pro, Adobe Premiere Pro, and DaVinci Resolve. The format preserves maximum video quality during editing, supports professional codecs like ProRes, and maintains metadata crucial for color grading and post-production workflows.'
        },
        {
          title: 'High-End Film Production',
          description: 'Cinema and broadcast production workflows rely on MOV format for its ability to handle uncompressed video, support professional color spaces, and maintain the highest quality standards required for theatrical releases and broadcast television. The format ensures no quality loss during intensive editing processes.'
        },
        {
          title: 'Commercial Video Production',
          description: 'Advertising agencies and commercial video producers use MOV format for client work that requires the highest quality standards. The format supports advanced features like alpha channels for compositing, multiple audio tracks for different markets, and professional metadata for organized project management.'
        },
        {
          title: 'Documentary and Journalism',
          description: 'Documentary filmmakers and journalists prefer MOV format for its reliable quality preservation and professional editing compatibility. The format ensures interview footage maintains broadcast quality, supports extensive metadata for organization, and integrates with professional archival systems.'
        }
      );
    }

    if (to === 'webm') {
      useCases.push(
        {
          title: 'HTML5 Web Applications',
          description: 'Modern web applications use WebM format for optimal video streaming performance and HTML5 compatibility. The format provides excellent compression for fast loading, supports progressive download for better user experience, and works natively with modern web browsers without plugin requirements.'
        },
        {
          title: 'Progressive Web Apps (PWAs)',
          description: 'PWAs leverage WebM format for efficient video content delivery that works across all devices and network conditions. The format ensures fast loading on mobile networks, efficient caching for offline functionality, and consistent performance across different browsers and platforms.'
        },
        {
          title: 'Online Education Platforms',
          description: 'Educational websites and online course platforms use WebM format for reliable video streaming that works globally. The format provides consistent playback quality across different internet speeds, efficient bandwidth usage for cost-effective content delivery, and broad browser support for universal accessibility.'
        },
        {
          title: 'Live Streaming and Broadcasting',
          description: 'Web-based streaming platforms utilize WebM format for real-time video broadcasting with minimal latency. The format supports adaptive streaming for different connection speeds, efficient compression for bandwidth optimization, and modern codec support for high-quality live video transmission.'
        }
      );
    }

    if (to === 'mkv') {
      useCases.push(
        {
          title: 'Media Server and Home Theater',
          description: 'Home theater enthusiasts and media server users prefer MKV format for its ability to contain multiple audio tracks, subtitle languages, and chapter markers in a single file. This creates the ultimate viewing experience with language options, director commentary, and organized content navigation.'
        },
        {
          title: 'International Content Distribution',
          description: 'Content distributors use MKV format for international releases that require multiple language tracks, regional subtitles, and cultural variations. The format efficiently contains all regional versions in one file, simplifying distribution while providing localized viewing experiences for global audiences.'
        },
        {
          title: 'Archive and Preservation',
          description: 'Digital archivists and content preservation specialists rely on MKV format for its ability to store comprehensive metadata, multiple quality versions, and complete content information. The format ensures long-term accessibility while preserving all associated content and historical context.'
        }
      );
    }

    if (to === 'avi') {
      useCases.push(
        {
          title: 'Legacy System Compatibility',
          description: 'Organizations with established video editing workflows and legacy hardware systems rely on AVI format for continued operation. The format ensures compatibility with older editing software, existing hardware systems, and established production pipelines that require consistent video container support.'
        },
        {
          title: 'Windows-Based Workflows',
          description: 'Businesses operating primarily on Windows systems use AVI format for reliable video handling across their infrastructure. The format provides consistent performance with Windows Media Player, integrates well with Microsoft-based video editing tools, and ensures reliable playback across Windows environments.'
        }
      );
    }

    // Default use cases if none of the above match
    if (useCases.length === 0) {
      useCases.push(
        {
          title: 'Cross-Platform Compatibility',
          description: 'Converting between video formats ensures your content works seamlessly across different operating systems, devices, and media players. This standardization prevents playback issues, ensures consistent video quality, and eliminates technical barriers that could prevent your audience from accessing your content.'
        },
        {
          title: 'Workflow Optimization',
          description: 'Professional video teams benefit from standardized formats that streamline editing and distribution workflows. Converting to optimal formats improves editing performance, reduces rendering times, ensures consistent quality standards, and simplifies technical processes for better productivity.'
        },
        {
          title: 'Storage and Bandwidth Optimization',
          description: 'Different video formats offer varying compression ratios and quality levels. Strategic format conversion helps optimize storage usage while maintaining required quality levels, reducing cloud storage costs, improving streaming efficiency, and enabling better resource management for large video libraries.'
        },
        {
          title: 'Future-Proofing Content',
          description: 'Video technology standards evolve rapidly, and format support changes over time. Converting to widely supported or emerging formats ensures your video content remains accessible, maintains relevance with advancing technology, and provides longevity for your digital video assets.'
        }
      );
    }

    return useCases.slice(0, 4);
  };

  const getVideoFAQs = (from: string, to: string) => {
    const getVideoQualityAnswer = (targetFormat: string) => {
      if (['mov', 'mkv'].includes(targetFormat)) {
        return `${targetFormat.toUpperCase()} can maintain or improve quality by supporting lossless codecs and professional video standards.`;
      } else if (['h265', 'webm'].includes(targetFormat)) {
        return `${targetFormat.toUpperCase()} uses advanced compression that often maintains better quality at smaller file sizes.`;
      } else {
        return 'Our converter uses high-quality settings by default to maintain the best possible video quality during conversion.';
      }
    };

    const getVideoAdvantages = (targetFormat: string) => {
      if (targetFormat === 'mp4') {
        return 'universal compatibility, excellent compression, and broad device support';
      } else if (targetFormat === 'mov') {
        return 'professional editing compatibility, high quality preservation, and advanced metadata support';
      } else if (targetFormat === 'webm') {
        return 'web optimization, fast streaming, and modern browser support';
      } else if (targetFormat === 'mkv') {
        return 'multiple audio tracks, subtitle support, and extensive metadata capabilities';
      } else {
        return 'specific benefits for your video workflow and improved compatibility';
      }
    };

    const getVideoIdealUse = (targetFormat: string) => {
      if (targetFormat === 'mp4') {
        return 'social media, mobile devices, and general video sharing';
      } else if (targetFormat === 'mov') {
        return 'professional video editing and high-quality production workflows';
      } else if (targetFormat === 'webm') {
        return 'web applications and HTML5 video streaming';
      } else if (targetFormat === 'mkv') {
        return 'media servers and multi-language content distribution';
      } else {
        return 'your specific video requirements and workflow needs';
      }
    };

    const getVideoSupportInfo = (targetFormat: string) => {
      if (['mp4', 'avi'].includes(targetFormat)) {
        return `${targetFormat.toUpperCase()} has universal support across all devices, media players, and editing software.`;
      } else if (targetFormat === 'mov') {
        return 'MOV is supported by all professional video editing software and provides excellent compatibility with Apple ecosystems.';
      } else if (targetFormat === 'webm') {
        return 'WebM is supported by all modern browsers and provides excellent web streaming performance.';
      } else if (targetFormat === 'mkv') {
        return 'MKV is supported by most modern media players and provides the best features for advanced video content.';
      } else {
        return `${targetFormat.toUpperCase()} is supported by most modern applications and provides specific advantages for your workflow.`;
      }
    };

    return [
      {
        question: `Will converting ${fromFormat} to ${toFormat} reduce video quality?`,
        answer: `Video quality depends on the formats involved and conversion settings. ${getVideoQualityAnswer(to)} We use high-quality conversion settings to ensure the best possible output for your videos.`
      },
      {
        question: `What are the main advantages of ${toFormat.toUpperCase()} over ${fromFormat.toUpperCase()}?`,
        answer: `${toFormat.toUpperCase()} offers several advantages including ${getVideoAdvantages(to)}. This makes it ideal for ${getVideoIdealUse(to)}.`
      },
      {
        question: `Is ${toFormat.toUpperCase()} format widely supported?`,
        answer: `${getVideoSupportInfo(to)} For maximum compatibility, you can always convert to other widely supported formats if needed.`
      },
      {
        question: `How long does it take to convert ${fromFormat} to ${toFormat}?`,
        answer: `Conversion time depends on video length, resolution, and complexity, but most ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()} conversions complete within 30 seconds to 5 minutes. Our optimized servers ensure fast processing while maintaining high quality. Larger files or 4K videos may take longer.`
      },
      {
        question: `Can I convert multiple ${fromFormat.toUpperCase()} files to ${toFormat.toUpperCase()} at once?`,
        answer: `Yes! Our converter supports batch processing. You can upload up to 3 ${fromFormat.toUpperCase()} files at once and convert them all to ${toFormat.toUpperCase()} simultaneously. This saves time when working with multiple videos and ensures consistent quality across all conversions.`
      },
      {
        question: `Are my ${fromFormat.toUpperCase()} videos safe during conversion?`,
        answer: `Absolutely! All uploads are processed securely over HTTPS encryption. Your original ${fromFormat.toUpperCase()} files and converted ${toFormat.toUpperCase()} videos are automatically deleted from our servers after processing. We never store, share, or analyze your video content - your privacy is completely protected.`
      }
    ];
  };

  const getVideoRelatedTools = (from: string, to: string) => {
    const tools = [];

    // Add reverse conversion
    if (from !== to) {
      tools.push({
        title: `${toFormat} to ${fromFormat} Converter`,
        href: `/${to}-to-${from}`,
        description: `Convert ${toFormat} back to ${fromFormat} format for different workflow requirements or compatibility needs.`
      });
    }

    // Add popular alternative conversions
    const alternatives = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
    alternatives.forEach(alt => {
      if (alt !== from && alt !== to && tools.length < 5) {
        const altFormat = videoFormats[alt]?.name || alt.toUpperCase();
        tools.push({
          title: `${fromFormat} to ${altFormat} Converter`,
          href: `/${from}-to-${alt}`,
          description: `Convert ${fromFormat} videos to ${altFormat} format for different platforms and use cases.`
        });
      }
    });

    // Add general tools
    if (tools.length < 5) {
      tools.push({
        title: 'Video Compressor',
        href: '/compress-video',
        description: 'Reduce video file sizes while maintaining quality across multiple formats.'
      });
    }

    return tools.slice(0, 5);
  };

  // UNIQUE SECTION TITLES for each video conversion combination
  const getVideoSectionTitles = (from: string, to: string) => {
    const conversionKey = `${from.toLowerCase()}_to_${to.toLowerCase()}`;

    const uniqueVideoTitles: Record<string, {
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
      'mp4_to_mov': {
        howTo: `Transform MP4 Videos to Professional MOV Format`,
        whyFrom: `MP4 Limitations in Professional Video Editing Workflows`,
        whyTo: `MOV Advantages for Apple-Centric Production Environments`,
        whyMatters: `Professional Workflow Enhancement Through MP4 to MOV Conversion`,
        benefits: `Professional Benefits of Converting MP4 to MOV Format`,
        technical: `MP4 vs MOV: Consumer vs Professional Video Analysis`,
        useCases: `Professional Video Production Applications for MP4 to MOV`,
        faq: `MP4 to MOV Professional Conversion: Expert Answers`,
        relatedTools: `Professional MP4 and MOV Video Production Tools`
      },
      'mov_to_mp4': {
        howTo: `Convert Professional MOV to Universal MP4 Format`,
        whyFrom: `MOV Compatibility Challenges in Cross-Platform Distribution`,
        whyTo: `MP4 Universal Playback Across All Devices and Platforms`,
        whyMatters: `Universal Access Through MOV to MP4 Conversion`,
        benefits: `Universal Compatibility Benefits of Converting MOV to MP4`,
        technical: `MOV vs MP4: Professional vs Universal Format Comparison`,
        useCases: `Cross-Platform Video Distribution with MOV to MP4`,
        faq: `MOV to MP4 Universal Distribution: Compatibility Guide`,
        relatedTools: `Universal MOV and MP4 Distribution Platform`
      },
      'avi_to_mp4': {
        howTo: `Modernize Legacy AVI Videos to Contemporary MP4`,
        whyFrom: `AVI Legacy Format Limitations in Modern Video Workflows`,
        whyTo: `MP4 Modern Compression for Efficient Video Distribution`,
        whyMatters: `Video Library Modernization Through AVI to MP4 Conversion`,
        benefits: `Modernization Benefits of Converting AVI to MP4 Format`,
        technical: `AVI vs MP4: Legacy vs Modern Video Technology`,
        useCases: `Digital Video Archive Modernization with AVI to MP4`,
        faq: `AVI to MP4 Video Modernization: Technology Upgrade Guide`,
        relatedTools: `Legacy AVI and Modern MP4 Conversion Suite`
      },
      'mp4_to_webm': {
        howTo: `Optimize MP4 Videos for Advanced Web Streaming`,
        whyFrom: `MP4 Web Performance Limitations in Modern Applications`,
        whyTo: `WebM Technology for Superior Web Video Experience`,
        whyMatters: `Web Performance Revolution Through MP4 to WebM Optimization`,
        benefits: `Web Performance Benefits of Converting MP4 to WebM`,
        technical: `MP4 vs WebM: Traditional vs Web-Optimized Video Analysis`,
        useCases: `Modern Web Development Applications for MP4 to WebM`,
        faq: `MP4 to WebM Web Optimization: Performance Enhancement Guide`,
        relatedTools: `Advanced MP4 and WebM Web Optimization Tools`
      },
      'webm_to_mp4': {
        howTo: `Convert Web-Optimized WebM to Universal MP4`,
        whyFrom: `WebM Compatibility Limitations in Traditional Media Players`,
        whyTo: `MP4 Universal Support for Comprehensive Video Distribution`,
        whyMatters: `Comprehensive Distribution Through WebM to MP4 Conversion`,
        benefits: `Distribution Benefits of Converting WebM to MP4 Format`,
        technical: `WebM vs MP4: Web-Specific vs Universal Format Analysis`,
        useCases: `Universal Video Distribution with WebM to MP4`,
        faq: `WebM to MP4 Universal Access: Distribution Solutions`,
        relatedTools: `Comprehensive WebM and MP4 Distribution Platform`
      },
      'mkv_to_mp4': {
        howTo: `Convert Feature-Rich MKV to Compatible MP4 Format`,
        whyFrom: `MKV Advanced Features vs Consumer Device Compatibility`,
        whyTo: `MP4 Consumer Device Optimization for Universal Playback`,
        whyMatters: `Consumer Compatibility Through MKV to MP4 Conversion`,
        benefits: `Compatibility Benefits of Converting MKV to MP4 Format`,
        technical: `MKV vs MP4: Feature-Rich vs Consumer-Friendly Analysis`,
        useCases: `Consumer Device Distribution with MKV to MP4`,
        faq: `MKV to MP4 Consumer Compatibility: Device Support Guide`,
        relatedTools: `Consumer MKV and MP4 Compatibility Solutions`
      },
      // Add many more unique video combinations
      'avi_to_mov': {
        howTo: `Upgrade Legacy AVI Videos to Professional MOV Standard`,
        whyFrom: `AVI Traditional Format Constraints in Professional Workflows`,
        whyTo: `MOV Professional Standard for Advanced Video Production`,
        whyMatters: `Professional Video Enhancement Through AVI to MOV Upgrade`,
        benefits: `Production Quality Benefits of AVI to MOV Professional Upgrade`,
        technical: `AVI vs MOV: Traditional vs Professional Video Technology`,
        useCases: `Professional Video Production Enhancement with AVI to MOV`,
        faq: `AVI to MOV Professional Enhancement: Production Guide`,
        relatedTools: `Professional AVI and MOV Video Production Enhancement`
      },
      'wmv_to_mp4': {
        howTo: `Liberate WMV Videos for Universal MP4 Compatibility`,
        whyFrom: `WMV Windows-Lock Format vs Cross-Platform Freedom`,
        whyTo: `MP4 Universal Liberation for Device-Independent Video`,
        whyMatters: `Video Liberation Through WMV to MP4 Cross-Platform Freedom`,
        benefits: `Platform Freedom Benefits of WMV to MP4 Liberation`,
        technical: `WMV vs MP4: Platform-Locked vs Universal Video Analysis`,
        useCases: `Cross-Platform Video Liberation with WMV to MP4`,
        faq: `WMV to MP4 Platform Liberation: Freedom Guide`,
        relatedTools: `Cross-Platform WMV and MP4 Video Liberation Suite`
      },
      'flv_to_mp4': {
        howTo: `Resurrect Legacy FLV Videos with Modern MP4 Technology`,
        whyFrom: `FLV Flash-Era Obsolescence vs Modern Video Requirements`,
        whyTo: `MP4 Contemporary Standard for Future-Proof Video`,
        whyMatters: `Video Resurrection Through FLV to MP4 Modernization`,
        benefits: `Future-Proofing Benefits of FLV to MP4 Video Resurrection`,
        technical: `FLV vs MP4: Obsolete Flash vs Modern Video Analysis`,
        useCases: `Legacy Video Modernization with FLV to MP4`,
        faq: `FLV to MP4 Video Resurrection: Modernization Guide`,
        relatedTools: `Legacy FLV and Modern MP4 Video Resurrection Platform`
      },
      'h264_to_h265': {
        howTo: `Evolve H.264 Videos to Advanced H.265 Compression`,
        whyFrom: `H.264 Established Standard vs Next-Generation Efficiency`,
        whyTo: `H.265 Revolutionary Compression for Bandwidth Optimization`,
        whyMatters: `Compression Evolution Through H.264 to H.265 Technology Advancement`,
        benefits: `Efficiency Revolution Benefits of H.264 to H.265 Compression Evolution`,
        technical: `H.264 vs H.265: Current vs Next-Generation Compression Analysis`,
        useCases: `Bandwidth Optimization with H.264 to H.265`,
        faq: `H.264 to H.265 Compression Evolution: Technology Guide`,
        relatedTools: `H.264 and H.265 Compression Evolution Technology Suite`
      },
      'mp4_to_avi': {
        howTo: `Adapt Modern MP4 Videos for Legacy AVI Compatibility`,
        whyFrom: `MP4 Modern Standard vs Legacy System Requirements`,
        whyTo: `AVI Legacy Compatibility for Established Infrastructure`,
        whyMatters: `Legacy System Support Through MP4 to AVI Adaptation`,
        benefits: `Infrastructure Compatibility Benefits of MP4 to AVI Adaptation`,
        technical: `MP4 vs AVI: Modern vs Legacy Infrastructure Analysis`,
        useCases: `Legacy System Integration with MP4 to AVI`,
        faq: `MP4 to AVI Legacy Adaptation: Infrastructure Guide`,
        relatedTools: `Legacy AVI and Modern MP4 Infrastructure Adaptation`
      }
    };

    // If no predefined titles exist, create unique dynamic ones for videos
    if (uniqueVideoTitles[conversionKey]) {
      return uniqueVideoTitles[conversionKey];
    }

    // Create completely unique fallback titles for videos that will never be duplicated
    const dynamicVideoTitles = {
      howTo: `Execute ${fromFormat}-to-${toFormat} Video Transformation Workflow`,
      whyFrom: `${fromFormat} Video Format Limitations and Migration Requirements`,
      whyTo: `${toFormat} Video Format Excellence for Your Production Needs`,
      whyMatters: `Strategic Video Enhancement: ${fromFormat}-to-${toFormat} Production Upgrade`,
      benefits: `Video Quality Revolution: ${fromFormat} to ${toFormat} Format Advancement`,
      technical: `${fromFormat} vs ${toFormat}: Comprehensive Video Technology Specification`,
      useCases: `Professional Video Production: ${fromFormat}-to-${toFormat} Workflow Applications`,
      faq: `${fromFormat}-to-${toFormat} Video Processing: Advanced Technical Documentation`,
      relatedTools: `${fromFormat} and ${toFormat} Professional Video Production Technology`
    };

    return dynamicVideoTitles;
  };

  const benefits = getVideoConversionBenefits(sourceFormat, targetFormat);
  const sourceSpecs = getVideoTechnicalSpecs(sourceFormat);
  const targetSpecs = getVideoTechnicalSpecs(targetFormat);
  const useCases = getVideoUseCases(sourceFormat, targetFormat);
  const faqs = getVideoFAQs(sourceFormat, targetFormat);
  const relatedTools = getVideoRelatedTools(sourceFormat, targetFormat);
  const videoSectionTitles = getVideoSectionTitles(sourceFormat, targetFormat);

  return (
    <div className={`space-y-16 transition-opacity duration-1000 ${renderClass}`}>
      {/* How to Convert Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {videoSectionTitles.howTo}
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Converting {fromFormat} videos to {toFormat} format is simple with our free online converter. Follow these easy steps to optimize your videos:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload {fromFormat} Files</h3>
              <p className="text-gray-600 text-sm">Select your {fromFormat} videos or drag and drop them into the upload area. Up to 3 files supported.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Convert to {toFormat}</h3>
              <p className="text-gray-600 text-sm">Click the convert button and our server will process your {fromFormat} videos with high quality settings.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Download {toFormat}</h3>
              <p className="text-gray-600 text-sm">Download your converted {toFormat} files immediately. No registration required.</p>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Our {fromFormat} to {toFormat} converter maintains video quality while optimizing for your specific needs. The conversion process is completely free, secure, and works with high-quality settings by default. Your files are automatically deleted after processing for complete privacy.
          </p>
        </div>
      </div>

      {/* UNIQUE VIDEO CONVERSION-SPECIFIC CONTENT - NO DUPLICATE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-red-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            {videoSectionTitles.whyFrom}
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 leading-relaxed mb-6">
              {getVideoConversionSpecificDescription(sourceFormat, targetFormat).sourceDesc}
            </p>
            <div className="bg-white rounded-xl p-4 border border-red-200">
              <h4 className="font-semibold text-gray-900 mb-3">Current Format Specs:</h4>
              <div className="space-y-2">
                {Object.entries(sourceSpecs).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-green-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            {videoSectionTitles.whyTo}
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 leading-relaxed mb-6">
              {getVideoConversionSpecificDescription(sourceFormat, targetFormat).targetDesc}
            </p>
            <div className="bg-white rounded-xl p-4 border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-3">Target Format Advantages:</h4>
              <div className="space-y-2">
                {Object.entries(targetSpecs).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WHY THIS CONVERSION MATTERS - UNIQUE SECTION */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {videoSectionTitles.whyMatters}
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed text-lg">
            {getVideoConversionSpecificDescription(sourceFormat, targetFormat).why}
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {videoSectionTitles.benefits}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Details Section */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {videoSectionTitles.technical}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{fromFormat} Specifications</h3>
              <div className="space-y-3">
                {Object.entries(sourceSpecs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{toFormat} Specifications</h3>
              <div className="space-y-3">
                {Object.entries(targetSpecs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Use Cases Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-indigo-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {videoSectionTitles.useCases}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-700 leading-relaxed text-sm">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          {videoSectionTitles.faq}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Tools Section */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {videoSectionTitles.relatedTools}
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed mb-8 text-center">
            Explore our complete suite of video conversion tools for all your format optimization needs:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTools.map((tool, index) => (
              <a key={index} href={tool.href} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-red-300 group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300">{tool.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VideoFormatConverter({
  sourceFormat: initialSource,
  targetFormat: initialTarget
}: VideoFormatConverterProps = {}) {
  const router = useRouter();

  // State management - REMOVED quality state as requested
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceFormat, setSourceFormat] = useState(initialSource || 'mp4');
  const [targetFormat, setTargetFormat] = useState(initialTarget || 'mov');
  const [dragActive, setDragActive] = useState(false);
  const [supportedFormats, setSupportedFormats] = useState<any>({ input_formats: [], output_formats: [] });
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({ show: false, message: '', type: 'info' });

  // Define notification functions early
  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({ show: true, message, type });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification({ show: false, message: '', type: 'info' });
  }, []);

  const [conversionStats] = useState({
    totalConverted: 45623,
    successRate: 98.7,
    averageTime: 45
  });

  // Generate SEO configuration
  const generateSEOConfig = useCallback((from: string, to: string): ConversionConfig => {
    const fromFormat = videoFormats[from as keyof typeof videoFormats]?.name || from.toUpperCase();
    const toFormat = videoFormats[to as keyof typeof videoFormats]?.name || to.toUpperCase();

    return {
      title: `Convert ${fromFormat} to ${toFormat} | Free Online Video Converter`,
      description: `Convert ${fromFormat} videos to ${toFormat} format online for free`,
      metaDescription: `Convert ${fromFormat} to ${toFormat} online for free, fast and secure. No software required. Maintain video quality while optimizing file size. Supporting batch conversion.`,
      keywords: `${from} to ${to}, ${fromFormat} to ${toFormat}, convert ${from}, ${to} converter, video converter, online converter, free converter`,
      urlSlug: `${from}-to-${to}`,
      h1Title: `Convert ${fromFormat} to ${toFormat}`,
      breadcrumbText: `${fromFormat} to ${toFormat}`
    };
  }, []); // Empty dependency array since videoFormats is now stable

  const [seoConfig, setSeoConfig] = useState<ConversionConfig>(() => 
    generateSEOConfig(sourceFormat, targetFormat)
  );

  // Update SEO config when formats change
  useEffect(() => {
    const newConfig = generateSEOConfig(sourceFormat, targetFormat);
    setSeoConfig(newConfig);
  }, [sourceFormat, targetFormat, generateSEOConfig]);

  // Update conversion type and URL
  const updateConversionType = useCallback((newFrom: string, newTo: string) => {
    // Prevent same format selection
    if (newFrom === newTo) {
      showNotification('Source and target formats cannot be the same. Please select a different format.', 'warning');
      return;
    }

    const newConfig = generateSEOConfig(newFrom, newTo);
    setSeoConfig(newConfig);

    if (router) {
      const cleanUrl = `/${newFrom}-to-${newTo}`;
      router.push(cleanUrl);
    }

    setFiles([]);
    setSourceFormat(newFrom);
    setTargetFormat(newTo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, generateSEOConfig]);

  // Load supported formats
  useEffect(() => {
    const loadSupportedFormats = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${API_BASE_URL}/convert/supported-video-formats`);
        if (response.ok) {
          const formats = await response.json();
          setSupportedFormats(formats);
          if (!formats.notes?.ffmpeg_available) {
            showNotification('FFmpeg is not available. Please install it for video conversion.', 'warning');
          }
        } else {
          throw new Error('Failed to load supported formats');
        }
      } catch (error) {
        console.error('Failed to load supported formats:', error);
        setSupportedFormats({
          input_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'mpeg', 'h264', 'h265'],
          output_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'mpeg', 'h264', 'h265'],
          quality_options: ['high', 'medium', 'low', 'web']
        });
        showNotification('Failed to load supported formats. Using defaults.', 'warning');
      }
    };

    loadSupportedFormats();
  }, [showNotification]);

  // Enhanced file validation
  const validateVideoFile = useCallback((file: File): string | null => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension) {
      return 'File must have a valid extension';
    }
    
    if (supportedFormats.input_formats && !supportedFormats.input_formats.includes(fileExtension)) {
      return `Unsupported format: ${fileExtension.toUpperCase()}. Supported formats: ${supportedFormats.input_formats.join(', ')}`;
    }
    
    // 5GB limit
    const maxSize = 5 * 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      return `File too large (${formatFileSize(file.size)}). Maximum size is 5GB`;
    }
    
    return null;
  }, [supportedFormats]);

  // Dropzone handlers
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    acceptedFiles.forEach((file) => {
      const error = validateVideoFile(file);
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
      showNotification(`${validFiles.length} video file(s) added successfully`, 'success');
    }
  }, [validateVideoFile, showNotification]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': supportedFormats.input_formats?.map((format: string) => `.${format}`) || []
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

  // FIXED: Convert files function with hardcoded high quality
  const convertFiles = async () => {
    if (files.length === 0) {
      showNotification('Please select video files to convert', 'warning');
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
          formData.append('quality', 'high'); // HARDCODED to high quality

          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
          
          console.log('Starting conversion request...');
          const response = await fetch(`${API_BASE_URL}/convert/convert-video`, {
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
            const maxAttempts = 180;
            
            const poll = async () => {
              try {
                attempts++;
                console.log(`Polling attempt ${attempts} for ${result.conversion_id}`);
                
                const progressResponse = await fetch(`${API_BASE_URL}/convert/video-progress/${result.conversion_id}`);
                if (!progressResponse.ok) {
                  throw new Error('Failed to get progress');
                }
                
                const progressData = await progressResponse.json();
                console.log('Progress data:', progressData);
                console.log('Download URL from progress:', progressData.download_url);

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
                  if (!progressData.download_url) {
                    console.error('Conversion completed but download_url is missing!');
                    showNotification('Conversion completed but download link is missing. Please try again.', 'error');
                    setFiles(prev => prev.map(f =>
                      f.id === fileWithId.id
                        ? { ...f, status: 'error', error: 'Download URL not available' }
                        : f
                    ));
                    return;
                  }
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
                
                setTimeout(poll, 5000);
                
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
            
            setTimeout(poll, 2000);
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

  // FIXED: Download function - direct link approach
  const handleDownload = useCallback(async (fileWithId: FileWithId) => {
    console.log('handleDownload called with fileWithId:', fileWithId);
    console.log('downloadUrl value:', fileWithId.downloadUrl);

    if (!fileWithId.downloadUrl) {
      console.error('Download URL is missing:', fileWithId);
      showNotification('Download URL not available. Please try converting again.', 'error');
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const fullUrl = fileWithId.downloadUrl.startsWith('http')
        ? fileWithId.downloadUrl
        : `${API_BASE_URL}${fileWithId.downloadUrl}`;

      console.log('Full download URL:', fullUrl);

      // Create and trigger download link
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = `${fileWithId.file.name.split('.')[0]}_converted.${targetFormat}`;
      link.target = '_blank';

      // Append to DOM, click, and remove
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
      <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-200 rounded-xl flex items-center justify-center shadow-md">
        <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
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
                <a href="/" className="text-gray-500 hover:text-red-600 transition-colors">
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl text-white text-4xl mb-8 shadow-lg">
            🎬
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-6">
            {seoConfig.h1Title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            {seoConfig.description} with 
            <span className="font-semibold text-red-600"> perfect quality</span> and 
            <span className="font-semibold text-pink-600"> optimized compression</span>
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{conversionStats.totalConverted.toLocaleString()}+</div>
              <div className="text-gray-600 text-sm">Videos Converted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{conversionStats.successRate}%</div>
              <div className="text-gray-600 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{conversionStats.averageTime}s</div>
              <div className="text-gray-600 text-sm">Avg. Speed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">Select Video Formats</h2>
            <p className="text-red-100">Choose your source and target video formats - automatically converts in high quality</p>
          </div>
          
          <div className="p-8">
            {/* REMOVED quality selector as requested - only 2 columns now */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">From Format</label>
                <select
                  value={sourceFormat}
                  onChange={(e) => {
                    const newSource = e.target.value;
                    // If target is same as new source, auto-select first available different format
                    if (newSource === targetFormat) {
                      const availableFormats = Object.keys(videoFormats).filter(key => key !== newSource);
                      const newTarget = availableFormats[0] || 'mp4';
                      updateConversionType(newSource, newTarget);
                    } else {
                      updateConversionType(newSource, targetFormat);
                    }
                  }}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring focus:ring-red-200 text-lg"
                >
                  {Object.entries(videoFormats).map(([key, format]) => (
                    <option key={key} value={key}>{format.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">To Format</label>
                <select
                  value={targetFormat}
                  onChange={(e) => {
                    const newTarget = e.target.value;
                    // If source is same as new target, auto-select first available different format
                    if (newTarget === sourceFormat) {
                      const availableFormats = Object.keys(videoFormats).filter(key => key !== newTarget);
                      const newSource = availableFormats[0] || 'mov';
                      updateConversionType(newSource, newTarget);
                    } else {
                      updateConversionType(sourceFormat, newTarget);
                    }
                  }}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:ring focus:ring-pink-200 text-lg"
                >
                  {Object.entries(videoFormats).filter(([key]) => key !== sourceFormat).map(([key, format]) => (
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
                  ? 'border-red-500 bg-gradient-to-br from-red-50 to-pink-50 scale-[1.02] shadow-2xl' 
                  : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-red-400 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50'
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
                    ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 group-hover:from-red-100 group-hover:to-pink-100 group-hover:text-red-600'
                  }
                `}>
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-900 transition-colors">
                    Drop your {videoFormats[sourceFormat as keyof typeof videoFormats]?.name} videos here
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Select {videoFormats[sourceFormat as keyof typeof videoFormats]?.name} videos to convert to {videoFormats[targetFormat as keyof typeof videoFormats]?.name}
                  </p>
                  
                  {isDragActive ? (
                    <div className="space-y-2">
                      <p className="text-red-600 font-semibold text-lg animate-pulse">
                        Drop videos here to upload
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        Drag & drop your videos here, or{' '}
                        <button
                          type="button"
                          className="text-red-600 font-semibold hover:text-red-700 underline decoration-2 underline-offset-2"
                        >
                          browse files
                        </button>
                      </p>
                      <div className="inline-flex items-center space-x-4 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border">
                        <span>{sourceFormat.toUpperCase()}</span>
                        <span className="text-gray-300">•</span>
                        <span>Max 3 files</span>
                        <span className="text-gray-300">•</span>
                        <span>5GB limit</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isProcessing && (
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center rounded-3xl backdrop-blur-sm">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="animate-spin w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-red-600 font-semibold text-lg">Converting Videos...</p>
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
                  className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
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
                      <span>Convert to {videoFormats[targetFormat as keyof typeof videoFormats]?.name} (High Quality)</span>
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
                        fileWithId.status === 'processing' || fileWithId.status === 'uploading' ? 'border-red-200 bg-red-50' : 
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
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">⚡</div>
            <h3 className="font-bold text-lg text-red-600 mb-4">Lightning Fast</h3>
            <p className="text-gray-700 text-sm leading-relaxed">High-quality conversion with optimized processing</p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🎯</div>
            <h3 className="font-bold text-lg text-blue-600 mb-4">Perfect Quality</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Maintain video quality with automatic high-quality settings</p>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🔄</div>
            <h3 className="font-bold text-lg text-green-600 mb-4">Multiple Formats</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Support for MP4, MOV, AVI, MKV, WebM, WMV, and more</p>
          </div>

          <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-6">🔒</div>
            <h3 className="font-bold text-lg text-pink-600 mb-4">Large File Support</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Support for files up to 5GB with secure processing</p>
          </div>
        </div>

        {/* Format Comparison */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Supported Video Formats</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(videoFormats).map(([key, format]) => (
              <div key={key} className={`${format.bgColor} border-2 border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300`}>
                <div className={`text-xl font-bold ${format.color} mb-2`}>{format.name}</div>
                <div className="text-xs text-gray-500 uppercase">.{key}</div>
                <div className="text-xs text-gray-400 mt-1">{format.category}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> All conversions are performed at high quality by default to ensure the best output.
              Professional codecs like H.264 and H.265 provide optimal compression while maintaining video quality.
            </p>
          </div>
        </div>

        {/* Dynamic SEO Content Sections for Videos */}
        <DynamicVideoSEOContent
          sourceFormat={sourceFormat}
          targetFormat={targetFormat}
          videoFormats={videoFormats}
        />
      </div>
    </div>
  );
}