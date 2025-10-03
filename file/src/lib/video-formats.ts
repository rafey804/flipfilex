// lib/video-formats.ts - Video format definitions and utilities
export const VIDEO_FORMATS = {
  // Consumer formats
  'mp4': { name: 'MP4', color: 'text-blue-600', bgColor: 'bg-blue-50', category: 'Consumer' },
  'mov': { name: 'MOV', color: 'text-purple-600', bgColor: 'bg-purple-50', category: 'Consumer' },
  'wmv': { name: 'WMV', color: 'text-green-600', bgColor: 'bg-green-50', category: 'Consumer' },
  'avi': { name: 'AVI', color: 'text-red-600', bgColor: 'bg-red-50', category: 'Consumer' },
  'mkv': { name: 'MKV', color: 'text-indigo-600', bgColor: 'bg-indigo-50', category: 'Consumer' },
  'flv': { name: 'FLV', color: 'text-yellow-600', bgColor: 'bg-yellow-50', category: 'Consumer' },
  'webm': { name: 'WebM', color: 'text-emerald-600', bgColor: 'bg-emerald-50', category: 'Consumer' },
  
  // Professional formats
  'mpeg': { name: 'MPEG-2', color: 'text-gray-600', bgColor: 'bg-gray-50', category: 'Professional' },
  'h264': { name: 'H.264', color: 'text-cyan-600', bgColor: 'bg-cyan-50', category: 'Professional' },
  'h265': { name: 'H.265/HEVC', color: 'text-pink-600', bgColor: 'bg-pink-50', category: 'Professional' },
  'prores': { name: 'ProRes', color: 'text-orange-600', bgColor: 'bg-orange-50', category: 'Professional' },
  'dnxhd': { name: 'DNxHD', color: 'text-violet-600', bgColor: 'bg-violet-50', category: 'Professional' },
  'cineform': { name: 'CineForm', color: 'text-rose-600', bgColor: 'bg-rose-50', category: 'Professional' },
  'xavc': { name: 'XAVC', color: 'text-slate-600', bgColor: 'bg-slate-50', category: 'Professional' }
} as const;

// utils/video-seo.ts - SEO utilities for video converter
export function generateVideoSEOConfig(sourceFormat: string, targetFormat: string) {
  const fromFormat = VIDEO_FORMATS[sourceFormat as keyof typeof VIDEO_FORMATS]?.name || sourceFormat.toUpperCase();
  const toFormat = VIDEO_FORMATS[targetFormat as keyof typeof VIDEO_FORMATS]?.name || targetFormat.toUpperCase();
  
  return {
    title: `Convert ${fromFormat} to ${toFormat} | Free Online Video Converter`,
    description: `Convert ${fromFormat} videos to ${toFormat} format online for free`,
    metaDescription: `Convert ${fromFormat} to ${toFormat} online for free, fast and secure. No software required. Maintain video quality while optimizing file size. Supporting batch conversion.`,
    keywords: `${sourceFormat} to ${targetFormat}, ${fromFormat} to ${toFormat}, convert ${sourceFormat}, ${targetFormat} converter, video converter, online converter, free converter`,
    urlSlug: `${sourceFormat}-to-${targetFormat}`,
    h1Title: `Convert ${fromFormat} to ${toFormat}`,
    breadcrumbText: `${fromFormat} to ${toFormat}`,
    canonicalUrl: `https://yoursite.com/${sourceFormat}/to/${targetFormat}`
  };
}

// sitemap.xml generation for video converter pages
export function generateVideoConverterSitemap() {
  const videoFormats = Object.keys(VIDEO_FORMATS);
  const urls: string[] = [];

  videoFormats.forEach(sourceFormat => {
    videoFormats.forEach(targetFormat => {
      if (sourceFormat !== targetFormat) {
        urls.push(`https://yoursite.com/${sourceFormat}/to/${targetFormat}`);
      }
    });
  });

  return urls;
}