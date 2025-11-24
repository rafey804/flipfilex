import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TIFF to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert TIFF to PNG online for free. Fast, secure, and easy-to-use TIFF to PNG converter with no file size limits.',
  keywords: ['tiff to png', 'tiff converter', 'png converter', 'convert tiff', 'online tiff converter'],
  openGraph: {
    title: 'TIFF to PNG Converter - FlipFileX',
    description: 'Convert TIFF to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/tiff-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIFF to PNG Converter',
    description: 'Convert TIFF to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/tiff-to-png',
  },
};

export default function TiffToPngPage() {
  return (
    <ConverterPage
      slug="tiff-to-png"
      sourceFormat="tiff"
      targetFormat="png"
      category="image"
      title="TIFF to PNG Converter"
    />
  );
}
