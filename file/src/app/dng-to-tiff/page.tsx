import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'DNG to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert DNG to TIFF online for free. Fast, secure, and easy-to-use DNG to TIFF converter with no file size limits.',
  keywords: ['dng to tiff', 'dng converter', 'tiff converter', 'convert dng', 'online dng converter'],
  openGraph: {
    title: 'DNG to TIFF Converter - FlipFileX',
    description: 'Convert DNG to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/dng-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DNG to TIFF Converter',
    description: 'Convert DNG to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/dng-to-tiff',
  },
};

export default function DngToTiffPage() {
  return (
    <ConverterPage
      slug="dng-to-tiff"
      sourceFormat="dng"
      targetFormat="tiff"
      category="image"
      title="DNG to TIFF Converter"
    />
  );
}
