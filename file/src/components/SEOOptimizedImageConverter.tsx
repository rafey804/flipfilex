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

// Dynamic SEO Content Component
interface DynamicSEOContentProps {
  sourceFormat: string;
  targetFormat: string;
  imageFormats: Record<string, { name: string; color: string; bgColor: string; canOutput: boolean }>;
}

const DynamicSEOContent = ({ sourceFormat, targetFormat, imageFormats }: DynamicSEOContentProps) => {
  const fromFormat = imageFormats[sourceFormat]?.name || sourceFormat.toUpperCase();
  const toFormat = imageFormats[targetFormat]?.name || targetFormat.toUpperCase();

  // Force component to be stable and not unmount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render to prevent SSR mismatches, but add mounted class for styling
  const renderClass = mounted ? 'opacity-100' : 'opacity-0';

  // UNIQUE CONVERSION-SPECIFIC DESCRIPTIONS - NO DUPLICATE CONTENT
  const getConversionSpecificDescription = (from: string, to: string) => {
    const conversionKey = `${from.toLowerCase()}_to_${to.toLowerCase()}`;

    const uniqueConversions: Record<string, { sourceDesc: string; targetDesc: string; why: string }> = {
      // PNG conversions - each unique
      'png_to_jpg': {
        sourceDesc: 'PNG files excel at preserving crisp graphics, logos, and images with transparency, but their large file sizes can slow down websites and consume storage space unnecessarily.',
        targetDesc: 'JPEG format specializes in compressing photographic content efficiently, making it perfect for web publishing, social media sharing, and reducing storage requirements while maintaining visual appeal.',
        why: 'Converting PNG to JPEG becomes essential when you need smaller file sizes for faster website loading, easier email sharing, or when transparency is not required for your specific use case.'
      },
      'png_to_webp': {
        sourceDesc: 'PNG provides excellent quality for graphics and screenshots but lacks the advanced compression technology needed for modern web performance optimization.',
        targetDesc: 'WebP delivers the same visual quality as PNG but with significantly smaller file sizes through Google\'s advanced compression algorithms, perfect for modern website optimization.',
        why: 'This conversion is crucial for website owners seeking Core Web Vitals improvements, faster page loading, and better user experience without sacrificing image quality.'
      },
      'png_to_jpeg': {
        sourceDesc: 'PNG format stores every pixel with perfect accuracy, making it ideal for graphics work but creating unnecessarily large files for photographic content sharing.',
        targetDesc: 'JPEG format uses sophisticated algorithms specifically designed for photographs, achieving dramatic size reductions while maintaining perceptually identical quality for most viewers.',
        why: 'Converting PNG to JPEG is essential for photographers, bloggers, and content creators who need to balance image quality with practical file size limitations for online sharing.'
      },

      // WebP conversions - each unique
      'webp_to_png': {
        sourceDesc: 'WebP offers excellent compression but faces compatibility challenges with older software, design tools, and systems that require universal image format support.',
        targetDesc: 'PNG provides guaranteed compatibility across all platforms, applications, and devices while preserving transparency and maintaining professional-grade image quality.',
        why: 'This conversion is necessary when working with design software, printing services, or legacy systems that don\'t support WebP, ensuring your images work everywhere.'
      },
      'webp_to_jpg': {
        sourceDesc: 'WebP contains advanced features like transparency and animation that may not be needed for simple photograph sharing and can cause compatibility issues.',
        targetDesc: 'JPEG provides the most universal format for photographic content, ensuring your images display correctly on every device, platform, and application worldwide.',
        why: 'Converting WebP to JPEG ensures maximum compatibility for photo sharing, social media posting, and working with traditional photography workflows and printing services.'
      },

      // TIFF conversions - unique professional focus
      'tiff_to_png': {
        sourceDesc: 'TIFF files contain extensive metadata and professional color information perfect for print workflows but create oversized files impractical for digital sharing and web use.',
        targetDesc: 'PNG maintains the visual quality and transparency features you need while creating manageable file sizes suitable for digital workflows, web publishing, and online collaboration.',
        why: 'Photographers and designers convert TIFF to PNG when moving from print-focused workflows to digital publishing, maintaining quality while achieving practical file sizes.'
      },
      'tiff_to_jpg': {
        sourceDesc: 'TIFF format preserves every detail and color nuance from professional cameras and scanners but creates enormous files unsuitable for sharing or web publishing.',
        targetDesc: 'JPEG efficiently compresses photographic data while preserving the visual impact, making your professional images practical for client galleries, social media, and web portfolios.',
        why: 'Professional photographers convert TIFF to JPEG for client delivery, portfolio websites, and social media marketing while maintaining the visual quality that represents their work.'
      },

      // AVIF conversions - cutting edge focus
      'avif_to_png': {
        sourceDesc: 'AVIF represents the latest in image compression technology but faces limited software support and compatibility issues with traditional design and editing workflows.',
        targetDesc: 'PNG ensures your images work with all design software, printing services, and legacy systems while maintaining the transparency and quality your projects require.',
        why: 'Convert AVIF to PNG when you need guaranteed compatibility with professional design tools, print workflows, or when working with clients using traditional software.'
      },
      'avif_to_jpg': {
        sourceDesc: 'AVIF offers superior compression but remains incompatible with many social media platforms, email clients, and traditional photo sharing services.',
        targetDesc: 'JPEG provides universal acceptance across all platforms, ensuring your photos display correctly on social media, in email attachments, and on any device or application.',
        why: 'This conversion is essential for social media managers, content creators, and anyone sharing photos across diverse platforms and devices that may not support AVIF format.'
      },

      // SVG conversions - vector to raster focus
      'svg_to_png': {
        sourceDesc: 'SVG vector graphics offer infinite scalability and small file sizes but face compatibility limitations with photo editing software and traditional image workflows.',
        targetDesc: 'PNG provides a fixed-resolution bitmap that works with all image editing software, social media platforms, and traditional digital workflows requiring raster graphics.',
        why: 'Designers convert SVG to PNG when they need specific resolution outputs, compatibility with raster-based workflows, or when preparing graphics for platforms that don\'t support vector formats.'
      },
      'svg_to_jpg': {
        sourceDesc: 'SVG graphics maintain perfect clarity at any size but need conversion to bitmap formats for use in traditional photography workflows and raster-based applications.',
        targetDesc: 'JPEG creates standard bitmap images compatible with all photo editing software, social platforms, and traditional image workflows requiring specific resolution outputs.',
        why: 'This conversion is necessary when incorporating vector graphics into photographic compositions, creating marketing materials, or preparing graphics for traditional print workflows.'
      },

      // BMP conversions - raw quality focus
      'bmp_to_jpg': {
        sourceDesc: 'BMP files contain pure, uncompressed pixel data perfect for technical applications but create enormously large files impractical for sharing or storage.',
        targetDesc: 'JPEG applies intelligent compression specifically designed for photographic content, dramatically reducing file sizes while maintaining visual quality for practical use.',
        why: 'Technical professionals convert BMP to JPEG when moving from specialized applications to general-purpose use, maintaining visual quality while achieving manageable file sizes.'
      },
      'bmp_to_png': {
        sourceDesc: 'BMP format stores raw pixel data without compression, ensuring perfect accuracy but creating massive files unsuitable for modern digital workflows.',
        targetDesc: 'PNG provides lossless compression that maintains the same visual quality while significantly reducing file sizes, making images practical for digital use.',
        why: 'This conversion is ideal for maintaining perfect image quality while creating files suitable for web use, digital archiving, and sharing across modern platforms.'
      },

      // GIF conversions - animation and compatibility focus
      'gif_to_png': {
        sourceDesc: 'GIF format supports animation but is limited to 256 colors, making it unsuitable for high-quality static images that require full color depth and transparency.',
        targetDesc: 'PNG delivers millions of colors with full alpha transparency, perfect for high-quality static graphics that require superior color accuracy and professional presentation.',
        why: 'Converting GIF to PNG is essential when you need superior image quality for logos, graphics, or any static image where color accuracy and transparency control are paramount.'
      },
      'gif_to_jpg': {
        sourceDesc: 'GIF files are optimized for simple graphics and animations but lack the sophisticated compression algorithms needed for efficient photographic content storage.',
        targetDesc: 'JPEG excels at compressing complex photographic content with smooth color gradients, achieving much better quality-to-size ratios for realistic images.',
        why: 'This conversion becomes necessary when you have photographic content mistakenly saved as GIF, allowing you to achieve better quality and smaller file sizes for sharing.'
      },

      // TIFF to WebP/AVIF - professional to modern web
      'tiff_to_webp': {
        sourceDesc: 'TIFF format preserves maximum image data for professional printing workflows but creates files too large for modern web applications and online distribution.',
        targetDesc: 'WebP provides near-lossless quality with advanced compression that reduces file sizes by 50-80%, making professional-grade images practical for web use.',
        why: 'Professional photographers and designers convert TIFF to WebP when adapting print-quality images for modern websites, maintaining visual excellence while achieving web-friendly file sizes.'
      },
      'tiff_to_avif': {
        sourceDesc: 'TIFF format captures every nuance and detail from professional imaging equipment but produces files impractical for modern digital distribution and storage.',
        targetDesc: 'AVIF represents cutting-edge compression technology that maintains professional image quality while achieving the smallest possible file sizes for next-generation web applications.',
        why: 'Forward-thinking professionals convert TIFF to AVIF for future-proof image archives that maintain quality while minimizing storage costs and maximizing web performance.'
      },

      // JPEG/JPG to modern formats
      'jpg_to_webp': {
        sourceDesc: 'JPEG format serves photography well but lacks the advanced compression algorithms and features needed for modern web performance optimization.',
        targetDesc: 'WebP provides 25-50% better compression than JPEG while supporting transparency and better quality retention, perfect for modern web applications.',
        why: 'Website owners convert JPEG to WebP to improve loading speeds, reduce bandwidth costs, and achieve better Core Web Vitals scores for improved search rankings.'
      },
      'jpg_to_avif': {
        sourceDesc: 'JPEG compression technology, while widely supported, cannot match the efficiency of next-generation image formats for web optimization.',
        targetDesc: 'AVIF delivers superior compression with better quality retention, representing the future of web image optimization with up to 50% size reduction over JPEG.',
        why: 'Progressive websites convert JPEG to AVIF for maximum performance gains, faster loading times, and better user experience on modern browsers.'
      },
      'jpeg_to_webp': {
        sourceDesc: 'JPEG format provides good compression for photographs but lacks modern features like transparency support and advanced compression algorithms.',
        targetDesc: 'WebP combines the best of JPEG and PNG, offering superior compression for photos while adding transparency support and better browser optimization.',
        why: 'Converting JPEG to WebP is essential for modern web development, providing better performance, smaller files, and enhanced features for responsive design.'
      },
      'jpeg_to_avif': {
        sourceDesc: 'JPEG has served digital photography for decades but cannot compete with modern compression standards for bandwidth-conscious applications.',
        targetDesc: 'AVIF represents the pinnacle of image compression technology, delivering the smallest file sizes while maintaining or improving visual quality compared to JPEG.',
        why: 'Tech-forward developers convert JPEG to AVIF for next-generation websites that prioritize performance, user experience, and efficient resource utilization.'
      },

      // PNG to modern formats for web optimization
      'png_to_avif': {
        sourceDesc: 'PNG provides excellent quality and transparency but creates large files that can significantly impact website performance and user experience.',
        targetDesc: 'AVIF delivers the same visual quality as PNG with transparency support but at dramatically reduced file sizes through revolutionary compression technology.',
        why: 'Modern web developers convert PNG to AVIF for optimal website performance, maintaining visual quality while achieving the fastest possible loading speeds.'
      },

      // HEIC conversions - mobile to universal
      'heic_to_jpg': {
        sourceDesc: 'HEIC format provides excellent compression for iPhone photos but faces compatibility issues with non-Apple devices, software, and online platforms.',
        targetDesc: 'JPEG ensures your photos work everywhere - on any device, platform, or application without compatibility concerns or special software requirements.',
        why: 'Converting HEIC to JPEG is essential for sharing iPhone photos across diverse platforms, ensuring recipients can view your images regardless of their device or software.'
      },
      'heic_to_png': {
        sourceDesc: 'HEIC offers efficient storage for iOS photography but limits sharing and editing options due to restricted software support outside Apple ecosystems.',
        targetDesc: 'PNG provides universal compatibility with professional image editing software while maintaining high quality and transparency support for versatile usage.',
        why: 'This conversion enables iPhone users to work with their photos in professional editing workflows and share images that work with all design and editing software.'
      },
      'heic_to_webp': {
        sourceDesc: 'HEIC delivers good compression for mobile photography but lacks the web optimization features needed for modern digital publishing and online sharing.',
        targetDesc: 'WebP combines efficient compression with web-optimized features, making mobile photos perfect for websites, blogs, and online portfolios.',
        why: 'Content creators convert HEIC to WebP for optimal web publishing, ensuring mobile photos load quickly while maintaining quality for online audiences.'
      },

      // ICO conversions - icon specific
      'ico_to_png': {
        sourceDesc: 'ICO format serves Windows icons well but contains multiple resolutions in one file, making it impractical for general image editing and web use.',
        targetDesc: 'PNG extracts the best resolution from ICO files while providing universal compatibility with all image editing software and web platforms.',
        why: 'Designers convert ICO to PNG when they need to edit, modify, or repurpose icon graphics for different applications, ensuring maximum flexibility and editing capability.'
      }
    };

    const conversion = uniqueConversions[conversionKey];
    if (conversion) {
      return conversion;
    }

    // Fallback for other combinations
    return {
      sourceDesc: `${fromFormat} format serves specific technical purposes but may not be optimal for your current workflow requirements and intended use case.`,
      targetDesc: `${toFormat} format offers advantages in compatibility, file size, or features that better match your specific project needs and distribution requirements.`,
      why: `Converting ${fromFormat} to ${toFormat} helps optimize your images for your specific workflow, platform requirements, and intended audience.`
    };
  };

  const getConversionBenefits = (from: string, to: string) => {
    const benefits = [];

    // Size optimization benefits
    if (['jpg', 'jpeg', 'png', 'bmp', 'tiff'].includes(from) && ['avif', 'webp'].includes(to)) {
      benefits.push({
        title: 'Significant Size Reduction',
        description: `Convert ${fromFormat} to ${toFormat} for up to 50-80% smaller file sizes while maintaining excellent quality.`,
        icon: '📉'
      });
    }

    // Quality benefits
    if (['jpg', 'jpeg'].includes(from) && ['png', 'avif', 'webp'].includes(to)) {
      benefits.push({
        title: 'Enhanced Quality',
        description: `${toFormat} format preserves better image quality and supports transparency unlike ${fromFormat}.`,
        icon: '✨'
      });
    }

    // Web optimization
    if (['png', 'jpg', 'jpeg', 'bmp', 'tiff'].includes(from) && ['webp', 'avif'].includes(to)) {
      benefits.push({
        title: 'Web Performance Boost',
        description: `${toFormat} images load faster and improve Core Web Vitals scores for better SEO rankings.`,
        icon: '🚀'
      });
    }

    // Compatibility benefits
    if (['avif', 'webp', 'heic'].includes(from) && ['jpg', 'jpeg', 'png'].includes(to)) {
      benefits.push({
        title: 'Universal Compatibility',
        description: `Convert to ${toFormat} for maximum compatibility across all devices and applications.`,
        icon: '🔄'
      });
    }

    // Default benefits if none match
    if (benefits.length === 0) {
      benefits.push(
        {
          title: 'Format Optimization',
          description: `Converting ${fromFormat} to ${toFormat} optimizes your images for specific use cases and requirements.`,
          icon: '⚡'
        },
        {
          title: 'Professional Quality',
          description: 'Maintain image quality while optimizing for your specific needs and workflow requirements.',
          icon: '🎯'
        }
      );
    }

    return benefits.slice(0, 4); // Return maximum 4 benefits
  };

  const getTechnicalSpecs = (format: string) => {
    const specs: Record<string, Record<string, string>> = {
      'avif': {
        'Compression': 'Lossy & Lossless',
        'Max Resolution': '65,536 × 65,536 px',
        'Color Depth': '8, 10, 12 bits',
        'Transparency': 'Full Alpha Support',
        'Animation': 'Supported',
        'Browser Support': '90%+ (Chrome 85+, Firefox 93+)'
      },
      'webp': {
        'Compression': 'Lossy & Lossless',
        'Max Resolution': '16,383 × 16,383 px',
        'Color Depth': '8 bits per channel',
        'Transparency': '8-bit Alpha Channel',
        'Animation': 'Supported',
        'Browser Support': '95%+ (All modern browsers)'
      },
      'png': {
        'Compression': 'Lossless',
        'Max Resolution': '2,147,483,647 × 2,147,483,647 px',
        'Color Depth': '1, 2, 4, 8, 16 bits',
        'Transparency': 'Full Alpha Support',
        'Animation': 'Not Supported',
        'Browser Support': '100% (Universal)'
      },
      'jpg': {
        'Compression': 'Lossy',
        'Max Resolution': '65,535 × 65,535 px',
        'Color Depth': '8 bits per channel',
        'Transparency': 'Not Supported',
        'Animation': 'Not Supported',
        'Browser Support': '100% (Universal)'
      },
      'jpeg': {
        'Compression': 'Lossy',
        'Max Resolution': '65,535 × 65,535 px',
        'Color Depth': '8 bits per channel',
        'Transparency': 'Not Supported',
        'Animation': 'Not Supported',
        'Browser Support': '100% (Universal)'
      },
      'gif': {
        'Compression': 'Lossless',
        'Max Resolution': '65,535 × 65,535 px',
        'Color Depth': '8 bits (256 colors)',
        'Transparency': '1-bit (On/Off)',
        'Animation': 'Supported',
        'Browser Support': '100% (Universal)'
      },
      'svg': {
        'Type': 'Vector Graphics',
        'Max Resolution': 'Scalable (Infinite)',
        'Color Depth': 'Full Color Support',
        'Transparency': 'Full Alpha Support',
        'Animation': 'CSS/JS Animation',
        'Browser Support': '95%+ (All modern browsers)'
      }
    };

    return specs[format.toLowerCase()] || {
      'Type': 'Image Format',
      'Support': 'Various Applications',
      'Usage': 'Specialized Applications'
    };
  };

  const getUseCases = (from: string, to: string) => {
    const useCases = [];

    if (to === 'webp' || to === 'avif') {
      useCases.push(
        {
          title: 'Web Performance Optimization',
          description: 'Modern websites demand faster loading times to improve user experience and search engine rankings. Converting images to WebP or AVIF can reduce file sizes by 25-80% while maintaining visual quality, directly improving Core Web Vitals scores, reducing bandwidth costs, and enhancing mobile user experience on slower connections.'
        },
        {
          title: 'E-commerce Product Catalogs',
          description: 'Online retailers with thousands of product images benefit enormously from smaller file sizes without quality loss. Converting product photos to WebP/AVIF reduces page load times, improves conversion rates, decreases bounce rates, and allows for faster product gallery browsing. Studies show that every 100ms improvement in load time can increase conversion rates by up to 1%.'
        },
        {
          title: 'Content Delivery Networks (CDN)',
          description: 'Global content distribution requires efficient image formats to minimize bandwidth costs and improve delivery speeds across different geographic regions. WebP and AVIF formats significantly reduce data transfer costs, enable faster content delivery to users worldwide, and improve performance on mobile networks with limited bandwidth.'
        },
        {
          title: 'Mobile Application Development',
          description: 'Mobile apps with constrained storage and bandwidth benefit from optimized image formats. Converting images to WebP/AVIF reduces app download sizes, decreases data usage for users on metered connections, improves app performance on lower-end devices, and extends battery life by reducing processing overhead.'
        },
        {
          title: 'Progressive Web Applications (PWAs)',
          description: 'PWAs aim to provide native app-like experiences through web browsers, requiring optimal performance and efficient resource usage. Modern image formats like WebP and AVIF ensure faster loading, better caching efficiency, improved offline functionality, and enhanced user engagement across all devices and network conditions.'
        },
        {
          title: 'Digital Marketing Campaigns',
          description: 'Marketing materials across social media, email campaigns, and display advertising require balance between visual impact and loading speed. Optimized image formats ensure faster ad loading, better user engagement, reduced bounce rates from slow-loading content, and improved campaign ROI through better performance metrics.'
        }
      );
    }

    if (to === 'png') {
      useCases.push(
        {
          title: 'Professional Logo Design',
          description: 'Brand identities require crisp, scalable graphics with transparency support for versatile usage across different backgrounds and contexts. PNG\'s lossless compression preserves sharp edges, text clarity, and transparency effects essential for logos, watermarks, and brand elements that maintain visual integrity across print and digital media.'
        },
        {
          title: 'User Interface Design',
          description: 'Modern UI/UX design relies heavily on transparent elements, icons, and graphics that blend seamlessly with various backgrounds. PNG format ensures pixel-perfect rendering of interface elements, maintains transparency for overlays and modal windows, and preserves the precise visual design intended by designers across different screen densities.'
        },
        {
          title: 'Technical Documentation',
          description: 'Screenshots, diagrams, and instructional images in technical documentation require absolute clarity and detail preservation. PNG\'s lossless compression ensures that text remains readable, interface elements stay sharp, and important details are preserved for educational content, software manuals, and technical guides.'
        },
        {
          title: 'Print Media Preparation',
          description: 'Professional printing workflows demand high-quality images without compression artifacts that could affect print quality. PNG format preserves image fidelity for brochures, flyers, business cards, and marketing materials, ensuring consistent color reproduction and sharp details when transferred from digital to print media.'
        },
        {
          title: 'Game Asset Development',
          description: 'Video game graphics, sprites, and UI elements require transparency support and pixel-perfect quality for seamless integration into game environments. PNG format maintains transparent backgrounds for character sprites, UI elements, and textures while preserving the artistic integrity essential for immersive gaming experiences.'
        },
        {
          title: 'Scientific and Medical Imaging',
          description: 'Research, medical imaging, and scientific documentation require absolutely accurate image reproduction without any data loss. PNG\'s lossless compression ensures that diagnostic images, research photos, microscopy results, and scientific charts maintain their analytical value and accuracy for professional and academic use.'
        }
      );
    }

    if (to === 'jpg' || to === 'jpeg') {
      useCases.push(
        {
          title: 'Digital Photography Portfolios',
          description: 'Professional photographers need to balance image quality with manageable file sizes for online portfolios, client galleries, and social media sharing. JPEG compression optimizes photographic content by reducing file sizes while maintaining perceptual quality, enabling faster portfolio loading, easier client sharing, and efficient online gallery management.'
        },
        {
          title: 'Social Media Content Creation',
          description: 'Social media platforms have specific image requirements and users expect fast-loading content. JPEG format ensures optimal file sizes for platforms like Instagram, Facebook, and Twitter while maintaining sufficient quality for social sharing, enabling faster uploads, better engagement, and consistent visual presentation across platforms.'
        },
        {
          title: 'Blog and Content Publishing',
          description: 'Content creators and bloggers need images that load quickly without compromising their message or visual appeal. JPEG compression reduces bandwidth usage, improves page loading speeds, enhances SEO performance through faster load times, and ensures broader compatibility across all devices and browsers for maximum audience reach.'
        },
        {
          title: 'Email Marketing Campaigns',
          description: 'Email marketing requires images that load quickly across various email clients and network conditions. JPEG format ensures smaller file sizes that don\'t trigger email size limits, faster loading in email clients, better deliverability rates, and improved user engagement with visual content in email campaigns.'
        },
        {
          title: 'Real Estate Photography',
          description: 'Property listings require high-quality images that showcase homes and commercial spaces while maintaining reasonable file sizes for MLS systems and real estate websites. JPEG compression optimizes property photos for faster website loading, easier MLS uploads, better search performance, and enhanced user experience for potential buyers.'
        },
        {
          title: 'Event and Wedding Photography',
          description: 'Event photographers need to deliver large quantities of photos to clients efficiently while maintaining quality standards. JPEG format enables faster photo processing, easier online gallery creation, convenient client downloads, and efficient storage management for large event photo collections without compromising visual quality.'
        }
      );
    }

    if (to === 'gif') {
      useCases.push(
        {
          title: 'Animated Marketing Content',
          description: 'Short animated sequences capture attention more effectively than static images in digital marketing. GIF format provides universal compatibility for animated content across all platforms, instant loading without video players, engaging visual storytelling for social media, and effective demonstration of products or services in bite-sized, looping animations.'
        },
        {
          title: 'Educational Demonstrations',
          description: 'Step-by-step tutorials and educational content benefit from simple animations that demonstrate processes clearly. GIF format enables easy creation of instructional animations, seamless integration into educational materials, clear visualization of complex procedures, and accessible learning content that works across all devices and platforms.'
        },
        {
          title: 'User Interface Prototyping',
          description: 'Designers and developers use animated GIFs to demonstrate user interface interactions and user experience flows. This format allows for quick sharing of interaction concepts, clear communication of animation ideas, easy integration into design presentations, and efficient stakeholder review of proposed user interface behaviors.'
        }
      );
    }

    if (to === 'svg') {
      useCases.push(
        {
          title: 'Responsive Web Design',
          description: 'Modern websites must adapt to countless screen sizes and resolutions. Converting raster images to SVG (embedded) ensures consistent visual quality across all devices, from mobile phones to large desktop displays, while maintaining crisp rendering at any scale and reducing the need for multiple image sizes.'
        },
        {
          title: 'Scalable Graphics Systems',
          description: 'Applications requiring graphics that scale infinitely without quality loss benefit from SVG format. This includes mapping applications, data visualization platforms, interactive diagrams, and any system where users need to zoom in or scale graphics while maintaining perfect clarity and detail.'
        }
      );
    }

    if (to === 'ico') {
      useCases.push(
        {
          title: 'Website Favicon Creation',
          description: 'Every website needs a favicon for browser tabs, bookmarks, and mobile app icons. Converting images to ICO format ensures proper browser compatibility, crisp display at small sizes, consistent branding across all platforms, and proper representation of your brand in browser interfaces and bookmark collections.'
        },
        {
          title: 'Desktop Application Icons',
          description: 'Software applications require professional-looking icons for desktop shortcuts, taskbars, and file associations. ICO format provides multiple resolutions in one file, ensuring optimal display quality at different sizes, consistent branding across Windows environments, and professional software presentation.'
        }
      );
    }

    if (useCases.length === 0) {
      useCases.push(
        {
          title: 'Cross-Platform Compatibility',
          description: 'Converting between image formats ensures your visual content works seamlessly across different operating systems, devices, and software applications. This standardization prevents compatibility issues, ensures consistent visual presentation, and eliminates technical barriers that could prevent your audience from accessing your content.'
        },
        {
          title: 'Legacy System Integration',
          description: 'Older software systems and specialized applications often require specific image formats for proper functionality. Format conversion enables integration with legacy systems, ensures compatibility with existing workflows, maintains business continuity, and allows modern content to work with established technical infrastructure.'
        },
        {
          title: 'Workflow Standardization',
          description: 'Professional teams benefit from standardized image formats that streamline collaboration and processing workflows. Converting to a common format reduces confusion, improves team efficiency, ensures consistent quality standards, and simplifies technical processes for better productivity and project management.'
        },
        {
          title: 'Storage Optimization',
          description: 'Different image formats offer varying compression ratios and quality levels. Strategic format conversion helps optimize storage usage while maintaining required quality levels, reducing cloud storage costs, improving backup efficiency, and enabling better resource management for large image collections.'
        },
        {
          title: 'Performance Optimization',
          description: 'Application performance often depends on using the most appropriate image format for each specific use case. Converting to optimal formats improves loading speeds, reduces memory usage, enhances user experience, and ensures applications run efficiently across different devices and network conditions.'
        },
        {
          title: 'Future-Proofing Content',
          description: 'Technology standards evolve, and image format support changes over time. Converting to widely supported or emerging formats ensures your visual content remains accessible, maintains relevance with advancing technology, and provides longevity for your digital assets and brand materials.'
        }
      );
    }

    return useCases.slice(0, 6);
  };

  const getFAQs = (from: string, to: string) => {
    // Helper functions to avoid complex template literals
    const getQualityAnswer = (targetFormat: string) => {
      if (targetFormat === 'png' || targetFormat === 'bmp' || targetFormat === 'tiff') {
        return `Since ${targetFormat.toUpperCase()} uses lossless compression, no quality will be lost.`;
      } else if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
        return 'JPEG uses lossy compression, so there may be a slight quality reduction, but it is usually imperceptible for most images.';
      } else {
        return 'Our converter is optimized to maintain the best possible quality during conversion.';
      }
    };

    const getAdvantages = (targetFormat: string) => {
      if (targetFormat === 'webp' || targetFormat === 'avif') {
        return 'better compression efficiency, smaller file sizes, and modern browser support';
      } else if (targetFormat === 'png') {
        return 'lossless compression, transparency support, and universal compatibility';
      } else if (targetFormat === 'jpg') {
        return 'excellent compression for photos, small file sizes, and universal support';
      } else {
        return 'specific benefits for your use case and improved compatibility';
      }
    };

    const getIdealUse = (targetFormat: string) => {
      if (targetFormat === 'webp' || targetFormat === 'avif') {
        return 'web applications and modern workflows';
      } else if (targetFormat === 'png') {
        return 'graphics, logos, and images requiring transparency';
      } else if (targetFormat === 'jpg') {
        return 'photography and general web use';
      } else {
        return 'your specific requirements';
      }
    };

    const getSupportInfo = (targetFormat: string) => {
      if (targetFormat === 'png' || targetFormat === 'jpg' || targetFormat === 'jpeg' || targetFormat === 'gif') {
        return `${targetFormat.toUpperCase()} has universal support across all browsers, devices, and applications.`;
      } else if (targetFormat === 'webp') {
        return 'WebP is supported by all modern browsers including Chrome, Firefox, Safari, and Edge (95%+ global support).';
      } else if (targetFormat === 'avif') {
        return 'AVIF is supported by most modern browsers with 90%+ coverage and growing rapidly.';
      } else if (targetFormat === 'svg') {
        return 'SVG is supported by all modern browsers and is ideal for scalable graphics.';
      } else {
        return `${targetFormat.toUpperCase()} is supported by most modern applications and platforms.`;
      }
    };

    return [
      {
        question: `Will converting ${fromFormat} to ${toFormat} reduce image quality?`,
        answer: `The quality depends on the formats involved. ${getQualityAnswer(to)} You can adjust quality settings if needed.`
      },
      {
        question: `What are the main advantages of ${toFormat.toUpperCase()} over ${fromFormat.toUpperCase()}?`,
        answer: `${toFormat.toUpperCase()} offers several advantages including ${getAdvantages(to)}. This makes it ideal for ${getIdealUse(to)}.`
      },
      {
        question: `Is ${toFormat.toUpperCase()} format widely supported?`,
        answer: `${getSupportInfo(to)} For maximum compatibility, you can always convert back to more universal formats if needed.`
      },
      {
        question: `How long does it take to convert ${fromFormat} to ${toFormat}?`,
        answer: `Conversion time depends on image size and complexity, but most ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()} conversions complete within 5-30 seconds. Our optimized servers ensure fast processing while maintaining quality. Larger files or batch conversions may take longer.`
      },
      {
        question: `Can I convert multiple ${fromFormat.toUpperCase()} files to ${toFormat.toUpperCase()} at once?`,
        answer: `Yes! Our converter supports batch processing. You can upload up to 5 ${fromFormat.toUpperCase()} files at once and convert them all to ${toFormat.toUpperCase()} simultaneously. This saves time when working with multiple images.`
      },
      {
        question: `Are my ${fromFormat.toUpperCase()} files safe during conversion?`,
        answer: `Absolutely! All uploads are processed securely over HTTPS encryption. Your original ${fromFormat.toUpperCase()} files and converted ${toFormat.toUpperCase()} files are automatically deleted from our servers after 1 hour. We never store, share, or analyze your images.`
      }
    ];
  };

  const getRelatedTools = (from: string, to: string) => {
    const tools = [];

    // Add reverse conversion
    if (imageFormats[to]?.canOutput && from !== to) {
      tools.push({
        title: `${toFormat} to ${fromFormat} Converter`,
        href: `/${to}-to-${from}`,
        description: `Convert ${toFormat} back to ${fromFormat} format for compatibility or editing purposes.`
      });
    }

    // Add popular alternative conversions
    const alternatives = ['png', 'jpg', 'webp', 'avif'];
    alternatives.forEach(alt => {
      if (alt !== from && alt !== to && tools.length < 5) {
        const altFormat = imageFormats[alt]?.name || alt.toUpperCase();
        tools.push({
          title: `${fromFormat} to ${altFormat} Converter`,
          href: `/${from}-to-${alt}`,
          description: `Convert ${fromFormat} images to ${altFormat} format for different use cases and requirements.`
        });
      }
    });

    // Add general tools
    if (tools.length < 5) {
      tools.push({
        title: 'Image Compressor',
        href: '/compress-image',
        description: 'Reduce image file sizes while maintaining quality across multiple formats.'
      });
    }

    return tools.slice(0, 5);
  };

  const benefits = getConversionBenefits(sourceFormat, targetFormat);
  const sourceSpecs = getTechnicalSpecs(sourceFormat);
  const targetSpecs = getTechnicalSpecs(targetFormat);
  const useCases = getUseCases(sourceFormat, targetFormat);
  const faqs = getFAQs(sourceFormat, targetFormat);
  const relatedTools = getRelatedTools(sourceFormat, targetFormat);

  // UNIQUE SECTION TITLES for each conversion combination
  const getSectionTitles = (from: string, to: string) => {
    const conversionKey = `${from.toLowerCase()}_to_${to.toLowerCase()}`;

    const uniqueTitles: Record<string, {
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
      'png_to_jpg': {
        howTo: `Transform PNG Graphics to JPEG Photos in 3 Simple Steps`,
        whyFrom: `PNG Limitations for Modern Web Publishing`,
        whyTo: `JPEG Advantages for Photo Sharing`,
        whyMatters: `Critical Benefits of PNG to JPEG Transformation`,
        benefits: `Key Advantages of Converting PNG Graphics to JPEG Format`,
        technical: `PNG vs JPEG: Complete Technical Analysis`,
        useCases: `Professional Applications for PNG to JPEG Conversion`,
        faq: `PNG to JPEG Conversion: Expert Answers`,
        relatedTools: `Essential PNG and JPEG Conversion Tools`
      },
      'png_to_webp': {
        howTo: `Optimize PNG Images to WebP for Superior Web Performance`,
        whyFrom: `PNG Performance Bottlenecks in Modern Websites`,
        whyTo: `WebP Technology for Next-Generation Web Images`,
        whyMatters: `Revolutionary Web Performance Through PNG to WebP Conversion`,
        benefits: `Core Benefits of Upgrading PNG to Advanced WebP Format`,
        technical: `PNG vs WebP: Comprehensive Technology Comparison`,
        useCases: `Strategic Use Cases for PNG to WebP Optimization`,
        faq: `PNG to WebP Migration: Technical Questions Answered`,
        relatedTools: `Advanced WebP and PNG Optimization Solutions`
      },
      'webp_to_png': {
        howTo: `Convert WebP to PNG for Universal Compatibility`,
        whyFrom: `WebP Compatibility Challenges in Professional Workflows`,
        whyTo: `PNG Universal Support Across All Platforms`,
        whyMatters: `Essential Compatibility Through WebP to PNG Conversion`,
        benefits: `Major Advantages of Converting WebP to Reliable PNG`,
        technical: `WebP vs PNG: Detailed Compatibility Analysis`,
        useCases: `Professional Scenarios Requiring WebP to PNG Conversion`,
        faq: `WebP to PNG Compatibility: Complete Guide`,
        relatedTools: `Professional WebP and PNG Workflow Tools`
      },
      'jpg_to_webp': {
        howTo: `Modernize JPEG Photos with Advanced WebP Technology`,
        whyFrom: `JPEG Limitations in Contemporary Web Development`,
        whyTo: `WebP Innovation for Efficient Photo Distribution`,
        whyMatters: `Future-Proofing Photos Through JPEG to WebP Upgrade`,
        benefits: `Compelling Reasons to Convert JPEG to Modern WebP`,
        technical: `JPEG vs WebP: Advanced Compression Technology Review`,
        useCases: `Strategic Applications for JPEG to WebP Migration`,
        faq: `JPEG to WebP Modernization: Technical Insights`,
        relatedTools: `Cutting-Edge JPEG and WebP Processing Tools`
      },
      'tiff_to_png': {
        howTo: `Transform Professional TIFF Files to Practical PNG Format`,
        whyFrom: `TIFF File Size Challenges in Digital Workflows`,
        whyTo: `PNG Efficiency for Professional Digital Publishing`,
        whyMatters: `Streamlining Professional Workflows Through TIFF to PNG Conversion`,
        benefits: `Professional Benefits of Converting TIFF to Optimized PNG`,
        technical: `TIFF vs PNG: Professional Format Comparison`,
        useCases: `Industry Applications for TIFF to PNG Transformation`,
        faq: `TIFF to PNG Professional Conversion: Expert Guide`,
        relatedTools: `Professional TIFF and PNG Workflow Solutions`
      },
      'avif_to_png': {
        howTo: `Convert Cutting-Edge AVIF to Universal PNG Format`,
        whyFrom: `AVIF Compatibility Limitations in Current Software`,
        whyTo: `PNG Reliability for Established Workflows`,
        whyMatters: `Ensuring Workflow Continuity Through AVIF to PNG Conversion`,
        benefits: `Strategic Advantages of Converting AVIF to Trusted PNG`,
        technical: `AVIF vs PNG: Emerging vs Established Technology Analysis`,
        useCases: `Professional Scenarios for AVIF to PNG Migration`,
        faq: `AVIF to PNG Compatibility: Technical Solutions`,
        relatedTools: `Next-Generation AVIF and PNG Processing Tools`
      },
      'jpg_to_png': {
        howTo: `Upgrade JPEG Photos to Professional PNG Quality`,
        whyFrom: `JPEG Compression Artifacts in Professional Applications`,
        whyTo: `PNG Transparency and Lossless Quality Benefits`,
        whyMatters: `Professional Image Quality Through JPEG to PNG Enhancement`,
        benefits: `Quality Improvements When Converting JPEG to PNG Format`,
        technical: `JPEG vs PNG: Lossy vs Lossless Quality Comparison`,
        useCases: `Professional Photography Applications for JPEG to PNG`,
        faq: `JPEG to PNG Quality Enhancement: Professional Guide`,
        relatedTools: `Professional JPEG and PNG Quality Tools`
      },
      'webp_to_jpg': {
        howTo: `Convert WebP to JPEG for Maximum Device Compatibility`,
        whyFrom: `WebP Adoption Challenges in Traditional Environments`,
        whyTo: `JPEG Universal Recognition Across All Systems`,
        whyMatters: `Device Compatibility Through WebP to JPEG Conversion`,
        benefits: `Universal Access Benefits of Converting WebP to JPEG`,
        technical: `WebP vs JPEG: Modern vs Traditional Format Analysis`,
        useCases: `Cross-Platform Distribution for WebP to JPEG Conversion`,
        faq: `WebP to JPEG Compatibility: Universal Access Solutions`,
        relatedTools: `Cross-Platform WebP and JPEG Conversion Suite`
      },
      'png_to_avif': {
        howTo: `Modernize PNG Images with Next-Generation AVIF Technology`,
        whyFrom: `PNG File Size Inefficiencies in Modern Web Applications`,
        whyTo: `AVIF Revolutionary Compression for Future-Ready Websites`,
        whyMatters: `Next-Generation Web Performance Through PNG to AVIF Migration`,
        benefits: `Revolutionary Compression Benefits of PNG to AVIF Conversion`,
        technical: `PNG vs AVIF: Traditional vs Next-Generation Technology`,
        useCases: `Future-Proof Web Development with PNG to AVIF`,
        faq: `PNG to AVIF Future-Proofing: Advanced Technology Guide`,
        relatedTools: `Next-Generation PNG and AVIF Optimization Platform`
      },
      'gif_to_png': {
        howTo: `Transform Animated GIF to High-Quality PNG Images`,
        whyFrom: `GIF Color Limitations in Modern Graphic Design`,
        whyTo: `PNG Full-Color Support for Professional Graphics`,
        whyMatters: `Professional Graphics Enhancement Through GIF to PNG Conversion`,
        benefits: `Color Quality Improvements Converting GIF to PNG Format`,
        technical: `GIF vs PNG: Limited vs Full-Color Format Comparison`,
        useCases: `Graphic Design Applications for GIF to PNG Enhancement`,
        faq: `GIF to PNG Color Enhancement: Design Professional Guide`,
        relatedTools: `Professional GIF and PNG Graphic Design Tools`
      },
      'bmp_to_png': {
        howTo: `Optimize BMP Files to Efficient PNG Format`,
        whyFrom: `BMP Uncompressed File Size Problems in Modern Workflows`,
        whyTo: `PNG Lossless Compression for Practical File Management`,
        whyMatters: `File Efficiency Through BMP to PNG Optimization`,
        benefits: `Storage Optimization Benefits of BMP to PNG Conversion`,
        technical: `BMP vs PNG: Uncompressed vs Lossless Compression Analysis`,
        useCases: `Digital Asset Management with BMP to PNG Optimization`,
        faq: `BMP to PNG Storage Optimization: Efficiency Guide`,
        relatedTools: `Digital Asset BMP and PNG Management Tools`
      },
      // Add many more unique combinations to prevent fallbacks
      'bmp_to_jpg': {
        howTo: `Compress Large BMP Files to Compact JPEG Format`,
        whyFrom: `BMP Raw Data Storage Inefficiencies for Digital Sharing`,
        whyTo: `JPEG Smart Compression for Practical Photo Distribution`,
        whyMatters: `Digital Photo Efficiency Through BMP to JPEG Compression`,
        benefits: `File Size Reduction Benefits of BMP to JPEG Conversion`,
        technical: `BMP vs JPEG: Raw Storage vs Smart Compression Technology`,
        useCases: `Photo Archive Optimization with BMP to JPEG`,
        faq: `BMP to JPEG Compression: Photo Optimization Guide`,
        relatedTools: `Photo Archive BMP and JPEG Optimization Suite`
      },
      'tiff_to_jpg': {
        howTo: `Convert Professional TIFF Images to Shareable JPEG`,
        whyFrom: `TIFF Professional Quality vs File Size Practicality`,
        whyTo: `JPEG Photo Sharing Excellence for Digital Distribution`,
        whyMatters: `Professional Photo Sharing Through TIFF to JPEG Conversion`,
        benefits: `Sharing Efficiency Benefits of TIFF to JPEG Transformation`,
        technical: `TIFF vs JPEG: Professional vs Sharing-Optimized Analysis`,
        useCases: `Professional Photography Distribution with TIFF to JPEG`,
        faq: `TIFF to JPEG Professional Sharing: Photography Guide`,
        relatedTools: `Professional TIFF and JPEG Photography Workflow`
      },
      'tiff_to_webp': {
        howTo: `Modernize TIFF Professional Images with WebP Technology`,
        whyFrom: `TIFF Legacy Format Constraints in Digital Publishing`,
        whyTo: `WebP Modern Efficiency for Professional Web Content`,
        whyMatters: `Professional Web Publishing Through TIFF to WebP Evolution`,
        benefits: `Web Publishing Benefits of TIFF to WebP Modernization`,
        technical: `TIFF vs WebP: Legacy Professional vs Modern Web Analysis`,
        useCases: `Professional Web Publishing with TIFF to WebP`,
        faq: `TIFF to WebP Professional Web Publishing: Modern Guide`,
        relatedTools: `Professional TIFF and WebP Web Publishing Platform`
      },
      'avif_to_jpg': {
        howTo: `Convert Advanced AVIF to Compatible JPEG Format`,
        whyFrom: `AVIF Cutting-Edge Technology vs Current Compatibility Needs`,
        whyTo: `JPEG Reliable Compatibility for Universal Photo Access`,
        whyMatters: `Universal Photo Access Through AVIF to JPEG Compatibility`,
        benefits: `Compatibility Assurance Benefits of AVIF to JPEG Conversion`,
        technical: `AVIF vs JPEG: Next-Gen vs Universal Compatibility Analysis`,
        useCases: `Universal Photo Distribution with AVIF to JPEG`,
        faq: `AVIF to JPEG Universal Access: Compatibility Solutions`,
        relatedTools: `Universal AVIF and JPEG Compatibility Platform`
      },
      'gif_to_jpg': {
        howTo: `Transform Animated GIF Frames to JPEG Photos`,
        whyFrom: `GIF Animation Limitations for Static Photo Needs`,
        whyTo: `JPEG Photo Quality Excellence for Visual Content`,
        whyMatters: `Visual Content Enhancement Through GIF to JPEG Transformation`,
        benefits: `Photo Quality Benefits of GIF to JPEG Enhancement`,
        technical: `GIF vs JPEG: Animation vs Photo Quality Analysis`,
        useCases: `Visual Content Creation with GIF to JPEG`,
        faq: `GIF to JPEG Photo Enhancement: Visual Content Guide`,
        relatedTools: `Visual Content GIF and JPEG Enhancement Tools`
      },
      'svg_to_png': {
        howTo: `Render Vector SVG Graphics to Pixel-Perfect PNG`,
        whyFrom: `SVG Vector Scalability vs Pixel Control Requirements`,
        whyTo: `PNG Pixel Precision for Exact Visual Specifications`,
        whyMatters: `Precise Visual Control Through SVG to PNG Rendering`,
        benefits: `Pixel Control Benefits of SVG to PNG Rendering`,
        technical: `SVG vs PNG: Vector Scalability vs Pixel Precision Analysis`,
        useCases: `Graphic Design Precision with SVG to PNG`,
        faq: `SVG to PNG Pixel Rendering: Design Precision Guide`,
        relatedTools: `Vector SVG and PNG Graphic Design Precision Tools`
      },
      'svg_to_jpg': {
        howTo: `Convert Scalable SVG Vectors to JPEG Images`,
        whyFrom: `SVG Vector Format Limitations in Photo Workflows`,
        whyTo: `JPEG Image Format Excellence for Photo Integration`,
        whyMatters: `Photo Workflow Integration Through SVG to JPEG Conversion`,
        benefits: `Photo Integration Benefits of SVG to JPEG Transformation`,
        technical: `SVG vs JPEG: Vector Graphics vs Photo Format Analysis`,
        useCases: `Photo Workflow Integration with SVG to JPEG`,
        faq: `SVG to JPEG Photo Integration: Workflow Solutions`,
        relatedTools: `Vector SVG and JPEG Photo Workflow Integration`
      },
      'heic_to_jpg': {
        howTo: `Convert iPhone HEIC Photos to Universal JPEG`,
        whyFrom: `HEIC Apple-Specific Format vs Cross-Platform Needs`,
        whyTo: `JPEG Universal Photo Standard for Device Independence`,
        whyMatters: `Cross-Platform Photo Sharing Through HEIC to JPEG Liberation`,
        benefits: `Universal Sharing Benefits of HEIC to JPEG Liberation`,
        technical: `HEIC vs JPEG: Apple-Specific vs Universal Photo Analysis`,
        useCases: `Cross-Platform Photo Sharing with HEIC to JPEG`,
        faq: `HEIC to JPEG Universal Sharing: Cross-Platform Guide`,
        relatedTools: `Cross-Platform HEIC and JPEG Photo Sharing Tools`
      },
      'heic_to_png': {
        howTo: `Transform iPhone HEIC to Professional PNG Quality`,
        whyFrom: `HEIC Mobile Format vs Professional Editing Requirements`,
        whyTo: `PNG Professional Quality for Advanced Photo Editing`,
        whyMatters: `Professional Photo Editing Through HEIC to PNG Enhancement`,
        benefits: `Professional Editing Benefits of HEIC to PNG Enhancement`,
        technical: `HEIC vs PNG: Mobile vs Professional Photo Analysis`,
        useCases: `Professional Photo Editing with HEIC to PNG`,
        faq: `HEIC to PNG Professional Enhancement: Editing Guide`,
        relatedTools: `Professional HEIC and PNG Photo Editing Suite`
      },
      'ico_to_png': {
        howTo: `Extract Windows ICO Icons to Editable PNG Graphics`,
        whyFrom: `ICO System Icon Format vs Graphic Design Flexibility`,
        whyTo: `PNG Graphic Design Freedom for Creative Modifications`,
        whyMatters: `Creative Design Freedom Through ICO to PNG Extraction`,
        benefits: `Design Flexibility Benefits of ICO to PNG Extraction`,
        technical: `ICO vs PNG: System Icons vs Design Graphics Analysis`,
        useCases: `Icon Design Modification with ICO to PNG`,
        faq: `ICO to PNG Design Extraction: Creative Solutions`,
        relatedTools: `Icon ICO and PNG Design Modification Platform`
      }
    };

    // If no predefined titles exist, create unique dynamic ones
    if (uniqueTitles[conversionKey]) {
      return uniqueTitles[conversionKey];
    }

    // Create completely unique fallback titles that will never be duplicated
    const dynamicTitles = {
      howTo: `Master ${fromFormat}-to-${toFormat} Image Transformation Process`,
      whyFrom: `${fromFormat} Format Challenges and Conversion Necessity`,
      whyTo: `${toFormat} Format Superiority for Your Image Needs`,
      whyMatters: `Strategic Advantages of ${fromFormat}-to-${toFormat} Image Migration`,
      benefits: `Transformation Benefits: Upgrading ${fromFormat} to ${toFormat} Format`,
      technical: `${fromFormat} vs ${toFormat}: Comprehensive Format Technology Review`,
      useCases: `Professional Applications for ${fromFormat}-to-${toFormat} Image Processing`,
      faq: `${fromFormat}-to-${toFormat} Conversion: Complete Technical Reference`,
      relatedTools: `${fromFormat} and ${toFormat} Professional Image Processing Suite`
    };

    return dynamicTitles;
  };

  const sectionTitles = getSectionTitles(sourceFormat, targetFormat);

  return (
    <div className={`space-y-16 transition-opacity duration-1000 ${renderClass}`}>
      {/* How to Convert Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {sectionTitles.howTo}
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Converting {fromFormat} images to {toFormat} format is simple with our free online converter. Follow these easy steps to optimize your images:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload {fromFormat} Files</h3>
              <p className="text-gray-600 text-sm">Select your {fromFormat} images or drag and drop them into the upload area. Up to 5 files supported.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Convert to {toFormat}</h3>
              <p className="text-gray-600 text-sm">Click the convert button and our server will process your {fromFormat} images instantly.</p>
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
            Our {fromFormat} to {toFormat} converter maintains image quality while optimizing for your specific needs. The conversion process is completely free, secure, and works directly in your browser. Your files are automatically deleted after one hour for complete privacy.
          </p>
        </div>
      </div>

      {/* UNIQUE CONVERSION-SPECIFIC CONTENT - NO DUPLICATE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            {sectionTitles.whyFrom}
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 leading-relaxed mb-6">
              {getConversionSpecificDescription(sourceFormat, targetFormat).sourceDesc}
            </p>
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">Current Format Limitations:</h4>
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
            {sectionTitles.whyTo}
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 leading-relaxed mb-6">
              {getConversionSpecificDescription(sourceFormat, targetFormat).targetDesc}
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
          {sectionTitles.whyMatters}
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed text-lg">
            {getConversionSpecificDescription(sourceFormat, targetFormat).why}
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          {sectionTitles.benefits}
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
          {sectionTitles.technical}
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
          {sectionTitles.useCases}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          {sectionTitles.faq}
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
          {sectionTitles.relatedTools}
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed mb-8 text-center">
            Explore our complete suite of image conversion tools for all your format optimization needs:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTools.map((tool, index) => (
              <a key={index} href={tool.href} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">{tool.title}</h3>
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

        {/* Dynamic SEO Content Sections */}
        <DynamicSEOContent
          sourceFormat={sourceFormat}
          targetFormat={targetFormat}
          imageFormats={imageFormats}
        />
      </div>
    </div>
  );
}