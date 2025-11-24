import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'RAW to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert RAW to TIFF online for free. Fast, secure, and easy-to-use RAW to TIFF converter with no file size limits.',
  keywords: ['raw to tiff', 'raw converter', 'tiff converter', 'convert raw', 'online raw converter'],
  openGraph: {
    title: 'RAW to TIFF Converter - FlipFileX',
    description: 'Convert RAW to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/raw-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAW to TIFF Converter',
    description: 'Convert RAW to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/raw-to-tiff',
  },
};

export default function RawToTiffPage() {
  return (
    <ConverterPage
      slug="raw-to-tiff"
      sourceFormat="raw"
      targetFormat="tiff"
      category="image"
      title="RAW to TIFF Converter"
    />
  );
}
