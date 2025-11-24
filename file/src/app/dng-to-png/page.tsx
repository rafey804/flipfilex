import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'DNG to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert DNG to PNG online for free. Fast, secure, and easy-to-use DNG to PNG converter with no file size limits.',
  keywords: ['dng to png', 'dng converter', 'png converter', 'convert dng', 'online dng converter'],
  openGraph: {
    title: 'DNG to PNG Converter - FlipFileX',
    description: 'Convert DNG to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/dng-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DNG to PNG Converter',
    description: 'Convert DNG to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/dng-to-png',
  },
};

export default function DngToPngPage() {
  return (
    <ConverterPage
      slug="dng-to-png"
      sourceFormat="dng"
      targetFormat="png"
      category="image"
      title="DNG to PNG Converter"
    />
  );
}
