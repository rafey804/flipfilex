import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'SVG to PSD Converter - Free Online Tool | FlipFileX',
  description: 'Convert SVG to PSD online for free. Fast, secure, and easy-to-use SVG to PSD converter with no file size limits.',
  keywords: ['svg to psd', 'svg converter', 'psd converter', 'convert svg', 'online svg converter'],
  openGraph: {
    title: 'SVG to PSD Converter - FlipFileX',
    description: 'Convert SVG to PSD online for free',
    type: 'website',
    url: 'https://flipfilex.com/svg-to-psd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVG to PSD Converter',
    description: 'Convert SVG to PSD online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/svg-to-psd',
  },
};

export default function SvgToPsdPage() {
  return (
    <ConverterPage
      slug="svg-to-psd"
      sourceFormat="svg"
      targetFormat="psd"
      category="image"
      title="SVG to PSD Converter"
    />
  );
}
