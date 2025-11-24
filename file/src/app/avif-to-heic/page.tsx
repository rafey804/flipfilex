import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'AVIF to HEIC Converter - Free Online Tool | FlipFileX',
  description: 'Convert AVIF to HEIC online for free. Fast, secure, and easy-to-use AVIF to HEIC converter with no file size limits.',
  keywords: ['avif to heic', 'avif converter', 'heic converter', 'convert avif', 'online avif converter'],
  openGraph: {
    title: 'AVIF to HEIC Converter - FlipFileX',
    description: 'Convert AVIF to HEIC online for free',
    type: 'website',
    url: 'https://flipfilex.com/avif-to-heic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVIF to HEIC Converter',
    description: 'Convert AVIF to HEIC online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/avif-to-heic',
  },
};

export default function AvifToHeicPage() {
  return (
    <ConverterPage
      slug="avif-to-heic"
      sourceFormat="avif"
      targetFormat="heic"
      category="image"
      title="AVIF to HEIC Converter"
    />
  );
}
