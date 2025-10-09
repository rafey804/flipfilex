'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import ResumeBuilder from '@/components/ResumeBuilder';

export default function ResumeBuilderClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
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
              <Link href="/tools" className="text-gray-500 hover:text-blue-600 transition-colors">
                Tools
              </Link>
            </li>
            <li>
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-900 font-medium">Resume Builder</span>
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            AI-Powered Resume Builder
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 mb-8">
            Create professional resumes with AI assistance. Smart suggestions, ATS optimization,
            and real-time preview to land your dream job.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              ✅ Free Forever
            </div>
            <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              🤖 AI-Powered
            </div>
            <div className="px-6 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              📄 ATS-Friendly
            </div>
          </div>
        </div>

        {/* Main Resume Builder Component */}
        <ResumeBuilder />

        {/* How to Use Section - SEO Content */}
        <section className="mt-20 mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-blue-100/50">
            <h2 className="text-4xl font-black text-gray-900 mb-6">How to Create a Professional Resume Online Free</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Creating a professional resume has never been easier with our free online resume builder. Whether you're a job seeker,
                recent graduate, or career changer, our AI-powered tool helps you craft the perfect resume that stands out to employers
                and passes through Applicant Tracking Systems (ATS). With intelligent suggestions, modern templates, and real-time preview,
                you can build a resume that showcases your skills and experience effectively.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step-by-Step Guide to Building Your Resume:</h3>
              <ol className="space-y-3 ml-6 list-decimal">
                <li className="text-gray-700">
                  <strong>Choose Your Template:</strong> Select from our collection of professional, ATS-friendly resume templates.
                  Each template is designed to highlight your strengths while maintaining a clean, professional appearance that recruiters love.
                </li>
                <li className="text-gray-700">
                  <strong>Add Your Information:</strong> Fill in your personal details, contact information, professional summary,
                  work experience, education, and skills. Our AI assistant provides smart suggestions as you type, helping you craft
                  compelling descriptions that highlight your achievements.
                </li>
                <li className="text-gray-700">
                  <strong>Customize Your Design:</strong> Choose from various color themes, fonts, and layouts to personalize your resume.
                  Our real-time preview lets you see exactly how your resume will look, ensuring perfect formatting before download.
                </li>
                <li className="text-gray-700">
                  <strong>Download as PDF:</strong> Once you're satisfied with your resume, download it as a high-quality PDF file.
                  Your resume is ready to send to employers, upload to job boards, or attach to email applications immediately.
                </li>
              </ol>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Use Our Free Resume Builder?</h3>
              <p className="mb-4">
                Our resume builder combines artificial intelligence with professional design principles to help you create resumes that
                get results. The tool is completely free, requires no registration, and gives you unlimited access to all features.
                Whether you need a simple one-page resume or a comprehensive CV, our builder adapts to your needs while ensuring ATS compatibility.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Why Use Our Resume Builder?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Assistance</h3>
              <p className="text-gray-600">
                Get intelligent suggestions for skills, job titles, and content. Our AI helps you write compelling descriptions that
                highlight your achievements and match job requirements effectively.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">ATS-Friendly Templates</h3>
              <p className="text-gray-600">
                All our templates are optimized to pass Applicant Tracking Systems used by 98% of Fortune 500 companies.
                Your resume will be properly parsed and ranked by automated systems.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Preview</h3>
              <p className="text-gray-600">
                See your resume update in real-time as you type. What you see is exactly what you get when you download,
                eliminating formatting surprises and ensuring professional presentation.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Completely Free</h3>
              <p className="text-gray-600">
                No hidden costs, no premium tiers, no credit card required. Create unlimited resumes with full access to all features,
                templates, and downloads completely free forever.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Design</h3>
              <p className="text-gray-600">
                Choose from modern, elegant templates designed by professional resume writers. Customizable colors, fonts, and layouts
                let you create a resume that reflects your personal brand.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy Protected</h3>
              <p className="text-gray-600">
                Your data is processed securely and never shared. No account creation means your information stays completely private.
                Downloaded resumes are yours to keep with no tracking.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Frequently Asked Questions About Resume Building</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What is the best free resume builder online?</h3>
              <p className="text-gray-700">
                FlipFileX offers one of the best free resume builders with AI-powered suggestions, ATS-friendly templates, real-time preview,
                and unlimited downloads. Unlike other builders, we don't require registration, don't add watermarks, and give you complete
                access to all features for free.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Are the resume templates ATS-friendly?</h3>
              <p className="text-gray-700">
                Yes! All our resume templates are specifically designed to be ATS-compatible. They use standard formatting, proper headings,
                and clean structure that Applicant Tracking Systems can easily parse. This ensures your resume gets properly scanned and
                ranked by automated recruitment systems.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How does the AI assistance work?</h3>
              <p className="text-gray-700">
                Our AI analyzes your job title and experience to suggest relevant skills, provide writing assistance for job descriptions,
                and recommend keywords that match industry standards. It helps you quantify achievements, use action verbs, and create
                impact statements that recruiters look for.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Can I download my resume as PDF for free?</h3>
              <p className="text-gray-700">
                Absolutely! You can download your resume as a high-quality PDF file completely free, with no watermarks or limitations.
                The PDF maintains perfect formatting and is ready to send to employers immediately. Download as many times as you need.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Do I need to create an account or sign up?</h3>
              <p className="text-gray-700">
                No account or registration required! You can start building your resume immediately without providing any email address
                or personal information. This ensures complete privacy and lets you create your resume faster without unnecessary steps.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How many resume templates are available?</h3>
              <p className="text-gray-700">
                We offer multiple professional resume templates covering different styles from modern to classic, minimalist to creative.
                Each template is fully customizable with color themes, fonts, and layouts, giving you hundreds of design combinations to
                choose from.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Can I edit my resume after downloading?</h3>
              <p className="text-gray-700">
                The downloaded PDF is final and cannot be edited directly. However, you can always come back to the builder, make changes
                to your resume content, and download a new updated version. For editable formats, you can copy the content to a word processor.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What information should I include on my resume?</h3>
              <p className="text-gray-700">
                A professional resume should include: contact information, professional summary, work experience with achievements,
                education, relevant skills, and optionally certifications or projects. Our builder guides you through each section with
                helpful tips and examples.
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-blue-100/50">
            <h2 className="text-4xl font-black text-gray-900 mb-6">Who Should Use Our Resume Builder?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">💼 Job Seekers & Career Changers</h3>
                <p className="text-gray-700 mb-4">
                  Perfect for professionals looking to advance their careers or transition to new industries. Our AI helps highlight
                  transferable skills and create compelling narratives that demonstrate your value to potential employers.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">🎓 Recent Graduates & Students</h3>
                <p className="text-gray-700 mb-4">
                  Ideal for new graduates entering the job market. Our templates emphasize education, internships, projects, and skills
                  when work experience is limited. Get noticed by recruiters with professional presentation.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">🚀 Freelancers & Consultants</h3>
                <p className="text-gray-700 mb-4">
                  Showcase your diverse project portfolio and specialized skills. Create resumes that highlight your expertise,
                  client successes, and unique value proposition in the competitive freelance market.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">👔 Executive & Senior Professionals</h3>
                <p className="text-gray-700 mb-4">
                  Build executive-level resumes that emphasize leadership, strategic achievements, and career progression. Our professional
                  templates help senior professionals present their extensive experience in a concise, impactful format.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Related Career Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/invoice-generator" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                💰
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Invoice Generator</h3>
              <p className="text-sm text-gray-600">Create professional invoices</p>
            </Link>

            <Link href="/qr-code-generator" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                📱
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">QR Code Generator</h3>
              <p className="text-sm text-gray-600">Generate QR codes instantly</p>
            </Link>

            <Link href="/convert-pdf-to-word-online" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                📄
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">PDF to Word</h3>
              <p className="text-sm text-gray-600">Convert PDF to editable Word</p>
            </Link>

            <Link href="/url-shortener" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl text-white text-xl mb-4 group-hover:scale-110 transition-all duration-300">
                🔗
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">URL Shortener</h3>
              <p className="text-sm text-gray-600">Create short links</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
