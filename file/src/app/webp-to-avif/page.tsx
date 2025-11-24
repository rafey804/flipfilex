import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WEBP to AVIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert WEBP to AVIF online for free. Fast, secure, and easy-to-use WEBP to AVIF converter with no file size limits.',
  keywords: ['webp to avif', 'webp converter', 'avif converter', 'convert webp', 'online webp converter'],
  openGraph: {
    title: 'WEBP to AVIF Converter - FlipFileX',
    description: 'Convert WEBP to AVIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/webp-to-avif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WEBP to AVIF Converter',
    description: 'Convert WEBP to AVIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/webp-to-avif',
  },
};

export default function WebpToAvifPage() {
  return (
    <ConverterPage
      slug="webp-to-avif"
      sourceFormat="webp"
      targetFormat="avif"
      category="image"
      title="WEBP to AVIF Converter"
    />
  );
}
