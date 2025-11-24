import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'TTF to EOT Converter - Free Online Tool | FlipFileX',
  description: 'Convert TTF to EOT fonts online for free. Fast, secure, and easy-to-use TTF to EOT font converter.',
  keywords: ['ttf to eot', 'ttf converter', 'eot converter', 'font converter', 'convert ttf', 'online ttf converter'],
  openGraph: {
    title: 'TTF to EOT Converter - FlipFileX',
    description: 'Convert TTF to EOT fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/ttf-to-eot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TTF to EOT Converter',
    description: 'Convert TTF to EOT fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ttf-to-eot',
  },
};

export default function TtfToEotPage() {
  return (
    <ConverterPage
      slug="ttf-to-eot"
      sourceFormat="ttf"
      targetFormat="eot"
      category="font"
      title="TTF to EOT Converter"
    />
  );
}
