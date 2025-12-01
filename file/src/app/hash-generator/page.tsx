import { Metadata } from 'next';
import HashGeneratorClient from './HashGeneratorClient';

export const metadata: Metadata = {
  title: 'Free Hash Generator Online - MD5, SHA-1, SHA-256, SHA-512 | Checksum Tool',
  description: 'Generate cryptographic hashes instantly with our free hash generator. Support for MD5, SHA-1, SHA-256, SHA-512, SHA-3. Verify file integrity & create checksums online.',
  keywords: 'hash generator, MD5 generator, SHA-256 generator, SHA-512 hash, checksum generator, file hash, cryptographic hash, hash calculator, online hash tool, data integrity',
  authors: [{ name: 'FlipFileX' }],
  openGraph: {
    type: 'website',
    url: 'https://flipfilex.com/hash-generator',
    title: 'Free Hash Generator - MD5, SHA-256, SHA-512 Online Tool',
    description: 'Generate cryptographic hashes instantly. Support for MD5, SHA-1, SHA-256, SHA-512, SHA-3. Free online hash calculator.',
    images: [
      {
        url: 'https://flipfilex.com/og-hash-generator.png',
        width: 1200,
        height: 630,
        alt: 'Hash Generator Tool',
      },
    ],
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    url: 'https://flipfilex.com/hash-generator',
    title: 'Free Hash Generator | MD5, SHA-256, SHA-512',
    description: 'Generate cryptographic hashes instantly. Multiple algorithms supported.',
    images: ['https://flipfilex.com/og-hash-generator.png'],
    creator: '@flipfilex',
  },
  alternates: {
    canonical: 'https://flipfilex.com/hash-generator',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function HashGeneratorPage() {
  return <HashGeneratorClient />;
}