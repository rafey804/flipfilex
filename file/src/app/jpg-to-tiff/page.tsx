import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'JPG to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert JPG to TIFF online for free. Fast, secure, and easy-to-use JPG to TIFF converter with no file size limits.',
  keywords: ['jpg to tiff', 'jpg converter', 'tiff converter', 'convert jpg', 'online jpg converter'],
  openGraph: {
    title: 'JPG to TIFF Converter - FlipFileX',
    description: 'Convert JPG to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/jpg-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to TIFF Converter',
    description: 'Convert JPG to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/jpg-to-tiff',
  },
};

export default function JpgToTiffPage() {
  return (
    <ConverterPage
      slug="jpg-to-tiff"
      sourceFormat="jpg"
      targetFormat="tiff"
      category="image"
      title="JPG to TIFF Converter"
    />
  );
}
