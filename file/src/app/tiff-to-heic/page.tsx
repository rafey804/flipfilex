import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TIFF to HEIC Converter - Free Online Tool | FlipFileX',
  description: 'Convert TIFF to HEIC online for free. Fast, secure, and easy-to-use TIFF to HEIC converter with no file size limits.',
  keywords: ['tiff to heic', 'tiff converter', 'heic converter', 'convert tiff', 'online tiff converter'],
  openGraph: {
    title: 'TIFF to HEIC Converter - FlipFileX',
    description: 'Convert TIFF to HEIC online for free',
    type: 'website',
    url: 'https://flipfilex.com/tiff-to-heic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIFF to HEIC Converter',
    description: 'Convert TIFF to HEIC online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/tiff-to-heic',
  },
};

export default function TiffToHeicPage() {
  return (
    <ConverterPage
      slug="tiff-to-heic"
      sourceFormat="tiff"
      targetFormat="heic"
      category="image"
      title="TIFF to HEIC Converter"
    />
  );
}
