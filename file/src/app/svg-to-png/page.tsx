import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'SVG to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert SVG to PNG online for free. Fast, secure, and easy-to-use SVG to PNG converter with no file size limits.',
  keywords: ['svg to png', 'svg converter', 'png converter', 'convert svg', 'online svg converter'],
  openGraph: {
    title: 'SVG to PNG Converter - FlipFileX',
    description: 'Convert SVG to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/svg-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVG to PNG Converter',
    description: 'Convert SVG to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/svg-to-png',
  },
};

export default function SvgToPngPage() {
  return (
    <ConverterPage
      slug="svg-to-png"
      sourceFormat="svg"
      targetFormat="png"
      category="image"
      title="SVG to PNG Converter"
    />
  );
}
