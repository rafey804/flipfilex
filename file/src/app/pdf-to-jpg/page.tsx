import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PDF to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert PDF to JPG online for free. Fast, secure, and easy-to-use PDF to JPG converter with no file size limits.',
  keywords: ['pdf to jpg', 'pdf converter', 'jpg converter', 'convert pdf', 'online pdf converter'],
  openGraph: {
    title: 'PDF to JPG Converter - FlipFileX',
    description: 'Convert PDF to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/pdf-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to JPG Converter',
    description: 'Convert PDF to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/pdf-to-jpg',
  },
};

export default function PdfToJpgPage() {
  return (
    <ConverterPage
      slug="pdf-to-jpg"
      sourceFormat="pdf"
      targetFormat="jpg"
      category="pdf"
      title="PDF to JPG Converter"
    />
  );
}
