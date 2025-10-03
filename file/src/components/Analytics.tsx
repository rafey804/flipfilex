'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Types for analytics events
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface ConversionEvent {
  tool: string;
  fileType: string;
  fileSize: number;
  conversionTime: number;
  success: boolean;
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    clarity: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    _hsq: any[];
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);
  const [userId, setUserId] = useState<string>('');
  const [cookieConsent, setCookieConsent] = useState<string | null>(null);

  // Generate user ID without localStorage
  const generateUserId = useCallback((): string => {
    if (typeof window === 'undefined') return '';
    
    // Use sessionStorage instead of localStorage, or generate temporary ID
    let tempUserId = sessionStorage.getItem('temp_analytics_id');
    if (!tempUserId) {
      tempUserId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      try {
        sessionStorage.setItem('temp_analytics_id', tempUserId);
      } catch (e) {
        // Fallback if sessionStorage is blocked
        tempUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      }
    }
    return tempUserId;
  }, []);

  // Initialize user ID
  useEffect(() => {
    setUserId(generateUserId());
  }, [generateUserId]);

  const trackCustomEvent = useCallback((event: AnalyticsEvent) => {
    // Only track to Google Analytics - remove custom endpoint that causes 404s
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_user_id: userId || 'anonymous'
      });
    }

    // Optional: Log to console for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }
  }, [userId]);

  const trackPageView = useCallback((path: string) => {
    // Google Analytics page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: path,
        user_id: userId || 'anonymous'
      });
    }

    // Microsoft Clarity page view (only if Clarity ID is properly set)
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('set', 'page', path);
    }

    console.log('Page view tracked:', path);
  }, [userId]);

  const generateTransactionId = useCallback((): string => {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }, []);

  const setupEventListeners = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Track file uploads
    const handleFileUploadStart = (e: any) => {
      trackCustomEvent({
        action: 'file_upload_start',
        category: 'Conversion',
        label: e.detail.tool,
        value: e.detail.fileSize
      });
    };

    // Track conversion completions
    const handleConversionComplete = (e: any) => {
      const conversionData: ConversionEvent = e.detail;
      
      trackCustomEvent({
        action: 'conversion_complete',
        category: 'Conversion',
        label: conversionData.tool,
        value: conversionData.conversionTime
      });

      // Track conversion funnel step
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          currency: 'USD',
          value: 0, // Free tool
          transaction_id: generateTransactionId(),
          items: [{
            item_id: conversionData.tool,
            item_name: `${conversionData.tool} Conversion`,
            category: 'PDF Tools',
            quantity: 1
          }]
        });
      }
    };

    // Track download events
    const handleFileDownload = (e: any) => {
      trackCustomEvent({
        action: 'file_download',
        category: 'Engagement',
        label: e.detail.tool,
        value: e.detail.fileSize
      });
    };

    // Track errors
    const handleConversionError = (e: any) => {
      trackCustomEvent({
        action: 'conversion_error',
        category: 'Error',
        label: e.detail.error,
        value: 1
      });

      // Track errors in Google Analytics
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: e.detail.error,
          fatal: false
        });
      }
    };

    // Track newsletter signups
    const handleNewsletterSignup = () => {
      trackCustomEvent({
        action: 'newsletter_signup',
        category: 'Engagement',
        label: 'footer_newsletter'
      });
    };

    // Track scroll depth
    let maxScroll = 0;
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        trackCustomEvent({
          action: 'scroll_depth',
          category: 'Engagement',
          label: `${scrollPercent}%`,
          value: scrollPercent
        });
      }
    };

    // Track time on page
    const startTime = Date.now();
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      if (timeOnPage > 10) { // Only track if user spent more than 10 seconds
        trackCustomEvent({
          action: 'time_on_page',
          category: 'Engagement',
          value: timeOnPage
        });
      }
    };

    // Track outbound links
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.hostname !== window.location.hostname) {
        trackCustomEvent({
          action: 'outbound_click',
          category: 'Navigation',
          label: link.href
        });
      }
    };

    // Track feature usage
    const handleFeatureUse = (e: any) => {
      trackCustomEvent({
        action: 'feature_use',
        category: 'Feature',
        label: e.detail.feature
      });
    };

    // Add event listeners
    document.addEventListener('file_upload_start', handleFileUploadStart);
    document.addEventListener('conversion_complete', handleConversionComplete);
    document.addEventListener('file_download', handleFileDownload);
    document.addEventListener('conversion_error', handleConversionError);
    document.addEventListener('newsletter_signup', handleNewsletterSignup);
    document.addEventListener('feature_use', handleFeatureUse);
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Return cleanup function
    return () => {
      document.removeEventListener('file_upload_start', handleFileUploadStart);
      document.removeEventListener('conversion_complete', handleConversionComplete);
      document.removeEventListener('file_download', handleFileDownload);
      document.removeEventListener('conversion_error', handleConversionError);
      document.removeEventListener('newsletter_signup', handleNewsletterSignup);
      document.removeEventListener('feature_use', handleFeatureUse);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', trackScrollDepth);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [trackCustomEvent, generateTransactionId]);

  const initializeAnalytics = useCallback(() => {
    // Google Analytics 4 initialization with correct ID
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-918R7EMM6E', {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        send_page_view: false, // We'll handle this manually
        user_id: userId || 'anonymous'
      });
    }

    // Microsoft Clarity initialization (only if you have actual Clarity ID)
    if (typeof window !== 'undefined' && window.clarity && userId) {
      window.clarity('set', 'user_id', userId);
    }

    // HubSpot tracking (if applicable)
    if (typeof window !== 'undefined' && window._hsq) {
      window._hsq.push(['setPath', pathname]);
    }

    // Custom event listeners for user interactions
    const cleanup = setupEventListeners();
    return cleanup;
  }, [pathname, userId, setupEventListeners]);

  // Check cookie consent without localStorage
  useEffect(() => {
    // Use a more CSP-friendly approach
    try {
      const consent = sessionStorage.getItem('cookie_consent') || 'not_set';
      setCookieConsent(consent);
    } catch (e) {
      setCookieConsent('not_set');
    }
  }, []);

  // Initialize analytics on mount
  useEffect(() => {
    if (!initialized.current && userId) {
      const cleanup = initializeAnalytics();
      initialized.current = true;
      return cleanup;
    }
  }, [initializeAnalytics, userId]);

  // Track page views
  useEffect(() => {
    if (initialized.current && userId) {
      trackPageView(pathname);
    }
  }, [pathname, searchParams, trackPageView, userId]);

  // Performance monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          trackCustomEvent({
            action: 'core_web_vitals',
            category: 'Performance',
            label: 'LCP',
            value: Math.round(entry.startTime)
          });
        }
        
        if (entry.entryType === 'first-input') {
          trackCustomEvent({
            action: 'core_web_vitals',
            category: 'Performance',
            label: 'FID',
            value: Math.round((entry as any).processingStart - entry.startTime)
          });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    } catch (e) {
      console.log('Performance observer not supported');
    }

    // Track page load performance
    const handleLoad = () => {
      setTimeout(() => {
        try {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          if (perfData && perfData.loadEventEnd && perfData.fetchStart) {
            trackCustomEvent({
              action: 'page_load_time',
              category: 'Performance',
              label: pathname,
              value: Math.round(perfData.loadEventEnd - perfData.fetchStart)
            });
          } else {
            const loadTime = performance.now();
            trackCustomEvent({
              action: 'page_load_time',
              category: 'Performance',
              label: pathname,
              value: Math.round(loadTime)
            });
          }
        } catch (e) {
          console.log('Performance measurement failed:', e);
        }
      }, 0);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      try {
        observer.disconnect();
      } catch (e) {
        // Observer may not be initialized
      }
      window.removeEventListener('load', handleLoad);
    };
  }, [pathname, trackCustomEvent]);

  // Error tracking
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackCustomEvent({
        action: 'javascript_error',
        category: 'Error',
        label: event.error?.message || 'Unknown error',
        value: 1
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackCustomEvent({
        action: 'promise_rejection',
        category: 'Error',
        label: event.reason?.toString() || 'Unknown rejection',
        value: 1
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackCustomEvent]);

  // Enhanced tracking for consented users
  useEffect(() => {
    const enableEnhancedTracking = () => {
      // Enable Facebook Pixel if user consented
      if (typeof window !== 'undefined' && window.fbq) {
        try {
          window.fbq('track', 'PageView');
        } catch (e) {
          console.log('Facebook Pixel error:', e);
        }
      }
    };

    if (cookieConsent === 'accepted') {
      enableEnhancedTracking();
    }
  }, [cookieConsent]);

  // Conversion tracking helpers
  const trackConversionStart = useCallback((tool: string, fileType: string, fileSize: number) => {
    const event = new CustomEvent('file_upload_start', {
      detail: { tool, fileType, fileSize }
    });
    document.dispatchEvent(event);
  }, []);

  const trackConversionComplete = useCallback((data: ConversionEvent) => {
    const event = new CustomEvent('conversion_complete', {
      detail: data
    });
    document.dispatchEvent(event);
  }, []);

  const trackDownload = useCallback((tool: string, fileSize: number) => {
    const event = new CustomEvent('file_download', {
      detail: { tool, fileSize }
    });
    document.dispatchEvent(event);
  }, []);

  const trackError = useCallback((error: string, tool?: string) => {
    const event = new CustomEvent('conversion_error', {
      detail: { error, tool }
    });
    document.dispatchEvent(event);
  }, []);

  // Expose tracking functions globally for use in other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).analytics = {
        trackConversionStart,
        trackConversionComplete,
        trackDownload,
        trackError,
        trackCustomEvent
      };
    }
  }, [trackConversionStart, trackConversionComplete, trackDownload, trackError, trackCustomEvent]);

  return null;
}