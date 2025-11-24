import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'GIF to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert GIF to TIFF online for free. Fast, secure, and easy-to-use GIF to TIFF converter with no file size limits.',
  keywords: ['gif to tiff', 'gif converter', 'tiff converter', 'convert gif', 'online gif converter'],
  openGraph: {
    title: 'GIF to TIFF Converter - FlipFileX',
    description: 'Convert GIF to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/gif-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF to TIFF Converter',
    description: 'Convert GIF to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/gif-to-tiff',
  },
};

export default function GifToTiffPage() {
  return (
    <ConverterPage
      slug="gif-to-tiff"
      sourceFormat="gif"
      targetFormat="tiff"
      category="image"
      title="GIF to TIFF Converter"
    />
  );
}
