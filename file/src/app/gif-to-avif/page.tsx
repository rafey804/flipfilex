import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'GIF to AVIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert GIF to AVIF online for free. Fast, secure, and easy-to-use GIF to AVIF converter with no file size limits.',
  keywords: ['gif to avif', 'gif converter', 'avif converter', 'convert gif', 'online gif converter'],
  openGraph: {
    title: 'GIF to AVIF Converter - FlipFileX',
    description: 'Convert GIF to AVIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/gif-to-avif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF to AVIF Converter',
    description: 'Convert GIF to AVIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/gif-to-avif',
  },
};

export default function GifToAvifPage() {
  return (
    <ConverterPage
      slug="gif-to-avif"
      sourceFormat="gif"
      targetFormat="avif"
      category="image"
      title="GIF to AVIF Converter"
    />
  );
}
