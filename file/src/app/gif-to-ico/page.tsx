import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'GIF to ICO Converter - Free Online Tool | FlipFileX',
  description: 'Convert GIF to ICO online for free. Fast, secure, and easy-to-use GIF to ICO converter with no file size limits.',
  keywords: ['gif to ico', 'gif converter', 'ico converter', 'convert gif', 'online gif converter'],
  openGraph: {
    title: 'GIF to ICO Converter - FlipFileX',
    description: 'Convert GIF to ICO online for free',
    type: 'website',
    url: 'https://flipfilex.com/gif-to-ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF to ICO Converter',
    description: 'Convert GIF to ICO online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/gif-to-ico',
  },
};

export default function GifToIcoPage() {
  return (
    <ConverterPage
      slug="gif-to-ico"
      sourceFormat="gif"
      targetFormat="ico"
      category="image"
      title="GIF to ICO Converter"
    />
  );
}
