import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TIFF to GIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert TIFF to GIF online for free. Fast, secure, and easy-to-use TIFF to GIF converter with no file size limits.',
  keywords: ['tiff to gif', 'tiff converter', 'gif converter', 'convert tiff', 'online tiff converter'],
  openGraph: {
    title: 'TIFF to GIF Converter - FlipFileX',
    description: 'Convert TIFF to GIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/tiff-to-gif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIFF to GIF Converter',
    description: 'Convert TIFF to GIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/tiff-to-gif',
  },
};

export default function TiffToGifPage() {
  return (
    <ConverterPage
      slug="tiff-to-gif"
      sourceFormat="tiff"
      targetFormat="gif"
      category="image"
      title="TIFF to GIF Converter"
    />
  );
}
