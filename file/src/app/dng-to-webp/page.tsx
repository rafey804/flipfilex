import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'DNG to WEBP Converter - Free Online Tool | FlipFileX',
  description: 'Convert DNG to WEBP online for free. Fast, secure, and easy-to-use DNG to WEBP converter with no file size limits.',
  keywords: ['dng to webp', 'dng converter', 'webp converter', 'convert dng', 'online dng converter'],
  openGraph: {
    title: 'DNG to WEBP Converter - FlipFileX',
    description: 'Convert DNG to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/dng-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DNG to WEBP Converter',
    description: 'Convert DNG to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/dng-to-webp',
  },
};

export default function DngToWebpPage() {
  return (
    <ConverterPage
      slug="dng-to-webp"
      sourceFormat="dng"
      targetFormat="webp"
      category="image"
      title="DNG to WEBP Converter"
    />
  );
}
