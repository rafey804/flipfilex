import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TIFF to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert TIFF to JPG online for free. Fast, secure, and easy-to-use TIFF to JPG converter with no file size limits.',
  keywords: ['tiff to jpg', 'tiff converter', 'jpg converter', 'convert tiff', 'online tiff converter'],
  openGraph: {
    title: 'TIFF to JPG Converter - FlipFileX',
    description: 'Convert TIFF to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/tiff-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIFF to JPG Converter',
    description: 'Convert TIFF to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/tiff-to-jpg',
  },
};

export default function TiffToJpgPage() {
  return (
    <ConverterPage
      slug="tiff-to-jpg"
      sourceFormat="tiff"
      targetFormat="jpg"
      category="image"
      title="TIFF to JPG Converter"
    />
  );
}
