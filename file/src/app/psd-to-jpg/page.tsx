import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PSD to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert PSD to JPG online for free. Fast, secure, and easy-to-use PSD to JPG converter with no file size limits.',
  keywords: ['psd to jpg', 'psd converter', 'jpg converter', 'convert psd', 'online psd converter'],
  openGraph: {
    title: 'PSD to JPG Converter - FlipFileX',
    description: 'Convert PSD to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/psd-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSD to JPG Converter',
    description: 'Convert PSD to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/psd-to-jpg',
  },
};

export default function PsdToJpgPage() {
  return (
    <ConverterPage
      slug="psd-to-jpg"
      sourceFormat="psd"
      targetFormat="jpg"
      category="image"
      title="PSD to JPG Converter"
    />
  );
}
