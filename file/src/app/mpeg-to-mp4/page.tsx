import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'MPEG to MP4 Converter - Free Online Tool | FlipFileX',
  description: 'Convert MPEG to MP4 online for free. Fast, secure, and easy-to-use MPEG to MP4 converter with no file size limits.',
  keywords: ['mpeg to mp4', 'mpeg converter', 'mp4 converter', 'convert mpeg', 'online mpeg converter'],
  openGraph: {
    title: 'MPEG to MP4 Converter - FlipFileX',
    description: 'Convert MPEG to MP4 online for free',
    type: 'website',
    url: 'https://flipfilex.com/mpeg-to-mp4',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MPEG to MP4 Converter',
    description: 'Convert MPEG to MP4 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/mpeg-to-mp4',
  },
};

export default function MpegToMp4Page() {
  return (
    <ConverterPage
      slug="mpeg-to-mp4"
      sourceFormat="mpeg"
      targetFormat="mp4"
      category="video"
      title="MPEG to MP4 Converter"
    />
  );
}
