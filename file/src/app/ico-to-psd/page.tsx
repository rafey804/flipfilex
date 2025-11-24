import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'ICO to PSD Converter - Free Online Tool | FlipFileX',
  description: 'Convert ICO to PSD online for free. Fast, secure, and easy-to-use ICO to PSD converter with no file size limits.',
  keywords: ['ico to psd', 'ico converter', 'psd converter', 'convert ico', 'online ico converter'],
  openGraph: {
    title: 'ICO to PSD Converter - FlipFileX',
    description: 'Convert ICO to PSD online for free',
    type: 'website',
    url: 'https://flipfilex.com/ico-to-psd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICO to PSD Converter',
    description: 'Convert ICO to PSD online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ico-to-psd',
  },
};

export default function IcoToPsdPage() {
  return (
    <ConverterPage
      slug="ico-to-psd"
      sourceFormat="ico"
      targetFormat="psd"
      category="image"
      title="ICO to PSD Converter"
    />
  );
}
