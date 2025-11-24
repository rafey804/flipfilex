import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'Split PDF Files - Free Online Tool | FlipFileX',
  description: 'Convert PDF to PDF online for free. Fast, secure, and easy-to-use PDF to PDF converter with no file size limits.',
  keywords: ['pdf to pdf', 'pdf converter', 'pdf converter', 'convert pdf', 'online pdf converter'],
  openGraph: {
    title: 'Split PDF Files - FlipFileX',
    description: 'Convert PDF to PDF online for free',
    type: 'website',
    url: 'https://flipfilex.com/split-pdf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Split PDF Files',
    description: 'Convert PDF to PDF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/split-pdf',
  },
};

export default function SplitPdfPage() {
  return (
    <ConverterPage
      slug="split-pdf"
      sourceFormat="pdf"
      targetFormat="pdf"
      category="pdf"
      title="Split PDF Files"
    />
  );
}
