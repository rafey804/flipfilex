import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TIFF to ICO Converter - Free Online Tool | FlipFileX',
  description: 'Convert TIFF to ICO online for free. Fast, secure, and easy-to-use TIFF to ICO converter with no file size limits.',
  keywords: ['tiff to ico', 'tiff converter', 'ico converter', 'convert tiff', 'online tiff converter'],
  openGraph: {
    title: 'TIFF to ICO Converter - FlipFileX',
    description: 'Convert TIFF to ICO online for free',
    type: 'website',
    url: 'https://flipfilex.com/tiff-to-ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIFF to ICO Converter',
    description: 'Convert TIFF to ICO online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/tiff-to-ico',
  },
};

export default function TiffToIcoPage() {
  return (
    <ConverterPage
      slug="tiff-to-ico"
      sourceFormat="tiff"
      targetFormat="ico"
      category="image"
      title="TIFF to ICO Converter"
    />
  );
}
