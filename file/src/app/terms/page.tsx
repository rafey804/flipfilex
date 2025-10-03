import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <>
      <Head>
        <title>Terms of Service | PDF Converter - Free Online PDF Tools</title>
        <meta name="description" content="Terms of Service for PDF Converter. Understand your rights and responsibilities when using our free PDF conversion tools." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://flipfilex.com/terms" />
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
                  <span className="text-gray-900 font-medium">Terms of Service</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white text-2xl mb-6 shadow-lg">
              📋
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using our PDF conversion services. By using our service, you agree to these terms.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              
              {/* Quick Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mb-8">
                <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Terms Summary
                </h2>
                <ul className="text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Our service is free to use for personal and commercial purposes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>You retain full ownership of your uploaded files</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>You must not upload illegal, malicious, or copyrighted content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Service is provided &ldquo;as is&rdquo; without warranties</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>We may modify these terms with notice</span>
                  </li>
                </ul>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing or using PDF Converter (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). 
                  If you disagree with any part of these terms, you may not access the Service.
                </p>
                <p className="text-gray-700 mb-4">
                  These Terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                
                <div className="bg-gray-50 rounded-xl p-6 mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">What We Provide</h3>
                  <p className="text-gray-700 mb-3">
                    PDF Converter is a free online service that provides document conversion tools including:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>PDF to Word conversion</li>
                    <li>Word to PDF conversion</li>
                    <li>PDF merging and combining</li>
                    <li>PDF to images conversion</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Availability</h3>
                  <p className="text-gray-700">
                    We strive to provide reliable service but do not guarantee 100% uptime. The Service may be temporarily 
                    unavailable due to maintenance, updates, or technical issues.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts and Registration</h2>
                <p className="text-gray-700 mb-4">
                  No registration or account creation is required to use our Service. You can use all features anonymously 
                  without providing personal information.
                </p>
                <p className="text-gray-700 mb-4">
                  If we introduce user accounts in the future, additional terms may apply.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-green-600">✓ Permitted Uses</h3>
                <div className="bg-green-50 rounded-xl p-6 mb-4 border border-green-200">
                  <ul className="list-disc list-inside text-green-800 space-y-1">
                    <li>Converting your own documents</li>
                    <li>Converting documents you have permission to modify</li>
                    <li>Personal, educational, and commercial use</li>
                    <li>Converting public domain documents</li>
                    <li>Processing documents for legitimate business purposes</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-red-600">✗ Prohibited Uses</h3>
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <p className="text-red-800 mb-3">You may not use our Service to:</p>
                  <ul className="list-disc list-inside text-red-800 space-y-1">
                    <li>Upload or convert copyrighted material without permission</li>
                    <li>Process illegal, harmful, or malicious content</li>
                    <li>Upload files containing viruses, malware, or malicious code</li>
                    <li>Attempt to reverse engineer or circumvent our security measures</li>
                    <li>Use automated tools to overload our servers</li>
                    <li>Upload personal data of others without consent</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. File Upload and Processing</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">File Ownership</h3>
                    <p className="text-blue-800 text-sm">
                      You retain all rights, title, and ownership of files you upload. We do not claim any ownership over your content.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Processing License</h3>
                    <p className="text-purple-800 text-sm">
                      By uploading files, you grant us a temporary license to process them for conversion purposes only.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">File Limitations</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Maximum file size: 100MB per file</li>
                  <li>Supported formats: PDF, DOCX, DOC</li>
                  <li>Files must not be password-protected</li>
                  <li>Files must not contain malicious code</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatic Deletion</h3>
                <p className="text-gray-700 mb-4">
                  All uploaded files and converted outputs are automatically deleted from our servers within 1 hour of upload. 
                  We do not maintain backups or copies of your files.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Content</h3>
                <p className="text-gray-700 mb-4">
                  You are solely responsible for ensuring you have the right to upload and convert any files you submit to our Service. 
                  This includes:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Copyright ownership or proper licensing</li>
                  <li>Permission from copyright holders if applicable</li>
                  <li>Compliance with fair use guidelines</li>
                  <li>Respect for intellectual property rights</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Service</h3>
                <p className="text-gray-700 mb-4">
                  The PDF Converter service, including our website, software, algorithms, and user interface, is protected by 
                  intellectual property laws. You may not:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Copy, modify, or reverse engineer our software</li>
                  <li>Create derivative works based on our service</li>
                  <li>Use our service to create competing products</li>
                  <li>Remove or modify copyright notices</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Our data handling practices are detailed in our Privacy Policy, which is 
                  incorporated into these Terms by reference.
                </p>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Key Privacy Points</h3>
                  <ul className="text-green-800 space-y-1">
                    <li>• Files are automatically deleted within 1 hour</li>
                    <li>• We never access or read your document content</li>
                    <li>• No personal information is required to use the service</li>
                    <li>• All transfers are encrypted with SSL</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Service Availability and Modifications</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Changes</h3>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify, suspend, or discontinue any part of our Service at any time. We may:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Add new features or conversion types</li>
                  <li>Modify existing functionality</li>
                  <li>Change file size limits or supported formats</li>
                  <li>Implement usage restrictions if necessary</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Maintenance and Downtime</h3>
                <p className="text-gray-700 mb-4">
                  We may temporarily suspend the Service for maintenance, updates, or technical issues. We will try to 
                  provide advance notice when possible.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers and Limitation of Liability</h2>
                
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 mb-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Service Disclaimer</h3>
                  <p className="text-yellow-800 text-sm">
                    THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, 
                    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, 
                    FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">No Warranty on Conversions</h3>
                <p className="text-gray-700 mb-4">
                  While we strive for accurate conversions, we cannot guarantee:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Perfect formatting preservation in all cases</li>
                  <li>Successful conversion of all file types</li>
                  <li>100% accuracy of text extraction</li>
                  <li>Compatibility with all software versions</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Limitation of Liability</h3>
                <p className="text-gray-700 mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO 
                  LOSS OF DATA, PROFITS, OR BUSINESS INTERRUPTION.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. User Responsibilities</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">You Are Responsible For:</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Ensuring you have rights to convert uploaded files</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Backing up important documents before conversion</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Reviewing converted files for accuracy</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Complying with applicable laws and regulations</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">We Are Not Responsible For:</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>Loss of data due to technical issues</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>Copyright violations in your uploaded content</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>Formatting issues in converted documents</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>Decisions made based on converted content</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Termination by You</h3>
                <p className="text-gray-700 mb-4">
                  You may stop using our Service at any time. Since no account registration is required, 
                  simply discontinue use of the website.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Termination by Us</h3>
                <p className="text-gray-700 mb-4">
                  We may restrict or terminate access to our Service if you:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Violate these Terms of Service</li>
                  <li>Engage in prohibited activities</li>
                  <li>Attempt to harm our service or other users</li>
                  <li>Use automated tools to overload our servers</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law and Disputes</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Governing Law</h3>
                <p className="text-gray-700 mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
                  without regard to its conflict of law provisions.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Dispute Resolution</h3>
                <p className="text-gray-700 mb-4">
                  Any disputes arising from these Terms or your use of the Service will be resolved through:
                </p>
                <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">
                  <li>Good faith negotiation</li>
                  <li>Mediation if negotiation fails</li>
                  <li>Binding arbitration as a last resort</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We may update these Terms from time to time. When we do:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>We will post the updated Terms on this page</li>
                  <li>We will update the &ldquo;Last updated&rdquo; date</li>
                  <li>We will provide notice of significant changes</li>
                  <li>Your continued use constitutes acceptance of new terms</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  If you disagree with updated Terms, you should stop using our Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">General Inquiries</h3>
                      <p className="text-gray-700">support@pdfconverter.com</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Legal Department</h3>
                      <p className="text-gray-700">legal@pdfconverter.com</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Response Time</h3>
                      <p className="text-gray-700">Within 48 hours</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Business Hours</h3>
                      <p className="text-gray-700">Monday - Friday, 9 AM - 5 PM EST</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer Navigation */}
              <div className="border-t border-gray-200 pt-8 mt-12">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <div className="flex space-x-6">
                    <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-medium">
                      Privacy Policy
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