import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'MKV to MP4 Converter - Free Online Tool | FlipFileX',
  description: 'Convert MKV to MP4 online for free. Fast, secure, and easy-to-use MKV to MP4 converter with no file size limits.',
  keywords: ['mkv to mp4', 'mkv converter', 'mp4 converter', 'convert mkv', 'online mkv converter'],
  openGraph: {
    title: 'MKV to MP4 Converter - FlipFileX',
    description: 'Convert MKV to MP4 online for free',
    type: 'website',
    url: 'https://flipfilex.com/mkv-to-mp4',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MKV to MP4 Converter',
    description: 'Convert MKV to MP4 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/mkv-to-mp4',
  },
};

export default function MkvToMp4Page() {
  return (
    <ConverterPage
      slug="mkv-to-mp4"
      sourceFormat="mkv"
      targetFormat="mp4"
      category="video"
      title="MKV to MP4 Converter"
    />
  );
}
