import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'HEIC to ICO Converter - Free Online Tool | FlipFileX',
  description: 'Convert HEIC to ICO online for free. Fast, secure, and easy-to-use HEIC to ICO converter with no file size limits.',
  keywords: ['heic to ico', 'heic converter', 'ico converter', 'convert heic', 'online heic converter'],
  openGraph: {
    title: 'HEIC to ICO Converter - FlipFileX',
    description: 'Convert HEIC to ICO online for free',
    type: 'website',
    url: 'https://flipfilex.com/heic-to-ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEIC to ICO Converter',
    description: 'Convert HEIC to ICO online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/heic-to-ico',
  },
};

export default function HeicToIcoPage() {
  return (
    <ConverterPage
      slug="heic-to-ico"
      sourceFormat="heic"
      targetFormat="ico"
      category="image"
      title="HEIC to ICO Converter"
    />
  );
}
