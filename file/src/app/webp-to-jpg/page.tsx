import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WebP to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert WEBP to JPG online for free. Fast, secure, and easy-to-use WEBP to JPG converter with no file size limits.',
  keywords: ['webp to jpg', 'webp converter', 'jpg converter', 'convert webp', 'online webp converter'],
  openGraph: {
    title: 'WebP to JPG Converter - FlipFileX',
    description: 'Convert WEBP to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/webp-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebP to JPG Converter',
    description: 'Convert WEBP to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/webp-to-jpg',
  },
};

export default function WebpToJpgPage() {
  return (
    <ConverterPage
      slug="webp-to-jpg"
      sourceFormat="webp"
      targetFormat="jpg"
      category="image"
      title="WebP to JPG Converter"
    />
  );
}
