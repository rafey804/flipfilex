// AdSense Script Component - Updated for modern APIs
'use client'

import Script from 'next/script'

export default function AdSenseScript() {
  return (
    <Script
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8694080572387733"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      async
      onLoad={() => {
        try {
          // Modern AdSense initialization without deprecated APIs
          if (typeof window !== 'undefined') {
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          }
        } catch (error) {
          console.error('AdSense initialization error:', error);
        }
      }}
    />
  )
}