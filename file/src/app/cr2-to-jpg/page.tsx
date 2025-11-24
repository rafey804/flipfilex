import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'CR2 to JPG Converter - Free Online Tool | FlipFileX',
  description: 'Convert CR2 to JPG online for free. Fast, secure, and easy-to-use CR2 to JPG converter with no file size limits.',
  keywords: ['cr2 to jpg', 'cr2 converter', 'jpg converter', 'convert cr2', 'online cr2 converter'],
  openGraph: {
    title: 'CR2 to JPG Converter - FlipFileX',
    description: 'Convert CR2 to JPG online for free',
    type: 'website',
    url: 'https://flipfilex.com/cr2-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CR2 to JPG Converter',
    description: 'Convert CR2 to JPG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/cr2-to-jpg',
  },
};

export default function Cr2ToJpgPage() {
  return (
    <ConverterPage
      slug="cr2-to-jpg"
      sourceFormat="cr2"
      targetFormat="jpg"
      category="image"
      title="CR2 to JPG Converter"
    />
  );
}
