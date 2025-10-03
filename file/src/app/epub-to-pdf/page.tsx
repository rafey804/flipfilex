import { Metadata } from 'next';
import EpubToPdfClient from './../../components/EpubToPdfClient';

export const metadata: Metadata = {
  title: 'Free EPUB to PDF Converter Online - Convert E-books to PDF | FlipFileX',
  description: 'Convert EPUB e-books to PDF format online for free. Professional quality conversion with preserved formatting, images, and text layout. No software installation required.',
  keywords: ['EPUB to PDF', 'e-book converter', 'EPUB converter', 'PDF converter', 'online converter', 'free converter'],
  openGraph: {
    title: 'Free EPUB to PDF Converter Online | FlipFileX',
    description: 'Convert EPUB e-books to PDF format online for free with professional quality results.',
    type: 'website',
    url: 'https://flipfilex.com/epub-to-pdf',
    images: [{ url: 'https://flipfilex.com/images/epub-to-pdf-converter.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free EPUB to PDF Converter Online | FlipFileX',
    description: 'Convert EPUB e-books to PDF format online for free with professional quality results.',
    images: ['https://flipfilex.com/images/epub-to-pdf-converter.png'],
  },
};

export default function EpubToPdfPage() {
  return <EpubToPdfClient />;
}