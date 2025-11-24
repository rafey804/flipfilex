import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'SVG to HEIC Converter - Free Online Tool | FlipFileX',
  description: 'Convert SVG to HEIC online for free. Fast, secure, and easy-to-use SVG to HEIC converter with no file size limits.',
  keywords: ['svg to heic', 'svg converter', 'heic converter', 'convert svg', 'online svg converter'],
  openGraph: {
    title: 'SVG to HEIC Converter - FlipFileX',
    description: 'Convert SVG to HEIC online for free',
    type: 'website',
    url: 'https://flipfilex.com/svg-to-heic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVG to HEIC Converter',
    description: 'Convert SVG to HEIC online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/svg-to-heic',
  },
};

export default function SvgToHeicPage() {
  return (
    <ConverterPage
      slug="svg-to-heic"
      sourceFormat="svg"
      targetFormat="heic"
      category="image"
      title="SVG to HEIC Converter"
    />
  );
}
