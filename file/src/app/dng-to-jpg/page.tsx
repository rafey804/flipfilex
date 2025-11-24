import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'DNG to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert DNG to JPG online for free. Fast, secure, and easy-to-use DNG to JPG converter with no file size limits.',
  keywords: ['dng to jpg', 'dng converter', 'jpg converter', 'convert dng', 'online dng converter'],
  openGraph: {
    title: 'DNG to JPG Converter - FlipFileX',
    description: 'Convert DNG to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/dng-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DNG to JPG Converter',
    description: 'Convert DNG to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/dng-to-jpg',
  },
};

export default function DngToJpgPage() {
  return (
    <ConverterPage
      slug="dng-to-jpg"
      sourceFormat="dng"
      targetFormat="jpg"
      category="image"
      title="DNG to JPG Converter"
    />
  );
}
