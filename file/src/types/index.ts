// Updated types/index.ts with audio support
export interface ConversionResponse {
  message: string;
  download_url: string;
  filename: string;
}

export interface VideoConversionResponse extends ConversionResponse {
  quality: string;
}

export interface AudioConversionResponse extends ConversionResponse {
  bitrate: string;
}

export interface PdfToImagesResponse extends ConversionResponse {
  image_count: number;
}

export interface PdfCompressionResponse {
  message: string;
  compression_id: string;
  status: string;
  estimated_time: string;
  input_filename: string;
  output_filename: string;
  compression_settings: {
    level: string;
    remove_metadata: boolean;
    optimize_images: boolean;
  };
}

export interface PdfProtectionResponse {
  message: string;
  operation_id: string;
  status: string;
  estimated_time: string;
  input_filename: string;
  output_filename: string;
  protection_settings: {
    encryption_level: string;
    permissions: string[];
    has_owner_password: boolean;
  };
}

export interface ApiError {
  detail: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileWithId {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  downloadUrl?: string;
}

export interface DropzoneProps {
  acceptedFileTypes: string[];
  maxFiles: number;
  onFilesSelected: (files: File[]) => void;
  isProcessing?: boolean;
  title: string;
  description: string;
}

// Updated ConversionType to include audio conversion
export type ConversionType =
  | 'pdf-to-word'
  | 'word-to-pdf'
  | 'merge-pdf'
  | 'pdf-to-images'
  | 'compress-pdf'
  | 'protect-pdf'
  | 'split-pdf'
  | 'png-to-webp'
  | 'wav-to-mp3'
  | 'convert-image'
  | 'convert-video'
  | 'convert-audio'
  | 'generate-qr-code';

export interface ConversionOptions {
  type: ConversionType;
  files: File[];
  targetFormat?: string;
  quality?: string; // For video conversion
  bitrate?: string; // For audio conversion
}

export interface SupportedFormatsResponse {
  input_formats: string[];
  output_formats: string[];
}

export interface SupportedVideoFormatsResponse {
  input_formats: string[];
  output_formats: string[];
  quality_options: string[];
  notes: {
    ffmpeg_available: boolean;
    [key: string]: any;
  };
}

// New interface for audio formats
export interface SupportedAudioFormatsResponse {
  input_formats: string[];
  output_formats: string[];
  bitrate_options: string[];
  notes: {
    ffmpeg_available: boolean;
    [key: string]: any;
  };
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
  dependencies: {
    aiofiles: boolean;
    PyPDF2: boolean;
    reportlab: boolean;
    'python-docx': boolean;
    pdf2image: boolean;
    PIL: boolean;
    'pillow-avif': boolean;
    pydub: boolean;
    ffmpeg: boolean;
    ffmpeg_video?: boolean;
    ffmpeg_audio?: boolean;
    poppler_path: string | null;
  };
}

// Audio format definitions
export interface AudioFormat {
  name: string;
  color: string;
  bgColor: string;
  category: 'Compressed' | 'Lossless';
}

export interface AudioFormats {
  [key: string]: AudioFormat;
}

export const AUDIO_FORMATS: AudioFormats = {
  // Compressed formats
  'mp3': { name: 'MP3', color: 'text-orange-600', bgColor: 'bg-orange-50', category: 'Compressed' },
  'aac': { name: 'AAC', color: 'text-blue-600', bgColor: 'bg-blue-50', category: 'Compressed' },
  'm4a': { name: 'M4A', color: 'text-pink-600', bgColor: 'bg-pink-50', category: 'Compressed' },
  'ogg': { name: 'OGG', color: 'text-green-600', bgColor: 'bg-green-50', category: 'Compressed' },
  'opus': { name: 'Opus', color: 'text-emerald-600', bgColor: 'bg-emerald-50', category: 'Compressed' },
  'wma': { name: 'WMA', color: 'text-red-600', bgColor: 'bg-red-50', category: 'Compressed' },
  'ac3': { name: 'AC3', color: 'text-violet-600', bgColor: 'bg-violet-50', category: 'Compressed' },
  
  // Lossless formats
  'wav': { name: 'WAV', color: 'text-purple-600', bgColor: 'bg-purple-50', category: 'Lossless' },
  'flac': { name: 'FLAC', color: 'text-indigo-600', bgColor: 'bg-indigo-50', category: 'Lossless' },
  'aiff': { name: 'AIFF', color: 'text-cyan-600', bgColor: 'bg-cyan-50', category: 'Lossless' }
};

// Utility functions for audio
export const getAudioFormatName = (format: string): string => {
  return AUDIO_FORMATS[format]?.name || format.toUpperCase();
};

export const isCompressedFormat = (format: string): boolean => {
  return AUDIO_FORMATS[format]?.category === 'Compressed';
};

export const isLosslessFormat = (format: string): boolean => {
  return AUDIO_FORMATS[format]?.category === 'Lossless';
};

export const getAudioFormatsByCategory = (category: 'Compressed' | 'Lossless'): [string, AudioFormat][] => {
  return Object.entries(AUDIO_FORMATS).filter(([, format]) => format.category === category);
};