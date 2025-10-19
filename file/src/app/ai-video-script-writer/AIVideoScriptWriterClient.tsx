'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Theme colors - Unique vibrant gradient palette
const theme = {
  primary: '#6366F1', // Indigo
  secondary: '#14B8A6', // Teal
  accent: '#F59E0B', // Amber
  purple: '#A855F7', // Purple
  pink: '#EC4899', // Pink
  gradient: 'linear-gradient(135deg, #6366F1 0%, #14B8A6 50%, #A855F7 100%)',
  gradientAlt: 'linear-gradient(135deg, #EC4899 0%, #F59E0B 50%, #14B8A6 100%)',
  darkBg: '#0F172A',
  cardBg: '#1E293B',
  lightBg: '#F8FAFC',
  text: '#F1F5F9',
  textDark: '#0F172A',
};

interface ScriptResult {
  script: string;
  metadata: {
    topic: string;
    duration: number;
    original_duration: number;
    tone: string;
    platform: string;
    word_count: number;
    estimated_speaking_time: string;
    thumbnail_ideas: string;
    seo_keywords: string;
  };
}

const toneOptions = [
  { value: 'professional', label: 'Professional', icon: '💼', description: 'Formal & authoritative' },
  { value: 'casual', label: 'Casual', icon: '😊', description: 'Friendly & relatable' },
  { value: 'humorous', label: 'Humorous', icon: '😄', description: 'Fun & entertaining' },
  { value: 'educational', label: 'Educational', icon: '📚', description: 'Teaching & informative' },
  { value: 'motivational', label: 'Motivational', icon: '💪', description: 'Inspiring & energetic' },
  { value: 'storytelling', label: 'Storytelling', icon: '📖', description: 'Narrative & emotional' },
];

