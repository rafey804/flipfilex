import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'JPG to HEIC Converter - Free Online Tool | FlipFileX',
  description: 'Convert JPG to HEIC online for free. Fast, secure, and easy-to-use JPG to HEIC converter with no file size limits.',
  keywords: ['jpg to heic', 'jpg converter', 'heic converter', 'convert jpg', 'online jpg converter'],
  openGraph: {
    title: 'JPG to HEIC Converter - FlipFileX',
    description: 'Convert JPG to HEIC online for free',
    type: 'website',
    url: 'https://flipfilex.com/jpg-to-heic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to HEIC Converter',
    description: 'Convert JPG to HEIC online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/jpg-to-heic',
  },
};

export default function JpgToHeicPage() {
  return (
    <ConverterPage
      slug="jpg-to-heic"
      sourceFormat="jpg"
      targetFormat="heic"
      category="image"
      title="JPG to HEIC Converter"
    />
  );
}
