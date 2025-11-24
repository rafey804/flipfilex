import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'FLAC to WAV Converter - Free Online Tool | FlipFileX',
  description: 'Convert FLAC to WAV online for free. Fast, secure, and easy-to-use FLAC to WAV converter with no file size limits.',
  keywords: ['flac to wav', 'flac converter', 'wav converter', 'convert flac', 'online flac converter'],
  openGraph: {
    title: 'FLAC to WAV Converter - FlipFileX',
    description: 'Convert FLAC to WAV online for free',
    type: 'website',
    url: 'https://flipfilex.com/flac-to-wav',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FLAC to WAV Converter',
    description: 'Convert FLAC to WAV online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/flac-to-wav',
  },
};

export default function FlacToWavPage() {
  return (
    <ConverterPage
      slug="flac-to-wav"
      sourceFormat="flac"
      targetFormat="wav"
      category="audio"
      title="FLAC to WAV Converter"
    />
  );
}
