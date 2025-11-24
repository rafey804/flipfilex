import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'M4A to MP3 Converter - Free Online Tool | FlipFileX',
  description: 'Convert M4A to MP3 online for free. Fast, secure, and easy-to-use M4A to MP3 converter with no file size limits.',
  keywords: ['m4a to mp3', 'm4a converter', 'mp3 converter', 'convert m4a', 'online m4a converter'],
  openGraph: {
    title: 'M4A to MP3 Converter - FlipFileX',
    description: 'Convert M4A to MP3 online for free',
    type: 'website',
    url: 'https://flipfilex.com/m4a-to-mp3',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M4A to MP3 Converter',
    description: 'Convert M4A to MP3 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/m4a-to-mp3',
  },
};

export default function M4aToMp3Page() {
  return (
    <ConverterPage
      slug="m4a-to-mp3"
      sourceFormat="m4a"
      targetFormat="mp3"
      category="audio"
      title="M4A to MP3 Converter"
    />
  );
}
