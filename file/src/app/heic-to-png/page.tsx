import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'HEIC to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert HEIC to PNG online for free. Fast, secure, and easy-to-use HEIC to PNG converter with no file size limits.',
  keywords: ['heic to png', 'heic converter', 'png converter', 'convert heic', 'online heic converter'],
  openGraph: {
    title: 'HEIC to PNG Converter - FlipFileX',
    description: 'Convert HEIC to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/heic-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEIC to PNG Converter',
    description: 'Convert HEIC to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/heic-to-png',
  },
};

export default function HeicToPngPage() {
  return (
    <ConverterPage
      slug="heic-to-png"
      sourceFormat="heic"
      targetFormat="png"
      category="image"
      title="HEIC to PNG Converter"
    />
  );
}
