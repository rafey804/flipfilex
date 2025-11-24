import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PNG to AVIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert PNG to AVIF online for free. Fast, secure, and easy-to-use PNG to AVIF converter with no file size limits.',
  keywords: ['png to avif', 'png converter', 'avif converter', 'convert png', 'online png converter'],
  openGraph: {
    title: 'PNG to AVIF Converter - FlipFileX',
    description: 'Convert PNG to AVIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/png-to-avif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNG to AVIF Converter',
    description: 'Convert PNG to AVIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/png-to-avif',
  },
};

export default function PngToAvifPage() {
  return (
    <ConverterPage
      slug="png-to-avif"
      sourceFormat="png"
      targetFormat="avif"
      category="image"
      title="PNG to AVIF Converter"
    />
  );
}
