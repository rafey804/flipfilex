import { Metadata } from 'next';
import DocumentConverter from '@/components/DocumentConverter';
import { getToolMetadata } from '@/lib/toolsConfig';

export const metadata: Metadata = getToolMetadata('csv-to-excel') || {};

export default function CsvToExcelPage() {
  return <DocumentConverter conversionType="csv_to_excel" />;
}
