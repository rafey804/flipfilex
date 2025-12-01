import { Metadata } from 'next';
import QRCodeGeneratorClient from './QRCodeGeneratorClient';

export const metadata: Metadata = {
  title: 'Free QR Code Generator Online | Custom QR Codes with Logo & Colors',
  description: 'Generate free QR codes instantly with our advanced QR code generator. Create custom QR codes for URLs, WiFi, vCard, text & more. Multiple formats (PNG, SVG, PDF), colors, styles. No registration required.',
  keywords: 'QR code generator, free QR code, create QR code, QR code maker, custom QR code, QR code with logo, colored QR code, QR generator online, URL to QR code, WiFi QR code, vCard QR code, business card QR, QR code PNG, QR code SVG, QR code PDF, dynamic QR code, barcode generator, QR scanner, QR code customization, free online QR generator, no registration QR code, instant QR code',
  authors: [{ name: 'FlipFileX' }],
  openGraph: {
    title: 'Free QR Code Generator - Create Custom QR Codes Instantly',
    description: 'Generate professional QR codes with custom colors, styles & formats. Support for URLs, WiFi, vCard, text & more. Free, instant, no registration.',
    url: 'https://flipfilex.com/qr-code-generator',
    siteName: 'FlipFileX',
    images: [
      {
        url: 'https://flipfilex.com/og-qr-generator.png',
        width: 1200,
        height: 630,
        alt: 'QR Code Generator - Create Custom QR Codes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free QR Code Generator | Custom QR Codes',
    description: 'Create professional QR codes with custom colors, styles & formats. Free & instant.',
    images: ['https://flipfilex.com/og-qr-generator.png'],
    creator: '@flipfilex',
  },
  alternates: {
    canonical: 'https://flipfilex.com/qr-code-generator',
  },
};

export default function QRCodeGeneratorPage() {
  return <QRCodeGeneratorClient />;
}