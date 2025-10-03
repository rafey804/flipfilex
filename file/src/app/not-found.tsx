import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Home, FileText, File, Merge, Image as ImageIcon, Video, Music, Search, Camera, Zap, Smartphone } from 'lucide-react'

export const metadata: Metadata = {
  title: '404 - Page Not Found | FlipFileX Pro',
  description: 'The page you are looking for could not be found. Explore our comprehensive collection of free conversion tools including PDF, image, video, and audio converters.',
  robots: {
    index: false,
    follow: true,
  },
}

interface ToolLink {
  href: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  category: 'document' | 'image' | 'video' | 'audio'
  popular?: boolean
}

const tools: ToolLink[] = [
  // Document Tools
  {
    href: '/convert-pdf-to-word-online',
    title: 'PDF to Word',
    description: 'Convert PDF files to editable Word documents',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-blue-500 hover:bg-blue-600',
    category: 'document',
    popular: true
  },
  {
    href: '/word-to-pdf-online',
    title: 'Word to PDF',
    description: 'Convert Word documents to PDF format',
    icon: <File className="w-5 h-5" />,
    color: 'bg-emerald-500 hover:bg-emerald-600',
    category: 'document',
    popular: true
  },
  {
    href: '/merge-pdf-files-free',
    title: 'Merge PDFs',
    description: 'Combine multiple PDF files into one document',
    icon: <Merge className="w-5 h-5" />,
    color: 'bg-purple-500 hover:bg-purple-600',
    category: 'document',
    popular: true
  },
  {
    href: '/pdf-to-images-converter',
    title: 'PDF to Images',
    description: 'Convert PDF pages to high-quality images',
    icon: <ImageIcon className="w-5 h-5" />,
    color: 'bg-pink-500 hover:bg-pink-600',
    category: 'document'
  },

  // Image Tools
  {
    href: '/png-to-webp',
    title: 'PNG to WebP',
    description: 'Next-gen web format for faster loading',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-teal-500 hover:bg-teal-600',
    category: 'image',
    popular: true
  },
  {
    href: '/avif-to-png',
    title: 'AVIF to PNG',
    description: 'Convert modern AVIF to universal PNG',
    icon: <Camera className="w-5 h-5" />,
    color: 'bg-indigo-500 hover:bg-indigo-600',
    category: 'image',
    popular: true
  },
  {
    href: '/webp-to-png',
    title: 'WebP to PNG',
    description: 'Convert WebP images to PNG format',
    icon: <ImageIcon className="w-5 h-5" />,
    color: 'bg-cyan-500 hover:bg-cyan-600',
    category: 'image',
    popular: true
  },
  {
    href: '/jpg-to-png',
    title: 'JPG to PNG',
    description: 'Convert JPG to PNG with transparency',
    icon: <Camera className="w-5 h-5" />,
    color: 'bg-red-500 hover:bg-red-600',
    category: 'image',
    popular: true
  },
  {
    href: '/png-to-jpg',
    title: 'PNG to JPG',
    description: 'Convert PNG to smaller JPG files',
    icon: <ImageIcon className="w-5 h-5" />,
    color: 'bg-orange-500 hover:bg-orange-600',
    category: 'image'
  },
  {
    href: '/svg-to-png',
    title: 'SVG to PNG',
    description: 'Convert vector SVG to raster PNG',
    icon: <Camera className="w-5 h-5" />,
    color: 'bg-green-500 hover:bg-green-600',
    category: 'image'
  },
  {
    href: '/gif-to-png',
    title: 'GIF to PNG',
    description: 'Convert animated GIF to static PNG',
    icon: <ImageIcon className="w-5 h-5" />,
    color: 'bg-yellow-500 hover:bg-yellow-600',
    category: 'image'
  },
  {
    href: '/bmp-to-png',
    title: 'BMP to PNG',
    description: 'Convert BMP to modern PNG format',
    icon: <Camera className="w-5 h-5" />,
    color: 'bg-violet-500 hover:bg-violet-600',
    category: 'image'
  },
  {
    href: '/tiff-to-png',
    title: 'TIFF to PNG',
    description: 'Convert TIFF to web-friendly PNG',
    icon: <ImageIcon className="w-5 h-5" />,
    color: 'bg-slate-500 hover:bg-slate-600',
    category: 'image'
  },
  {
    href: '/heic-to-jpg',
    title: 'HEIC to JPG',
    description: 'Convert iPhone HEIC photos to JPG',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'bg-blue-600 hover:bg-blue-700',
    category: 'image',
    popular: true
  },
  {
    href: '/ico-to-png',
    title: 'ICO to PNG',
    description: 'Convert Windows icons to PNG',
    icon: <Camera className="w-5 h-5" />,
    color: 'bg-gray-500 hover:bg-gray-600',
    category: 'image'
  },
  {
    href: '/jpeg-to-webp',
    title: 'JPEG to WebP',
    description: 'Convert JPEG to web-optimized WebP',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-emerald-600 hover:bg-emerald-700',
    category: 'image'
  },

  // Video Tools
  {
    href: '/mp4-to-mov',
    title: 'MP4 to MOV',
    description: 'Convert MP4 to Apple QuickTime MOV',
    icon: <Video className="w-5 h-5" />,
    color: 'bg-red-500 hover:bg-red-600',
    category: 'video',
    popular: true
  },
  {
    href: '/mov-to-mp4',
    title: 'MOV to MP4',
    description: 'Convert MOV to universal MP4 format',
    icon: <Video className="w-5 h-5" />,
    color: 'bg-orange-500 hover:bg-orange-600',
    category: 'video',
    popular: true
  },
  {
    href: '/avi-to-mp4',
    title: 'AVI to MP4',
    description: 'Convert AVI to modern MP4 compression',
    icon: <Video className="w-5 h-5" />,
    color: 'bg-purple-600 hover:bg-purple-700',
    category: 'video'
  },
  {
    href: '/mkv-to-mp4',
    title: 'MKV to MP4',
    description: 'Convert MKV to streaming-ready MP4',
    icon: <Video className="w-5 h-5" />,
    color: 'bg-indigo-600 hover:bg-indigo-700',
    category: 'video',
    popular: true
  },
  {
    href: '/webm-to-mp4',
    title: 'WebM to MP4',
    description: 'Convert WebM to cross-platform MP4',
    icon: <Video className="w-5 h-5" />,
    color: 'bg-teal-600 hover:bg-teal-700',
    category: 'video'
  },
  {
    href: '/flv-to-mp4',
    title: 'FLV to MP4',
    description: 'Convert legacy FLV to modern MP4',
    icon: <Video className="w-5 h-5" />,
    color: 'bg-cyan-600 hover:bg-cyan-700',
    category: 'video'
  },
  {
    href: '/wmv-to-mp4',
    title: 'WMV to MP4',
    description: 'Convert Windows WMV to MP4',
    icon: <Video className="w-5 h-5" />,
    color: 'bg-blue-700 hover:bg-blue-800',
    category: 'video'
  },
  {
    href: '/mp4-to-webm',
    title: 'MP4 to WebM',
    description: 'Convert MP4 to web-optimized WebM',
    icon: <Video className="w-5 h-5" />,
    color: 'bg-green-600 hover:bg-green-700',
    category: 'video'
  },

  // Audio Tools
  {
    href: '/wav-to-mp3-converter',
    title: 'WAV to MP3',
    description: 'Convert WAV audio to compressed MP3',
    icon: <Music className="w-5 h-5" />,
    color: 'bg-orange-600 hover:bg-orange-700',
    category: 'audio',
    popular: true
  }
]

