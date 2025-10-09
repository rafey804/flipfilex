import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getToolBySlug, getAllToolSlugs, getToolMetadata } from '@/lib/toolsConfig';
import AudioFormatConverter from '@/components/AudioFormatConverter';
import VideoFormatConverter from '@/components/VideoFormatConverter';
import DocumentConverter from '@/components/DocumentConverter';
import SEOOptimizedImageConverter from '@/components/SEOOptimizedImageConverter';
import FontFormatConverter from '@/components/FontFormatConverter';
import PDFCompressor from '@/components/PDFCompressor';
import PDFPasswordProtection from '@/components/PDFPasswordProtection';
import PDFSplitter from '@/components/PDFSplitter';
import EpubToPdfClient from '@/components/EpubToPdfClient';

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

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all tool slugs (optional, for static generation)
export async function generateStaticParams() {
  const slugs = getAllToolSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
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

export default async function DynamicToolPage({ params }: PageProps) {
  const { slug } = await params;
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

  // Render the component with its props
  return <Component {...toolConfig.props} />;
}
