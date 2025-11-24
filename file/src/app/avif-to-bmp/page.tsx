import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'AVIF to BMP Converter - Free Online Tool | FlipFileX',
  description: 'Convert AVIF to BMP online for free. Fast, secure, and easy-to-use AVIF to BMP converter with no file size limits.',
  keywords: ['avif to bmp', 'avif converter', 'bmp converter', 'convert avif', 'online avif converter'],
  openGraph: {
    title: 'AVIF to BMP Converter - FlipFileX',
    description: 'Convert AVIF to BMP online for free',
    type: 'website',
    url: 'https://flipfilex.com/avif-to-bmp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVIF to BMP Converter',
    description: 'Convert AVIF to BMP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/avif-to-bmp',
  },
};

export default function AvifToBmpPage() {
  return (
    <ConverterPage
      slug="avif-to-bmp"
      sourceFormat="avif"
      targetFormat="bmp"
      category="image"
      title="AVIF to BMP Converter"
    />
  );
}
