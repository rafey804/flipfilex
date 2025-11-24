import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'EOT to OTF Converter - Free Online Tool | FlipFileX',
  description: 'Convert EOT to OTF fonts online for free. Fast, secure, and easy-to-use EOT to OTF font converter.',
  keywords: ['eot to otf', 'eot converter', 'otf converter', 'font converter', 'convert eot', 'online eot converter'],
  openGraph: {
    title: 'EOT to OTF Converter - FlipFileX',
    description: 'Convert EOT to OTF fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/eot-to-otf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EOT to OTF Converter',
    description: 'Convert EOT to OTF fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/eot-to-otf',
  },
};

export default function EotToOtfPage() {
  return (
    <ConverterPage
      slug="eot-to-otf"
      sourceFormat="eot"
      targetFormat="otf"
      category="font"
      title="EOT to OTF Converter"
    />
  );
}
