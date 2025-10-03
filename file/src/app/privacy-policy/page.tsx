import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | PDF Converter - Free Online PDF Tools</title>
        <meta name="description" content="Privacy Policy for PDF Converter. Learn how we protect your data and files during conversion. We never store your documents and automatically delete files within 1 hour." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://pdfconverter.com/privacy-policy" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                  <span className="text-gray-900 font-medium">Privacy Policy</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white text-2xl mb-6 shadow-lg">
              🛡️
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your documents. This policy explains how we handle your data.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              
              {/* Quick Summary */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-8">
                <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Privacy at a Glance
                </h2>
                <ul className="text-green-800 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>We never store your files permanently</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Files are automatically deleted within 1 hour</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>No personal information required to use our service</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>All transfers are encrypted with SSL</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>We never access or read your document content</span>
                  </li>
                </ul>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Files You Upload</h3>
                <p className="text-gray-700 mb-4">
                  When you use our PDF conversion service, you upload files to our servers for processing. These files are:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Temporarily stored on our secure servers during conversion</li>
                  <li>Processed using automated conversion tools</li>
                  <li>Never accessed, viewed, or read by our staff</li>
                  <li>Automatically deleted within 1 hour of upload</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Technical Information</h3>
                <p className="text-gray-700 mb-4">
                  We automatically collect certain technical information to ensure our service works properly:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>IP address (for security and rate limiting)</li>
                  <li>Browser type and version</li>
                  <li>Operating system information</li>
                  <li>Conversion timestamps and file sizes</li>
                  <li>Error logs (for service improvement)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Analytics Data</h3>
                <p className="text-gray-700 mb-4">
                  We use privacy-focused analytics to understand how our service is used:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Page views and popular conversion types</li>
                  <li>Aggregate usage statistics</li>
                  <li>Performance metrics</li>
                  <li>No personally identifiable information is collected</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                
                <div className="bg-gray-50 rounded-xl p-6 mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">File Processing</h3>
                  <p className="text-gray-700">
                    Your uploaded files are used solely for the conversion process you requested. Our automated systems process your files without human intervention.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Improvement</h3>
                  <p className="text-gray-700">
                    We analyze aggregate usage patterns to improve our service, fix bugs, and add new features. This analysis never involves examining individual file contents.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Security Monitoring</h3>
                  <p className="text-gray-700">
                    We monitor for malicious activity, spam, and abuse to protect our service and users. This includes rate limiting and IP-based security measures.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Encryption in Transit</h3>
                    <p className="text-blue-800 text-sm">
                      All file uploads and downloads are protected with SSL/TLS encryption, ensuring your data is secure during transfer.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Secure Processing</h3>
                    <p className="text-purple-800 text-sm">
                      Files are processed on secure servers with restricted access and regular security updates.
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Automatic Deletion</h3>
                    <p className="text-green-800 text-sm">
                      All uploaded and converted files are automatically deleted from our servers within 1 hour.
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3">No Permanent Storage</h3>
                    <p className="text-orange-800 text-sm">
                      We never create backups or permanent copies of your files for any purpose.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Analytics</h3>
                <p className="text-gray-700 mb-4">
                  We use privacy-focused analytics services to understand usage patterns. These services:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Do not track individual users</li>
                  <li>Use anonymized data only</li>
                  <li>Comply with GDPR and privacy regulations</li>
                  <li>Allow you to opt out at any time</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">CDN and Infrastructure</h3>
                <p className="text-gray-700 mb-4">
                  We use reputable cloud infrastructure providers that comply with industry security standards and data protection regulations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-800">Right to Information</h3>
                    <p className="text-gray-700 text-sm">You have the right to know what data we collect and how we use it (covered in this policy).</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-gray-800">Right to Access</h3>
                    <p className="text-gray-700 text-sm">Since we don&apos;t store personal data permanently, there is no personal data to access.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-800">Right to Deletion</h3>
                    <p className="text-gray-700 text-sm">Your files are automatically deleted within 1 hour. No action needed from you.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-gray-800">Right to Object</h3>
                    <p className="text-gray-700 text-sm">You can stop using our service at any time. We don&apos;t track or store user accounts.</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. International Data Transfers</h2>
                <p className="text-gray-700 mb-4">
                  Our servers may be located in different countries to provide optimal performance. When your data is transferred internationally, we ensure:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Adequate protection through appropriate safeguards</li>
                  <li>Compliance with applicable data protection laws</li>
                  <li>The same level of security regardless of location</li>
                  <li>Automatic deletion timeline remains unchanged</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children&apos;s Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our service is not specifically designed for children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has used our service, please contact us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Post the updated policy on this page</li>
                  <li>Update the &ldquo;Last modified&rdquo; date</li>
                  <li>Notify users of significant changes through our website</li>
                  <li>Continue to protect your privacy with the same standards</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                      <p className="text-gray-700">privacy@pdfconverter.com</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Response Time</h3>
                      <p className="text-gray-700">We respond within 48 hours</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Data Protection Officer</h3>
                      <p className="text-gray-700">dpo@pdfconverter.com</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Legal Compliance</h3>
                      <p className="text-gray-700">GDPR, CCPA, and PIPEDA compliant</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer Navigation */}
              <div className="border-t border-gray-200 pt-8 mt-12">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <div className="flex space-x-6">
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                      Terms of Service
                    </Link>
                    <Link href="/cookies" className="text-blue-600 hover:text-blue-700 font-medium">
                      Cookie Policy
                    </Link>
                  </div>
                  <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Back to Converter
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}