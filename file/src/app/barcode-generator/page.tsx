import { Metadata } from 'next';
import BarcodeGeneratorClient from './BarcodeGeneratorClient';

export const metadata: Metadata = {
  title: 'Free Barcode Generator Online - EAN-13, UPC-A, Code 128 | Create Barcodes',
  description: 'Generate professional barcodes instantly. Support for EAN-13, UPC-A, Code 128, Code 39, ITF-14 & more. Free barcode generator for retail, inventory & shipping.',
  keywords: 'barcode generator, free barcode maker, EAN-13 generator, UPC-A barcode, Code 128, Code 39, barcode creator, retail barcode, inventory barcode, product barcode, shipping barcode',
  authors: [{ name: 'FlipFileX' }],
  openGraph: {
    type: 'website',
    url: 'https://flipfilex.com/barcode-generator',
    title: 'Free Barcode Generator - Create EAN-13, UPC-A, Code 128 Barcodes',
    description: 'Generate professional barcodes instantly. Support for multiple formats. Perfect for retail, inventory & shipping.',
    images: [
      {
        url: 'https://flipfilex.com/og-barcode-generator.png',
        width: 1200,
        height: 630,
        alt: 'Barcode Generator Tool',
      },
    ],
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    url: 'https://flipfilex.com/barcode-generator',
    title: 'Free Barcode Generator | EAN-13, UPC-A, Code 128',
    description: 'Generate professional barcodes in multiple formats. Free & instant.',
    images: ['https://flipfilex.com/og-barcode-generator.png'],
    creator: '@flipfilex',
  },
  alternates: {
    canonical: 'https://flipfilex.com/barcode-generator',
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

export default function BarcodeGeneratorPage() {
  return <BarcodeGeneratorClient />;
}