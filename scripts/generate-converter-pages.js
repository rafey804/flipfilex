#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// All converters that need dedicated pages
const priorityConverters = [
  // Image Converters - Extended
  { slug: 'heic-to-jpg', source: 'heic', target: 'jpg', category: 'image', title: 'HEIC to JPG Converter' },
  { slug: 'jpg-to-png', source: 'jpg', target: 'png', category: 'image', title: 'JPG to PNG Converter' },
  { slug: 'png-to-jpg', source: 'png', target: 'jpg', category: 'image', title: 'PNG to JPG Converter' },
  { slug: 'webp-to-png', source: 'webp', target: 'png', category: 'image', title: 'WebP to PNG Converter' },
  { slug: 'webp-to-jpg', source: 'webp', target: 'jpg', category: 'image', title: 'WebP to JPG Converter' },
  { slug: 'jpg-to-webp', source: 'jpg', target: 'webp', category: 'image', title: 'JPG to WebP Converter' },
  { slug: 'png-to-webp', source: 'png', target: 'webp', category: 'image', title: 'PNG to WebP Converter' },
  { slug: 'avif-to-jpg', source: 'avif', target: 'jpg', category: 'image', title: 'AVIF to JPG Converter' },
  { slug: 'avif-to-png', source: 'avif', target: 'png', category: 'image', title: 'AVIF to PNG Converter' },
  { slug: 'svg-to-png', source: 'svg', target: 'png', category: 'image', title: 'SVG to PNG Converter' },
  { slug: 'svg-to-jpg', source: 'svg', target: 'jpg', category: 'image', title: 'SVG to JPG Converter' },
  { slug: 'gif-to-png', source: 'gif', target: 'png', category: 'image', title: 'GIF to PNG Converter' },
  { slug: 'gif-to-jpg', source: 'gif', target: 'jpg', category: 'image', title: 'GIF to JPG Converter' },
  { slug: 'bmp-to-jpg', source: 'bmp', target: 'jpg', category: 'image', title: 'BMP to JPG Converter' },
  { slug: 'bmp-to-png', source: 'bmp', target: 'png', category: 'image', title: 'BMP to PNG Converter' },
  { slug: 'tiff-to-jpg', source: 'tiff', target: 'jpg', category: 'image', title: 'TIFF to JPG Converter' },
  { slug: 'tiff-to-png', source: 'tiff', target: 'png', category: 'image', title: 'TIFF to PNG Converter' },
  { slug: 'ico-to-png', source: 'ico', target: 'png', category: 'image', title: 'ICO to PNG Converter' },
  { slug: 'psd-to-jpg', source: 'psd', target: 'jpg', category: 'image', title: 'PSD to JPG Converter' },
  { slug: 'psd-to-png', source: 'psd', target: 'png', category: 'image', title: 'PSD to PNG Converter' },

  // Document Converters - Extended
  { slug: 'epub-to-pdf', source: 'epub', target: 'pdf', category: 'document', title: 'EPUB to PDF Converter' },
  { slug: 'docx-to-epub', source: 'docx', target: 'epub', category: 'document', title: 'DOCX to EPUB Converter' },
  { slug: 'docx-to-pdf', source: 'docx', target: 'pdf', category: 'document', title: 'DOCX to PDF Converter' },
  { slug: 'pdf-to-docx', source: 'pdf', target: 'docx', category: 'document', title: 'PDF to DOCX Converter' },
  { slug: 'pdf-to-txt', source: 'pdf', target: 'txt', category: 'document', title: 'PDF to TXT Converter' },
  { slug: 'txt-to-epub', source: 'txt', target: 'epub', category: 'document', title: 'TXT to EPUB Converter' },
  { slug: 'txt-to-pdf', source: 'txt', target: 'pdf', category: 'document', title: 'TXT to PDF Converter' },
  { slug: 'mobi-to-epub', source: 'mobi', target: 'epub', category: 'document', title: 'MOBI to EPUB Converter' },
  { slug: 'latex-to-pdf', source: 'latex', target: 'pdf', category: 'document', title: 'LaTeX to PDF Converter' },
  { slug: 'html-to-docx', source: 'html', target: 'docx', category: 'document', title: 'HTML to DOCX Converter' },
  { slug: 'html-to-pdf', source: 'html', target: 'pdf', category: 'document', title: 'HTML to PDF Converter' },
  { slug: 'markdown-to-pdf', source: 'md', target: 'pdf', category: 'document', title: 'Markdown to PDF Converter' },
  { slug: 'markdown-to-html', source: 'md', target: 'html', category: 'document', title: 'Markdown to HTML Converter' },

  // PDF Tools - Extended
  { slug: 'compress-pdf', source: 'pdf', target: 'pdf', category: 'pdf', title: 'Compress PDF' },
  { slug: 'merge-pdf', source: 'pdf', target: 'pdf', category: 'pdf', title: 'Merge PDF Files' },
  { slug: 'split-pdf', source: 'pdf', target: 'pdf', category: 'pdf', title: 'Split PDF Files' },
  { slug: 'pdf-to-excel', source: 'pdf', target: 'xlsx', category: 'pdf', title: 'PDF to Excel Converter' },
  { slug: 'pdf-to-jpg', source: 'pdf', target: 'jpg', category: 'pdf', title: 'PDF to JPG Converter' },
  { slug: 'pdf-to-png', source: 'pdf', target: 'png', category: 'pdf', title: 'PDF to PNG Converter' },
  { slug: 'excel-to-pdf', source: 'xlsx', target: 'pdf', category: 'pdf', title: 'Excel to PDF Converter' },

  // Audio Converters - Extended
  { slug: 'mp3-to-wav', source: 'mp3', target: 'wav', category: 'audio', title: 'MP3 to WAV Converter' },
  { slug: 'wav-to-mp3', source: 'wav', target: 'mp3', category: 'audio', title: 'WAV to MP3 Converter' },
  { slug: 'flac-to-mp3', source: 'flac', target: 'mp3', category: 'audio', title: 'FLAC to MP3 Converter' },
  { slug: 'flac-to-wav', source: 'flac', target: 'wav', category: 'audio', title: 'FLAC to WAV Converter' },
  { slug: 'aac-to-mp3', source: 'aac', target: 'mp3', category: 'audio', title: 'AAC to MP3 Converter' },
  { slug: 'm4a-to-mp3', source: 'm4a', target: 'mp3', category: 'audio', title: 'M4A to MP3 Converter' },
  { slug: 'ogg-to-mp3', source: 'ogg', target: 'mp3', category: 'audio', title: 'OGG to MP3 Converter' },
  { slug: 'wma-to-mp3', source: 'wma', target: 'mp3', category: 'audio', title: 'WMA to MP3 Converter' },
  { slug: 'opus-to-mp3', source: 'opus', target: 'mp3', category: 'audio', title: 'Opus to MP3 Converter' },
  { slug: 'mp3-to-flac', source: 'mp3', target: 'flac', category: 'audio', title: 'MP3 to FLAC Converter' },
  { slug: 'mp3-to-ogg', source: 'mp3', target: 'ogg', category: 'audio', title: 'MP3 to OGG Converter' },

  // Video Converters - Extended
  { slug: 'mp4-to-avi', source: 'mp4', target: 'avi', category: 'video', title: 'MP4 to AVI Converter' },
  { slug: 'avi-to-mp4', source: 'avi', target: 'mp4', category: 'video', title: 'AVI to MP4 Converter' },
  { slug: 'mov-to-mp4', source: 'mov', target: 'mp4', category: 'video', title: 'MOV to MP4 Converter' },
  { slug: 'mkv-to-mp4', source: 'mkv', target: 'mp4', category: 'video', title: 'MKV to MP4 Converter' },
  { slug: 'webm-to-mp4', source: 'webm', target: 'mp4', category: 'video', title: 'WebM to MP4 Converter' },
  { slug: 'mp4-to-webm', source: 'mp4', target: 'webm', category: 'video', title: 'MP4 to WebM Converter' },
  { slug: 'mp4-to-gif', source: 'mp4', target: 'gif', category: 'video', title: 'MP4 to GIF Converter' },
  { slug: 'flv-to-mp4', source: 'flv', target: 'mp4', category: 'video', title: 'FLV to MP4 Converter' },
  { slug: 'wmv-to-mp4', source: 'wmv', target: 'mp4', category: 'video', title: 'WMV to MP4 Converter' },
  { slug: 'mpeg-to-mp4', source: 'mpeg', target: 'mp4', category: 'video', title: 'MPEG to MP4 Converter' },

  // Font Converters
  { slug: 'ttf-to-woff', source: 'ttf', target: 'woff', category: 'font', title: 'TTF to WOFF Converter' },
  { slug: 'ttf-to-woff2', source: 'ttf', target: 'woff2', category: 'font', title: 'TTF to WOFF2 Converter' },
  { slug: 'otf-to-ttf', source: 'otf', target: 'ttf', category: 'font', title: 'OTF to TTF Converter' },
  { slug: 'woff-to-ttf', source: 'woff', target: 'ttf', category: 'font', title: 'WOFF to TTF Converter' },

  // 3D/CAD Converters
  { slug: 'stl-to-obj', source: 'stl', target: 'obj', category: 'ai', title: 'STL to OBJ Converter' },
  { slug: 'obj-to-stl', source: 'obj', target: 'stl', category: 'ai', title: 'OBJ to STL Converter' },
  { slug: 'dxf-to-pdf', source: 'dxf', target: 'pdf', category: 'ai', title: 'DXF to PDF Converter' },
  { slug: 'dwg-to-pdf', source: 'dwg', target: 'pdf', category: 'ai', title: 'DWG to PDF Converter' },
];

