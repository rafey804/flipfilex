'use client';

import { useState } from 'react';

export default function CookieManager() {
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
  );
}