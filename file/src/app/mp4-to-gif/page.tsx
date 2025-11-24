import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'MP4 to GIF Converter - Free Online Tool | FlipFileX',
  description: 'Convert MP4 to GIF online for free. Fast, secure, and easy-to-use MP4 to GIF converter with no file size limits.',
  keywords: ['mp4 to gif', 'mp4 converter', 'gif converter', 'convert mp4', 'online mp4 converter'],
  openGraph: {
    title: 'MP4 to GIF Converter - FlipFileX',
    description: 'Convert MP4 to GIF online for free',
    type: 'website',
    url: 'https://flipfilex.com/mp4-to-gif',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MP4 to GIF Converter',
    description: 'Convert MP4 to GIF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/mp4-to-gif',
  },
};

export default function Mp4ToGifPage() {
  return (
    <ConverterPage
      slug="mp4-to-gif"
      sourceFormat="mp4"
      targetFormat="gif"
      category="video"
      title="MP4 to GIF Converter"
    />
  );
}
