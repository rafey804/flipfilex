import { Metadata } from 'next';
import OcrImageToTextClient from './OcrImageToTextClient';

export const metadata: Metadata = {
  title: 'Free OCR - Extract Text from Images Online | Image to Text Converter',
  description: 'Convert images to text online for free. Advanced OCR technology extracts text from JPG, PNG, PDF images with high accuracy. Support for 100+ languages.',
  keywords: 'OCR, image to text, extract text from image, online OCR, text recognition, image text converter, free OCR tool',
  alternates: {
    canonical: '/ocr-image-to-text',
  },
  openGraph: {
    title: 'Free OCR - Extract Text from Images Online',
    description: 'Professional OCR tool to extract text from images. Support for 100+ languages with high accuracy text recognition.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free OCR - Extract Text from Images Online',
    description: 'Convert images to text with advanced OCR technology. Free, fast, and accurate.',
  },
};

export default function OCRImageToTextPage() {
  return <OcrImageToTextClient />;
}