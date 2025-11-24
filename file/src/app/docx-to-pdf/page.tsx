import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'DOCX to PDF Converter - Free Online Tool | FlipFileX',
  description: 'Convert DOCX to PDF online for free. Fast, secure, and easy-to-use DOCX to PDF converter with no file size limits.',
  keywords: ['docx to pdf', 'docx converter', 'pdf converter', 'convert docx', 'online docx converter'],
  openGraph: {
    title: 'DOCX to PDF Converter - FlipFileX',
    description: 'Convert DOCX to PDF online for free',
    type: 'website',
    url: 'https://flipfilex.com/docx-to-pdf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DOCX to PDF Converter',
    description: 'Convert DOCX to PDF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/docx-to-pdf',
  },
};

export default function DocxToPdfPage() {
  return (
    <ConverterPage
      slug="docx-to-pdf"
      sourceFormat="docx"
      targetFormat="pdf"
      category="document"
      title="DOCX to PDF Converter"
    />
  );
}
