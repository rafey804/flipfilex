// Structured data generation helpers for SEO

export interface ToolStructuredDataProps {
  slug: string;
  title: string;
  description: string;
  sourceFormat?: string;
  targetFormat?: string;
  toolType: 'audio' | 'video' | 'document' | 'image' | 'pdf' | 'other';
}

export function generateToolStructuredData(props: ToolStructuredDataProps) {
  const { slug, title, description, sourceFormat, targetFormat, toolType } = props;
  const baseUrl = 'https://flipfilex.com';
  const url = `${baseUrl}/${slug}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // WebSite schema
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'FlipFileX',
        description: 'Free online file conversion tools - Convert PDF, images, audio, video files instantly',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      // WebPage schema
      {
        '@type': 'WebPage',
        '@id': `${url}/#webpage`,
        url: url,
        name: title,
        description: description,
        isPartOf: {
          '@id': `${baseUrl}/#website`,
        },
        about: {
          '@id': `${url}/#software`,
        },
        datePublished: '2024-01-01T00:00:00+00:00',
        dateModified: new Date().toISOString(),
      },
      // BreadcrumbList schema
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tools',
            item: `${baseUrl}/tools`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title.replace(' | FlipFileX', '').replace(' - FlipFileX', ''),
            item: url,
          },
        ],
      },
      // SoftwareApplication schema
      {
        '@type': 'SoftwareApplication',
        '@id': `${url}/#software`,
        name: title,
        description: description,
        url: url,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: sourceFormat && targetFormat
          ? `Convert ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}, Free online conversion, No registration required, Fast processing, Secure file handling, High quality output`
          : 'Free online tool, No registration required, Fast processing, Secure file handling',
        screenshot: `${baseUrl}/og-image.png`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1250',
          bestRating: '5',
          worstRating: '1',
        },
      },
    ],
  };

  // Add HowTo schema for conversion tools
  if (sourceFormat && targetFormat) {
    structuredData['@graph'].push({
      '@type': 'HowTo',
      name: `How to Convert ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}`,
      description: `Step-by-step guide to convert ${sourceFormat.toUpperCase()} files to ${targetFormat.toUpperCase()} format online for free`,
      step: [
        {
          '@type': 'HowToStep',
          name: `Upload ${sourceFormat.toUpperCase()} file`,
          text: `Click the upload button and select your ${sourceFormat.toUpperCase()} file from your device`,
          position: 1,
        },
        {
          '@type': 'HowToStep',
          name: 'Start conversion',
          text: 'Click the Convert button to begin the conversion process',
          position: 2,
        },
        {
          '@type': 'HowToStep',
          name: `Download ${targetFormat.toUpperCase()} file`,
          text: `Once conversion is complete, download your converted ${targetFormat.toUpperCase()} file`,
          position: 3,
        },
      ],
      totalTime: 'PT1M',
      tool: {
        '@type': 'HowToTool',
        name: 'FlipFileX Converter',
      },
    });
  }

  return structuredData;
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getDefaultFAQs(sourceFormat?: string, targetFormat?: string) {
  if (sourceFormat && targetFormat) {
    return [
      {
        question: `How do I convert ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}?`,
        answer: `Simply upload your ${sourceFormat.toUpperCase()} file using the upload button, click convert, and download your ${targetFormat.toUpperCase()} file. The conversion is free and requires no registration.`,
      },
      {
        question: 'Is it free to use?',
        answer: 'Yes, our conversion tool is completely free to use. There are no hidden charges or subscription fees.',
      },
      {
        question: 'Is my file safe?',
        answer: 'Yes, your files are processed securely and are automatically deleted from our servers after conversion. We take your privacy seriously.',
      },
      {
        question: 'Do I need to register or sign up?',
        answer: 'No registration is required. You can start converting files immediately without creating an account.',
      },
      {
        question: 'What is the maximum file size?',
        answer: 'You can convert files up to 100MB in size. For larger files, please contact our support team.',
      },
      {
        question: 'How long does the conversion take?',
        answer: 'Most conversions complete within seconds, depending on the file size and format. Larger files may take a few minutes.',
      },
    ];
  }

  return [
    {
      question: 'Is this tool free to use?',
      answer: 'Yes, this tool is completely free to use with no hidden charges or subscription fees.',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No, you can use this tool without creating an account or providing any personal information.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we take security seriously. Your files are processed securely and deleted automatically after use.',
    },
  ];
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FlipFileX',
    url: 'https://flipfilex.com',
    logo: 'https://flipfilex.com/logo.png',
    description: 'Free online file conversion tools for PDF, images, audio, video, and documents',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      url: 'https://flipfilex.com/contact',
    },
    sameAs: [
      'https://twitter.com/flipfilex',
      'https://facebook.com/flipfilex',
    ],
  };
}
