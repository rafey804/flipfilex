// Create: components/AdSenseScript.tsx
'use client'

import Script from 'next/script'

export default function AdSenseScript() {
  return (
    <Script
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8694080572387733"
      strategy="lazyOnload"
      crossOrigin="anonymous"
      onLoad={() => {
        console.log('AdSense loaded successfully');
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        } catch (error) {
          console.error('AdSense initialization failed:', error);
        }
      }}
      onError={(error) => {
        console.error('AdSense script failed to load:', error);
      }}
    />
  )
}