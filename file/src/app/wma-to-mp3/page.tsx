import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WMA to MP3 Converter - Free Online Tool | FlipFileX',
  description: 'Convert WMA to MP3 online for free. Fast, secure, and easy-to-use WMA to MP3 converter with no file size limits.',
  keywords: ['wma to mp3', 'wma converter', 'mp3 converter', 'convert wma', 'online wma converter'],
  openGraph: {
    title: 'WMA to MP3 Converter - FlipFileX',
    description: 'Convert WMA to MP3 online for free',
    type: 'website',
    url: 'https://flipfilex.com/wma-to-mp3',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WMA to MP3 Converter',
    description: 'Convert WMA to MP3 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/wma-to-mp3',
  },
};

export default function WmaToMp3Page() {
  return (
    <ConverterPage
      slug="wma-to-mp3"
      sourceFormat="wma"
      targetFormat="mp3"
      category="audio"
      title="WMA to MP3 Converter"
    />
  );
}
