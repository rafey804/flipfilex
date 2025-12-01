import { Metadata } from 'next';
import PdfToImagesClient from './PdfToImagesClient';

export const metadata: Metadata = {
  title: 'Free PDF to Images Converter | FlipFileX',
  description: 'Convert PDF pages to high-quality PNG images for free. Extract all pages as individual images with 300 DPI quality. Download as organized ZIP file instantly.',
  keywords: 'PDF to images, PDF to PNG, extract PDF pages, PDF page converter, PDF image extractor, convert PDF to images, PDF to pictures, extract images from PDF, PDF page extractor, online PDF converter',
  alternates: {
    canonical: '/pdf-to-images',
  },
  openGraph: {
    title: 'Free PDF to Images Converter | FlipFileX',
    description: 'Convert PDF pages to high-quality PNG images for free. Extract all pages as individual images with 300 DPI quality. Perfect for presentations and web use.',
    type: 'website',
    url: 'https://flipfilex.com/pdf-to-images',
    images: [
      {
        url: 'https://flipfilex.com/images/pdf-to-images-og.jpg',
      },
    ],
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PDF to Images Converter | FlipFileX',
    description: 'Convert PDF pages to high-quality PNG images for free. Extract all pages as individual images with 300 DPI quality.',
    images: ['https://flipfilex.com/images/pdf-to-images-twitter.jpg'],
  },
};

export default function PdfToImagesPage() {
  return <PdfToImagesClient />;
}