import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'OGG to MP3 Converter - Free Online Tool | FlipFileX',
  description: 'Convert OGG to MP3 online for free. Fast, secure, and easy-to-use OGG to MP3 converter with no file size limits.',
  keywords: ['ogg to mp3', 'ogg converter', 'mp3 converter', 'convert ogg', 'online ogg converter'],
  openGraph: {
    title: 'OGG to MP3 Converter - FlipFileX',
    description: 'Convert OGG to MP3 online for free',
    type: 'website',
    url: 'https://flipfilex.com/ogg-to-mp3',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OGG to MP3 Converter',
    description: 'Convert OGG to MP3 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/ogg-to-mp3',
  },
};

export default function OggToMp3Page() {
  return (
    <ConverterPage
      slug="ogg-to-mp3"
      sourceFormat="ogg"
      targetFormat="mp3"
      category="audio"
      title="OGG to MP3 Converter"
    />
  );
}
