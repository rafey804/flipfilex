import { Metadata } from 'next';
import ConvertPdfToWordClient from './ConvertPdfToWordClient';

export const metadata: Metadata = {
  title: 'Free PDF to Word Converter Online - Convert PDF to DOCX | FlipFileX',
  description: 'Convert PDF to Word (DOCX) files online for free. AI-powered conversion preserves formatting, images, tables. No registration required. 98% accuracy guaranteed.',
  keywords: 'PDF to Word converter, PDF to DOCX, convert PDF online, free PDF converter, extract text from PDF, editable Word document, PDF to Word online, document conversion tool',
  alternates: {
    canonical: '/convert-pdf-to-word-online',
  },
  openGraph: {
    title: 'Free PDF to Word Converter Online - Convert PDF to DOCX',
    description: 'Transform your PDF documents into fully editable Word files with 98% accuracy. Preserve formatting, images, and tables. Free online conversion tool.',
    type: 'website',
    url: 'https://flipfilex.com/convert-pdf-to-word-online',
    images: [
      {
        url: 'https://flipfilex.com/images/pdf-to-word-converter.jpg',
      },
    ],
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PDF to Word Converter Online - Convert PDF to DOCX',
    description: 'Convert PDF to editable Word documents with 98% accuracy. Free online tool with instant results.',
    images: ['https://flipfilex.com/images/pdf-to-word-converter.jpg'],
  },
};

export default function PdfToWordPage() {
  return <ConvertPdfToWordClient />;
}