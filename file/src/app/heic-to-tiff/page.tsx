import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'HEIC to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert HEIC to TIFF online for free. Fast, secure, and easy-to-use HEIC to TIFF converter with no file size limits.',
  keywords: ['heic to tiff', 'heic converter', 'tiff converter', 'convert heic', 'online heic converter'],
  openGraph: {
    title: 'HEIC to TIFF Converter - FlipFileX',
    description: 'Convert HEIC to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/heic-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEIC to TIFF Converter',
    description: 'Convert HEIC to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/heic-to-tiff',
  },
};

export default function HeicToTiffPage() {
  return (
    <ConverterPage
      slug="heic-to-tiff"
      sourceFormat="heic"
      targetFormat="tiff"
      category="image"
      title="HEIC to TIFF Converter"
    />
  );
}
