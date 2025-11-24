import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'MP3 to OGG Converter - Free Online Tool | FlipFileX',
  description: 'Convert MP3 to OGG online for free. Fast, secure, and easy-to-use MP3 to OGG converter with no file size limits.',
  keywords: ['mp3 to ogg', 'mp3 converter', 'ogg converter', 'convert mp3', 'online mp3 converter'],
  openGraph: {
    title: 'MP3 to OGG Converter - FlipFileX',
    description: 'Convert MP3 to OGG online for free',
    type: 'website',
    url: 'https://flipfilex.com/mp3-to-ogg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MP3 to OGG Converter',
    description: 'Convert MP3 to OGG online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/mp3-to-ogg',
  },
};

export default function Mp3ToOggPage() {
  return (
    <ConverterPage
      slug="mp3-to-ogg"
      sourceFormat="mp3"
      targetFormat="ogg"
      category="audio"
      title="MP3 to OGG Converter"
    />
  );
}
