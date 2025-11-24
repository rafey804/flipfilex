import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'NEF to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert NEF to PNG online for free. Fast, secure, and easy-to-use NEF to PNG converter with no file size limits.',
  keywords: ['nef to png', 'nef converter', 'png converter', 'convert nef', 'online nef converter'],
  openGraph: {
    title: 'NEF to PNG Converter - FlipFileX',
    description: 'Convert NEF to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/nef-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEF to PNG Converter',
    description: 'Convert NEF to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/nef-to-png',
  },
};

export default function NefToPngPage() {
  return (
    <ConverterPage
      slug="nef-to-png"
      sourceFormat="nef"
      targetFormat="png"
      category="image"
      title="NEF to PNG Converter"
    />
  );
}
