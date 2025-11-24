import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'JPG to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert JPG to PNG online for free. Fast, secure, and easy-to-use JPG to PNG converter with no file size limits.',
  keywords: ['jpg to png', 'jpg converter', 'png converter', 'convert jpg', 'online jpg converter'],
  openGraph: {
    title: 'JPG to PNG Converter - FlipFileX',
    description: 'Convert JPG to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/jpg-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to PNG Converter',
    description: 'Convert JPG to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/jpg-to-png',
  },
};

export default function JpgToPngPage() {
  return (
    <ConverterPage
      slug="jpg-to-png"
      sourceFormat="jpg"
      targetFormat="png"
      category="image"
      title="JPG to PNG Converter"
    />
  );
}
