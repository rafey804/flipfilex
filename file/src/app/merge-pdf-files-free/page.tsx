import { Metadata } from 'next';
import MergePdfFilesClient from './MergePdfFilesClient';

export const metadata: Metadata = {
  title: 'Free Merge PDF Files | FlipFileX',
  description: 'Merge multiple PDF files into one document for free. Combine up to 10 PDFs while preserving quality and formatting. No registration required, instant download.',
  keywords: 'merge PDF, combine PDF, PDF merger, join PDF files, PDF combiner, multiple PDF merge, free PDF merger, online PDF combiner, merge PDFs online, combine PDF documents',
  alternates: {
    canonical: '/merge-pdf-files-free',
  },
  openGraph: {
    title: 'Free Merge PDF Files | FlipFileX',
    description: 'Merge multiple PDF files into one document for free. Combine up to 10 PDFs while preserving quality and formatting. No registration required.',
    type: 'website',
    url: 'https://flipfilex.com/merge-pdf-files-free',
    images: [
      {
        url: 'https://flipfilex.com/images/merge-pdf-og.jpg',
      },
    ],
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Merge PDF Files | FlipFileX',
    description: 'Merge multiple PDF files into one document for free. Combine up to 10 PDFs while preserving quality and formatting.',
    images: ['https://flipfilex.com/images/merge-pdf-twitter.jpg'],
  },
};

export default function MergePdfPage() {
  return <MergePdfFilesClient />;
}