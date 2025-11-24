import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TIFF to BMP Converter - Free Online Tool | FlipFileX',
  description: 'Convert TIFF to BMP online for free. Fast, secure, and easy-to-use TIFF to BMP converter with no file size limits.',
  keywords: ['tiff to bmp', 'tiff converter', 'bmp converter', 'convert tiff', 'online tiff converter'],
  openGraph: {
    title: 'TIFF to BMP Converter - FlipFileX',
    description: 'Convert TIFF to BMP online for free',
    type: 'website',
    url: 'https://flipfilex.com/tiff-to-bmp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIFF to BMP Converter',
    description: 'Convert TIFF to BMP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/tiff-to-bmp',
  },
};

export default function TiffToBmpPage() {
  return (
    <ConverterPage
      slug="tiff-to-bmp"
      sourceFormat="tiff"
      targetFormat="bmp"
      category="image"
      title="TIFF to BMP Converter"
    />
  );
}
