import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WebP to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert WEBP to PNG online for free. Fast, secure, and easy-to-use WEBP to PNG converter with no file size limits.',
  keywords: ['webp to png', 'webp converter', 'png converter', 'convert webp', 'online webp converter'],
  openGraph: {
    title: 'WebP to PNG Converter - FlipFileX',
    description: 'Convert WEBP to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/webp-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebP to PNG Converter',
    description: 'Convert WEBP to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/webp-to-png',
  },
};

export default function WebpToPngPage() {
  return (
    <ConverterPage
      slug="webp-to-png"
      sourceFormat="webp"
      targetFormat="png"
      category="image"
      title="WebP to PNG Converter"
    />
  );
}
