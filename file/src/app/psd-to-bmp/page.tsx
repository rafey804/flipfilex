import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PSD to BMP Converter - Free Online Tool | FlipFileX',
  description: 'Convert PSD to BMP online for free. Fast, secure, and easy-to-use PSD to BMP converter with no file size limits.',
  keywords: ['psd to bmp', 'psd converter', 'bmp converter', 'convert psd', 'online psd converter'],
  openGraph: {
    title: 'PSD to BMP Converter - FlipFileX',
    description: 'Convert PSD to BMP online for free',
    type: 'website',
    url: 'https://flipfilex.com/psd-to-bmp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSD to BMP Converter',
    description: 'Convert PSD to BMP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/psd-to-bmp',
  },
};

export default function PsdToBmpPage() {
  return (
    <ConverterPage
      slug="psd-to-bmp"
      sourceFormat="psd"
      targetFormat="bmp"
      category="image"
      title="PSD to BMP Converter"
    />
  );
}
