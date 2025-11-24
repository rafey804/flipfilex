import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'BMP to PSD Converter - Free Online Tool | FlipFileX',
  description: 'Convert BMP to PSD online for free. Fast, secure, and easy-to-use BMP to PSD converter with no file size limits.',
  keywords: ['bmp to psd', 'bmp converter', 'psd converter', 'convert bmp', 'online bmp converter'],
  openGraph: {
    title: 'BMP to PSD Converter - FlipFileX',
    description: 'Convert BMP to PSD online for free',
    type: 'website',
    url: 'https://flipfilex.com/bmp-to-psd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMP to PSD Converter',
    description: 'Convert BMP to PSD online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/bmp-to-psd',
  },
};

export default function BmpToPsdPage() {
  return (
    <ConverterPage
      slug="bmp-to-psd"
      sourceFormat="bmp"
      targetFormat="psd"
      category="image"
      title="BMP to PSD Converter"
    />
  );
}
