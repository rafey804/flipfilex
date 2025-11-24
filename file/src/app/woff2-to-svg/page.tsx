import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WOFF2 to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert WOFF2 to SVG fonts online for free. Fast, secure, and easy-to-use WOFF2 to SVG font converter.',
  keywords: ['woff2 to svg', 'woff2 converter', 'svg converter', 'font converter', 'convert woff2', 'online woff2 converter'],
  openGraph: {
    title: 'WOFF2 to SVG Converter - FlipFileX',
    description: 'Convert WOFF2 to SVG fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/woff2-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOFF2 to SVG Converter',
    description: 'Convert WOFF2 to SVG fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/woff2-to-svg',
  },
};

export default function Woff2ToSvgPage() {
  return (
    <ConverterPage
      slug="woff2-to-svg"
      sourceFormat="woff2"
      targetFormat="svg"
      category="font"
      title="WOFF2 to SVG Converter"
    />
  );
}
