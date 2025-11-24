import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'LaTeX to PDF Converter - Free Online Tool | FlipFileX',
  description: 'Convert LATEX to PDF online for free. Fast, secure, and easy-to-use LATEX to PDF converter with no file size limits.',
  keywords: ['latex to pdf', 'latex converter', 'pdf converter', 'convert latex', 'online latex converter'],
  openGraph: {
    title: 'LaTeX to PDF Converter - FlipFileX',
    description: 'Convert LATEX to PDF online for free',
    type: 'website',
    url: 'https://flipfilex.com/latex-to-pdf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaTeX to PDF Converter',
    description: 'Convert LATEX to PDF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/latex-to-pdf',
  },
};

export default function LatexToPdfPage() {
  return (
    <ConverterPage
      slug="latex-to-pdf"
      sourceFormat="latex"
      targetFormat="pdf"
      category="document"
      title="LaTeX to PDF Converter"
    />
  );
}
