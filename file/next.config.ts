import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Static page generation
  output: 'standalone',

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'lib',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };
    }
    return config;
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for fixing 404 and wrong URLs
  async redirects() {
    return [
      // WWW to non-WWW redirects (canonical URL enforcement)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.flipfilex.com',
          },
        ],
        destination: 'https://flipfilex.com/:path*',
        permanent: true,
      },
      {
        source: '/www.flipfilex.com/:path*',
        destination: 'https://flipfilex.com/:path*',
        permanent: true,
      },
      // Missing pages redirects
      {
        source: '/api-docs',
        destination: '/tools',
        permanent: true,
      },
      {
        source: '/merge-pdf',
        destination: '/merge-pdf-files-free',
        permanent: true,
      },
      // Fix incorrect URL patterns
      {
        source: '/kdrop-blur-sm%20px-8%20py-4%20rounded-2xl%20shadow-lg%20hover:shadow-xl%20border%20border-red-200%20group',
        destination: '/',
        permanent: true,
      },
      // Language redirects to main site
      {
        source: '/de',
        destination: '/',
        permanent: true,
      },
      {
        source: '/es',
        destination: '/',
        permanent: true,
      },
      {
        source: '/fr',
        destination: '/',
        permanent: true,
      },
      {
        source: '/it',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ja',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ko',
        destination: '/',
        permanent: true,
      },
      {
        source: '/zh',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pt',
        destination: '/',
        permanent: true,
      },
      // Fix tool page redirects
      {
        source: '/pdf-to-images-converter',
        destination: '/pdf-to-images',
        permanent: true,
      },
      {
        source: '/url-shortener',
        destination: '/shorten-url',
        permanent: true,
      },
      {
        source: '/status',
        destination: '/',
        permanent: true,
      },
      {
        source: '/browserconfig.xml',
        destination: '/',
        permanent: true,
      },
      {
        source: '/cdn-cgi/l/email-protection',
        destination: '/about',
        permanent: true,
      },
      // Converter page naming fixes
      {
        source: '/wav-to-mp3-converter',
        destination: '/wav-to-mp3',
        permanent: true,
      },
      {
        source: '/png-to-webp-converter',
        destination: '/png-to-webp',
        permanent: true,
      },
      // Sitemap redirects
      {
        source: '/sitemap',
        destination: '/sitemap.xml',
        permanent: true,
      },
      // Config files that shouldn't be accessed
      {
        source: '/_next/static/media/:path*',
        destination: '/',
        permanent: false,
      },
      // HTTP to HTTPS redirects handled at server level, but enforce www removal
      {
        source: '/www.:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
