import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'ICO to WEBP Converter - Free Online Tool | FlipFileX',
  description: 'Convert ICO to WEBP online for free. Fast, secure, and easy-to-use ICO to WEBP converter with no file size limits.',
  keywords: ['ico to webp', 'ico converter', 'webp converter', 'convert ico', 'online ico converter'],
  openGraph: {
    title: 'ICO to WEBP Converter - FlipFileX',
    description: 'Convert ICO to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/ico-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICO to WEBP Converter',
    description: 'Convert ICO to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ico-to-webp',
  },
};

export default function IcoToWebpPage() {
  return (
    <ConverterPage
      slug="ico-to-webp"
      sourceFormat="ico"
      targetFormat="webp"
      category="image"
      title="ICO to WEBP Converter"
    />
  );
}
