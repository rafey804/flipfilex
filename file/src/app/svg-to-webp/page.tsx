import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'SVG to WEBP Converter - Free Online Tool | FlipFileX',
  description: 'Convert SVG to WEBP online for free. Fast, secure, and easy-to-use SVG to WEBP converter with no file size limits.',
  keywords: ['svg to webp', 'svg converter', 'webp converter', 'convert svg', 'online svg converter'],
  openGraph: {
    title: 'SVG to WEBP Converter - FlipFileX',
    description: 'Convert SVG to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/svg-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVG to WEBP Converter',
    description: 'Convert SVG to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/svg-to-webp',
  },
};

export default function SvgToWebpPage() {
  return (
    <ConverterPage
      slug="svg-to-webp"
      sourceFormat="svg"
      targetFormat="webp"
      category="image"
      title="SVG to WEBP Converter"
    />
  );
}
