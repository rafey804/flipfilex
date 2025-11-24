import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'JPG to GIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert JPG to GIF online for free. Fast, secure, and easy-to-use JPG to GIF converter with no file size limits.',
  keywords: ['jpg to gif', 'jpg converter', 'gif converter', 'convert jpg', 'online jpg converter'],
  openGraph: {
    title: 'JPG to GIF Converter - FlipFileX',
    description: 'Convert JPG to GIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/jpg-to-gif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to GIF Converter',
    description: 'Convert JPG to GIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/jpg-to-gif',
  },
};

export default function JpgToGifPage() {
  return (
    <ConverterPage
      slug="jpg-to-gif"
      sourceFormat="jpg"
      targetFormat="gif"
      category="image"
      title="JPG to GIF Converter"
    />
  );
}
