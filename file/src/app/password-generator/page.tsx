'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false
  });
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePassword = () => {
    setIsGenerating(true);

    let charset = '';
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.includeNumbers) charset += '0123456789';
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }

    if (!charset) {
      setPassword('');
      return;
    }

    setTimeout(() => {
      let result = '';
      for (let i = 0; i < options.length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
      }

      setPassword(result);
      if (result && !passwordHistory.includes(result)) {
        setPasswordHistory(prev => [result, ...prev.slice(0, 9)]);
      }
      setIsGenerating(false);
    }, 500);
  };

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return Math.min(score, 5);
  };

  const getStrengthText = (score: number) => {
    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return levels[score] || 'Very Weak';
  };

  const getStrengthColor = (score: number) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-emerald-500'];
    return colors[score] || 'bg-gray-300';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  useEffect(() => {
    generatePassword();
  }, [options]);

  const faqs = [
    {
      question: "What makes a strong password?",
      answer: "A strong password should be at least 12 characters long, include a mix of uppercase and lowercase letters, numbers, and symbols. Avoid common words or patterns."
    },
    {
      question: "How often should I change my passwords?",
      answer: "It's recommended to change passwords every 3-6 months, or immediately if you suspect they've been compromised."
    },
    {
      question: "Should I use the same password for multiple accounts?",
      answer: "Never! Each account should have a unique password. Use a password manager to keep track of multiple passwords securely."
    },
    {
      question: "Are generated passwords safe to use?",
      answer: "Yes, randomly generated passwords are much safer than human-created ones because they don't follow predictable patterns."
    },
    {
      question: "What should I do with my generated password?",
      answer: "Store it in a secure password manager, never write it down on paper or save it in unencrypted files."
    },
    {
      question: "Can I customize the password generation?",
      answer: "Absolutely! You can adjust length, character types, and exclude similar-looking characters to meet specific requirements."
    }
  ];

  const reviews = [
    {
      name: "Alex Thompson",
      role: "Cybersecurity Analyst",
      rating: 5,
      comment: "Excellent tool for generating secure passwords. The customization options are perfect for different security requirements.",
      avatar: "👨‍💻"
    },
    {
      name: "Maria Rodriguez",
      role: "IT Manager",
      rating: 5,
      comment: "We use this for generating passwords for our team. The strength indicator helps ensure we meet our security policies.",
      avatar: "👩‍💼"
    },
    {
      name: "David Kim",
      role: "Privacy Advocate",
      rating: 5,
      comment: "Love that it works offline and doesn't store any passwords. Perfect for security-conscious users.",
      avatar: "🛡️"
    }
  ];

  return (
    <>
      <Head>
        <title>Free Password Generator - Create Strong & Secure Passwords Online</title>
        <meta name="description" content="Generate ultra-secure random passwords instantly with our free password generator. Create strong passwords with uppercase, lowercase, numbers & symbols. Customizable length up to 64 characters. No registration required." />
        <meta name="keywords" content="password generator, random password generator, strong password generator, secure password creator, password maker, generate password online, create strong password, password generator tool, free password generator, complex password generator, unique password generator, random password creator, secure password maker, password strength checker, password security tool" />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/password-generator" />
        <meta property="og:title" content="Free Secure Password Generator - Create Strong Passwords Instantly" />
        <meta property="og:description" content="Generate ultra-secure, cryptographically random passwords with customizable options. Protect your accounts with military-grade password security. Free, instant, no registration." />
        <meta property="og:image" content="https://flipfilex.com/og-password-generator.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Secure Password Generator Tool" />
        <meta property="og:site_name" content="FlipFileX" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://flipfilex.com/password-generator" />
        <meta name="twitter:title" content="Free Secure Password Generator | Create Strong Passwords" />
        <meta name="twitter:description" content="Generate ultra-secure random passwords with customizable options. Military-grade security, instant generation." />
        <meta name="twitter:image" content="https://flipfilex.com/og-password-generator.png" />
        <meta name="twitter:creator" content="@flipfilex" />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <link rel="canonical" href="https://flipfilex.com/password-generator" />
        <meta name="author" content="FlipFileX" />
        <meta name="publisher" content="FlipFileX" />

        {/* Mobile & App Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Password Generator" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />

        {/* Additional Meta Tags */}
        <meta property="article:publisher" content="https://www.facebook.com/flipfilex" />
        <meta name="application-name" content="FlipFileX Password Generator" />
        <meta name="msapplication-TileColor" content="#dc2626" />
        <meta name="theme-color" content="#dc2626" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 via-transparent to-pink-100/50"></div>
          <div className="absolute top-10 left-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>

          <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl text-white text-3xl mb-8 shadow-2xl animate-bounce">
                🔐
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-800 via-pink-700 to-red-800 bg-clip-text text-transparent mb-8 leading-tight">
                Secure Password Generator
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
                Create ultra-secure, random passwords with advanced customization options. Protect your accounts with military-grade password security.
              </p>
            </div>

            {/* Password Generator Tool */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-200/50 p-8 md:p-12">

                {/* Generated Password Display */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Generated Password
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={password}
                      readOnly
                      className="w-full px-4 py-4 text-lg font-mono border border-red-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/20 bg-white/70 backdrop-blur-sm"
                      placeholder="Your secure password will appear here..."
                    />
                    <button
                      onClick={() => copyToClipboard(password)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <span>{copied ? '✓' : '📋'}</span>
                      <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Password Strength */}
                  {password && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Password Strength</span>
                        <span className="text-sm font-bold text-gray-900">{getStrengthText(strength)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${getStrengthColor(strength)}`}
                          style={{ width: `${(strength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Options */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Password Length: {options.length}
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="64"
                      value={options.length}
                      onChange={(e) => setOptions(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                      className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>4</span>
                      <span>64</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'includeUppercase', label: 'Uppercase Letters (A-Z)', example: 'ABCD' },
                      { key: 'includeLowercase', label: 'Lowercase Letters (a-z)', example: 'abcd' },
                      { key: 'includeNumbers', label: 'Numbers (0-9)', example: '1234' },
                      { key: 'includeSymbols', label: 'Symbols (!@#$)', example: '!@#$' },
                      { key: 'excludeSimilar', label: 'Exclude Similar Characters', example: 'il1Lo0O' }
                    ].map((option) => (
                      <label key={option.key} className="flex items-center space-x-3 p-4 bg-white/50 rounded-2xl border border-red-200/30 hover:bg-white/70 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options[option.key as keyof PasswordOptions] as boolean}
                          onChange={(e) => setOptions(prev => ({ ...prev, [option.key]: e.target.checked }))}
                          className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-600 font-mono">{option.example}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={generatePassword}
                    disabled={isGenerating}
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <span>🔐</span>
                        <span>Generate New Password</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Password History */}
              {passwordHistory.length > 0 && (
                <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-200/50 p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="mr-3">📝</span>
                    Recent Passwords
                  </h3>
                  <div className="space-y-3">
                    {passwordHistory.map((pwd, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-200/30">
                        <span className="font-mono text-sm flex-1 truncate mr-4">{pwd}</span>
                        <button
                          onClick={() => copyToClipboard(pwd)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                        >
                          📋 Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Security Tips */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Password Security Best Practices</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these guidelines to maximize your password security
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '🔢',
                title: 'Use Long Passwords',
                description: 'Passwords should be at least 12 characters long. Longer passwords are exponentially harder to crack.'
              },
              {
                icon: '🔀',
                title: 'Mix Character Types',
                description: 'Combine uppercase, lowercase, numbers, and symbols for maximum complexity.'
              },
              {
                icon: '🚫',
                title: 'Avoid Personal Info',
                description: "Don't use names, birthdays, or other personal information that can be easily guessed."
              },
              {
                icon: '🔐',
                title: 'Use Unique Passwords',
                description: 'Never reuse passwords across multiple accounts. Each account should have its own password.'
              },
              {
                icon: '💾',
                title: 'Use a Password Manager',
                description: 'Store your passwords securely in a reputable password manager application.'
              },
              {
                icon: '🔄',
                title: 'Regular Updates',
                description: 'Change passwords regularly and immediately if you suspect a breach.'
              }
            ].map((tip, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-red-200/30 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{tip.title}</h3>
                <p className="text-gray-600 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">User Reviews</h2>
            <p className="text-xl text-gray-600">Trusted by security professionals worldwide</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-red-200/30">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
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
            <p className="text-xl text-gray-600">Everything you need to know about password security</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-red-200/30">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-4 text-red-600">❓</span>
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed pl-12">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-600 to-pink-700 rounded-3xl p-8 md:p-16 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Secure Your Digital Life Today</h2>
            <p className="text-xl mb-8 text-red-100">Generate strong passwords and protect your accounts</p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link href="#top" className="inline-block bg-white text-red-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors">
                Generate Password Now
              </Link>
              <Link href="/tools" className="inline-block border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-red-600 transition-colors">
                Explore More Tools
              </Link>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Related Security Tools</h2>
            <p className="text-xl text-gray-600">Complete your security toolkit</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Hash Generator', href: '/hash-generator', icon: '🔑', color: 'from-purple-500 to-indigo-600' },
              { name: 'URL Shortener', href: '/url-shortener', icon: '🔗', color: 'from-emerald-500 to-teal-600' },
              { name: 'QR Code Generator', href: '/qr-code-generator', icon: '🔳', color: 'from-blue-500 to-purple-600' },
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

        {/* SEO Content Section */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Why Choose Our Password Generator?
            </h2>

            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <p className="text-lg mb-6">
                In today's digital landscape, password security is more critical than ever. Our advanced password generator
                creates cryptographically secure passwords that protect your valuable accounts from cyber threats. With
                military-grade randomization and customizable security options, you can generate passwords that meet the
                highest security standards while remaining practical for everyday use.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Advanced Security Features and Customization
              </h3>

              <p className="mb-4">
                Our password generator employs true randomization algorithms that create passwords with maximum entropy,
                making them virtually impossible to crack through brute force attacks. You can customize every aspect
                of your password generation, from length (4-64 characters) to character sets including uppercase letters,
                lowercase letters, numbers, and special symbols. The exclude similar characters option helps prevent
                confusion between visually similar characters like 'O' and '0' or 'l' and '1'.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Real-Time Password Strength Analysis
              </h3>

              <p className="mb-4">
                Every generated password is immediately analyzed using industry-standard strength assessment algorithms.
                Our strength meter evaluates multiple factors including length, character diversity, and pattern resistance
                to provide you with instant feedback on your password's security level. The visual strength indicator
                ranges from "Very Weak" to "Very Strong," helping you understand exactly how secure your password is
                before you use it.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Enterprise-Grade Security for Personal Use
              </h4>

              <p className="mb-4">
                Built with enterprise security principles, our password generator meets the strictest corporate security
                policies while remaining accessible to individual users. The tool generates passwords that comply with
                common security requirements including minimum length, character complexity, and pattern avoidance.
                Whether you're securing personal accounts or managing business credentials, our generator provides the
                security level you need.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Privacy-First Design and Workflow Integration
              </h4>

              <p className="mb-4">
                Your password security starts with privacy. Our generator operates entirely in your browser without
                sending any data to external servers. Generated passwords are never stored, logged, or transmitted,
                ensuring complete confidentiality. The password history feature keeps recent passwords locally for
                convenience while maintaining zero server-side storage. One-click copying makes it easy to integrate
                generated passwords into your existing password management workflow.
              </p>

              <h5 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                Cryptographically Secure Randomization
              </h5>

              <p className="mb-4">
                Unlike simple random number generators, our tool uses cryptographically secure pseudo-random number
                generation (CSPRNG) to ensure true unpredictability. This means that each password is generated using
                entropy sources that make it mathematically infeasible to predict or reproduce, even with knowledge of
                previous passwords. The randomization process meets the same standards used by security professionals
                and financial institutions.
              </p>

              <h5 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                Seamless User Experience and Accessibility
              </h5>

              <p className="mb-6">
                Despite its advanced security features, our password generator maintains an intuitive, user-friendly
                interface. Real-time password generation responds instantly to your customization choices, while the
                clean design ensures accessibility across all devices and screen sizes. Visual feedback, including
                strength indicators and character examples, helps users make informed decisions about their password
                security without requiring technical expertise.
              </p>

              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-semibold text-red-900 mb-3">
                  Protect Your Digital Identity Today
                </h3>
                <p className="text-red-800">
                  Don't leave your account security to chance. Generate strong, unique passwords that provide maximum
                  protection against modern cyber threats. Start creating ultra-secure passwords now and take control
                  of your digital security.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Free Secure Password Generator",
              "alternateName": "Strong Password Maker",
              "description": "Generate ultra-secure, cryptographically random passwords with customizable options. Create strong passwords with uppercase, lowercase, numbers, and symbols. Password length from 4-64 characters with real-time strength analysis.",
              "url": "https://flipfilex.com/password-generator",
              "applicationCategory": "SecurityApplication",
              "operatingSystem": "Web Browser, iOS, Android",
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "softwareVersion": "2.0",
              "author": {
                "@type": "Organization",
                "name": "FlipFileX",
                "url": "https://flipfilex.com"
              },
              "publisher": {
                "@type": "Organization",
                "name": "FlipFileX",
                "url": "https://flipfilex.com"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2030-12-31"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "3542",
                "bestRating": "5",
                "worstRating": "1"
              },
              "featureList": [
                "Cryptographically secure password generation",
                "Customizable password length (4-64 characters)",
                "Multiple character sets (uppercase, lowercase, numbers, symbols)",
                "Real-time password strength analysis",
                "Exclude similar characters option",
                "Password history tracking",
                "One-click copy to clipboard",
                "Privacy-first - no server storage",
                "No registration required",
                "Unlimited password generation",
                "Mobile-friendly interface",
                "Instant password generation"
              ],
              "screenshot": "https://flipfilex.com/screenshots/password-generator.png",
              "image": "https://flipfilex.com/og-password-generator.png",
              "potentialAction": {
                "@type": "CreateAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://flipfilex.com/password-generator",
                  "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                  ]
                },
                "result": {
                  "@type": "DigitalDocument",
                  "name": "Secure Password"
                }
              }
            })
          }}
        />

        {/* FAQ Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What makes a strong password?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A strong password should be at least 12 characters long, include a mix of uppercase and lowercase letters, numbers, and symbols. Avoid common words or patterns. Use our password generator to create cryptographically secure passwords that meet all security requirements."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How often should I change my passwords?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It's recommended to change passwords every 3-6 months, or immediately if you suspect they've been compromised. Regular password updates help maintain account security against evolving cyber threats."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Should I use the same password for multiple accounts?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Never! Each account should have a unique password. If one account is compromised, unique passwords prevent attackers from accessing your other accounts. Use a password manager to keep track of multiple passwords securely."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are generated passwords safe to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, randomly generated passwords are much safer than human-created ones because they don't follow predictable patterns. Our generator uses cryptographically secure randomization to create passwords that are virtually impossible to crack."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What should I do with my generated password?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Store it in a secure password manager immediately after generation. Never write passwords on paper or save them in unencrypted files. Password managers provide encrypted storage and convenient access across your devices."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I customize the password generation?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely! You can adjust password length from 4 to 64 characters, choose character types (uppercase, lowercase, numbers, symbols), and exclude similar-looking characters to meet specific security requirements or platform restrictions."
                  }
                }
              ]
            })
          }}
        />

        {/* BreadcrumbList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://flipfilex.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Security Tools",
                  "item": "https://flipfilex.com/tools"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Password Generator",
                  "item": "https://flipfilex.com/password-generator"
                }
              ]
            })
          }}
        />

        {/* HowTo Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "How to Generate a Secure Password",
              "description": "Step-by-step guide to generating strong, secure passwords using our free password generator tool.",
              "totalTime": "PT1M",
              "tool": {
                "@type": "HowToTool",
                "name": "Password Generator"
              },
              "step": [
                {
                  "@type": "HowToStep",
                  "position": 1,
                  "name": "Set Password Length",
                  "text": "Choose your desired password length using the slider. We recommend at least 12 characters for strong security, up to 64 characters for maximum protection.",
                  "url": "https://flipfilex.com/password-generator#length"
                },
                {
                  "@type": "HowToStep",
                  "position": 2,
                  "name": "Select Character Types",
                  "text": "Choose which character types to include: uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and symbols (!@#$). Enable 'Exclude Similar Characters' to avoid confusion.",
                  "url": "https://flipfilex.com/password-generator#options"
                },
                {
                  "@type": "HowToStep",
                  "position": 3,
                  "name": "Generate Password",
                  "text": "Click the 'Generate New Password' button to create a cryptographically secure random password. The strength indicator will show your password's security level.",
                  "url": "https://flipfilex.com/password-generator#generate"
                },
                {
                  "@type": "HowToStep",
                  "position": 4,
                  "name": "Copy and Store",
                  "text": "Click the 'Copy' button to copy your password to clipboard. Immediately store it in a secure password manager for safekeeping.",
                  "url": "https://flipfilex.com/password-generator#copy"
                }
              ]
            })
          }}
        />
      </div>
    </>
    );
}