import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'AVIF to PSD Converter - Free Online Tool | FlipFileX',
  description: 'Convert AVIF to PSD online for free. Fast, secure, and easy-to-use AVIF to PSD converter with no file size limits.',
  keywords: ['avif to psd', 'avif converter', 'psd converter', 'convert avif', 'online avif converter'],
  openGraph: {
    title: 'AVIF to PSD Converter - FlipFileX',
    description: 'Convert AVIF to PSD online for free',
    type: 'website',
    url: 'https://flipfilex.com/avif-to-psd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVIF to PSD Converter',
    description: 'Convert AVIF to PSD online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/avif-to-psd',
  },
};

export default function AvifToPsdPage() {
  return (
    <ConverterPage
      slug="avif-to-psd"
      sourceFormat="avif"
      targetFormat="psd"
      category="image"
      title="AVIF to PSD Converter"
    />
  );
}
