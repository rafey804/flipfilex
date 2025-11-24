import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'BMP to WEBP Converter - Free Online Tool | FlipFileX',
  description: 'Convert BMP to WEBP online for free. Fast, secure, and easy-to-use BMP to WEBP converter with no file size limits.',
  keywords: ['bmp to webp', 'bmp converter', 'webp converter', 'convert bmp', 'online bmp converter'],
  openGraph: {
    title: 'BMP to WEBP Converter - FlipFileX',
    description: 'Convert BMP to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/bmp-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMP to WEBP Converter',
    description: 'Convert BMP to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/bmp-to-webp',
  },
};

export default function BmpToWebpPage() {
  return (
    <ConverterPage
      slug="bmp-to-webp"
      sourceFormat="bmp"
      targetFormat="webp"
      category="image"
      title="BMP to WEBP Converter"
    />
  );
}
