import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'MP3 to WAV Converter - Free Online Tool | FlipFileX',
  description: 'Convert MP3 to WAV online for free. Fast, secure, and easy-to-use MP3 to WAV converter with no file size limits.',
  keywords: ['mp3 to wav', 'mp3 converter', 'wav converter', 'convert mp3', 'online mp3 converter'],
  openGraph: {
    title: 'MP3 to WAV Converter - FlipFileX',
    description: 'Convert MP3 to WAV online for free',
    type: 'website',
    url: 'https://flipfilex.com/mp3-to-wav',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MP3 to WAV Converter',
    description: 'Convert MP3 to WAV online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/mp3-to-wav',
  },
};

export default function Mp3ToWavPage() {
  return (
    <ConverterPage
      slug="mp3-to-wav"
      sourceFormat="mp3"
      targetFormat="wav"
      category="audio"
      title="MP3 to WAV Converter"
    />
  );
}
