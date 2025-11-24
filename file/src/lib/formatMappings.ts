// Format conversion mappings - defines which formats can convert to which target formats

export interface FormatConversion {
  from: string;
  to: string[];
  category: 'image' | 'document' | 'audio' | 'video' | 'pdf' | 'font' | 'ai';
}

// All supported format conversions
export const formatConversions: FormatConversion[] = [
  // Image formats - Comprehensive conversions
  { from: 'jpg', to: ['png', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'ico', 'svg'], category: 'image' },
  { from: 'jpeg', to: ['png', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'ico', 'svg'], category: 'image' },
  { from: 'png', to: ['jpg', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'ico', 'svg'], category: 'image' },
  { from: 'webp', to: ['jpg', 'png', 'avif', 'gif', 'bmp', 'tiff', 'ico', 'svg'], category: 'image' },
  { from: 'avif', to: ['jpg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'ico', 'svg'], category: 'image' },
  { from: 'gif', to: ['jpg', 'png', 'webp', 'avif', 'bmp', 'tiff', 'ico', 'svg'], category: 'image' },
  { from: 'bmp', to: ['jpg', 'png', 'webp', 'avif', 'gif', 'tiff', 'ico', 'svg'], category: 'image' },
  { from: 'tiff', to: ['jpg', 'png', 'webp', 'avif', 'gif', 'bmp', 'ico', 'svg'], category: 'image' },
  { from: 'ico', to: ['jpg', 'png', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'svg'], category: 'image' },
  { from: 'svg', to: ['jpg', 'png', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'ico'], category: 'image' },
  { from: 'heic', to: ['jpg', 'png', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'svg'], category: 'image' },
  { from: 'psd', to: ['jpg', 'png', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'svg'], category: 'image' },
  { from: 'raw', to: ['jpg', 'png', 'webp', 'avif', 'tiff'], category: 'image' },
  { from: 'cr2', to: ['jpg', 'png', 'webp', 'tiff'], category: 'image' },
  { from: 'nef', to: ['jpg', 'png', 'webp', 'tiff'], category: 'image' },
  { from: 'dng', to: ['jpg', 'png', 'webp', 'tiff'], category: 'image' },

  // Document formats
  { from: 'docx', to: ['pdf', 'epub', 'txt', 'html'], category: 'document' },
  { from: 'pdf', to: ['docx', 'txt', 'jpg', 'png', 'excel'], category: 'document' },
  { from: 'txt', to: ['pdf', 'epub', 'docx'], category: 'document' },
  { from: 'epub', to: ['pdf'], category: 'document' },
  { from: 'mobi', to: ['epub'], category: 'document' },
  { from: 'latex', to: ['pdf'], category: 'document' },
  { from: 'html', to: ['docx', 'pdf'], category: 'document' },
  { from: 'markdown', to: ['pdf', 'html'], category: 'document' },
  { from: 'xlsx', to: ['pdf', 'csv'], category: 'document' },
  { from: 'xls', to: ['pdf', 'csv'], category: 'document' },
  { from: 'pptx', to: ['pdf'], category: 'document' },
  { from: 'ppt', to: ['pdf'], category: 'document' },
  { from: 'csv', to: ['xlsx', 'json'], category: 'document' },
  { from: 'json', to: ['csv'], category: 'document' },

  // PDF operations
  { from: 'pdf', to: ['compressed', 'merged', 'split'], category: 'pdf' },

  // Audio formats
  { from: 'mp3', to: ['wav', 'flac', 'ogg'], category: 'audio' },
  { from: 'wav', to: ['mp3'], category: 'audio' },
  { from: 'flac', to: ['mp3', 'wav'], category: 'audio' },
  { from: 'aac', to: ['mp3'], category: 'audio' },
  { from: 'm4a', to: ['mp3'], category: 'audio' },
  { from: 'ogg', to: ['mp3'], category: 'audio' },
  { from: 'wma', to: ['mp3'], category: 'audio' },
  { from: 'opus', to: ['mp3'], category: 'audio' },

  // Video formats
  { from: 'mp4', to: ['avi', 'webm', 'gif'], category: 'video' },
  { from: 'avi', to: ['mp4'], category: 'video' },
  { from: 'mov', to: ['mp4'], category: 'video' },
  { from: 'mkv', to: ['mp4'], category: 'video' },
  { from: 'webm', to: ['mp4'], category: 'video' },
  { from: 'flv', to: ['mp4'], category: 'video' },
  { from: 'wmv', to: ['mp4'], category: 'video' },
  { from: 'mpeg', to: ['mp4'], category: 'video' },

  // Font formats - Comprehensive conversions
  { from: 'ttf', to: ['woff', 'woff2', 'otf'], category: 'font' },
  { from: 'otf', to: ['ttf', 'woff', 'woff2'], category: 'font' },
  { from: 'woff', to: ['ttf', 'otf', 'woff2'], category: 'font' },
  { from: 'woff2', to: ['ttf', 'otf', 'woff'], category: 'font' },
  { from: 'eot', to: ['ttf', 'otf', 'woff', 'woff2'], category: 'font' },

  // AI/3D formats
  { from: 'stl', to: ['obj'], category: 'ai' },
  { from: 'obj', to: ['stl'], category: 'ai' },
  { from: 'dxf', to: ['pdf'], category: 'ai' },
  { from: 'dwg', to: ['pdf'], category: 'ai' },
];

// Get all unique source formats
export function getAllSourceFormats(): string[] {
  const formats = formatConversions.map(conv => conv.from);
  return [...new Set(formats)].sort();
}

// Get target formats for a given source format
export function getTargetFormats(sourceFormat: string): string[] {
  const conversion = formatConversions.find(
    conv => conv.from.toLowerCase() === sourceFormat.toLowerCase()
  );
  return conversion ? conversion.to : [];
}

// Get category for a format
export function getFormatCategory(format: string): string {
  const conversion = formatConversions.find(
    conv => conv.from.toLowerCase() === format.toLowerCase()
  );
  return conversion ? conversion.category : 'document';
}

// Get all formats by category
export function getFormatsByCategory(category: string): string[] {
  return formatConversions
    .filter(conv => conv.category === category)
    .map(conv => conv.from)
    .sort();
}

// Check if a conversion is supported
export function isConversionSupported(from: string, to: string): boolean {
  const conversion = formatConversions.find(
    conv => conv.from.toLowerCase() === from.toLowerCase()
  );
  if (!conversion) return false;
  return conversion.to.some(t => t.toLowerCase() === to.toLowerCase());
}

// Get slug for a conversion
export function getConversionSlug(from: string, to: string): string {
  // Handle special cases
  if (from === 'pdf' && to === 'compressed') return 'compress-pdf';
  if (from === 'pdf' && to === 'merged') return 'merge-pdf';
  if (from === 'pdf' && to === 'split') return 'split-pdf';
  if (from === 'pdf' && to === 'excel') return 'pdf-to-excel';

  return `${from.toLowerCase()}-to-${to.toLowerCase()}`;
}

// Format display names
export const formatDisplayNames: Record<string, string> = {
  'jpg': 'JPG',
  'jpeg': 'JPEG',
  'png': 'PNG',
  'webp': 'WebP',
  'avif': 'AVIF',
  'heic': 'HEIC',
  'svg': 'SVG',
  'gif': 'GIF',
  'bmp': 'BMP',
  'tiff': 'TIFF',
  'ico': 'ICO',
  'psd': 'PSD',
  'pdf': 'PDF',
  'docx': 'DOCX',
  'doc': 'DOC',
  'txt': 'TXT',
  'rtf': 'RTF',
  'odt': 'ODT',
  'epub': 'EPUB',
  'mobi': 'MOBI',
  'latex': 'LaTeX',
  'tex': 'TeX',
  'html': 'HTML',
  'htm': 'HTM',
  'markdown': 'Markdown',
  'md': 'MD',
  'xlsx': 'XLSX',
  'xls': 'XLS',
  'xlsm': 'XLSM',
  'pptx': 'PPTX',
  'ppt': 'PPT',
  'pptm': 'PPTM',
  'csv': 'CSV',
  'json': 'JSON',
  'mp3': 'MP3',
  'wav': 'WAV',
  'flac': 'FLAC',
  'aac': 'AAC',
  'm4a': 'M4A',
  'ogg': 'OGG',
  'wma': 'WMA',
  'opus': 'Opus',
  'mp4': 'MP4',
  'avi': 'AVI',
  'mov': 'MOV',
  'mkv': 'MKV',
  'webm': 'WebM',
  'flv': 'FLV',
  'wmv': 'WMV',
  'mpeg': 'MPEG',
  'ttf': 'TTF',
  'woff': 'WOFF',
  'woff2': 'WOFF2',
  'otf': 'OTF',
  'eot': 'EOT',
  'stl': 'STL',
  'obj': 'OBJ',
  'dxf': 'DXF',
  'dwg': 'DWG',
  'compressed': 'Compressed PDF',
  'merged': 'Merged PDF',
  'split': 'Split PDF',
  'excel': 'Excel',
  'raw': 'RAW',
  'cr2': 'CR2',
  'nef': 'NEF',
  'dng': 'DNG',
};

// Get display name for a format
export function getFormatDisplayName(format: string): string {
  return formatDisplayNames[format.toLowerCase()] || format.toUpperCase();
}

// Category display names and icons
export const categoryInfo = {
  image: { name: 'Image', icon: '📷' },
  document: { name: 'Document', icon: '📄' },
  pdf: { name: 'PDF Tools', icon: '📕' },
  audio: { name: 'Audio', icon: '🎵' },
  video: { name: 'Video', icon: '🎬' },
  font: { name: 'Font', icon: '🔤' },
  ai: { name: '3D/CAD', icon: '🎨' },
};
