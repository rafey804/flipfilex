import { Metadata } from 'next';
import TxtToEpubClient from './TxtToEpubClient';

// SEO-Optimized Metadata
export const metadata: Metadata = {
  title: 'Free TXT to EPUB Converter Online - Create E-books from Text Files | FlipFileX',
  description: 'Convert TXT files to EPUB e-books online for free. Transform plain text into professional digital books with chapters, table of contents, and proper formatting. No registration required.',
  keywords: [
    'txt to epub converter',
    'text to ebook',
    'plain text to epub',
    'create epub from txt',
    'txt to epub online free',
    'text file to ebook converter',
    'epub creator',
    'ebook maker online',
    'convert text to epub',
    'free epub converter',
    'txt to epub free',
    'how to convert txt to epub',
    'text to digital book',
    'create ebook from text',
    'epub generator'
  ],
  alternates: {
    canonical: 'https://flipfilex.com/txt-to-epub',
  },
  openGraph: {
    title: 'Free TXT to EPUB Converter - Create E-books Online | FlipFileX',
    description: 'Convert TXT files to EPUB e-books online for free. Transform plain text into professional digital books instantly.',
    url: 'https://flipfilex.com/txt-to-epub',
    siteName: 'FlipFileX',
    type: 'website',
    images: [
      {
        url: 'https://flipfilex.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TXT to EPUB Converter - FlipFileX',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free TXT to EPUB Converter - Create E-books Online',
    description: 'Convert TXT files to EPUB e-books online for free. Transform plain text into professional digital books.',
    images: ['https://flipfilex.com/og-image.png'],
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

export default function TxtToEpubPage() {
  return <TxtToEpubClient />;
}
