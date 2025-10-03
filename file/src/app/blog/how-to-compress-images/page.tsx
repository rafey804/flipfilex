import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Compress Images - Free Image Compressor Guide',
  description: 'Learn how to compress images to reduce file size while maintaining quality. Free online image compressor supporting JPG, PNG, WebP, and more.',
  keywords: 'image compressor, compress images, reduce image size, optimize images, image optimization, smaller images',
};

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How to Compress Images: Complete Guide to Image Optimization
          </h1>
        </header>

        <article className="prose prose-lg max-w-none">
          <h2>Why Compress Images?</h2>
          <p>
            Large image files slow down websites, consume storage space, and take longer to share. Image compression
            reduces file sizes by up to 90% while maintaining visual quality, improving website performance, and
            saving bandwidth costs.
          </p>

          <h2>Compression Methods</h2>
          <ul>
            <li><strong>Lossless:</strong> Reduces size without quality loss (PNG, WebP lossless)</li>
            <li><strong>Lossy:</strong> Higher compression with minimal quality impact (JPG, WebP)</li>
            <li><strong>Adaptive:</strong> Smart compression based on image content</li>
          </ul>

          <h2>How to Compress Images</h2>
          <ol>
            <li>Upload images to our <Link href="/image-compressor" className="text-blue-600">image compressor</Link></li>
            <li>Choose compression level (low, medium, high)</li>
            <li>Preview quality before and after compression</li>
            <li>Download optimized images with smaller file sizes</li>
          </ol>

          <h2>When to Use Different Compression Levels</h2>
          <ul>
            <li><strong>Low (10-30% reduction):</strong> Professional photos, print materials</li>
            <li><strong>Medium (30-60% reduction):</strong> Website images, social media</li>
            <li><strong>High (60-90% reduction):</strong> Web thumbnails, email attachments</li>
          </ul>

          <h2>Format-Specific Tips</h2>
          <ul>
            <li><strong>JPG:</strong> Best for photos, use quality 75-85% for web</li>
            <li><strong>PNG:</strong> Ideal for graphics with transparency</li>
            <li><strong>WebP:</strong> Modern format with superior compression</li>
            <li><strong>AVIF:</strong> Next-gen format with excellent compression</li>
          </ul>

          <div className="bg-cyan-50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold text-cyan-900 mb-3">Optimize Your Images Now!</h3>
            <Link
              href="/image-compressor"
              className="inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700"
            >
              Compress Images →
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}