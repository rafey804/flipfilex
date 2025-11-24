import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PSD to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert PSD to PNG online for free. Fast, secure, and easy-to-use PSD to PNG converter with no file size limits.',
  keywords: ['psd to png', 'psd converter', 'png converter', 'convert psd', 'online psd converter'],
  openGraph: {
    title: 'PSD to PNG Converter - FlipFileX',
    description: 'Convert PSD to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/psd-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSD to PNG Converter',
    description: 'Convert PSD to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/psd-to-png',
  },
};

export default function PsdToPngPage() {
  return (
    <ConverterPage
      slug="psd-to-png"
      sourceFormat="psd"
      targetFormat="png"
      category="image"
      title="PSD to PNG Converter"
    />
  );
}
