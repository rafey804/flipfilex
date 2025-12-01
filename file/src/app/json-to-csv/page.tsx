import { Metadata } from 'next';
import DocumentConverter from '@/components/DocumentConverter';
import { getToolMetadata } from '@/lib/toolsConfig';

export const metadata: Metadata = getToolMetadata('json-to-csv') || {};

export default function JsonToCsvPage() {
  return <DocumentConverter conversionType="json_to_csv" />;
}
