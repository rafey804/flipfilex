import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'GIF to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert GIF to SVG online for free. Fast, secure, and easy-to-use GIF to SVG converter with no file size limits.',
  keywords: ['gif to svg', 'gif converter', 'svg converter', 'convert gif', 'online gif converter'],
  openGraph: {
    title: 'GIF to SVG Converter - FlipFileX',
    description: 'Convert GIF to SVG online for free',
    type: 'website',
    url: 'https://flipfilex.com/gif-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF to SVG Converter',
    description: 'Convert GIF to SVG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/gif-to-svg',
  },
};

export default function GifToSvgPage() {
  return (
    <ConverterPage
      slug="gif-to-svg"
      sourceFormat="gif"
      targetFormat="svg"
      category="image"
      title="GIF to SVG Converter"
    />
  );
}
