import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TTF to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert TTF to SVG fonts online for free. Fast, secure, and easy-to-use TTF to SVG font converter.',
  keywords: ['ttf to svg', 'ttf converter', 'svg converter', 'font converter', 'convert ttf', 'online ttf converter'],
  openGraph: {
    title: 'TTF to SVG Converter - FlipFileX',
    description: 'Convert TTF to SVG fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/ttf-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TTF to SVG Converter',
    description: 'Convert TTF to SVG fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ttf-to-svg',
  },
};

export default function TtfToSvgPage() {
  return (
    <ConverterPage
      slug="ttf-to-svg"
      sourceFormat="ttf"
      targetFormat="svg"
      category="font"
      title="TTF to SVG Converter"
    />
  );
}
