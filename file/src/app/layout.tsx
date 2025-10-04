import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

// SEO Optimized Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://flipfilex.com'),
  title: {
    default: 'FlipFileX - Free Online File Converter | PDF, Image, Audio, Video Tools',
    template: '%s | FlipFileX'
  },
  description: 'Convert files online for free with FlipFileX. PDF to Word, Image converter (HEIC, WebP, AVIF), Audio converter (WAV, FLAC, MP3), Video converter, and 200+ tools. Fast, secure, no registration required.',
  keywords: [
    'PDF to Word converter', 'Word to PDF', 'PDF converter', 'merge PDF', 'split PDF', 'compress PDF',
    'PDF to JPG', 'PDF to PNG', 'Image to PDF', 'PDF tools', 'free PDF converter',
    'HEIC to JPG', 'WebP to PNG', 'AVIF to PNG', 'image converter', 'PNG to JPG', 'JPG to PNG',
    'SVG to PNG', 'GIF to PNG', 'image compressor', 'resize image', 'convert images online',
    'WAV to MP3', 'FLAC to MP3', 'AAC to MP3', 'audio converter', 'MP3 converter',
    'convert audio online', 'audio format converter', 'free audio converter',
    'MP4 to MOV', 'AVI to MP4', 'video converter', 'convert video online', 'MOV to MP4',
    'video format converter', 'WebM to MP4', 'MKV to MP4',
    'DOCX to PDF', 'Excel to PDF', 'PowerPoint to PDF', 'document converter',
    'EPUB to PDF', 'MOBI to EPUB', 'ebook converter',
    'QR code generator', 'barcode generator', 'password generator', 'URL shortener',
    'Base64 encoder', 'hash generator', 'OCR tool', 'text to speech',
    'resume builder', 'invoice generator', 'font converter',
    'online converter', 'free file converter', 'file conversion tools', 'FlipFileX'
  ],
  authors: [{ name: 'Rafey-ul-din' }],
  creator: 'FlipFileX',
  publisher: 'FlipFileX',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flipfilex.com',
    siteName: 'FlipFileX',
    title: 'FlipFileX - Free Online File Converter | 200+ Tools',
    description: 'Convert files online for free. PDF, Image, Audio, Video converter and 200+ tools. Fast, secure, no registration required.',
    images: [
      {
        url: 'https://flipfilex.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FlipFileX - Free Online File Converter' ,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlipFileX - Free Online File Converter | 200+ Tools',
    description: 'Convert files online for free. PDF, Image, Audio, Video converter and 200+ tools.',
    images: ['https://flipfilex.com/og-image.png'],
    creator: '@flipfilex',
  },
  alternates: {
    canonical: 'https://flipfilex.com',
  },
  verification: {
    google: '5XJNsNLnPHPvtfmI-dLp8pVKl053JPfj6b8G4rLi-cw',
  },
  other: {
    'msvalidate.01': 'DD2808B3DE3ED9BBDE14483A464278E2',
  },
  category: 'technology',
  applicationName: 'FlipFileX',
  appleWebApp: {
    capable: true,
    title: 'FlipFileX',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense - Required in head tag */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8694080572387733"
          crossOrigin="anonymous"></script>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-918R7EMM6E"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-918R7EMM6E');
          `}
        </Script>

        {/* Organization Schema */}
        <Script id="organization-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'FlipFileX',
            alternateName: 'FlipFile X',
            url: 'https://flipfilex.com',
            logo: 'https://flipfilex.com/logo.webp',
            description: 'Free online file converter and digital tools platform with 200+ tools',
            email: 'support@flipfilex.com',
            foundingDate: '2024',
            sameAs: [
              'https://www.facebook.com/flipfilex',
              'https://twitter.com/flipfilex',
              'https://www.linkedin.com/company/flipfilex'
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              email: 'support@flipfilex.com'
            }
          })}
        </Script>

        {/* WebApplication Schema */}
        <Script id="webapp-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'FlipFileX',
            description: 'Free online file converter with 200+ tools for PDF, Image, Audio, Video conversion',
            url: 'https://flipfilex.com',
            applicationCategory: 'Multimedia',
            operatingSystem: 'Any',
            browserRequirements: 'Requires JavaScript',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock'
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '15420',
              bestRating: '5',
              worstRating: '1'
            },
            featureList: [
              'PDF to Word Converter',
              'Image Converter',
              'Video Converter',
              'Audio Converter',
              'QR Code Generator',
              'Password Generator',
              'URL Shortener',
              '200+ Free Tools'
            ]
          })}
        </Script>

        {/* Website Schema */}
        <Script id="website-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'FlipFileX',
            url: 'https://flipfilex.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://flipfilex.com/?search={search_term_string}'
              },
              'query-input': 'required name=search_term_string'
            }
          })}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
