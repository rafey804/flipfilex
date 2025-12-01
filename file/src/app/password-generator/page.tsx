import { Metadata } from 'next';
import PasswordGeneratorClient from './PasswordGeneratorClient';

export const metadata: Metadata = {
  title: 'Free Password Generator - Create Strong & Secure Passwords Online',
  description: 'Generate ultra-secure random passwords instantly with our free password generator. Create strong passwords with uppercase, lowercase, numbers & symbols. Customizable length up to 64 characters. No registration required.',
  keywords: 'password generator, random password generator, strong password generator, secure password creator, password maker, generate password online, create strong password, password generator tool, free password generator, complex password generator, unique password generator, random password creator, secure password maker, password strength checker, password security tool',
  authors: [{ name: 'FlipFileX' }],
  openGraph: {
    type: 'website',
    url: 'https://flipfilex.com/password-generator',
    title: 'Free Secure Password Generator - Create Strong Passwords Instantly',
    description: 'Generate ultra-secure, cryptographically random passwords with customizable options. Protect your accounts with military-grade password security. Free, instant, no registration.',
    images: [
      {
        url: 'https://flipfilex.com/og-password-generator.png',
        width: 1200,
        height: 630,
        alt: 'Secure Password Generator Tool',
      },
    ],
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    url: 'https://flipfilex.com/password-generator',
    title: 'Free Secure Password Generator | Create Strong Passwords',
    description: 'Generate ultra-secure random passwords with customizable options. Military-grade security, instant generation.',
    images: ['https://flipfilex.com/og-password-generator.png'],
    creator: '@flipfilex',
  },
  alternates: {
    canonical: 'https://flipfilex.com/password-generator',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function PasswordGeneratorPage() {
  return <PasswordGeneratorClient />;
}