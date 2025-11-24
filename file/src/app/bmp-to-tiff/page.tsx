import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'BMP to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert BMP to TIFF online for free. Fast, secure, and easy-to-use BMP to TIFF converter with no file size limits.',
  keywords: ['bmp to tiff', 'bmp converter', 'tiff converter', 'convert bmp', 'online bmp converter'],
  openGraph: {
    title: 'BMP to TIFF Converter - FlipFileX',
    description: 'Convert BMP to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/bmp-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMP to TIFF Converter',
    description: 'Convert BMP to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/bmp-to-tiff',
  },
};

export default function BmpToTiffPage() {
  return (
    <ConverterPage
      slug="bmp-to-tiff"
      sourceFormat="bmp"
      targetFormat="tiff"
      category="image"
      title="BMP to TIFF Converter"
    />
  );
}
