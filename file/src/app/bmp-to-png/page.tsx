import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'BMP to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert BMP to PNG online for free. Fast, secure, and easy-to-use BMP to PNG converter with no file size limits.',
  keywords: ['bmp to png', 'bmp converter', 'png converter', 'convert bmp', 'online bmp converter'],
  openGraph: {
    title: 'BMP to PNG Converter - FlipFileX',
    description: 'Convert BMP to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/bmp-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMP to PNG Converter',
    description: 'Convert BMP to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/bmp-to-png',
  },
};

export default function BmpToPngPage() {
  return (
    <ConverterPage
      slug="bmp-to-png"
      sourceFormat="bmp"
      targetFormat="png"
      category="image"
      title="BMP to PNG Converter"
    />
  );
}
