import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'BMP to HEIC Converter - Free Online Tool | FlipFileX',
  description: 'Convert BMP to HEIC online for free. Fast, secure, and easy-to-use BMP to HEIC converter with no file size limits.',
  keywords: ['bmp to heic', 'bmp converter', 'heic converter', 'convert bmp', 'online bmp converter'],
  openGraph: {
    title: 'BMP to HEIC Converter - FlipFileX',
    description: 'Convert BMP to HEIC online for free',
    type: 'website',
    url: 'https://flipfilex.com/bmp-to-heic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMP to HEIC Converter',
    description: 'Convert BMP to HEIC online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/bmp-to-heic',
  },
};

export default function BmpToHeicPage() {
  return (
    <ConverterPage
      slug="bmp-to-heic"
      sourceFormat="bmp"
      targetFormat="heic"
      category="image"
      title="BMP to HEIC Converter"
    />
  );
}
