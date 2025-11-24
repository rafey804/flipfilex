import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'AAC to MP3 Converter - Free Online Tool | FlipFileX',
  description: 'Convert AAC to MP3 online for free. Fast, secure, and easy-to-use AAC to MP3 converter with no file size limits.',
  keywords: ['aac to mp3', 'aac converter', 'mp3 converter', 'convert aac', 'online aac converter'],
  openGraph: {
    title: 'AAC to MP3 Converter - FlipFileX',
    description: 'Convert AAC to MP3 online for free',
    type: 'website',
    url: 'https://flipfilex.com/aac-to-mp3',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AAC to MP3 Converter',
    description: 'Convert AAC to MP3 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/aac-to-mp3',
  },
};

export default function AacToMp3Page() {
  return (
    <ConverterPage
      slug="aac-to-mp3"
      sourceFormat="aac"
      targetFormat="mp3"
      category="audio"
      title="AAC to MP3 Converter"
    />
  );
}
