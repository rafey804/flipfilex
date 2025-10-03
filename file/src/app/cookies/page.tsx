"use client"
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function CookiePolicyPage() {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Always required
    analytics: true,
    marketing: false,
    preferences: true
  });

  const handleCookieToggle = (type: string) => {
    if (type === 'essential') return; // Can't disable essential cookies
    
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev]
    }));
  };

  const saveCookiePreferences = () => {
    // This would normally save to localStorage or send to your backend
    console.log('Cookie preferences saved:', cookieSettings);
    alert('Cookie preferences saved successfully!');
  };

  return (
    <>
      <Head>
        <title>Cookie Policy | PDF Converter - Free Online PDF Tools</title>
        <meta name="description" content="Cookie Policy for PDF Converter. Learn about the cookies we use to improve your experience and how to manage your preferences." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://flipfilex.com/cookies" />
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
                  <span className="text-gray-900 font-medium">Cookie Policy</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white text-2xl mb-6 shadow-lg">
              🍪
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn about the cookies we use, why we use them, and how you can control your cookie preferences.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Cookie Settings Panel */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Manage Your Cookie Preferences
            </h2>
            
            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Required for the website to function properly. These cannot be disabled.
                  </p>
                  <div className="text-xs text-gray-600">
                    Examples: Security tokens, load balancing, basic functionality
                  </div>
                </div>
                <div className="ml-4">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Always On
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Help us understand how visitors use our website so we can improve it.
                  </p>
                  <div className="text-xs text-gray-600">
                    Examples: Google Analytics, page views, user behavior
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleCookieToggle('analytics')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cookieSettings.analytics ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cookieSettings.analytics ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Used to track visitors across websites to display relevant advertisements.
                  </p>
                  <div className="text-xs text-gray-600">
                    Examples: Social media pixels, ad targeting, conversion tracking
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleCookieToggle('marketing')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cookieSettings.marketing ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cookieSettings.marketing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Preference Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Preference Cookies</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Remember your settings and preferences for a better experience.
                  </p>
                  <div className="text-xs text-gray-600">
                    Examples: Language settings, theme preferences, previous choices
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleCookieToggle('preferences')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cookieSettings.preferences ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cookieSettings.preferences ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={saveCookiePreferences}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setCookieSettings({ essential: true, analytics: false, marketing: false, preferences: false })}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Reject All (Except Essential)
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              
              {/* What Are Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are stored on your device when you visit a website. They help websites 
                  remember information about your visit, such as your preferences and actions.
                </p>
                
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">How Cookies Work</h3>
                  <ol className="list-decimal list-inside text-blue-800 space-y-1">
                    <li>You visit our website</li>
                    <li>Your browser downloads small text files</li>
                    <li>These files store information about your visit</li>
                    <li>When you return, we can remember your preferences</li>
                  </ol>
                </div>
              </section>

              {/* Types of Cookies We Use */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Session Cookies</h3>
                    <p className="text-green-800 text-sm">
                      Temporary cookies that are deleted when you close your browser. Used for basic functionality 
                      during your visit.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Persistent Cookies</h3>
                    <p className="text-purple-800 text-sm">
                      Remain on your device for a set period. Used to remember your preferences between visits.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">First-Party vs Third-Party Cookies</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Type</th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Set By</th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 px-4 py-3">First-Party</td>
                        <td className="border border-gray-200 px-4 py-3">Our website directly</td>
                        <td className="border border-gray-200 px-4 py-3">Essential functionality, user preferences</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3">Third-Party</td>
                        <td className="border border-gray-200 px-4 py-3">External services (Analytics, Ads)</td>
                        <td className="border border-gray-200 px-4 py-3">Analytics, advertising, social media</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Specific Cookies We Use */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Specific Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Essential Cookies</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-2 font-medium">Cookie Name</th>
                            <th className="text-left p-2 font-medium">Purpose</th>
                            <th className="text-left p-2 font-medium">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 font-mono">session_id</td>
                            <td className="p-2">Maintains your session during file conversion</td>
                            <td className="p-2">Session</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="p-2 font-mono">csrf_token</td>
                            <td className="p-2">Security protection against malicious requests</td>
                            <td className="p-2">Session</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-mono">load_balancer</td>
                            <td className="p-2">Routes requests to the optimal server</td>
                            <td className="p-2">Session</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Analytics Cookies</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-2 font-medium">Cookie Name</th>
                            <th className="text-left p-2 font-medium">Purpose</th>
                            <th className="text-left p-2 font-medium">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 font-mono">_ga</td>
                            <td className="p-2">Google Analytics - distinguishes users</td>
                            <td className="p-2">2 years</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="p-2 font-mono">_ga_*</td>
                            <td className="p-2">Google Analytics - session information</td>
                            <td className="p-2">2 years</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-mono">_gid</td>
                            <td className="p-2">Google Analytics - distinguishes users</td>
                            <td className="p-2">24 hours</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Preference Cookies</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-2 font-medium">Cookie Name</th>
                            <th className="text-left p-2 font-medium">Purpose</th>
                            <th className="text-left p-2 font-medium">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 font-mono">cookie_preferences</td>
                            <td className="p-2">Remembers your cookie consent choices</td>
                            <td className="p-2">1 year</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="p-2 font-mono">theme_preference</td>
                            <td className="p-2">Saves your light/dark mode preference</td>
                            <td className="p-2">1 year</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-mono">language</td>
                            <td className="p-2">Remembers your language selection</td>
                            <td className="p-2">1 year</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>

              {/* Third-Party Services */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-3">Google Analytics</h3>
                    <p className="text-yellow-800 text-sm mb-3">
                      We use Google Analytics to understand how visitors use our website.
                    </p>
                    <ul className="text-yellow-800 text-sm space-y-1">
                      <li>• Tracks page views and user behavior</li>
                      <li>• Helps us improve website performance</li>
                      <li>• Data is anonymized and aggregated</li>
                    </ul>
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" 
                       className="text-yellow-700 hover:text-yellow-900 text-sm underline mt-2 inline-block">
                      Google Privacy Policy →
                    </a>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Microsoft Clarity</h3>
                    <p className="text-blue-800 text-sm mb-3">
                      Provides heatmaps and session recordings to improve user experience.
                    </p>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Records anonymous user sessions</li>
                      <li>• Shows how users interact with pages</li>
                      <li>• Helps identify usability issues</li>
                    </ul>
                    <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-700 hover:text-blue-900 text-sm underline mt-2 inline-block">
                      Microsoft Privacy Policy →
                    </a>
                  </div>
                </div>
              </section>

              {/* Managing Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Manage Cookies</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Browser Settings</h3>
                <p className="text-gray-700 mb-4">
                  You can control cookies through your browser settings. Here&apos;s how to manage cookies in popular browsers:
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🌐</div>
                    <h4 className="font-semibold mb-2">Chrome</h4>
                    <p className="text-sm text-gray-600">Settings → Privacy and Security → Cookies</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🦊</div>
                    <h4 className="font-semibold mb-2">Firefox</h4>
                    <p className="text-sm text-gray-600">Options → Privacy & Security → Cookies</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🧭</div>
                    <h4 className="font-semibold mb-2">Safari</h4>
                    <p className="text-sm text-gray-600">Preferences → Privacy → Cookies</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">📱</div>
                    <h4 className="font-semibold mb-2">Edge</h4>
                    <p className="text-sm text-gray-600">Settings → Privacy → Cookies</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookie Management Options</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 text-green-600 rounded-full p-1 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Accept All Cookies</h4>
                      <p className="text-gray-600 text-sm">Allow all cookies for the best user experience</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Customize Settings</h4>
                      <p className="text-gray-600 text-sm">Choose which types of cookies to allow</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-100 text-red-600 rounded-full p-1 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Block All Non-Essential</h4>
                      <p className="text-gray-600 text-sm">Only allow cookies required for basic functionality</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Impact of Disabling Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Impact of Disabling Cookies</h2>
                
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">What Happens When You Disable Cookies</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">Essential Cookies Disabled:</h4>
                      <ul className="text-amber-700 text-sm space-y-1">
                        <li>• Website may not function properly</li>
                        <li>• Security features may be compromised</li>
                        <li>• Unable to maintain session state</li>
                        <li>• Some features may become unavailable</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">Non-Essential Cookies Disabled:</h4>
                      <ul className="text-amber-700 text-sm space-y-1">
                        <li>• Cannot remember your preferences</li>
                        <li>• Analytics data won&apos;t be collected</li>
                        <li>• May see less relevant content</li>
                        <li>• Website experience may be generic</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Updates to Cookie Policy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Cookie Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. When we do:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>We will post the updated policy on this page</li>
                  <li>We will update the &quot;Last updated&quot; date at the top</li>
                  <li>We will notify users of significant changes through our website</li>
                  <li>We will continue to protect your privacy with the same standards</li>
                </ul>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Cookies</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Privacy Team</h3>
                      <p className="text-gray-700">cookies@pdfconverter.com</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Response Time</h3>
                      <p className="text-gray-700">Within 48 hours</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Data Protection Officer</h3>
                      <p className="text-gray-700">dpo@pdfconverter.com</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Opt-Out Support</h3>
                      <p className="text-gray-700">We can help you manage your preferences</p>
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
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                      Terms of Service
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