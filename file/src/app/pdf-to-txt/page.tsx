import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PDF to TXT Converter - Free Online Tool | FlipFileX',
  description: 'Convert PDF to TXT online for free. Fast, secure, and easy-to-use PDF to TXT converter with no file size limits.',
  keywords: ['pdf to txt', 'pdf converter', 'txt converter', 'convert pdf', 'online pdf converter'],
  openGraph: {
    title: 'PDF to TXT Converter - FlipFileX',
    description: 'Convert PDF to TXT online for free',
    type: 'website',
    url: 'https://flipfilex.com/pdf-to-txt',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to TXT Converter',
    description: 'Convert PDF to TXT online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/pdf-to-txt',
  },
};

export default function PdfToTxtPage() {
  return (
    <ConverterPage
      slug="pdf-to-txt"
      sourceFormat="pdf"
      targetFormat="txt"
      category="document"
      title="PDF to TXT Converter"
    />
  );
}
