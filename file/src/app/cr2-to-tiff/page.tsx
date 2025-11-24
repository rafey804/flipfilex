import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'CR2 to TIFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert CR2 to TIFF online for free. Fast, secure, and easy-to-use CR2 to TIFF converter with no file size limits.',
  keywords: ['cr2 to tiff', 'cr2 converter', 'tiff converter', 'convert cr2', 'online cr2 converter'],
  openGraph: {
    title: 'CR2 to TIFF Converter - FlipFileX',
    description: 'Convert CR2 to TIFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/cr2-to-tiff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CR2 to TIFF Converter',
    description: 'Convert CR2 to TIFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/cr2-to-tiff',
  },
};

export default function Cr2ToTiffPage() {
  return (
    <ConverterPage
      slug="cr2-to-tiff"
      sourceFormat="cr2"
      targetFormat="tiff"
      category="image"
      title="CR2 to TIFF Converter"
    />
  );
}
