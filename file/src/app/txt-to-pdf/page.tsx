import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TXT to PDF Converter - Free Online Tool | FlipFileX',
  description: 'Convert TXT to PDF online for free. Fast, secure, and easy-to-use TXT to PDF converter with no file size limits.',
  keywords: ['txt to pdf', 'txt converter', 'pdf converter', 'convert txt', 'online txt converter'],
  openGraph: {
    title: 'TXT to PDF Converter - FlipFileX',
    description: 'Convert TXT to PDF online for free',
    type: 'website',
    url: 'https://flipfilex.com/txt-to-pdf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TXT to PDF Converter',
    description: 'Convert TXT to PDF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/txt-to-pdf',
  },
};

export default function TxtToPdfPage() {
  return (
    <ConverterPage
      slug="txt-to-pdf"
      sourceFormat="txt"
      targetFormat="pdf"
      category="document"
      title="TXT to PDF Converter"
    />
  );
}
