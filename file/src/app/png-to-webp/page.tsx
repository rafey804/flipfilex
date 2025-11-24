import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PNG to WebP Converter - Free Online Tool | FlipFileX',
  description: 'Convert PNG to WEBP online for free. Fast, secure, and easy-to-use PNG to WEBP converter with no file size limits.',
  keywords: ['png to webp', 'png converter', 'webp converter', 'convert png', 'online png converter'],
  openGraph: {
    title: 'PNG to WebP Converter - FlipFileX',
    description: 'Convert PNG to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/png-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNG to WebP Converter',
    description: 'Convert PNG to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/png-to-webp',
  },
};

export default function PngToWebpPage() {
  return (
    <ConverterPage
      slug="png-to-webp"
      sourceFormat="png"
      targetFormat="webp"
      category="image"
      title="PNG to WebP Converter"
    />
  );
}
