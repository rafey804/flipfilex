import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'SVG to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert SVG to JPG online for free. Fast, secure, and easy-to-use SVG to JPG converter with no file size limits.',
  keywords: ['svg to jpg', 'svg converter', 'jpg converter', 'convert svg', 'online svg converter'],
  openGraph: {
    title: 'SVG to JPG Converter - FlipFileX',
    description: 'Convert SVG to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/svg-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVG to JPG Converter',
    description: 'Convert SVG to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/svg-to-jpg',
  },
};

export default function SvgToJpgPage() {
  return (
    <ConverterPage
      slug="svg-to-jpg"
      sourceFormat="svg"
      targetFormat="jpg"
      category="image"
      title="SVG to JPG Converter"
    />
  );
}
