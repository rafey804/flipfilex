'use client';

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AboutUsPage() {
  const [activeTab, setActiveTab] = useState('story');

  const stats = [
    { number: '2.5M+', label: 'Files Converted', icon: '📄' },
    { number: '150+', label: 'Countries Served', icon: '🌍' },
    { number: '99.8%', label: 'Uptime Reliability', icon: '⚡' },
    { number: '24/7', label: 'Service Availability', icon: '🚀' }
  ];

  const values = [
    {
      title: 'Privacy First',
      description: 'We believe your documents are private. All files are automatically deleted within 1 hour, and we never store or access your content.',
      icon: '🔒'
    },
    {
      title: 'Quality Excellence',
      description: 'Our conversion algorithms are continuously refined to deliver professional-grade results that preserve formatting and maintain document integrity.',
      icon: '✨'
    },
    {
      title: 'User Experience',
      description: 'We design every feature with simplicity in mind. Complex document conversion should be as easy as a few clicks.',
      icon: '🎯'
    },
    {
      title: 'Accessibility',
      description: 'Free, fast, and reliable document conversion tools should be available to everyone, anywhere, without barriers.',
      icon: '🌟'
    }
  ];

  const timeline = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'Started as a simple PDF to Word converter to solve our own document workflow challenges.'
    },
    {
      year: '2021',
      title: 'Expanding Tools',
      description: 'Added Word to PDF conversion and PDF merger based on user feedback and requests.'
    },
    {
      year: '2022',
      title: 'Security Focus',
      description: 'Implemented enterprise-grade security with automatic file deletion and SSL encryption.'
    },
    {
      year: '2023',
      title: 'Global Reach',
      description: 'Served over 1 million users across 100+ countries with improved processing speeds.'
    },
    {
      year: '2024',
      title: 'Innovation Continues',
      description: 'Launched PDF to Images converter and enhanced all tools with AI-powered optimization.'
    }
  ];

  const team = [
    {
      name: 'Alex Thompson',
      role: 'Chief Technology Officer',
      description: 'Former senior engineer at Adobe with 10+ years in document processing technology.',
      image: '/images/team/alex.jpg'
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Security',
      description: 'Cybersecurity expert ensuring your documents remain private and secure.',
      image: '/images/team/sarah.jpg'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Lead Developer',
      description: 'Full-stack developer focused on creating seamless user experiences.',
      image: '/images/team/marcus.jpg'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'AI Research Lead',
      description: 'PhD in Computer Science, specializing in document analysis and conversion algorithms.',
      image: '/images/team/emily.jpg'
    }
  ];

  return (
    <>
      <Head>
        <title>About Us - PDF Converter | Our Story & Mission</title>
        <meta name="description" content="Learn about PDF Converter's mission to provide free, secure, and professional document conversion tools. Meet our team and discover our commitment to user privacy." />
        <meta name="keywords" content="about PDF converter, document conversion company, team, mission, privacy, security" />
        <meta property="og:title" content="About PDF Converter - Our Story & Mission" />
        <meta property="og:description" content="Discover how PDF Converter helps millions of users convert documents securely and efficiently." />
        <link rel="canonical" href="https://yoursite.com/about" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                  <span className="text-gray-900 font-medium">About Us</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl text-white text-4xl mb-8 shadow-lg">
              🏢
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              About PDF Converter
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We&apos;re on a mission to make professional document conversion 
              <span className="font-semibold text-blue-600"> accessible to everyone</span>, 
              <span className="font-semibold text-purple-600"> completely free</span>, and 
              <span className="font-semibold text-green-600"> absolutely secure</span>.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              <div className="flex space-x-1">
                {[
                  { id: 'story', label: 'Our Story' },
                  { id: 'mission', label: 'Mission & Values' },
                  { id: 'team', label: 'Meet the Team' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          {activeTab === 'story' && (
            <div className="space-y-16">
              {/* Story Introduction */}
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It All Started</h2>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      PDF Converter was born out of frustration. Our founders were constantly struggling with 
                      expensive software licenses, complicated interfaces, and privacy concerns when converting 
                      documents for their consulting business.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      After spending countless hours searching for a simple, secure, and free solution that 
                      didn&apos;t exist, they decided to build it themselves. What started as an internal tool 
                      quickly became something much bigger.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Today, we&apos;re proud to serve millions of users worldwide with the same simple principle: 
                      professional-quality document conversion should be free, fast, and secure for everyone.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">💡</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">The Idea</h3>
                        <p className="text-gray-600">Simple, secure, and free document conversion for everyone</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Journey</h2>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
                  
                  <div className="space-y-12">
                    {timeline.map((item, index) => (
                      <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                              {item.year}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                        
                        {/* Timeline dot */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mission' && (
            <div className="space-y-16">
              {/* Mission Statement */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 text-center border border-blue-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
                <p className="text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-8">
                  To democratize professional document conversion by providing free, secure, and 
                  high-quality tools that respect user privacy and deliver exceptional results.
                </p>
                <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-md">
                  <span className="text-blue-600 font-semibold">Free Forever</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-purple-600 font-semibold">Privacy Focused</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-green-600 font-semibold">Quality First</span>
                </div>
              </div>

              {/* Core Values */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {values.map((value, index) => (
                    <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl">
                          {value.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{value.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commitment */}
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Commitment to You</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                      🛡️
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Privacy Protection</h3>
                    <p className="text-gray-600">Your documents are automatically deleted within 1 hour. We never store, share, or access your files.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                      ⚡
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Continuous Innovation</h3>
                    <p className="text-gray-600">We constantly improve our algorithms and add new features based on user feedback and technological advances.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                      🌍
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Global Accessibility</h3>
                    <p className="text-gray-600">Our tools work on any device, in any location, without requiring downloads or installations.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-16">
              {/* Team Introduction */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  We&apos;re a diverse group of engineers, designers, and security experts united by our passion 
                  for creating tools that make document conversion simple and secure.
                </p>
              </div>

              {/* Team Members */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{member.name}</h3>
                    <div className="text-blue-600 font-medium mb-3">{member.role}</div>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </div>
                ))}
              </div>

              {/* Join Us */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
                <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  We&apos;re always looking for talented individuals who share our passion for 
                  creating exceptional user experiences and building tools that matter.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/careers" 
                    className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                  >
                    View Open Positions
                  </Link>
                  <Link 
                    href="/contact" 
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-20 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-emerald-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Feedback?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We&apos;d love to hear from you. Whether you have suggestions, need support, or just want to say hello, 
              we&apos;re here to help make your document conversion experience even better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </Link>
              <Link 
                href="/help" 
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}