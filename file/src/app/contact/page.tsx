import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us - FlipFileX | Get Support & Send Feedback',
  description: 'Contact FlipFileX support team. Get help with file conversion tools, report issues, or share feedback. We respond within 24 hours.',
  keywords: 'contact FlipFileX, customer support, help, feedback, file conversion support',
  openGraph: {
    title: 'Contact FlipFileX Support',
    description: 'Get help with file conversion tools or share your feedback with our team.',
  },
  alternates: {
    canonical: 'https://flipfilex.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white text-2xl mb-6">
              📞
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about our file conversion tools? Need help or want to share feedback?
              We're here to help and love hearing from our users!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
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
                <span className="text-gray-900 font-medium">Contact</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600 text-sm mb-2">For all inquiries, support, and feedback</p>
                    <a href="mailto:flipfilex.com@gmail.com" className="text-blue-600 hover:text-blue-700">
                      flipfilex.com@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Response Times</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">General Support:</span>
                    <span className="font-medium text-gray-900">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bug Reports:</span>
                    <span className="font-medium text-gray-900">Within 12 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Inquiries:</span>
                    <span className="font-medium text-gray-900">Within 48 hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Answers</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Are your tools really free?</h4>
                  <p className="text-gray-600 text-sm">Yes! All 100+ tools are completely free with no hidden charges or registration required.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">How secure are my files?</h4>
                  <p className="text-gray-600 text-sm">All files are encrypted during transfer and automatically deleted within 1 hour. We never store or access your content.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Can I suggest new tools?</h4>
                  <p className="text-gray-600 text-sm">Absolutely! We love user suggestions and regularly add new tools based on feedback.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-600 mb-8">
                Use the form below to send us your questions, feedback, or suggestions. We read every message and typically respond within 24 hours.
              </p>

              <ContactForm />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About FlipFileX</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              FlipFileX was founded by Rafey Uldin, an 18-year-old passionate developer from Pakistan.
              With a love for coding and problem-solving, the platform was built to make complex file
              transformations effortless for everyone – from students and freelancers to professionals worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                💡
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">Continuously developing new tools based on user needs and latest technology.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🔒
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
              <p className="text-gray-600 text-sm">Your privacy is our priority with automatic file deletion and SSL encryption.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🌍
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600 text-sm">Free tools available to everyone, everywhere, without barriers or registration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}