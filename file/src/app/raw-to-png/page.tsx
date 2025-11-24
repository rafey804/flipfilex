import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'RAW to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert RAW to PNG online for free. Fast, secure, and easy-to-use RAW to PNG converter with no file size limits.',
  keywords: ['raw to png', 'raw converter', 'png converter', 'convert raw', 'online raw converter'],
  openGraph: {
    title: 'RAW to PNG Converter - FlipFileX',
    description: 'Convert RAW to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/raw-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAW to PNG Converter',
    description: 'Convert RAW to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/raw-to-png',
  },
};

export default function RawToPngPage() {
  return (
    <ConverterPage
      slug="raw-to-png"
      sourceFormat="raw"
      targetFormat="png"
      category="image"
      title="RAW to PNG Converter"
    />
  );
}
