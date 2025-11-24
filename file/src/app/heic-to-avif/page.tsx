import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'HEIC to AVIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert HEIC to AVIF online for free. Fast, secure, and easy-to-use HEIC to AVIF converter with no file size limits.',
  keywords: ['heic to avif', 'heic converter', 'avif converter', 'convert heic', 'online heic converter'],
  openGraph: {
    title: 'HEIC to AVIF Converter - FlipFileX',
    description: 'Convert HEIC to AVIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/heic-to-avif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEIC to AVIF Converter',
    description: 'Convert HEIC to AVIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/heic-to-avif',
  },
};

export default function HeicToAvifPage() {
  return (
    <ConverterPage
      slug="heic-to-avif"
      sourceFormat="heic"
      targetFormat="avif"
      category="image"
      title="HEIC to AVIF Converter"
    />
  );
}
