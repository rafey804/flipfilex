import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WEBP to BMP Converter - Free Online Tool | FlipFileX',
  description: 'Convert WEBP to BMP online for free. Fast, secure, and easy-to-use WEBP to BMP converter with no file size limits.',
  keywords: ['webp to bmp', 'webp converter', 'bmp converter', 'convert webp', 'online webp converter'],
  openGraph: {
    title: 'WEBP to BMP Converter - FlipFileX',
    description: 'Convert WEBP to BMP online for free',
    type: 'website',
    url: 'https://flipfilex.com/webp-to-bmp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WEBP to BMP Converter',
    description: 'Convert WEBP to BMP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/webp-to-bmp',
  },
};

export default function WebpToBmpPage() {
  return (
    <ConverterPage
      slug="webp-to-bmp"
      sourceFormat="webp"
      targetFormat="bmp"
      category="image"
      title="WEBP to BMP Converter"
    />
  );
}
