// lib/api.ts - CORRECTED API service with proper SVG format validation
// Updated: 2025-11-14 12:30 - Fixed document conversion polling
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  onUploadProgress?: (progressEvent: any) => void;
  responseType?: string;
}

// Type definitions
export interface ConversionResponse {
  message: string;
  download_url: string;
  filename: string;
}

export interface VideoConversionResponse extends ConversionResponse {
  quality: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface SupportedFormatsResponse {
  input_formats: string[];
  output_formats: string[];
  notes?: {
    [key: string]: any;
  };
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

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging (reduced verbosity)
apiClient.interceptors.request.use(
  (config) => {
    // Only log errors, not all requests
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      }
    });
    return Promise.reject(error);
  }
);

type ProgressCallback = (progress: UploadProgress) => void;

// Helper function to poll document conversion progress
async function pollDocumentConversion(progressUrl: string, maxAttempts: number = 120): Promise<ConversionResponse> {
  console.log('🔄 Starting to poll document conversion...');
  console.log('Progress URL:', progressUrl);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

    try {
      const response = await apiClient.get<any>(progressUrl);
      const { status, download_url, message } = response.data;

      console.log(`📊 Poll attempt ${attempt}/${maxAttempts}: status=${status}`);

      if (status === 'completed') {
        console.log('✅ Document conversion completed!');
        console.log('Download URL:', download_url);

        const filename = download_url?.split('/').pop()?.split('?')[0] || 'converted-file.pdf';

        return {
          message: message || 'Conversion completed',
          download_url: download_url,
          filename: filename
        };
      } else if (status === 'error' || status === 'failed') {
        const errorMsg = message || 'Conversion failed';
        console.error('❌ Conversion failed:', errorMsg);
        throw new Error(errorMsg);
      }

      // Still processing, continue polling
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Conversion not found. It may have expired.');
      }
      // If it's not a 404, and it's not our custom error, rethrow
      if (error.message && !error.response) {
        throw error;
      }
    }
  }

  throw new Error('Conversion timeout - please try again with a smaller file');
}

export class ApiService {
  
