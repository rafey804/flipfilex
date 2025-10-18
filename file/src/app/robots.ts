import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/cdn-cgi/',
          '/_vercel/',
          '/.well-known/',
          '/private/'
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/tools',
          '/blog',
          '/about',
          '/privacy-policy',
          '/terms',
          '/sitemap.xml'
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/cdn-cgi/',
          '/_vercel/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/tools',
          '/blog',
          '/about',
          '/privacy-policy',
          '/terms',
          '/sitemap.xml'
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/cdn-cgi/',
          '/_vercel/',
        ],
      },
    ],
    sitemap: 'https://flipfilex.com/sitemap.xml',
    host: 'https://flipfilex.com',
  }
}
