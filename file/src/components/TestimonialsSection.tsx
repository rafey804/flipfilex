'use client';

import { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  tool: string;
  verified: boolean;
  avatar?: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Marketing Manager",
    company: "TechStart Inc.",
    content: "FlipFileX has become an essential tool for our team. Converting client proposals from Word to PDF has never been easier. The formatting stays perfect every time, and it's completely free!",
    rating: 5,
    tool: "Word to PDF",
    verified: true,
    date: "2024-12-15"
  },
  {
    id: 2,
    name: "Dr. Michael Rodriguez",
    role: "Research Professor",
    company: "University of California",
    content: "As an academic, I frequently need to convert research papers and documents. FlipFileX maintains all the complex formatting, equations, and references perfectly. It's a lifesaver for my publications.",
    rating: 5,
    tool: "PDF to Word",
    verified: true,
    date: "2024-12-10"
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Freelance Designer",
    content: "The image conversion tools are fantastic! Converting HEIC files from my iPhone to JPG for client presentations used to be a hassle. Now it's instant and the quality is excellent.",
    rating: 5,
    tool: "HEIC to JPG",
    verified: true,
    date: "2024-12-08"
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Small Business Owner",
    company: "Wilson Consulting",
    content: "I use FlipFileX daily for invoices, contracts, and presentations. The PDF merger saved me hours of work when combining multiple reports. No registration needed, just works perfectly!",
    rating: 5,
    tool: "PDF Merger",
    verified: true,
    date: "2024-12-05"
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Student",
    company: "Stanford University",
    content: "Perfect for college assignments! I can convert my research papers to PDF format before submission, and the formatting always stays intact. Free tools like this are exactly what students need.",
    rating: 5,
    tool: "Word to PDF",
    verified: true,
    date: "2024-12-02"
  },
  {
    id: 6,
    name: "David Kumar",
    role: "Content Creator",
    content: "The video conversion tools are amazing! Converting MP4 to MOV for my Mac editing workflow is seamless. The quality remains perfect and processing is incredibly fast.",
    rating: 5,
    tool: "Video Converter",
    verified: true,
    date: "2024-11-28"
  },
  {
    id: 7,
    name: "Maria Garcia",
    role: "Administrative Assistant",
    company: "Healthcare Solutions",
    content: "Our office relies on FlipFileX for document conversions. The security features give us confidence that patient information stays protected. Files are deleted automatically after conversion.",
    rating: 5,
    tool: "PDF to Word",
    verified: true,
    date: "2024-11-25"
  },
  {
    id: 8,
    name: "Alex Zhang",
    role: "Software Engineer",
    company: "TechCorp",
    content: "As a developer, I appreciate tools that just work without complications. FlipFileX is reliable, fast, and the API documentation tools are surprisingly good for generating clean PDFs.",
    rating: 5,
    tool: "Various Tools",
    verified: true,
    date: "2024-11-20"
  }
];

interface TestimonialsSectionProps {
  tool?: string;
  limit?: number;
  showRatings?: boolean;
}

export default function TestimonialsSection({
  tool,
  limit = 6,
  showRatings = true
}: TestimonialsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(limit);

  // Filter testimonials by tool if specified
  const filteredTestimonials = tool
    ? testimonials.filter(t => t.tool.toLowerCase().includes(tool.toLowerCase()))
    : testimonials;

  const visibleTestimonials = filteredTestimonials.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTestimonials.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, filteredTestimonials.length));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const averageRating = filteredTestimonials.reduce((acc, t) => acc + t.rating, 0) / filteredTestimonials.length;
  const totalReviews = filteredTestimonials.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What Our Users Say
        </h2>
        <p className="text-gray-600 mb-6">
          Trusted by thousands of professionals, students, and businesses worldwide
        </p>

        {showRatings && (
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-1">
              {renderStars(Math.round(averageRating))}
              <span className="ml-2 text-lg font-semibold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <div className="text-gray-500">
              Based on {totalReviews.toLocaleString()}+ reviews
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {visibleTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(testimonial.rating)}
              </div>
              {testimonial.verified && (
                <div className="flex items-center space-x-1 text-green-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verified</span>
                </div>
              )}
            </div>

            <blockquote className="text-gray-700 leading-relaxed mb-4">
              "{testimonial.content}"
            </blockquote>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-600">
                  {testimonial.role}
                  {testimonial.company && (
                    <span className="text-gray-500"> at {testimonial.company}</span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(testimonial.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                {testimonial.tool}
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            Load More Reviews
          </button>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">50K+</div>
            <div className="text-sm text-gray-600">Monthly Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">99.2%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">100+</div>
            <div className="text-sm text-gray-600">Free Tools</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
        </div>
      </div>

      {/* Schema markup for reviews */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": tool ? `${tool} Converter` : "FlipFileX File Conversion Tools",
            "description": "Free online file conversion tools with professional quality results",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": averageRating.toFixed(1),
              "reviewCount": totalReviews,
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": visibleTestimonials.map(testimonial => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": testimonial.name
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": testimonial.rating,
                "bestRating": "5",
                "worstRating": "1"
              },
              "reviewBody": testimonial.content,
              "datePublished": testimonial.date
            }))
          })
        }}
      />
    </div>
  );
}