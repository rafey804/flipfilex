import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'ICO to GIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert ICO to GIF online for free. Fast, secure, and easy-to-use ICO to GIF converter with no file size limits.',
  keywords: ['ico to gif', 'ico converter', 'gif converter', 'convert ico', 'online ico converter'],
  openGraph: {
    title: 'ICO to GIF Converter - FlipFileX',
    description: 'Convert ICO to GIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/ico-to-gif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICO to GIF Converter',
    description: 'Convert ICO to GIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ico-to-gif',
  },
};

export default function IcoToGifPage() {
  return (
    <ConverterPage
      slug="ico-to-gif"
      sourceFormat="ico"
      targetFormat="gif"
      category="image"
      title="ICO to GIF Converter"
    />
  );
}
