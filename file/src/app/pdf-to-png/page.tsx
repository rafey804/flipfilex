import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PDF to PNG Converter - Free Online Tool | FlipFileX',
  description: 'Convert PDF to PNG online for free. Fast, secure, and easy-to-use PDF to PNG converter with no file size limits.',
  keywords: ['pdf to png', 'pdf converter', 'png converter', 'convert pdf', 'online pdf converter'],
  openGraph: {
    title: 'PDF to PNG Converter - FlipFileX',
    description: 'Convert PDF to PNG online for free',
    type: 'website',
    url: 'https://flipfilex.com/pdf-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to PNG Converter',
    description: 'Convert PDF to PNG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/pdf-to-png',
  },
};

export default function PdfToPngPage() {
  return (
    <ConverterPage
      slug="pdf-to-png"
      sourceFormat="pdf"
      targetFormat="png"
      category="pdf"
      title="PDF to PNG Converter"
    />
  );
}