  static async checkHealth(): Promise<HealthStatus> {
    try {
      const response = await apiClient.get<HealthStatus>('/health');
      return response.data;
    } catch (error: any) {
      console.error('Health check failed:', error);
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error(`Cannot connect to API server at ${API_BASE_URL}. Please ensure the backend server is running.`);
      } else if (error.code === 'ENOTFOUND') {
        throw new Error(`API server not found at ${API_BASE_URL}. Please check the server URL.`);
      } else if (error.response?.status === 404) {
        throw new Error('Health check endpoint not found. Please verify the API implementation.');
      } else if (error.response?.status >= 500) {
        throw new Error(`Server error (${error.response.status}): ${error.response.statusText}`);
      }
      
      throw new Error(`API health check failed: ${error.message}`);
    }
  }

  // IMAGE CONVERSION METHODS (CORRECTED)
  static async convertImage(
    file: File,
    targetFormat: string,
    onProgress?: ProgressCallback
  ): Promise<ConversionResponse> {
    // Client-side validation before sending request
    const validation = this.validateImageConversion(file, targetFormat);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_format', targetFormat);

    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000, // 5 minutes for image conversion
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded * 100) / event.total)
          };
          onProgress(progress);
        }
      };
    }

    try {
      const response = await apiClient.post<ConversionResponse>('/convert/convert-image', formData, requestConfig);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to conversion service. Please try again later.');
      }
      throw new Error(`Image conversion failed: ${error.message}`);
    }
  }

  // CORRECTED: Client-side format validation with SVG support
  static validateImageConversion(file: File, targetFormat: string): { valid: boolean; error?: string } {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    // CORRECTED: Define actual supported output formats including SVG
    const outputFormats = [
      'avif', 'webp', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico', 'heic', 'pdf', 'pcx', 'svg'
    ];
    
    // CORRECTED: Define input-only formats (removed SVG)
    const inputOnlyFormats = ['ai', 'eps', 'psd', 'cdr', 'xcf', 'gltf', 'obj', 'fbx', 'stl'];
    
    if (!targetFormat || !outputFormats.includes(targetFormat.toLowerCase())) {
      const formatName = targetFormat ? targetFormat.toUpperCase() : 'Unknown';
      return {
        valid: false,
        error: `Cannot convert to ${formatName}. This format cannot be created from raster images or is not supported. Please choose: ${outputFormats.join(', ')}`
      };
    }
    
    // Check for impossible raster to specialized format conversions
    const rasterFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'avif', 'webp', 'heic', 'ico', 'pcx', 'pdf'];
    const specializedFormats = ['ai', 'eps', 'cdr', 'psd']; // SVG removed from this list
    
    if (fileExtension && rasterFormats.includes(fileExtension) && specializedFormats.includes(targetFormat.toLowerCase())) {
      return {
        valid: false,
        error: `Cannot convert raster image (${fileExtension.toUpperCase()}) to specialized format (${targetFormat.toUpperCase()}). These formats require specialized project data.`
      };
    }
    
    // Special note for SVG output (but it's allowed)
    if (targetFormat.toLowerCase() === 'svg' && fileExtension && rasterFormats.includes(fileExtension)) {
      console.info('SVG output will embed the raster image as base64 data (not true vector conversion)');
    }
    
    return { valid: true };
  }

  // CORRECTED: getSupportedImageFormats with SVG in output formats
  static async getSupportedImageFormats(): Promise<SupportedFormatsResponse> {
    try {
      const response = await apiClient.get<SupportedFormatsResponse>('/convert/supported-formats');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get supported image formats:', error);
      // CORRECTED: Return realistic defaults with SVG included in output formats
      return {
        input_formats: ['avif', 'webp', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico', 'heic', 'svg', 'pdf', 'psd', 'pcx'],
        output_formats: ['avif', 'webp', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico', 'heic', 'pdf', 'pcx', 'svg'], // ADDED SVG
        notes: {
          svg_input: "SVG can be converted to raster formats only",
          svg_output: "SVG output embeds raster image as base64 data (not true vector conversion)", // ADDED
          vector_output: "Raster to vector conversion not supported for AI/EPS/PSD formats",
          psd_input: "Basic raster extraction only"
        }
      };
    }
  }

  // VIDEO CONVERSION METHODS (OPTIMIZED)
  static async convertVideo(
    file: File,
    targetFormat: string,
    quality: string = 'medium',
    onProgress?: ProgressCallback
  ): Promise<VideoConversionResponse> {
    // Client-side validation for video
    const validation = this.validateVideoConversion(file, targetFormat);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_format', targetFormat);
    formData.append('quality', quality);

    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 1200000, // 20 minutes
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded * 100) / event.total)
          };
          onProgress(progress);
        }
      };
    }

    try {
      const response = await apiClient.post<VideoConversionResponse>('/convert/convert-video', formData, requestConfig);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to conversion service. Please try again later.');
      }
      throw new Error(`Video conversion failed: ${error.message}`);
    }
  }

  // Video format validation
  static validateVideoConversion(file: File, targetFormat: string): { valid: boolean; error?: string } {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    const supportedVideoOutputs = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'mpeg', 'h264', 'h265'];
    const supportedVideoInputs = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'mpeg', 'mpg', 'h264', 'h265', 'hevc', 'm4v', '3gp', 'ts', 'mts'];
    
    if (!fileExtension || !supportedVideoInputs.includes(fileExtension)) {
      return {
        valid: false,
        error: `Unsupported video input format: ${fileExtension}. Supported: ${supportedVideoInputs.join(', ')}`
      };
    }
    
    if (!targetFormat || !supportedVideoOutputs.includes(targetFormat.toLowerCase())) {
      return {
        valid: false,
        error: `Unsupported video output format: ${targetFormat}. Supported: ${supportedVideoOutputs.join(', ')}`
      };
    }
    
    return { valid: true };
  }

  static async getSupportedVideoFormats(): Promise<SupportedVideoFormatsResponse> {
    try {
      const response = await apiClient.get<SupportedVideoFormatsResponse>('/convert/supported-video-formats');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get supported video formats:', error);
      return {
        input_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'mpeg', 'h264', 'h265'],
        output_formats: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'mpeg', 'h264', 'h265'],
        quality_options: ['high', 'medium', 'low', 'web'],
        notes: {
          ffmpeg_available: false
        }
      };
    }
  }

  static async getVideoInfo(filename: string): Promise<any> {
    try {
      const response = await apiClient.get(`/convert/video-info/${filename}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get video info:', error);
      throw new Error('Could not retrieve video information');
    }
  }

  // PDF CONVERSION METHODS
  static async convertPdfToWord(
    file: File, 
    onProgress?: ProgressCallback
  ): Promise<ConversionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000, // 3 minutes
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded * 100) / event.total)
          };
          onProgress(progress);
        }
      };
    }

    try {
      const response = await apiClient.post<ConversionResponse>('/convert/pdf-to-word', formData, requestConfig);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to conversion service. Please try again later.');
      }
      throw new Error('PDF to Word conversion failed');
    }
  }

  static async convertWordToPdf(
    file: File, 
    onProgress?: ProgressCallback
  ): Promise<ConversionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000, // 3 minutes
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded * 100) / event.total)
          };
          onProgress(progress);
        }
      };
    }

    try {
      const response = await apiClient.post<ConversionResponse>('/convert/word-to-pdf', formData, requestConfig);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to conversion service. Please try again later.');
      }
      throw new Error('Word to PDF conversion failed');
    }
  }

  static async mergePdfs(
    files: File[], 
    onProgress?: ProgressCallback
  ): Promise<ConversionResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000,
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded * 100) / event.total)
          };
          onProgress(progress);
        }
      };
    }

    try {
      const response = await apiClient.post<ConversionResponse>('/convert/merge-pdf', formData, requestConfig);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to conversion service. Please try again later.');
      }
      throw new Error('PDF merge failed');
    }
  }

  static async convertPdfToImages(
    file: File, 
    onProgress?: ProgressCallback
  ): Promise<ConversionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000,
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded * 100) / event.total)
          };
          onProgress(progress);
        }
      };
    }

    try {
      const response = await apiClient.post<ConversionResponse>('/convert/pdf-to-images', formData, requestConfig);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to conversion service. Please try again later.');
      }
      throw new Error('PDF to Images conversion failed');
    }
  }

  static async splitPDF(
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000,
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const percentage = Math.round((event.loaded * 100) / event.total);
          onProgress(percentage);
        }
      };
    }

    try {
      const response = await apiClient.post('/convert/split-pdf', formData, requestConfig);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to conversion service. Please try again later.');
      }
      throw new Error('PDF splitting failed');
    }
  }

  static async splitPdf(
    file: File,
    splitMode: string,
    pageRanges?: string,
    onProgress?: ProgressCallback
  ): Promise<ConversionResponse> {
    if (!file) {
      throw new Error('File is required for PDF splitting');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('split_mode', splitMode);
    if (pageRanges) {
      formData.append('page_ranges', pageRanges);
    }

    const updateProgress = (percentage: number) => {
      if (onProgress) {
        onProgress({ loaded: percentage, total: 100, percentage });
      }
    };

    const result = await this.splitPDF(formData, updateProgress);
    return result;
  }

  // DEPRECATED METHODS (keep for backward compatibility)
  static async convertPngToWebp(
    file: File, 
    onProgress?: ProgressCallback
  ): Promise<ConversionResponse> {
    return this.convertImage(file, 'webp', onProgress);
  }

  static async convertWavToMp3(
    file: File,
    onProgress?: ProgressCallback
  ): Promise<ConversionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000,
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded * 100) / event.total)
          };
          onProgress(progress);
        }
      };
    }

    try {
      const response = await apiClient.post<ConversionResponse>('/convert/wav-to-mp3', formData, requestConfig);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to conversion service. Please try again later.');
      }
      throw new Error('WAV to MP3 conversion failed');
    }
  }

  // IMAGE COMPRESSION METHOD
  static async compressImage(
    file: File,
    options: {
      quality?: number;
      format?: string;
      width?: number | null;
      height?: number | null;
      maintain_aspect_ratio?: boolean;
      optimize?: boolean;
      progressive?: boolean;
    } = {},
    onProgress?: ProgressCallback
  ): Promise<ConversionResponse> {
    // Validate input
    if (!file) {
      throw new Error('File is required for image compression');
    }

    // Validate file size (200MB max)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 200MB');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', (options.quality || 80).toString());
    formData.append('format', options.format || 'jpeg');

    if (options.width !== null && options.width !== undefined) {
      formData.append('width', options.width.toString());
    }
    if (options.height !== null && options.height !== undefined) {
      formData.append('height', options.height.toString());
    }

    formData.append('maintain_aspect_ratio', (options.maintain_aspect_ratio !== false).toString());
    formData.append('optimize', (options.optimize !== false).toString());
    formData.append('progressive', (options.progressive !== false).toString());

    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000, // 5 minutes for image compression
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded * 100) / event.total)
          };
          onProgress(progress);
        }
      };
    }

    try {
      const response = await apiClient.post<ConversionResponse>('/convert/compress-image', formData, requestConfig);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to compression service. Please try again later.');
      }
      throw new Error(`Image compression failed: ${error.message}`);
    }
  }

  // OCR TEXT EXTRACTION METHOD
  static async extractTextFromImage(
    file: File,
    options: {
      language?: string;
      engine?: string;
      enhance_image?: boolean;
      auto_rotate?: boolean;
      output_format?: string;
    } = {},
    onProgress?: ProgressCallback
  ): Promise<any> {
    // Validate input
    if (!file) {
      throw new Error('File is required for OCR processing');
    }

    // Validate file size (200MB max for OCR)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 200MB');
    }

    // Validate file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      throw new Error('Please select a valid image or PDF file');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', options.language || 'eng');
    formData.append('engine', options.engine || 'tesseract');
    formData.append('enhance_image', (options.enhance_image !== false).toString());
    formData.append('auto_rotate', (options.auto_rotate !== false).toString());
    formData.append('output_format', options.output_format || 'text');

    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000, // 5 minutes for OCR processing
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded * 100) / event.total)
          };
          onProgress(progress);
        }
      };
    }

    try {
      const response = await apiClient.post<ConversionResponse>('/convert/extract-text', formData, requestConfig);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to OCR service. Please try again later.');
      }
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  // QR CODE GENERATION METHOD
  static async generateQRCode(
    text: string,
    options: {
      format?: string;
      size?: number;
      border?: number;
      error_correction?: string;
      fill_color?: string;
      back_color?: string;
      style?: string;
    } = {},
    onProgress?: ProgressCallback
  ): Promise<ConversionResponse> {
    // Validate input
    if (!text || !text.trim()) {
      throw new Error('Text content is required for QR code generation');
    }

    if (text.length > 4296) {
      throw new Error('Text too long (maximum 4296 characters)');
    }

    const formData = new FormData();
    formData.append('text', text.trim());
    formData.append('format', options.format || 'png');
    formData.append('size', (options.size || 300).toString());
    formData.append('border', (options.border || 4).toString());
    formData.append('error_correction', options.error_correction || 'M');
    formData.append('fill_color', options.fill_color || '#000000');
    formData.append('back_color', options.back_color || '#ffffff');
    formData.append('style', options.style || 'square');

    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 1 minute for QR code generation
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded * 100) / event.total)
          };
          onProgress(progress);
        }
      };
    }

    try {
      const response = await apiClient.post<ConversionResponse>('/convert/generate-qr-code', formData, requestConfig);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to QR code service. Please try again later.');
      }
      throw new Error('QR code generation failed');
    }
  }

  // PDF COMPRESSION METHOD
  static async compressPdf(
    file: File,
    options: {
      compression_level?: string;
      remove_metadata?: boolean;
      optimize_images?: boolean;
    } = {},
    onProgress?: ProgressCallback
  ): Promise<{
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
  }> {
    // Validate input
    if (!file) {
      throw new Error('File is required for PDF compression');
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 100MB');
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('Please select a valid PDF file');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('compression_level', options.compression_level || 'medium');
    formData.append('remove_metadata', (options.remove_metadata !== false).toString());
    formData.append('optimize_images', (options.optimize_images !== false).toString());

    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000, // 5 minutes for PDF compression
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded * 100) / event.total)
          };
          onProgress(progress);
        }
      };
    }

    try {
      const response = await apiClient.post('/convert/compress-pdf', formData, requestConfig);
      return response.data as {
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
      };
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to compression service. Please try again later.');
      }
      throw new Error(`PDF compression failed: ${error.message}`);
    }
  }

  // PDF PASSWORD PROTECTION METHOD
  static async protectPdf(
    file: File,
    options: {
      user_password: string;
      owner_password?: string;
      encryption_level?: string;
      permissions?: string;
    },
    onProgress?: ProgressCallback
  ): Promise<{
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
  }> {
    // Validate input
    if (!file) {
      throw new Error('File is required for PDF protection');
    }

    if (!options.user_password || options.user_password.length < 4) {
      throw new Error('Password must be at least 4 characters long');
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 100MB');
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('Please select a valid PDF file');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_password', options.user_password);
    if (options.owner_password) {
      formData.append('owner_password', options.owner_password);
    }
    formData.append('encryption_level', options.encryption_level || 'standard');
    if (options.permissions) {
      formData.append('permissions', options.permissions);
    }

    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 minutes for PDF protection
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded * 100) / event.total)
          };
          onProgress(progress);
        }
      };
    }

    try {
      const response = await apiClient.post('/convert/protect-pdf', formData, requestConfig);
      return response.data as {
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
      };
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to protection service. Please try again later.');
      }
      throw new Error(`PDF protection failed: ${error.message}`);
    }
  }

  // PDF PASSWORD REMOVAL METHOD
  static async unprotectPdf(
    file: File,
    password: string,
    onProgress?: ProgressCallback
  ): Promise<{
    message: string;
    operation_id: string;
    status: string;
    estimated_time: string;
    input_filename: string;
    output_filename: string;
  }> {
    // Validate input
    if (!file) {
      throw new Error('File is required for PDF password removal');
    }

    if (!password) {
      throw new Error('Password is required to unlock PDF');
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 100MB');
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('Please select a valid PDF file');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    const requestConfig: RequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 minutes for PDF password removal
    };

    if (onProgress) {
      requestConfig.onUploadProgress = (event: any) => {
        if (event.total) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded * 100) / event.total)
          };
          onProgress(progress);
        }
      };
    }

    try {
      const response = await apiClient.post('/convert/unprotect-pdf', formData, requestConfig);
      return response.data as {
        message: string;
        operation_id: string;
        status: string;
        estimated_time: string;
        input_filename: string;
        output_filename: string;
      };
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to protection service. Please try again later.');
      }
      throw new Error(`PDF password removal failed: ${error.message}`);
    }
  }

  // PDF COMPRESSION STATUS CHECK
  static async getCompressionStatus(compressionId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/convert/compress-pdf/status/${compressionId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Compression not found');
      }
      throw new Error('Failed to get compression status');
    }
  }

  // PDF PROTECTION STATUS CHECK
  static async getProtectionStatus(operationId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/convert/pdf-password/status/${operationId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Operation not found');
      }
      throw new Error('Failed to get protection status');
    }
  }

  // UTILITY METHODS
  static getDownloadUrl(filename: string): string {
    return `${API_BASE_URL}/download/${filename}`;
  }

  static async downloadFile(filename: string): Promise<Blob> {
    try {
      const response = await apiClient.get<Blob>(`/download/${filename}`, {
        responseType: 'blob',
        timeout: 60000,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('File not found or has expired');
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to download service. Please try again later.');
      }
      throw new Error('File download failed');
    }
  }

  // UNIFIED CONVERT METHOD
  static async convert(
    type: ConversionType,
    files: File[],
    targetFormat?: string,
    quality?: string,
    onProgress?: ProgressCallback
  ): Promise<ConversionResponse | VideoConversionResponse> {
    switch (type) {
      case 'pdf-to-word':
        if (files.length !== 1) {
          throw new Error('PDF to Word conversion requires exactly one file');
        }
        return this.convertPdfToWord(files[0], onProgress);
      
      case 'word-to-pdf':
        if (files.length !== 1) {
          throw new Error('Word to PDF conversion requires exactly one file');
        }
        return this.convertWordToPdf(files[0], onProgress);
      
      case 'merge-pdf':
        if (files.length < 2) {
          throw new Error('PDF merge requires at least 2 files');
        }
        return this.mergePdfs(files, onProgress);
      
      case 'pdf-to-images':
        if (files.length !== 1) {
          throw new Error('PDF to Images conversion requires exactly one file');
        }
        return this.convertPdfToImages(files[0], onProgress);
      
      case 'png-to-webp':
        if (files.length !== 1) {
          throw new Error('PNG to WebP conversion requires exactly one file');
        }
        return this.convertPngToWebp(files[0], onProgress);
      
      case 'wav-to-mp3':
        if (files.length !== 1) {
          throw new Error('WAV to MP3 conversion requires exactly one file');
        }
        return this.convertWavToMp3(files[0], onProgress);
      
      case 'convert-image':
        if (files.length !== 1) {
          throw new Error('Image conversion requires exactly one file');
        }
        if (!targetFormat) {
          throw new Error('Target format is required for image conversion');
        }
        return this.convertImage(files[0], targetFormat, onProgress);
      
      case 'convert-video':
        if (files.length !== 1) {
          throw new Error('Video conversion requires exactly one file');
        }
        if (!targetFormat) {
          throw new Error('Target format is required for video conversion');
        }
        return this.convertVideo(files[0], targetFormat, quality || 'medium', onProgress);

      case 'generate-qr-code':
        throw new Error('QR code generation should use generateQRCode method directly');

      default:
        throw new Error('Unsupported conversion type');
    }
  }

  // GENERIC CONVERT FILE METHOD (for ConverterPageTemplate)
  static async convertFile(
    file: File,
    targetFormat: string,
    onProgress?: ProgressCallback
  ): Promise<ConversionResponse> {
    // Determine category based on file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

    // Image formats
    const imageFormats = ['avif', 'webp', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico', 'heic', 'svg', 'psd', 'pcx'];
    // Video formats
    const videoFormats = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'mpeg', 'mpg', 'h264', 'h265'];
    // Audio formats
    const audioFormats = ['wav', 'mp3', 'aac', 'm4a', 'ogg', 'opus', 'wma', 'flac', 'aiff'];
    // Document formats
    const documentFormats = ['pdf', 'docx', 'doc', 'txt', 'rtf', 'odt', 'html', 'htm', 'epub', 'mobi', 'markdown', 'md', 'latex', 'tex', 'xlsx', 'xls', 'xlsm', 'pptx', 'ppt', 'pptm', 'csv', 'json'];
    // Font formats
    const fontFormats = ['ttf', 'otf', 'woff', 'woff2', 'eot'];

    // Special handling for PDF: check target format to determine route
    if (fileExtension === 'pdf') {
      // If converting PDF to image format, use image converter
      if (imageFormats.includes(targetFormat)) {
        return this.convertImage(file, targetFormat, onProgress);
      }
      // Otherwise, treat as document conversion (PDF to text, PDF to word, etc.)
      // Will be handled in documentFormats section below
    }

    if (imageFormats.includes(fileExtension)) {
      return this.convertImage(file, targetFormat, onProgress);
    } else if (videoFormats.includes(fileExtension)) {
      return this.convertVideo(file, targetFormat, 'medium', onProgress);
    } else if (audioFormats.includes(fileExtension)) {
      // For audio, use generic conversion endpoint
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_format', targetFormat);

      const requestConfig: RequestConfig = {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000,
      };

      if (onProgress) {
        requestConfig.onUploadProgress = (event: any) => {
          if (event.total) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded * 100) / event.total)
            };
            onProgress(progress);
          }
        };
      }

      try {
        const response = await apiClient.post<ConversionResponse>('/convert/convert-audio', formData, requestConfig);
        return response.data;
      } catch (error: any) {
        if (error.response?.data?.detail) {
          throw new Error(error.response.data.detail);
        }
        throw new Error(`Audio conversion failed: ${error.message}`);
      }
    } else if (documentFormats.includes(fileExtension)) {
      // For documents, determine conversion type based on input and output formats
      let conversionType = '';

      // PDF to other formats
      if (fileExtension === 'pdf') {
        if (targetFormat === 'txt' || targetFormat === 'text') {
          conversionType = 'pdf_to_text';
        } else if (targetFormat === 'docx' || targetFormat === 'doc') {
          conversionType = 'pdf_to_word';
        }
      }
      // Office to PDF
      else if (['docx', 'doc'].includes(fileExtension) && targetFormat === 'pdf') {
        conversionType = 'word_to_pdf';
      }
      else if (['xlsx', 'xls', 'xlsm'].includes(fileExtension) && targetFormat === 'pdf') {
        conversionType = 'excel_to_pdf';
      }
      else if (['pptx', 'ppt', 'pptm'].includes(fileExtension) && targetFormat === 'pdf') {
        conversionType = 'powerpoint_to_pdf';
      }
      else if (['txt', 'text'].includes(fileExtension) && targetFormat === 'pdf') {
        conversionType = 'text_to_pdf';
      }
      else if (['html', 'htm'].includes(fileExtension) && targetFormat === 'pdf') {
        conversionType = 'html_to_pdf';
      }
      else if (['html', 'htm'].includes(fileExtension) && targetFormat === 'docx') {
        conversionType = 'html_to_docx';
      }
      else if (['markdown', 'md'].includes(fileExtension) && targetFormat === 'pdf') {
        conversionType = 'markdown_to_pdf';
      }
      else if (['markdown', 'md'].includes(fileExtension) && targetFormat === 'html') {
        conversionType = 'markdown_to_html';
      }
      else if (['latex', 'tex'].includes(fileExtension) && targetFormat === 'pdf') {
        conversionType = 'latex_to_pdf';
      }
      else if (fileExtension === 'docx' && targetFormat === 'txt') {
        conversionType = 'word_to_text';
      }
      else if (fileExtension === 'docx' && targetFormat === 'epub') {
        conversionType = 'docx_to_epub';
      }
      else if (['docx', 'doc'].includes(fileExtension) && ['html', 'htm'].includes(targetFormat)) {
        conversionType = 'word_to_html';
      }
      else if (fileExtension === 'txt' && targetFormat === 'epub') {
        conversionType = 'txt_to_epub';
      }
      else if (fileExtension === 'txt' && targetFormat === 'docx') {
        conversionType = 'text_to_word';
      }
      else if (fileExtension === 'epub' && targetFormat === 'pdf') {
        conversionType = 'epub_to_pdf';
      }
      else if (fileExtension === 'mobi' && targetFormat === 'epub') {
        conversionType = 'mobi_to_epub';
      }
      // Other conversions
      else if (fileExtension === 'csv' && targetFormat === 'xlsx') {
        conversionType = 'csv_to_excel';
      }
      else if (fileExtension === 'json' && targetFormat === 'csv') {
        conversionType = 'json_to_csv';
      }

      if (!conversionType) {
        throw new Error(`Unsupported document conversion: ${fileExtension} to ${targetFormat}`);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversion_type', conversionType);

      const requestConfig: RequestConfig = {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000,
      };

      if (onProgress) {
        requestConfig.onUploadProgress = (event: any) => {
          if (event.total) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded * 100) / event.total)
            };
            onProgress(progress);
          }
        };
      }

      try {
        console.log('📄 Starting document conversion...');
        const response = await apiClient.post<any>('/convert/convert-document', formData, requestConfig);

        const { conversion_id, progress_url } = response.data;
        console.log('Conversion ID:', conversion_id);

        if (!progress_url) {
          throw new Error('No progress URL returned from server');
        }

        // Use the helper function to poll for completion
        return await pollDocumentConversion(progress_url);
      } catch (error: any) {
        console.error('❌ Document conversion error:', error.message);
        if (error.response?.data?.detail) {
          throw new Error(error.response.data.detail);
        }
        throw new Error(`Document conversion failed: ${error.message}`);
      }
    } else if (fontFormats.includes(fileExtension)) {
      // Font conversion
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_format', targetFormat);

      const requestConfig: RequestConfig = {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000,
      };

      if (onProgress) {
        requestConfig.onUploadProgress = (event: any) => {
          if (event.total) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded * 100) / event.total)
            };
            onProgress(progress);
          }
        };
      }

      try {
        const response = await apiClient.post<ConversionResponse>('/convert/font', formData, requestConfig);
        return response.data;
      } catch (error: any) {
        if (error.response?.data?.detail) {
          throw new Error(error.response.data.detail);
        }
        throw new Error(`Font conversion failed: ${error.message}`);
      }
    } else {
      throw new Error(`Unsupported file format: ${fileExtension}`);
    }
  }

  static async isApiReachable(): Promise<boolean> {
    try {
      await this.checkHealth();
      return true;
    } catch (error) {
      return false;
    }
  }

  static async getApiStatus(): Promise<{
    reachable: boolean;
    url: string;
    error?: string;
    health?: HealthStatus;
  }> {
    try {
      const health = await this.checkHealth();
      return {
        reachable: true,
        url: API_BASE_URL,
        health
      };
    } catch (error: any) {
      return {
        reachable: false,
        url: API_BASE_URL,
        error: error.message
      };
    }
  }
}

// UTILITY FUNCTIONS
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// CORRECTED: File validation with SVG support
export const validateFile = (file: File, allowedTypes: string[]): string | null => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  if (!fileExtension) {
    return 'File must have a valid extension';
  }
  
  // Better type matching including SVG
  const isValidType = allowedTypes.some(type => {
    const normalizedType = type.toLowerCase();
    
    // Handle video formats
    if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv'].includes(normalizedType)) {
      return fileExtension === normalizedType;
    }
    
    // Handle video codec formats
    if (normalizedType === 'mpeg') return ['mpeg', 'mpg'].includes(fileExtension);
    if (normalizedType === 'h264') return fileExtension === 'h264';
    if (normalizedType === 'h265') return ['h265', 'hevc'].includes(fileExtension);
    
    // Handle image formats (including SVG)
    if (['avif', 'webp', 'png', 'gif', 'bmp', 'tiff', 'ico', 'heic', 'svg', 'psd', 'pcx'].includes(normalizedType)) {
      return fileExtension === normalizedType;
    }

    // Handle JPEG variants
    if (['jpg', 'jpeg'].includes(normalizedType)) {
      return ['jpg', 'jpeg'].includes(fileExtension);
    }

    // Handle document formats
    if (['pdf', 'docx', 'doc', 'txt', 'rtf', 'odt', 'html', 'htm', 'epub', 'mobi', 'markdown', 'md', 'latex', 'tex', 'xlsx', 'xls', 'xlsm', 'pptx', 'ppt', 'pptm', 'csv', 'json'].includes(normalizedType)) {
      return fileExtension === normalizedType ||
             (normalizedType === 'html' && fileExtension === 'htm') ||
             (normalizedType === 'markdown' && fileExtension === 'md') ||
             (normalizedType === 'latex' && fileExtension === 'tex');
    }

    // Handle font formats
    if (['ttf', 'otf', 'woff', 'woff2', 'eot'].includes(normalizedType)) {
      return fileExtension === normalizedType;
    }

    // Handle audio formats
    if (normalizedType === 'wav') return fileExtension === 'wav';
    
    return fileExtension === normalizedType;
  });
  
  if (!isValidType) {
    return `Invalid file type. File is ${fileExtension?.toUpperCase()}, but allowed types are: ${allowedTypes.map(t => t.toUpperCase()).join(', ')}`;
  }
  
  // File size limits
  let maxSize = 50 * 1024 * 1024; // 50MB default
  
  // Video files get larger limit
  const videoFormats = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'mpeg', 'h264', 'h265'];
  if (allowedTypes.some(type => videoFormats.includes(type.toLowerCase()))) {
    maxSize = 500 * 1024 * 1024; // 500MB for video
  }
  
  // Audio files get medium limit
  if (allowedTypes.includes('wav') || allowedTypes.includes('mp3')) {
    maxSize = 100 * 1024 * 1024; // 100MB for audio
  }
  
  if (file.size > maxSize) {
    const limit = videoFormats.some(format => allowedTypes.includes(format)) 
      ? '500MB' 
      : (allowedTypes.includes('wav') || allowedTypes.includes('mp3'))
        ? '100MB' 
        : '50MB';
    return `File too large (${formatFileSize(file.size)}). Maximum size is ${limit}`;
  }
  
  return null;
};

// CORRECTED: getAcceptedFileTypes with SVG support
export const getAcceptedFileTypes = (conversionType: ConversionType, sourceFormat?: string): string[] => {
  switch (conversionType) {
    case 'pdf-to-word': return ['pdf'];
    case 'word-to-pdf': return ['docx', 'doc'];
    case 'merge-pdf': return ['pdf'];
    case 'pdf-to-images': return ['pdf'];
    case 'compress-pdf': return ['pdf'];
    case 'protect-pdf': return ['pdf'];
    case 'split-pdf': return ['pdf'];
    case 'png-to-webp': return ['png'];
    case 'wav-to-mp3': return ['wav'];
    case 'convert-image':
      return sourceFormat ? [sourceFormat] : ['avif', 'webp', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico', 'heic', 'svg', 'pdf', 'psd', 'pcx'];
    case 'convert-video':
      return sourceFormat ? [sourceFormat] : ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'mpeg', 'h264', 'h265'];
    case 'convert-audio':
      return sourceFormat ? [sourceFormat] : ['wav', 'mp3', 'aac', 'm4a', 'ogg', 'opus', 'wma', 'ac3', 'flac', 'aiff'];
    default: return [];
  }
};