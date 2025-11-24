import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WOFF to WOFF2 Converter - Free Online Tool | FlipFileX',
  description: 'Convert WOFF to WOFF2 fonts online for free. Fast, secure, and easy-to-use WOFF to WOFF2 font converter.',
  keywords: ['woff to woff2', 'woff converter', 'woff2 converter', 'font converter', 'convert woff', 'online woff converter'],
  openGraph: {
    title: 'WOFF to WOFF2 Converter - FlipFileX',
    description: 'Convert WOFF to WOFF2 fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/woff-to-woff2',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOFF to WOFF2 Converter',
    description: 'Convert WOFF to WOFF2 fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/woff-to-woff2',
  },
};

export default function WoffToWoff2Page() {
  return (
    <ConverterPage
      slug="woff-to-woff2"
      sourceFormat="woff"
      targetFormat="woff2"
      category="font"
      title="WOFF to WOFF2 Converter"
    />
  );
}
