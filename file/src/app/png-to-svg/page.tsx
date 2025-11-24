import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PNG to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert PNG to SVG online for free. Fast, secure, and easy-to-use PNG to SVG converter with no file size limits.',
  keywords: ['png to svg', 'png converter', 'svg converter', 'convert png', 'online png converter'],
  openGraph: {
    title: 'PNG to SVG Converter - FlipFileX',
    description: 'Convert PNG to SVG online for free',
    type: 'website',
    url: 'https://flipfilex.com/png-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNG to SVG Converter',
    description: 'Convert PNG to SVG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/png-to-svg',
  },
};

export default function PngToSvgPage() {
  return (
    <ConverterPage
      slug="png-to-svg"
      sourceFormat="png"
      targetFormat="svg"
      category="image"
      title="PNG to SVG Converter"
    />
  );
}
