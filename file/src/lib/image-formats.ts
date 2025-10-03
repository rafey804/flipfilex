// lib/image-formats.ts - Practical format configuration with proper TypeScript types

export interface ImageFormat {
  name: string;
  extension: string;
  mimeType: string;
  color: string;
  bgColor: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  popular: boolean;
}

export interface ConversionCombination {
  from: string;
  to: string;
  fromName: string;
  toName: string;
  url: string;
  popular: boolean;
  difficulty: number;
}

// Phase 1: Easy to implement (recommend starting here)
export const easyFormats: Record<string, ImageFormat> = {
  // Current formats
  'avif': { 
    name: 'AVIF', 
    extension: 'avif',
    mimeType: 'image/avif',
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50',
    description: 'Modern format with best compression',
    difficulty: 'easy',
    popular: true
  },
  'webp': { 
    name: 'WebP', 
    extension: 'webp',
    mimeType: 'image/webp',
    color: 'text-green-600', 
    bgColor: 'bg-green-50',
    description: 'Great web format with wide support',
    difficulty: 'easy',
    popular: true
  },
  'png': { 
    name: 'PNG', 
    extension: 'png',
    mimeType: 'image/png',
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50',
    description: 'Lossless with transparency support',
    difficulty: 'easy',
    popular: true
  },
  'jpg': { 
    name: 'JPG', 
    extension: 'jpg',
    mimeType: 'image/jpeg',
    color: 'text-red-600', 
    bgColor: 'bg-red-50',
    description: 'Universal compatibility, good compression',
    difficulty: 'easy',
    popular: true
  },
  'jpeg': { 
    name: 'JPEG', 
    extension: 'jpeg',
    mimeType: 'image/jpeg',
    color: 'text-red-600', 
    bgColor: 'bg-red-50',
    description: 'Same as JPG, different extension',
    difficulty: 'easy',
    popular: true
  },
  'gif': { 
    name: 'GIF', 
    extension: 'gif',
    mimeType: 'image/gif',
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-50',
    description: 'Animations and simple graphics',
    difficulty: 'easy',
    popular: true
  },
  'bmp': { 
    name: 'BMP', 
    extension: 'bmp',
    mimeType: 'image/bmp',
    color: 'text-indigo-600', 
    bgColor: 'bg-indigo-50',
    description: 'Uncompressed bitmap format',
    difficulty: 'easy',
    popular: false
  },
  'tiff': { 
    name: 'TIFF', 
    extension: 'tiff',
    mimeType: 'image/tiff',
    color: 'text-gray-600', 
    bgColor: 'bg-gray-50',
    description: 'High-quality professional format',
    difficulty: 'easy',
    popular: false
  },
  // Easy additions
  'ico': {
    name: 'ICO',
    extension: 'ico',
    mimeType: 'image/x-icon',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    description: 'Icon files for websites and apps',
    difficulty: 'easy',
    popular: true
  },
  'svg': {
    name: 'SVG',
    extension: 'svg',
    mimeType: 'image/svg+xml',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Scalable vector graphics',
    difficulty: 'medium', // SVG to raster is easy, raster to SVG is hard
    popular: true
  }
};

// Phase 2: Medium difficulty (implement later)
export const mediumFormats: Record<string, ImageFormat> = {
  'heic': {
    name: 'HEIC',
    extension: 'heic',
    mimeType: 'image/heic',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Apple iPhone photo format',
    difficulty: 'medium',
    popular: true
  },
  'jxl': {
    name: 'JPEG XL',
    extension: 'jxl',
    mimeType: 'image/jxl',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    description: 'Next-gen image format',
    difficulty: 'medium',
    popular: false
  }
};

// Phase 3: Hard to implement (consider carefully)
export const hardFormats: Record<string, ImageFormat> = {
  'psd': {
    name: 'PSD',
    extension: 'psd',
    mimeType: 'image/vnd.adobe.photoshop',
    color: 'text-blue-800',
    bgColor: 'bg-blue-50',
    description: 'Adobe Photoshop project file',
    difficulty: 'hard',
    popular: true
  },
  'ai': {
    name: 'AI',
    extension: 'ai',
    mimeType: 'application/postscript',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Adobe Illustrator vector file',
    difficulty: 'hard',
    popular: false
  },
  'eps': {
    name: 'EPS',
    extension: 'eps',
    mimeType: 'application/postscript',
    color: 'text-purple-800',
    bgColor: 'bg-purple-50',
    description: 'Encapsulated PostScript',
    difficulty: 'hard',
    popular: false
  }
};

