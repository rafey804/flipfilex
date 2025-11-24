import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'SVG to GIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert SVG to GIF online for free. Fast, secure, and easy-to-use SVG to GIF converter with no file size limits.',
  keywords: ['svg to gif', 'svg converter', 'gif converter', 'convert svg', 'online svg converter'],
  openGraph: {
    title: 'SVG to GIF Converter - FlipFileX',
    description: 'Convert SVG to GIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/svg-to-gif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVG to GIF Converter',
    description: 'Convert SVG to GIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/svg-to-gif',
  },
};

export default function SvgToGifPage() {
  return (
    <ConverterPage
      slug="svg-to-gif"
      sourceFormat="svg"
      targetFormat="gif"
      category="image"
      title="SVG to GIF Converter"
    />
  );
}
