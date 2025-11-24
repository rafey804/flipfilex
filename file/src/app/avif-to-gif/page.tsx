import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'AVIF to GIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert AVIF to GIF online for free. Fast, secure, and easy-to-use AVIF to GIF converter with no file size limits.',
  keywords: ['avif to gif', 'avif converter', 'gif converter', 'convert avif', 'online avif converter'],
  openGraph: {
    title: 'AVIF to GIF Converter - FlipFileX',
    description: 'Convert AVIF to GIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/avif-to-gif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVIF to GIF Converter',
    description: 'Convert AVIF to GIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/avif-to-gif',
  },
};

export default function AvifToGifPage() {
  return (
    <ConverterPage
      slug="avif-to-gif"
      sourceFormat="avif"
      targetFormat="gif"
      category="image"
      title="AVIF to GIF Converter"
    />
  );
}
