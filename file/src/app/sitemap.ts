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
    'tools', 'about', 'contact', 'privacy-policy', 'terms-of-service',
    'cookies', 'help', 'accessibility', 'security', 'api-docs', 'enterprise'
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