import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'CR2 to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert CR2 to PNG online for free. Fast, secure, and easy-to-use CR2 to PNG converter with no file size limits.',
  keywords: ['cr2 to png', 'cr2 converter', 'png converter', 'convert cr2', 'online cr2 converter'],
  openGraph: {
    title: 'CR2 to PNG Converter - FlipFileX',
    description: 'Convert CR2 to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/cr2-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CR2 to PNG Converter',
    description: 'Convert CR2 to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/cr2-to-png',
  },
};

export default function Cr2ToPngPage() {
  return (
    <ConverterPage
      slug="cr2-to-png"
      sourceFormat="cr2"
      targetFormat="png"
      category="image"
      title="CR2 to PNG Converter"
    />
  );
}
