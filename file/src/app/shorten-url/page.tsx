import type { Metadata } from 'next';
import URLShortenerClient from '../url-shortener/URLShortenerClient';

export const metadata: Metadata = {
  title: 'Free URL Shortener Online - Create Short Links & Custom URLs | Link Shortener',
  description: 'Shorten long URLs instantly with our free URL shortener. Create custom short links, track clicks, manage links. Fast, reliable & easy to use link shortener tool.',
  keywords: 'url shortener, link shortener, short url, shorten link, custom url, tiny url, short link generator, url shortener free, link management, click tracking',
  openGraph: {
    type: 'website',
    url: 'https://flipfilex.com/shorten-url',
    title: 'Free URL Shortener - Create Short Links & Custom URLs',
    description: 'Shorten URLs instantly. Create custom short links with click tracking. Free, fast & reliable URL shortener.',
    images: [
      {
        url: 'https://flipfilex.com/og-url-shortener.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free URL Shortener | Create Short Links',
    description: 'Shorten URLs instantly with custom aliases and click tracking.',
    images: ['https://flipfilex.com/og-url-shortener.png'],
  },
  alternates: {
    canonical: 'https://flipfilex.com/shorten-url',
  },
  robots: 'index, follow',
};

export default function ShortenUrlPage() {
  return <URLShortenerClient />;
}