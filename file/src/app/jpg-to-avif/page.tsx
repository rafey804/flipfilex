import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'JPG to AVIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert JPG to AVIF online for free. Fast, secure, and easy-to-use JPG to AVIF converter with no file size limits.',
  keywords: ['jpg to avif', 'jpg converter', 'avif converter', 'convert jpg', 'online jpg converter'],
  openGraph: {
    title: 'JPG to AVIF Converter - FlipFileX',
    description: 'Convert JPG to AVIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/jpg-to-avif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to AVIF Converter',
    description: 'Convert JPG to AVIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/jpg-to-avif',
  },
};

export default function JpgToAvifPage() {
  return (
    <ConverterPage
      slug="jpg-to-avif"
      sourceFormat="jpg"
      targetFormat="avif"
      category="image"
      title="JPG to AVIF Converter"
    />
  );
}
