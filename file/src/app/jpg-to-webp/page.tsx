import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'JPG to WebP Converter - Free Online Tool | FlipFileX',
  description: 'Convert JPG to WEBP online for free. Fast, secure, and easy-to-use JPG to WEBP converter with no file size limits.',
  keywords: ['jpg to webp', 'jpg converter', 'webp converter', 'convert jpg', 'online jpg converter'],
  openGraph: {
    title: 'JPG to WebP Converter - FlipFileX',
    description: 'Convert JPG to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/jpg-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to WebP Converter',
    description: 'Convert JPG to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/jpg-to-webp',
  },
};

export default function JpgToWebpPage() {
  return (
    <ConverterPage
      slug="jpg-to-webp"
      sourceFormat="jpg"
      targetFormat="webp"
      category="image"
      title="JPG to WebP Converter"
    />
  );
}
