import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'OTF to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert OTF to SVG fonts online for free. Fast, secure, and easy-to-use OTF to SVG font converter.',
  keywords: ['otf to svg', 'otf converter', 'svg converter', 'font converter', 'convert otf', 'online otf converter'],
  openGraph: {
    title: 'OTF to SVG Converter - FlipFileX',
    description: 'Convert OTF to SVG fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/otf-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OTF to SVG Converter',
    description: 'Convert OTF to SVG fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/otf-to-svg',
  },
};

export default function OtfToSvgPage() {
  return (
    <ConverterPage
      slug="otf-to-svg"
      sourceFormat="otf"
      targetFormat="svg"
      category="font"
      title="OTF to SVG Converter"
    />
  );
}
