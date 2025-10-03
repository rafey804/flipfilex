import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Optimized Image Component with automatic WebP/AVIF conversion
 * Provides lazy loading, blur placeholder, and error handling
 *
 * Usage:
 * <OptimizedImage
 *   src="/images/example.jpg"
 *   alt="Descriptive alt text"
 *   width={800}
 *   height={600}
 *   priority={false} // Set true for above-the-fold images
 * />
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  objectFit = 'cover'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fallback image for errors
  const fallbackSrc = '/images/placeholder.png';

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        quality={quality}
        className={`${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
        style={{ objectFit }}
        sizes={sizes || '100vw'}
        priority={priority}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      quality={quality}
      className={`${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
      sizes={sizes}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      onLoadingComplete={() => setIsLoading(false)}
      onError={() => setHasError(true)}
    />
  );
}
