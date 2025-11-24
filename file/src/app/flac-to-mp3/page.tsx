import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'FLAC to MP3 Converter - Free Online Tool | FlipFileX',
  description: 'Convert FLAC to MP3 online for free. Fast, secure, and easy-to-use FLAC to MP3 converter with no file size limits.',
  keywords: ['flac to mp3', 'flac converter', 'mp3 converter', 'convert flac', 'online flac converter'],
  openGraph: {
    title: 'FLAC to MP3 Converter - FlipFileX',
    description: 'Convert FLAC to MP3 online for free',
    type: 'website',
    url: 'https://flipfilex.com/flac-to-mp3',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FLAC to MP3 Converter',
    description: 'Convert FLAC to MP3 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/flac-to-mp3',
  },
};

export default function FlacToMp3Page() {
  return (
    <ConverterPage
      slug="flac-to-mp3"
      sourceFormat="flac"
      targetFormat="mp3"
      category="audio"
      title="FLAC to MP3 Converter"
    />
  );
}
