import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TIFF to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert TIFF to SVG online for free. Fast, secure, and easy-to-use TIFF to SVG converter with no file size limits.',
  keywords: ['tiff to svg', 'tiff converter', 'svg converter', 'convert tiff', 'online tiff converter'],
  openGraph: {
    title: 'TIFF to SVG Converter - FlipFileX',
    description: 'Convert TIFF to SVG online for free',
    type: 'website',
    url: 'https://flipfilex.com/tiff-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIFF to SVG Converter',
    description: 'Convert TIFF to SVG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/tiff-to-svg',
  },
};

export default function TiffToSvgPage() {
  return (
    <ConverterPage
      slug="tiff-to-svg"
      sourceFormat="tiff"
      targetFormat="svg"
      category="image"
      title="TIFF to SVG Converter"
    />
  );
}
