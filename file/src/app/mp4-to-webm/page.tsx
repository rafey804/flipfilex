import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'MP4 to WebM Converter - Free Online Tool | FlipFileX',
  description: 'Convert MP4 to WEBM online for free. Fast, secure, and easy-to-use MP4 to WEBM converter with no file size limits.',
  keywords: ['mp4 to webm', 'mp4 converter', 'webm converter', 'convert mp4', 'online mp4 converter'],
  openGraph: {
    title: 'MP4 to WebM Converter - FlipFileX',
    description: 'Convert MP4 to WEBM online for free',
    type: 'website',
    url: 'https://flipfilex.com/mp4-to-webm',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MP4 to WebM Converter',
    description: 'Convert MP4 to WEBM online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/mp4-to-webm',
  },
};

export default function Mp4ToWebmPage() {
  return (
    <ConverterPage
      slug="mp4-to-webm"
      sourceFormat="mp4"
      targetFormat="webm"
      category="video"
      title="MP4 to WebM Converter"
    />
  );
}
