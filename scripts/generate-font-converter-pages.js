#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// All font format conversions
const fontFormats = ['ttf', 'otf', 'woff', 'woff2', 'eot'];

// Generate all combinations
const conversions = [];

fontFormats.forEach(from => {
  fontFormats.forEach(to => {
    if (from !== to) {
      conversions.push({ from, to });
    }
  });
});

// Also add font to SVG (one way only - SVG fonts to regular fonts not common)
fontFormats.forEach(from => {
  if (from !== 'eot') { // EOT to SVG not practical
    conversions.push({ from, to: 'svg' });
  }
});

console.log(`Total font conversions to create: ${conversions.length}`);

// Template for page.tsx
const getPageTemplate = (from, to) => {
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  const slug = `${from}-to-${to}`;

  // Function name formatting
  const fromCamel = from.charAt(0).toUpperCase() + from.slice(1).toLowerCase();
  const toCamel = to.charAt(0).toUpperCase() + to.slice(1).toLowerCase();
  const functionName = `${fromCamel}To${toCamel}Page`;

  const title = `${fromUpper} to ${toUpper} Converter`;

  return `import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: '${title} - Free Online Tool | FlipFileX',
  description: 'Convert ${fromUpper} to ${toUpper} fonts online for free. Fast, secure, and easy-to-use ${fromUpper} to ${toUpper} font converter.',
  keywords: ['${from} to ${to}', '${from} converter', '${to} converter', 'font converter', 'convert ${from}', 'online ${from} converter'],
  openGraph: {
    title: '${title} - FlipFileX',
    description: 'Convert ${fromUpper} to ${toUpper} fonts online for free',
    type: 'website',
    url: 'https://flipfilex.com/${slug}',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${title}',
    description: 'Convert ${fromUpper} to ${toUpper} fonts online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/${slug}',
  },
};

export default function ${functionName}() {
  return (
    <ConverterPage
      slug="${slug}"
      sourceFormat="${from}"
      targetFormat="${to}"
      category="font"
      title="${title}"
    />
  );
}
`;
};

// Create directories and files
let created = 0;
let skipped = 0;

conversions.forEach(({ from, to }) => {
  const slug = `${from}-to-${to}`;
  const dirPath = path.join(__dirname, '..', 'file', 'src', 'app', slug);
  const filePath = path.join(dirPath, 'page.tsx');

  // Check if already exists
  if (fs.existsSync(filePath)) {
    skipped++;
    return;
  }

  // Create directory
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Write file
  fs.writeFileSync(filePath, getPageTemplate(from, to));
  created++;

  if (created % 5 === 0) {
    console.log(`Created ${created} font converter pages...`);
  }
});

console.log(`\n✅ Done!`);
console.log(`   Created: ${created} new font pages`);
console.log(`   Skipped: ${skipped} existing pages`);
console.log(`   Total: ${conversions.length} font converter pages\n`);
