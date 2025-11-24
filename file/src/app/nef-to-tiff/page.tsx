import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'NEF to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert NEF to TIFF online for free. Fast, secure, and easy-to-use NEF to TIFF converter with no file size limits.',
  keywords: ['nef to tiff', 'nef converter', 'tiff converter', 'convert nef', 'online nef converter'],
  openGraph: {
    title: 'NEF to TIFF Converter - FlipFileX',
    description: 'Convert NEF to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/nef-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEF to TIFF Converter',
    description: 'Convert NEF to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/nef-to-tiff',
  },
};

export default function NefToTiffPage() {
  return (
    <ConverterPage
      slug="nef-to-tiff"
      sourceFormat="nef"
      targetFormat="tiff"
      category="image"
      title="NEF to TIFF Converter"
    />
  );
}
