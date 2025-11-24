import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TIFF to AVIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert TIFF to AVIF online for free. Fast, secure, and easy-to-use TIFF to AVIF converter with no file size limits.',
  keywords: ['tiff to avif', 'tiff converter', 'avif converter', 'convert tiff', 'online tiff converter'],
  openGraph: {
    title: 'TIFF to AVIF Converter - FlipFileX',
    description: 'Convert TIFF to AVIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/tiff-to-avif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIFF to AVIF Converter',
    description: 'Convert TIFF to AVIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/tiff-to-avif',
  },
};

export default function TiffToAvifPage() {
  return (
    <ConverterPage
      slug="tiff-to-avif"
      sourceFormat="tiff"
      targetFormat="avif"
      category="image"
      title="TIFF to AVIF Converter"
    />
  );
}
