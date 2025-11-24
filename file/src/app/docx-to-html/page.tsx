import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'DOCX to HTML Converter - Free Online Tool | FlipFileX',
  description: 'Convert DOCX to HTML online for free. Fast, secure, and easy-to-use DOCX to HTML converter with no file size limits.',
  keywords: ['docx to html', 'docx converter', 'html converter', 'convert docx', 'online docx converter'],
  openGraph: {
    title: 'DOCX to HTML Converter - FlipFileX',
    description: 'Convert DOCX to HTML online for free',
    type: 'website',
    url: 'https://flipfilex.com/docx-to-html',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DOCX to HTML Converter',
    description: 'Convert DOCX to HTML online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/docx-to-html',
  },
};

export default function DocxToHtmlPage() {
  return (
    <ConverterPage
      slug="docx-to-html"
      sourceFormat="docx"
      targetFormat="html"
      category="document"
      title="DOCX to HTML Converter"
    />
  );
}
