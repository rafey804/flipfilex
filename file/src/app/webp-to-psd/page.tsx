import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WEBP to PSD Converter - Free Online Tool | FlipFileX',
  description: 'Convert WEBP to PSD online for free. Fast, secure, and easy-to-use WEBP to PSD converter with no file size limits.',
  keywords: ['webp to psd', 'webp converter', 'psd converter', 'convert webp', 'online webp converter'],
  openGraph: {
    title: 'WEBP to PSD Converter - FlipFileX',
    description: 'Convert WEBP to PSD online for free',
    type: 'website',
    url: 'https://flipfilex.com/webp-to-psd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WEBP to PSD Converter',
    description: 'Convert WEBP to PSD online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/webp-to-psd',
  },
};

export default function WebpToPsdPage() {
  return (
    <ConverterPage
      slug="webp-to-psd"
      sourceFormat="webp"
      targetFormat="psd"
      category="image"
      title="WEBP to PSD Converter"
    />
  );
}
