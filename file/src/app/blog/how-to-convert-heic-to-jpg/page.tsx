import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Convert HEIC to JPG - Free iPhone Photo Converter',
  description: 'Convert iPhone HEIC photos to JPG format for universal compatibility. Free online HEIC to JPG converter that works on all devices.',
  keywords: 'HEIC to JPG, iPhone photos, HEIC converter, convert iPhone photos, Apple HEIC, JPG converter',
};

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How to Convert HEIC to JPG: iPhone Photo Compatibility Guide
          </h1>
        </header>

        <article className="prose prose-lg max-w-none">
          <h2>What is HEIC Format?</h2>
          <p>
            HEIC (High Efficiency Image Container) is Apple's default photo format for iPhone and iPad, offering better
            compression than JPG while maintaining quality. However, HEIC isn't supported by all devices and platforms,
            making JPG conversion essential for sharing and compatibility.
          </p>

          <h2>Why Convert HEIC to JPG?</h2>
          <ul>
            <li><strong>Universal compatibility:</strong> JPG works on all devices and platforms</li>
            <li><strong>Social media sharing:</strong> All platforms accept JPG uploads</li>
            <li><strong>Email attachments:</strong> JPG displays correctly in all email clients</li>
            <li><strong>Photo editing:</strong> All software supports JPG format</li>
            <li><strong>Web use:</strong> JPG is the standard format for websites</li>
          </ul>

          <h2>Conversion Steps</h2>
          <ol>
            <li>Upload HEIC photos from your iPhone to our <Link href="/heic-to-jpg" className="text-blue-600">converter</Link></li>
            <li>Select quality settings (high recommended for photos)</li>
            <li>Convert and download JPG files</li>
            <li>Share or edit your universally compatible photos</li>
          </ol>

          <h2>iPhone Settings for JPG</h2>
          <p>
            To capture photos in JPG format directly on iPhone:
          </p>
          <ul>
            <li>Go to Settings → Camera → Formats</li>
            <li>Select "Most Compatible" instead of "High Efficiency"</li>
            <li>Your iPhone will now capture photos in JPG format</li>
          </ul>

          <h2>Quality Considerations</h2>
          <p>
            HEIC files are typically smaller than JPG while maintaining quality. When converting, choose high-quality
            settings to preserve photo details. The resulting JPG files will be larger but universally compatible.
          </p>

          <div className="bg-green-50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold text-green-900 mb-3">Convert iPhone Photos Now!</h3>
            <Link
              href="/heic-to-jpg"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Convert HEIC to JPG →
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}