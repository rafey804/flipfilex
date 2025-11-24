import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PSD to SVG Converter - Free Online Tool | FlipFileX',
  description: 'Convert PSD to SVG online for free. Fast, secure, and easy-to-use PSD to SVG converter with no file size limits.',
  keywords: ['psd to svg', 'psd converter', 'svg converter', 'convert psd', 'online psd converter'],
  openGraph: {
    title: 'PSD to SVG Converter - FlipFileX',
    description: 'Convert PSD to SVG online for free',
    type: 'website',
    url: 'https://flipfilex.com/psd-to-svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSD to SVG Converter',
    description: 'Convert PSD to SVG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/psd-to-svg',
  },
};

export default function PsdToSvgPage() {
  return (
    <ConverterPage
      slug="psd-to-svg"
      sourceFormat="psd"
      targetFormat="svg"
      category="image"
      title="PSD to SVG Converter"
    />
  );
}
