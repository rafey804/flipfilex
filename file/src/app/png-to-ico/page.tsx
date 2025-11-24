import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PNG to ICO Converter - Free Online Tool | FlipFileX',
  description: 'Convert PNG to ICO online for free. Fast, secure, and easy-to-use PNG to ICO converter with no file size limits.',
  keywords: ['png to ico', 'png converter', 'ico converter', 'convert png', 'online png converter'],
  openGraph: {
    title: 'PNG to ICO Converter - FlipFileX',
    description: 'Convert PNG to ICO online for free',
    type: 'website',
    url: 'https://flipfilex.com/png-to-ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNG to ICO Converter',
    description: 'Convert PNG to ICO online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/png-to-ico',
  },
};

export default function PngToIcoPage() {
  return (
    <ConverterPage
      slug="png-to-ico"
      sourceFormat="png"
      targetFormat="ico"
      category="image"
      title="PNG to ICO Converter"
    />
  );
}
