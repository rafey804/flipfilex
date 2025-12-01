import { Metadata } from 'next';
import RisToBibtexClient from './RisToBibtexClient';

export const metadata: Metadata = {
  title: 'Free RIS to BibTeX Converter Online - Research Reference Converter | FlipFileX',
  description: 'Convert RIS reference files to BibTeX format online for free. Perfect for academic research, citations, and bibliography management.',
  keywords: 'RIS to BibTeX, reference converter, citation converter, academic research, bibliography, research tools',
  alternates: {
    canonical: '/ris-to-bibtex',
  },
  openGraph: {
    title: 'Free RIS to BibTeX Converter Online - Research Reference Converter | FlipFileX',
    description: 'Convert RIS reference files to BibTeX format online for free. Perfect for academic research, citations, and bibliography management.',
    type: 'website',
    url: 'https://flipfilex.com/ris-to-bibtex',
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free RIS to BibTeX Converter Online - Research Reference Converter | FlipFileX',
    description: 'Convert RIS reference files to BibTeX format online for free. Perfect for academic research, citations, and bibliography management.',
  },
};

export default function RisToBibtexPage() {
  return <RisToBibtexClient />;
}