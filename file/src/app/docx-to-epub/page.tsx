import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'DOCX to EPUB Converter - Free Online Tool | FlipFileX',
  description: 'Convert DOCX to EPUB online for free. Fast, secure, and easy-to-use DOCX to EPUB converter with no file size limits.',
  keywords: ['docx to epub', 'docx converter', 'epub converter', 'convert docx', 'online docx converter'],
  openGraph: {
    title: 'DOCX to EPUB Converter - FlipFileX',
    description: 'Convert DOCX to EPUB online for free',
    type: 'website',
    url: 'https://flipfilex.com/docx-to-epub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DOCX to EPUB Converter',
    description: 'Convert DOCX to EPUB online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/docx-to-epub',
  },
};

export default function DocxToEpubPage() {
  return (
    <ConverterPage
      slug="docx-to-epub"
      sourceFormat="docx"
      targetFormat="epub"
      category="document"
      title="DOCX to EPUB Converter"
    />
  );
}
