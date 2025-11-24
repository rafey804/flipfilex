import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TIFF to WEBP Converter - Free Online Tool | FlipFileX',
  description: 'Convert TIFF to WEBP online for free. Fast, secure, and easy-to-use TIFF to WEBP converter with no file size limits.',
  keywords: ['tiff to webp', 'tiff converter', 'webp converter', 'convert tiff', 'online tiff converter'],
  openGraph: {
    title: 'TIFF to WEBP Converter - FlipFileX',
    description: 'Convert TIFF to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/tiff-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIFF to WEBP Converter',
    description: 'Convert TIFF to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/tiff-to-webp',
  },
};

export default function TiffToWebpPage() {
  return (
    <ConverterPage
      slug="tiff-to-webp"
      sourceFormat="tiff"
      targetFormat="webp"
      category="image"
      title="TIFF to WEBP Converter"
    />
  );
}
