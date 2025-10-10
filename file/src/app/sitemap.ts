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