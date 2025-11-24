import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WOFF2 to TTF Converter - Free Online Tool | FlipFileX',
  description: 'Convert WOFF2 to TTF fonts online for free. Fast, secure, and easy-to-use WOFF2 to TTF font converter.',
  keywords: ['woff2 to ttf', 'woff2 converter', 'ttf converter', 'font converter', 'convert woff2', 'online woff2 converter'],
  openGraph: {
    title: 'WOFF2 to TTF Converter - FlipFileX',
    description: 'Convert WOFF2 to TTF fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/woff2-to-ttf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOFF2 to TTF Converter',
    description: 'Convert WOFF2 to TTF fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/woff2-to-ttf',
  },
};

export default function Woff2ToTtfPage() {
  return (
    <ConverterPage
      slug="woff2-to-ttf"
      sourceFormat="woff2"
      targetFormat="ttf"
      category="font"
      title="WOFF2 to TTF Converter"
    />
  );
}
