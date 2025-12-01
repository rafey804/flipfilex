// Background Removal API Methods
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class BackgroundRemovalAPI {
  /**
   * Remove background from image
   */
  static async removeBackground(
    file: File,
    options: {
      outputFormat?: 'png' | 'jpg' | 'webp';
      backgroundColor?: string; // Format: 'r,g,b,a'
      edgeRefinement?: number; // 0-10
      quality?: number; // 1-100
    } = {},
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('output_format', options.outputFormat || 'png');

    if (options.backgroundColor) {
      formData.append('background_color', options.backgroundColor);
    }
    if (options.edgeRefinement !== undefined) {
      formData.append('edge_refinement', options.edgeRefinement.toString());
    }
    if (options.quality !== undefined) {
      formData.append('quality', options.quality.toString());
    }

    const response = await axios.post(
      `${API_BASE_URL}/bg-remove/remove`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
        timeout: 120000, // 2 minutes
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded / progressEvent.total) * 100)
            });
          }
        }
      }
    );

    return response.data;
  }

  /**
   * Blur background while keeping foreground sharp
   */
  static async blurBackground(
    file: File,
    blurIntensity: number = 20,
    outputFormat: 'png' | 'jpg' | 'webp' = 'png',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('blur_intensity', blurIntensity.toString());
    formData.append('output_format', outputFormat);

    const response = await axios.post(
      `${API_BASE_URL}/bg-remove/blur-background`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
        timeout: 120000,
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded / progressEvent.total) * 100)
            });
          }
        }
      }
    );

    return response.data;
  }

  /**
   * Replace background with custom image
   */
  static async replaceBackground(
    foreground: File,
    background: File,
    outputFormat: 'png' | 'jpg' | 'webp' = 'png',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('foreground', foreground);
    formData.append('background', background);
    formData.append('output_format', outputFormat);

    const response = await axios.post(
      `${API_BASE_URL}/bg-remove/replace-background`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
        timeout: 120000,
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded / progressEvent.total) * 100)
            });
          }
        }
      }
    );

    return response.data;
  }

  /**
   * Add gradient background to image
   */
  static async addGradientBackground(
    file: File,
    options: {
      gradientType?: 'linear' | 'radial';
      colorStart?: string; // Format: 'r,g,b'
      colorEnd?: string; // Format: 'r,g,b'
      outputFormat?: 'png' | 'jpg' | 'webp';
    } = {},
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('gradient_type', options.gradientType || 'linear');
    formData.append('color_start', options.colorStart || '138,43,226');
    formData.append('color_end', options.colorEnd || '75,0,130');
    formData.append('output_format', options.outputFormat || 'png');

    const response = await axios.post(
      `${API_BASE_URL}/bg-remove/gradient-background`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
        timeout: 120000,
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded / progressEvent.total) * 100)
            });
          }
        }
      }
    );

    return response.data;
  }

  /**
   * Batch remove backgrounds from multiple images
   */
  static async batchRemoveBackgrounds(
    files: File[],
    options: {
      outputFormat?: 'png' | 'jpg' | 'webp';
      backgroundColor?: string;
    } = {},
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Blob> {
    const formData = new FormData();

    files.forEach(file => {
      formData.append('files', file);
    });

    formData.append('output_format', options.outputFormat || 'png');

    if (options.backgroundColor) {
      formData.append('background_color', options.backgroundColor);
    }

    const response = await axios.post(
      `${API_BASE_URL}/bg-remove/batch-remove`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
        timeout: 300000, // 5 minutes for batch
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded / progressEvent.total) * 100)
            });
          }
        }
      }
    );

    return response.data;
  }

  /**
   * Resize processed image
   */
  static async resizeImage(
    file: File,
    size: 'small' | 'medium' | 'original' = 'original',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('size', size);

    const response = await axios.post(
      `${API_BASE_URL}/bg-remove/resize`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded / progressEvent.total) * 100)
            });
          }
        }
      }
    );

    return response.data;
  }
}
