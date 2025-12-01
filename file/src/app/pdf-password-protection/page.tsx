import { Metadata } from 'next';
import PdfPasswordProtectionClient from './PdfPasswordProtectionClient';

export const metadata: Metadata = {
  title: 'Free PDF Password Protection | FlipFileX',
  description: 'Add password protection to PDF files for free. Secure your documents with 256-bit AES encryption, prevent unauthorized access, copying, and editing.',
  keywords: 'PDF password protection, secure PDF, encrypt PDF, PDF security, password protect PDF, PDF encryption, secure documents, protect PDF files, PDF privacy, confidential PDFs',
  alternates: {
    canonical: '/pdf-password-protection',
  },
  openGraph: {
    title: 'Free PDF Password Protection | FlipFileX',
    description: 'Add password protection to PDF files for free. Secure your documents with 256-bit AES encryption and prevent unauthorized access.',
    type: 'website',
    url: 'https://flipfilex.com/pdf-password-protection',
    images: [
      {
        url: 'https://flipfilex.com/images/pdf-password-protection-og.jpg',
      },
    ],
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PDF Password Protection | FlipFileX',
    description: 'Add password protection to PDF files for free. Secure your documents with 256-bit AES encryption.',
    images: ['https://flipfilex.com/images/pdf-password-protection-twitter.jpg'],
  },
};

export default function PdfPasswordProtectionPage() {
  return <PdfPasswordProtectionClient />;
}