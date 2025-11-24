import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'Opus to MP3 Converter - Free Online Tool | FlipFileX',
  description: 'Convert OPUS to MP3 online for free. Fast, secure, and easy-to-use OPUS to MP3 converter with no file size limits.',
  keywords: ['opus to mp3', 'opus converter', 'mp3 converter', 'convert opus', 'online opus converter'],
  openGraph: {
    title: 'Opus to MP3 Converter - FlipFileX',
    description: 'Convert OPUS to MP3 online for free',
    type: 'website',
    url: 'https://flipfilex.com/opus-to-mp3',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Opus to MP3 Converter',
    description: 'Convert OPUS to MP3 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/opus-to-mp3',
  },
};

export default function OpusToMp3Page() {
  return (
    <ConverterPage
      slug="opus-to-mp3"
      sourceFormat="opus"
      targetFormat="mp3"
      category="audio"
      title="Opus to MP3 Converter"
    />
  );
}
