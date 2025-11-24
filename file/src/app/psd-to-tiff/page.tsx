import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PSD to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert PSD to TIFF online for free. Fast, secure, and easy-to-use PSD to TIFF converter with no file size limits.',
  keywords: ['psd to tiff', 'psd converter', 'tiff converter', 'convert psd', 'online psd converter'],
  openGraph: {
    title: 'PSD to TIFF Converter - FlipFileX',
    description: 'Convert PSD to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/psd-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSD to TIFF Converter',
    description: 'Convert PSD to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/psd-to-tiff',
  },
};

export default function PsdToTiffPage() {
  return (
    <ConverterPage
      slug="psd-to-tiff"
      sourceFormat="psd"
      targetFormat="tiff"
      category="image"
      title="PSD to TIFF Converter"
    />
  );
}
