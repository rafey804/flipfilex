import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'OBJ to STL Converter - Free Online Tool | FlipFileX',
  description: 'Convert OBJ to STL online for free. Fast, secure, and easy-to-use OBJ to STL converter with no file size limits.',
  keywords: ['obj to stl', 'obj converter', 'stl converter', 'convert obj', 'online obj converter'],
  openGraph: {
    title: 'OBJ to STL Converter - FlipFileX',
    description: 'Convert OBJ to STL online for free',
    type: 'website',
    url: 'https://flipfilex.com/obj-to-stl',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OBJ to STL Converter',
    description: 'Convert OBJ to STL online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/obj-to-stl',
  },
};

export default function ObjToStlPage() {
  return (
    <ConverterPage
      slug="obj-to-stl"
      sourceFormat="obj"
      targetFormat="stl"
      category="ai"
      title="OBJ to STL Converter"
    />
  );
}
