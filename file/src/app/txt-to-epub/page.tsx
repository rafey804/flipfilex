import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TXT to EPUB Converter - Free Online Tool | FlipFileX',
  description: 'Convert TXT to EPUB online for free. Fast, secure, and easy-to-use TXT to EPUB converter with no file size limits.',
  keywords: ['txt to epub', 'txt converter', 'epub converter', 'convert txt', 'online txt converter'],
  openGraph: {
    title: 'TXT to EPUB Converter - FlipFileX',
    description: 'Convert TXT to EPUB online for free',
    type: 'website',
    url: 'https://flipfilex.com/txt-to-epub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TXT to EPUB Converter',
    description: 'Convert TXT to EPUB online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/txt-to-epub',
  },
};

export default function TxtToEpubPage() {
  return (
    <ConverterPage
      slug="txt-to-epub"
      sourceFormat="txt"
      targetFormat="epub"
      category="document"
      title="TXT to EPUB Converter"
    />
  );
}
