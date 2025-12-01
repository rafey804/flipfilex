import { Metadata } from 'next';
import SplitPdfPagesClient from './SplitPdfPagesClient';

export const metadata: Metadata = {
  title: 'Free Split PDF Pages | FlipFileX',
  description: 'Split PDF files into individual pages or custom ranges for free. Extract specific pages, split by page numbers, or create separate documents. Fast, secure, and easy to use.',
  keywords: 'split PDF, PDF splitter, extract PDF pages, separate PDF pages, divide PDF, PDF page extractor, online PDF splitter, free PDF splitter, split PDF by pages, PDF page separator',
  alternates: {
    canonical: '/split-pdf-pages',
  },
  openGraph: {
    title: 'Free Split PDF Pages | FlipFileX',
    description: 'Split PDF files into individual pages or custom ranges for free. Extract specific pages, split by page numbers, or create separate documents.',
    type: 'website',
    url: 'https://flipfilex.com/split-pdf-pages',
    images: [
      {
        url: 'https://flipfilex.com/images/split-pdf-og.jpg',
      },
    ],
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Split PDF Pages | FlipFileX',
    description: 'Split PDF files into individual pages or custom ranges for free. Extract specific pages and create separate documents.',
    images: ['https://flipfilex.com/images/split-pdf-twitter.jpg'],
  },
};

export default function SplitPDFPage() {
  return <SplitPdfPagesClient />;
}