import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'MOBI to EPUB Converter - Free Online Tool | FlipFileX',
  description: 'Convert MOBI to EPUB online for free. Fast, secure, and easy-to-use MOBI to EPUB converter with no file size limits.',
  keywords: ['mobi to epub', 'mobi converter', 'epub converter', 'convert mobi', 'online mobi converter'],
  openGraph: {
    title: 'MOBI to EPUB Converter - FlipFileX',
    description: 'Convert MOBI to EPUB online for free',
    type: 'website',
    url: 'https://flipfilex.com/mobi-to-epub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOBI to EPUB Converter',
    description: 'Convert MOBI to EPUB online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/mobi-to-epub',
  },
};

export default function MobiToEpubPage() {
  return (
    <ConverterPage
      slug="mobi-to-epub"
      sourceFormat="mobi"
      targetFormat="epub"
      category="document"
      title="MOBI to EPUB Converter"
    />
  );
}
