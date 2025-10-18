'use client';

import { useState, useMemo } from 'react';

interface SearchResult {
  title: string;
  content: string;
  category: string;
  section: string;
  id: string;
}

const helpContent: SearchResult[] = [
  // Getting Started
  { id: '1', title: 'How to convert files', content: 'Choose the conversion tool you need from our homepage. Click Choose File or drag and drop your file. Wait for the automatic conversion to complete. Download your converted file instantly.', category: 'Getting Started', section: 'getting-started' },
  { id: '2', title: 'No registration required', content: '100+ specialized conversion tools with no registration or sign-up required. Files processed securely and deleted automatically.', category: 'Getting Started', section: 'getting-started' },
  { id: '3', title: 'Supported devices', content: 'Works on all devices and browsers. Fast processing with high-quality results. Compatible with Windows, Mac, iOS, Android.', category: 'Getting Started', section: 'getting-started' },

  // PDF Tools
  { id: '4', title: 'PDF to Word conversion', content: 'Convert PDF documents to editable Word format. Maintains formatting, fonts, images, and layout. 98% accuracy guaranteed.', category: 'PDF Tools', section: 'tool-guides' },
  { id: '5', title: 'Word to PDF conversion', content: 'Transform Word documents into professional PDFs. Perfect formatting preservation and universal compatibility.', category: 'PDF Tools', section: 'tool-guides' },
  { id: '6', title: 'Merge PDF files', content: 'Combine multiple PDF documents into a single file. Maintain quality and formatting across all merged documents.', category: 'PDF Tools', section: 'tool-guides' },
  { id: '7', title: 'Split PDF pages', content: 'Extract specific pages from PDF documents or split into individual pages. Choose page ranges or split all pages.', category: 'PDF Tools', section: 'tool-guides' },
  { id: '8', title: 'Compress PDF files', content: 'Reduce PDF file size while maintaining quality. Optimize for web sharing or email attachments.', category: 'PDF Tools', section: 'tool-guides' },

  // Image Tools
  { id: '9', title: 'HEIC to JPG conversion', content: 'Convert iPhone HEIC photos to universal JPG format. Perfect for sharing and compatibility across all devices.', category: 'Image Tools', section: 'tool-guides' },
  { id: '10', title: 'PNG to WebP conversion', content: 'Convert PNG images to modern WebP format for better compression and faster loading times.', category: 'Image Tools', section: 'tool-guides' },
  { id: '11', title: 'AVIF to PNG conversion', content: 'Convert modern AVIF images to widely supported PNG format for maximum compatibility.', category: 'Image Tools', section: 'tool-guides' },
  { id: '12', title: 'Image compression', content: 'Reduce image file sizes while maintaining visual quality. Support for JPG, PNG, WebP formats.', category: 'Image Tools', section: 'tool-guides' },
  { id: '13', title: 'OCR text extraction', content: 'Extract text from images using advanced OCR technology. Convert scanned documents to editable text.', category: 'Image Tools', section: 'tool-guides' },

  // Video & Audio
  { id: '14', title: 'MP4 to MOV conversion', content: 'Convert MP4 videos to MOV format for Mac compatibility. Maintains video quality and metadata.', category: 'Video & Audio', section: 'tool-guides' },
  { id: '15', title: 'WAV to MP3 conversion', content: 'Convert high-quality WAV audio files to compressed MP3 format for easier sharing and storage.', category: 'Video & Audio', section: 'tool-guides' },
  { id: '16', title: 'Video compression', content: 'Reduce video file sizes while maintaining quality. Support for multiple video formats.', category: 'Video & Audio', section: 'tool-guides' },

  // Utility Tools
  { id: '17', title: 'QR Code Generator', content: 'Create custom QR codes for URLs, text, contact information, WiFi credentials, and more.', category: 'Utility Tools', section: 'tool-guides' },
  { id: '18', title: 'Password Generator', content: 'Generate secure, random passwords with customizable length and character sets for maximum security.', category: 'Utility Tools', section: 'tool-guides' },
  { id: '19', title: 'URL Shortener', content: 'Create short, memorable links from long URLs. Track clicks and manage your shortened links.', category: 'Utility Tools', section: 'tool-guides' },
  { id: '20', title: 'Base64 Encoder', content: 'Encode and decode text or files to/from Base64 format for data transmission and storage.', category: 'Utility Tools', section: 'tool-guides' },

  // Troubleshooting
  { id: '21', title: 'File upload issues', content: 'Check if your file size is under 100MB and in a supported format. Try refreshing the page and uploading again.', category: 'Troubleshooting', section: 'troubleshooting' },
  { id: '22', title: 'Upload keeps failing', content: 'This might be due to a slow internet connection. Try a smaller file first or check your network connection.', category: 'Troubleshooting', section: 'troubleshooting' },
  { id: '23', title: 'Conversion takes too long', content: 'Large files may take a few minutes to process. If it takes more than 10 minutes, try refreshing and uploading again.', category: 'Troubleshooting', section: 'troubleshooting' },
  { id: '24', title: 'Poor quality results', content: 'Ensure your original file is high quality. Some formats may have limitations when converting to others.', category: 'Troubleshooting', section: 'troubleshooting' },
  { id: '25', title: 'Download button not working', content: 'Make sure your browser allows downloads from our site. Check your popup blocker settings.', category: 'Troubleshooting', section: 'troubleshooting' },
  { id: '26', title: 'File corrupted after download', content: 'This might be due to an interrupted download. Try downloading again with a stable internet connection.', category: 'Troubleshooting', section: 'troubleshooting' },

  // Security & Privacy
  { id: '27', title: 'File security', content: 'All files are encrypted during upload and processing, then automatically deleted from our servers within 1 hour.', category: 'Security', section: 'security' },
  { id: '28', title: 'Privacy protection', content: 'We never store, access, or share your files with anyone. GDPR compliant with automatic file deletion.', category: 'Security', section: 'security' },
  { id: '29', title: 'SSL encryption', content: 'All file transfers are protected with SSL encryption. Your data is secure during the entire conversion process.', category: 'Security', section: 'security' },

  // Account & Billing
  { id: '30', title: 'Free to use', content: 'All tools are completely free with no hidden charges, subscriptions, or usage limitations.', category: 'Account', section: 'account' },
  { id: '31', title: 'No account needed', content: 'No registration or account creation required. Start converting files immediately without any setup.', category: 'Account', section: 'account' },
  { id: '32', title: 'File size limits', content: 'Maximum file size limit is 100MB per file. This covers most common use cases while ensuring fast processing.', category: 'Account', section: 'account' }
];

