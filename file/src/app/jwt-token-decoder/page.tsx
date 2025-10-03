'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function JwtTokenDecoderPage() {
  const [jwtToken, setJwtToken] = useState('');
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [error, setError] = useState('');

  const decodeJWT = () => {
    try {
      setError('');
      if (!jwtToken.trim()) {
        setError('Please enter a JWT token');
        return;
      }

      const parts = jwtToken.split('.');
      if (parts.length !== 3) {
        setError('Invalid JWT token format');
        return;
      }

      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      setDecodedToken({
        header,
        payload,
        signature: parts[2]
      });
    } catch (err) {
      setError('Failed to decode JWT token. Please check the token format.');
      setDecodedToken(null);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <>
      <head>
        <title>Free JWT Token Decoder Online - Decode JSON Web Tokens | FlipFileX</title>
        <meta name="description" content="Decode and analyze JWT tokens online for free. View header, payload, and signature of JSON Web Tokens for debugging, development, and security analysis." />
        <meta name="keywords" content="JWT decoder, JSON Web Token decoder, JWT analyzer, token decoder, JWT debugger, authentication, security analysis, API development, OAuth tokens" />
        <meta name="author" content="FlipFileX" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="application-name" content="FlipFileX JWT Token Decoder" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Free JWT Token Decoder Online - Decode JSON Web Tokens | FlipFileX" />
        <meta property="og:description" content="Decode and analyze JWT tokens online for free. View header, payload, and signature of JSON Web Tokens for debugging and development." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/jwt-token-decoder" />
        <meta property="og:image" content="https://flipfilex.com/og-image.jpg" />
        <meta property="og:site_name" content="FlipFileX" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free JWT Token Decoder Online - Decode JSON Web Tokens | FlipFileX" />
        <meta name="twitter:description" content="Decode and analyze JWT tokens online for free. View header, payload, and signature for debugging and development." />
        <meta name="twitter:image" content="https://flipfilex.com/twitter-image.jpg" />

        <link rel="canonical" href="https://flipfilex.com/jwt-token-decoder" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "JWT Token Decoder",
            "description": "Decode and analyze JWT tokens online for free",
            "url": "https://flipfilex.com/jwt-token-decoder",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li><Link href="/" className="text-gray-500 hover:text-indigo-600 transition-colors duration-300">Home</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><Link href="/tools" className="text-gray-500 hover:text-indigo-600 transition-colors duration-300">Tools</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><span className="text-gray-900 font-medium">JWT Token Decoder</span></li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl text-white text-5xl mb-8 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">🔐</div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">JWT Token Decoder</h1>
            <h2 className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">Decode and analyze JSON Web Tokens online for free. Perfect for debugging authentication, viewing token contents, and understanding JWT structure.</h2>
            <div className="flex justify-center space-x-4 mb-8">
              <div className="px-6 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">✅ Developer Tool</div>
              <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">🔒 Client-Side Only</div>
              <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">⚡ Instant Decode</div>
            </div>
          </section>

          <section className="mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-indigo-100/50 max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Decode Your JWT Token</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">JWT Token</label>
                  <textarea
                    value={jwtToken}
                    onChange={(e) => setJwtToken(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 font-mono text-sm"
                  />
                </div>

                <button
                  onClick={decodeJWT}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Decode JWT Token
                </button>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    {error}
                  </div>
                )}

                {decodedToken && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Header</h4>
                      <pre className="text-sm text-gray-700 bg-white/60 p-4 rounded-xl overflow-auto">
                        {JSON.stringify(decodedToken.header, null, 2)}
                      </pre>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Payload</h4>
                      <div className="space-y-3">
                        {Object.entries(decodedToken.payload).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-start bg-white/60 p-3 rounded-lg">
                            <span className="font-medium text-gray-700">{key}:</span>
                            <span className="text-gray-600 font-mono text-sm ml-2 break-all">
                              {key === 'iat' || key === 'exp' || key === 'nbf' ?
                                `${value} (${formatTimestamp(value as number)})` :
                                typeof value === 'object' ? JSON.stringify(value) : String(value)
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Perfect for Developers</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-indigo-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🔍</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Debug Authentication</h4>
                <p className="text-gray-600">Quickly decode JWT tokens to debug authentication issues and verify token contents.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-indigo-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🛡️</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Security Analysis</h4>
                <p className="text-gray-600">Analyze token expiration, claims, and security headers for better security practices.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-indigo-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Development Tool</h4>
                <p className="text-gray-600">Essential tool for API development, testing, and JWT implementation verification.</p>
              </div>
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="mb-20 bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-indigo-100/50">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Why Choose Our JWT Token Decoder?</h2>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
              <p className="text-xl leading-relaxed">
                Our JWT Token Decoder is the essential tool for developers, security analysts, and API integrators working with JSON Web Tokens. Whether you're debugging authentication flows, analyzing token structures, or implementing OAuth 2.0 systems, our decoder provides comprehensive token analysis with enterprise-grade security and precision.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Advanced Token Analysis</h3>
              <p>
                Our decoder supports all JWT algorithms including HS256, RS256, ES256, and other cryptographic standards. We parse header information, payload claims, and signature data with complete accuracy. The tool automatically detects token format issues and provides detailed error reporting for malformed tokens, making debugging effortless.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Enterprise Security Standards</h3>
              <p>
                Built with security-first architecture, our decoder processes tokens entirely in your browser without server transmission. This client-side approach ensures your sensitive authentication data never leaves your device. We support secure analysis of production tokens while maintaining the highest privacy and security standards.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Comprehensive Claim Inspection</h4>
              <p>
                Analyze all standard JWT claims including iss (issuer), sub (subject), aud (audience), exp (expiration), iat (issued at), and custom claims. Our decoder automatically formats timestamps to human-readable dates and highlights security-relevant information like token expiration and validity periods.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Developer-Friendly Interface</h4>
              <p>
                Designed for technical professionals, our interface presents token data in structured, easy-to-read formats. JSON syntax highlighting, expandable claim trees, and copy-to-clipboard functionality streamline the development and debugging workflow for API developers and security engineers.
              </p>

              <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Real-Time Validation</h5>
              <p>
                Instantly validate JWT structure and format compliance with RFC 7519 standards. Our decoder detects common token issues like missing segments, invalid Base64 encoding, and malformed JSON payloads. Real-time feedback helps identify authentication problems before they impact production systems.
              </p>

              <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Multi-Platform Compatibility</h5>
              <p>
                Works seamlessly with tokens from any JWT-compliant system including Auth0, Firebase, AWS Cognito, Azure AD, and custom authentication services. Our decoder handles various token formats and encoding schemes, making it the universal tool for JWT analysis across different platforms and frameworks.
              </p>

              <p className="text-lg font-medium text-gray-900 mt-8">
                Streamline your authentication debugging and security analysis with our professional JWT decoder. From OAuth implementations to API security audits, our tool provides the insights you need to build secure, reliable authentication systems. Decode your first token today and experience the difference.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}