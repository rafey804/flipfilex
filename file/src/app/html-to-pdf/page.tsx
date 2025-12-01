import { Metadata } from 'next';
import DocumentConverter from '@/components/DocumentConverter';
import { getToolMetadata } from '@/lib/toolsConfig';

export const metadata: Metadata = getToolMetadata('html-to-pdf') || {};

export default function HtmlToPdfPage() {
  return <DocumentConverter conversionType="html_to_pdf" />;
}
