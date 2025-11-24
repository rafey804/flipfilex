import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'HEIC to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert HEIC to JPG online for free. Fast, secure, and easy-to-use HEIC to JPG converter with no file size limits.',
  keywords: ['heic to jpg', 'heic converter', 'jpg converter', 'convert heic', 'online heic converter'],
  openGraph: {
    title: 'HEIC to JPG Converter - FlipFileX',
    description: 'Convert HEIC to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/heic-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEIC to JPG Converter',
    description: 'Convert HEIC to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/heic-to-jpg',
  },
};

export default function HeicToJpgPage() {
  return (
    <ConverterPage
      slug="heic-to-jpg"
      sourceFormat="heic"
      targetFormat="jpg"
      category="image"
      title="HEIC to JPG Converter"
    />
  );
}
