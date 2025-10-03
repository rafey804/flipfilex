'use client';

import { useState, useRef } from 'react';
import ResumeBuilder from '@/components/ResumeBuilder';
import Head from 'next/head';

export default function ResumeBuilderPage() {
  return (
    <>
      <Head>
        <title>Free AI Resume Builder Online - Create Professional Resume | ATS Optimized</title>
        <meta name="description" content="Build professional resumes with AI assistance. Free resume builder with ATS optimization, smart templates, real-time preview & PDF download. Land your dream job today!" />
        <meta name="keywords" content="resume builder, free resume maker, AI resume builder, professional resume, CV builder, resume template, ATS resume, resume creator online, job resume builder, resume download PDF" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/resume-builder" />
        <meta property="og:title" content="Free AI Resume Builder - Create Professional Resume Online" />
        <meta property="og:description" content="Build ATS-optimized resumes with AI assistance. Smart templates, real-time preview, free PDF download." />
        <meta property="og:image" content="https://flipfilex.com/og-resume-builder.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free AI Resume Builder | Professional Resume Creator" />
        <meta name="twitter:description" content="Create ATS-optimized resumes with AI. Free, professional templates." />
        <meta name="twitter:image" content="https://flipfilex.com/og-resume-builder.png" />

        <link rel="canonical" href="https://flipfilex.com/resume-builder" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            AI-Powered Resume Builder
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Create professional resumes with AI assistance. Smart suggestions, ATS optimization,
            and real-time preview to land your dream job.
          </p>
        </div>

        {/* Main Resume Builder Component */}
        <ResumeBuilder />

        {/* Features Section */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* AI Features */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI-Powered Features
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-blue-800 text-xs sm:text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>Smart Suggestions:</strong> AI recommends skills and job titles</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>Content Enhancement:</strong> AI improves descriptions and summaries</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>ATS Optimization:</strong> Keywords for applicant tracking systems</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span><strong>Job Matching:</strong> Tailors resume to specific job postings</span>
              </li>
            </ul>
          </div>

          {/* Professional Design */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-200">
            <h3 className="font-semibold text-indigo-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M7 17h.01M7 14h.01" />
              </svg>
              Professional Design
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-indigo-800 text-xs sm:text-sm">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2 mt-0.5">•</span>
                <span><strong>Multiple Templates:</strong> Choose from professional layouts</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2 mt-0.5">•</span>
                <span><strong>Color Themes:</strong> Customizable professional color schemes</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2 mt-0.5">•</span>
                <span><strong>Live Preview:</strong> See changes in real-time</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2 mt-0.5">•</span>
                <span><strong>Mobile Ready:</strong> Perfect on all devices</span>
              </li>
            </ul>
          </div>

          {/* Export & Share */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export & Analytics
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-purple-800 text-xs sm:text-sm">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-0.5">•</span>
                <span><strong>PDF Download:</strong> High-quality professional PDFs</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-0.5">•</span>
                <span><strong>Multiple Formats:</strong> PDF, Word, and text formats</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-0.5">•</span>
                <span><strong>Success Score:</strong> AI rates resume effectiveness (1-100)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2 mt-0.5">•</span>
                <span><strong>Skill Analysis:</strong> Gap analysis and recommendations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 sm:mt-16">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about our AI Resume Builder
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

              {/* Left Column */}
              <div className="space-y-6">

                <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    How does the AI assistance work?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our AI analyzes your experience and suggests relevant skills, improves job descriptions, generates professional summaries, and optimizes content for ATS systems. It learns from millions of successful resumes.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Is the resume builder free to use?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Yes! Create unlimited resumes with full AI assistance, professional templates, and PDF exports. No hidden fees, watermarks, or registration required. Perfect for job seekers at any level.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    What is ATS optimization?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    ATS (Applicant Tracking System) optimization ensures your resume passes through company screening software. Our AI adds relevant keywords, proper formatting, and industry-specific terms.
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">

                <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Can I customize the design?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Absolutely! Choose from multiple professional templates, customize colors, upload your photo, and adjust layouts. All designs are ATS-friendly and optimized for both digital and print formats.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    How does job matching work?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Paste any job posting and our AI will analyze requirements, suggest missing skills, optimize keywords, and score how well your resume matches. Get tailored resumes for each application.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    What formats can I download?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Download your resume as a high-quality PDF, Word document, or plain text. All formats are professionally formatted and ready for job applications, LinkedIn, or printing.
                  </p>
                </div>
              </div>
            </div>

            {/* SEO Content Section */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Professional Resume Builder with AI Technology
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Stand out from the competition with our AI-powered resume builder. Create professional resumes that pass ATS screening and impress hiring managers. Our smart technology analyzes job requirements and optimizes your resume for maximum impact.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Whether you're a recent graduate, experienced professional, or career changer, our resume builder adapts to your needs. Get personalized suggestions, professional templates, and real-time optimization to land more interviews.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">AI</div>
                    <div className="text-sm text-gray-600">Powered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">95%</div>
                    <div className="text-sm text-gray-600">ATS Pass Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">∞</div>
                    <div className="text-sm text-gray-600">Templates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <div className="text-sm text-gray-600">Free Forever</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}