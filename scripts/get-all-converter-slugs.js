#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all directories in src/app that match converter pattern
const appDir = path.join(__dirname, '..', 'file', 'src', 'app');
const directories = fs.readdirSync(appDir, { withFileTypes: true });

const converterSlugs = directories
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .filter(name => name.includes('-to-'))
  .sort();

console.log('// All converter page slugs');
console.log(`// Total: ${converterSlugs.length} converters\n`);

// Group by category
const imageConverters = converterSlugs.filter(s => {
  const formats = ['jpg', 'png', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'ico', 'svg', 'heic', 'psd', 'raw', 'cr2', 'nef', 'dng'];
  const [from] = s.split('-to-');
  return formats.includes(from);
});

const documentConverters = converterSlugs.filter(s => {
  const formats = ['docx', 'pdf', 'txt', 'epub', 'html', 'markdown', 'latex'];
  const [from] = s.split('-to-');
  return formats.includes(from) && !imageConverters.includes(s);
});

const audioConverters = converterSlugs.filter(s => {
  const formats = ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'wma', 'opus'];
  const [from] = s.split('-to-');
  return formats.includes(from);
});

const videoConverters = converterSlugs.filter(s => {
  const formats = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'mpeg'];
  const [from] = s.split('-to-');
  return formats.includes(from);
});

console.log(`// Image Converters (${imageConverters.length})`);
console.log(JSON.stringify(imageConverters, null, 2));

console.log(`\n// Document Converters (${documentConverters.length})`);
console.log(JSON.stringify(documentConverters, null, 2));

console.log(`\n// Audio Converters (${audioConverters.length})`);
console.log(JSON.stringify(audioConverters, null, 2));

console.log(`\n// Video Converters (${videoConverters.length})`);
console.log(JSON.stringify(videoConverters, null, 2));

// Generate array for sitemap
console.log('\n\n// For sitemap.ts:');
console.log('const converterPages = [');
converterSlugs.forEach(slug => {
  console.log(`  '${slug}',`);
});
console.log('];');
