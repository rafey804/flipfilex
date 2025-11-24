import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'RAW to WEBP Converter - Free Online Tool | FlipFileX',
  description: 'Convert RAW to WEBP online for free. Fast, secure, and easy-to-use RAW to WEBP converter with no file size limits.',
  keywords: ['raw to webp', 'raw converter', 'webp converter', 'convert raw', 'online raw converter'],
  openGraph: {
    title: 'RAW to WEBP Converter - FlipFileX',
    description: 'Convert RAW to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/raw-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAW to WEBP Converter',
    description: 'Convert RAW to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/raw-to-webp',
  },
};

export default function RawToWebpPage() {
  return (
    <ConverterPage
      slug="raw-to-webp"
      sourceFormat="raw"
      targetFormat="webp"
      category="image"
      title="RAW to WEBP Converter"
    />
  );
}
