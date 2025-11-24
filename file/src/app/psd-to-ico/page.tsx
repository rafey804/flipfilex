import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PSD to ICO Converter - Free Online Tool | FlipFileX',
  description: 'Convert PSD to ICO online for free. Fast, secure, and easy-to-use PSD to ICO converter with no file size limits.',
  keywords: ['psd to ico', 'psd converter', 'ico converter', 'convert psd', 'online psd converter'],
  openGraph: {
    title: 'PSD to ICO Converter - FlipFileX',
    description: 'Convert PSD to ICO online for free',
    type: 'website',
    url: 'https://flipfilex.com/psd-to-ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSD to ICO Converter',
    description: 'Convert PSD to ICO online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/psd-to-ico',
  },
};

export default function PsdToIcoPage() {
  return (
    <ConverterPage
      slug="psd-to-ico"
      sourceFormat="psd"
      targetFormat="ico"
      category="image"
      title="PSD to ICO Converter"
    />
  );
}
