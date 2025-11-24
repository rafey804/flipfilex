import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'ICO to AVIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert ICO to AVIF online for free. Fast, secure, and easy-to-use ICO to AVIF converter with no file size limits.',
  keywords: ['ico to avif', 'ico converter', 'avif converter', 'convert ico', 'online ico converter'],
  openGraph: {
    title: 'ICO to AVIF Converter - FlipFileX',
    description: 'Convert ICO to AVIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/ico-to-avif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICO to AVIF Converter',
    description: 'Convert ICO to AVIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ico-to-avif',
  },
};

export default function IcoToAvifPage() {
  return (
    <ConverterPage
      slug="ico-to-avif"
      sourceFormat="ico"
      targetFormat="avif"
      category="image"
      title="ICO to AVIF Converter"
    />
  );
}
