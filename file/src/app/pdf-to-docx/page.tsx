import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PDF to DOCX Converter - Free Online Tool | FlipFileX',
  description: 'Convert PDF to DOCX online for free. Fast, secure, and easy-to-use PDF to DOCX converter with no file size limits.',
  keywords: ['pdf to docx', 'pdf converter', 'docx converter', 'convert pdf', 'online pdf converter'],
  openGraph: {
    title: 'PDF to DOCX Converter - FlipFileX',
    description: 'Convert PDF to DOCX online for free',
    type: 'website',
    url: 'https://flipfilex.com/pdf-to-docx',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to DOCX Converter',
    description: 'Convert PDF to DOCX online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/pdf-to-docx',
  },
};

export default function PdfToDocxPage() {
  return (
    <ConverterPage
      slug="pdf-to-docx"
      sourceFormat="pdf"
      targetFormat="docx"
      category="document"
      title="PDF to DOCX Converter"
    />
  );
}
