import { Metadata } from 'next';
import ResumeBuilderClient from './ResumeBuilderClient';

export const metadata: Metadata = {
  title: 'Free Resume Builder - Create Professional Resumes Online | FlipFileX',
  description: 'Build professional resumes online for free. AI-powered suggestions, ATS-friendly templates, real-time preview. Download as PDF instantly. No sign-up required. Land your dream job today!',
  keywords: [
    'resume builder',
    'free resume maker',
    'online resume creator',
    'professional resume builder',
    'resume builder free',
    'cv maker online',
    'resume template free',
    'ats resume builder',
    'modern resume builder',
    'resume generator',
    'how to make a resume',
    'best free resume builder',
    'resume creator online',
    'pdf resume maker',
    'job resume builder',
    'ai resume builder',
    'resume builder no sign up',
    'instant resume creator',
    'professional cv builder',
    'resume download pdf free'
  ],
  alternates: {
    canonical: 'https://flipfilex.com/resume-builder',
  },
  openGraph: {
    title: 'Free Resume Builder - Create Professional Resumes Online',
    description: 'Build ATS-friendly resumes with AI assistance. Professional templates, real-time preview. Download as PDF instantly.',
    url: 'https://flipfilex.com/resume-builder',
    siteName: 'FlipFileX',
    type: 'website',
    images: [
      {
        url: 'https://flipfilex.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Resume Builder - FlipFileX',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder - Create Professional Resumes',
    description: 'Build professional resumes with ATS-friendly templates. Download as PDF for free.',
    images: ['https://flipfilex.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ResumeBuilderPage() {
  return <ResumeBuilderClient />;
}
