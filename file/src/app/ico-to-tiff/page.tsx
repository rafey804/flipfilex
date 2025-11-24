import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'ICO to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert ICO to TIFF online for free. Fast, secure, and easy-to-use ICO to TIFF converter with no file size limits.',
  keywords: ['ico to tiff', 'ico converter', 'tiff converter', 'convert ico', 'online ico converter'],
  openGraph: {
    title: 'ICO to TIFF Converter - FlipFileX',
    description: 'Convert ICO to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/ico-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICO to TIFF Converter',
    description: 'Convert ICO to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ico-to-tiff',
  },
};

export default function IcoToTiffPage() {
  return (
    <ConverterPage
      slug="ico-to-tiff"
      sourceFormat="ico"
      targetFormat="tiff"
      category="image"
      title="ICO to TIFF Converter"
    />
  );
}
