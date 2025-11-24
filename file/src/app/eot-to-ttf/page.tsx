import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'EOT to TTF Converter - Free Online Tool | FlipFileX',
  description: 'Convert EOT to TTF fonts online for free. Fast, secure, and easy-to-use EOT to TTF font converter.',
  keywords: ['eot to ttf', 'eot converter', 'ttf converter', 'font converter', 'convert eot', 'online eot converter'],
  openGraph: {
    title: 'EOT to TTF Converter - FlipFileX',
    description: 'Convert EOT to TTF fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/eot-to-ttf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EOT to TTF Converter',
    description: 'Convert EOT to TTF fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/eot-to-ttf',
  },
};

export default function EotToTtfPage() {
  return (
    <ConverterPage
      slug="eot-to-ttf"
      sourceFormat="eot"
      targetFormat="ttf"
      category="font"
      title="EOT to TTF Converter"
    />
  );
}
