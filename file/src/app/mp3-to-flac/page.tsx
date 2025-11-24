import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'MP3 to FLAC Converter - Free Online Tool | FlipFileX',
  description: 'Convert MP3 to FLAC online for free. Fast, secure, and easy-to-use MP3 to FLAC converter with no file size limits.',
  keywords: ['mp3 to flac', 'mp3 converter', 'flac converter', 'convert mp3', 'online mp3 converter'],
  openGraph: {
    title: 'MP3 to FLAC Converter - FlipFileX',
    description: 'Convert MP3 to FLAC online for free',
    type: 'website',
    url: 'https://flipfilex.com/mp3-to-flac',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MP3 to FLAC Converter',
    description: 'Convert MP3 to FLAC online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/mp3-to-flac',
  },
};

export default function Mp3ToFlacPage() {
  return (
    <ConverterPage
      slug="mp3-to-flac"
      sourceFormat="mp3"
      targetFormat="flac"
      category="audio"
      title="MP3 to FLAC Converter"
    />
  );
}
