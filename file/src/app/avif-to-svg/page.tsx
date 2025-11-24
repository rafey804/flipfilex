import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'AVIF to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert AVIF to SVG online for free. Fast, secure, and easy-to-use AVIF to SVG converter with no file size limits.',
  keywords: ['avif to svg', 'avif converter', 'svg converter', 'convert avif', 'online avif converter'],
  openGraph: {
    title: 'AVIF to SVG Converter - FlipFileX',
    description: 'Convert AVIF to SVG online for free',
    type: 'website',
    url: 'https://flipfilex.com/avif-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVIF to SVG Converter',
    description: 'Convert AVIF to SVG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/avif-to-svg',
  },
};

export default function AvifToSvgPage() {
  return (
    <ConverterPage
      slug="avif-to-svg"
      sourceFormat="avif"
      targetFormat="svg"
      category="image"
      title="AVIF to SVG Converter"
    />
  );
}
