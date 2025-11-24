import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'AVIF to ICO Converter - Free Online Tool | FlipFileX',
  description: 'Convert AVIF to ICO online for free. Fast, secure, and easy-to-use AVIF to ICO converter with no file size limits.',
  keywords: ['avif to ico', 'avif converter', 'ico converter', 'convert avif', 'online avif converter'],
  openGraph: {
    title: 'AVIF to ICO Converter - FlipFileX',
    description: 'Convert AVIF to ICO online for free',
    type: 'website',
    url: 'https://flipfilex.com/avif-to-ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVIF to ICO Converter',
    description: 'Convert AVIF to ICO online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/avif-to-ico',
  },
};

export default function AvifToIcoPage() {
  return (
    <ConverterPage
      slug="avif-to-ico"
      sourceFormat="avif"
      targetFormat="ico"
      category="image"
      title="AVIF to ICO Converter"
    />
  );
}
