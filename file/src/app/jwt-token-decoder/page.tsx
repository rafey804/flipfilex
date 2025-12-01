import { Metadata } from 'next';
import JwtTokenDecoderClient from './JwtTokenDecoderClient';

export const metadata: Metadata = {
  title: 'Free JWT Token Decoder Online - Decode JSON Web Tokens | FlipFileX',
  description: 'Decode and analyze JWT tokens online for free. View header, payload, and signature of JSON Web Tokens for debugging, development, and security analysis.',
  keywords: 'JWT decoder, JSON Web Token decoder, JWT analyzer, token decoder, JWT debugger, authentication, security analysis, API development, OAuth tokens',
  alternates: {
    canonical: '/jwt-token-decoder',
  },
  openGraph: {
    title: 'Free JWT Token Decoder Online - Decode JSON Web Tokens | FlipFileX',
    description: 'Decode and analyze JWT tokens online for free. View header, payload, and signature of JSON Web Tokens for debugging and development.',
    type: 'website',
    url: 'https://flipfilex.com/jwt-token-decoder',
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free JWT Token Decoder Online - Decode JSON Web Tokens | FlipFileX',
    description: 'Decode and analyze JWT tokens online for free. View header, payload, and signature for debugging and development.',
  },
};

export default function JwtTokenDecoderPage() {
  return <JwtTokenDecoderClient />;
}