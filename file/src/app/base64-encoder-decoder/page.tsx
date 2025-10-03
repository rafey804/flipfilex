'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface ConversionResult {
  id: string;
  operation: 'encode' | 'decode';
  input: string;
  output: string;
  timestamp: string;
  inputType: 'text' | 'file';
  fileName?: string;
}

export default function Base64EncoderDecoderPage() {
  const [activeMode, setActiveMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [copiedText, setCopiedText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEncode = () => {
    if (!inputText.trim()) {
      setError('Please enter text to encode');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccessMessage('');

    setTimeout(() => {
      try {
        const encoded = btoa(unescape(encodeURIComponent(inputText)));
        setOutputText(encoded);

        const result: ConversionResult = {
          id: Date.now().toString(),
          operation: 'encode',
          input: inputText.length > 100 ? inputText.substring(0, 100) + '...' : inputText,
          output: encoded.length > 100 ? encoded.substring(0, 100) + '...' : encoded,
          timestamp: new Date().toLocaleString(),
          inputType,
          fileName: inputType === 'file' ? fileName : undefined
        };

        setResults(prev => [result, ...prev.slice(0, 9)]);
        setSuccessMessage('✅ Text encoded to Base64 successfully!');

        // Auto-scroll to results
        setTimeout(() => {
          const resultsSection = document.getElementById('base64-results');
          if (resultsSection) {
            resultsSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);

        setIsProcessing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('❌ Failed to encode text. Please check your input.');
        setIsProcessing(false);
        setTimeout(() => setError(''), 3000);
      }
    }, 800);
  };

  const handleDecode = () => {
    if (!inputText.trim()) {
      setError('Please enter Base64 text to decode');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccessMessage('');

    setTimeout(() => {
      try {
        const decoded = decodeURIComponent(escape(atob(inputText.trim())));
        setOutputText(decoded);

        const result: ConversionResult = {
          id: Date.now().toString(),
          operation: 'decode',
          input: inputText.length > 100 ? inputText.substring(0, 100) + '...' : inputText,
          output: decoded.length > 100 ? decoded.substring(0, 100) + '...' : decoded,
          timestamp: new Date().toLocaleString(),
          inputType: 'text'
        };

        setResults(prev => [result, ...prev.slice(0, 9)]);
        setSuccessMessage('✅ Base64 decoded to text successfully!');

        // Auto-scroll to results
        setTimeout(() => {
          const resultsSection = document.getElementById('base64-results');
          if (resultsSection) {
            resultsSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);

        setIsProcessing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('❌ Failed to decode Base64. Please check if the input is valid Base64.');
        setIsProcessing(false);
        setTimeout(() => setError(''), 3000);
      }
    }, 800);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Remove data URL prefix for base64 content
        const base64Content = result.split(',')[1] || result;
        setInputText(base64Content);
        setInputType('file');
      }
    };

    reader.readAsDataURL(file);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setFileName('');
    setInputType('text');
    setError('');
    setSuccessMessage('');
  };

  const swapInputOutput = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    setActiveMode(activeMode === 'encode' ? 'decode' : 'encode');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setSuccessMessage('✅ Text copied to clipboard!');
      setTimeout(() => setCopiedText(''), 2000);
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('❌ Failed to copy text. Please try again.');
      setTimeout(() => setError(''), 2000);
    }
  };

  const downloadResult = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    setSuccessMessage('✅ File downloaded successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const faqs = [
    {
      question: "What is Base64 encoding?",
      answer: "Base64 is a binary-to-text encoding scheme that represents binary data in ASCII format. It's commonly used for encoding data in emails, web forms, and APIs."
    },
    {
      question: "When should I use Base64 encoding?",
      answer: "Use Base64 when you need to transmit binary data over text-based protocols, embed images in HTML/CSS, or store binary data in JSON or XML."
    },
    {
      question: "Is Base64 encryption or compression?",
      answer: "No, Base64 is neither encryption nor compression. It's simply an encoding method that makes binary data safe for text-based transmission."
    },
    {
      question: "Can I encode files with this tool?",
      answer: "Yes! You can upload files and they'll be converted to Base64. This is useful for embedding files in code or transmitting them via text protocols."
    },
    {
      question: "Is there a size limit for encoding?",
      answer: "While there's no strict limit, very large files may cause browser performance issues. For best results, keep files under 10MB."
    },
    {
      question: "How secure is Base64?",
      answer: "Base64 is not a security measure - it's easily reversible. Never use it to hide sensitive information. Use proper encryption for security."
    }
  ];

  return (
    <>
      <Head>
        <title>Free Base64 Encoder & Decoder Online - Encode Decode Base64 Text & Files</title>
        <meta name="description" content="Encode and decode Base64 text and files instantly. Free online Base64 encoder/decoder tool. Convert text to Base64, decode Base64 strings. Fast, secure & easy to use." />
        <meta name="keywords" content="base64 encoder, base64 decoder, encode base64, decode base64, base64 converter, base64 tool online, text to base64, base64 to text, file to base64" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/base64-encoder-decoder" />
        <meta property="og:title" content="Free Base64 Encoder & Decoder Online Tool" />
        <meta property="og:description" content="Encode and decode Base64 text and files instantly. Free, fast & secure Base64 converter." />
        <meta property="og:image" content="https://flipfilex.com/og-base64.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Base64 Encoder & Decoder" />
        <meta name="twitter:description" content="Encode and decode Base64 text and files instantly." />
        <meta name="twitter:image" content="https://flipfilex.com/og-base64.png" />

        <link rel="canonical" href="https://flipfilex.com/base64-encoder-decoder" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/50 via-transparent to-teal-100/50"></div>
          <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>

          <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-3xl text-white text-3xl mb-8 shadow-2xl animate-bounce">
                🔄
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-800 via-teal-700 to-cyan-800 bg-clip-text text-transparent mb-8 leading-tight">
                Base64 Encoder & Decoder
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
                Convert text and files to Base64 encoding and decode Base64 back to original format. Perfect for developers and data processing.
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 animate-bounce">
                  <p className="text-emerald-700 font-medium text-center">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Main Tool */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-200/50 p-8 md:p-12">

                {/* Mode Toggle */}
                <div className="flex justify-center mb-8">
                  <div className="bg-gray-100 rounded-2xl p-2 flex">
                    <button
                      onClick={() => setActiveMode('encode')}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        activeMode === 'encode'
                          ? 'bg-cyan-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      🔒 Encode
                    </button>
                    <button
                      onClick={() => setActiveMode('decode')}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        activeMode === 'decode'
                          ? 'bg-teal-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      🔓 Decode
                    </button>
                  </div>
                </div>

                {/* Input Section */}
                <div className="space-y-6">
                  {activeMode === 'encode' && (
                    <div className="flex justify-center mb-4">
                      <div className="bg-gray-100 rounded-xl p-1 flex">
                        <button
                          onClick={() => setInputType('text')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            inputType === 'text'
                              ? 'bg-white text-cyan-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          📝 Text Input
                        </button>
                        <button
                          onClick={() => setInputType('file')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            inputType === 'file'
                              ? 'bg-white text-cyan-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          📁 File Upload
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      {activeMode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                    </label>

                    {inputType === 'file' && activeMode === 'encode' ? (
                      <div className="space-y-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="border-2 border-dashed border-cyan-300 rounded-2xl p-8 text-center hover:border-cyan-400 transition-colors">
                          <div className="text-4xl mb-4">📁</div>
                          <p className="text-gray-600 mb-4">Upload a file to encode to Base64</p>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
                          >
                            Choose File
                          </button>
                        </div>
                        {fileName && (
                          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                            <p className="text-cyan-700 font-medium">📄 {fileName}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={
                          activeMode === 'encode'
                            ? 'Enter text to encode to Base64...'
                            : 'Enter Base64 string to decode...'
                        }
                        rows={6}
                        className="w-full px-4 py-4 text-lg border border-cyan-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all bg-white/70 backdrop-blur-sm resize-none"
                      />
                    )}

                    <div className="text-sm text-gray-600 mt-2 flex justify-between">
                      <span>Characters: {inputText.length}</span>
                      {inputText.length > 0 && (
                        <span>Base64 size: ~{Math.ceil((inputText.length * 4) / 3)} chars</span>
                      )}
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 animate-pulse">
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={activeMode === 'encode' ? handleEncode : handleDecode}
                      disabled={isProcessing || !inputText.trim()}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-3">
                          <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <span>{activeMode === 'encode' ? '🔒' : '🔓'}</span>
                          <span>{activeMode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}</span>
                        </div>
                      )}
                    </button>

                    {inputText && outputText && (
                      <button
                        onClick={swapInputOutput}
                        className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        🔄 Swap
                      </button>
                    )}

                    <button
                      onClick={clearAll}
                      className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      🗑️ Clear
                    </button>
                  </div>

                  {/* Output Section */}
                  {outputText && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl border border-cyan-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {activeMode === 'encode' ? 'Base64 Encoded Result' : 'Decoded Text Result'}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(outputText)}
                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm flex items-center space-x-2"
                          >
                            <span>{copiedText === outputText ? '✓' : '📋'}</span>
                            <span>{copiedText === outputText ? 'Copied!' : 'Copy'}</span>
                          </button>
                          <button
                            onClick={() => downloadResult(outputText, activeMode === 'encode' ? 'encoded.txt' : 'decoded.txt')}
                            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors text-sm flex items-center space-x-2"
                          >
                            <span>💾</span>
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={outputText}
                        readOnly
                        rows={6}
                        className="w-full px-4 py-3 bg-white border border-cyan-200 rounded-xl font-mono text-sm resize-none focus:outline-none"
                      />
                      <div className="text-sm text-gray-600 mt-2">
                        Length: {outputText.length} characters
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Results History */}
              {results.length > 0 && (
                <div id="base64-results" className="mt-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-200/50 p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="mr-3">📝</span>
                    Conversion History
                  </h3>
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div key={result.id} className="bg-cyan-50/50 rounded-2xl p-6 border border-cyan-200/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 text-white text-sm font-bold rounded-full ${
                              result.operation === 'encode' ? 'bg-cyan-500' : 'bg-teal-500'
                            }`}>
                              {result.operation === 'encode' ? '🔒 ENCODE' : '🔓 DECODE'}
                            </span>
                            {result.inputType === 'file' && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                📁 FILE
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{result.timestamp}</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              {result.operation === 'encode' ? 'Original' : 'Base64 Input'}
                              {result.fileName && ` (${result.fileName})`}
                            </h4>
                            <div className="bg-white p-3 rounded-lg font-mono text-sm text-gray-800 border border-gray-200 break-all">
                              {result.input}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              {result.operation === 'encode' ? 'Base64 Output' : 'Decoded Result'}
                            </h4>
                            <div className="bg-white p-3 rounded-lg font-mono text-sm text-gray-800 border border-gray-200 break-all">
                              {result.output}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => copyToClipboard(result.output)}
                            className="px-3 py-2 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-lg text-sm transition-colors"
                          >
                            📋 Copy Result
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
        <section className="py-20 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Powerful Base64 Features</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need for Base64 encoding and decoding
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '⚡',
                  title: 'Lightning Fast',
                  description: 'Instant encoding and decoding with optimized algorithms'
                },
                {
                  icon: '📁',
                  title: 'File Support',
                  description: 'Upload and encode any file type to Base64 format'
                },
                {
                  icon: '🔄',
                  title: 'Bidirectional',
                  description: 'Seamlessly switch between encoding and decoding modes'
                },
                {
                  icon: '📋',
                  title: 'Easy Copy',
                  description: 'One-click copying of results to clipboard'
                },
                {
                  icon: '💾',
                  title: 'Download Results',
                  description: 'Save encoded or decoded content as files'
                },
                {
                  icon: '📊',
                  title: 'Batch History',
                  description: 'Keep track of all your conversions with detailed history'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">
                Common questions about Base64 encoding and decoding
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-cyan-200/50 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <section className="py-20 bg-cyan-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Related Tools</h2>
              <p className="text-xl text-gray-600">Explore more developer tools</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Hash Generator', href: '/hash-generator', icon: '🔒', color: 'from-purple-500 to-indigo-500' },
                { name: 'URL Shortener', href: '/url-shortener', icon: '🔗', color: 'from-emerald-500 to-teal-500' },
                { name: 'QR Code Generator', href: '/qr-code-generator', icon: '🔳', color: 'from-blue-500 to-indigo-500' },
                { name: 'Password Generator', href: '/password-generator', icon: '🔐', color: 'from-red-500 to-pink-500' }
              ].map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className={`group bg-gradient-to-r ${tool.color} rounded-2xl p-6 text-white text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <h3 className="font-bold text-lg">{tool.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Why Choose Our Base64 Encoder/Decoder?
            </h2>

            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <p className="text-lg mb-6">
                Transform your data encoding and decoding workflows with our comprehensive Base64 converter that handles
                both text and file inputs with professional reliability. Whether you're a developer working with APIs,
                a system administrator managing data transfers, or handling email attachments and web applications,
                our tool provides the accuracy and security you need for Base64 operations.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Comprehensive Text and File Processing
              </h3>

              <p className="mb-4">
                Our Base64 converter supports both text encoding/decoding and file processing, making it versatile for
                any data conversion need. Process plain text, HTML, JSON, XML, and other text formats, or upload files
                including images, documents, and binary data for Base64 encoding. The dual-mode interface seamlessly
                switches between text and file processing while maintaining the same high-quality conversion standards.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Developer-Optimized Features and Integration
              </h3>

              <p className="mb-4">
                Built with developers in mind, our tool provides clean output formatting perfect for code integration.
                The immediate processing capability eliminates waiting times, while the history feature tracks multiple
                conversions for batch operations. Error handling provides clear feedback for malformed Base64 input,
                and the copy-to-clipboard functionality streamlines workflow integration with development environments.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Professional Security and Privacy Standards
              </h4>

              <p className="mb-4">
                All Base64 encoding and decoding operations occur entirely within your browser, ensuring complete data
                privacy and security. No files or text are uploaded to external servers, making it safe for processing
                sensitive information, proprietary data, and confidential documents. The client-side processing
                eliminates security concerns while providing instant results regardless of internet connection speed.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Versatile Applications Across Industries
              </h4>

              <p className="mb-4">
                From web development and API integration to email systems and data storage, Base64 encoding serves
                critical functions across numerous applications. Use it for embedding images in HTML/CSS, transmitting
                binary data through text-based protocols, encoding email attachments, creating data URIs, and
                preparing files for JSON APIs. The universal compatibility makes it essential for modern web development.
              </p>

              <h5 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                High-Performance Processing and Accuracy
              </h5>

              <p className="mb-4">
                Experience lightning-fast Base64 conversion with optimized algorithms that handle large files and
                extensive text inputs efficiently. The robust error detection system identifies invalid Base64 strings
                and provides helpful feedback for correction. Memory management ensures stable operation even with
                large file uploads while maintaining conversion accuracy across all supported data types.
              </p>

              <h5 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                User-Friendly Interface and Accessibility
              </h5>

              <p className="mb-6">
                The intuitive interface makes Base64 conversion accessible to users of all technical levels. Visual
                mode switching between encoding and decoding, drag-and-drop file support, and real-time conversion
                feedback create a seamless user experience. Responsive design ensures optimal functionality across
                desktop, tablet, and mobile devices while maintaining full feature availability on all platforms.
              </p>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-semibold text-amber-900 mb-3">
                  Start Converting Your Data Today
                </h3>
                <p className="text-amber-800">
                  Experience the most reliable and secure Base64 conversion available. Whether you're encoding files
                  for web applications or decoding data for analysis, our tool provides the professional results
                  you need with complete privacy protection.
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
              "name": "Base64 Encoder Decoder",
              "description": "Encode and decode text and files to/from Base64 format online. Support for text input and file uploads.",
              "url": "https://flipfilex.com/base64-encoder-decoder",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Base64 encoding",
                "Base64 decoding",
                "File upload support",
                "Text processing",
                "Privacy-first design",
                "Real-time conversion"
              ]
            })
          }}
        />
      </div>
    </>
  );
}