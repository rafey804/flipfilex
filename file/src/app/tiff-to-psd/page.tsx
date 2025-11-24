import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TIFF to PSD Converter - Free Online Tool | FlipFileX',
  description: 'Convert TIFF to PSD online for free. Fast, secure, and easy-to-use TIFF to PSD converter with no file size limits.',
  keywords: ['tiff to psd', 'tiff converter', 'psd converter', 'convert tiff', 'online tiff converter'],
  openGraph: {
    title: 'TIFF to PSD Converter - FlipFileX',
    description: 'Convert TIFF to PSD online for free',
    type: 'website',
    url: 'https://flipfilex.com/tiff-to-psd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIFF to PSD Converter',
    description: 'Convert TIFF to PSD online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/tiff-to-psd',
  },
};

export default function TiffToPsdPage() {
  return (
    <ConverterPage
      slug="tiff-to-psd"
      sourceFormat="tiff"
      targetFormat="psd"
      category="image"
      title="TIFF to PSD Converter"
    />
  );
}
