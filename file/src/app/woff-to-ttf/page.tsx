import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WOFF to TTF Converter - Free Online Tool | FlipFileX',
  description: 'Convert WOFF to TTF online for free. Fast, secure, and easy-to-use WOFF to TTF converter with no file size limits.',
  keywords: ['woff to ttf', 'woff converter', 'ttf converter', 'convert woff', 'online woff converter'],
  openGraph: {
    title: 'WOFF to TTF Converter - FlipFileX',
    description: 'Convert WOFF to TTF online for free',
    type: 'website',
    url: 'https://flipfilex.com/woff-to-ttf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOFF to TTF Converter',
    description: 'Convert WOFF to TTF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/woff-to-ttf',
  },
};

export default function WoffToTtfPage() {
  return (
    <ConverterPage
      slug="woff-to-ttf"
      sourceFormat="woff"
      targetFormat="ttf"
      category="font"
      title="WOFF to TTF Converter"
    />
  );
}