export default function SearchHelp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Getting Started', 'PDF Tools', 'Image Tools', 'Video & Audio', 'Utility Tools', 'Troubleshooting', 'Security', 'Account'];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return helpContent
      .filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch =
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      })
      .slice(0, 10); // Limit to 10 results
  }, [searchQuery, selectedCategory]);

  const handleScrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Search for Help</h2>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for answers, guides, or troubleshooting..."
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            <>
              <div className="text-sm text-gray-600 mb-4">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
              </div>
              {searchResults.map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{result.title}</h3>
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed">{result.content}</p>
                      <div className="flex items-center space-x-3">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {result.category}
                        </span>
                        <button
                          onClick={() => handleScrollToSection(result.section)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Go to section →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                No results found for "{searchQuery}"
              </div>
              <p className="text-gray-600 text-sm">
                Try different keywords or browse the categories below
              </p>
            </div>
          )}
        </div>
      )}

      {/* Help Tips */}
      {!searchQuery.trim() && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Search Tips:</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Try searching for "PDF", "convert", "upload", "download"</li>
            <li>• Use specific tool names like "Word to PDF" or "HEIC to JPG"</li>
            <li>• Search for problems like "file won't upload" or "conversion failed"</li>
            <li>• Filter by category for more targeted results</li>
          </ul>
        </div>
      )}
    </div>
  );
}