import { Metadata } from 'next';

interface MetadataConfig {
  title: string;
  description: string;
  keywords?: string;
  urlSlug: string;
  ogImage?: string;
}

export function generateMetadata(config: MetadataConfig): Metadata {
  const baseUrl = 'https://flipfilex.com';
  const canonicalUrl = `${baseUrl}/${config.urlSlug}`;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.split(', ') || [],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonicalUrl,
      siteName: 'FlipFileX',
      images: [
        {
          url: config.ogImage || `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [config.ogImage || `${baseUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
