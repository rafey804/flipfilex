import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WEBP to HEIC Converter - Free Online Tool | FlipFileX',
  description: 'Convert WEBP to HEIC online for free. Fast, secure, and easy-to-use WEBP to HEIC converter with no file size limits.',
  keywords: ['webp to heic', 'webp converter', 'heic converter', 'convert webp', 'online webp converter'],
  openGraph: {
    title: 'WEBP to HEIC Converter - FlipFileX',
    description: 'Convert WEBP to HEIC online for free',
    type: 'website',
    url: 'https://flipfilex.com/webp-to-heic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WEBP to HEIC Converter',
    description: 'Convert WEBP to HEIC online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/webp-to-heic',
  },
};

export default function WebpToHeicPage() {
  return (
    <ConverterPage
      slug="webp-to-heic"
      sourceFormat="webp"
      targetFormat="heic"
      category="image"
      title="WEBP to HEIC Converter"
    />
  );
}
