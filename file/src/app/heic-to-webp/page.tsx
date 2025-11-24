import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'HEIC to WEBP Converter - Free Online Tool | FlipFileX',
  description: 'Convert HEIC to WEBP online for free. Fast, secure, and easy-to-use HEIC to WEBP converter with no file size limits.',
  keywords: ['heic to webp', 'heic converter', 'webp converter', 'convert heic', 'online heic converter'],
  openGraph: {
    title: 'HEIC to WEBP Converter - FlipFileX',
    description: 'Convert HEIC to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/heic-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEIC to WEBP Converter',
    description: 'Convert HEIC to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/heic-to-webp',
  },
};

export default function HeicToWebpPage() {
  return (
    <ConverterPage
      slug="heic-to-webp"
      sourceFormat="heic"
      targetFormat="webp"
      category="image"
      title="HEIC to WEBP Converter"
    />
  );
}
