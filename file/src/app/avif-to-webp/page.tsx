import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'AVIF to WEBP Converter - Free Online Tool | FlipFileX',
  description: 'Convert AVIF to WEBP online for free. Fast, secure, and easy-to-use AVIF to WEBP converter with no file size limits.',
  keywords: ['avif to webp', 'avif converter', 'webp converter', 'convert avif', 'online avif converter'],
  openGraph: {
    title: 'AVIF to WEBP Converter - FlipFileX',
    description: 'Convert AVIF to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/avif-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVIF to WEBP Converter',
    description: 'Convert AVIF to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/avif-to-webp',
  },
};

export default function AvifToWebpPage() {
  return (
    <ConverterPage
      slug="avif-to-webp"
      sourceFormat="avif"
      targetFormat="webp"
      category="image"
      title="AVIF to WEBP Converter"
    />
  );
}
