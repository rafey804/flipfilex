// lib/url-utils.ts - Updated utility functions for clean URLs
export const generateConverterUrl = (from: string, to: string): string => {
  return `/${from}-to-${to}`;
};

export const parseConverterUrl = (slug: string): { from: string; to: string } | null => {
  if (!slug.includes('-to-')) {
    return null;
  }

  const parts = slug.split('-');
  const toIndex = parts.lastIndexOf('to');
  
  if (toIndex === -1 || toIndex === 0 || toIndex === parts.length - 1) {
    return null;
  }

  const sourceFormat = parts.slice(0, toIndex).join('-');
  const targetFormat = parts.slice(toIndex + 1).join('-');

  if (!sourceFormat || !targetFormat || sourceFormat === targetFormat) {
    return null;
  }

  return { from: sourceFormat, to: targetFormat };
};

export const isValidImageConversion = (from: string, to: string): boolean => {
  const imageFormats = ['avif', 'webp', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico', 'heic', 'svg', 'pdf'];
  return imageFormats.includes(from) && imageFormats.includes(to);
};

export const isValidVideoConversion = (from: string, to: string): boolean => {
  const videoFormats = ['mp4', 'mov', 'wmv', 'avi', 'mkv', 'flv', 'webm', 'mpeg', 'h264', 'h265'];
  return videoFormats.includes(from) && videoFormats.includes(to);
};