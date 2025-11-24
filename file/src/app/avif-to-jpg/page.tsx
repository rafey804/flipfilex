import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'AVIF to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert AVIF to JPG online for free. Fast, secure, and easy-to-use AVIF to JPG converter with no file size limits.',
  keywords: ['avif to jpg', 'avif converter', 'jpg converter', 'convert avif', 'online avif converter'],
  openGraph: {
    title: 'AVIF to JPG Converter - FlipFileX',
    description: 'Convert AVIF to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/avif-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVIF to JPG Converter',
    description: 'Convert AVIF to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/avif-to-jpg',
  },
};

export default function AvifToJpgPage() {
  return (
    <ConverterPage
      slug="avif-to-jpg"
      sourceFormat="avif"
      targetFormat="jpg"
      category="image"
      title="AVIF to JPG Converter"
    />
  );
}
