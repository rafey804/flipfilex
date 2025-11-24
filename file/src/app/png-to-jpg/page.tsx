import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PNG to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert PNG to JPG online for free. Fast, secure, and easy-to-use PNG to JPG converter with no file size limits.',
  keywords: ['png to jpg', 'png converter', 'jpg converter', 'convert png', 'online png converter'],
  openGraph: {
    title: 'PNG to JPG Converter - FlipFileX',
    description: 'Convert PNG to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/png-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNG to JPG Converter',
    description: 'Convert PNG to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/png-to-jpg',
  },
};

export default function PngToJpgPage() {
  return (
    <ConverterPage
      slug="png-to-jpg"
      sourceFormat="png"
      targetFormat="jpg"
      category="image"
      title="PNG to JPG Converter"
    />
  );
}
