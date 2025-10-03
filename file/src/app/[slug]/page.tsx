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

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
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
