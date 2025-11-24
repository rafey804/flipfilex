import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'Markdown to HTML Converter - Free Online Tool | FlipFileX',
  description: 'Convert MD to HTML online for free. Fast, secure, and easy-to-use MD to HTML converter with no file size limits.',
  keywords: ['md to html', 'md converter', 'html converter', 'convert md', 'online md converter'],
  openGraph: {
    title: 'Markdown to HTML Converter - FlipFileX',
    description: 'Convert MD to HTML online for free',
    type: 'website',
    url: 'https://flipfilex.com/markdown-to-html',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Markdown to HTML Converter',
    description: 'Convert MD to HTML online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/markdown-to-html',
  },
};

export default function MarkdownToHtmlPage() {
  return (
    <ConverterPage
      slug="markdown-to-html"
      sourceFormat="md"
      targetFormat="html"
      category="document"
      title="Markdown to HTML Converter"
    />
  );
}
