import { Metadata } from 'next';
import AIVideoScriptWriterClient from './AIVideoScriptWriterClient';

// SEO Metadata
export const metadata: Metadata = {
  title: 'AI Video Script Writer - Generate Professional Video Scripts Online Free | FlipFileX',
  description: 'Create engaging, professional video scripts instantly with our AI-powered video script writer. Perfect for YouTube, TikTok, Instagram, LinkedIn & Facebook. Generate hooks, CTAs, and complete scripts in seconds. Free online tool with SEO optimization.',
  keywords: [
    'AI video script writer',
    'video script generator',
    'YouTube script writer',
    'TikTok script generator',
    'Instagram video script',
    'professional video scripts',
    'free script writer',
    'AI scriptwriting tool',
    'content creator tools',
    'video content generator',
    'script writing AI',
    'video marketing scripts',
    'social media scripts',
    'educational video scripts',
    'motivational scripts',
    'storytelling scripts',
    'video hook generator',
    'CTA generator',
    'script automation',
    'video production tools'
  ],
  authors: [{ name: 'Rafey ul din' }],
  creator: 'Rafey ul din',
  publisher: 'Rafey ul din',
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
  alternates: {
    canonical: 'https://flipfilex.com/ai-video-script-writer',
  },
  openGraph: {
    title: 'AI Video Script Writer - Generate Professional Scripts Free',
    description: 'Create professional video scripts for YouTube, TikTok, Instagram & more. AI-powered script generation with hooks, CTAs, and platform-specific optimization.',
    url: 'https://flipfilex.com/ai-video-script-writer',
    siteName: 'FlipFileX',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://flipfilex.com/og-ai-script-writer.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Video Script Writer Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Video Script Writer - Professional Scripts in Seconds',
    description: 'Generate engaging video scripts with AI. Perfect for content creators on YouTube, TikTok, Instagram & LinkedIn.',
    images: ['https://flipfilex.com/twitter-ai-script-writer.jpg'],
    creator: '@FlipFileX',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'AI Tools',
};

export default function AIVideoScriptWriterPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI Video Script Writer',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Professional AI-powered video script generator for content creators. Generate engaging scripts for YouTube, TikTok, Instagram, LinkedIn, and Facebook with customizable tones and platform-specific optimization.',
    featureList: [
      'AI-powered script generation',
      'Multiple tone options (Professional, Casual, Humorous, Educational, Motivational, Storytelling)',
      'Platform-specific optimization',
      'Hook and CTA generation',
      'Visual and music cues',
      'Thumbnail suggestions',
      'SEO keyword generation',
      'Instant results',
      'No signup required',
      'Free to use'
    ],
    screenshot: 'https://flipfilex.com/screenshots/ai-script-writer.jpg',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '2847',
      bestRating: '5',
      worstRating: '1'
    },
    author: {
      '@type': 'Organization',
      name: 'FlipFileX',
      url: 'https://flipfilex.com'
    }
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is an AI Video Script Writer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'An AI Video Script Writer is an intelligent tool that automatically generates professional, engaging video scripts based on your topic, desired duration, tone, and target platform. It creates complete scripts with hooks, introductions, main content, CTAs, and outros.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which platforms are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI script writer supports YouTube, TikTok, Instagram, Facebook, and LinkedIn. Each platform has optimized script formatting and length recommendations based on best practices.'
        }
      },
      {
        '@type': 'Question',
        name: 'What tone options are available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can choose from Professional, Casual, Humorous, Educational, Motivational, and Storytelling tones. Each tone adapts the language, style, and delivery approach to match your content goals.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is the AI Video Script Writer free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Our AI Video Script Writer is completely free to use with no signup required. Generate unlimited scripts for your content creation needs.'
        }
      },
      {
        '@type': 'Question',
        name: 'What does the generated script include?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Each script includes: an attention-grabbing hook, introduction, structured main content with 3-5 key points, visual and music cues, call-to-action, outro, thumbnail suggestions, and SEO keywords. Scripts are formatted with timestamps for easy video production.'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <AIVideoScriptWriterClient />
    </>
  );
}
