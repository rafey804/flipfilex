import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'HEIC to BMP Converter - Free Online Tool | FlipFileX',
  description: 'Convert HEIC to BMP online for free. Fast, secure, and easy-to-use HEIC to BMP converter with no file size limits.',
  keywords: ['heic to bmp', 'heic converter', 'bmp converter', 'convert heic', 'online heic converter'],
  openGraph: {
    title: 'HEIC to BMP Converter - FlipFileX',
    description: 'Convert HEIC to BMP online for free',
    type: 'website',
    url: 'https://flipfilex.com/heic-to-bmp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEIC to BMP Converter',
    description: 'Convert HEIC to BMP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/heic-to-bmp',
  },
};

export default function HeicToBmpPage() {
  return (
    <ConverterPage
      slug="heic-to-bmp"
      sourceFormat="heic"
      targetFormat="bmp"
      category="image"
      title="HEIC to BMP Converter"
    />
  );
}
