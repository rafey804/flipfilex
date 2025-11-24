import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'SVG to BMP Converter - Free Online Tool | FlipFileX',
  description: 'Convert SVG to BMP online for free. Fast, secure, and easy-to-use SVG to BMP converter with no file size limits.',
  keywords: ['svg to bmp', 'svg converter', 'bmp converter', 'convert svg', 'online svg converter'],
  openGraph: {
    title: 'SVG to BMP Converter - FlipFileX',
    description: 'Convert SVG to BMP online for free',
    type: 'website',
    url: 'https://flipfilex.com/svg-to-bmp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVG to BMP Converter',
    description: 'Convert SVG to BMP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/svg-to-bmp',
  },
};

export default function SvgToBmpPage() {
  return (
    <ConverterPage
      slug="svg-to-bmp"
      sourceFormat="svg"
      targetFormat="bmp"
      category="image"
      title="SVG to BMP Converter"
    />
  );
}
