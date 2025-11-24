import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'SVG to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert SVG to TIFF online for free. Fast, secure, and easy-to-use SVG to TIFF converter with no file size limits.',
  keywords: ['svg to tiff', 'svg converter', 'tiff converter', 'convert svg', 'online svg converter'],
  openGraph: {
    title: 'SVG to TIFF Converter - FlipFileX',
    description: 'Convert SVG to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/svg-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVG to TIFF Converter',
    description: 'Convert SVG to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/svg-to-tiff',
  },
};

export default function SvgToTiffPage() {
  return (
    <ConverterPage
      slug="svg-to-tiff"
      sourceFormat="svg"
      targetFormat="tiff"
      category="image"
      title="SVG to TIFF Converter"
    />
  );
}
