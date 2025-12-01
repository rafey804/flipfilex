import { Metadata } from 'next';
import Base64EncoderDecoderClient from './Base64EncoderDecoderClient';

export const metadata: Metadata = {
  title: 'Free Base64 Encoder & Decoder Online - Encode Decode Base64 Text & Files',
  description: 'Encode and decode Base64 text and files instantly. Free online Base64 encoder/decoder tool. Convert text to Base64, decode Base64 strings. Fast, secure & easy to use.',
  keywords: 'base64 encoder, base64 decoder, encode base64, decode base64, base64 converter, base64 tool online, text to base64, base64 to text, file to base64',
  alternates: {
    canonical: '/base64-encoder-decoder',
  },
  openGraph: {
    title: 'Free Base64 Encoder & Decoder Online Tool',
    description: 'Encode and decode Base64 text and files instantly. Free, fast & secure Base64 converter.',
    type: 'website',
    url: 'https://flipfilex.com/base64-encoder-decoder',
    image: 'https://flipfilex.com/og-base64.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Base64 Encoder & Decoder',
    description: 'Encode and decode Base64 text and files instantly.',
    image: 'https://flipfilex.com/og-base64.png',
  },
};

export default function Base64EncoderDecoderPage() {
  return <Base64EncoderDecoderClient />;
}