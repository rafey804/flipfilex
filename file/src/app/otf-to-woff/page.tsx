import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'OTF to WOFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert OTF to WOFF fonts online for free. Fast, secure, and easy-to-use OTF to WOFF font converter.',
  keywords: ['otf to woff', 'otf converter', 'woff converter', 'font converter', 'convert otf', 'online otf converter'],
  openGraph: {
    title: 'OTF to WOFF Converter - FlipFileX',
    description: 'Convert OTF to WOFF fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/otf-to-woff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OTF to WOFF Converter',
    description: 'Convert OTF to WOFF fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/otf-to-woff',
  },
};

export default function OtfToWoffPage() {
  return (
    <ConverterPage
      slug="otf-to-woff"
      sourceFormat="otf"
      targetFormat="woff"
      category="font"
      title="OTF to WOFF Converter"
    />
  );
}