const categories = [
  { id: 'document', name: 'Document Tools', icon: <FileText className="w-5 h-5" />, color: 'text-blue-600' },
  { id: 'image', name: 'Image Converters', icon: <ImageIcon className="w-5 h-5" />, color: 'text-purple-600' },
  { id: 'video', name: 'Video Tools', icon: <Video className="w-5 h-5" />, color: 'text-red-600' },
  { id: 'audio', name: 'Audio Tools', icon: <Music className="w-5 h-5" />, color: 'text-orange-600' }
]

export default function NotFound() {
  const popularTools = tools.filter(tool => tool.popular)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* 404 Hero Section */}
        <div className="text-center mb-16">
          {/* Large 404 Text */}
          <div className="mb-8">
            <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 leading-none">
              404
            </h1>
          </div>
          
          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for seems to have taken a different path. 
              Don't worry though, our comprehensive conversion tools are still here to help you!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              Browse Tools
            </Link>
          </div>
        </div>

        {/* Popular Tools Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Most Popular Tools
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Try our most loved conversion tools used by thousands of professionals daily
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
            {popularTools.map((tool, index) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative overflow-hidden bg-white rounded-xl border border-gray-200 hover:border-transparent shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                {/* Popular Badge */}
                <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  POPULAR
                </div>
                
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative p-6 text-center">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${tool.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  
                  {/* Title */}
                  <h4 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {tool.title}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Tools by Category */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Explore All Conversion Tools
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Complete collection of professional-grade conversion tools for documents, images, videos, and audio files
            </p>
          </div>

          {categories.map((category) => {
            const categoryTools = tools.filter(tool => tool.category === category.id)
            
            return (
              <div key={category.id} className="mb-12">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`${category.color}`}>
                    {category.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {category.name}
                  </h4>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {categoryTools.length} tools
                  </span>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryTools.map((tool, index) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group relative overflow-hidden bg-white rounded-lg border border-gray-200 hover:border-transparent shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-4"
                    >
                      {tool.popular && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          HOT
                        </div>
                      )}
                      
                      {/* Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Content */}
                      <div className="relative flex items-center gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${tool.color} text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          {tool.icon}
                        </div>
                        
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 text-sm">
                            {tool.title}
                          </h5>
                          <p className="text-xs text-gray-600 truncate">
                            {tool.description}
                          </p>
                        </div>
                        
                        {/* Arrow */}
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          <ArrowLeft className="w-4 h-4 text-blue-600 rotate-180" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Search Suggestion */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h4 className="text-xl font-semibold text-gray-900 mb-2 text-center">
            Looking for something specific?
          </h4>
          
          <p className="text-gray-600 mb-6 text-center">
            Can't find what you're looking for? Visit our homepage to explore all available tools or contact our support team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              Browse All Tools
            </Link>
            
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Error Code: 404 • Page Not Found • 
            <Link href="/" className="text-blue-600 hover:text-purple-600 transition-colors duration-200 ml-1">
              Return to FlipFileX Pro
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}