import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WEBP to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert WEBP to TIFF online for free. Fast, secure, and easy-to-use WEBP to TIFF converter with no file size limits.',
  keywords: ['webp to tiff', 'webp converter', 'tiff converter', 'convert webp', 'online webp converter'],
  openGraph: {
    title: 'WEBP to TIFF Converter - FlipFileX',
    description: 'Convert WEBP to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/webp-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WEBP to TIFF Converter',
    description: 'Convert WEBP to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/webp-to-tiff',
  },
};

export default function WebpToTiffPage() {
  return (
    <ConverterPage
      slug="webp-to-tiff"
      sourceFormat="webp"
      targetFormat="tiff"
      category="image"
      title="WEBP to TIFF Converter"
    />
  );
}