// Template for page.tsx
const pageTemplate = (config) => `import { Metadata } from 'next';
import ConverterPage from '@/components/ConverterPageTemplate';

export const metadata: Metadata = {
  title: '${config.title} - Free Online Tool | FlipFileX',
  description: 'Convert ${config.source.toUpperCase()} to ${config.target.toUpperCase()} online for free. Fast, secure, and easy-to-use ${config.source.toUpperCase()} to ${config.target.toUpperCase()} converter with no file size limits.',
  keywords: ['${config.source} to ${config.target}', '${config.source} converter', '${config.target} converter', 'convert ${config.source}', 'online ${config.source} converter'],
  openGraph: {
    title: '${config.title} - FlipFileX',
    description: 'Convert ${config.source.toUpperCase()} to ${config.target.toUpperCase()} online for free',
    type: 'website',
    url: 'https://flipfilex.com/${config.slug}',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${config.title}',
    description: 'Convert ${config.source.toUpperCase()} to ${config.target.toUpperCase()} online for free',
  },
  alternates: {
    canonical: 'https://flipfilex.com/${config.slug}',
  },
};

export default function ${config.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Page() {
  return (
    <ConverterPage
      slug="${config.slug}"
      sourceFormat="${config.source}"
      targetFormat="${config.target}"
      category="${config.category}"
      title="${config.title}"
    />
  );
}
`;

// Create directories and files
console.log('🚀 Starting to generate converter pages...\n');

const appDir = path.join(__dirname, '..', 'file', 'src', 'app');
let created = 0;
let skipped = 0;

priorityConverters.forEach(config => {
  const dirPath = path.join(appDir, config.slug);
  const filePath = path.join(dirPath, 'page.tsx');

  // Check if directory already exists
  if (fs.existsSync(dirPath)) {
    console.log(`⏭️  Skipped: ${config.slug} (already exists)`);
    skipped++;
    return;
  }

  // Create directory
  fs.mkdirSync(dirPath, { recursive: true });

  // Create page.tsx
  fs.writeFileSync(filePath, pageTemplate(config));

  console.log(`✅ Created: ${config.slug}`);
  created++;
});

console.log(`\n✨ Done! Created ${created} new pages, skipped ${skipped} existing pages.`);
console.log(`\n📝 Next steps:`);
console.log(`1. Create the ConverterPageTemplate component`);
console.log(`2. Run 'npm run dev' to test the new pages`);
console.log(`3. Update your sitemap to include these pages`);
