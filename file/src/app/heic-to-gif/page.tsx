import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'HEIC to GIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert HEIC to GIF online for free. Fast, secure, and easy-to-use HEIC to GIF converter with no file size limits.',
  keywords: ['heic to gif', 'heic converter', 'gif converter', 'convert heic', 'online heic converter'],
  openGraph: {
    title: 'HEIC to GIF Converter - FlipFileX',
    description: 'Convert HEIC to GIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/heic-to-gif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEIC to GIF Converter',
    description: 'Convert HEIC to GIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/heic-to-gif',
  },
};

export default function HeicToGifPage() {
  return (
    <ConverterPage
      slug="heic-to-gif"
      sourceFormat="heic"
      targetFormat="gif"
      category="image"
      title="HEIC to GIF Converter"
    />
  );
}
