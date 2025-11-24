import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WOFF to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert WOFF to SVG fonts online for free. Fast, secure, and easy-to-use WOFF to SVG font converter.',
  keywords: ['woff to svg', 'woff converter', 'svg converter', 'font converter', 'convert woff', 'online woff converter'],
  openGraph: {
    title: 'WOFF to SVG Converter - FlipFileX',
    description: 'Convert WOFF to SVG fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/woff-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOFF to SVG Converter',
    description: 'Convert WOFF to SVG fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/woff-to-svg',
  },
};

export default function WoffToSvgPage() {
  return (
    <ConverterPage
      slug="woff-to-svg"
      sourceFormat="woff"
      targetFormat="svg"
      category="font"
      title="WOFF to SVG Converter"
    />
  );
}
