'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ShortenedUrl {
  original: string;
  shortened: string;
  clicks: number;
  created: string;
}

export default function URLShortenerClient() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedUrl, setCopiedUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load stored URLs on component mount
  useEffect(() => {
    const storedUrls = localStorage.getItem('shortenedUrls');
    if (storedUrls) {
      try {
        const urls = JSON.parse(storedUrls);
        setShortenedUrls(urls);
      } catch (e) {
        console.error('Error loading stored URLs:', e);
      }
    }
  }, []);

  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleShortenUrl = async () => {
    if (!originalUrl) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      new URL(originalUrl);
    } catch {
      setError('Please enter a valid URL format');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/url/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_url: originalUrl,
          custom_alias: customAlias || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to shorten URL');
      }

      const data = await response.json();

      const newUrl: ShortenedUrl = {
        original: data.original,
        shortened: data.shortened,
        clicks: data.clicks,
        created: data.created
      };

      setShortenedUrls(prev => {
        const updated = [newUrl, ...prev];
        // Also store in localStorage for persistence
        localStorage.setItem('shortenedUrls', JSON.stringify(updated));
        return updated;
      });

      // Set success message
      setSuccessMessage('✅ URL shortened successfully!');

      // Auto-scroll to results section
      setTimeout(() => {
        const resultsSection = document.getElementById('shortened-results');
        if (resultsSection) {
          resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

      setOriginalUrl('');
      setCustomAlias('');
      setIsLoading(false);
    } catch (err: any) {
      setError(`❌ ${err.message || 'Failed to shorten URL. Please try again.'}`);
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setSuccessMessage('✅ URL copied to clipboard!');
      setTimeout(() => setCopiedUrl(''), 2000);
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('❌ Failed to copy URL. Please try again.');
      setTimeout(() => setError(''), 2000);
    }
  };

  const faqs = [
    {
      question: "How does URL shortening work?",
      answer: "URL shortening takes a long URL and creates a shorter alias that redirects to the original URL. When someone clicks the short link, they're automatically redirected to the full URL."
    },
    {
      question: "Are shortened URLs permanent?",
      answer: "Yes, our shortened URLs are permanent and will continue to work indefinitely. We maintain our servers to ensure reliable redirects."
    },
    {
      question: "Can I customize my short URL?",
      answer: "Yes! You can create custom aliases for your URLs to make them more memorable and branded. Custom aliases are subject to availability."
    },
    {
      question: "Do you track clicks on shortened URLs?",
      answer: "Yes, we provide basic click analytics for all shortened URLs. You can see how many times your link has been clicked."
    },
    {
      question: "Is there a limit to how many URLs I can shorten?",
      answer: "No, there's no limit! You can shorten as many URLs as you need, completely free."
    },
    {
      question: "Can I use shortened URLs for commercial purposes?",
      answer: "Absolutely! Our URL shortener is perfect for marketing campaigns, social media, email newsletters, and any commercial use."
    }
  ];

  const reviews = [
    {
      name: "Sarah Wilson",
      role: "Digital Marketing Manager",
      rating: 5,
      comment: "Perfect for our social media campaigns. The custom aliases feature is exactly what we needed for brand consistency.",
      avatar: "👩‍💼"
    },
    {
      name: "Mike Chen",
      role: "Content Creator",
      rating: 5,
      comment: "Clean interface and reliable service. I've shortened hundreds of URLs and never had any issues with redirects.",
      avatar: "👨‍💻"
    },
    {
      name: "Emily Rodriguez",
      role: "Email Marketing Specialist",
      rating: 5,
      comment: "The click tracking feature helps us monitor our email campaign performance. Simple yet powerful tool!",
      avatar: "👩‍📊"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 via-transparent to-teal-100/50"></div>
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl text-white text-3xl mb-8 shadow-2xl animate-bounce">
                🔗
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-800 bg-clip-text text-transparent mb-8 leading-tight">
                Free URL Shortener
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
                Transform long URLs into short, memorable links. Perfect for social media, email campaigns, and marketing with custom aliases and click tracking.
              </p>
            </div>

            {/* URL Shortener Tool */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-12">
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Enter your long URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        placeholder="https://example.com/very-long-url-that-needs-shortening"
                        className="w-full px-4 py-4 text-lg border border-emerald-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white/70 backdrop-blur-sm"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500">
                        🌐
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Custom alias (optional)
                    </label>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600 font-mono">flipfilex.com/</span>
                      <input
                        type="text"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                        placeholder="my-custom-link"
                        className="flex-1 px-4 py-4 text-lg border border-emerald-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white/70 backdrop-blur-sm"
                        maxLength={20}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 animate-pulse">
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 animate-bounce">
                      <p className="text-emerald-700 font-medium">{successMessage}</p>
                    </div>
                  )}

                  <button
                    onClick={handleShortenUrl}
                    disabled={isLoading || !originalUrl}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
                        <span>Shortening URL...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <span>🔗</span>
                        <span>Shorten URL</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Results */}
              {shortenedUrls.length > 0 && (
                <div id="shortened-results" className="mt-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="mr-3">✨</span>
                    Your Shortened URLs
                  </h3>
                  <div className="space-y-4">
                    {shortenedUrls.map((url, index) => (
                      <div key={index} className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200/30">
                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                          <div className="flex-1">
                            <div className="font-mono text-lg text-emerald-700 font-bold mb-2 break-all">
                              {url.shortened}
                            </div>
                            <div className="text-sm text-gray-600 break-all">
                              Original: {url.original}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              Created: {url.created} • Clicks: {url.clicks}
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(url.shortened)}
                            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center space-x-2"
                          >
                            <span>{copiedUrl === url.shortened ? '✓' : '📋'}</span>
                            <span>{copiedUrl === url.shortened ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Our URL Shortener?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional features for personal and business use
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Generate short URLs instantly with our optimized infrastructure.'
              },
              {
                icon: '🎯',
                title: 'Custom Aliases',
                description: 'Create memorable, branded short links with custom aliases.'
              },
              {
                icon: '📊',
                title: 'Click Tracking',
                description: 'Monitor performance with detailed click analytics.'
              },
              {
                icon: '🔒',
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security with 99.9% uptime guarantee.'
              },
              {
                icon: '📱',
                title: 'Mobile Optimized',
                description: 'Perfect experience on all devices and platforms.'
              },
              {
                icon: '🆓',
                title: 'Completely Free',
                description: 'No registration required. Unlimited URL shortening.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-200/30 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h2>
              <p className="text-xl text-gray-600">Simple steps to shorten your URLs</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Enter Your URL',
                  description: 'Paste your long URL into the input field above.'
                },
                {
                  step: '2',
                  title: 'Customize (Optional)',
                  description: 'Add a custom alias to make your link more memorable.'
                },
                {
                  step: '3',
                  title: 'Share & Track',
                  description: 'Copy your short URL and start sharing with built-in analytics.'
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 text-white text-2xl font-bold rounded-full mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Users Say</h2>
            <p className="text-xl text-gray-600">Trusted by thousands of users worldwide</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-200/30">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{review.comment}"</p>
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{review.avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900">{review.name}</div>
                    <div className="text-gray-600 text-sm">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-20 mx-auto max-w-5xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about URL shortening</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-200/30">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-4 text-emerald-600">❓</span>
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed pl-12">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-16 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Shorten Your URLs?</h2>
            <p className="text-xl mb-8 text-emerald-100">Join thousands of users who trust our URL shortener</p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link href="#top" className="inline-block bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors">
                Start Shortening Now
              </Link>
              <Link href="/tools" className="inline-block border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-emerald-600 transition-colors">
                Explore More Tools
              </Link>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Related Tools</h2>
            <p className="text-xl text-gray-600">Explore our other utility tools</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'QR Code Generator', href: '/qr-code-generator', icon: '🔳', color: 'from-blue-500 to-purple-600' },
              { name: 'Password Generator', href: '/password-generator', icon: '🔐', color: 'from-red-500 to-pink-600' },
              { name: 'Hash Generator', href: '/hash-generator', icon: '🔑', color: 'from-purple-500 to-indigo-600' },
              { name: 'Barcode Generator', href: '/barcode-generator', icon: '📊', color: 'from-orange-500 to-red-600' }
            ].map((tool, index) => (
              <Link key={index} href={tool.href} className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-200/30 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${tool.color} rounded-2xl text-white text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700">{tool.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* SEO Content Section */}
      <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Our URL Shortener?
          </h2>

          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <p className="text-lg mb-6">
              Enhance your digital marketing and streamline link management with our professional URL shortening
              service. Perfect for social media campaigns, email marketing, print materials, and any situation
              where you need clean, trackable, and memorable links that drive better engagement and provide
              valuable analytics insights.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Advanced Link Management and Analytics
            </h3>

            <p className="mb-4">
              Track your link performance with comprehensive analytics that provide insights into click patterns,
              geographic distribution, and engagement metrics. Our dashboard displays real-time statistics,
              helping you understand which campaigns perform best and optimize your marketing strategies accordingly.
              Custom aliases and branded domains enhance your professional image while maintaining full tracking capabilities.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Professional Features for Marketing Excellence
            </h3>

            <p className="mb-4">
              Create custom short URLs that align with your brand identity and marketing objectives. Bulk URL
              shortening capabilities streamline large campaigns, while the link expiration feature provides
              security for time-sensitive promotions. QR code generation for each shortened URL bridges offline
              and online marketing, perfect for print advertisements, business cards, and event materials.
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Enterprise-Grade Reliability and Security
            </h4>

            <p className="mb-4">
              Built on robust infrastructure that ensures 99.9% uptime for your shortened links. Advanced security
              measures protect against malicious redirects and spam, while SSL encryption secures all link
              transmissions. The reliable service supports high-traffic campaigns without performance degradation,
              making it suitable for enterprise-level marketing initiatives.
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Seamless Integration and Workflow Optimization
            </h4>

            <p className="mb-4">
              Integrate shortened URLs seamlessly into your existing marketing workflow. API access enables
              automation and bulk operations, while export functionality allows you to analyze data in your
              preferred analytics tools. The user-friendly interface requires no technical expertise while
              providing professional-grade features that scale with your business needs.
            </p>

            <h5 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              Global Performance and Accessibility
            </h5>

            <p className="mb-4">
              Our global CDN infrastructure ensures fast redirect times worldwide, improving user experience
              regardless of geographic location. Mobile-optimized links work perfectly across all devices and
              platforms, while the responsive management interface allows you to monitor and manage your links
              from anywhere. International domain support accommodates global marketing campaigns.
            </p>

            <h5 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              Privacy-Focused Design and Compliance
            </h5>

            <p className="mb-6">
              Maintain user privacy with GDPR-compliant analytics that respect visitor preferences while providing
              valuable insights. No personal data collection ensures compliance with privacy regulations, while
              optional password protection adds security for sensitive links. Transparent policies and ethical
              practices build trust with your audience and protect your brand reputation.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Start Shortening URLs Today
              </h3>
              <p className="text-blue-800">
                Transform your link management strategy with professional URL shortening that combines simplicity
                with powerful analytics. Create your first shortened URL now and discover the difference professional
                link management makes for your campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "URL Shortener",
            "description": "Create short, custom URLs for free. Track clicks, manage links, and improve your marketing campaigns.",
            "url": "https://flipfilex.com/url-shortener",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "URL shortening",
              "Custom aliases",
              "Click tracking",
              "Link analytics",
              "QR code generation",
              "Bulk processing"
            ]
          })
        }}
      />
    </>
  );
}
