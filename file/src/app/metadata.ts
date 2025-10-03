import { Metadata } from 'next';

export const homeMetadata: Metadata = {
  title: 'FlipFileX - Free Online File Converter | 200+ Tools for PDF, Image, Audio, Video',
  description: 'Free online file converter with 200+ tools. Convert PDF to Word, compress images, convert videos, generate QR codes & more. Fast, secure, no registration required.',
  keywords: [
    'file converter', 'online converter', 'free converter', 'PDF converter', 'image converter',
    'video converter', 'audio converter', 'document converter', 'FlipFileX',
    'PDF to Word', 'Word to PDF', 'compress PDF', 'merge PDF',
    'image compressor', 'WebP converter', 'HEIC to JPG',
    'MP4 converter', 'video converter online', 'audio converter',
    'QR code generator', 'password generator', 'URL shortener'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flipfilex.com',
    siteName: 'FlipFileX',
    title: 'FlipFileX - Free Online File Converter | 200+ Tools',
    description: 'Convert files online for free. PDF, Image, Audio, Video converter and 200+ tools. Fast, secure, no registration required.',
    images: [
      {
        url: 'https://flipfilex.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FlipFileX - Free Online File Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlipFileX - Free Online File Converter | 200+ Tools',
    description: 'Convert files online for free. PDF, Image, Audio, Video converter and 200+ tools.',
    images: ['https://flipfilex.com/og-image.png'],
    creator: '@flipfilex',
  },
  alternates: {
    canonical: 'https://flipfilex.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
