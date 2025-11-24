import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WOFF to OTF Converter - Free Online Tool | FlipFileX',
  description: 'Convert WOFF to OTF fonts online for free. Fast, secure, and easy-to-use WOFF to OTF font converter.',
  keywords: ['woff to otf', 'woff converter', 'otf converter', 'font converter', 'convert woff', 'online woff converter'],
  openGraph: {
    title: 'WOFF to OTF Converter - FlipFileX',
    description: 'Convert WOFF to OTF fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/woff-to-otf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOFF to OTF Converter',
    description: 'Convert WOFF to OTF fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/woff-to-otf',
  },
};

export default function WoffToOtfPage() {
  return (
    <ConverterPage
      slug="woff-to-otf"
      sourceFormat="woff"
      targetFormat="otf"
      category="font"
      title="WOFF to OTF Converter"
    />
  );
}
