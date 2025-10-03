'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface URLRedirectProps {
  shortCode: string;
}

export default function URLRedirect({ shortCode }: URLRedirectProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [originalUrl, setOriginalUrl] = useState('');

  useEffect(() => {
    // ✅ FIXED: Check if window is defined first
    if (typeof window === 'undefined') {
      setError(true);
      setLoading(false);
      return;
    }

    // ✅ FIXED: Safe localStorage access
    try {
      const storedUrls = window.localStorage.getItem('shortenedUrls');
      if (storedUrls) {
        const urls = JSON.parse(storedUrls);
        const foundUrl = urls.find((url: any) =>
          url.shortened.endsWith(`/${shortCode}`)
        );

        if (foundUrl) {
          setOriginalUrl(foundUrl.original);

          // Update click count
          const updatedUrls = urls.map((url: any) => {
            if (url.shortened.endsWith(`/${shortCode}`)) {
              return { ...url, clicks: (url.clicks || 0) + 1 };
            }
            return url;
          });
          window.localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));

          // Start countdown
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                window.location.href = foundUrl.original;
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          setLoading(false);
          return () => clearInterval(timer);
        }
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }

    // If URL not found
    setError(true);
    setLoading(false);
  }, [shortCode]);

  // Rest of your component remains same...
  const handleRedirectNow = () => {
    if (originalUrl) {
      window.location.href = originalUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Looking up your URL...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-6">🔗</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Link Not Found</h1>
          <p className="text-gray-600 mb-8">
            This shortened URL doesn't exist or may have expired.
          </p>
          <Link
            href="/url-shortener"
            className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            <span className="mr-2">🔗</span>
            Create New Short URL
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 p-8">
          <div className="text-6xl mb-6">🚀</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Redirecting...</h1>
          <p className="text-gray-600 mb-6">
            You'll be redirected to your destination in <span className="font-bold text-emerald-600">{countdown}</span> seconds.
          </p>

          <div className="bg-emerald-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Destination:</p>
            <p className="font-mono text-emerald-700 break-all">{originalUrl}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRedirectNow}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center"
            >
              <span className="mr-2">⚡</span>
              Go Now
            </button>
            <Link
              href="/url-shortener"
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center"
            >
              <span className="mr-2">🔗</span>
              Create New Link
            </Link>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Powered by FlipFileX URL Shortener</p>
          </div>
        </div>
      </div>
    </div>
  );
}