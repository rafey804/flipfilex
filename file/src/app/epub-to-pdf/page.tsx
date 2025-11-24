import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'EPUB to PDF Converter - Free Online Tool | FlipFileX',
  description: 'Convert EPUB to PDF online for free. Fast, secure, and easy-to-use EPUB to PDF converter with no file size limits.',
  keywords: ['epub to pdf', 'epub converter', 'pdf converter', 'convert epub', 'online epub converter'],
  openGraph: {
    title: 'EPUB to PDF Converter - FlipFileX',
    description: 'Convert EPUB to PDF online for free',
    type: 'website',
    url: 'https://flipfilex.com/epub-to-pdf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EPUB to PDF Converter',
    description: 'Convert EPUB to PDF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/epub-to-pdf',
  },
};

export default function EpubToPdfPage() {
  return (
    <ConverterPage
      slug="epub-to-pdf"
      sourceFormat="epub"
      targetFormat="pdf"
      category="document"
      title="EPUB to PDF Converter"
    />
  );
}
