import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'NEF to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert NEF to JPG online for free. Fast, secure, and easy-to-use NEF to JPG converter with no file size limits.',
  keywords: ['nef to jpg', 'nef converter', 'jpg converter', 'convert nef', 'online nef converter'],
  openGraph: {
    title: 'NEF to JPG Converter - FlipFileX',
    description: 'Convert NEF to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/nef-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEF to JPG Converter',
    description: 'Convert NEF to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/nef-to-jpg',
  },
};

export default function NefToJpgPage() {
  return (
    <ConverterPage
      slug="nef-to-jpg"
      sourceFormat="nef"
      targetFormat="jpg"
      category="image"
      title="NEF to JPG Converter"
    />
  );
}
