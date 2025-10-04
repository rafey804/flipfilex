  'use client';

  import Link from 'next/link';
  import { usePathname } from 'next/navigation';
  import { useState, useEffect } from 'react';
  import Image from 'next/image';

  // Define the navigation item types
  interface SubNavItem {
    name: string;
    href: string;
    description: string;
    icon?: string;
    comingSoon?: boolean;
    popular?: boolean;
  }

  interface NavItem {
    name: string;
    href?: string;
    description?: string;
    subItems?: SubNavItem[];
  }

  // Main navigation items with comprehensive mega menu structure
  const navigationItems: NavItem[] = [
    {
      name: 'All PDF Tools',
      subItems: [
        {
          name: 'PDF to Word',
          href: '/convert-pdf-to-word-online',
          description: 'Convert PDF files to editable Word documents',
          icon: '📄',
          popular: true
        },
        {
          name: 'Word to PDF', 
          href: '/word-to-pdf-online',
          description: 'Transform Word documents into PDF files',
          icon: '📝',
          popular: true
        },
        {
          name: 'Merge PDFs',
          href: '/merge-pdf-files-free',
          description: 'Combine multiple PDF files into one',
          icon: '📋',
          popular: true
        },
        {
          name: 'PDF to Images',
          href: '/pdf-to-images',
          description: 'Convert PDF pages to image files',
          icon: '🖼️',
          popular: true
        },
        {
          name: 'Split PDF',
          href: '/split-pdf-pages',
          description: 'Split PDF into individual pages or ranges',
          icon: '✂️',
          popular: true
        },
        {
          name: 'Compress PDF',
          href: '/compress-pdf',
          description: 'Reduce PDF file sizes up to 80%',
          icon: '🗜️',
          popular: true
        },
        {
          name: 'PDF Password Protection',
          href: '/pdf-password-protection',
          description: 'Add or remove PDF passwords',
          icon: '🔒',
          popular: true
        },
        {
          name: 'PDF to Excel',
          href: '/pdf-to-excel',
          description: 'Convert PDF tables to Excel spreadsheets',
          icon: '📊',
          comingSoon: true
        },
        {
          name: 'Excel to PDF',
          href: '/excel-to-pdf',
          description: 'Convert Excel to PDF format',
          icon: '📈',
          comingSoon: true
        },
        {
          name: 'PowerPoint to PDF',
          href: '/powerpoint-to-pdf',
          description: 'Convert PowerPoint to PDF',
          icon: '📺',
          comingSoon: true
        },
        {
          name: 'Text to PDF',
          href: '/text-to-pdf',
          description: 'Convert text files to PDF',
          icon: '📃',
          comingSoon: true
        },
        {
          name: 'HTML to PDF',
          href: '/html-to-pdf',
          description: 'Convert HTML to PDF format',
          icon: '🌐',
          comingSoon: true
        }
      ]
    },
    {
      name: 'All Image Tools',
      subItems: [
        {
          name: 'PNG to WebP',
          href: '/png-to-webp',
          description: 'Next-gen web format conversion',
          icon: '🌐',
          popular: true
        },
        {
          name: 'AVIF to PNG',
          href: '/avif-to-png',
          description: 'Universal compatibility conversion',
          icon: '🎨',
          popular: true
        },
        {
          name: 'WebP to PNG',
          href: '/webp-to-png',
          description: 'Wide support format conversion',
          icon: '📸',
          popular: true
        },
        {
          name: 'JPG to PNG',
          href: '/jpg-to-png',
          description: 'Quality preservation conversion',
          icon: '🖼️',
          popular: true
        },
        {
          name: 'PNG to JPG',
          href: '/png-to-jpg',
          description: 'Smaller file sizes optimization',
          icon: '📷'
        },
        {
          name: 'SVG to PNG',
          href: '/svg-to-png',
          description: 'Vector to raster conversion',
          icon: '🎯'
        },
        {
          name: 'GIF to PNG',
          href: '/gif-to-png',
          description: 'Static image conversion',
          icon: '🎭'
        },
        {
          name: 'BMP to PNG',
          href: '/bmp-to-png',
          description: 'Modern format conversion',
          icon: '🎪'
        },
        {
          name: 'TIFF to PNG',
          href: '/tiff-to-png',
          description: 'Professional format conversion',
          icon: '📋'
        },
        {
          name: 'Image Compressor',
          href: '/image-compressor',
          description: 'Reduce image file sizes up to 90%',
          icon: '🗜️',
          popular: true
        },
        {
          name: 'OCR - Image to Text',
          href: '/ocr-image-to-text',
          description: 'Extract text from images with AI',
          icon: '📄',
          popular: true
        },
        {
          name: 'HEIC to JPG',
          href: '/heic-to-jpg',
          description: 'iPhone photos conversion',
          icon: '📱',
          popular: true
        },
        {
          name: 'ICO to PNG',
          href: '/ico-to-png',
          description: 'Icon conversion tool',
          icon: '🔷'
        },
        {
          name: 'JPEG to WebP',
          href: '/jpeg-to-webp',
          description: 'Web optimization conversion',
          icon: '⚡'
        },
        {
          name: 'AVIF to PNG',
          href: '/avif-to-png',
          description: 'Modern to universal format',
          icon: '🎨',
          popular: true
        }
      ]
    },
    {
      name: 'All Video Tools',
      subItems: [
        {
          name: 'MP4 to MOV',
          href: '/mp4-to-mov',
          description: 'Apple QuickTime format',
          icon: '🎬',
          popular: true
        },
        {
          name: 'MOV to MP4',
          href: '/mov-to-mp4',
          description: 'Universal playback format',
          icon: '📺',
          popular: true
        },
        {
          name: 'AVI to MP4',
          href: '/avi-to-mp4',
          description: 'Modern compression format',
          icon: '🎞️'
        },
        {
          name: 'MKV to MP4',
          href: '/mkv-to-mp4',
          description: 'Streaming ready format',
          icon: '📹',
          popular: true
        },
        {
          name: 'WebM to MP4',
          href: '/webm-to-mp4',
          description: 'Cross-platform compatibility',
          icon: '🌐'
        },
        {
          name: 'FLV to MP4',
          href: '/flv-to-mp4',
          description: 'Legacy format conversion',
          icon: '📼'
        },
        {
          name: 'WMV to MP4',
          href: '/wmv-to-mp4',
          description: 'Windows format conversion',
          icon: '🪟'
        },
        {
          name: 'MP4 to WebM',
          href: '/mp4-to-webm',
          description: 'Web optimized format',
          icon: '⚡'
        },
        {
          name: 'Video Compressor',
          href: '/compress-video',
          description: 'Reduce video file sizes',
          icon: '🗜️',
          comingSoon: true
        },
        {
          name: 'Video Trimmer',
          href: '/trim-video',
          description: 'Cut and edit videos',
          icon: '✂️',
          comingSoon: true
        }
      ]
    },
    {
      name: 'All Audio Tools',
      subItems: [
        {
          name: 'WAV to MP3',
          href: '/wav-to-mp3',
          description: 'Convert WAV audio files to MP3 format',
          icon: '🎵',
          popular: true
        },
        {
          name: 'MP3 to WAV',
          href: '/mp3-to-wav',
          description: 'Convert MP3 files to WAV format',
          icon: '🎶',
          popular: true
        },
        {
          name: 'FLAC to MP3',
          href: '/flac-to-mp3',
          description: 'Convert lossless FLAC to MP3',
          icon: '🎼',
          popular: true
        },
        {
          name: 'MP3 to AAC',
          href: '/mp3-to-aac',
          description: 'Universal to Apple format',
          icon: '🎻'
        },
        {
          name: 'AAC to MP3',
          href: '/aac-to-mp3',
          description: 'Convert AAC to MP3 format',
          icon: '🎧',
          popular: true
        },
        {
          name: 'M4A to MP3',
          href: '/m4a-to-mp3',
          description: 'Convert M4A to MP3 format',
          icon: '🎼',
          popular: true
        },
        {
          name: 'WMA to MP3',
          href: '/wma-to-mp3',
          description: 'Convert WMA to MP3 format',
          icon: '🎺'
        },
        {
          name: 'OGG to MP3',
          href: '/ogg-to-mp3',
          description: 'Convert OGG audio to MP3',
          icon: '🔊'
        },
        {
          name: 'Audio Compressor',
          href: '/compress-audio',
          description: 'Compress audio files to reduce size',
          icon: '🗜️',
          comingSoon: true
        },
        {
          name: 'Audio Trimmer',
          href: '/trim-audio',
          description: 'Cut and trim audio files easily',
          icon: '✂️',
          comingSoon: true
        },
        {
          name: 'Audio Merger',
          href: '/merge-audio',
          description: 'Combine multiple audio files',
          icon: '🔗',
          comingSoon: true
        }
      ]
    },
    {
      name: 'All Font Tools',
      subItems: [
        {
          name: 'TTF to WOFF',
          href: '/ttf-to-woff',
          description: 'Desktop to web format conversion',
          icon: '📝',
          popular: true
        },
        {
          name: 'OTF to WOFF2',
          href: '/otf-to-woff2',
          description: 'OpenType to modern web format',
          icon: '💻',
          popular: true
        },
        {
          name: 'WOFF to TTF',
          href: '/woff-to-ttf',
          description: 'Web to desktop format conversion',
          icon: '🌐',
          popular: true
        },
        {
          name: 'WOFF2 to OTF',
          href: '/woff2-to-otf',
          description: 'Modern web to OpenType format',
          icon: '✍️',
          popular: true
        },
        {
          name: 'TTF to OTF',
          href: '/ttf-to-otf',
          description: 'TrueType to OpenType conversion',
          icon: '⚡',
          popular: true
        },
        {
          name: 'EOT to WOFF',
          href: '/eot-to-woff2',
          description: 'Legacy IE to modern web format',
          icon: '🖨️',
          comingSoon: true
        },
        {
          name: 'PSL to OTF',
          href: '/psl-to-otf',
          description: 'PostScript to modern format',
          icon: '🎨',
          comingSoon: true
        },
        {
          name: 'SVG to TTF',
          href: '/svg-to-ttf2',
          description: 'Vector to standard font format',
          icon: '🎨',
          comingSoon: true
        }
      ]
    },
    {
      name: 'All Utility Tools',
      subItems: [
        {
          name: 'QR Code Generator',
          href: '/qr-code-generator',
          description: 'Create QR codes for URLs, text, and more',
          icon: '🔳',
          popular: true
        },
        {
          name: 'Barcode Generator',
          href: '/barcode-generator',
          description: 'Generate various barcode formats',
          icon: '📊',
          popular: true
        },
        {
          name: 'Password Generator',
          href: '/password-generator',
          description: 'Create secure random passwords',
          icon: '🔐',
          popular: true
        },
        {
          name: 'Hash Generator',
          href: '/hash-generator',
          description: 'Generate MD5, SHA256, and other hashes',
          icon: '🔒',
          popular: true
        },
        {
          name: 'URL Shortener',
          href: '/url-shortener',
          description: 'Shorten long URLs for easy sharing',
          icon: '🔗',
          popular: true
        },
        {
          name: 'Color Palette Generator',
          href: '/color-palette-generator',
          description: 'Create professional color schemes and harmonies',
          icon: '🎨',
          popular: true
        },
        {
          name: 'Base64 Encoder/Decoder',
          href: '/base64-encoder-decoder',
          description: 'Encode and decode Base64 strings and files',
          icon: '🔄',
          popular: true
        },
        {
          name: 'JSON to CSV',
          href: '/json-to-csv',
          description: 'Convert JSON data to CSV format',
          icon: '🔄',
          popular: true
        },
        {
          name: 'CSV to Excel',
          href: '/csv-to-excel',
          description: 'Convert CSV to Excel format',
          icon: '📋',
          popular: true
        },
        {
          name: 'Invoice Generator',
          href: '/invoice-generator',
          description: 'Create professional invoices with custom themes',
          icon: '📄',
          popular: true
        },
        {
          name: 'Resume Builder',
          href: '/resume-builder',
          description: 'AI-powered professional resume builder with ATS optimization',
          icon: '📝',
          popular: true
        }
      ]
    },
    {
      name: 'Blog',
      href: '/blog',
      description: 'Read our latest articles and tips'
    }
  ];

  export default function Navigation() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);

    // Handle scroll effect
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes - fixed to prevent infinite loops
    useEffect(() => {
      setIsMobileMenuOpen(false);
      setActiveDropdown(null);
      setIsNavigating(false);
    }, [pathname]);

    // Completely removed outside click handler to prevent any interference with navigation

    // No cleanup needed - removed timeouts

    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };


    const handleMobileDropdownToggle = (itemName: string, event: React.MouseEvent) => {
      // Only prevent default for the dropdown toggle button, not for navigation links
      event.preventDefault();
      event.stopPropagation();

      const newState = activeDropdown === itemName ? null : itemName;
      setActiveDropdown(newState);
    };


    // Check if current path is active
    const isPathActive = (itemHref?: string, subItems?: SubNavItem[]) => {
      if (itemHref && pathname === itemHref) return true;
      
      if (subItems) {
        return subItems.some(subItem => pathname === subItem.href);
      }
      
      return false;
    };

    // Check if sub item is active
    const isSubItemActive = (href: string) => {
      return pathname === href;
    };

    // Get mega menu width class based on category - Responsive
    const getMegaMenuWidth = (itemName: string) => {
      switch (itemName) {
        case 'All Image Tools':
          return 'w-[90vw] max-w-[80%] lg:w-[80%]';
        case 'All PDF Tools':
          return 'w-[90vw] max-w-[80%] lg:w-[80%]';
        case 'All Video Tools':
          return 'w-[90vw] max-w-[80%] lg:w-[80%]';
        case 'All Audio Tools':
          return 'w-[90vw] max-w-[80%] lg:w-[80%]';
        case 'All Font Tools':
          return 'w-[90vw] max-w-[80%] lg:w-[80%]';
        case 'All Utility Tools':
          return 'w-[90vw] max-w-[80%] lg:w-[80%]';
        default:
          return 'w-[90vw] max-w-[80%] lg:w-[80%]';
      }
    };

    // Get grid columns based on category
    const getGridColumns = (itemName: string) => {
      switch (itemName) {
        case 'All Image Tools':
          return 'grid-cols-3';
        case 'All Video Tools':
          return 'grid-cols-3';
        case 'All PDF Tools':
          return 'grid-cols-3';
        case 'All Audio Tools':
          return 'grid-cols-3';
        case 'All Font Tools':
          return 'grid-cols-3';
        case 'All Utility Tools':
          return 'grid-cols-3';
        default:
          return 'grid-cols-3';
      }
    };

    // Get dynamic positioning for mega menu to prevent overflow
    const getMegaMenuPosition = () => {
      if (typeof window !== 'undefined') {
        const windowWidth = window.innerWidth;
        if (windowWidth < 640) {
          return {
            left: '1rem',
            right: '1rem',
            transform: 'none'
          };
        } else if (windowWidth < 1024) {
          return {
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 'calc(100vw - 4rem)'
          };
        }
      }
      return {
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 'calc(100vw - 2rem)'
      };
    };

    return (
      <>
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-out ${
          isScrolled
            ? 'bg-white/70 backdrop-blur-3xl shadow-2xl border-b border-white/20'
            : 'bg-white/60 backdrop-blur-2xl shadow-xl border-b border-white/30'
        }`}>
          {/* Glass morphism background layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-white/40 to-purple-50/20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-noise opacity-5"></div>

          <div className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center h-12">
              
              {/* Logo Section - Glass morphism design */}
              <div className="flex items-center">
                <Link
                  href="/"
                  prefetch={true}
                  className="flex items-center space-x-2 group transition-all duration-300 hover:scale-[1.02] relative"
                >
                  <div className="relative">
                    {/* Glass container for logo */}
                    <div className="absolute inset-0 rounded-lg bg-white/40 backdrop-blur-md border border-white/20 shadow-lg group-hover:shadow-xl transition-all duration-300"></div>
                    <Image
                      src="/logo.webp"
                      alt="FlipFilex Logo"
                      width={32}
                      height={32}
                      className="relative rounded-lg p-1 transition-all duration-300"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-lg font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      FlipFilex
                    </span>
                    <div className="text-[10px] text-slate-600/80 font-medium">
                      Professional File Tools
                    </div>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation - Professional glass design */}
              <div className="hidden lg:flex items-center space-x-0.5">
                {navigationItems.map((item, itemIndex) => {
                  const isActive = isPathActive(item.href, item.subItems);
                  const hasSubItems = item.subItems && item.subItems.length > 0;

                  return (
                    <div
                      key={`desktop-nav-${item.name}-${itemIndex}`}
                      className="relative dropdown-container"
                      onMouseEnter={() => hasSubItems && !isNavigating && setActiveDropdown(item.name)}
                      onMouseLeave={() => hasSubItems && !isNavigating && setActiveDropdown(null)}
                    >
                      {hasSubItems ? (
                        <button
                          className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1.5 backdrop-blur-md border ${
                            isActive
                              ? 'text-white bg-gradient-to-r from-blue-500 to-purple-500 border-white/30 shadow-lg'
                              : activeDropdown === item.name
                                ? 'text-slate-800 bg-white/80 border-white/50 shadow-md'
                                : 'text-slate-700 hover:text-slate-900 bg-white/50 hover:bg-white/70 border-white/30 hover:border-white/50 hover:shadow-md'
                          }`}
                          onMouseEnter={() => !isNavigating && setActiveDropdown(item.name)}
                          onMouseLeave={() => !isNavigating && setActiveDropdown(null)}
                          onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                        >
                          <span>{item.name}</span>
                          <svg
                            className={`w-3 h-3 transition-all duration-300 ${
                              activeDropdown === item.name ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      ) : (
                        <Link
                          href={item.href!}
                          prefetch={true}
                          className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1.5 backdrop-blur-md border group ${
                            isActive
                              ? 'text-white bg-gradient-to-r from-blue-500 to-purple-500 border-white/30 shadow-lg'
                              : 'text-slate-700 hover:text-slate-900 bg-white/50 hover:bg-white/70 border-white/30 hover:border-white/50 hover:shadow-md'
                          }`}
                        >
                          <span>{item.name}</span>
                        </Link>
                      )}

                      {/* Desktop Mega Menu Dropdown - Glass morphism design */}
                      {hasSubItems && activeDropdown === item.name && (
                        <div
                          className={`fixed top-[3rem] left-1/2 transform -translate-x-1/2 bg-white backdrop-blur-2xl rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[60] mx-4 ${getMegaMenuWidth(item.name)}`}
                          style={{
                            maxWidth: 'calc(100vw - 2rem)'
                          }}
                          onMouseEnter={() => !isNavigating && setActiveDropdown(item.name)}
                          onMouseLeave={() => !isNavigating && setActiveDropdown(null)}
                        >
                          {/* Glass background layers */}
                          <div className="absolute inset-0 bg-white rounded-xl"></div>
                          <div className="absolute inset-0 bg-gradient-to-tr from-gray-50/50 via-transparent to-gray-50/50 rounded-xl"></div>
                          <div className="relative p-4">
                            <div className="mb-4">
                              <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center space-x-2">
                                <span className="text-lg">
                                  {item.name === 'All PDF Tools' && '📄'}
                                  {item.name === 'All Image Tools' && '🎨'}
                                  {item.name === 'All Video Tools' && '🎬'}
                                  {item.name === 'All Audio Tools' && '🎵'}
                                  {item.name === 'All Font Tools' && '🔤'}
                                  {item.name === 'All Utility Tools' && '🛠️'}
                                </span>
                                <span>{item.name}</span>
                              </h3>
                              <p className="text-xs text-slate-600/80">Professional {item.name.toLowerCase().replace('all ', '')} conversion suite</p>
                            </div>
                            
                            <div className={`space-y-1 ${getGridColumns(item.name) === 'grid-cols-3' ? `grid grid-cols-1 sm:grid-cols-2 lg:${getGridColumns(item.name)} gap-2 space-y-0` : getGridColumns(item.name) === 'grid-cols-2' ? `grid grid-cols-1 sm:${getGridColumns(item.name)} gap-2 space-y-0` : ''}`}>
                              {item.subItems!.map((subItem, index) => (
                                <Link
                                  key={`desktop-${item.name}-${subItem.name}-${index}`}
                                  href={subItem.href}
                                  className={`group flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 relative backdrop-blur-sm border ${
                                    isSubItemActive(subItem.href)
                                      ? 'bg-white/70 text-blue-700 border-blue-200/50 shadow-md'
                                      : subItem.comingSoon
                                        ? 'hover:bg-white/40 text-slate-400 cursor-not-allowed border-white/20'
                                        : 'hover:bg-white/60 text-slate-700 hover:text-slate-900 border-white/20 hover:border-white/40 hover:shadow-sm'
                                  }`}
                                  onClick={(e) => {
                                    if (subItem.comingSoon) {
                                      e.preventDefault();
                                      return;
                                    }
                                    // Prevent conflicts with navigation
                                    setIsNavigating(true);
                                    setActiveDropdown(null);
                                    setIsMobileMenuOpen(false);
                                    // Allow default navigation behavior
                                    setTimeout(() => setIsNavigating(false), 100);
                                  }}
                                >
                                  <div className="flex-shrink-0 text-sm">
                                    {subItem.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={`font-medium text-xs flex items-center gap-1 ${
                                      subItem.comingSoon ? 'text-slate-400' : ''
                                    }`}>
                                      {subItem.name}
                                      {subItem.popular && !subItem.comingSoon && (
                                        <span className="px-1 py-0.5 bg-gradient-to-r from-emerald-400 to-blue-500 text-white text-[10px] font-bold rounded-full">
                                          HOT
                                        </span>
                                      )}
                                      {subItem.comingSoon && (
                                        <span className="px-1 py-0.5 bg-gradient-to-r from-orange-400 to-red-400 text-white text-[10px] font-bold rounded-full">
                                          SOON
                                        </span>
                                      )}
                                    </div>
                                    <div className={`text-[10px] leading-tight mt-0.5 ${
                                      subItem.comingSoon ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                      {subItem.description}
                                    </div>
                                  </div>
                                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isSubItemActive(subItem.href)
                                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                                      : subItem.comingSoon
                                        ? 'bg-slate-200 text-slate-400'
                                        : 'bg-slate-200 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:text-white'
                                  }`}>
                                    {!subItem.comingSoon && (
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>

                            {/* View All Link */}
                            <div className="mt-3 pt-3 border-t border-white/30">
                              <Link
                                href={`/tools#${item.name.toLowerCase().replace('all ', '').replace(' ', '-')}`}
                                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg group text-xs"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <span>View All {item.name.replace('All ', '')}</span>
                                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile Menu Button - Glass design */}
              <div className="lg:hidden mobile-menu-container">
                <button
                  type="button"
                  onClick={toggleMobileMenu}
                  className={`relative p-2 rounded-lg transition-all duration-300 focus:outline-none backdrop-blur-md border ${
                    isMobileMenuOpen
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-white/30 shadow-lg'
                      : 'text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white/70 border-white/30 hover:border-white/50'
                  }`}
                  aria-label="Toggle navigation menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <div className="w-5 h-5 flex flex-col justify-center items-center relative">
                    <span className={`block h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out absolute ${
                      isMobileMenuOpen ? 'rotate-45' : '-translate-y-1'
                    }`} />
                    <span className={`block h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out absolute ${
                      isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'
                    }`} />
                    <span className={`block h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out absolute ${
                      isMobileMenuOpen ? '-rotate-45' : 'translate-y-1'
                    }`} />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu - Glass morphism */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mobile-menu-container bg-white/80 backdrop-blur-2xl border-t border-white/30 shadow-xl">
              <div className="px-3 py-4 space-y-2 max-h-[calc(100vh-150px)] overflow-y-auto">
                {navigationItems.map((item, index) => {
                  const isActive = isPathActive(item.href, item.subItems);
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isDropdownOpen = activeDropdown === item.name;
                  
                  return (
                    <div
                      key={`mobile-nav-${item.name}-${index}`}
                      className={`transform transition-all duration-500 ease-out ${
                        isMobileMenuOpen 
                          ? 'translate-x-0 opacity-100' 
                          : 'translate-x-4 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      {hasSubItems ? (
                        <div>
                          <button
                            onClick={(e) => handleMobileDropdownToggle(item.name, e)}
                            className={`w-full group flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-300 focus:outline-none backdrop-blur-md border ${
                              isActive
                                ? 'bg-white/70 text-blue-700 border-blue-200/50 shadow-md'
                                : 'text-slate-700 hover:text-slate-900 bg-white/50 hover:bg-white/70 border-white/30 hover:border-white/50'
                            }`}
                            type="button"
                            aria-expanded={isDropdownOpen}
                          >
                            <div className="flex items-center space-x-3 pointer-events-none">
                              <div className="text-lg">
                                {item.name === 'All PDF Tools' && '📄'}
                                {item.name === 'All Image Tools' && '🎨'}
                                {item.name === 'All Video Tools' && '🎬'}
                                {item.name === 'All Audio Tools' && '🎵'}
                                {item.name === 'All Font Tools' && '🔤'}
                                {item.name === 'All Utility Tools' && '🛠️'}
                              </div>
                              <div className="font-medium text-sm">{item.name}</div>
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/50 group-hover:bg-white/70 transition-all duration-300 pointer-events-none">
                              <svg
                                className={`w-4 h-4 transition-all duration-300 ${
                                  isDropdownOpen ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </button>
                          
                          {/* Mobile Mega Menu - Glass design */}
                          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                            isDropdownOpen
                              ? 'mt-2 max-h-[1000px] opacity-100'
                              : 'max-h-0 opacity-0'
                          }`}>
                            <div className="bg-white/70 backdrop-blur-md rounded-lg p-3 border border-white/30 shadow-lg">
                              <div className="mb-3">
                                <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center space-x-2">
                                  <span className="text-lg">
                                    {item.name === 'All PDF Tools' && '📄'}
                                    {item.name === 'All Image Tools' && '🎨'}
                                    {item.name === 'All Video Tools' && '🎬'}
                                    {item.name === 'All Audio Tools' && '🎵'}
                                    {item.name === 'All Font Tools' && '🔤'}
                                    {item.name === 'All Utility Tools' && '🛠️'}
                                  </span>
                                  <span>{item.name}</span>
                                </h3>
                                <p className="text-xs text-slate-600/80">Professional {item.name.toLowerCase().replace('all ', '')} conversion suite</p>
                              </div>
                              
                              <div className="space-y-1">
                                {item.subItems!.map((subItem, subIndex) => (
                                  <Link
                                    key={`mobile-${item.name}-${subItem.name}-${subIndex}`}
                                    href={subItem.href}
                                    className={`group flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 relative backdrop-blur-sm border ${
                                      isSubItemActive(subItem.href)
                                        ? 'bg-white/70 text-blue-700 border-blue-200/50 shadow-sm'
                                        : subItem.comingSoon
                                          ? 'hover:bg-white/40 text-slate-400 cursor-not-allowed border-white/20'
                                          : 'text-slate-700 hover:text-slate-900 bg-white/50 hover:bg-white/70 border-white/20 hover:border-white/40'
                                    }`}
                                    onClick={(e) => {
                                    if (subItem.comingSoon) {
                                      e.preventDefault();
                                      return;
                                    }
                                    // Prevent conflicts with navigation
                                    setIsNavigating(true);
                                    setActiveDropdown(null);
                                    setIsMobileMenuOpen(false);
                                    // Allow default navigation behavior
                                    setTimeout(() => setIsNavigating(false), 100);
                                  }}
                                  >
                                    <div className="flex-shrink-0 text-sm">
                                      {subItem.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className={`font-medium text-xs flex items-center gap-1 flex-wrap ${
                                        subItem.comingSoon ? 'text-slate-400' : ''
                                      }`}>
                                        <span className="flex-shrink-0">{subItem.name}</span>
                                        {subItem.popular && !subItem.comingSoon && (
                                          <span className="px-1 py-0.5 bg-gradient-to-r from-emerald-400 to-blue-500 text-white text-[10px] font-bold rounded-full flex-shrink-0">
                                            HOT
                                          </span>
                                        )}
                                        {subItem.comingSoon && (
                                          <span className="px-1 py-0.5 bg-gradient-to-r from-orange-400 to-red-400 text-white text-[10px] font-bold rounded-full flex-shrink-0">
                                            SOON
                                          </span>
                                        )}
                                      </div>
                                      <div className={`text-[10px] mt-0.5 leading-tight ${
                                        subItem.comingSoon ? 'text-slate-400' : 'text-slate-500'
                                      }`}>
                                        {subItem.description}
                                      </div>
                                    </div>
                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                                      isSubItemActive(subItem.href)
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm'
                                        : subItem.comingSoon
                                          ? 'bg-slate-200 text-slate-400'
                                          : 'bg-slate-200 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:text-white'
                                    }`}>
                                      {!subItem.comingSoon && (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                      )}
                                    </div>
                                  </Link>
                                ))}
                              </div>

                              {/* Mobile View All Link */}
                              <div className="mt-3 pt-2 border-t border-white/30">
                                <Link
                                  href={`/tools#${item.name.toLowerCase().replace('all ', '').replace(' ', '-')}`}
                                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md group text-xs"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    setIsMobileMenuOpen(false);
                                  }}
                                >
                                  <span>View All {item.name.replace('All ', '')}</span>
                                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href!}
                          className={`group flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 backdrop-blur-md border ${
                            isActive
                              ? 'bg-white/70 text-blue-700 border-blue-200/50 shadow-md'
                              : 'text-slate-700 hover:text-slate-900 bg-white/50 hover:bg-white/70 border-white/30 hover:border-white/50'
                          }`}
                        >
                          <div className="text-lg">📝</div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.name}</div>
                            {item.description && (
                              <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                            )}
                          </div>
                          {isActive && (
                            <div className="flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">Active</span>
                            </div>
                          )}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Menu Overlay with blur effect */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Spacer to prevent content from hiding behind fixed nav */}
        <div className="h-12"></div>
      </>
    );
  }