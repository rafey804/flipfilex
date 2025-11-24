import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'OTF to TTF Converter - Free Online Tool | FlipFileX',
  description: 'Convert OTF to TTF online for free. Fast, secure, and easy-to-use OTF to TTF converter with no file size limits.',
  keywords: ['otf to ttf', 'otf converter', 'ttf converter', 'convert otf', 'online otf converter'],
  openGraph: {
    title: 'OTF to TTF Converter - FlipFileX',
    description: 'Convert OTF to TTF online for free',
    type: 'website',
    url: 'https://flipfilex.com/otf-to-ttf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OTF to TTF Converter',
    description: 'Convert OTF to TTF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/otf-to-ttf',
  },
};

export default function OtfToTtfPage() {
  return (
    <ConverterPage
      slug="otf-to-ttf"
      sourceFormat="otf"
      targetFormat="ttf"
      category="font"
      title="OTF to TTF Converter"
    />
  );
}
