import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'HTML to DOCX Converter - Free Online Tool | FlipFileX',
  description: 'Convert HTML to DOCX online for free. Fast, secure, and easy-to-use HTML to DOCX converter with no file size limits.',
  keywords: ['html to docx', 'html converter', 'docx converter', 'convert html', 'online html converter'],
  openGraph: {
    title: 'HTML to DOCX Converter - FlipFileX',
    description: 'Convert HTML to DOCX online for free',
    type: 'website',
    url: 'https://flipfilex.com/html-to-docx',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTML to DOCX Converter',
    description: 'Convert HTML to DOCX online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/html-to-docx',
  },
};

export default function HtmlToDocxPage() {
  return (
    <ConverterPage
      slug="html-to-docx"
      sourceFormat="html"
      targetFormat="docx"
      category="document"
      title="HTML to DOCX Converter"
    />
  );
}
