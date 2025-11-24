import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'GIF to WEBP Converter - Free Online Tool | FlipFileX',
  description: 'Convert GIF to WEBP online for free. Fast, secure, and easy-to-use GIF to WEBP converter with no file size limits.',
  keywords: ['gif to webp', 'gif converter', 'webp converter', 'convert gif', 'online gif converter'],
  openGraph: {
    title: 'GIF to WEBP Converter - FlipFileX',
    description: 'Convert GIF to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/gif-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF to WEBP Converter',
    description: 'Convert GIF to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/gif-to-webp',
  },
};

export default function GifToWebpPage() {
  return (
    <ConverterPage
      slug="gif-to-webp"
      sourceFormat="gif"
      targetFormat="webp"
      category="image"
      title="GIF to WEBP Converter"
    />
  );
}
