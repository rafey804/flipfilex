import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'ICO to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert ICO to SVG online for free. Fast, secure, and easy-to-use ICO to SVG converter with no file size limits.',
  keywords: ['ico to svg', 'ico converter', 'svg converter', 'convert ico', 'online ico converter'],
  openGraph: {
    title: 'ICO to SVG Converter - FlipFileX',
    description: 'Convert ICO to SVG online for free',
    type: 'website',
    url: 'https://flipfilex.com/ico-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICO to SVG Converter',
    description: 'Convert ICO to SVG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ico-to-svg',
  },
};

export default function IcoToSvgPage() {
  return (
    <ConverterPage
      slug="ico-to-svg"
      sourceFormat="ico"
      targetFormat="svg"
      category="image"
      title="ICO to SVG Converter"
    />
  );
}
