import { Metadata } from 'next';
import DocumentConverter from '@/components/DocumentConverter';
import { getToolMetadata } from '@/lib/toolsConfig';

export const metadata: Metadata = getToolMetadata('powerpoint-to-pdf') || {};

export default function PowerpointToPdfPage() {
  return <DocumentConverter conversionType="powerpoint_to_pdf" />;
}
