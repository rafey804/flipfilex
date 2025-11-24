import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'OTF to EOT Converter - Free Online Tool | FlipFileX',
  description: 'Convert OTF to EOT fonts online for free. Fast, secure, and easy-to-use OTF to EOT font converter.',
  keywords: ['otf to eot', 'otf converter', 'eot converter', 'font converter', 'convert otf', 'online otf converter'],
  openGraph: {
    title: 'OTF to EOT Converter - FlipFileX',
    description: 'Convert OTF to EOT fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/otf-to-eot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OTF to EOT Converter',
    description: 'Convert OTF to EOT fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/otf-to-eot',
  },
};

export default function OtfToEotPage() {
  return (
    <ConverterPage
      slug="otf-to-eot"
      sourceFormat="otf"
      targetFormat="eot"
      category="font"
      title="OTF to EOT Converter"
    />
  );
}
