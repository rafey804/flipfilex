// Converter Page Configuration Types

export interface ConverterPageConfig {
  // Basic Info
  slug: string;
  title: string;
  sourceFormat: string;
  targetFormat: string;
  category: 'image' | 'document' | 'audio' | 'video' | 'pdf' | 'font' | 'ai';

  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  // Content Sections
  heroTitle: string;
  heroDescription: string;

  // Features
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  // How It Works
  howItWorks: Array<{
    step: number;
    title: string;
    description: string;
  }>;

  // Why Use This Converter
  whyUse: {
    title: string;
    reasons: Array<{
      title: string;
      description: string;
    }>;
  };

  // Use Cases
  useCases: Array<{
    title: string;
    description: string;
    example: string;
  }>;

  // FAQs
  faqs: Array<{
    question: string;
    answer: string;
  }>;

  // Related Converters
  relatedConverters: Array<{
    slug: string;
    title: string;
    description: string;
  }>;

  // Technical Details
  technicalDetails?: {
    inputFormats: string[];
    outputFormats: string[];
    maxFileSize: string;
    features: string[];
  };
}

export interface ConverterCategoryConfig {
  slug: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  converters: string[]; // Array of converter slugs
}
