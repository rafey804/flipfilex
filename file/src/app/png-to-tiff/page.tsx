import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PNG to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert PNG to TIFF online for free. Fast, secure, and easy-to-use PNG to TIFF converter with no file size limits.',
  keywords: ['png to tiff', 'png converter', 'tiff converter', 'convert png', 'online png converter'],
  openGraph: {
    title: 'PNG to TIFF Converter - FlipFileX',
    description: 'Convert PNG to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/png-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNG to TIFF Converter',
    description: 'Convert PNG to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/png-to-tiff',
  },
};

export default function PngToTiffPage() {
  return (
    <ConverterPage
      slug="png-to-tiff"
      sourceFormat="png"
      targetFormat="tiff"
      category="image"
      title="PNG to TIFF Converter"
    />
  );
}
