// Tool configuration mapping slugs to components and their props

export interface ToolConfig {
  component: string; // Component name to dynamically import
  props?: any; // Props to pass to the component
  type: 'audio' | 'video' | 'document' | 'image' | 'pdf' | 'other' | 'ai';
}

export const toolsConfig: Record<string, ToolConfig> = {
  // Audio conversion tools
  'mp3-to-wav': {
    component: 'AudioFormatConverter',
    props: { sourceFormat: 'mp3', targetFormat: 'wav' },
    type: 'audio'
  },
  'wav-to-mp3': {
    component: 'AudioFormatConverter',
    props: { sourceFormat: 'wav', targetFormat: 'mp3' },
    type: 'audio'
  },
  'flac-to-mp3': {
    component: 'AudioFormatConverter',
    props: { sourceFormat: 'flac', targetFormat: 'mp3' },
    type: 'audio'
  },
  'aac-to-mp3': {
    component: 'AudioFormatConverter',
    props: { sourceFormat: 'aac', targetFormat: 'mp3' },
    type: 'audio'
  },
  'ogg-to-mp3': {
    component: 'AudioFormatConverter',
    props: { sourceFormat: 'ogg', targetFormat: 'mp3' },
    type: 'audio'
  },
  'wma-to-mp3': {
    component: 'AudioFormatConverter',
    props: { sourceFormat: 'wma', targetFormat: 'mp3' },
    type: 'audio'
  },
  'm4a-to-mp3': {
    component: 'AudioFormatConverter',
    props: { sourceFormat: 'm4a', targetFormat: 'mp3' },
    type: 'audio'
  },
  'aiff-to-mp3': {
    component: 'AudioFormatConverter',
    props: { sourceFormat: 'aiff', targetFormat: 'mp3' },
    type: 'audio'
  },
  'opus-to-mp3': {
    component: 'AudioFormatConverter',
    props: { sourceFormat: 'opus', targetFormat: 'mp3' },
    type: 'audio'
  },
  'mp3-to-aac': {
    component: 'AudioFormatConverter',
    props: { sourceFormat: 'mp3', targetFormat: 'aac' },
    type: 'audio'
  },
  'wav-to-aac': {
    component: 'AudioFormatConverter',
    props: { sourceFormat: 'wav', targetFormat: 'aac' },
    type: 'audio'
  },
  'mp3-to-m4a': {
    component: 'AudioFormatConverter',
    props: { sourceFormat: 'mp3', targetFormat: 'm4a' },
    type: 'audio'
  },
  'wav-to-m4a': {
    component: 'AudioFormatConverter',
    props: { sourceFormat: 'wav', targetFormat: 'm4a' },
    type: 'audio'
  },

  // Video conversion tools - Complete matrix of all supported formats
  // MP4 conversions
  'mp4-to-mov': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mp4', targetFormat: 'mov' },
    type: 'video'
  },
  'mp4-to-avi': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mp4', targetFormat: 'avi' },
    type: 'video'
  },
  'mp4-to-mkv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mp4', targetFormat: 'mkv' },
    type: 'video'
  },
  'mp4-to-webm': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mp4', targetFormat: 'webm' },
    type: 'video'
  },
  'mp4-to-wmv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mp4', targetFormat: 'wmv' },
    type: 'video'
  },
  'mp4-to-flv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mp4', targetFormat: 'flv' },
    type: 'video'
  },
  'mp4-to-mpeg': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mp4', targetFormat: 'mpeg' },
    type: 'video'
  },
  'mp4-to-h264': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mp4', targetFormat: 'h264' },
    type: 'video'
  },
  'mp4-to-h265': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mp4', targetFormat: 'h265' },
    type: 'video'
  },

  // MOV conversions
  'mov-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mov', targetFormat: 'mp4' },
    type: 'video'
  },
  'mov-to-avi': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mov', targetFormat: 'avi' },
    type: 'video'
  },
  'mov-to-mkv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mov', targetFormat: 'mkv' },
    type: 'video'
  },
  'mov-to-webm': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mov', targetFormat: 'webm' },
    type: 'video'
  },
  'mov-to-wmv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mov', targetFormat: 'wmv' },
    type: 'video'
  },
  'mov-to-flv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mov', targetFormat: 'flv' },
    type: 'video'
  },
  'mov-to-mpeg': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mov', targetFormat: 'mpeg' },
    type: 'video'
  },
  'mov-to-h264': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mov', targetFormat: 'h264' },
    type: 'video'
  },
  'mov-to-h265': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mov', targetFormat: 'h265' },
    type: 'video'
  },

  // AVI conversions
  'avi-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'avi', targetFormat: 'mp4' },
    type: 'video'
  },
  'avi-to-mov': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'avi', targetFormat: 'mov' },
    type: 'video'
  },
  'avi-to-mkv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'avi', targetFormat: 'mkv' },
    type: 'video'
  },
  'avi-to-webm': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'avi', targetFormat: 'webm' },
    type: 'video'
  },
  'avi-to-wmv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'avi', targetFormat: 'wmv' },
    type: 'video'
  },
  'avi-to-flv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'avi', targetFormat: 'flv' },
    type: 'video'
  },
  'avi-to-mpeg': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'avi', targetFormat: 'mpeg' },
    type: 'video'
  },
  'avi-to-h264': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'avi', targetFormat: 'h264' },
    type: 'video'
  },
  'avi-to-h265': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'avi', targetFormat: 'h265' },
    type: 'video'
  },

  // MKV conversions
  'mkv-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mkv', targetFormat: 'mp4' },
    type: 'video'
  },
  'mkv-to-mov': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mkv', targetFormat: 'mov' },
    type: 'video'
  },
  'mkv-to-avi': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mkv', targetFormat: 'avi' },
    type: 'video'
  },
  'mkv-to-webm': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mkv', targetFormat: 'webm' },
    type: 'video'
  },
  'mkv-to-wmv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mkv', targetFormat: 'wmv' },
    type: 'video'
  },
  'mkv-to-flv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mkv', targetFormat: 'flv' },
    type: 'video'
  },
  'mkv-to-mpeg': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mkv', targetFormat: 'mpeg' },
    type: 'video'
  },
  'mkv-to-h264': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mkv', targetFormat: 'h264' },
    type: 'video'
  },
  'mkv-to-h265': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mkv', targetFormat: 'h265' },
    type: 'video'
  },

  // WebM conversions
  'webm-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'webm', targetFormat: 'mp4' },
    type: 'video'
  },
  'webm-to-mov': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'webm', targetFormat: 'mov' },
    type: 'video'
  },
  'webm-to-avi': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'webm', targetFormat: 'avi' },
    type: 'video'
  },
  'webm-to-mkv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'webm', targetFormat: 'mkv' },
    type: 'video'
  },
  'webm-to-wmv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'webm', targetFormat: 'wmv' },
    type: 'video'
  },
  'webm-to-flv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'webm', targetFormat: 'flv' },
    type: 'video'
  },
  'webm-to-mpeg': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'webm', targetFormat: 'mpeg' },
    type: 'video'
  },
  'webm-to-h264': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'webm', targetFormat: 'h264' },
    type: 'video'
  },
  'webm-to-h265': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'webm', targetFormat: 'h265' },
    type: 'video'
  },

  // WMV conversions
  'wmv-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'wmv', targetFormat: 'mp4' },
    type: 'video'
  },
  'wmv-to-mov': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'wmv', targetFormat: 'mov' },
    type: 'video'
  },
  'wmv-to-avi': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'wmv', targetFormat: 'avi' },
    type: 'video'
  },
  'wmv-to-mkv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'wmv', targetFormat: 'mkv' },
    type: 'video'
  },
  'wmv-to-webm': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'wmv', targetFormat: 'webm' },
    type: 'video'
  },
  'wmv-to-flv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'wmv', targetFormat: 'flv' },
    type: 'video'
  },
  'wmv-to-mpeg': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'wmv', targetFormat: 'mpeg' },
    type: 'video'
  },
  'wmv-to-h264': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'wmv', targetFormat: 'h264' },
    type: 'video'
  },
  'wmv-to-h265': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'wmv', targetFormat: 'h265' },
    type: 'video'
  },

  // FLV conversions
  'flv-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'flv', targetFormat: 'mp4' },
    type: 'video'
  },
  'flv-to-mov': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'flv', targetFormat: 'mov' },
    type: 'video'
  },
  'flv-to-avi': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'flv', targetFormat: 'avi' },
    type: 'video'
  },
  'flv-to-mkv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'flv', targetFormat: 'mkv' },
    type: 'video'
  },
  'flv-to-webm': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'flv', targetFormat: 'webm' },
    type: 'video'
  },
  'flv-to-wmv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'flv', targetFormat: 'wmv' },
    type: 'video'
  },
  'flv-to-mpeg': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'flv', targetFormat: 'mpeg' },
    type: 'video'
  },
  'flv-to-h264': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'flv', targetFormat: 'h264' },
    type: 'video'
  },
  'flv-to-h265': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'flv', targetFormat: 'h265' },
    type: 'video'
  },

  // MPEG conversions
  'mpeg-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mpeg', targetFormat: 'mp4' },
    type: 'video'
  },
  'mpeg-to-mov': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mpeg', targetFormat: 'mov' },
    type: 'video'
  },
  'mpeg-to-avi': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mpeg', targetFormat: 'avi' },
    type: 'video'
  },
  'mpeg-to-mkv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mpeg', targetFormat: 'mkv' },
    type: 'video'
  },
  'mpeg-to-webm': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mpeg', targetFormat: 'webm' },
    type: 'video'
  },
  'mpeg-to-wmv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mpeg', targetFormat: 'wmv' },
    type: 'video'
  },
  'mpeg-to-flv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mpeg', targetFormat: 'flv' },
    type: 'video'
  },
  'mpeg-to-h264': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mpeg', targetFormat: 'h264' },
    type: 'video'
  },
  'mpeg-to-h265': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mpeg', targetFormat: 'h265' },
    type: 'video'
  },

  // H.264 conversions
  'h264-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h264', targetFormat: 'mp4' },
    type: 'video'
  },
  'h264-to-mov': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h264', targetFormat: 'mov' },
    type: 'video'
  },
  'h264-to-avi': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h264', targetFormat: 'avi' },
    type: 'video'
  },
  'h264-to-mkv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h264', targetFormat: 'mkv' },
    type: 'video'
  },
  'h264-to-webm': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h264', targetFormat: 'webm' },
    type: 'video'
  },
  'h264-to-wmv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h264', targetFormat: 'wmv' },
    type: 'video'
  },
  'h264-to-flv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h264', targetFormat: 'flv' },
    type: 'video'
  },
  'h264-to-mpeg': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h264', targetFormat: 'mpeg' },
    type: 'video'
  },
  'h264-to-h265': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h264', targetFormat: 'h265' },
    type: 'video'
  },

  // H.265 conversions
  'h265-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h265', targetFormat: 'mp4' },
    type: 'video'
  },
  'h265-to-mov': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h265', targetFormat: 'mov' },
    type: 'video'
  },
  'h265-to-avi': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h265', targetFormat: 'avi' },
    type: 'video'
  },
  'h265-to-mkv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h265', targetFormat: 'mkv' },
    type: 'video'
  },
  'h265-to-webm': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h265', targetFormat: 'webm' },
    type: 'video'
  },
  'h265-to-wmv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h265', targetFormat: 'wmv' },
    type: 'video'
  },
  'h265-to-flv': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h265', targetFormat: 'flv' },
    type: 'video'
  },
  'h265-to-mpeg': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h265', targetFormat: 'mpeg' },
    type: 'video'
  },
  'h265-to-h264': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'h265', targetFormat: 'h264' },
    type: 'video'
  },

  // Document conversion tools
  'excel-to-pdf': {
    component: 'DocumentConverter',
    props: { conversionType: 'excel_to_pdf' },
    type: 'document'
  },
  'powerpoint-to-pdf': {
    component: 'DocumentConverter',
    props: { conversionType: 'powerpoint_to_pdf' },
    type: 'document'
  },
  'text-to-pdf': {
    component: 'DocumentConverter',
    props: { conversionType: 'text_to_pdf' },
    type: 'document'
  },
  'html-to-pdf': {
    component: 'DocumentConverter',
    props: { conversionType: 'html_to_pdf' },
    type: 'document'
  },
  'csv-to-excel': {
    component: 'DocumentConverter',
    props: { conversionType: 'csv_to_excel' },
    type: 'document'
  },
  'json-to-csv': {
    component: 'DocumentConverter',
    props: { conversionType: 'json_to_csv' },
    type: 'document'
  },
  'epub-to-pdf': {
    component: 'DocumentConverter',
    props: { conversionType: 'epub_to_pdf' },
    type: 'document'
  },
  'mobi-to-epub': {
    component: 'DocumentConverter',
    props: { conversionType: 'mobi_to_epub' },
    type: 'document'
  },
  'txt-to-epub': {
    component: 'DocumentConverter',
    props: { conversionType: 'txt_to_epub' },
    type: 'document'
  },
  'docx-to-epub': {
    component: 'DocumentConverter',
    props: { conversionType: 'docx_to_epub' },
    type: 'document'
  },
  'bib-to-pdf': {
    component: 'DocumentConverter',
    props: { conversionType: 'bib_to_pdf' },
    type: 'document'
  },
  'latex-to-pdf': {
    component: 'DocumentConverter',
    props: { conversionType: 'latex_to_pdf' },
    type: 'document'
  },
  'docx-to-pdf': {
    component: 'DocumentConverter',
    props: { conversionType: 'docx-to-pdf' },
    type: 'document'
  },
  'pdf-to-docx': {
    component: 'DocumentConverter',
    props: { conversionType: 'pdf-to-docx' },
    type: 'document'
  },
  'txt-to-pdf': {
    component: 'DocumentConverter',
    props: { conversionType: 'txt-to-pdf' },
    type: 'document'
  },
  'xlsx-to-pdf': {
    component: 'DocumentConverter',
    props: { conversionType: 'xlsx-to-pdf' },
    type: 'document'
  },
  'pptx-to-pdf': {
    component: 'DocumentConverter',
    props: { conversionType: 'pptx-to-pdf' },
    type: 'document'
  },

  // Image conversion tools
  'png-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'png', targetFormat: 'jpg' },
    type: 'image'
  },
  'jpg-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpg', targetFormat: 'png' },
    type: 'image'
  },
  'webp-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'webp', targetFormat: 'png' },
    type: 'image'
  },
  'webp-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'webp', targetFormat: 'jpg' },
    type: 'image'
  },
  'png-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'png', targetFormat: 'webp' },
    type: 'image'
  },
  'jpg-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpg', targetFormat: 'webp' },
    type: 'image'
  },
  'heic-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'heic', targetFormat: 'jpg' },
    type: 'image'
  },
  'heic-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'heic', targetFormat: 'png' },
    type: 'image'
  },
  'avif-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'avif', targetFormat: 'png' },
    type: 'image'
  },
  'avif-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'avif', targetFormat: 'jpg' },
    type: 'image'
  },
  'gif-to-mp4': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gif', targetFormat: 'mp4' },
    type: 'image'
  },
  'bmp-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'bmp', targetFormat: 'jpg' },
    type: 'image'
  },
  'tiff-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'tiff', targetFormat: 'jpg' },
    type: 'image'
  },
  'ico-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ico', targetFormat: 'png' },
    type: 'image'
  },
  'svg-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'svg', targetFormat: 'png' },
    type: 'image'
  },
  'gif-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gif', targetFormat: 'png' },
    type: 'image'
  },
  'bmp-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'bmp', targetFormat: 'png' },
    type: 'image'
  },
  'tiff-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'tiff', targetFormat: 'png' },
    type: 'image'
  },
  'jpeg-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpeg', targetFormat: 'webp' },
    type: 'image'
  },
  'png-to-jpeg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'png', targetFormat: 'jpeg' },
    type: 'image'
  },

  // Additional image conversions for PDF, PCX, HEIC, ICO
  'pdf-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pdf', targetFormat: 'jpg' },
    type: 'image'
  },
  'pdf-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pdf', targetFormat: 'png' },
    type: 'image'
  },
  'pcx-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pcx', targetFormat: 'png' },
    type: 'image'
  },
  'pcx-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pcx', targetFormat: 'jpg' },
    type: 'image'
  },
  'ico-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ico', targetFormat: 'jpg' },
    type: 'image'
  },
  'svg-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'svg', targetFormat: 'jpg' },
    type: 'image'
  },
  'svg-to-jpeg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'svg', targetFormat: 'jpeg' },
    type: 'image'
  },
  'svg-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'svg', targetFormat: 'webp' },
    type: 'image'
  },
  'png-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'png', targetFormat: 'avif' },
    type: 'image'
  },
  'jpg-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpg', targetFormat: 'avif' },
    type: 'image'
  },
  'webp-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'webp', targetFormat: 'avif' },
    type: 'image'
  },
  'png-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'png', targetFormat: 'heic' },
    type: 'image'
  },
  'jpg-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpg', targetFormat: 'heic' },
    type: 'image'
  },
  'png-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'png', targetFormat: 'pdf' },
    type: 'image'
  },
  'jpg-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpg', targetFormat: 'pdf' },
    type: 'image'
  },
  'avif-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'avif', targetFormat: 'webp' },
    type: 'image'
  },
  'gif-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gif', targetFormat: 'jpg' },
    type: 'image'
  },
  'gif-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gif', targetFormat: 'webp' },
    type: 'image'
  },
  'bmp-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'bmp', targetFormat: 'webp' },
    type: 'image'
  },
  'tiff-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'tiff', targetFormat: 'webp' },
    type: 'image'
  },
  'ico-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ico', targetFormat: 'webp' },
    type: 'image'
  },

  // Complete all missing image format combinations
  'jpeg-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpeg', targetFormat: 'png' },
    type: 'image'
  },
  'jpeg-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpeg', targetFormat: 'jpg' },
    type: 'image'
  },
  'png-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'png', targetFormat: 'gif' },
    type: 'image'
  },
  'png-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'png', targetFormat: 'bmp' },
    type: 'image'
  },
  'png-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'png', targetFormat: 'tiff' },
    type: 'image'
  },
  'png-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'png', targetFormat: 'ico' },
    type: 'image'
  },
  'png-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'png', targetFormat: 'svg' },
    type: 'image'
  },
  'png-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'png', targetFormat: 'pcx' },
    type: 'image'
  },
  'jpg-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpg', targetFormat: 'gif' },
    type: 'image'
  },
  'jpg-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpg', targetFormat: 'bmp' },
    type: 'image'
  },
  'jpg-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpg', targetFormat: 'tiff' },
    type: 'image'
  },
  'jpg-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpg', targetFormat: 'ico' },
    type: 'image'
  },
  'jpg-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpg', targetFormat: 'svg' },
    type: 'image'
  },
  'jpg-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpg', targetFormat: 'pcx' },
    type: 'image'
  },
  'webp-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'webp', targetFormat: 'gif' },
    type: 'image'
  },
  'webp-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'webp', targetFormat: 'bmp' },
    type: 'image'
  },
  'webp-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'webp', targetFormat: 'tiff' },
    type: 'image'
  },
  'webp-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'webp', targetFormat: 'ico' },
    type: 'image'
  },
  'webp-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'webp', targetFormat: 'svg' },
    type: 'image'
  },
  'webp-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'webp', targetFormat: 'pcx' },
    type: 'image'
  },
  'webp-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'webp', targetFormat: 'heic' },
    type: 'image'
  },
  'webp-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'webp', targetFormat: 'pdf' },
    type: 'image'
  },
  'gif-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gif', targetFormat: 'bmp' },
    type: 'image'
  },
  'gif-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gif', targetFormat: 'tiff' },
    type: 'image'
  },
  'gif-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gif', targetFormat: 'ico' },
    type: 'image'
  },
  'gif-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gif', targetFormat: 'svg' },
    type: 'image'
  },
  'gif-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gif', targetFormat: 'pcx' },
    type: 'image'
  },
  'gif-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gif', targetFormat: 'heic' },
    type: 'image'
  },
  'gif-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gif', targetFormat: 'avif' },
    type: 'image'
  },
  'gif-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gif', targetFormat: 'pdf' },
    type: 'image'
  },
  'bmp-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'bmp', targetFormat: 'gif' },
    type: 'image'
  },
  'bmp-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'bmp', targetFormat: 'tiff' },
    type: 'image'
  },
  'bmp-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'bmp', targetFormat: 'ico' },
    type: 'image'
  },
  'bmp-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'bmp', targetFormat: 'svg' },
    type: 'image'
  },
  'bmp-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'bmp', targetFormat: 'pcx' },
    type: 'image'
  },
  'bmp-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'bmp', targetFormat: 'heic' },
    type: 'image'
  },
  'bmp-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'bmp', targetFormat: 'avif' },
    type: 'image'
  },
  'bmp-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'bmp', targetFormat: 'pdf' },
    type: 'image'
  },
  'tiff-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'tiff', targetFormat: 'gif' },
    type: 'image'
  },
  'tiff-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'tiff', targetFormat: 'bmp' },
    type: 'image'
  },
  'tiff-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'tiff', targetFormat: 'ico' },
    type: 'image'
  },
  'tiff-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'tiff', targetFormat: 'svg' },
    type: 'image'
  },
  'tiff-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'tiff', targetFormat: 'pcx' },
    type: 'image'
  },
  'tiff-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'tiff', targetFormat: 'heic' },
    type: 'image'
  },
  'tiff-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'tiff', targetFormat: 'avif' },
    type: 'image'
  },
  'tiff-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'tiff', targetFormat: 'pdf' },
    type: 'image'
  },
  'ico-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ico', targetFormat: 'gif' },
    type: 'image'
  },
  'ico-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ico', targetFormat: 'bmp' },
    type: 'image'
  },
  'ico-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ico', targetFormat: 'tiff' },
    type: 'image'
  },
  'ico-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ico', targetFormat: 'svg' },
    type: 'image'
  },
  'ico-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ico', targetFormat: 'pcx' },
    type: 'image'
  },
  'ico-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ico', targetFormat: 'heic' },
    type: 'image'
  },
  'ico-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ico', targetFormat: 'avif' },
    type: 'image'
  },
  'ico-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ico', targetFormat: 'pdf' },
    type: 'image'
  },
  'heic-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'heic', targetFormat: 'gif' },
    type: 'image'
  },
  'heic-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'heic', targetFormat: 'bmp' },
    type: 'image'
  },
  'heic-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'heic', targetFormat: 'tiff' },
    type: 'image'
  },
  'heic-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'heic', targetFormat: 'ico' },
    type: 'image'
  },
  'heic-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'heic', targetFormat: 'svg' },
    type: 'image'
  },
  'heic-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'heic', targetFormat: 'webp' },
    type: 'image'
  },
  'heic-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'heic', targetFormat: 'avif' },
    type: 'image'
  },
  'heic-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'heic', targetFormat: 'pcx' },
    type: 'image'
  },
  'heic-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'heic', targetFormat: 'pdf' },
    type: 'image'
  },
  'avif-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'avif', targetFormat: 'gif' },
    type: 'image'
  },
  'avif-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'avif', targetFormat: 'bmp' },
    type: 'image'
  },
  'avif-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'avif', targetFormat: 'tiff' },
    type: 'image'
  },
  'avif-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'avif', targetFormat: 'ico' },
    type: 'image'
  },
  'avif-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'avif', targetFormat: 'svg' },
    type: 'image'
  },
  'avif-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'avif', targetFormat: 'heic' },
    type: 'image'
  },
  'avif-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'avif', targetFormat: 'pcx' },
    type: 'image'
  },
  'avif-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'avif', targetFormat: 'pdf' },
    type: 'image'
  },
  'svg-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'svg', targetFormat: 'gif' },
    type: 'image'
  },
  'svg-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'svg', targetFormat: 'bmp' },
    type: 'image'
  },
  'svg-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'svg', targetFormat: 'tiff' },
    type: 'image'
  },
  'svg-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'svg', targetFormat: 'ico' },
    type: 'image'
  },
  'svg-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'svg', targetFormat: 'heic' },
    type: 'image'
  },
  'svg-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'svg', targetFormat: 'avif' },
    type: 'image'
  },
  'svg-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'svg', targetFormat: 'pcx' },
    type: 'image'
  },
  'svg-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'svg', targetFormat: 'pdf' },
    type: 'image'
  },
  'pcx-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pcx', targetFormat: 'gif' },
    type: 'image'
  },
  'pcx-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pcx', targetFormat: 'bmp' },
    type: 'image'
  },
  'pcx-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pcx', targetFormat: 'tiff' },
    type: 'image'
  },
  'pcx-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pcx', targetFormat: 'ico' },
    type: 'image'
  },
  'pcx-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pcx', targetFormat: 'svg' },
    type: 'image'
  },
  'pcx-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pcx', targetFormat: 'webp' },
    type: 'image'
  },
  'pcx-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pcx', targetFormat: 'heic' },
    type: 'image'
  },
  'pcx-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pcx', targetFormat: 'avif' },
    type: 'image'
  },
  'pcx-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pcx', targetFormat: 'pdf' },
    type: 'image'
  },
  'pdf-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pdf', targetFormat: 'gif' },
    type: 'image'
  },
  'pdf-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pdf', targetFormat: 'bmp' },
    type: 'image'
  },
  'pdf-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pdf', targetFormat: 'tiff' },
    type: 'image'
  },
  'pdf-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pdf', targetFormat: 'ico' },
    type: 'image'
  },
  'pdf-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pdf', targetFormat: 'svg' },
    type: 'image'
  },
  'pdf-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pdf', targetFormat: 'webp' },
    type: 'image'
  },
  'pdf-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pdf', targetFormat: 'heic' },
    type: 'image'
  },
  'pdf-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pdf', targetFormat: 'avif' },
    type: 'image'
  },
  'pdf-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'pdf', targetFormat: 'pcx' },
    type: 'image'
  },
  'jpeg-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpeg', targetFormat: 'gif' },
    type: 'image'
  },
  'jpeg-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpeg', targetFormat: 'bmp' },
    type: 'image'
  },
  'jpeg-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpeg', targetFormat: 'tiff' },
    type: 'image'
  },
  'jpeg-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpeg', targetFormat: 'ico' },
    type: 'image'
  },
  'jpeg-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpeg', targetFormat: 'svg' },
    type: 'image'
  },
  'jpeg-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpeg', targetFormat: 'heic' },
    type: 'image'
  },
  'jpeg-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpeg', targetFormat: 'avif' },
    type: 'image'
  },
  'jpeg-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpeg', targetFormat: 'pcx' },
    type: 'image'
  },
  'jpeg-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'jpeg', targetFormat: 'pdf' },
    type: 'image'
  },


  // Additional format conversions (AI, PSD, EPS, CDR, 3D formats)
  'ai-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ai', targetFormat: 'png' },
    type: 'image'
  },
  'ai-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ai', targetFormat: 'jpg' },
    type: 'image'
  },
  'ai-to-jpeg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ai', targetFormat: 'jpeg' },
    type: 'image'
  },
  'ai-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ai', targetFormat: 'webp' },
    type: 'image'
  },
  'ai-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ai', targetFormat: 'gif' },
    type: 'image'
  },
  'ai-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ai', targetFormat: 'bmp' },
    type: 'image'
  },
  'ai-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ai', targetFormat: 'tiff' },
    type: 'image'
  },
  'ai-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ai', targetFormat: 'ico' },
    type: 'image'
  },
  'ai-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ai', targetFormat: 'svg' },
    type: 'image'
  },
  'ai-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ai', targetFormat: 'avif' },
    type: 'image'
  },
  'ai-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ai', targetFormat: 'heic' },
    type: 'image'
  },
  'ai-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ai', targetFormat: 'pcx' },
    type: 'image'
  },
  'ai-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'ai', targetFormat: 'pdf' },
    type: 'image'
  },
  'psd-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'psd', targetFormat: 'png' },
    type: 'image'
  },
  'psd-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'psd', targetFormat: 'jpg' },
    type: 'image'
  },
  'psd-to-jpeg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'psd', targetFormat: 'jpeg' },
    type: 'image'
  },
  'psd-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'psd', targetFormat: 'webp' },
    type: 'image'
  },
  'psd-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'psd', targetFormat: 'gif' },
    type: 'image'
  },
  'psd-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'psd', targetFormat: 'bmp' },
    type: 'image'
  },
  'psd-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'psd', targetFormat: 'tiff' },
    type: 'image'
  },
  'psd-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'psd', targetFormat: 'ico' },
    type: 'image'
  },
  'psd-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'psd', targetFormat: 'svg' },
    type: 'image'
  },
  'psd-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'psd', targetFormat: 'avif' },
    type: 'image'
  },
  'psd-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'psd', targetFormat: 'heic' },
    type: 'image'
  },
  'psd-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'psd', targetFormat: 'pcx' },
    type: 'image'
  },
  'psd-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'psd', targetFormat: 'pdf' },
    type: 'image'
  },
  'eps-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'eps', targetFormat: 'png' },
    type: 'image'
  },
  'eps-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'eps', targetFormat: 'jpg' },
    type: 'image'
  },
  'eps-to-jpeg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'eps', targetFormat: 'jpeg' },
    type: 'image'
  },
  'eps-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'eps', targetFormat: 'webp' },
    type: 'image'
  },
  'eps-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'eps', targetFormat: 'gif' },
    type: 'image'
  },
  'eps-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'eps', targetFormat: 'bmp' },
    type: 'image'
  },
  'eps-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'eps', targetFormat: 'tiff' },
    type: 'image'
  },
  'eps-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'eps', targetFormat: 'ico' },
    type: 'image'
  },
  'eps-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'eps', targetFormat: 'svg' },
    type: 'image'
  },
  'eps-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'eps', targetFormat: 'avif' },
    type: 'image'
  },
  'eps-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'eps', targetFormat: 'heic' },
    type: 'image'
  },
  'eps-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'eps', targetFormat: 'pcx' },
    type: 'image'
  },
  'eps-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'eps', targetFormat: 'pdf' },
    type: 'image'
  },
  'cdr-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'cdr', targetFormat: 'png' },
    type: 'image'
  },
  'cdr-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'cdr', targetFormat: 'jpg' },
    type: 'image'
  },
  'cdr-to-jpeg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'cdr', targetFormat: 'jpeg' },
    type: 'image'
  },
  'cdr-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'cdr', targetFormat: 'webp' },
    type: 'image'
  },
  'cdr-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'cdr', targetFormat: 'gif' },
    type: 'image'
  },
  'cdr-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'cdr', targetFormat: 'bmp' },
    type: 'image'
  },
  'cdr-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'cdr', targetFormat: 'tiff' },
    type: 'image'
  },
  'cdr-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'cdr', targetFormat: 'ico' },
    type: 'image'
  },
  'cdr-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'cdr', targetFormat: 'svg' },
    type: 'image'
  },
  'cdr-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'cdr', targetFormat: 'avif' },
    type: 'image'
  },
  'cdr-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'cdr', targetFormat: 'heic' },
    type: 'image'
  },
  'cdr-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'cdr', targetFormat: 'pcx' },
    type: 'image'
  },
  'cdr-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'cdr', targetFormat: 'pdf' },
    type: 'image'
  },
  'obj-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'obj', targetFormat: 'png' },
    type: 'image'
  },
  'obj-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'obj', targetFormat: 'jpg' },
    type: 'image'
  },
  'obj-to-jpeg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'obj', targetFormat: 'jpeg' },
    type: 'image'
  },
  'obj-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'obj', targetFormat: 'webp' },
    type: 'image'
  },
  'obj-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'obj', targetFormat: 'gif' },
    type: 'image'
  },
  'obj-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'obj', targetFormat: 'bmp' },
    type: 'image'
  },
  'obj-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'obj', targetFormat: 'tiff' },
    type: 'image'
  },
  'obj-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'obj', targetFormat: 'ico' },
    type: 'image'
  },
  'obj-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'obj', targetFormat: 'svg' },
    type: 'image'
  },
  'obj-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'obj', targetFormat: 'avif' },
    type: 'image'
  },
  'obj-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'obj', targetFormat: 'heic' },
    type: 'image'
  },
  'obj-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'obj', targetFormat: 'pcx' },
    type: 'image'
  },
  'obj-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'obj', targetFormat: 'pdf' },
    type: 'image'
  },
  'fbx-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'fbx', targetFormat: 'png' },
    type: 'image'
  },
  'fbx-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'fbx', targetFormat: 'jpg' },
    type: 'image'
  },
  'fbx-to-jpeg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'fbx', targetFormat: 'jpeg' },
    type: 'image'
  },
  'fbx-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'fbx', targetFormat: 'webp' },
    type: 'image'
  },
  'fbx-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'fbx', targetFormat: 'gif' },
    type: 'image'
  },
  'fbx-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'fbx', targetFormat: 'bmp' },
    type: 'image'
  },
  'fbx-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'fbx', targetFormat: 'tiff' },
    type: 'image'
  },
  'fbx-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'fbx', targetFormat: 'ico' },
    type: 'image'
  },
  'fbx-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'fbx', targetFormat: 'svg' },
    type: 'image'
  },
  'fbx-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'fbx', targetFormat: 'avif' },
    type: 'image'
  },
  'fbx-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'fbx', targetFormat: 'heic' },
    type: 'image'
  },
  'fbx-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'fbx', targetFormat: 'pcx' },
    type: 'image'
  },
  'fbx-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'fbx', targetFormat: 'pdf' },
    type: 'image'
  },
  'stl-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'stl', targetFormat: 'png' },
    type: 'image'
  },
  'stl-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'stl', targetFormat: 'jpg' },
    type: 'image'
  },
  'stl-to-jpeg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'stl', targetFormat: 'jpeg' },
    type: 'image'
  },
  'stl-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'stl', targetFormat: 'webp' },
    type: 'image'
  },
  'stl-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'stl', targetFormat: 'gif' },
    type: 'image'
  },
  'stl-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'stl', targetFormat: 'bmp' },
    type: 'image'
  },
  'stl-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'stl', targetFormat: 'tiff' },
    type: 'image'
  },
  'stl-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'stl', targetFormat: 'ico' },
    type: 'image'
  },
  'stl-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'stl', targetFormat: 'svg' },
    type: 'image'
  },
  'stl-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'stl', targetFormat: 'avif' },
    type: 'image'
  },
  'stl-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'stl', targetFormat: 'heic' },
    type: 'image'
  },
  'stl-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'stl', targetFormat: 'pcx' },
    type: 'image'
  },
  'stl-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'stl', targetFormat: 'pdf' },
    type: 'image'
  },
  'gltf-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gltf', targetFormat: 'png' },
    type: 'image'
  },
  'gltf-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gltf', targetFormat: 'jpg' },
    type: 'image'
  },
  'gltf-to-jpeg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gltf', targetFormat: 'jpeg' },
    type: 'image'
  },
  'gltf-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gltf', targetFormat: 'webp' },
    type: 'image'
  },
  'gltf-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gltf', targetFormat: 'gif' },
    type: 'image'
  },
  'gltf-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gltf', targetFormat: 'bmp' },
    type: 'image'
  },
  'gltf-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gltf', targetFormat: 'tiff' },
    type: 'image'
  },
  'gltf-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gltf', targetFormat: 'ico' },
    type: 'image'
  },
  'gltf-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gltf', targetFormat: 'svg' },
    type: 'image'
  },
  'gltf-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gltf', targetFormat: 'avif' },
    type: 'image'
  },
  'gltf-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gltf', targetFormat: 'heic' },
    type: 'image'
  },
  'gltf-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gltf', targetFormat: 'pcx' },
    type: 'image'
  },
  'gltf-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'gltf', targetFormat: 'pdf' },
    type: 'image'
  },
  'xcf-to-png': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'xcf', targetFormat: 'png' },
    type: 'image'
  },
  'xcf-to-jpg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'xcf', targetFormat: 'jpg' },
    type: 'image'
  },
  'xcf-to-jpeg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'xcf', targetFormat: 'jpeg' },
    type: 'image'
  },
  'xcf-to-webp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'xcf', targetFormat: 'webp' },
    type: 'image'
  },
  'xcf-to-gif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'xcf', targetFormat: 'gif' },
    type: 'image'
  },
  'xcf-to-bmp': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'xcf', targetFormat: 'bmp' },
    type: 'image'
  },
  'xcf-to-tiff': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'xcf', targetFormat: 'tiff' },
    type: 'image'
  },
  'xcf-to-ico': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'xcf', targetFormat: 'ico' },
    type: 'image'
  },
  'xcf-to-svg': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'xcf', targetFormat: 'svg' },
    type: 'image'
  },
  'xcf-to-avif': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'xcf', targetFormat: 'avif' },
    type: 'image'
  },
  'xcf-to-heic': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'xcf', targetFormat: 'heic' },
    type: 'image'
  },
  'xcf-to-pcx': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'xcf', targetFormat: 'pcx' },
    type: 'image'
  },
  'xcf-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'xcf', targetFormat: 'pdf' },
    type: 'image'
  },
  // Font conversion tools
  'ttf-to-woff': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'ttf', targetFormat: 'woff' },
    type: 'other'
  },
  'ttf-to-woff2': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'ttf', targetFormat: 'woff2' },
    type: 'other'
  },
  'otf-to-woff': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'otf', targetFormat: 'woff' },
    type: 'other'
  },
  'otf-to-woff2': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'otf', targetFormat: 'woff2' },
    type: 'other'
  },
  'woff-to-woff2': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'woff', targetFormat: 'woff2' },
    type: 'other'
  },
  'woff2-to-woff': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'woff2', targetFormat: 'woff' },
    type: 'other'
  },
  'woff-to-ttf': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'woff', targetFormat: 'ttf' },
    type: 'other'
  },
  'woff2-to-ttf': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'woff2', targetFormat: 'ttf' },
    type: 'other'
  },
  'woff-to-otf': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'woff', targetFormat: 'otf' },
    type: 'other'
  },
  'woff2-to-otf': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'woff2', targetFormat: 'otf' },
    type: 'other'
  },
  'ttf-to-otf': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'ttf', targetFormat: 'otf' },
    type: 'other'
  },
  'otf-to-ttf': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'otf', targetFormat: 'ttf' },
    type: 'other'
  },
  'ps1-to-otf': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'ps1', targetFormat: 'otf' },
    type: 'other'
  },
  'svg-to-ttf': {
    component: 'FontFormatConverter',
    props: { sourceFormat: 'svg', targetFormat: 'ttf' },
    type: 'other'
  },

  // PDF tools
  'compress-pdf': {
    component: 'PDFCompressor',
    props: {},
    type: 'pdf'
  },
  'pdf-compressor': {
    component: 'PDFCompressor',
    props: {},
    type: 'pdf'
  },
  'protect-pdf': {
    component: 'PDFPasswordProtection',
    props: {},
    type: 'pdf'
  },
  'pdf-password': {
    component: 'PDFPasswordProtection',
    props: {},
    type: 'pdf'
  },
  'split-pdf': {
    component: 'PDFSplitter',
    props: {},
    type: 'pdf'
  },
  'pdf-splitter': {
    component: 'PDFSplitter',
    props: {},
    type: 'pdf'
  },
  'pdf-split': {
    component: 'PDFSplitter',
    props: {},
    type: 'pdf'
  },
  'pdf-merge': {
    component: 'PDFSplitter',
    props: { mergeMode: true },
    type: 'pdf'
  },
  'image-to-pdf': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'image', targetFormat: 'pdf' },
    type: 'image'
  },
  'pdf-to-word': {
    component: 'DocumentConverter',
    props: { conversionType: 'text_to_pdf' },
    type: 'document'
  },
  'base64-encode': {
    component: 'DocumentConverter',
    props: { conversionType: 'json_to_csv' },
    type: 'other'
  },
  'logo-creator': {
    component: 'SEOOptimizedImageConverter',
    props: { sourceFormat: 'svg', targetFormat: 'png' },
    type: 'image'
  },

  // EPUB tools (legacy - keeping for backward compatibility)
  'mobi-to-pdf': {
    component: 'EpubToPdfClient',
    props: { sourceFormat: 'mobi' },
    type: 'document'
  },

  // AI Tools
  'ai-video-script-writer': {
    component: 'AIVideoScriptWriterClient',
    props: {},
    type: 'ai'
  },
  'ai-image-generator': {
    component: 'AIImageGeneratorClient',
    props: {},
    type: 'ai'
  },
};

