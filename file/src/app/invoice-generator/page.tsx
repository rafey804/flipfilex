import { Metadata } from 'next';
import InvoiceGeneratorClient from './InvoiceGeneratorClient';

export const metadata: Metadata = {
  title: 'Free Invoice Generator Online - Create Professional Invoices | FlipFileX',
  description: 'Create professional invoices instantly with our free online invoice generator. Customizable templates, automatic calculations, PDF export, multi-currency support. No registration required, start invoicing now.',
  keywords: [
    'invoice generator',
    'free invoice maker',
    'create invoice online',
    'professional invoice',
    'business invoice generator',
    'pdf invoice maker',
    'invoice template free',
    'online invoicing tool',
    'invoice creator',
    'custom invoice generator',
    'automatic invoice calculator',
    'invoice maker no registration',
    'downloadable invoice',
    'invoice generator with logo',
    'multi-currency invoice',
    'small business invoice',
    'freelance invoice generator',
    'invoice builder',
    'instant invoice maker',
    'free business invoice tool'
  ],
  alternates: {
    canonical: 'https://flipfilex.com/invoice-generator',
  },
  openGraph: {
    title: 'Free Invoice Generator - Create Professional Invoices Online',
    description: 'Generate professional invoices with customizable templates, automatic calculations, and PDF export. Free, fast, and no registration required.',
    url: 'https://flipfilex.com/invoice-generator',
    siteName: 'FlipFileX',
    type: 'website',
    images: [{
      url: 'https://flipfilex.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Invoice Generator - FlipFileX',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Invoice Generator - Create Professional Invoices',
    description: 'Generate professional invoices with customizable templates and automatic calculations. Free and instant.',
    images: ['https://flipfilex.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function InvoiceGeneratorPage() {
  return <InvoiceGeneratorClient />;
}
