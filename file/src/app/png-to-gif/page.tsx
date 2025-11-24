import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'PNG to GIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert PNG to GIF online for free. Fast, secure, and easy-to-use PNG to GIF converter with no file size limits.',
  keywords: ['png to gif', 'png converter', 'gif converter', 'convert png', 'online png converter'],
  openGraph: {
    title: 'PNG to GIF Converter - FlipFileX',
    description: 'Convert PNG to GIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/png-to-gif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNG to GIF Converter',
    description: 'Convert PNG to GIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/png-to-gif',
  },
};

export default function PngToGifPage() {
  return (
    <ConverterPage
      slug="png-to-gif"
      sourceFormat="png"
      targetFormat="gif"
      category="image"
      title="PNG to GIF Converter"
    />
  );
}
