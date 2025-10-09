// Tool configuration mapping slugs to components and their props

export interface ToolConfig {
  component: string; // Component name to dynamically import
  props?: any; // Props to pass to the component
  type: 'audio' | 'video' | 'document' | 'image' | 'pdf' | 'other';
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

  // Video conversion tools
  'mp4-to-mov': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mp4', targetFormat: 'mov' },
    type: 'video'
  },
  'mov-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mov', targetFormat: 'mp4' },
    type: 'video'
  },
  'avi-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'avi', targetFormat: 'mp4' },
    type: 'video'
  },
  'mkv-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mkv', targetFormat: 'mp4' },
    type: 'video'
  },
  'webm-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'webm', targetFormat: 'mp4' },
    type: 'video'
  },
  'wmv-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'wmv', targetFormat: 'mp4' },
    type: 'video'
  },
  'flv-to-mp4': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'flv', targetFormat: 'mp4' },
    type: 'video'
  },
  'mp4-to-webm': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mp4', targetFormat: 'webm' },
    type: 'video'
  },
  'mov-to-webm': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mov', targetFormat: 'webm' },
    type: 'video'
  },
  'avi-to-mov': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'avi', targetFormat: 'mov' },
    type: 'video'
  },
  'mkv-to-mov': {
    component: 'VideoFormatConverter',
    props: { sourceFormat: 'mkv', targetFormat: 'mov' },
    type: 'video'
  },

  // Document conversion tools
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

  // EPUB tools
  'epub-to-pdf': {
    component: 'EpubToPdfClient',
    props: {},
    type: 'document'
  },
  'mobi-to-pdf': {
    component: 'EpubToPdfClient',
    props: { sourceFormat: 'mobi' },
    type: 'document'
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

// Helper function to generate metadata for a tool
export function getToolMetadata(slug: string) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const { props } = tool;

  // Handle conversion type format (for DocumentConverter)
  if (props?.conversionType) {
    const [from, to] = props.conversionType.split('-to-');
    return {
      title: `Convert ${from.toUpperCase()} to ${to.toUpperCase()} Online Free | FlipFileX`,
      description: `Free online ${from.toUpperCase()} to ${to.toUpperCase()} converter. Fast, secure, and high-quality conversion. No registration required.`,
      keywords: `${from} to ${to}, convert ${from}, ${to} converter, ${tool.type} converter, online converter, free converter`
    };
  }

  // Handle source/target format (for other converters)
  const from = props?.sourceFormat || '';
  const to = props?.targetFormat || '';

  if (from && to) {
    return {
      title: `Convert ${from.toUpperCase()} to ${to.toUpperCase()} Online Free | FlipFileX`,
      description: `Free online ${from.toUpperCase()} to ${to.toUpperCase()} converter. Fast, secure, and high-quality conversion. No registration required.`,
      keywords: `${from} to ${to}, convert ${from}, ${to} converter, ${tool.type} converter, online converter, free converter`
    };
  }

  // For non-conversion tools (like PDF tools)
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} - Free Online Tool | FlipFileX`,
    description: `Free online ${title.toLowerCase()} tool. Fast, secure, and easy to use. No registration required.`,
    keywords: `${slug}, ${tool.type} tool, online ${tool.type}, free ${tool.type} tool`
  };
}