const platformOptions = [
  { value: 'youtube', label: 'YouTube', icon: '📺', color: '#FF0000', optimalDuration: '8-15 min' },
  { value: 'instagram', label: 'Instagram', icon: '📷', color: '#E4405F', optimalDuration: '30-90 sec' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', color: '#000000', optimalDuration: '15-60 sec' },
  { value: 'facebook', label: 'Facebook', icon: '👥', color: '#1877F2', optimalDuration: '1-3 min' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', color: '#0A66C2', optimalDuration: '2-5 min' },
];

export default function AIVideoScriptWriterClient() {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(5);
  const [tone, setTone] = useState('professional');
  const [platform, setPlatform] = useState('youtube');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'script' | 'thumbnail' | 'seo'>('script');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a video topic');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.flipfilex.com';
      const response = await fetch(`${API_BASE_URL}/ai/generate-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          duration,
          tone,
          platform,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to generate script');
      }

      setResult(data.data);
      setActiveTab('script');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadScript = () => {
    if (!result) return;

    const content = `${result.script}\n\n--- THUMBNAIL IDEAS ---\n${result.metadata.thumbnail_ideas}\n\n--- SEO KEYWORDS ---\n${result.metadata.seo_keywords}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.metadata.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_script.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen" style={{ background: theme.darkBg }}>
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-teal-500 to-purple-500">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,white_1px,transparent_1px),radial-gradient(circle_at_80%_80%,white_1px,transparent_1px)] bg-[length:50px_50px]" />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white">
              AI Video Script Writer
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white text-opacity-90 px-4">
              Generate Professional, Engaging Video Scripts in Seconds
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white bg-opacity-90 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-white shadow-2xl"
              >
                <span className="text-gray-900 font-bold text-lg">✨ AI-Powered</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white bg-opacity-90 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-white shadow-2xl"
              >
                <span className="text-gray-900 font-bold text-lg">🎯 Platform-Optimized</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white bg-opacity-90 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-white shadow-2xl"
              >
                <span className="text-gray-900 font-bold text-lg">🚀 Instant Results</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-8 mb-8 shadow-2xl"
            style={{ background: theme.cardBg }}
          >
            <h2 className="text-3xl font-bold mb-6" style={{ color: theme.text }}>
              Create Your Script
            </h2>

            {/* Topic Input */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3" style={{ color: theme.text }}>
                Video Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to Start a Successful YouTube Channel in 2025"
                className="w-full px-6 py-4 rounded-xl border-2 border-transparent focus:border-purple-500 outline-none transition-all text-lg"
                style={{ background: theme.darkBg, color: theme.text }}
              />
            </div>

            {/* Duration Slider */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3" style={{ color: theme.text }}>
                Video Duration: <span style={{ color: theme.accent }}>{duration} minutes</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.secondary} ${(duration / 30) * 100}%, ${theme.darkBg} ${(duration / 30) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-sm mt-2" style={{ color: theme.text }}>
                <span>1 min</span>
                <span>15 min</span>
                <span>30 min</span>
              </div>
            </div>

            {/* Tone Selection */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3" style={{ color: theme.text }}>
                Script Tone
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {toneOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTone(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      tone === option.value ? 'shadow-2xl' : 'border-transparent'
                    }`}
                    style={{
                      background: tone === option.value ? `linear-gradient(135deg, ${theme.primary}, ${theme.purple})` : theme.darkBg,
                      color: theme.text,
                      borderColor: tone === option.value ? theme.purple : 'transparent',
                    }}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="font-bold">{option.label}</div>
                    <div className="text-sm opacity-75">{option.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3" style={{ color: theme.text }}>
                Target Platform
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                {platformOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPlatform(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      platform === option.value ? 'shadow-2xl' : 'border-transparent'
                    }`}
                    style={{
                      background: platform === option.value ? `linear-gradient(135deg, ${theme.secondary}, ${theme.accent})` : theme.darkBg,
                      color: theme.text,
                      borderColor: platform === option.value ? theme.accent : 'transparent',
                    }}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="font-bold">{option.label}</div>
                    <div className="text-xs opacity-75">{option.optimalDuration}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500 bg-opacity-20 border-2 border-red-500">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-5 rounded-xl font-bold text-xl text-white shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: theme.gradient }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Your Script...
                </span>
              ) : (
                '✨ Generate Video Script'
              )}
            </motion.button>
          </motion.div>

          {/* Results Section */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-8 shadow-2xl"
              style={{ background: theme.cardBg }}
            >
              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-xl text-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.purple})` }}
                >
                  <div className="text-2xl font-bold text-white">{result.metadata.word_count}</div>
                  <div className="text-sm text-white opacity-90">Words</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-xl text-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.accent})` }}
                >
                  <div className="text-2xl font-bold text-white">{result.metadata.estimated_speaking_time}</div>
                  <div className="text-sm text-white opacity-90">Duration</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-xl text-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${theme.pink}, ${theme.purple})` }}
                >
                  <div className="text-2xl font-bold text-white capitalize">{result.metadata.tone}</div>
                  <div className="text-sm text-white opacity-90">Tone</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-xl text-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.pink})` }}
                >
                  <div className="text-2xl font-bold text-white capitalize">{result.metadata.platform}</div>
                  <div className="text-sm text-white opacity-90">Platform</div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => copyToClipboard(result.script)}
                  className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.purple})` }}
                >
                  📋 Copy Script
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(20, 184, 166, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadScript}
                  className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.accent})` }}
                >
                  💾 Download All
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-gray-700">
                {(['script', 'thumbnail', 'seo'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-semibold transition-all ${
                      activeTab === tab ? 'border-b-4' : 'opacity-50'
                    }`}
                    style={{
                      color: theme.text,
                      borderColor: activeTab === tab ? theme.secondary : 'transparent',
                    }}
                  >
                    {tab === 'script' && '📝 Script'}
                    {tab === 'thumbnail' && '🎨 Thumbnails'}
                    {tab === 'seo' && '🔍 SEO Keywords'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 rounded-xl overflow-auto" style={{ background: theme.darkBg }}>
                {activeTab === 'script' && (
                  <div className="prose prose-invert prose-sm md:prose-base max-w-none" style={{ color: theme.text }}>
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-6 mt-8 text-teal-400 border-b-2 border-teal-500 pb-2" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-4 mt-6 text-indigo-400" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-semibold mb-3 mt-4 text-purple-400" {...props} />,
                        strong: ({node, ...props}) => <strong className="text-amber-400 font-bold" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                        li: ({node, ...props}) => <li className="mb-2" {...props} />,
                        hr: ({node, ...props}) => <hr className="border-gray-700 my-6" {...props} />,
                        table: ({node, ...props}) => <div className="overflow-x-auto my-6"><table className="min-w-full border-collapse border border-gray-600" {...props} /></div>,
                        thead: ({node, ...props}) => <thead className="bg-indigo-900 bg-opacity-50" {...props} />,
                        tbody: ({node, ...props}) => <tbody {...props} />,
                        tr: ({node, ...props}) => <tr className="border-b border-gray-700 hover:bg-gray-800 transition-colors" {...props} />,
                        th: ({node, ...props}) => <th className="border border-gray-600 px-4 py-3 text-left font-bold text-teal-300" {...props} />,
                        td: ({node, ...props}) => <td className="border border-gray-600 px-4 py-3" {...props} />,
                      }}
                    >
                      {result.script}
                    </ReactMarkdown>
                  </div>
                )}
                {activeTab === 'thumbnail' && (
                  <div className="prose prose-invert prose-sm md:prose-base max-w-none" style={{ color: theme.text }}>
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                        strong: ({node, ...props}) => <strong className="text-amber-400 font-bold" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                        li: ({node, ...props}) => <li className="mb-2" {...props} />,
                      }}
                    >
                      {result.metadata.thumbnail_ideas}
                    </ReactMarkdown>
                  </div>
                )}
                {activeTab === 'seo' && (
                  <div className="prose prose-invert prose-sm md:prose-base max-w-none" style={{ color: theme.text }}>
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                        strong: ({node, ...props}) => <strong className="text-amber-400 font-bold" {...props} />,
                      }}
                    >
                      {result.metadata.seo_keywords}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.text }}>
            Why Use Our AI Video Script Writer?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Generate professional scripts in seconds, not hours. Save time and focus on creating great content.',
              },
              {
                icon: '🎯',
                title: 'Platform Optimized',
                description: 'Scripts tailored for YouTube, TikTok, Instagram, LinkedIn, and Facebook with best practices built-in.',
              },
              {
                icon: '🎨',
                title: 'Complete Package',
                description: 'Get script, visual cues, music cues, thumbnail ideas, and SEO keywords all in one place.',
              },
              {
                icon: '💡',
                title: 'Multiple Tones',
                description: 'Choose from 6 different tones to match your brand voice and content style perfectly.',
              },
              {
                icon: '📊',
                title: 'SEO Optimized',
                description: 'Includes keyword suggestions and optimization tips to help your video rank better.',
              },
              {
                icon: '🎬',
                title: 'Production Ready',
                description: 'Timestamps, visual cues, and music notes make video production seamless and efficient.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl shadow-xl"
                style={{ background: theme.cardBg }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: theme.text }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'rgba(241, 245, 249, 0.7)' }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16" style={{ background: theme.cardBg }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.text }}>
              How It Works
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Enter Your Topic',
                  description: 'Describe what your video is about. Be specific for best results.',
                },
                {
                  step: '2',
                  title: 'Choose Duration & Tone',
                  description: 'Select how long your video should be and what tone fits your content.',
                },
                {
                  step: '3',
                  title: 'Select Platform',
                  description: 'Pick where you\'ll publish - YouTube, TikTok, Instagram, LinkedIn, or Facebook.',
                },
                {
                  step: '4',
                  title: 'Generate & Download',
                  description: 'Get your complete script with thumbnails, SEO keywords, and production cues instantly.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                    style={{ background: theme.gradient, color: 'white' }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'rgba(241, 245, 249, 0.7)' }}>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.text }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'What is an AI Video Script Writer?',
                a: 'An AI Video Script Writer is an intelligent tool that automatically generates professional, engaging video scripts based on your topic, desired duration, tone, and target platform. It creates complete scripts with hooks, introductions, main content, CTAs, and outros.',
              },
              {
                q: 'Which platforms are supported?',
                a: 'Our AI script writer supports YouTube, TikTok, Instagram, Facebook, and LinkedIn. Each platform has optimized script formatting and length recommendations based on best practices.',
              },
              {
                q: 'What tone options are available?',
                a: 'You can choose from Professional, Casual, Humorous, Educational, Motivational, and Storytelling tones. Each tone adapts the language, style, and delivery approach to match your content goals.',
              },
              {
                q: 'Is the AI Video Script Writer free?',
                a: 'Yes! Our AI Video Script Writer is completely free to use with no signup required. Generate unlimited scripts for your content creation needs.',
              },
              {
                q: 'What does the generated script include?',
                a: 'Each script includes: an attention-grabbing hook, introduction, structured main content with 3-5 key points, visual and music cues, call-to-action, outro, thumbnail suggestions, and SEO keywords. Scripts are formatted with timestamps for easy video production.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl shadow-xl"
                style={{ background: theme.cardBg }}
              >
                <h3 className="text-xl font-bold mb-3" style={{ color: theme.text }}>
                  {faq.q}
                </h3>
                <p style={{ color: 'rgba(241, 245, 249, 0.7)' }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Articles & Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: theme.text }}>
            How AI Video Script Writing Solves Your Content Creation Challenges
          </h2>
          <p className="text-center text-lg mb-12" style={{ color: 'rgba(241, 245, 249, 0.7)' }}>
            Discover how our AI-powered tool transforms your content workflow
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: '⏱️',
                title: 'Problem: Time-Consuming Script Writing',
                solution: 'Our AI generates complete, professional scripts in 10-20 seconds. What used to take hours now takes moments, letting you focus on filming and editing instead of staring at a blank page.',
                benefits: ['Save 2-3 hours per video', 'Eliminate writer\'s block', 'Consistent quality output'],
              },
              {
                icon: '🎯',
                title: 'Problem: Platform-Specific Requirements',
                solution: 'Each social media platform has unique requirements. Our AI automatically optimizes scripts for YouTube long-form, TikTok short-form, Instagram Reels, LinkedIn professional tone, and Facebook engagement patterns.',
                benefits: ['Platform-optimized length', 'Tone matching', 'Better engagement rates'],
              },
              {
                icon: '📈',
                title: 'Problem: SEO & Discoverability',
                solution: 'Every script includes SEO-optimized keywords, tags, and thumbnail suggestions. Our AI analyzes trending topics and search patterns to help your videos get discovered by the right audience.',
                benefits: ['Higher search rankings', 'More organic traffic', 'Targeted keyword research'],
              },
              {
                icon: '🎬',
                title: 'Problem: Production Planning',
                solution: 'Scripts include detailed production notes: visual cues, music timing, B-roll suggestions, and timestamps. This makes shooting and editing seamless, even for beginners.',
                benefits: ['Professional production quality', 'Reduced editing time', 'Clear shot list'],
              },
            ].map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl shadow-2xl border-2"
                style={{ background: theme.cardBg, borderColor: theme.primary }}
              >
                <div className="text-6xl mb-4">{article.icon}</div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: theme.accent }}>
                  {article.title}
                </h3>
                <p className="mb-6 text-lg leading-relaxed" style={{ color: theme.text }}>
                  <strong style={{ color: theme.secondary }}>Solution: </strong>
                  {article.solution}
                </p>
                <div className="space-y-2">
                  <p className="font-semibold" style={{ color: theme.purple }}>✨ Key Benefits:</p>
                  <ul className="space-y-2">
                    {article.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span style={{ color: theme.secondary }}>✓</span>
                        <span style={{ color: 'rgba(241, 245, 249, 0.8)' }}>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Tips Article */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.purple})` }}
          >
            <h3 className="text-3xl font-bold mb-6 text-white">
              💡 Pro Tips: Getting the Most From AI Video Scripts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div>
                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎤</span> Be Specific With Topics
                </h4>
                <p className="text-white text-opacity-90">
                  Instead of "fitness tips," try "10-minute morning workout routine for beginners over 40." Specific topics generate more targeted, valuable scripts.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎨</span> Match Tone to Audience
                </h4>
                <p className="text-white text-opacity-90">
                  Use Professional for B2B content, Casual for lifestyle vlogs, Educational for tutorials, and Storytelling for emotional narratives.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">⏰</span> Adjust Duration by Platform
                </h4>
                <p className="text-white text-opacity-90">
                  TikTok: 15-60 seconds, Instagram Reels: 30-90 seconds, YouTube: 8-15 minutes, LinkedIn: 2-5 minutes. Our AI optimizes for each.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">✏️</span> Customize & Personalize
                </h4>
                <p className="text-white text-opacity-90">
                  Use the AI script as a foundation, then add your unique voice, personal stories, and brand-specific call-to-actions for authenticity.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 relative overflow-hidden bg-gradient-to-br from-pink-500 via-amber-500 to-teal-500">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white_2px,transparent_2px),radial-gradient(circle_at_70%_80%,white_2px,transparent_2px)] bg-[length:60px_60px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg"
          >
            Ready to Create Amazing Video Scripts?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl mb-8 text-white opacity-95 drop-shadow-md"
          >
            Join thousands of content creators using AI to streamline their workflow
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-12 py-5 bg-white rounded-full font-bold text-xl shadow-2xl text-indigo-600 hover:bg-opacity-90 transition-all"
          >
            ✨ Start Creating Now
          </motion.button>
        </div>
      </div>
    </div>
  );
}
