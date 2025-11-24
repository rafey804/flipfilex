import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WebM to MP4 Converter - Free Online Tool | FlipFileX',
  description: 'Convert WEBM to MP4 online for free. Fast, secure, and easy-to-use WEBM to MP4 converter with no file size limits.',
  keywords: ['webm to mp4', 'webm converter', 'mp4 converter', 'convert webm', 'online webm converter'],
  openGraph: {
    title: 'WebM to MP4 Converter - FlipFileX',
    description: 'Convert WEBM to MP4 online for free',
    type: 'website',
    url: 'https://flipfilex.com/webm-to-mp4',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebM to MP4 Converter',
    description: 'Convert WEBM to MP4 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/webm-to-mp4',
  },
};

export default function WebmToMp4Page() {
  return (
    <ConverterPage
      slug="webm-to-mp4"
      sourceFormat="webm"
      targetFormat="mp4"
      category="video"
      title="WebM to MP4 Converter"
    />
  );
}
