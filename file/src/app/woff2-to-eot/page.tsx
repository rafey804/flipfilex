import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WOFF2 to EOT Converter - Free Online Tool | FlipFileX',
  description: 'Convert WOFF2 to EOT fonts online for free. Fast, secure, and easy-to-use WOFF2 to EOT font converter.',
  keywords: ['woff2 to eot', 'woff2 converter', 'eot converter', 'font converter', 'convert woff2', 'online woff2 converter'],
  openGraph: {
    title: 'WOFF2 to EOT Converter - FlipFileX',
    description: 'Convert WOFF2 to EOT fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/woff2-to-eot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOFF2 to EOT Converter',
    description: 'Convert WOFF2 to EOT fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/woff2-to-eot',
  },
};

export default function Woff2ToEotPage() {
  return (
    <ConverterPage
      slug="woff2-to-eot"
      sourceFormat="woff2"
      targetFormat="eot"
      category="font"
      title="WOFF2 to EOT Converter"
    />
  );
}
