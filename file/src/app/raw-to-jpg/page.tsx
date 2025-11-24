import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'RAW to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert RAW to JPG online for free. Fast, secure, and easy-to-use RAW to JPG converter with no file size limits.',
  keywords: ['raw to jpg', 'raw converter', 'jpg converter', 'convert raw', 'online raw converter'],
  openGraph: {
    title: 'RAW to JPG Converter - FlipFileX',
    description: 'Convert RAW to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/raw-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAW to JPG Converter',
    description: 'Convert RAW to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/raw-to-jpg',
  },
};

export default function RawToJpgPage() {
  return (
    <ConverterPage
      slug="raw-to-jpg"
      sourceFormat="raw"
      targetFormat="jpg"
      category="image"
      title="RAW to JPG Converter"
    />
  );
}
