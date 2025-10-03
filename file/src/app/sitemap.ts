import { MetadataRoute } from 'next'
import { blogPostsData } from '@/lib/blogPostsData'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://flipfilex.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const, // 'daily' se 'weekly' better hai
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Tool pages - Document ke base pe missing tools add kiye
  const toolPages = [
    // Image Converters
    'avif-to-png', 'webp-to-png', 'png-to-webp', 'jpg-to-png', 'png-to-jpg',
    'jpeg-to-webp', 'svg-to-png', 'gif-to-png', 'bmp-to-png', 'tiff-to-png',
    'heic-to-jpg', 'ico-to-png',
    
    // Video Converters
    'mp4-to-mov', 'mov-to-mp4', 'avi-to-mp4', 'mkv-to-mp4', 'webm-to-mp4',
    'flv-to-mp4', 'wmv-to-mp4', 'mp4-to-webm',
    
    // Audio Converters
    'wav-to-mp3', 'mp3-to-wav', 'flac-to-mp3', 'aac-to-mp3', 'm4a-to-mp3',
    'ogg-to-mp3', 'wma-to-mp3', 'mp3-to-aac',
    
    // Font Converters
    'ttf-to-woff', 'otf-to-woff2', 'woff-to-ttf', 'woff2-to-otf',
    'ttf-to-otf', 'eot-to-woff', 'ps1-to-otf', 'svg-to-ttf',
    
    // PDF Tools
    'pdf-to-word', 'word-to-pdf', 'merge-pdf', 'split-pdf', 'pdf-to-images',
    'excel-to-pdf', 'powerpoint-to-pdf', 'text-to-pdf', 'html-to-pdf',
    'csv-to-excel', 'json-to-csv', 'compress-pdf', 'lock-pdf', 'unlock-pdf',
    
    // Document Converters
    'epub-to-pdf', 'mobi-to-epub', 'txt-to-epub', 'docx-to-epub',
    'bib-to-pdf', 'latex-to-pdf',
    
    // Research & Academic
    'ris-to-bibtex', 'mathml-to-image',
    
    // CAD & 3D Tools
    'stl-to-obj', 'dwg-to-pdf', 'step-to-stl', 'ply-to-obj',
    
    // Finance & Crypto
    'defi-yield-calculator', 'jwt-decoder',
    
    // Medical & Imaging
    'dicom-to-jpeg',
    
    // Utility Tools
    'data-to-invoice', 'profile-to-resume', 'image-to-text', 'text-to-qr-code',
    'text-to-barcode', 'password-generator', 'text-to-hash', 'url-shortener',
    'color-palette-generator', 'base64-encoder', 'base64-decoder', 'compress-image',
    
  ].map(tool => ({
    url: `${baseUrl}/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const, // Tools ko 'monthly' better hai
    priority: 0.8,
  }))

  // Blog posts
  const blogPosts = Object.keys(blogPostsData).map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(blogPostsData[slug as keyof typeof blogPostsData].date),
    changeFrequency: 'monthly' as const,
    priority: 0.7, // Blog posts ki priority thodi kam rakho
  }))

  return [...staticPages, ...toolPages, ...blogPosts]
}