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

  // Tool pages - Only valid pages that exist
  const toolPages = [
    // Image Converters (existing pages)
    'avif-to-png', 'webp-to-png', 'png-to-webp', 'jpg-to-png', 'png-to-jpg',
    'jpeg-to-webp', 'svg-to-png', 'gif-to-png', 'bmp-to-png', 'tiff-to-png',
    'heic-to-jpg', 'ico-to-png',

    // Video Converters (existing pages)
    'mp4-to-mov', 'mov-to-mp4', 'avi-to-mp4', 'mkv-to-mp4', 'webm-to-mp4',
    'flv-to-mp4', 'wmv-to-mp4', 'mp4-to-webm',

    // Audio Converters (existing pages)
    'wav-to-mp3', 'flac-to-mp3', 'aac-to-mp3',

    // PDF Tools (existing pages)
    'convert-pdf-to-word-online', 'word-to-pdf-online', 'merge-pdf-files-free',
    'split-pdf-online', 'pdf-to-images', 'compress-pdf-online',
    'excel-to-pdf-converter', 'pdf-to-excel-converter',

    // Document Converters (existing pages)
    'mobi-to-epub', 'txt-to-epub', 'docx-to-epub', 'latex-to-pdf',

    // Research & Academic (existing pages)
    'ris-to-bibtex',

    // CAD & 3D Tools (existing pages)
    'stl-to-obj', 'dwg-to-pdf', 'step-to-stl', 'ply-to-obj',

    // Finance & Crypto (existing pages)
    'defi-yield-calculator', 'jwt-token-decoder',

    // Medical & Imaging (existing pages)
    'dicom-to-jpeg',

    // Utility Tools (existing pages)
    'ocr-image-to-text', 'qr-code-generator', 'password-generator',
    'hash-generator', 'color-picker', 'json-formatter', 'base64-encoder',
    'image-compressor', 'color-palette-generator', 'font-converter',

    // Static pages
    'tools', 'about', 'contact', 'privacy-policy', 'terms-of-service',
    'cookies', 'help', 'accessibility', 'security', 'api-docs', 'enterprise',

  ].map(tool => ({
    url: `${baseUrl}/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
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