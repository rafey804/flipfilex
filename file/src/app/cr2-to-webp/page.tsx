import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'CR2 to WEBP Converter - Free Online Tool | FlipFileX',
  description: 'Convert CR2 to WEBP online for free. Fast, secure, and easy-to-use CR2 to WEBP converter with no file size limits.',
  keywords: ['cr2 to webp', 'cr2 converter', 'webp converter', 'convert cr2', 'online cr2 converter'],
  openGraph: {
    title: 'CR2 to WEBP Converter - FlipFileX',
    description: 'Convert CR2 to WEBP online for free',
    type: 'website',
    url: 'https://flipfilex.com/cr2-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CR2 to WEBP Converter',
    description: 'Convert CR2 to WEBP online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/cr2-to-webp',
  },
};

export default function Cr2ToWebpPage() {
  return (
    <ConverterPage
      slug="cr2-to-webp"
      sourceFormat="cr2"
      targetFormat="webp"
      category="image"
      title="CR2 to WEBP Converter"
    />
  );
}
