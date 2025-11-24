import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'JPG to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert JPG to SVG online for free. Fast, secure, and easy-to-use JPG to SVG converter with no file size limits.',
  keywords: ['jpg to svg', 'jpg converter', 'svg converter', 'convert jpg', 'online jpg converter'],
  openGraph: {
    title: 'JPG to SVG Converter - FlipFileX',
    description: 'Convert JPG to SVG online for free',
    type: 'website',
    url: 'https://flipfilex.com/jpg-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to SVG Converter',
    description: 'Convert JPG to SVG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/jpg-to-svg',
  },
};

export default function JpgToSvgPage() {
  return (
    <ConverterPage
      slug="jpg-to-svg"
      sourceFormat="jpg"
      targetFormat="svg"
      category="image"
      title="JPG to SVG Converter"
    />
  );
}
