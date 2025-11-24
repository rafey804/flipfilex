import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'OTF to WOFF2 Converter - Free Online Tool | FlipFileX',
  description: 'Convert OTF to WOFF2 fonts online for free. Fast, secure, and easy-to-use OTF to WOFF2 font converter.',
  keywords: ['otf to woff2', 'otf converter', 'woff2 converter', 'font converter', 'convert otf', 'online otf converter'],
  openGraph: {
    title: 'OTF to WOFF2 Converter - FlipFileX',
    description: 'Convert OTF to WOFF2 fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/otf-to-woff2',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OTF to WOFF2 Converter',
    description: 'Convert OTF to WOFF2 fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/otf-to-woff2',
  },
};

export default function OtfToWoff2Page() {
  return (
    <ConverterPage
      slug="otf-to-woff2"
      sourceFormat="otf"
      targetFormat="woff2"
      category="font"
      title="OTF to WOFF2 Converter"
    />
  );
}
