import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'GIF to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert GIF to PNG online for free. Fast, secure, and easy-to-use GIF to PNG converter with no file size limits.',
  keywords: ['gif to png', 'gif converter', 'png converter', 'convert gif', 'online gif converter'],
  openGraph: {
    title: 'GIF to PNG Converter - FlipFileX',
    description: 'Convert GIF to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/gif-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF to PNG Converter',
    description: 'Convert GIF to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/gif-to-png',
  },
};

export default function GifToPngPage() {
  return (
    <ConverterPage
      slug="gif-to-png"
      sourceFormat="gif"
      targetFormat="png"
      category="image"
      title="GIF to PNG Converter"
    />
  );
}
