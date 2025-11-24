import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'AVI to MP4 Converter - Free Online Tool | FlipFileX',
  description: 'Convert AVI to MP4 online for free. Fast, secure, and easy-to-use AVI to MP4 converter with no file size limits.',
  keywords: ['avi to mp4', 'avi converter', 'mp4 converter', 'convert avi', 'online avi converter'],
  openGraph: {
    title: 'AVI to MP4 Converter - FlipFileX',
    description: 'Convert AVI to MP4 online for free',
    type: 'website',
    url: 'https://flipfilex.com/avi-to-mp4',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVI to MP4 Converter',
    description: 'Convert AVI to MP4 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/avi-to-mp4',
  },
};

export default function AviToMp4Page() {
  return (
    <ConverterPage
      slug="avi-to-mp4"
      sourceFormat="avi"
      targetFormat="mp4"
      category="video"
      title="AVI to MP4 Converter"
    />
  );
}
