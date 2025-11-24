import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'MOV to MP4 Converter - Free Online Tool | FlipFileX',
  description: 'Convert MOV to MP4 online for free. Fast, secure, and easy-to-use MOV to MP4 converter with no file size limits.',
  keywords: ['mov to mp4', 'mov converter', 'mp4 converter', 'convert mov', 'online mov converter'],
  openGraph: {
    title: 'MOV to MP4 Converter - FlipFileX',
    description: 'Convert MOV to MP4 online for free',
    type: 'website',
    url: 'https://flipfilex.com/mov-to-mp4',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOV to MP4 Converter',
    description: 'Convert MOV to MP4 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/mov-to-mp4',
  },
};

export default function MovToMp4Page() {
  return (
    <ConverterPage
      slug="mov-to-mp4"
      sourceFormat="mov"
      targetFormat="mp4"
      category="video"
      title="MOV to MP4 Converter"
    />
  );
}
