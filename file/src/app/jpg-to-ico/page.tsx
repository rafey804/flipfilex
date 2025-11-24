import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'JPG to ICO Converter - Free Online Tool | FlipFileX',
  description: 'Convert JPG to ICO online for free. Fast, secure, and easy-to-use JPG to ICO converter with no file size limits.',
  keywords: ['jpg to ico', 'jpg converter', 'ico converter', 'convert jpg', 'online jpg converter'],
  openGraph: {
    title: 'JPG to ICO Converter - FlipFileX',
    description: 'Convert JPG to ICO online for free',
    type: 'website',
    url: 'https://flipfilex.com/jpg-to-ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to ICO Converter',
    description: 'Convert JPG to ICO online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/jpg-to-ico',
  },
};

export default function JpgToIcoPage() {
  return (
    <ConverterPage
      slug="jpg-to-ico"
      sourceFormat="jpg"
      targetFormat="ico"
      category="image"
      title="JPG to ICO Converter"
    />
  );
}
