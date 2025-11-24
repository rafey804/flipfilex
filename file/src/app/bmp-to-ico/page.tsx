import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'BMP to ICO Converter - Free Online Tool | FlipFileX',
  description: 'Convert BMP to ICO online for free. Fast, secure, and easy-to-use BMP to ICO converter with no file size limits.',
  keywords: ['bmp to ico', 'bmp converter', 'ico converter', 'convert bmp', 'online bmp converter'],
  openGraph: {
    title: 'BMP to ICO Converter - FlipFileX',
    description: 'Convert BMP to ICO online for free',
    type: 'website',
    url: 'https://flipfilex.com/bmp-to-ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMP to ICO Converter',
    description: 'Convert BMP to ICO online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/bmp-to-ico',
  },
};

export default function BmpToIcoPage() {
  return (
    <ConverterPage
      slug="bmp-to-ico"
      sourceFormat="bmp"
      targetFormat="ico"
      category="image"
      title="BMP to ICO Converter"
    />
  );
}
