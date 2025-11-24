import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'ICO to HEIC Converter - Free Online Tool | FlipFileX',
  description: 'Convert ICO to HEIC online for free. Fast, secure, and easy-to-use ICO to HEIC converter with no file size limits.',
  keywords: ['ico to heic', 'ico converter', 'heic converter', 'convert ico', 'online ico converter'],
  openGraph: {
    title: 'ICO to HEIC Converter - FlipFileX',
    description: 'Convert ICO to HEIC online for free',
    type: 'website',
    url: 'https://flipfilex.com/ico-to-heic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICO to HEIC Converter',
    description: 'Convert ICO to HEIC online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ico-to-heic',
  },
};

export default function IcoToHeicPage() {
  return (
    <ConverterPage
      slug="ico-to-heic"
      sourceFormat="ico"
      targetFormat="heic"
      category="image"
      title="ICO to HEIC Converter"
    />
  );
}
