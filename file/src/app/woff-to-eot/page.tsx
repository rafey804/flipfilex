import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WOFF to EOT Converter - Free Online Tool | FlipFileX',
  description: 'Convert WOFF to EOT fonts online for free. Fast, secure, and easy-to-use WOFF to EOT font converter.',
  keywords: ['woff to eot', 'woff converter', 'eot converter', 'font converter', 'convert woff', 'online woff converter'],
  openGraph: {
    title: 'WOFF to EOT Converter - FlipFileX',
    description: 'Convert WOFF to EOT fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/woff-to-eot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOFF to EOT Converter',
    description: 'Convert WOFF to EOT fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/woff-to-eot',
  },
};

export default function WoffToEotPage() {
  return (
    <ConverterPage
      slug="woff-to-eot"
      sourceFormat="woff"
      targetFormat="eot"
      category="font"
      title="WOFF to EOT Converter"
    />
  );
}
