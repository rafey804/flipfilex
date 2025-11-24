import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'EOT to WOFF2 Converter - Free Online Tool | FlipFileX',
  description: 'Convert EOT to WOFF2 fonts online for free. Fast, secure, and easy-to-use EOT to WOFF2 font converter.',
  keywords: ['eot to woff2', 'eot converter', 'woff2 converter', 'font converter', 'convert eot', 'online eot converter'],
  openGraph: {
    title: 'EOT to WOFF2 Converter - FlipFileX',
    description: 'Convert EOT to WOFF2 fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/eot-to-woff2',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EOT to WOFF2 Converter',
    description: 'Convert EOT to WOFF2 fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/eot-to-woff2',
  },
};

export default function EotToWoff2Page() {
  return (
    <ConverterPage
      slug="eot-to-woff2"
      sourceFormat="eot"
      targetFormat="woff2"
      category="font"
      title="EOT to WOFF2 Converter"
    />
  );
}
