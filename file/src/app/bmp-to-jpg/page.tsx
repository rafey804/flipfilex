import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'BMP to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert BMP to JPG online for free. Fast, secure, and easy-to-use BMP to JPG converter with no file size limits.',
  keywords: ['bmp to jpg', 'bmp converter', 'jpg converter', 'convert bmp', 'online bmp converter'],
  openGraph: {
    title: 'BMP to JPG Converter - FlipFileX',
    description: 'Convert BMP to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/bmp-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMP to JPG Converter',
    description: 'Convert BMP to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/bmp-to-jpg',
  },
};

export default function BmpToJpgPage() {
  return (
    <ConverterPage
      slug="bmp-to-jpg"
      sourceFormat="bmp"
      targetFormat="jpg"
      category="image"
      title="BMP to JPG Converter"
    />
  );
}
