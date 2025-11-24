import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'ICO to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert ICO to JPG online for free. Fast, secure, and easy-to-use ICO to JPG converter with no file size limits.',
  keywords: ['ico to jpg', 'ico converter', 'jpg converter', 'convert ico', 'online ico converter'],
  openGraph: {
    title: 'ICO to JPG Converter - FlipFileX',
    description: 'Convert ICO to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/ico-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICO to JPG Converter',
    description: 'Convert ICO to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ico-to-jpg',
  },
};

export default function IcoToJpgPage() {
  return (
    <ConverterPage
      slug="ico-to-jpg"
      sourceFormat="ico"
      targetFormat="jpg"
      category="image"
      title="ICO to JPG Converter"
    />
  );
}
