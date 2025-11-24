import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WEBP to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert WEBP to SVG online for free. Fast, secure, and easy-to-use WEBP to SVG converter with no file size limits.',
  keywords: ['webp to svg', 'webp converter', 'svg converter', 'convert webp', 'online webp converter'],
  openGraph: {
    title: 'WEBP to SVG Converter - FlipFileX',
    description: 'Convert WEBP to SVG online for free',
    type: 'website',
    url: 'https://flipfilex.com/webp-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WEBP to SVG Converter',
    description: 'Convert WEBP to SVG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/webp-to-svg',
  },
};

export default function WebpToSvgPage() {
  return (
    <ConverterPage
      slug="webp-to-svg"
      sourceFormat="webp"
      targetFormat="svg"
      category="image"
      title="WEBP to SVG Converter"
    />
  );
}
