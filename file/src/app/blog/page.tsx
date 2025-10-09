import { Metadata } from 'next';
import Link from 'next/link';
import { blogPostsData } from '@/lib/blogPostsData';

export const metadata: Metadata = {
  title: 'PDF Tools Blog - Tips, Tricks & Latest Updates | PDF Converter Pro',
  description: 'Discover helpful articles, tips, and updates about PDF conversion tools. Learn how to get the most out of our PDF to Word, Word to PDF, merge PDF, and PDF to image converters.',
  keywords: 'PDF blog, PDF tips, document conversion, PDF tools, PDF to Word, Word to PDF, merge PDF, PDF to images',
  openGraph: {
    title: 'PDF Tools Blog - Tips, Tricks & Latest Updates',
    description: 'Discover helpful articles, tips, and updates about PDF conversion tools.',
    type: 'website',
    locale: 'en_US',
    url: 'https://flipfilex.com/blog',
    siteName: 'PDF Converter Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Tools Blog - Tips, Tricks & Latest Updates',
    description: 'Discover helpful articles, tips, and updates about PDF conversion tools.',
  },
  alternates: {
    canonical: 'https://flipfilex.com/blog',
  },
};

// Convert blogPostsData object to array for listing
const blogPosts = Object.entries(blogPostsData).map(([slug, post]) => ({
  ...post,
  slug
}));

export default function BlogPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const currentCategory = (searchParams.category as string) || 'All';
  const currentPage = Number(searchParams.page) || 1;

  // Filter posts by category if specified
  const filteredPosts = currentCategory === 'All'
    ? blogPosts
    : blogPosts.filter((post) => post.category === currentCategory);

  // Get unique categories for filter buttons
  const allCategories = ['All', ...Array.from(new Set(blogPosts.map((post) => post.category)))];

  // Pagination
  const postsPerPage = 9;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Blog Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF Tools Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tips, tricks, and latest updates about PDF conversion tools and document management.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {allCategories.map((category) => (
            <Link
              key={category}
              href={`/blog?category=${category === 'All' ? 'All' : encodeURIComponent(category)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentCategory === category
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Blog Posts Grid */}
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <time className="text-sm text-gray-500" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                    >
                      Read more
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No articles found in this category.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              {/* Previous Page Button */}
              {currentPage > 1 && (
                <Link
                  href={`/blog?category=${encodeURIComponent(currentCategory.toString())}&page=${currentPage - 1}`}
                  className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                >
                  ← Previous
                </Link>
              )}

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/blog?category=${encodeURIComponent(currentCategory.toString())}&page=${page}`}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </Link>
              ))}

              {/* Next Page Button */}
              {currentPage < totalPages && (
                <Link
                  href={`/blog?category=${encodeURIComponent(currentCategory.toString())}&page=${currentPage + 1}`}
                  className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                >
                  Next →
                </Link>
              )}
            </nav>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest blog posts, tips, and updates about our PDF tools.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}