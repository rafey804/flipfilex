import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'SVG to ICO Converter - Free Online Tool | FlipFileX',
  description: 'Convert SVG to ICO online for free. Fast, secure, and easy-to-use SVG to ICO converter with no file size limits.',
  keywords: ['svg to ico', 'svg converter', 'ico converter', 'convert svg', 'online svg converter'],
  openGraph: {
    title: 'SVG to ICO Converter - FlipFileX',
    description: 'Convert SVG to ICO online for free',
    type: 'website',
    url: 'https://flipfilex.com/svg-to-ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVG to ICO Converter',
    description: 'Convert SVG to ICO online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/svg-to-ico',
  },
};

export default function SvgToIcoPage() {
  return (
    <ConverterPage
      slug="svg-to-ico"
      sourceFormat="svg"
      targetFormat="ico"
      category="image"
      title="SVG to ICO Converter"
    />
  );
}
