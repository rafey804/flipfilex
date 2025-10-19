'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

interface AudioHistoryItem {
  id: string;
  filename: string;
  text: string;
  mode: string;
  language: string;
  created_at: string;
  file_size: number;
}

interface VoiceSample {
  sample_id: string;
  filename: string;
  file_size: number;
  created_at: string;
}

export default function AIVoiceDubbing() {
  // State management
  const [voiceMode, setVoiceMode] = useState<'default' | 'clone'>('default');
  const [darkMode, setDarkMode] = useState(true);
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [outputFormat, setOutputFormat] = useState('mp3');
  const [quality, setQuality] = useState('high');
  const [noiseReduction, setNoiseReduction] = useState(false);

  // Voice cloning states
  const [speakerAudio, setSpeakerAudio] = useState<File | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('');
  const [voiceSamples, setVoiceSamples] = useState<VoiceSample[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [selectedPresetVoice, setSelectedPresetVoice] = useState<string | null>(null);

  // Processing states
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [audioHistory, setAudioHistory] = useState<AudioHistoryItem[]>([]);

  // Batch processing
  const [batchTexts, setBatchTexts] = useState<string[]>(['']);
  const [showBatchMode, setShowBatchMode] = useState(false);

  // UI states
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [showVoicePrompt, setShowVoicePrompt] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Supported languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ur', name: 'Urdu' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ar', name: 'Arabic' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'tr', name: 'Turkish' },
  ];

  // Preset voice profiles (using pitch and speed variations with gTTS)
  // Note: Negative pitch = Lower/Deeper voice (Male), Positive pitch = Higher voice (Female)
  const presetVoices = [
    { id: 'male-deep', name: '👨 Male (Deep)', description: 'Deep masculine voice', speed: 0.85, pitch: -6, icon: '👨', gradient: 'from-blue-600 to-indigo-600' },
    { id: 'male-normal', name: '🧑 Male (Normal)', description: 'Standard male voice', speed: 0.95, pitch: -3, icon: '🧑', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'female-normal', name: '👩 Female (Normal)', description: 'Standard female voice', speed: 1.0, pitch: 5, icon: '👩', gradient: 'from-pink-500 to-rose-500' },
    { id: 'female-soft', name: '👧 Female (Soft)', description: 'Gentle feminine voice', speed: 0.95, pitch: 7, icon: '👧', gradient: 'from-pink-400 to-purple-400' },
    { id: 'child-boy', name: '👦 Child (Boy)', description: 'Young boy voice', speed: 1.15, pitch: 9, icon: '👦', gradient: 'from-green-500 to-emerald-500' },
    { id: 'child-girl', name: '👧 Child (Girl)', description: 'Young girl voice', speed: 1.2, pitch: 11, icon: '👧', gradient: 'from-yellow-500 to-orange-400' },
    { id: 'elderly-male', name: '👴 Elderly (Male)', description: 'Older male voice', speed: 0.8, pitch: -4, icon: '👴', gradient: 'from-gray-600 to-slate-600' },
    { id: 'elderly-female', name: '👵 Elderly (Female)', description: 'Older female voice', speed: 0.9, pitch: 4, icon: '👵', gradient: 'from-purple-400 to-pink-300' },
    { id: 'robotic', name: '🤖 Robotic', description: 'Robot/AI voice', speed: 1.05, pitch: -10, icon: '🤖', gradient: 'from-gray-500 to-blue-500' },
    { id: 'narrator', name: '🎙️ Narrator', description: 'Professional narrator voice', speed: 0.92, pitch: -2, icon: '🎙️', gradient: 'from-indigo-500 to-purple-500' }
  ];

  // Load voice samples and history on mount
  useEffect(() => {
    loadVoiceSamples();
    loadAudioHistory();
  }, []);

  // Notification auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const loadVoiceSamples = async () => {
    try {
      const response = await fetch('http://localhost:8000/ai/voice-dubbing/voice-samples');
      const data = await response.json();
      if (data.success) {
        setVoiceSamples(data.samples);
      }
    } catch (error) {
      console.error('Error loading voice samples:', error);
    }
  };

  const loadAudioHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/ai/voice-dubbing/history');
      const data = await response.json();
      if (data.success) {
        setAudioHistory(data.history);
      }
    } catch (error) {
      console.error('Error loading audio history:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSpeakerAudio(file);
      const url = URL.createObjectURL(file);
      setAudioPreviewUrl(url);
      showNotification('success', 'Audio file uploaded successfully!');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioPreviewUrl(url);

        // Convert blob to file
        const file = new File([audioBlob], 'recorded_voice.wav', { type: 'audio/wav' });
        setSpeakerAudio(file);

        stream.getTracks().forEach(track => track.stop());
        showNotification('success', 'Recording saved successfully!');
      };

      mediaRecorder.start();
      setIsRecording(true);
      showNotification('success', 'Recording started...');
    } catch (error) {
      showNotification('error', 'Failed to access microphone');
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const selectPresetVoice = (voiceId: string) => {
    const preset = presetVoices.find(v => v.id === voiceId);
    if (preset) {
      setSelectedPresetVoice(voiceId);
      setSpeed(preset.speed);
      setPitch(preset.pitch);
      showNotification('success', `${preset.name} voice selected!`);
    }
  };

  const uploadVoiceSample = async () => {
    if (!speakerAudio) {
      showNotification('error', 'Please select an audio file first');
      return;
    }

    const formData = new FormData();
    formData.append('audio', speakerAudio);
    formData.append('sample_name', speakerAudio.name);

    try {
      const response = await fetch('http://localhost:8000/ai/voice-dubbing/upload-voice-sample', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        showNotification('success', 'Voice sample saved to library!');
        await loadVoiceSamples();
        // Automatically select the newly uploaded sample
        setSelectedSampleId(data.sample_id);
        setSpeakerAudio(null);
        setAudioPreviewUrl(null);
      }
    } catch (error) {
      showNotification('error', 'Failed to save voice sample');
      console.error('Error uploading voice sample:', error);
    }
  };

  const generateVoice = async () => {
    if (!text.trim()) {
      showNotification('error', 'Please enter some text');
      return;
    }

    if (voiceMode === 'clone' && !speakerAudio && !selectedSampleId) {
      // Show slide-in prompt instead of just notification
      setShowVoicePrompt(true);
      setTimeout(() => setShowVoicePrompt(false), 5000);
      showNotification('error', 'Please upload a voice sample or select from library');
      console.log('Voice clone validation failed:', { speakerAudio, selectedSampleId });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('text', text);
    formData.append('language', language);
    formData.append('speed', speed.toString());
    formData.append('pitch', pitch.toString());
    formData.append('volume', volume.toString());
    formData.append('output_format', outputFormat);
    formData.append('apply_noise_reduction', noiseReduction.toString());
    formData.append('quality', quality);

    let endpoint = 'http://localhost:8000/ai/voice-dubbing/generate-gtts';

    if (voiceMode === 'clone') {
      endpoint = 'http://localhost:8000/ai/voice-dubbing/generate-clone';

      if (speakerAudio) {
        console.log('Using uploaded audio file:', speakerAudio.name);
        formData.append('speaker_audio', speakerAudio);
      } else if (selectedSampleId) {
        console.log('Using library sample:', selectedSampleId);
        formData.append('use_sample_id', selectedSampleId);
      }
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        setGeneratedAudio(`http://localhost:8000${data.download_url}`);
        showNotification('success', 'Voice generated successfully!');
        loadAudioHistory();

        // Play audio automatically
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
          }
        }, 500);
      } else {
        showNotification('error', data.detail || 'Generation failed');
      }
    } catch (error) {
      clearInterval(progressInterval);
      showNotification('error', 'Failed to generate voice');
      console.error('Error generating voice:', error);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const generateBatchVoices = async () => {
    const validTexts = batchTexts.filter(t => t.trim());

    if (validTexts.length === 0) {
      showNotification('error', 'Please enter at least one text');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:8000/ai/voice-dubbing/batch-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: validTexts,
          language,
          speed,
          pitch,
          volume,
          output_format: outputFormat,
          apply_noise_reduction: noiseReduction,
          quality,
        }),
      });
      const data = await response.json();

      if (data.success) {
        showNotification('success', `Generated ${data.successful} voices successfully!`);
        loadAudioHistory();
      }
    } catch (error) {
      showNotification('error', 'Batch generation failed');
      console.error('Error in batch generation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addBatchTextInput = () => {
    if (batchTexts.length < 10) {
      setBatchTexts([...batchTexts, '']);
    }
  };

  const updateBatchText = (index: number, value: string) => {
    const updated = [...batchTexts];
    updated[index] = value;
    setBatchTexts(updated);
  };

  const removeBatchText = (index: number) => {
    setBatchTexts(batchTexts.filter((_, i) => i !== index));
  };

  const deleteFromHistory = async (audioId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/ai/voice-dubbing/history/${audioId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        showNotification('success', 'Audio deleted from history');
        loadAudioHistory();
      }
    } catch (error) {
      showNotification('error', 'Failed to delete audio');
      console.error('Error deleting audio:', error);
    }
  };

  return (
    <>
      <Head>
        <title>AI Voice Dubbing & Text to Speech Generator - Free Online TTS | FlipFileX</title>
        <meta name="description" content="Free AI voice generator with voice cloning. Convert text to speech in 20+ languages. Choose from 10 voice types: male, female, child, narrator. Professional voiceovers in seconds. No signup required." />
        <meta name="keywords" content="AI voice generator, text to speech, voice cloning, free TTS, AI dubbing, voice over generator, multilingual TTS, natural voice synthesis, online voice generator, speech synthesis, AI narrator" />
        <link rel="canonical" href="https://flipfilex.com/ai-voice-dubbing" />
        <meta property="og:title" content="AI Voice Dubbing & Text to Speech Generator - Free Online" />
        <meta property="og:description" content="Generate professional voiceovers with AI. 10 voice types, 20+ languages, voice cloning. Free text-to-speech tool for content creators." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/ai-voice-dubbing" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Voice Dubbing & Text to Speech Generator" />
        <meta name="twitter:description" content="Free AI voice generator with voice cloning. 20+ languages, 10 voice types. Professional voiceovers in seconds." />
      </Head>

      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} transition-all duration-500`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              AI Voice & Dubbing Studio
            </span>
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Professional voice generation with AI-powered cloning technology
          </p>

          {/* Dark Mode Toggle */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-800'} shadow-lg hover:scale-110 transition-transform`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </motion.div>

        {/* Voice Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-lg rounded-2xl p-2 shadow-2xl border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'}`}>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setVoiceMode('default')}
                className={`py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  voiceMode === 'default'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105'
                    : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                }`}
              >
                🎤 Default Voice
              </button>
              <button
                onClick={() => setVoiceMode('clone')}
                className={`py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  voiceMode === 'clone'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
                    : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                }`}
              >
                🎭 Voice Cloning
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Panel - Input Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-8 shadow-2xl border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'}`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {showBatchMode ? '📝 Batch Processing' : '✍️ Text Input'}
            </h2>

            {/* Batch Mode Toggle */}
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={() => setShowBatchMode(!showBatchMode)}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} hover:scale-105 transition-transform`}
              >
                {showBatchMode ? '📄 Single Mode' : '📋 Batch Mode'}
              </button>
            </div>

            {!showBatchMode ? (
              <div className="space-y-6">
                {/* Text Input */}
                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Enter Text
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste your text here..."
                    className={`w-full h-40 px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} border-2 ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} focus:border-purple-500 outline-none transition-colors resize-none`}
                    maxLength={5000}
                  />
                  <div className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {text.length} / 5000 characters | ~{text.split(' ').filter(w => w).length} words
                  </div>
                </div>

                {/* Language Selection */}
                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} border-2 ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} focus:border-purple-500 outline-none transition-colors`}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preset Voice Selection (shown in default mode) */}
                <AnimatePresence>
                  {voiceMode === 'default' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className={`block mb-3 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        🎭 Select Voice Type
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                        {presetVoices.map(voice => (
                          <motion.button
                            key={voice.id}
                            onClick={() => selectPresetVoice(voice.id)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-3 rounded-xl text-left transition-all ${
                              selectedPresetVoice === voice.id
                                ? `bg-gradient-to-r ${voice.gradient} text-white shadow-lg border-2 border-white/30`
                                : `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${darkMode ? 'text-white' : 'text-gray-900'}`
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{voice.icon}</span>
                              <span className="font-bold text-sm">{voice.name.replace(/[^\s]+\s/, '')}</span>
                            </div>
                            <p className={`text-xs ${selectedPresetVoice === voice.id ? 'text-white/90' : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                              {voice.description}
                            </p>
                          </motion.button>
                        ))}
                      </div>
                      {selectedPresetVoice && (
                        <div className={`mt-3 p-2 rounded-lg ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'} text-sm text-center`}>
                          ✓ {presetVoices.find(v => v.id === selectedPresetVoice)?.name} selected
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Voice Cloning Upload (only in clone mode) */}
                <AnimatePresence>
                  {voiceMode === 'clone' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Voice Sample
                      </label>

                      {/* Upload Options */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className={`px-4 py-3 rounded-xl ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white font-semibold transition-all hover:scale-105`}
                        >
                          📁 Upload
                        </button>
                        <button
                          onClick={isRecording ? stopRecording : startRecording}
                          className={`px-4 py-3 rounded-xl ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : `${darkMode ? 'bg-pink-600 hover:bg-pink-700' : 'bg-pink-500 hover:bg-pink-600'}`} text-white font-semibold transition-all hover:scale-105`}
                        >
                          {isRecording ? '⏹️ Stop' : '🎙️ Record'}
                        </button>
                        <button
                          onClick={() => setShowSettings(true)}
                          className={`px-4 py-3 rounded-xl ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold transition-all hover:scale-105`}
                        >
                          📚 Library
                        </button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      {/* Audio Preview */}
                      {audioPreviewUrl && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                        >
                          <audio src={audioPreviewUrl} controls className="w-full" />
                          <button
                            onClick={uploadVoiceSample}
                            className={`mt-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white text-sm font-semibold transition-all`}
                          >
                            💾 Save to Library
                          </button>
                        </motion.div>
                      )}

                      {/* Selected Sample */}
                      {selectedSampleId && (
                        <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                          ✅ Using sample from library: {selectedSampleId}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Speed: {speed}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={speed}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Pitch: {pitch > 0 ? '+' : ''}{pitch}
                    </label>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={pitch}
                      onChange={(e) => setPitch(parseInt(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>

                {/* Advanced Settings Button */}
                <button
                  onClick={() => setShowSettings(true)}
                  className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-900'} font-semibold transition-all`}
                >
                  ⚙️ Advanced Settings
                </button>

                {/* Generate Button */}
                <motion.button
                  onClick={generateVoice}
                  disabled={isGenerating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r ${
                    voiceMode === 'default'
                      ? 'from-purple-500 to-blue-500'
                      : 'from-pink-500 to-purple-500'
                  } hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⚙️</span> Generating...
                    </span>
                  ) : (
                    <span>
                      {voiceMode === 'default' ? '🎤 Generate Voice' : '🎭 Clone & Generate'}
                    </span>
                  )}
                </motion.button>

                {/* Progress Bar */}
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      />
                    </div>
                    <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {progress}% Complete
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Batch Mode */
              <div className="space-y-4">
                {batchTexts.map((batchText, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={batchText}
                      onChange={(e) => updateBatchText(index, e.target.value)}
                      placeholder={`Text ${index + 1}...`}
                      className={`flex-1 px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} border-2 ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} focus:border-purple-500 outline-none transition-colors`}
                    />
                    {batchTexts.length > 1 && (
                      <button
                        onClick={() => removeBatchText(index)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all"
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}

                {batchTexts.length < 10 && (
                  <button
                    onClick={addBatchTextInput}
                    className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-900'} font-semibold transition-all`}
                  >
                    ➕ Add Another Text
                  </button>
                )}

                <motion.button
                  onClick={generateBatchVoices}
                  disabled={isGenerating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-2xl transition-all disabled:opacity-50"
                >
                  {isGenerating ? '⚙️ Processing Batch...' : '🚀 Generate All'}
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Right Panel - Output & Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-8 shadow-2xl border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'}`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🎵 Generated Audio
            </h2>

            {generatedAudio ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Audio Visualizer */}
                <div className={`relative p-8 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50' : 'bg-gradient-to-br from-purple-100 to-blue-100'} overflow-hidden`}>
                  {/* Animated Sound Waves */}
                  <div className="flex items-end justify-center gap-1 h-32">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full"
                        animate={{
                          height: ['20%', '100%', '40%', '80%', '30%'],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Audio Player */}
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <audio
                    ref={audioRef}
                    src={generatedAudio}
                    controls
                    className="w-full"
                  />
                </div>

                {/* Download Button */}
                <a
                  href={generatedAudio}
                  download
                  className="block w-full py-4 rounded-xl font-bold text-center text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-2xl transition-all"
                >
                  ⬇️ Download Audio
                </a>
              </motion.div>
            ) : (
              <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="text-6xl mb-4">🎤</div>
                <p className="text-xl">Your generated audio will appear here</p>
              </div>
            )}

            {/* History Button */}
            <button
              onClick={() => setShowHistory(true)}
              className={`w-full mt-6 px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-900'} font-semibold transition-all`}
            >
              📚 View History ({audioHistory.length})
            </button>
          </motion.div>
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl`}
              >
                <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ⚙️ Advanced Settings
                </h2>

                <div className="space-y-6">
                  {/* Volume Control */}
                  <div>
                    <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Volume: {Math.round(volume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  {/* Output Format */}
                  <div>
                    <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Output Format
                    </label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border-2 ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} focus:border-purple-500 outline-none`}
                    >
                      <option value="mp3">MP3</option>
                      <option value="wav">WAV</option>
                      <option value="ogg">OGG</option>
                      <option value="flac">FLAC</option>
                      <option value="m4a">M4A</option>
                    </select>
                  </div>

                  {/* Quality */}
                  <div>
                    <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Audio Quality
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['low', 'medium', 'high', 'ultra'].map(q => (
                        <button
                          key={q}
                          onClick={() => setQuality(q)}
                          className={`py-2 px-4 rounded-xl font-semibold transition-all ${
                            quality === q
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                              : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                          }`}
                        >
                          {q.charAt(0).toUpperCase() + q.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Noise Reduction */}
                  <div className="flex items-center justify-between">
                    <label className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Background Noise Reduction
                    </label>
                    <button
                      onClick={() => setNoiseReduction(!noiseReduction)}
                      className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                        noiseReduction
                          ? 'bg-green-500 text-white'
                          : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                      }`}
                    >
                      {noiseReduction ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Voice Samples Library (if in clone mode) */}
                  {voiceMode === 'clone' && voiceSamples.length > 0 && (
                    <div>
                      <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Voice Sample Library
                      </label>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {voiceSamples.map(sample => (
                          <div
                            key={sample.sample_id}
                            className={`p-3 rounded-xl ${selectedSampleId === sample.sample_id ? (darkMode ? 'bg-purple-900/50 border-2 border-purple-500' : 'bg-purple-100 border-2 border-purple-500') : (darkMode ? 'bg-gray-700' : 'bg-gray-100')} cursor-pointer transition-all hover:scale-102`}
                            onClick={() => {
                              setSelectedSampleId(sample.sample_id);
                              setSpeakerAudio(null);
                              setAudioPreviewUrl(null);
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {sample.sample_id}
                              </span>
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {(sample.file_size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-2xl transition-all"
                >
                  ✓ Save Settings
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Modal */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowHistory(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl`}
              >
                <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  📚 Audio History
                </h2>

                {audioHistory.length === 0 ? (
                  <div className={`text-center py-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p>No audio generated yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {audioHistory.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {item.text}
                            </div>
                            <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {item.mode === 'gtts' ? '🎤 Default Voice' : '🎭 Voice Clone'} • {item.language} • {new Date(item.created_at).toLocaleString()}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteFromHistory(item.id)}
                            className="ml-4 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition-all"
                          >
                            🗑️
                          </button>
                        </div>
                        <a
                          href={`http://localhost:8000/download/${item.filename}`}
                          download
                          className="inline-block px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all"
                        >
                          ⬇️ Download
                        </a>
                      </motion.div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setShowHistory(false)}
                  className="w-full mt-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-2xl transition-all"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -50, x: '-50%' }}
              className={`fixed top-8 left-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl ${
                notification.type === 'success'
                  ? 'bg-green-500'
                  : 'bg-red-500'
              } text-white font-semibold`}
            >
              {notification.type === 'success' ? '✅' : '❌'} {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Upload Prompt - Slide in from right */}
        <AnimatePresence>
          {showVoicePrompt && (
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 max-w-sm ${darkMode ? 'bg-gradient-to-br from-purple-900 to-pink-900' : 'bg-gradient-to-br from-purple-100 to-pink-100'} rounded-3xl shadow-2xl border-4 ${darkMode ? 'border-purple-500/50' : 'border-purple-300'} p-6`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">🎤</div>
                <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Voice Sample Needed!
                </h3>
                <p className={`text-lg mb-4 ${darkMode ? 'text-purple-200' : 'text-purple-900'}`}>
                  Pehle voice sample upload karen:
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowVoicePrompt(false);
                    }}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    📁 Upload Voice File
                  </button>
                  <button
                    onClick={() => {
                      startRecording();
                      setShowVoicePrompt(false);
                    }}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    🎙️ Record Voice
                  </button>
                  <button
                    onClick={() => {
                      setShowSettings(true);
                      setShowVoicePrompt(false);
                    }}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    📚 Choose from Library
                  </button>
                </div>
                <button
                  onClick={() => setShowVoicePrompt(false)}
                  className={`mt-4 text-sm ${darkMode ? 'text-purple-300 hover:text-white' : 'text-purple-700 hover:text-purple-900'} underline`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEO Content Sections */}
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
          {/* Section 1: What is AI Voice Dubbing */}
          <section className={`${darkMode ? 'bg-gray-800/30' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border ${darkMode ? 'border-purple-500/20' : 'border-purple-200'}`}>
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
              <span className="text-4xl">🎙️</span>
              What is AI Voice Dubbing & Text-to-Speech?
            </h2>
            <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg leading-relaxed`}>
              <p>
                <strong>AI Voice Dubbing</strong> is a revolutionary technology that uses artificial intelligence to convert written text into natural-sounding speech. Our advanced platform combines Google's Text-to-Speech (gTTS) technology with sophisticated audio processing to create professional-quality voice overs in multiple languages and voice types.
              </p>
              <p>
                Whether you need a <strong>male voice</strong>, <strong>female voice</strong>, <strong>child voice</strong>, or even a <strong>robotic narrator</strong>, our AI voice generator can produce studio-quality audio in seconds. Unlike traditional voice recording that requires expensive equipment and professional voice actors, our text-to-speech tool makes voice creation accessible to everyone.
              </p>
              <p>
                The platform offers two powerful modes: <strong>Default Voice Mode</strong> with 10 preset voice profiles, and <strong>Voice Cloning Mode</strong> that analyzes and mimics the characteristics of any uploaded voice sample. This makes it perfect for content creators, educators, marketers, and anyone who needs high-quality voiceovers without the hassle of traditional recording.
              </p>
              <p>
                Our AI voice technology supports over 20 languages including English, Urdu, Hindi, Arabic, Spanish, French, German, and many more. With advanced features like pitch control, speed adjustment, noise reduction, and volume optimization, you have complete control over your audio output. The result? Professional voiceovers that sound natural, engaging, and perfectly suited to your needs.
              </p>
            </div>
          </section>

          {/* Section 2: How to Use */}
          <section className={`${darkMode ? 'bg-gray-800/30' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border ${darkMode ? 'border-purple-500/20' : 'border-purple-200'}`}>
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
              <span className="text-4xl">📖</span>
              How to Use AI Voice Dubbing - Step by Step Guide
            </h2>
            <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  Method 1: Default Voice Mode (Quick & Easy)
                </h3>
                <ol className="space-y-4 list-decimal list-inside text-lg">
                  <li>
                    <strong>Select Default Voice Mode:</strong> Click on the "🎤 Default Voice" button at the top of the page. This activates the preset voice profiles feature.
                  </li>
                  <li>
                    <strong>Choose Your Language:</strong> Select from 20+ supported languages in the dropdown menu. Popular options include English, Spanish, French, German, Arabic, Urdu, Hindi, and more.
                  </li>
                  <li>
                    <strong>Pick a Voice Type:</strong> Browse through 10 professionally calibrated voice profiles:
                    <ul className="ml-8 mt-2 space-y-1 list-disc">
                      <li>👨 Male (Deep) - Perfect for professional narration and documentaries</li>
                      <li>🧑 Male (Normal) - Ideal for tutorials and educational content</li>
                      <li>👩 Female (Normal) - Great for marketing and promotional videos</li>
                      <li>👧 Female (Soft) - Best for meditation guides and audiobooks</li>
                      <li>👦 Child (Boy) - Excellent for children's content and animations</li>
                      <li>👧 Child (Girl) - Perfect for storytelling and kids' videos</li>
                      <li>👴 Elderly (Male) - Authentic voice for historical narratives</li>
                      <li>👵 Elderly (Female) - Warm voice for grandparent characters</li>
                      <li>🤖 Robotic - Futuristic voice for tech and sci-fi content</li>
                      <li>🎙️ Narrator - Professional broadcaster-quality voice</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Type Your Text:</strong> Enter up to 5,000 characters in the text box. The platform shows real-time character count and word count to help you stay within limits.
                  </li>
                  <li>
                    <strong>Adjust Settings (Optional):</strong> Fine-tune your voice with speed control (0.5x to 2x), pitch adjustment (-12 to +12 semitones), and volume control (0% to 200%).
                  </li>
                  <li>
                    <strong>Generate Voice:</strong> Click the "🎤 Generate Voice" button. Watch the progress bar as AI creates your audio file in seconds.
                  </li>
                  <li>
                    <strong>Preview & Download:</strong> Listen to your generated audio in the built-in player with waveform visualization. Download in your preferred format (MP3, WAV, OGG, FLAC, or M4A).
                  </li>
                </ol>
              </div>

              <div className="mt-8">
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                  Method 2: Voice Cloning Mode (Advanced)
                </h3>
                <ol className="space-y-4 list-decimal list-inside text-lg">
                  <li>
                    <strong>Activate Voice Cloning:</strong> Switch to "🎭 Voice Cloning" mode using the toggle at the top.
                  </li>
                  <li>
                    <strong>Provide Voice Sample:</strong> You have three options:
                    <ul className="ml-8 mt-2 space-y-2 list-disc">
                      <li><strong>📁 Upload:</strong> Upload a 10-30 second audio file of the voice you want to clone (WAV or MP3 format recommended)</li>
                      <li><strong>🎙️ Record:</strong> Use your microphone to record a voice sample directly in the browser</li>
                      <li><strong>📚 Library:</strong> Choose from previously saved voice samples for quick access</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Preview Your Sample:</strong> The platform displays an audio player with waveform visualization so you can verify your voice sample before proceeding.
                  </li>
                  <li>
                    <strong>Save to Library (Optional):</strong> Click "💾 Save to Library" to store your voice sample for future use. This is especially useful for recurring projects.
                  </li>
                  <li>
                    <strong>Enter Your Script:</strong> Type the text you want to be spoken in the cloned voice. The AI will analyze the voice sample's pitch, speed, and tone characteristics.
                  </li>
                  <li>
                    <strong>Configure Audio Settings:</strong> Access advanced settings for output format, quality level (Low, Medium, High, Ultra), and enable noise reduction if needed.
                  </li>
                  <li>
                    <strong>Clone & Generate:</strong> Click "🎭 Clone & Generate". The AI processes your voice sample, matches its characteristics, and generates audio that mimics the speaker's voice.
                  </li>
                  <li>
                    <strong>Review & Export:</strong> Listen to the result, and if satisfied, download your cloned voice audio in your preferred format.
                  </li>
                </ol>
              </div>

              <div className="mt-8">
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Batch Processing for Multiple Texts
                </h3>
                <p className="text-lg mb-4">
                  Need to generate multiple voiceovers at once? Our batch processing feature lets you create up to 10 audio files simultaneously:
                </p>
                <ol className="space-y-3 list-decimal list-inside text-lg">
                  <li>Click "📋 Batch Mode" to enable multi-text processing</li>
                  <li>Enter different texts in separate input boxes (click "➕ Add Another Text" for more)</li>
                  <li>Configure global settings that apply to all texts</li>
                  <li>Click "🚀 Generate All" to process everything at once</li>
                  <li>All generated files appear in your history for easy management and download</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Section 3: Benefits & Features */}
          <section className={`${darkMode ? 'bg-gray-800/30' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border ${darkMode ? 'border-purple-500/20' : 'border-purple-200'}`}>
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
              <span className="text-4xl">✨</span>
              Key Benefits & Features of AI Voice Dubbing
            </h2>
            <div className={`grid md:grid-cols-2 gap-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'} border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'}`}>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'} flex items-center gap-2`}>
                  <span>💰</span> Cost-Effective Solution
                </h3>
                <p>
                  Save thousands of dollars on professional voice actors and studio rentals. Generate unlimited high-quality voiceovers for a fraction of traditional costs. Perfect for startups, content creators, and businesses on a budget.
                </p>
              </div>

              <div className={`p-6 rounded-xl ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} border ${darkMode ? 'border-blue-500/30' : 'border-blue-200'}`}>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'} flex items-center gap-2`}>
                  <span>⚡</span> Lightning-Fast Generation
                </h3>
                <p>
                  Create professional voiceovers in seconds, not hours. What traditionally takes days of scheduling, recording, and editing can now be done instantly. Generate, preview, and download immediately.
                </p>
              </div>

              <div className={`p-6 rounded-xl ${darkMode ? 'bg-green-900/30' : 'bg-green-50'} border ${darkMode ? 'border-green-500/30' : 'border-green-200'}`}>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-green-400' : 'text-green-600'} flex items-center gap-2`}>
                  <span>🌍</span> Multi-Language Support
                </h3>
                <p>
                  Reach global audiences with support for 20+ languages including English, Spanish, French, German, Arabic, Urdu, Hindi, Chinese, Japanese, Korean, and more. Perfect for international marketing and educational content.
                </p>
              </div>

              <div className={`p-6 rounded-xl ${darkMode ? 'bg-pink-900/30' : 'bg-pink-50'} border ${darkMode ? 'border-pink-500/30' : 'border-pink-200'}`}>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-pink-400' : 'text-pink-600'} flex items-center gap-2`}>
                  <span>🎨</span> Complete Customization
                </h3>
                <p>
                  Full control over voice characteristics with adjustable speed (0.5x-2x), pitch (-12 to +12 semitones), volume, and audio quality. Choose from multiple output formats (MP3, WAV, OGG, FLAC, M4A).
                </p>
              </div>

              <div className={`p-6 rounded-xl ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'} border ${darkMode ? 'border-indigo-500/30' : 'border-indigo-200'}`}>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} flex items-center gap-2`}>
                  <span>🎭</span> Advanced Voice Cloning
                </h3>
                <p>
                  Clone any voice by uploading a sample. Our AI analyzes volume, pitch, and speaking speed to generate audio that closely matches the original speaker. Great for consistent brand voice and personalized content.
                </p>
              </div>

              <div className={`p-6 rounded-xl ${darkMode ? 'bg-orange-900/30' : 'bg-orange-50'} border ${darkMode ? 'border-orange-500/30' : 'border-orange-200'}`}>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-orange-400' : 'text-orange-600'} flex items-center gap-2`}>
                  <span>📚</span> Audio History & Library
                </h3>
                <p>
                  Automatically save all generated audio files with searchable history. Organize voice samples in a personal library for quick access. Never lose your valuable voiceover assets.
                </p>
              </div>

              <div className={`p-6 rounded-xl ${darkMode ? 'bg-teal-900/30' : 'bg-teal-50'} border ${darkMode ? 'border-teal-500/30' : 'border-teal-200'}`}>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-teal-400' : 'text-teal-600'} flex items-center gap-2`}>
                  <span>🔊</span> Professional Audio Quality
                </h3>
                <p>
                  Studio-grade audio output with up to 320kbps quality. Built-in noise reduction, normalization, and audio enhancement ensure broadcast-ready results every time.
                </p>
              </div>

              <div className={`p-6 rounded-xl ${darkMode ? 'bg-red-900/30' : 'bg-red-50'} border ${darkMode ? 'border-red-500/30' : 'border-red-200'}`}>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-red-400' : 'text-red-600'} flex items-center gap-2`}>
                  <span>📱</span> Fully Responsive Design
                </h3>
                <p>
                  Works perfectly on desktop, tablet, and mobile devices. Beautiful dark mode interface with smooth animations and intuitive controls. Create voiceovers anywhere, anytime.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Use Cases */}
          <section className={`${darkMode ? 'bg-gray-800/30' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border ${darkMode ? 'border-purple-500/20' : 'border-purple-200'}`}>
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
              <span className="text-4xl">💼</span>
              Popular Use Cases & Applications
            </h2>
            <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg`}>
              <div>
                <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  For Content Creators & YouTubers
                </h3>
                <p className="mb-2">
                  Create professional voiceovers for YouTube videos, TikTok content, Instagram reels, and podcasts. Generate narration for tutorials, reviews, documentaries, and explainer videos without expensive recording equipment. Perfect for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Video narration and commentary tracks</li>
                  <li>Podcast intros and outros</li>
                  <li>Tutorial and how-to videos</li>
                  <li>Product review voiceovers</li>
                  <li>Animated character voices</li>
                  <li>Background narration for vlogs</li>
                </ul>
              </div>

              <div>
                <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  For Educators & E-Learning
                </h3>
                <p className="mb-2">
                  Transform educational content into engaging audio lessons. Create accessible learning materials for students with different learning styles. Ideal for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Online course narration</li>
                  <li>Educational video voiceovers</li>
                  <li>Audiobook creation for textbooks</li>
                  <li>Language learning materials</li>
                  <li>Accessibility features for visually impaired students</li>
                  <li>Training module audio</li>
                </ul>
              </div>

              <div>
                <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  For Marketing & Business
                </h3>
                <p className="mb-2">
                  Enhance marketing campaigns with professional voiceovers. Create consistent brand voice across all channels. Perfect for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Advertisement and commercial voiceovers</li>
                  <li>Promotional video narration</li>
                  <li>IVR and phone system messages</li>
                  <li>Product demo videos</li>
                  <li>Brand storytelling content</li>
                  <li>Social media marketing videos</li>
                  <li>Email marketing audio messages</li>
                </ul>
              </div>

              <div>
                <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                  For Authors & Publishers
                </h3>
                <p className="mb-2">
                  Convert written content into audiobooks and audio articles. Reach readers who prefer audio content. Great for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Audiobook production</li>
                  <li>Blog post audio versions</li>
                  <li>News article narration</li>
                  <li>Story and fiction reading</li>
                  <li>Poetry and literature recitation</li>
                </ul>
              </div>

              <div>
                <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  For Accessibility & Inclusion
                </h3>
                <p className="mb-2">
                  Make content accessible to everyone. Support users with visual impairments, reading difficulties, or language barriers. Essential for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Screen reader alternatives</li>
                  <li>Website accessibility features</li>
                  <li>Document narration for visually impaired</li>
                  <li>Multi-language content delivery</li>
                  <li>Learning disability support</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: FAQ */}
          <section className={`${darkMode ? 'bg-gray-800/30' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border ${darkMode ? 'border-purple-500/20' : 'border-purple-200'}`}>
            <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
              <span className="text-4xl">❓</span>
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Is AI voice dubbing free to use?",
                  a: "Yes! Our AI voice dubbing tool is completely free. You can generate unlimited voiceovers in multiple languages with no subscription fees or hidden costs. All features including voice cloning, batch processing, and premium quality audio are available at no charge."
                },
                {
                  q: "What languages are supported for voice generation?",
                  a: "We support 20+ languages including English, Spanish, French, German, Italian, Portuguese, Russian, Arabic, Urdu, Hindi, Chinese (Simplified & Traditional), Japanese, Korean, Turkish, Dutch, Polish, Vietnamese, Thai, and Indonesian. More languages are regularly added based on user demand."
                },
                {
                  q: "How accurate is the voice cloning feature?",
                  a: "Our voice cloning technology analyzes volume, pitch, and speaking speed from your uploaded sample to create a similar-sounding voice. While it won't be an exact replica (true cloning requires advanced ML models like Coqui TTS), it matches the general characteristics quite well. For best results, upload a clear 10-30 second audio sample with minimal background noise."
                },
                {
                  q: "What audio formats can I download?",
                  a: "You can download your generated audio in multiple formats: MP3 (most compatible), WAV (uncompressed quality), OGG (open source), FLAC (lossless compression), and M4A (Apple devices). Quality settings range from Low (64kbps) to Ultra (320kbps)."
                },
                {
                  q: "Can I use generated voices commercially?",
                  a: "Yes, you can use AI-generated voices for commercial projects including YouTube videos, advertisements, courses, and business presentations. However, we recommend checking the terms of service and ensuring your use case complies with applicable laws and regulations in your region."
                },
                {
                  q: "How long does it take to generate a voice?",
                  a: "Most voiceovers are generated in 5-15 seconds depending on text length and selected settings. Short texts (under 500 characters) generate almost instantly. Longer texts with voice cloning or noise reduction may take up to 30 seconds."
                },
                {
                  q: "What's the maximum text length for voice generation?",
                  a: "You can generate voices for up to 5,000 characters in a single request. For longer content, use our batch processing feature to split text into multiple segments and generate them simultaneously."
                },
                {
                  q: "Do I need to install any software?",
                  a: "No installation required! Our AI voice dubbing tool is completely web-based. Simply open the website in any modern browser (Chrome, Firefox, Safari, Edge) on desktop, tablet, or mobile device and start creating voiceovers immediately."
                },
                {
                  q: "Can I save and reuse voice samples?",
                  a: "Absolutely! Use the voice sample library feature to save your uploaded or recorded samples. This is perfect for maintaining consistent voice across multiple projects or quickly accessing your favorite voice profiles."
                },
                {
                  q: "Is my data and audio content secure?",
                  a: "Yes, we take privacy seriously. All audio processing is done on secure servers, and uploaded files are automatically deleted after processing. We don't share your content with third parties. Your generated audio history is stored locally in your browser for your convenience."
                }
              ].map((faq, index) => (
                <div key={index} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {faq.q}
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg`}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SEO Keywords Section */}
          <section className={`${darkMode ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20' : 'bg-gradient-to-r from-purple-50 to-pink-50'} rounded-3xl p-8 text-center`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <strong>Keywords:</strong> AI voice generator, text to speech, voice cloning, AI dubbing, free voice generator, online TTS, multilingual voice over, natural voice synthesis, speech synthesis, voice AI, automated narration, voice conversion, audio generator, speech AI, voice over generator, TTS online, AI narrator, voice maker, synthetic voice, digital voice creation
            </p>
          </section>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      </div>
    </>
  );
}
