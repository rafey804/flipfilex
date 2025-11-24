import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'Compress PDF - Free Online Tool | FlipFileX',
  description: 'Convert PDF to PDF online for free. Fast, secure, and easy-to-use PDF to PDF converter with no file size limits.',
  keywords: ['pdf to pdf', 'pdf converter', 'pdf converter', 'convert pdf', 'online pdf converter'],
  openGraph: {
    title: 'Compress PDF - FlipFileX',
    description: 'Convert PDF to PDF online for free',
    type: 'website',
    url: 'https://flipfilex.com/compress-pdf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress PDF',
    description: 'Convert PDF to PDF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/compress-pdf',
  },
};

export default function CompressPdfPage() {
  return (
    <ConverterPage
      slug="compress-pdf"
      sourceFormat="pdf"
      targetFormat="pdf"
      category="pdf"
      title="Compress PDF"
    />
  );
}
