import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PSD to GIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert PSD to GIF online for free. Fast, secure, and easy-to-use PSD to GIF converter with no file size limits.',
  keywords: ['psd to gif', 'psd converter', 'gif converter', 'convert psd', 'online psd converter'],
  openGraph: {
    title: 'PSD to GIF Converter - FlipFileX',
    description: 'Convert PSD to GIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/psd-to-gif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSD to GIF Converter',
    description: 'Convert PSD to GIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/psd-to-gif',
  },
};

export default function PsdToGifPage() {
  return (
    <ConverterPage
      slug="psd-to-gif"
      sourceFormat="psd"
      targetFormat="gif"
      category="image"
      title="PSD to GIF Converter"
    />
  );
}
