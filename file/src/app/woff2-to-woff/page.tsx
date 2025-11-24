import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WOFF2 to WOFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert WOFF2 to WOFF fonts online for free. Fast, secure, and easy-to-use WOFF2 to WOFF font converter.',
  keywords: ['woff2 to woff', 'woff2 converter', 'woff converter', 'font converter', 'convert woff2', 'online woff2 converter'],
  openGraph: {
    title: 'WOFF2 to WOFF Converter - FlipFileX',
    description: 'Convert WOFF2 to WOFF fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/woff2-to-woff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOFF2 to WOFF Converter',
    description: 'Convert WOFF2 to WOFF fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/woff2-to-woff',
  },
};

export default function Woff2ToWoffPage() {
  return (
    <ConverterPage
      slug="woff2-to-woff"
      sourceFormat="woff2"
      targetFormat="woff"
      category="font"
      title="WOFF2 to WOFF Converter"
    />
  );
}
