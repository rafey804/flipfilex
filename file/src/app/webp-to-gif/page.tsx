import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WEBP to GIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert WEBP to GIF online for free. Fast, secure, and easy-to-use WEBP to GIF converter with no file size limits.',
  keywords: ['webp to gif', 'webp converter', 'gif converter', 'convert webp', 'online webp converter'],
  openGraph: {
    title: 'WEBP to GIF Converter - FlipFileX',
    description: 'Convert WEBP to GIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/webp-to-gif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WEBP to GIF Converter',
    description: 'Convert WEBP to GIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/webp-to-gif',
  },
};

export default function WebpToGifPage() {
  return (
    <ConverterPage
      slug="webp-to-gif"
      sourceFormat="webp"
      targetFormat="gif"
      category="image"
      title="WEBP to GIF Converter"
    />
  );
}
