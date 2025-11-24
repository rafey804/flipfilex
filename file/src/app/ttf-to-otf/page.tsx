import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TTF to OTF Converter - Free Online Tool | FlipFileX',
  description: 'Convert TTF to OTF fonts online for free. Fast, secure, and easy-to-use TTF to OTF font converter.',
  keywords: ['ttf to otf', 'ttf converter', 'otf converter', 'font converter', 'convert ttf', 'online ttf converter'],
  openGraph: {
    title: 'TTF to OTF Converter - FlipFileX',
    description: 'Convert TTF to OTF fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/ttf-to-otf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TTF to OTF Converter',
    description: 'Convert TTF to OTF fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ttf-to-otf',
  },
};

export default function TtfToOtfPage() {
  return (
    <ConverterPage
      slug="ttf-to-otf"
      sourceFormat="ttf"
      targetFormat="otf"
      category="font"
      title="TTF to OTF Converter"
    />
  );
}
