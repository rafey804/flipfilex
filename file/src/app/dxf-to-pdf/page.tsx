import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: 'DXF to PDF Converter - Free Online Tool | FlipFileX',
  description: 'Convert DXF to PDF online for free. Fast, secure, and easy-to-use DXF to PDF converter with no file size limits.',
  keywords: ['dxf to pdf', 'dxf converter', 'pdf converter', 'convert dxf', 'online dxf converter'],
  openGraph: {
    title: 'DXF to PDF Converter - FlipFileX',
    description: 'Convert DXF to PDF online for free',
    type: 'website',
    url: 'https://flipfilex.com/dxf-to-pdf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DXF to PDF Converter',
    description: 'Convert DXF to PDF online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/dxf-to-pdf',
  },
};

export default function DxfToPdfPage() {
  return (
    <ConverterPage
      slug="dxf-to-pdf"
      sourceFormat="dxf"
      targetFormat="pdf"
      category="ai"
      title="DXF to PDF Converter"
    />
  );
}
