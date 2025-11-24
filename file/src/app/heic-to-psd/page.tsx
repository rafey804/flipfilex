import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'HEIC to PSD Converter - Free Online Tool | FlipFileX',
  description: 'Convert HEIC to PSD online for free. Fast, secure, and easy-to-use HEIC to PSD converter with no file size limits.',
  keywords: ['heic to psd', 'heic converter', 'psd converter', 'convert heic', 'online heic converter'],
  openGraph: {
    title: 'HEIC to PSD Converter - FlipFileX',
    description: 'Convert HEIC to PSD online for free',
    type: 'website',
    url: 'https://flipfilex.com/heic-to-psd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEIC to PSD Converter',
    description: 'Convert HEIC to PSD online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/heic-to-psd',
  },
};

export default function HeicToPsdPage() {
  return (
    <ConverterPage
      slug="heic-to-psd"
      sourceFormat="heic"
      targetFormat="psd"
      category="image"
      title="HEIC to PSD Converter"
    />
  );
}
