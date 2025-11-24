import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'EOT to WOFF Converter - Free Online Tool | FlipFileX',
  description: 'Convert EOT to WOFF fonts online for free. Fast, secure, and easy-to-use EOT to WOFF font converter.',
  keywords: ['eot to woff', 'eot converter', 'woff converter', 'font converter', 'convert eot', 'online eot converter'],
  openGraph: {
    title: 'EOT to WOFF Converter - FlipFileX',
    description: 'Convert EOT to WOFF fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/eot-to-woff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EOT to WOFF Converter',
    description: 'Convert EOT to WOFF fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/eot-to-woff',
  },
};

export default function EotToWoffPage() {
  return (
    <ConverterPage
      slug="eot-to-woff"
      sourceFormat="eot"
      targetFormat="woff"
      category="font"
      title="EOT to WOFF Converter"
    />
  );
}
