import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TTF to WOFF2 Converter - Free Online Tool | FlipFileX',
  description: 'Convert TTF to WOFF2 online for free. Fast, secure, and easy-to-use TTF to WOFF2 converter with no file size limits.',
  keywords: ['ttf to woff2', 'ttf converter', 'woff2 converter', 'convert ttf', 'online ttf converter'],
  openGraph: {
    title: 'TTF to WOFF2 Converter - FlipFileX',
    description: 'Convert TTF to WOFF2 online for free',
    type: 'website',
    url: 'https://flipfilex.com/ttf-to-woff2',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TTF to WOFF2 Converter',
    description: 'Convert TTF to WOFF2 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ttf-to-woff2',
  },
};

export default function TtfToWoff2Page() {
  return (
    <ConverterPage
      slug="ttf-to-woff2"
      sourceFormat="ttf"
      targetFormat="woff2"
      category="font"
      title="TTF to WOFF2 Converter"
    />
  );
}
