import { Metadata } from 'next';
import DocumentConverter from '@/components/DocumentConverter';
import { getToolMetadata } from '@/lib/toolsConfig';

export const metadata: Metadata = getToolMetadata('text-to-pdf') || {};

export default function TextToPdfPage() {
  return <DocumentConverter conversionType="text_to_pdf" />;
}
