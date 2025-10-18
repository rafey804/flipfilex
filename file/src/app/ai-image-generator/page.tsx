import { Metadata } from 'next';
import AIImageGeneratorClient from './AIImageGeneratorClient';

// SEO Metadata
export const metadata: Metadata = {
  title: 'AI Image Generator - Create Stunning Images from Text Free | FlipFileX',
  description: 'Generate beautiful, professional images from text descriptions using AI. Create realistic photos, digital art, anime, 3D renders, and more. Free AI-powered image generator with multiple styles and sizes.',
  keywords: [
    'AI image generator',
    'text to image AI',
    'AI art generator',
    'image generation',
    'AI picture creator',
    'free AI image maker',
    'digital art AI',
    'AI photo generator',
    'realistic image AI',
    'anime art generator',
    '3D render AI',
    'AI illustration generator',
    'prompt to image',
    'AI design tool',
    'creative AI',
    'image synthesis',
    'AI artwork',
    'content creation AI',
    'marketing images AI',
    'social media images'
  ],
  authors: [{ name: 'Rafey ul din' }],
  creator: 'Rafey ul din ',
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
    canonical: 'https://flipfilex.com/ai-image-generator',
  },
  openGraph: {
    title: 'AI Image Generator - Create Stunning Images from Text',
    description: 'Generate professional images from text using AI. Multiple styles including realistic, artistic, anime, 3D, watercolor, and more. Free and easy to use.',
    url: 'https://flipfilex.com/ai-image-generator',
    siteName: 'FlipFileX',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://flipfilex.com/og-ai-image-generator.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Image Generator Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Image Generator - Transform Text to Stunning Images',
    description: 'Create professional images from text descriptions with AI. Multiple styles, sizes, and customization options.',
    images: ['https://flipfilex.com/twitter-ai-image-generator.jpg'],
    creator: '@FlipFileX',
  },
  verification: {
    google: '5XJNsNLnPHPvtfmI-dLp8pVKl053JPfj6b8G4rLi-cw',
  },
  category: 'AI Tools',
};

export default function AIImageGeneratorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI Image Generator',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Professional AI-powered image generator that creates stunning visuals from text descriptions. Generate realistic photos, digital art, anime, 3D renders, watercolor paintings, sketches, and fantasy art with customizable styles and sizes.',
    featureList: [
      'AI-powered image generation',
      'Multiple style options (Realistic, Artistic, Digital Art, Anime, 3D, Watercolor, Sketch, Fantasy)',
      'Multiple size options (512x512 to 1920x1080)',
      'Negative prompt support',
      'High-quality output',
      'Fast generation',
      'No signup required',
      'Free to use',
      'Professional guidance',
      'SEO-optimized suggestions'
    ],
    screenshot: 'https://flipfilex.com/screenshots/ai-image-generator.jpg',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '3241',
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
        name: 'What is an AI Image Generator?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'An AI Image Generator is an intelligent tool that creates images from text descriptions using artificial intelligence. Simply describe what you want to see, choose a style, and the AI generates a professional image based on your input.'
        }
      },
      {
        '@type': 'Question',
        name: 'What styles are available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI supports 8 different styles: Realistic (photorealistic), Artistic (painterly), Digital Art (modern), Anime (manga-inspired), 3D Render (CGI), Watercolor (soft painting), Sketch (hand-drawn), and Fantasy (magical/ethereal).'
        }
      },
      {
        '@type': 'Question',
        name: 'What sizes can I generate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Available sizes include: Square Small (512x512), Square Medium (1024x1024), Portrait (768x1024), Landscape (1024x768), and Wide (1920x1080). Choose the size that best fits your needs.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is the AI Image Generator free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Our AI Image Generator provides professional image generation guidance completely free with no signup required. Use it for content creation, design, marketing, and more.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I get the best results?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Be specific and detailed in your prompts. Include information about subject, setting, lighting, mood, colors, and style. Use negative prompts to exclude unwanted elements. Start with "A detailed [subject] [action] in [setting] with [lighting/mood]".'
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
      <AIImageGeneratorClient />
    </>
  );
}