// Combined formats for current use
export const currentFormats = easyFormats;

// Generate conversion combinations with proper typing
export const generateConversionCombinations = (formats: Record<string, ImageFormat>): ConversionCombination[] => {
  const combinations: ConversionCombination[] = [];
  const formatKeys = Object.keys(formats);
  
  formatKeys.forEach(from => {
    formatKeys.forEach(to => {
      if (from !== to) {
        combinations.push({
          from,
          to,
          fromName: formats[from].name,
          toName: formats[to].name,
          url: `${from}-to-${to}-converter`,
          popular: formats[from].popular && formats[to].popular,
          difficulty: Math.max(
            formats[from].difficulty === 'easy' ? 1 : formats[from].difficulty === 'medium' ? 2 : 3,
            formats[to].difficulty === 'easy' ? 1 : formats[to].difficulty === 'medium' ? 2 : 3
          )
        });
      }
    });
  });
  
  return combinations.sort((a, b) => {
    // Sort by popularity first, then difficulty
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return a.difficulty - b.difficulty;
  });
};

// Type-safe implementation priority
export const implementationPriority: string[] = [
  // Phase 1: High-value, easy formats
  'ico', // Very useful for web developers
  'heic', // iPhone users need this
  'svg', // Popular for web graphics
  
  // Phase 2: Medium difficulty but valuable
  'jxl', // Future-proofing
  
  // Phase 3: Only if you have significant resources
  'psd', // Limited conversion options
  'ai',  // Very complex
  'eps'  // Niche use case
];

// Backend implementation notes with proper typing
export const implementationNotes: Record<string, string> = {
  'ico': 'Use Pillow - straightforward',
  'heic': 'Requires pillow-heif library',
  'svg': 'SVG to raster: use cairosvg. Raster to SVG: very limited (tracing)',
  'jxl': 'Requires libjxl bindings',
  'psd': 'Use psd-tools (limited layer support)',
  'ai': 'Requires commercial libraries or very limited conversion',
  'eps': 'Requires Ghostscript integration'
};

// Type for difficulty levels
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Helper function to get formats by difficulty
export const getFormatsByDifficulty = (difficulty: DifficultyLevel): Record<string, ImageFormat> => {
  const allFormats = { ...easyFormats, ...mediumFormats, ...hardFormats };
  const filtered: Record<string, ImageFormat> = {};
  
  Object.entries(allFormats).forEach(([key, format]) => {
    if (format.difficulty === difficulty) {
      filtered[key] = format;
    }
  });
  
  return filtered;
};

// Helper function to get popular formats only
export const getPopularFormats = (): Record<string, ImageFormat> => {
  const allFormats = { ...easyFormats, ...mediumFormats, ...hardFormats };
  const filtered: Record<string, ImageFormat> = {};
  
  Object.entries(allFormats).forEach(([key, format]) => {
    if (format.popular) {
      filtered[key] = format;
    }
  });
  
  return filtered;
};

// Updated backend converter example for ICO with proper typing
export const backendExampleICO = `
# Backend implementation for ICO support
from PIL import Image
from typing import List, Tuple
import io

def convert_to_ico(input_path: str, output_path: str) -> bool:
    """Convert image to ICO format with multiple sizes"""
    try:
        with Image.open(input_path) as img:
            # ICO supports multiple sizes, create common favicon sizes
            sizes: List[Tuple[int, int]] = [(16, 16), (32, 32), (48, 48)]
            
            # Resize and save as ICO
            img.save(output_path, format='ICO', sizes=sizes)
            return True
    except Exception as e:
        print(f"ICO conversion error: {e}")
        return False

def convert_from_ico(input_path: str, output_path: str, target_format: str) -> bool:
    """Convert ICO to other image formats"""
    try:
        with Image.open(input_path) as img:
            # ICO files can contain multiple images, get the largest
            if hasattr(img, 'n_frames') and img.n_frames > 1:
                # Find the largest frame
                largest_size = 0
                largest_frame = 0
                for i in range(img.n_frames):
                    img.seek(i)
                    size = img.width * img.height
                    if size > largest_size:
                        largest_size = size
                        largest_frame = i
                img.seek(largest_frame)
            
            # Convert and save
            if target_format.upper() == 'JPEG' and img.mode in ['RGBA', 'LA']:
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            img.save(output_path, format=target_format.upper())
            return True
    except Exception as e:
        print(f"ICO conversion error: {e}")
        return False
`;