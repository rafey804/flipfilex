import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'BMP to GIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert BMP to GIF online for free. Fast, secure, and easy-to-use BMP to GIF converter with no file size limits.',
  keywords: ['bmp to gif', 'bmp converter', 'gif converter', 'convert bmp', 'online bmp converter'],
  openGraph: {
    title: 'BMP to GIF Converter - FlipFileX',
    description: 'Convert BMP to GIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/bmp-to-gif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMP to GIF Converter',
    description: 'Convert BMP to GIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/bmp-to-gif',
  },
};

export default function BmpToGifPage() {
  return (
    <ConverterPage
      slug="bmp-to-gif"
      sourceFormat="bmp"
      targetFormat="gif"
      category="image"
      title="BMP to GIF Converter"
    />
  );
}
