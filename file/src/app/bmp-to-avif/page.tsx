import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'BMP to AVIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert BMP to AVIF online for free. Fast, secure, and easy-to-use BMP to AVIF converter with no file size limits.',
  keywords: ['bmp to avif', 'bmp converter', 'avif converter', 'convert bmp', 'online bmp converter'],
  openGraph: {
    title: 'BMP to AVIF Converter - FlipFileX',
    description: 'Convert BMP to AVIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/bmp-to-avif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMP to AVIF Converter',
    description: 'Convert BMP to AVIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/bmp-to-avif',
  },
};

export default function BmpToAvifPage() {
  return (
    <ConverterPage
      slug="bmp-to-avif"
      sourceFormat="bmp"
      targetFormat="avif"
      category="image"
      title="BMP to AVIF Converter"
    />
  );
}
