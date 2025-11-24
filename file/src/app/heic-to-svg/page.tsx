import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'HEIC to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert HEIC to SVG online for free. Fast, secure, and easy-to-use HEIC to SVG converter with no file size limits.',
  keywords: ['heic to svg', 'heic converter', 'svg converter', 'convert heic', 'online heic converter'],
  openGraph: {
    title: 'HEIC to SVG Converter - FlipFileX',
    description: 'Convert HEIC to SVG online for free',
    type: 'website',
    url: 'https://flipfilex.com/heic-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEIC to SVG Converter',
    description: 'Convert HEIC to SVG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/heic-to-svg',
  },
};

export default function HeicToSvgPage() {
  return (
    <ConverterPage
      slug="heic-to-svg"
      sourceFormat="heic"
      targetFormat="svg"
      category="image"
      title="HEIC to SVG Converter"
    />
  );
}
