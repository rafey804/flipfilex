import { MetadataRoute } from 'next'
import { blogPostsData } from '@/lib/blogPostsData'
import { getAllToolSlugs } from '@/lib/toolsConfig'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://flipfilex.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Additional static/utility pages not in toolsConfig
  const additionalPages = [
    'convert-pdf-to-word-online', 'word-to-pdf-online', 'merge-pdf-files-free',
    'split-pdf-online', 'pdf-to-images', 'compress-pdf-online',
    'excel-to-pdf-converter', 'pdf-to-excel-converter',
    'mobi-to-epub', 'txt-to-epub', 'docx-to-epub', 'latex-to-pdf',
    'ris-to-bibtex', 'stl-to-obj', 'dwg-to-pdf', 'step-to-stl', 'ply-to-obj',
    'defi-yield-calculator', 'jwt-token-decoder', 'dicom-to-jpeg',
    'ocr-image-to-text', 'qr-code-generator', 'password-generator',
    'hash-generator', 'color-picker', 'json-formatter', 'base64-encoder',
    'image-compressor', 'color-palette-generator', 'font-converter',
    'tools', 'about', 'contact', 'privacy-policy', 'terms-of-service',
    'cookies', 'help', 'accessibility', 'security', 'api-docs', 'enterprise',
    'url-shortener', 'barcode-generator', 'base64-encoder-decoder',
    'resume-builder', 'invoice-generator', 'epub-to-pdf',
    'pdf-password-protection', 'split-pdf-pages', 'excel-to-pdf',
    'powerpoint-to-pdf', 'text-to-pdf', 'html-to-pdf', 'csv-to-excel',
    'json-to-csv', 'bib-to-pdf', 'mathml-to-image', 'png-to-webp-converter',
    'ai-video-script-writer', 'ai-image-generator', 'ai-voice-dubbing',
    // New converter pages
    'heic-to-jpg', 'jpg-to-png', 'png-to-jpg', 'webp-to-png', 'webp-to-jpg',
    'jpg-to-webp', 'png-to-webp', 'avif-to-jpg', 'avif-to-png',
    'svg-to-png', 'svg-to-jpg', 'gif-to-png', 'gif-to-jpg',
    'bmp-to-jpg', 'bmp-to-png', 'tiff-to-jpg', 'tiff-to-png',
    'ico-to-png', 'psd-to-jpg', 'psd-to-png',
    'docx-to-pdf', 'pdf-to-docx', 'pdf-to-txt', 'txt-to-pdf',
    'markdown-to-pdf', 'markdown-to-html',
    'compress-pdf', 'merge-pdf', 'split-pdf', 'pdf-to-excel',
    'pdf-to-jpg', 'pdf-to-png',
    'mp3-to-wav', 'wav-to-mp3', 'flac-to-mp3', 'flac-to-wav',
    'aac-to-mp3', 'm4a-to-mp3', 'ogg-to-mp3', 'wma-to-mp3',
    'opus-to-mp3', 'mp3-to-flac', 'mp3-to-ogg',
    'mp4-to-avi', 'avi-to-mp4', 'mov-to-mp4', 'mkv-to-mp4',
    'webm-to-mp4', 'mp4-to-webm', 'mp4-to-gif', 'flv-to-mp4',
    'wmv-to-mp4', 'mpeg-to-mp4',
    'ttf-to-woff', 'ttf-to-woff2', 'ttf-to-otf', 'otf-to-ttf',
    'otf-to-woff', 'otf-to-woff2', 'woff-to-ttf', 'woff-to-otf',
    'woff-to-woff2', 'woff2-to-ttf', 'woff2-to-otf', 'woff2-to-woff',
    'eot-to-ttf', 'eot-to-otf', 'eot-to-woff', 'eot-to-woff2',
    'obj-to-stl', 'dxf-to-pdf',
  ]

  // Dynamically get all tool slugs from toolsConfig
  const allToolSlugs = getAllToolSlugs()

  // Combine all unique tool slugs
  const allUniqueSlugs = [...new Set([...allToolSlugs, ...additionalPages])]

  // Tool pages - Dynamically generated from toolsConfig
  const toolPages = allUniqueSlugs.map(tool => ({
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
    priority: 0.7,
  }))

  return [...staticPages, ...toolPages, ...blogPosts]
}