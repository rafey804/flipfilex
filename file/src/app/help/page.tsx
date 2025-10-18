import type { Metadata } from 'next';
import Link from 'next/link';
import FAQSection from './FAQSection';
import SearchHelp from './SearchHelp';

export const metadata: Metadata = {
  title: 'Help Center - FlipFileX | File Conversion Support & FAQ',
  description: 'Get help with FlipFileX file conversion tools. Find answers to common questions, troubleshooting guides, and detailed tutorials for all our tools.',
  keywords: 'help center, FAQ, file conversion help, support, troubleshooting, tutorials',
  openGraph: {
    title: 'FlipFileX Help Center',
    description: 'Find answers to common questions and get help with file conversion.',
  },
  alternates: {
    canonical: 'https://flipfilex.com/help',
  },
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white text-2xl mb-6">
              ❓
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions, learn how to use our tools effectively, and get the support you need.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-900 font-medium">Help Center</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Quick Help Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
              🚀
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Getting Started</h3>
            <p className="text-gray-600 mb-4">New to FlipFileX? Learn the basics of our file conversion tools.</p>
            <Link href="#getting-started" className="text-blue-600 hover:text-blue-700 font-medium">
              Learn More →
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">
              🛠️
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tool Guides</h3>
            <p className="text-gray-600 mb-4">Detailed instructions for each of our 100+ conversion tools.</p>
            <Link href="#tool-guides" className="text-green-600 hover:text-green-700 font-medium">
              View Guides →
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">
              🔧
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Troubleshooting</h3>
            <p className="text-gray-600 mb-4">Having issues? Find solutions to common problems here.</p>
            <Link href="#troubleshooting" className="text-purple-600 hover:text-purple-700 font-medium">
              Get Help →
            </Link>
          </div>
        </div>

        {/* Functional Search Component */}
        <SearchHelp />

        {/* Getting Started Section */}
        <section id="getting-started" className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Getting Started with FlipFileX</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Convert Files</h3>
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                  <li>Choose the conversion tool you need from our homepage</li>
                  <li>Click "Choose File" or drag and drop your file</li>
                  <li>Wait for the automatic conversion to complete</li>
                  <li>Download your converted file instantly</li>
                  <li>Your original and converted files are automatically deleted after 1 hour</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>100+ specialized conversion tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>No registration or sign-up required</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Files processed securely and deleted automatically</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Works on all devices and browsers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Fast processing with high-quality results</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Categories */}
        <section id="tool-guides" className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Tool Categories & Guides</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <div className="text-3xl mb-3">📄</div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">PDF Tools</h3>
                <p className="text-red-800 text-sm mb-3">Convert, merge, split, and compress PDF files</p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• PDF to Word</li>
                  <li>• Word to PDF</li>
                  <li>• Merge PDFs</li>
                  <li>• Split PDF Pages</li>
                  <li>• Compress PDF</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="text-3xl mb-3">🖼️</div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Image Tools</h3>
                <p className="text-blue-800 text-sm mb-3">Convert between all popular image formats</p>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• HEIC to JPG</li>
                  <li>• PNG to WebP</li>
                  <li>• AVIF to PNG</li>
                  <li>• Image Compressor</li>
                  <li>• OCR Text Extraction</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="text-3xl mb-3">🎬</div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Video & Audio</h3>
                <p className="text-green-800 text-sm mb-3">Convert media files to any format</p>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• MP4 to MOV</li>
                  <li>• WAV to MP3</li>
                  <li>• Video Compression</li>
                  <li>• Audio Extraction</li>
                  <li>• Format Conversion</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="text-3xl mb-3">🛠️</div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Utility Tools</h3>
                <p className="text-purple-800 text-sm mb-3">Productivity and development tools</p>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• QR Code Generator</li>
                  <li>• Password Generator</li>
                  <li>• URL Shortener</li>
                  <li>• Base64 Encoder</li>
                  <li>• Hash Generator</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />

        {/* Troubleshooting Section */}
        <section id="troubleshooting" className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Troubleshooting Common Issues</h2>

            <div className="space-y-8">
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Issues</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-800">File won't upload</h4>
                    <p className="text-gray-600 text-sm">Check if your file size is under 100MB and in a supported format. Try refreshing the page and uploading again.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Upload keeps failing</h4>
                    <p className="text-gray-600 text-sm">This might be due to a slow internet connection. Try a smaller file first or check your network connection.</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Conversion Problems</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-800">Conversion takes too long</h4>
                    <p className="text-gray-600 text-sm">Large files may take a few minutes to process. If it takes more than 10 minutes, try refreshing and uploading again.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Poor quality results</h4>
                    <p className="text-gray-600 text-sm">Ensure your original file is high quality. Some formats may have limitations when converting to others.</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Download Issues</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-800">Download button not working</h4>
                    <p className="text-gray-600 text-sm">Make sure your browser allows downloads from our site. Check your popup blocker settings.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">File corrupted after download</h4>
                    <p className="text-gray-600 text-sm">This might be due to an interrupted download. Try downloading again with a stable internet connection.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="mailto:support@flipfilex.com"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Email Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}