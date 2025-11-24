import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PSD to HEIC Converter - Free Online Tool | FlipFileX',
  description: 'Convert PSD to HEIC online for free. Fast, secure, and easy-to-use PSD to HEIC converter with no file size limits.',
  keywords: ['psd to heic', 'psd converter', 'heic converter', 'convert psd', 'online psd converter'],
  openGraph: {
    title: 'PSD to HEIC Converter - FlipFileX',
    description: 'Convert PSD to HEIC online for free',
    type: 'website',
    url: 'https://flipfilex.com/psd-to-heic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSD to HEIC Converter',
    description: 'Convert PSD to HEIC online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/psd-to-heic',
  },
};

export default function PsdToHeicPage() {
  return (
    <ConverterPage
      slug="psd-to-heic"
      sourceFormat="psd"
      targetFormat="heic"
      category="image"
      title="PSD to HEIC Converter"
    />
  );
}
