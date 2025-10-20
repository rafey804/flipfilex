'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface ReactNode {
  ReactNode?: any;
}

interface FooterProps {
  children?: ReactNode;
}

export default function Footer({ children }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');


  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    console.log(`Language changed to: ${newLanguage}`);
  };

  const currentYear = new Date().getFullYear();

  // Only ready/built PDF Tools
  const pdfToolLinks = [
    { name: 'PDF to Word', href: '/convert-pdf-to-word-online', icon: '📝', popular: true },
    { name: 'Word to PDF', href: '/word-to-pdf-online', icon: '📄', popular: true },
    { name: 'Merge PDFs', href: '/merge-pdf-files-free', icon: '🔗', popular: true },
    { name: 'Split PDF', href: '/split-pdf-pages', icon: '✂️', popular: true },
    { name: 'PDF to Images', href: '/pdf-to-images-converter', icon: '🖼️', popular: true },
    { name: 'Compress PDF', href: '/compress-pdf', icon: '🗜️', popular: true },
    { name: 'PDF Password Protection', href: '/pdf-password-protection', icon: '🔒', popular: true }
  ];

  // Ready/built Image Converter Tools
  const imageToolLinks = [
    { name: 'PNG to WebP', href: '/png-to-webp', icon: '🌐', popular: true },
    { name: 'AVIF to PNG', href: '/avif-to-png', icon: '🎨', popular: true },
    { name: 'WebP to PNG', href: '/webp-to-png', icon: '📸', popular: true },
    { name: 'JPG to PNG', href: '/jpg-to-png', icon: '🖼️', popular: true },
    { name: 'PNG to JPG', href: '/png-to-jpg', icon: '📷', popular: true },
    { name: 'HEIC to JPG', href: '/heic-to-jpg', icon: '📱', popular: true },
    { name: 'Image Compressor', href: '/image-compressor', icon: '🗜️', popular: true },
    { name: 'OCR - Image to Text', href: '/ocr-image-to-text', icon: '📄', popular: true }
  ];

  // Ready/built Video Converter Tools
  const videoToolLinks = [
    { name: 'MP4 to MOV', href: '/mp4-to-mov', icon: '🎬', popular: true },
    { name: 'MOV to MP4', href: '/mov-to-mp4', icon: '📺', popular: true },
    { name: 'MKV to MP4', href: '/mkv-to-mp4', icon: '📹', popular: true }
  ];

  // Ready/built Audio Tools
  const audioToolLinks = [
    { name: 'WAV to MP3', href: '/wav-to-mp3-converter', icon: '🎵', popular: true }
  ];

  // Ready/built Font Tools
  const fontToolLinks = [
    { name: 'TTF to WOFF', href: '/ttf-to-woff', icon: '📝', popular: true },
    { name: 'OTF to WOFF2', href: '/otf-to-woff2', icon: '💻', popular: true },
    { name: 'WOFF to TTF', href: '/woff-to-ttf', icon: '🌐', popular: true },
    { name: 'WOFF2 to OTF', href: '/woff2-to-otf', icon: '✍️', popular: true },
    { name: 'TTF to OTF', href: '/ttf-to-otf', icon: '⚡', popular: true },
    { name: 'EOT to WOFF', href: '/eot-to-woff', icon: '🖨️', popular: true }
  ];

  // Ready/built Utility Tools
  const utilityTools = [
    { name: 'AI Image Generator', href: '/ai-image-generator', icon: '✨', popular: true },
    { name: 'AI Background Remover', href: '/ai-background-remover', icon: '🖼️', popular: true },
    { name: 'AI Video Script Writer', href: '/ai-video-script-writer', icon: '🎬', popular: true },
    { name: 'Invoice Generator', href: '/invoice-generator', icon: '📄', popular: true },
    { name: 'Resume Builder', href: '/resume-builder', icon: '📝', popular: true },
    { name: 'QR Code Generator', href: '/qr-code-generator', icon: '🔳', popular: true },
    { name: 'Barcode Generator', href: '/barcode-generator', icon: '📊', popular: true },
    { name: 'Password Generator', href: '/password-generator', icon: '🔐', popular: true },
    { name: 'Hash Generator', href: '/hash-generator', icon: '🔒', popular: true },
    { name: 'URL Shortener', href: '/url-shortener', icon: '🔗', popular: true },
    { name: 'Color Palette Generator', href: '/color-palette-generator', icon: '🎨', popular: true },
    { name: 'Base64 Encoder/Decoder', href: '/base64-encoder-decoder', icon: '🔄', popular: true },
    { name: 'JSON to CSV', href: '/json-to-csv', icon: '🔄', popular: true },
    { name: 'CSV to Excel', href: '/csv-to-excel', icon: '📋', popular: true },
    { name: 'Image Compressor', href: '/image-compressor', icon: '🗜️', popular: true },
    { name: 'OCR - Image to Text', href: '/ocr-image-to-text', icon: '📄', popular: true }
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about', icon: '🏢' },
    { name: 'Privacy Policy', href: '/privacy-policy', icon: '🔒' },
    { name: 'Terms of Service', href: '/terms', icon: '📋' },
    { name: 'Cookie Policy', href: '/cookies', icon: '🍪' },
    { name: 'Contact Support', href: '/contact', icon: '📞' },
    { name: 'Help Center', href: '/help', icon: '❓' }
  ];

  return (
    <footer className="relative bg-slate-900/95 backdrop-blur-2xl text-white border-t border-white/10">
      {/* Glass morphism background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10"></div>
      <div className="absolute inset-0 bg-noise opacity-5"></div>

      {/* Newsletter Section */}
      <div className="relative bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3">Stay Updated with FlipFileX</h2>
            <p className="text-blue-100/90 mb-6 max-w-xl mx-auto text-sm">
              Get notified about new conversion tools and features.
            </p>
            <form onSubmit={handleSubscribe} className="max-w-sm mx-auto flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 px-3 py-2 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/90 backdrop-blur-sm text-sm"
                required
              />
              <button
                type="submit"
                className="bg-white/90 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 text-sm backdrop-blur-sm"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="mt-3 text-green-200 font-medium text-sm">Thank you for subscribing!</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">

          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg p-1">
                <Image
                  src="/logo.webp"
                  alt="FlipFileX Logo"
                  width={32}
                  height={32}
                  className="rounded object-contain"
                  loading="lazy"
                  priority={false}
                />
              </div>
              <div>
                <span className="text-lg font-bold">FlipFileX</span>
                <div className="text-xs text-slate-400">Professional Tools</div>
              </div>
            </div>
            <p className="text-slate-300/90 mb-4 leading-relaxed text-sm">
              Professional file conversion platform trusted by users worldwide. Convert files with enterprise-grade security and perfect quality.
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/20">
                <div className="text-sm font-bold text-blue-300">2.8M+</div>
                <div className="text-xs text-slate-400">Files Converted</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/20">
                <div className="text-sm font-bold text-green-300">99.9%</div>
                <div className="text-xs text-slate-400">Uptime</div>
              </div>
            </div>

            {/* Developer Credit */}
            <div className="text-xs text-slate-400">
              Developed with ❤️ by <span className="text-blue-300 font-medium">Rafey</span>
            </div>
          </div>

          {/* PDF Tools */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center text-white/90">
              📄 PDF Tools
            </h3>
            <ul className="space-y-2">
              {pdfToolLinks.slice(0, 6).map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className="text-slate-300/80 hover:text-white transition-colors flex items-center group text-xs"
                  >
                    <span className="text-sm mr-2 group-hover:scale-110 transition-transform">{tool.icon}</span>
                    <span className="flex-1">{tool.name}</span>
                    {tool.popular && (
                      <span className="text-[10px] bg-blue-500/80 px-1.5 py-0.5 rounded-full ml-2">HOT</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Converters */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center text-white/90">
              🖼️ Image Tools
            </h3>
            <ul className="space-y-2">
              {imageToolLinks.slice(0, 6).map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className="text-slate-300/80 hover:text-white transition-colors flex items-center group text-xs"
                  >
                    <span className="text-sm mr-2 group-hover:scale-110 transition-transform">{tool.icon}</span>
                    <span className="flex-1">{tool.name}</span>
                    {tool.popular && (
                      <span className="text-[10px] bg-green-500/80 px-1.5 py-0.5 rounded-full ml-2">TOP</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/tools#image-converters"
              className="text-blue-300 hover:text-blue-200 text-xs font-medium mt-2 inline-flex items-center"
            >
              View all tools →
            </Link>
          </div>

          {/* Video & Audio Tools */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center text-white/90">
              🎬 Video & Audio
            </h3>
            <ul className="space-y-2">
              {/* Video Tools */}
              {videoToolLinks.slice(0, 3).map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className="text-slate-300/80 hover:text-white transition-colors flex items-center group text-xs"
                  >
                    <span className="text-sm mr-2 group-hover:scale-110 transition-transform">{tool.icon}</span>
                    <span className="flex-1">{tool.name}</span>
                    {tool.popular && (
                      <span className="text-[10px] bg-red-500/80 px-1.5 py-0.5 rounded-full ml-2">NEW</span>
                    )}
                  </Link>
                </li>
              ))}

              {/* Audio Tools */}
              {audioToolLinks.slice(0, 2).map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className="text-slate-300/80 hover:text-white transition-colors flex items-center group text-xs"
                  >
                    <span className="text-sm mr-2 group-hover:scale-110 transition-transform">{tool.icon}</span>
                    <span className="flex-1">{tool.name}</span>
                    {tool.popular && (
                      <span className="text-[10px] bg-purple-500/80 px-1.5 py-0.5 rounded-full ml-2">BEST</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/tools"
              className="text-blue-300 hover:text-blue-200 text-xs font-medium mt-2 inline-flex items-center"
            >
              View all tools →
            </Link>
          </div>

          {/* Font Tools */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center text-white/90">
              🔤 Font Tools
            </h3>
            <ul className="space-y-2">
              {fontToolLinks.slice(0, 6).map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className="text-slate-300/80 hover:text-white transition-colors flex items-center group text-xs"
                  >
                    <span className="text-sm mr-2 group-hover:scale-110 transition-transform">{tool.icon}</span>
                    <span className="flex-1">{tool.name}</span>
                    {tool.popular && (
                      <span className="text-[10px] bg-orange-500/80 px-1.5 py-0.5 rounded-full ml-2">FONT</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/tools#font-tools"
              className="text-blue-300 hover:text-blue-200 text-xs font-medium mt-2 inline-flex items-center"
            >
              View all font tools →
            </Link>
          </div>

          {/* Utility Tools */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center text-white/90">
              🛠️ Utility Tools
            </h3>
            <ul className="space-y-2">
              {utilityTools.slice(0, 6).map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className="text-slate-300/80 hover:text-white transition-colors flex items-center group text-xs"
                  >
                    <span className="text-sm mr-2 group-hover:scale-110 transition-transform">{tool.icon}</span>
                    <span className="flex-1">{tool.name}</span>
                    {tool.popular && (
                      <span className="text-[10px] bg-indigo-500/80 px-1.5 py-0.5 rounded-full ml-2">UTIL</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/tools#utility-tools"
              className="text-blue-300 hover:text-blue-200 text-xs font-medium mt-2 inline-flex items-center"
            >
              View all tools →
            </Link>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center text-white/90">
              🏢 Company
            </h3>
            <ul className="space-y-2">
              {companyLinks.slice(0, 6).map((company) => (
                <li key={company.name}>
                  <Link
                    href={company.href}
                    className="text-slate-300/80 hover:text-white transition-colors flex items-center group text-xs"
                  >
                    <span className="text-sm mr-2 group-hover:scale-110 transition-transform">{company.icon}</span>
                    {company.name}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

        </div>

        {/* Popular Tools Quick Access */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-center text-white/90">🔥 Most Popular Tools</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'PDF to Word', href: '/convert-pdf-to-word-online', icon: '📝' },
              { name: 'Word to PDF', href: '/word-to-pdf-online', icon: '📄' },
              { name: 'PNG to WebP', href: '/png-to-webp', icon: '🌐' },
              { name: 'AVIF to PNG', href: '/avif-to-png', icon: '🎨' },
              { name: 'MP4 to MOV', href: '/mp4-to-mov', icon: '🎬' },
              { name: 'WAV to MP3', href: '/wav-to-mp3-converter', icon: '🎵' }
            ].map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center transition-all duration-300 hover:scale-105 group border border-white/20 hover:border-blue-400/50"
              >
                <div className="text-lg mb-1 group-hover:scale-110 transition-transform">{tool.icon}</div>
                <div className="text-xs font-medium text-slate-300 group-hover:text-white">{tool.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Security & Trust Badges */}
      <div className="relative border-t border-white/10">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>Enterprise Grade</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 text-center lg:text-right">
              <div className="font-semibold">Files processed: 3.2M+ this month</div>
              <div className="text-[10px] mt-1">Average processing time: 15 seconds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400 text-center lg:text-left">
              <div>© {currentYear} FlipFileX. All rights reserved.</div>
              <div className="text-[10px] mt-1">Professional file conversion platform trusted by users worldwide.</div>
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <div className="flex items-center space-x-2">
                <label htmlFor="language-selector" className="text-sm">🌍</label>
                <select
                  id="language-selector"
                  onChange={handleLanguageChange}
                  value={selectedLanguage}
                  aria-label="Select Language"
                  className="bg-white/10 text-slate-300 hover:text-white focus:outline-none border border-white/20 rounded px-2 py-1 text-xs cursor-pointer transition-colors backdrop-blur-sm"
                >
                  <option value="en" className="bg-slate-900 text-white">🇺🇸 English</option>
                  <option value="es" className="bg-slate-900 text-white">🇪🇸 Español</option>
                  <option value="fr" className="bg-slate-900 text-white">🇫🇷 Français</option>
                  <option value="de" className="bg-slate-900 text-white">🇩🇪 Deutsch</option>
                  <option value="ur" className="bg-slate-900 text-white">🇵🇰 اردو</option>
                  <option value="zh" className="bg-slate-900 text-white">🇨🇳 中文</option>
                  <option value="ja" className="bg-slate-900 text-white">🇯🇵 日本語</option>
                  <option value="ar" className="bg-slate-900 text-white">🇸🇦 العربية</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Schema.org markup for footer */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FlipFileX",
            "url": "https://flipfilex.com",
            "logo": "https://flipfilex.com/logo.webp",
            "description": "Professional file conversion platform for PDFs, images, videos, and audio files with enterprise-grade security",
            "founder": {
              "@type": "Person",
              "name": "Rafey"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": ["English", "Spanish", "French", "German", "Urdu", "Chinese", "Japanese", "Arabic"],
              "url": "https://flipfilex.com/contact"
            },
            "sameAs": [
              "https://twitter.com/flipfilex",
              "https://linkedin.com/company/flipfilex"
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "2847",
              "bestRating": "5",
              "worstRating": "1"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          })
        }}
      />
    </footer>
  );
}