// Helper function to get component by slug
export function getToolBySlug(slug: string): ToolConfig | null {
  return toolsConfig[slug] || null;
}

// Helper function to get all available slugs
export function getAllToolSlugs(): string[] {
  return Object.keys(toolsConfig);
}

// Helper function to generate enhanced metadata for a tool
export function getToolMetadata(slug: string) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const { props } = tool;

  // Handle conversion type format (for DocumentConverter)
  if (props?.conversionType) {
    const [from, to] = props.conversionType.split('_to_');
    if (from && to) {
      const fromUpper = from.toUpperCase();
      const toUpper = to.toUpperCase();
      return {
        title: `Free ${fromUpper} to ${toUpper} Converter Online - Fast & Secure | FlipFileX`,
        description: `Convert ${fromUpper} to ${toUpper} online for free. Fast, secure, high-quality ${tool.type} conversion. No registration, no watermarks. Upload and convert ${fromUpper} files to ${toUpper} instantly.`,
        keywords: `${from} to ${to}, ${from} to ${to} converter, convert ${from} to ${to}, ${from} to ${to} online, free ${from} to ${to}, ${from} converter, ${to} converter, online ${from} converter, ${tool.type} converter, convert ${from} file, ${from} file converter, free online converter, flipfilex`,
        alternates: {
          canonical: `https://flipfilex.com/${slug}`,
        }
      };
    }
  }

  // Handle source/target format (for other converters)
  const from = props?.sourceFormat || '';
  const to = props?.targetFormat || '';

  if (from && to) {
    const fromUpper = from.toUpperCase();
    const toUpper = to.toUpperCase();

    // Enhanced descriptions based on tool type
    const typeDescriptions: Record<string, string> = {
      'image': `Convert ${fromUpper} images to ${toUpper} format online for free. High-quality image conversion with no loss of quality. Supports batch conversion, maintains transparency, and preserves image metadata.`,
      'audio': `Convert ${fromUpper} audio files to ${toUpper} format for free. Professional audio conversion with adjustable quality settings. No file size limits, fast processing, secure uploads.`,
      'video': `Convert ${fromUpper} videos to ${toUpper} format online. Free video converter with high-quality output. Fast processing, supports HD videos, no watermarks. Convert video files instantly.`,
      'document': `Convert ${fromUpper} documents to ${toUpper} format for free. Preserve formatting, fonts, and layout. Professional document conversion tool with fast processing and secure uploads.`,
      'pdf': `Convert ${fromUpper} to ${toUpper} PDF online free. Maintain document quality and formatting. Fast PDF conversion with no file size restrictions. Download converted PDFs instantly.`,
      'other': `Convert ${fromUpper} to ${toUpper} online for free. Fast, secure, and reliable file conversion. No registration required. Download your converted files instantly.`
    };

    return {
      title: `Free ${fromUpper} to ${toUpper} Converter - Convert ${fromUpper} to ${toUpper} Online | FlipFileX`,
      description: typeDescriptions[tool.type] || typeDescriptions['other'],
      keywords: `${from} to ${to}, ${from} to ${to} converter, convert ${from} to ${to}, ${from} to ${to} online, free ${from} to ${to}, ${from} to ${to} converter free, online ${from} to ${to} converter, ${from} converter, ${to} converter, convert ${from} file to ${to}, ${tool.type} converter, free ${tool.type} converter, online converter, convert ${from}, how to convert ${from} to ${to}, best ${from} to ${to} converter, flipfilex ${from} to ${to}`,
      alternates: {
        canonical: `https://flipfilex.com/${slug}`,
      }
    };
  }

  // For non-conversion tools (like PDF tools)
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Enhanced descriptions for specific tool types
  const specialTools: Record<string, { title: string; description: string; keywords: string; alternates?: { canonical: string } }> = {
    'compress-pdf': {
      title: 'Free PDF Compressor - Reduce PDF File Size Online | FlipFileX',
      description: 'Compress PDF files online for free. Reduce PDF file size without losing quality. Fast PDF compression with adjustable settings. No file limits, secure uploads.',
      keywords: 'compress pdf, pdf compressor, reduce pdf size, pdf compression, compress pdf online, free pdf compressor, shrink pdf, make pdf smaller, pdf optimizer, reduce pdf file size',
      alternates: {
        canonical: `https://flipfilex.com/${slug}`,
      }
    },
    'split-pdf': {
      title: 'Free PDF Splitter - Split PDF Pages Online | FlipFileX',
      description: 'Split PDF files online for free. Extract pages from PDF, divide PDF into multiple files. Fast, secure PDF splitting tool. No registration required.',
      keywords: 'split pdf, pdf splitter, divide pdf, extract pdf pages, split pdf pages, pdf page splitter, separate pdf pages, pdf split online, free pdf splitter',
      alternates: {
        canonical: `https://flipfilex.com/${slug}`,
      }
    },
    'pdf-merge': {
      title: 'Merge PDF Files - Combine PDFs Online Free | FlipFileX',
      description: 'Merge multiple PDF files into one document online. Free PDF merger tool with drag-and-drop. Combine PDFs in any order. Fast and secure.',
      keywords: 'merge pdf, combine pdf, pdf merger, join pdf, merge pdf files, combine pdf files, pdf combiner, merge multiple pdfs, pdf joiner, combine pdf online',
      alternates: {
        canonical: `https://flipfilex.com/${slug}`,
      }
    }
  };

  if (specialTools[slug]) {
    return specialTools[slug];
  }

  return {
    title: `${title} - Free Online Tool | FlipFileX`,
    description: `Free online ${title.toLowerCase()} tool. Fast, secure, and easy to use. Professional-grade ${tool.type} tool with no registration required. Get started instantly.`,
    keywords: `${slug}, ${slug.replace(/-/g, ' ')}, ${tool.type} tool, online ${tool.type}, free ${tool.type} tool, ${slug} online, free ${slug}, best ${slug} tool, flipfilex`,
    alternates: {
      canonical: `https://flipfilex.com/${slug}`,
    }
  };
}
