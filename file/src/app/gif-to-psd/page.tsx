import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'GIF to PSD Converter - Free Online Tool | FlipFileX',
  description: 'Convert GIF to PSD online for free. Fast, secure, and easy-to-use GIF to PSD converter with no file size limits.',
  keywords: ['gif to psd', 'gif converter', 'psd converter', 'convert gif', 'online gif converter'],
  openGraph: {
    title: 'GIF to PSD Converter - FlipFileX',
    description: 'Convert GIF to PSD online for free',
    type: 'website',
    url: 'https://flipfilex.com/gif-to-psd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF to PSD Converter',
    description: 'Convert GIF to PSD online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/gif-to-psd',
  },
};

export default function GifToPsdPage() {
  return (
    <ConverterPage
      slug="gif-to-psd"
      sourceFormat="gif"
      targetFormat="psd"
      category="image"
      title="GIF to PSD Converter"
    />
  );
}
