import { Metadata } from 'next';
import DocumentConverter from '@/components/DocumentConverter';
import { getToolMetadata } from '@/lib/toolsConfig';

export const metadata: Metadata = getToolMetadata('excel-to-pdf') || {};

export default function ExcelToPdfPage() {
  return <DocumentConverter conversionType="excel_to_pdf" />;
}
