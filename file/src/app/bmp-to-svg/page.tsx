import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'BMP to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert BMP to SVG online for free. Fast, secure, and easy-to-use BMP to SVG converter with no file size limits.',
  keywords: ['bmp to svg', 'bmp converter', 'svg converter', 'convert bmp', 'online bmp converter'],
  openGraph: {
    title: 'BMP to SVG Converter - FlipFileX',
    description: 'Convert BMP to SVG online for free',
    type: 'website',
    url: 'https://flipfilex.com/bmp-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMP to SVG Converter',
    description: 'Convert BMP to SVG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/bmp-to-svg',
  },
};

export default function BmpToSvgPage() {
  return (
    <ConverterPage
      slug="bmp-to-svg"
      sourceFormat="bmp"
      targetFormat="svg"
      category="image"
      title="BMP to SVG Converter"
    />
  );
}
