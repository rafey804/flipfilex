import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'ICO to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert ICO to PNG online for free. Fast, secure, and easy-to-use ICO to PNG converter with no file size limits.',
  keywords: ['ico to png', 'ico converter', 'png converter', 'convert ico', 'online ico converter'],
  openGraph: {
    title: 'ICO to PNG Converter - FlipFileX',
    description: 'Convert ICO to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/ico-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICO to PNG Converter',
    description: 'Convert ICO to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ico-to-png',
  },
};

export default function IcoToPngPage() {
  return (
    <ConverterPage
      slug="ico-to-png"
      sourceFormat="ico"
      targetFormat="png"
      category="image"
      title="ICO to PNG Converter"
    />
  );
}
