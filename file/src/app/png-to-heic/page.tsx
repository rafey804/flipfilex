import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PNG to HEIC Converter - Free Online Tool | FlipFileX',
  description: 'Convert PNG to HEIC online for free. Fast, secure, and easy-to-use PNG to HEIC converter with no file size limits.',
  keywords: ['png to heic', 'png converter', 'heic converter', 'convert png', 'online png converter'],
  openGraph: {
    title: 'PNG to HEIC Converter - FlipFileX',
    description: 'Convert PNG to HEIC online for free',
    type: 'website',
    url: 'https://flipfilex.com/png-to-heic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNG to HEIC Converter',
    description: 'Convert PNG to HEIC online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/png-to-heic',
  },
};

export default function PngToHeicPage() {
  return (
    <ConverterPage
      slug="png-to-heic"
      sourceFormat="png"
      targetFormat="heic"
      category="image"
      title="PNG to HEIC Converter"
    />
  );
}
