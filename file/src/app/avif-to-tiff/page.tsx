import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'AVIF to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert AVIF to TIFF online for free. Fast, secure, and easy-to-use AVIF to TIFF converter with no file size limits.',
  keywords: ['avif to tiff', 'avif converter', 'tiff converter', 'convert avif', 'online avif converter'],
  openGraph: {
    title: 'AVIF to TIFF Converter - FlipFileX',
    description: 'Convert AVIF to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/avif-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVIF to TIFF Converter',
    description: 'Convert AVIF to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/avif-to-tiff',
  },
};

export default function AvifToTiffPage() {
  return (
    <ConverterPage
      slug="avif-to-tiff"
      sourceFormat="avif"
      targetFormat="tiff"
      category="image"
      title="AVIF to TIFF Converter"
    />
  );
}
