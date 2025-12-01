import { Metadata } from 'next';
import ImageCompressorClient from './ImageCompressorClient';

export const metadata: Metadata = {
  title: 'Free Image Compressor | FlipFileX - Reduce File Size by 90%',
  description: 'Compress images online for free with FlipFileX. Reduce JPEG, PNG, WebP file sizes by up to 90% while maintaining quality. Professional image compression tool with live preview.',
  keywords: 'image compressor, compress images online, reduce image size, image optimizer, JPEG compression, PNG compression, WebP compression, free image tools, FlipFileX, photo compressor, web optimization, file size reducer, batch compression, lossless compression',
  authors: [{ name: 'FlipFileX' }],
  openGraph: {
    title: 'Free Image Compressor | FlipFileX - Reduce File Size by 90%',
    description: 'Professional image compression tool. Compress JPEG, PNG, WebP images online for free with live preview and up to 90% size reduction. Secure processing with instant results.',
    url: 'https://flipfilex.com/image-compressor',
    siteName: 'FlipFileX',
    images: [
      {
        url: 'https://flipfilex.com/images/image-compressor-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Free Image Compressor',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Compressor | FlipFileX - Reduce File Size by 90%',
    description: 'Compress images online for free. Professional tool with live preview, secure processing, and up to 90% size reduction.',
    images: ['https://flipfilex.com/images/image-compressor-preview.jpg'],
  },
  alternates: {
    canonical: 'https://flipfilex.com/image-compressor',
  },
};

export default function ImageCompressorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Image Compressor",
            "url": "https://flipfilex.com/image-compressor",
            "description": "Professional online image compression tool that reduces file sizes by up to 90% while maintaining quality. Supports JPEG, PNG, WebP formats.",
            "applicationCategory": "Multimedia",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "publisher": {
              "@type": "Organization",
              "name": "FlipFileX",
              "url": "https://flipfilex.com"
            }
          })
        }}
      />
      <ImageCompressorClient />
    </>
  );
}