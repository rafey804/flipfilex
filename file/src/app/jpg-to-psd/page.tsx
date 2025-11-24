import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'JPG to PSD Converter - Free Online Tool | FlipFileX',
  description: 'Convert JPG to PSD online for free. Fast, secure, and easy-to-use JPG to PSD converter with no file size limits.',
  keywords: ['jpg to psd', 'jpg converter', 'psd converter', 'convert jpg', 'online jpg converter'],
  openGraph: {
    title: 'JPG to PSD Converter - FlipFileX',
    description: 'Convert JPG to PSD online for free',
    type: 'website',
    url: 'https://flipfilex.com/jpg-to-psd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to PSD Converter',
    description: 'Convert JPG to PSD online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/jpg-to-psd',
  },
};

export default function JpgToPsdPage() {
  return (
    <ConverterPage
      slug="jpg-to-psd"
      sourceFormat="jpg"
      targetFormat="psd"
      category="image"
      title="JPG to PSD Converter"
    />
  );
}
