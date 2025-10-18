'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.flipfilex.com';

// Theme colors
const theme = {
  primary: '#10B981', // Emerald
  secondary: '#8B5CF6', // Violet
  accent: '#F59E0B', // Amber
  pink: '#EC4899',
  blue: '#3B82F6',
  gradient: 'linear-gradient(135deg, #10B981 0%, #8B5CF6 50%, #3B82F6 100%)',
  gradientAlt: 'linear-gradient(135deg, #EC4899 0%, #F59E0B 50%, #10B981 100%)',
  darkBg: 'rgba(17, 24, 39, 0.8)',
  cardBg: 'rgba(31, 41, 55, 0.9)',
  text: '#F1F5F9',
};

interface GenerationResult {
  prompt: string;
  enhanced_prompt: string;
  style: string;
  size: string;
  num_images: number;
  images?: Array<{
    image_data: string;
    index: number;
  }>;
  metadata: {
    original_prompt: string;
    style_used: string;
    dimensions: string;
    guidance?: string;
    model?: string;
  };
  message: string;
  recommendations?: string;
}

export default function AIImageGeneratorClient() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('square_medium');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [numImages, setNumImages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState('');

  const styleOptions = [
    { value: 'realistic', label: 'Realistic', icon: '📸', desc: 'Photorealistic images' },
    { value: 'artistic', label: 'Artistic', icon: '🎨', desc: 'Painterly style' },
    { value: 'digital_art', label: 'Digital Art', icon: '💻', desc: 'Modern digital' },
    { value: 'anime', label: 'Anime', icon: '🎭', desc: 'Manga-inspired' },
    { value: '3d_render', label: '3D Render', icon: '🎬', desc: 'CGI style' },
    { value: 'watercolor', label: 'Watercolor', icon: '🖌️', desc: 'Soft painting' },
    { value: 'sketch', label: 'Sketch', icon: '✏️', desc: 'Hand-drawn' },
    { value: 'fantasy', label: 'Fantasy', icon: '✨', desc: 'Magical art' },
  ];

  const sizeOptions = [
    { value: 'square_small', label: 'Square Small', size: '512×512', icon: '⬜' },
    { value: 'square_medium', label: 'Square Medium', size: '1024×1024', icon: '🟦' },
    { value: 'portrait', label: 'Portrait', size: '768×1024', icon: '📱' },
    { value: 'landscape', label: 'Landscape', size: '1024×768', icon: '🖼️' },
    { value: 'wide', label: 'Wide', size: '1920×1080', icon: '📺' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter an image description');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          size,
          negative_prompt: negativePrompt.trim() || null,
          num_images: numImages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to generate image guidance');
      }

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the image guidance');
    } finally {
      setLoading(false);
    }
  };

  const promptExamples = [
    'A majestic lion with a golden mane standing on a cliff at sunset',
    'Futuristic cyberpunk city with neon lights and flying cars',
    'Peaceful zen garden with cherry blossoms and koi pond',
    'Epic dragon soaring through stormy clouds with lightning',
    'Cozy coffee shop interior with warm lighting and books',
    'Underwater coral reef teeming with colorful tropical fish',
  ];

  return (
    <div className="min-h-screen" style={{ background: theme.darkBg }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-violet-500 to-blue-500">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,white_1px,transparent_1px)] bg-[length:50px_50px]" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              ✨ AI Image Generator
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white opacity-95 max-w-3xl mx-auto drop-shadow-md">
              Transform your imagination into stunning visuals with AI-powered image generation
            </p>

            <div className="flex justify-center gap-4 flex-wrap mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white bg-opacity-90 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-white shadow-2xl"
              >
                <span className="text-gray-900 font-bold text-lg">🎨 8 Styles</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white bg-opacity-90 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-white shadow-2xl"
              >
                <span className="text-gray-900 font-bold text-lg">⚡ Instant Results</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white bg-opacity-90 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-white shadow-2xl"
              >
                <span className="text-gray-900 font-bold text-lg">🆓 100% Free</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl shadow-2xl mb-12"
            style={{ background: theme.cardBg }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: theme.text }}>
              Describe Your Image
            </h2>

            {/* Prompt Input */}
            <div className="mb-6">
              <label className="block mb-3 font-semibold text-lg" style={{ color: theme.text }}>
                Image Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A majestic mountain landscape at sunset with snow-capped peaks, crystal clear lake, and dramatic clouds..."
                rows={4}
                className="w-full p-4 rounded-xl bg-gray-800 text-white border-2 focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: theme.primary, }}
              />
              <p className="mt-2 text-sm" style={{ color: 'rgba(241, 245, 249, 0.6)' }}>
                Be specific and detailed for best results
              </p>
            </div>

            {/* Prompt Examples */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold" style={{ color: theme.text }}>
                Try these examples:
              </p>
              <div className="flex flex-wrap gap-2">
                {promptExamples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(example)}
                    className="px-3 py-1 rounded-full text-sm transition-all hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                      color: 'white',
                    }}
                  >
                    {example.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="mb-6">
              <label className="block mb-3 font-semibold text-lg" style={{ color: theme.text }}>
                Art Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {styleOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStyle(option.value)}
                    className="p-4 rounded-xl transition-all border-2"
                    style={{
                      background: style === option.value
                        ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                        : theme.darkBg,
                      borderColor: style === option.value ? theme.primary : 'rgba(255, 255, 255, 0.1)',
                      color: theme.text,
                    }}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="font-bold text-sm">{option.label}</div>
                    <div className="text-xs opacity-70">{option.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block mb-3 font-semibold text-lg" style={{ color: theme.text }}>
                Image Size
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {sizeOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSize(option.value)}
                    className="p-3 rounded-xl transition-all border-2"
                    style={{
                      background: size === option.value
                        ? `linear-gradient(135deg, ${theme.blue}, ${theme.pink})`
                        : theme.darkBg,
                      borderColor: size === option.value ? theme.blue : 'rgba(255, 255, 255, 0.1)',
                      color: theme.text,
                    }}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="font-bold text-xs">{option.label}</div>
                    <div className="text-xs opacity-70">{option.size}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Negative Prompt */}
            <div className="mb-6">
              <label className="block mb-3 font-semibold text-lg" style={{ color: theme.text }}>
                Negative Prompt (Optional)
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="blurry, low quality, distorted, ugly..."
                className="w-full p-4 rounded-xl bg-gray-800 text-white border-2 focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: theme.secondary }}
              />
              <p className="mt-2 text-sm" style={{ color: 'rgba(241, 245, 249, 0.6)' }}>
                Describe what you DON'T want in the image
              </p>
            </div>

            {/* Number of Images */}
            <div className="mb-8">
              <label className="block mb-3 font-semibold text-lg" style={{ color: theme.text }}>
                Number of Variations: {numImages}
              </label>
              <input
                type="range"
                min="1"
                max="4"
                value={numImages}
                onChange={(e) => setNumImages(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-500 bg-opacity-20 border-2 border-red-500 rounded-xl text-red-300"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full py-6 rounded-xl font-bold text-xl shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading ? theme.darkBg : theme.gradient,
                color: 'white',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Guidance...
                </span>
              ) : (
                '✨ Generate Image'
              )}
            </motion.button>
          </motion.div>

          {/* Results Section */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl shadow-2xl mb-12"
              style={{ background: theme.cardBg }}
            >
              <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: theme.accent }}>
                {result.images ? '🎨 Your AI Generated Images!' : '🎨 Generation Guidance Ready!'}
              </h2>

              {/* Important Notice */}
              <div className="mb-6 p-4 rounded-xl" style={{ background: `linear-gradient(135deg, ${theme.blue}, ${theme.pink})` }}>
                <p className="text-white font-semibold">
                  {result.images ? '✅' : '📝'} {result.message}
                </p>
              </div>

              {/* Generated Images Display */}
              {result.images && result.images.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: theme.primary }}>
                    Generated Images:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.images.map((img) => (
                      <motion.div
                        key={img.index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: img.index * 0.1 }}
                        className="relative group"
                      >
                        <div className="rounded-xl overflow-hidden shadow-2xl border-2" style={{ borderColor: theme.primary }}>
                          <img
                            src={img.image_data}
                            alt={`Generated image ${img.index}`}
                            className="w-full h-auto"
                          />
                        </div>
                        <div className="mt-3 flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = img.image_data;
                              link.download = `ai-generated-image-${img.index}.png`;
                              link.click();
                            }}
                            className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg"
                            style={{ background: theme.primary, color: 'white' }}
                          >
                            💾 Download
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              window.open(img.image_data, '_blank');
                            }}
                            className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg"
                            style={{ background: theme.secondary, color: 'white' }}
                          >
                            🔍 View Full
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Prompt */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3" style={{ color: theme.primary }}>
                  Enhanced Prompt Used:
                </h3>
                <div className="p-4 bg-gray-800 rounded-xl border-2" style={{ borderColor: theme.primary }}>
                  <p className="text-white font-mono text-sm">{result.enhanced_prompt}</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl" style={{ background: theme.darkBg }}>
                  <div className="text-sm opacity-70" style={{ color: theme.text }}>Style</div>
                  <div className="font-bold text-lg" style={{ color: theme.primary }}>{result.style}</div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: theme.darkBg }}>
                  <div className="text-sm opacity-70" style={{ color: theme.text }}>Size</div>
                  <div className="font-bold text-lg" style={{ color: theme.secondary }}>{result.size}</div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: theme.darkBg }}>
                  <div className="text-sm opacity-70" style={{ color: theme.text }}>Variations</div>
                  <div className="font-bold text-lg" style={{ color: theme.accent }}>{result.num_images}</div>
                </div>
              </div>

              {/* AI Recommendations - Only show if no images generated */}
              {result.recommendations && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3" style={{ color: theme.secondary }}>
                    Professional AI Guidance:
                  </h3>
                  <div
                    className="prose prose-invert max-w-none p-4 bg-gray-800 rounded-xl overflow-auto"
                    style={{ color: theme.text }}
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-6 mt-8 text-emerald-400 border-b-2 border-emerald-500 pb-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-4 mt-6 text-violet-400" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-3 mt-4 text-blue-400" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                        strong: ({ node, ...props }) => <strong className="text-emerald-300 font-bold" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-gray-900 px-2 py-1 rounded text-amber-300" {...props} />,
                        hr: ({ node, ...props }) => <hr className="border-gray-700 my-6" {...props} />,
                      }}
                    >
                      {result.recommendations}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(result.enhanced_prompt);
                    alert('Enhanced prompt copied to clipboard!');
                  }}
                  className="px-6 py-3 rounded-xl font-bold shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, color: 'white' }}
                >
                  📋 Copy Enhanced Prompt
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setResult(null);
                    setPrompt('');
                  }}
                  className="px-6 py-3 rounded-xl font-bold shadow-xl"
                  style={{ background: theme.darkBg, color: theme.text, border: `2px solid ${theme.primary}` }}
                >
                  🔄 Generate New
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Articles & Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: theme.text }}>
            How AI Image Generation Transforms Creative Work
          </h2>
          <p className="text-center text-lg mb-12" style={{ color: 'rgba(241, 245, 249, 0.7)' }}>
            Unlock professional-quality visuals without design skills
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: '💼',
                title: 'Problem: Expensive Stock Photos',
                solution: 'Generate unique, custom images tailored to your exact needs. No more generic stock photos or expensive photoshoots. Create original visuals that perfectly match your brand and message.',
                benefits: ['Unlimited unique images', 'Save $100-$500 per image', 'Perfect brand alignment'],
              },
              {
                icon: '⚡',
                title: 'Problem: Slow Design Process',
                solution: 'Create professional visuals in seconds instead of hours. No need for complex design software or extensive training. Simply describe what you want and get instant results.',
                benefits: ['Generate in 10-20 seconds', 'No design skills needed', '10x faster workflow'],
              },
              {
                icon: '🎯',
                title: 'Problem: Limited Creative Options',
                solution: 'Experiment with unlimited variations and styles. Try realistic photos, digital art, anime, 3D renders, and more. Perfect for A/B testing and finding the ideal visual.',
                benefits: ['8 different art styles', 'Unlimited variations', 'Easy experimentation'],
              },
              {
                icon: '🚀',
                title: 'Problem: Scaling Content Production',
                solution: 'Create consistent, high-quality images at scale for social media, blogs, marketing, and more. Generate hundreds of images with the same quality and style as easily as one.',
                benefits: ['Unlimited generation', 'Consistent quality', 'Perfect for campaigns'],
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
                  <p className="font-semibold" style={{ color: theme.primary }}>✨ Key Benefits:</p>
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

          {/* Pro Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
          >
            <h3 className="text-3xl font-bold mb-6 text-white">
              💡 Pro Tips: Writing Perfect Image Prompts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div>
                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">📝</span> Be Descriptive & Specific
                </h4>
                <p className="text-white text-opacity-90">
                  Include subject, action, setting, lighting, mood, colors, and camera angle. "A golden retriever playing in a park" becomes "A happy golden retriever catching a frisbee mid-air in a sunny park, with bokeh background, golden hour lighting"
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎨</span> Choose the Right Style
                </h4>
                <p className="text-white text-opacity-90">
                  Realistic for photos/products, Digital Art for social media, Anime for characters, 3D Render for tech/modern, Watercolor for soft/dreamy, Sketch for illustrations, Fantasy for magical scenes.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">🚫</span> Use Negative Prompts
                </h4>
                <p className="text-white text-opacity-90">
                  List what you don't want: "blurry, low quality, distorted, ugly, cropped, out of frame, duplicate, watermark, text, bad anatomy". This significantly improves output quality.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔍</span> Add Technical Details
                </h4>
                <p className="text-white text-opacity-90">
                  For realistic images: "8K, high resolution, professional photography, sharp focus, detailed". For art: "trending on artstation, masterpiece, vibrant colors, beautiful composition".
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.text }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'What is an AI Image Generator?',
                a: 'An AI Image Generator creates images from text descriptions using artificial intelligence. Simply describe what you want to see, and the AI generates a professional image based on your input.',
              },
              {
                q: 'What styles are available?',
                a: 'We support 8 different styles: Realistic (photorealistic), Artistic (painterly), Digital Art (modern), Anime (manga-inspired), 3D Render (CGI), Watercolor (soft painting), Sketch (hand-drawn), and Fantasy (magical/ethereal).',
              },
              {
                q: 'What sizes can I generate?',
                a: 'Available sizes include: Square Small (512x512), Square Medium (1024x1024), Portrait (768x1024), Landscape (1024x768), and Wide (1920x1080).',
              },
              {
                q: 'Is this free to use?',
                a: 'Yes! Our AI Image Generator provides professional image generation guidance completely free with no signup required.',
              },
              {
                q: 'How do I get the best results?',
                a: 'Be specific and detailed in your prompts. Include subject, setting, lighting, mood, and style. Use negative prompts to exclude unwanted elements. Start with "A detailed [subject] [action] in [setting] with [lighting/mood]".',
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

      {/* CTA Section */}
      <div className="py-20 relative overflow-hidden bg-gradient-to-br from-emerald-500 via-violet-500 to-blue-500">
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
            Ready to Create Stunning AI Images?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl mb-8 text-white opacity-95 drop-shadow-md"
          >
            Join thousands of creators, designers, and marketers using AI to bring their ideas to life
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-12 py-5 bg-white rounded-full font-bold text-xl shadow-2xl text-emerald-600 hover:bg-opacity-90 transition-all"
          >
            ✨ Start Creating Now
          </motion.button>
        </div>
      </div>
    </div>
  );
}
