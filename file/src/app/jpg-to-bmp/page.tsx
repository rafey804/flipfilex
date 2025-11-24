import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'JPG to BMP Converter - Free Online Tool | FlipFileX',
  description: 'Convert JPG to BMP online for free. Fast, secure, and easy-to-use JPG to BMP converter with no file size limits.',
  keywords: ['jpg to bmp', 'jpg converter', 'bmp converter', 'convert jpg', 'online jpg converter'],
  openGraph: {
    title: 'JPG to BMP Converter - FlipFileX',
    description: 'Convert JPG to BMP online for free',
    type: 'website',
    url: 'https://flipfilex.com/jpg-to-bmp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to BMP Converter',
    description: 'Convert JPG to BMP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/jpg-to-bmp',
  },
};

export default function JpgToBmpPage() {
  return (
    <ConverterPage
      slug="jpg-to-bmp"
      sourceFormat="jpg"
      targetFormat="bmp"
      category="image"
      title="JPG to BMP Converter"
    />
  );
}
