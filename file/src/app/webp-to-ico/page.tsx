import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WEBP to ICO Converter - Free Online Tool | FlipFileX',
  description: 'Convert WEBP to ICO online for free. Fast, secure, and easy-to-use WEBP to ICO converter with no file size limits.',
  keywords: ['webp to ico', 'webp converter', 'ico converter', 'convert webp', 'online webp converter'],
  openGraph: {
    title: 'WEBP to ICO Converter - FlipFileX',
    description: 'Convert WEBP to ICO online for free',
    type: 'website',
    url: 'https://flipfilex.com/webp-to-ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WEBP to ICO Converter',
    description: 'Convert WEBP to ICO online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/webp-to-ico',
  },
};

export default function WebpToIcoPage() {
  return (
    <ConverterPage
      slug="webp-to-ico"
      sourceFormat="webp"
      targetFormat="ico"
      category="image"
      title="WEBP to ICO Converter"
    />
  );
}
