import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PNG to BMP Converter - Free Online Tool | FlipFileX',
  description: 'Convert PNG to BMP online for free. Fast, secure, and easy-to-use PNG to BMP converter with no file size limits.',
  keywords: ['png to bmp', 'png converter', 'bmp converter', 'convert png', 'online png converter'],
  openGraph: {
    title: 'PNG to BMP Converter - FlipFileX',
    description: 'Convert PNG to BMP online for free',
    type: 'website',
    url: 'https://flipfilex.com/png-to-bmp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNG to BMP Converter',
    description: 'Convert PNG to BMP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/png-to-bmp',
  },
};

export default function PngToBmpPage() {
  return (
    <ConverterPage
      slug="png-to-bmp"
      sourceFormat="png"
      targetFormat="bmp"
      category="image"
      title="PNG to BMP Converter"
    />
  );
}
