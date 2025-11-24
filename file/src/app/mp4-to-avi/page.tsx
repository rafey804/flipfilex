import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'MP4 to AVI Converter - Free Online Tool | FlipFileX',
  description: 'Convert MP4 to AVI online for free. Fast, secure, and easy-to-use MP4 to AVI converter with no file size limits.',
  keywords: ['mp4 to avi', 'mp4 converter', 'avi converter', 'convert mp4', 'online mp4 converter'],
  openGraph: {
    title: 'MP4 to AVI Converter - FlipFileX',
    description: 'Convert MP4 to AVI online for free',
    type: 'website',
    url: 'https://flipfilex.com/mp4-to-avi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MP4 to AVI Converter',
    description: 'Convert MP4 to AVI online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/mp4-to-avi',
  },
};

export default function Mp4ToAviPage() {
  return (
    <ConverterPage
      slug="mp4-to-avi"
      sourceFormat="mp4"
      targetFormat="avi"
      category="video"
      title="MP4 to AVI Converter"
    />
  );
}
