import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PDF to Excel Converter - Free Online Tool | FlipFileX',
  description: 'Convert PDF to XLSX online for free. Fast, secure, and easy-to-use PDF to XLSX converter with no file size limits.',
  keywords: ['pdf to xlsx', 'pdf converter', 'xlsx converter', 'convert pdf', 'online pdf converter'],
  openGraph: {
    title: 'PDF to Excel Converter - FlipFileX',
    description: 'Convert PDF to XLSX online for free',
    type: 'website',
    url: 'https://flipfilex.com/pdf-to-excel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to Excel Converter',
    description: 'Convert PDF to XLSX online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/pdf-to-excel',
  },
};

export default function PdfToExcelPage() {
  return (
    <ConverterPage
      slug="pdf-to-excel"
      sourceFormat="pdf"
      targetFormat="xlsx"
      category="pdf"
      title="PDF to Excel Converter"
    />
  );
}
