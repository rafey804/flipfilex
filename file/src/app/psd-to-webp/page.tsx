import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PSD to WEBP Converter - Free Online Tool | FlipFileX',
  description: 'Convert PSD to WEBP online for free. Fast, secure, and easy-to-use PSD to WEBP converter with no file size limits.',
  keywords: ['psd to webp', 'psd converter', 'webp converter', 'convert psd', 'online psd converter'],
  openGraph: {
    title: 'PSD to WEBP Converter - FlipFileX',
    description: 'Convert PSD to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/psd-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSD to WEBP Converter',
    description: 'Convert PSD to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/psd-to-webp',
  },
};

export default function PsdToWebpPage() {
  return (
    <ConverterPage
      slug="psd-to-webp"
      sourceFormat="psd"
      targetFormat="webp"
      category="image"
      title="PSD to WEBP Converter"
    />
  );
}
