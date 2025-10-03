import FontFormatConverter from '@/components/FontFormatConverter';

export const metadata = {
  title: 'Font Converter | Convert TTF, OTF, WOFF, WOFF2 - FlipFileX',
  description: 'Convert font files between different formats like TTF, OTF, WOFF, WOFF2, EOT. Free online font converter with high quality results.',
  keywords: 'font converter, ttf to woff, otf to woff2, font format converter, online font tool',
  openGraph: {
    title: 'Free Online Font Converter - FlipFileX',
    description: 'Convert font files between TTF, OTF, WOFF, WOFF2, and other formats.',
    type: 'website',
    url: 'https://flipfilex.com/font-converter',
  },
};

export default function FontConverterPage() {
  return <FontFormatConverter sourceFormat="ttf" targetFormat="woff" />;
}