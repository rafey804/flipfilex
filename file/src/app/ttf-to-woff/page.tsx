import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TTF to WOFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert TTF to WOFF online for free. Fast, secure, and easy-to-use TTF to WOFF converter with no file size limits.',
  keywords: ['ttf to woff', 'ttf converter', 'woff converter', 'convert ttf', 'online ttf converter'],
  openGraph: {
    title: 'TTF to WOFF Converter - FlipFileX',
    description: 'Convert TTF to WOFF online for free',
    type: 'website',
    url: 'https://flipfilex.com/ttf-to-woff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TTF to WOFF Converter',
    description: 'Convert TTF to WOFF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ttf-to-woff',
  },
};

export default function TtfToWoffPage() {
  return (
    <ConverterPage
      slug="ttf-to-woff"
      sourceFormat="ttf"
      targetFormat="woff"
      category="font"
      title="TTF to WOFF Converter"
    />
  );
}
