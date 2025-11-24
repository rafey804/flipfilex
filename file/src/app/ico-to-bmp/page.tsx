import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'ICO to BMP Converter - Free Online Tool | FlipFileX',
  description: 'Convert ICO to BMP online for free. Fast, secure, and easy-to-use ICO to BMP converter with no file size limits.',
  keywords: ['ico to bmp', 'ico converter', 'bmp converter', 'convert ico', 'online ico converter'],
  openGraph: {
    title: 'ICO to BMP Converter - FlipFileX',
    description: 'Convert ICO to BMP online for free',
    type: 'website',
    url: 'https://flipfilex.com/ico-to-bmp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICO to BMP Converter',
    description: 'Convert ICO to BMP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ico-to-bmp',
  },
};

export default function IcoToBmpPage() {
  return (
    <ConverterPage
      slug="ico-to-bmp"
      sourceFormat="ico"
      targetFormat="bmp"
      category="image"
      title="ICO to BMP Converter"
    />
  );
}
