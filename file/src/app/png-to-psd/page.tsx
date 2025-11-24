import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PNG to PSD Converter - Free Online Tool | FlipFileX',
  description: 'Convert PNG to PSD online for free. Fast, secure, and easy-to-use PNG to PSD converter with no file size limits.',
  keywords: ['png to psd', 'png converter', 'psd converter', 'convert png', 'online png converter'],
  openGraph: {
    title: 'PNG to PSD Converter - FlipFileX',
    description: 'Convert PNG to PSD online for free',
    type: 'website',
    url: 'https://flipfilex.com/png-to-psd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNG to PSD Converter',
    description: 'Convert PNG to PSD online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/png-to-psd',
  },
};

export default function PngToPsdPage() {
  return (
    <ConverterPage
      slug="png-to-psd"
      sourceFormat="png"
      targetFormat="psd"
      category="image"
      title="PNG to PSD Converter"
    />
  );
}
