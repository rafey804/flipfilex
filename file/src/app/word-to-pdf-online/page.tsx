import type { Metadata } from 'next';
import WordToPdfClient from './WordToPdfClient';

export const metadata: Metadata = {
  title: 'Free Word to PDF Converter Online - Convert DOCX to PDF | FlipFileX',
  description: 'Convert Word documents (DOCX, DOC) to PDF online for free. Preserve formatting, fonts, images, and layout. Professional PDF conversion with 99% accuracy.',
  keywords: 'Word to PDF converter, DOCX to PDF, DOC to PDF, convert Word online, free Word converter, Microsoft Word to PDF, document converter, PDF creator',
  authors: [{ name: 'FlipFileX' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Free Word to PDF Converter Online - Convert DOCX to PDF',
    description: 'Transform Word documents into professional PDFs with perfect formatting preservation. Free online conversion tool with instant results.',
    type: 'website',
    url: 'https://flipfilex.com/word-to-pdf-online',
    images: [
      {
        url: 'https://flipfilex.com/images/word-to-pdf-converter.jpg',
      },
    ],
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Word to PDF Converter Online - Convert DOCX to PDF',
    description: 'Convert Word documents to professional PDFs with perfect formatting. Free online tool with instant results.',
    images: ['https://flipfilex.com/images/word-to-pdf-converter.jpg'],
  },
  alternates: {
    canonical: 'https://flipfilex.com/word-to-pdf-online',
  },
  other: {
    'theme-color': '#3B82F6',
    'application-name': 'FlipFileX Word to PDF Converter',
    'msapplication-TileColor': '#3B82F6',
  },
};

export default function WordToPdfPage() {
  return <WordToPdfClient />;
}
