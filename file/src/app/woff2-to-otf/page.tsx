import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WOFF2 to OTF Converter - Free Online Tool | FlipFileX',
  description: 'Convert WOFF2 to OTF fonts online for free. Fast, secure, and easy-to-use WOFF2 to OTF font converter.',
  keywords: ['woff2 to otf', 'woff2 converter', 'otf converter', 'font converter', 'convert woff2', 'online woff2 converter'],
  openGraph: {
    title: 'WOFF2 to OTF Converter - FlipFileX',
    description: 'Convert WOFF2 to OTF fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/woff2-to-otf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOFF2 to OTF Converter',
    description: 'Convert WOFF2 to OTF fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/woff2-to-otf',
  },
};

export default function Woff2ToOtfPage() {
  return (
    <ConverterPage
      slug="woff2-to-otf"
      sourceFormat="woff2"
      targetFormat="otf"
      category="font"
      title="WOFF2 to OTF Converter"
    />
  );
}
