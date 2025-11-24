import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'NEF to WEBP Converter - Free Online Tool | FlipFileX',
  description: 'Convert NEF to WEBP online for free. Fast, secure, and easy-to-use NEF to WEBP converter with no file size limits.',
  keywords: ['nef to webp', 'nef converter', 'webp converter', 'convert nef', 'online nef converter'],
  openGraph: {
    title: 'NEF to WEBP Converter - FlipFileX',
    description: 'Convert NEF to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/nef-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEF to WEBP Converter',
    description: 'Convert NEF to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/nef-to-webp',
  },
};

export default function NefToWebpPage() {
  return (
    <ConverterPage
      slug="nef-to-webp"
      sourceFormat="nef"
      targetFormat="webp"
      category="image"
      title="NEF to WEBP Converter"
    />
  );
}
