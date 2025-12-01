import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getToolBySlug, getAllToolSlugs, getToolMetadata } from '@/lib/toolsConfig';
import { generateToolStructuredData, generateFAQStructuredData, getDefaultFAQs } from '@/lib/structuredData';
import AudioFormatConverter from '@/components/AudioFormatConverter';
import VideoFormatConverter from '@/components/VideoFormatConverter';
import DocumentConverter from '@/components/DocumentConverter';
import SEOOptimizedImageConverter from '@/components/SEOOptimizedImageConverter';
import FontFormatConverter from '@/components/FontFormatConverter';
import PDFCompressor from '@/components/PDFCompressor';
import PDFPasswordProtection from '@/components/PDFPasswordProtection';
import PDFSplitter from '@/components/PDFSplitter';
import EpubToPdfClient from '@/components/EpubToPdfClient';
import URLRedirect from '@/components/URLRedirect';

// Component mapping
const componentMap: Record<string, React.ComponentType<any>> = {
  AudioFormatConverter,
  VideoFormatConverter,
  DocumentConverter,
  SEOOptimizedImageConverter,
  FontFormatConverter,
  PDFCompressor,
  PDFPasswordProtection,
  PDFSplitter,
  EpubToPdfClient,
};

// List of pages that have standalone implementations (with their own metadata)
const standalonePages = [
  'privacy-policy', 'cookies', 'terms', 'ris-to-bibtex', 'stl-to-obj', 'ply-to-obj',
  'image-compressor', 'ocr-image-to-text', 'jwt-token-decoder', 'mathml-to-image',
  'color-palette-generator', 'wav-to-mp3', 'terms-of-service', 'font-converter',
  'pdf-to-images', 'pdf-password-protection', 'excel-to-pdf', 'powerpoint-to-pdf',
  'text-to-pdf', 'html-to-pdf', 'csv-to-excel', 'json-to-csv', 'qr-code-generator',
  'password-generator', 'hash-generator', 'base64-encoder-decoder', 'barcode-generator',
  'tools', 'convert-pdf-to-word-online', 'invoice-generator', 'resume-builder',
  'blog', 'about', 'contact', 'help', 'url-shortener', 'word-to-pdf-online', 'png-to-webp-converter',
  'merge-pdf-files-free', 'defi-yield-calculator', 'shorten-url', 'dwg-to-pdf',
  'split-pdf-pages', 'dicom-to-jpeg', 'step-to-stl'
];

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all tool slugs (optional, for static generation)
export async function generateStaticParams() {
  const slugs = getAllToolSlugs();
  // Filter out standalone pages to avoid conflicts
  const dynamicSlugs = slugs.filter(slug => !standalonePages.includes(slug));
  return dynamicSlugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // If this is a standalone page, don't generate metadata to avoid conflicts
  if (standalonePages.includes(slug)) {
    return {};
  }

  const metadata = getToolMetadata(slug);

  if (!metadata) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.',
    };
  }

  const canonicalUrl = `https://flipfilex.com/${slug}`;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: canonicalUrl,
      siteName: 'FlipFileX',
      type: 'website',
      images: [
        {
          url: 'https://flipfilex.com/og-image.png',
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
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
}

// Helper function to check if it's a shortened URL
async function checkShortUrl(shortCode: string): Promise<string | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const response = await fetch(`${API_URL}/api/url/redirect/${shortCode}`, {
      cache: 'no-store' // Don't cache redirects
    });

    if (response.ok) {
      const data = await response.json();
      return data.original_url;
    }
  } catch (error) {
    console.error('Error checking short URL:', error);
  }
  return null;
}

export default async function DynamicToolPage({ params }: PageProps) {
  const { slug } = await params;

  // First, check if this is a shortened URL
  const originalUrl = await checkShortUrl(slug);
  if (originalUrl) {
    // If it's a shortened URL, show the redirect component
    return <URLRedirect shortCode={slug} />;
  }

  // If this is a standalone page, redirect to 404 since it should be handled by its own route
  if (standalonePages.includes(slug)) {
    notFound();
  }

  const toolConfig = getToolBySlug(slug);

  // If tool not found, return 404
  if (!toolConfig) {
    notFound();
  }

  // Get the component from the component map
  const Component = componentMap[toolConfig.component];

  // If component not found, return 404
  if (!Component) {
    console.error(`Component ${toolConfig.component} not found in component map`);
    notFound();
  }

  // Get metadata for structured data
  const metadata = getToolMetadata(slug);
  if (!metadata) {
    notFound();
  }

  // Generate structured data
  const sourceFormat = toolConfig.props?.sourceFormat || '';
  const targetFormat = toolConfig.props?.targetFormat || '';

  const toolStructuredData = generateToolStructuredData({
    slug,
    title: metadata.title,
    description: metadata.description,
    sourceFormat,
    targetFormat,
    toolType: toolConfig.type,
  });

  const faqs = getDefaultFAQs(sourceFormat, targetFormat);
  const faqStructuredData = generateFAQStructuredData(faqs);

  // Render the component with its props and structured data
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <Component {...toolConfig.props} />
    </>
  );
}
