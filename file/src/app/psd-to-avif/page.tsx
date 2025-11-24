import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PSD to AVIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert PSD to AVIF online for free. Fast, secure, and easy-to-use PSD to AVIF converter with no file size limits.',
  keywords: ['psd to avif', 'psd converter', 'avif converter', 'convert psd', 'online psd converter'],
  openGraph: {
    title: 'PSD to AVIF Converter - FlipFileX',
    description: 'Convert PSD to AVIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/psd-to-avif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSD to AVIF Converter',
    description: 'Convert PSD to AVIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/psd-to-avif',
  },
};

export default function PsdToAvifPage() {
  return (
    <ConverterPage
      slug="psd-to-avif"
      sourceFormat="psd"
      targetFormat="avif"
      category="image"
      title="PSD to AVIF Converter"
    />
  );
}
