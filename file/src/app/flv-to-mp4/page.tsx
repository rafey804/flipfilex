import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'FLV to MP4 Converter - Free Online Tool | FlipFileX',
  description: 'Convert FLV to MP4 online for free. Fast, secure, and easy-to-use FLV to MP4 converter with no file size limits.',
  keywords: ['flv to mp4', 'flv converter', 'mp4 converter', 'convert flv', 'online flv converter'],
  openGraph: {
    title: 'FLV to MP4 Converter - FlipFileX',
    description: 'Convert FLV to MP4 online for free',
    type: 'website',
    url: 'https://flipfilex.com/flv-to-mp4',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FLV to MP4 Converter',
    description: 'Convert FLV to MP4 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/flv-to-mp4',
  },
};

export default function FlvToMp4Page() {
  return (
    <ConverterPage
      slug="flv-to-mp4"
      sourceFormat="flv"
      targetFormat="mp4"
      category="video"
      title="FLV to MP4 Converter"
    />
  );
}
