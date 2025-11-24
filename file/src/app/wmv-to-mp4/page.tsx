import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'WMV to MP4 Converter - Free Online Tool | FlipFileX',
  description: 'Convert WMV to MP4 online for free. Fast, secure, and easy-to-use WMV to MP4 converter with no file size limits.',
  keywords: ['wmv to mp4', 'wmv converter', 'mp4 converter', 'convert wmv', 'online wmv converter'],
  openGraph: {
    title: 'WMV to MP4 Converter - FlipFileX',
    description: 'Convert WMV to MP4 online for free',
    type: 'website',
    url: 'https://flipfilex.com/wmv-to-mp4',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WMV to MP4 Converter',
    description: 'Convert WMV to MP4 online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/wmv-to-mp4',
  },
};

export default function WmvToMp4Page() {
  return (
    <ConverterPage
      slug="wmv-to-mp4"
      sourceFormat="wmv"
      targetFormat="mp4"
      category="video"
      title="WMV to MP4 Converter"
    />
  );
}
