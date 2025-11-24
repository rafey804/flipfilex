import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'SVG to AVIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert SVG to AVIF online for free. Fast, secure, and easy-to-use SVG to AVIF converter with no file size limits.',
  keywords: ['svg to avif', 'svg converter', 'avif converter', 'convert svg', 'online svg converter'],
  openGraph: {
    title: 'SVG to AVIF Converter - FlipFileX',
    description: 'Convert SVG to AVIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/svg-to-avif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVG to AVIF Converter',
    description: 'Convert SVG to AVIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/svg-to-avif',
  },
};

export default function SvgToAvifPage() {
  return (
    <ConverterPage
      slug="svg-to-avif"
      sourceFormat="svg"
      targetFormat="avif"
      category="image"
      title="SVG to AVIF Converter"
    />
  );
}
