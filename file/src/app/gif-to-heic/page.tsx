import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'GIF to HEIC Converter - Free Online Tool | FlipFileX',
  description: 'Convert GIF to HEIC online for free. Fast, secure, and easy-to-use GIF to HEIC converter with no file size limits.',
  keywords: ['gif to heic', 'gif converter', 'heic converter', 'convert gif', 'online gif converter'],
  openGraph: {
    title: 'GIF to HEIC Converter - FlipFileX',
    description: 'Convert GIF to HEIC online for free',
    type: 'website',
    url: 'https://flipfilex.com/gif-to-heic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF to HEIC Converter',
    description: 'Convert GIF to HEIC online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/gif-to-heic',
  },
};

export default function GifToHeicPage() {
  return (
    <ConverterPage
      slug="gif-to-heic"
      sourceFormat="gif"
      targetFormat="heic"
      category="image"
      title="GIF to HEIC Converter"
    />
  );
}
