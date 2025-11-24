import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'AVIF to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert AVIF to PNG online for free. Fast, secure, and easy-to-use AVIF to PNG converter with no file size limits.',
  keywords: ['avif to png', 'avif converter', 'png converter', 'convert avif', 'online avif converter'],
  openGraph: {
    title: 'AVIF to PNG Converter - FlipFileX',
    description: 'Convert AVIF to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/avif-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVIF to PNG Converter',
    description: 'Convert AVIF to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/avif-to-png',
  },
};

export default function AvifToPngPage() {
  return (
    <ConverterPage
      slug="avif-to-png"
      sourceFormat="avif"
      targetFormat="png"
      category="image"
      title="AVIF to PNG Converter"
    />
  );
}
