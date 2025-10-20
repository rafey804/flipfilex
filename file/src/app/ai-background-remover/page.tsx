import type { Metadata } from 'next';
import BackgroundRemoverUpload from '@/components/BackgroundRemoverUpload';
import ScrollToTopButton from '@/components/ScrollToTopButton';

export const metadata: Metadata = {
  title: 'AI Background Remover - Remove Image Backgrounds Instantly | FlipFileX',
  description: 'Professional AI-powered background removal tool. Remove backgrounds from images instantly using briaai/RMBG-1.4 model. Supports PNG, JPG, WEBP, HEIC. Free, fast, and easy to use.',
  keywords: [
    'background remover',
    'remove background',
    'ai background removal',
    'transparent background',
    'image background remover',
    'remove bg',
    'background eraser',
    'cutout image',
    'briaai rmbg',
    'free background remover',
    'online background remover',
    'remove image background',
    'photo background remover',
    'png background remover',
    'automatic background removal'
  ],
  openGraph: {
    title: 'AI Background Remover - Remove Image Backgrounds Instantly',
    description: 'Professional AI-powered background removal tool. Remove backgrounds from images instantly with advanced features like gradient backgrounds, blur effects, and custom backgrounds.',
    type: 'website',
    url: 'https://flipfilex.com/ai-background-remover',
    images: [
      {
        url: '/og-background-remover.png',
        width: 1200,
        height: 630,
        alt: 'AI Background Remover Tool'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Background Remover - Remove Image Backgrounds Instantly',
    description: 'Professional AI-powered background removal tool. Remove backgrounds from images instantly.',
    images: ['/og-background-remover.png']
  },
  alternates: {
    canonical: 'https://flipfilex.com/ai-background-remover'
  }
};

export default function AIBackgroundRemoverPage() {
  return (
    <>
      <BackgroundRemoverUpload />

      {/* SEO Content */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional AI Background Removal Tool
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Remove backgrounds from images instantly with our advanced AI-powered background remover.
              Powered by the briaai/RMBG-1.4 model, our tool delivers professional-quality results in seconds.
              Whether you need transparent backgrounds for product photos, social media content, or professional headshots,
              our background removal tool handles it all with precision and ease.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">🎯 Precise AI Detection</h3>
                <p className="text-gray-700">
                  Uses advanced briaai/RMBG-1.4 AI model for accurate subject detection and clean edge separation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">🎨 Custom Backgrounds</h3>
                <p className="text-gray-700">
                  Add transparent, solid colors, gradients, blur effects, or upload your own custom background images.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">⚡ Batch Processing</h3>
                <p className="text-gray-700">
                  Process multiple images at once and download them all in a convenient ZIP file.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">🔧 Advanced Controls</h3>
                <p className="text-gray-700">
                  Edge refinement, quality settings, multiple output formats (PNG, JPG, WEBP), and more.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">👁️ Before/After Comparison</h3>
                <p className="text-gray-700">
                  Interactive slider to compare original and processed images side-by-side.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">💾 Session History</h3>
                <p className="text-gray-700">
                  Keep track of your recent edits and quickly access previously processed images.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How to Remove Background from Images
            </h2>
            <ol className="space-y-4 text-gray-700 text-lg">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <strong>Upload Your Image:</strong> Drag and drop your image or click to browse.
                  Supports JPG, PNG, WEBP, and HEIC formats up to 10MB.
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <strong>Choose Background Option:</strong> Select transparent, solid color, gradient,
                  blur effect, or upload a custom background image.
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <strong>Adjust Settings (Optional):</strong> Fine-tune edge refinement, output quality,
                  and format for perfect results.
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                <div>
                  <strong>Remove Background:</strong> Click the "Remove Background" button and watch the
                  AI work its magic in seconds.
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                <div>
                  <strong>Download Your Image:</strong> Compare before/after, zoom in to check edges,
                  and download your processed image instantly.
                </div>
              </li>
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Use Cases for Background Removal
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">🛍️ E-commerce</h3>
                <p className="text-gray-700">
                  Create professional product photos with clean white backgrounds for online stores.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">📱 Social Media</h3>
                <p className="text-gray-700">
                  Make eye-catching posts, stories, and profile pictures with custom backgrounds.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">💼 Professional Headshots</h3>
                <p className="text-gray-700">
                  Remove distracting backgrounds from portraits for LinkedIn and resumes.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">🎨 Graphic Design</h3>
                <p className="text-gray-700">
                  Extract subjects for use in posters, flyers, and marketing materials.
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">📸 Photo Editing</h3>
                <p className="text-gray-700">
                  Composite images, change backgrounds, and create artistic effects.
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">🎓 Presentations</h3>
                <p className="text-gray-700">
                  Clean up images for slides, documents, and educational materials.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our AI Background Remover?
            </h2>
            <ul className="space-y-3 text-gray-700 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-2xl">✓</span>
                <span><strong>State-of-the-Art AI:</strong> Powered by briaai/RMBG-1.4, one of the most advanced background removal models available.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-2xl">✓</span>
                <span><strong>Free to Use:</strong> No subscription, no credits, no hidden fees. Process as many images as you need.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-2xl">✓</span>
                <span><strong>Privacy First:</strong> Your images are processed securely and are not stored on our servers.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-2xl">✓</span>
                <span><strong>Instant Results:</strong> Get professional-quality results in seconds, not minutes.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-2xl">✓</span>
                <span><strong>No Software Required:</strong> Works entirely in your browser - no downloads or installations needed.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-2xl">✓</span>
                <span><strong>Professional Features:</strong> Edge refinement, quality controls, and multiple output formats for pixel-perfect results.</span>
              </li>
            </ul>
          </section>

          <section className="mb-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">What file formats are supported?</h3>
                <p className="text-purple-100">
                  We support JPG, JPEG, PNG, WEBP, and HEIC image formats. You can export as PNG (transparent),
                  JPG, or WEBP.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Is there a file size limit?</h3>
                <p className="text-purple-100">
                  Yes, the maximum file size is 10MB per image. This ensures fast processing while handling
                  most standard images.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Can I process multiple images at once?</h3>
                <p className="text-purple-100">
                  Yes! Enable batch mode to upload and process multiple images. They'll be returned in a
                  convenient ZIP file.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">How accurate is the background removal?</h3>
                <p className="text-purple-100">
                  Our tool uses the briaai/RMBG-1.4 AI model, which provides highly accurate results for most
                  images. You can use edge refinement to fine-tune the results.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Are my images stored or used for training?</h3>
                <p className="text-purple-100">
                  No. Your privacy is important to us. Images are processed temporarily and automatically deleted.
                  We never store or use your images for any purpose.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center bg-white p-12 rounded-2xl shadow-xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Remove Backgrounds?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Start creating professional images with transparent backgrounds in seconds!
            </p>
            <ScrollToTopButton />
          </section>
        </div>
      </div>
    </>
  );
}
