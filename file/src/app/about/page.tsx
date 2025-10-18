import type { Metadata } from 'next';
import AboutUsClient from './AboutUsClient';

export const metadata: Metadata = {
  title: 'About Us - FlipFileX | Our Story & Mission',
  description: 'Learn about FlipFileX\'s mission to provide free, secure, and professional document conversion tools. Meet our team and discover our commitment to user privacy.',
  keywords: 'about PDF converter, document conversion company, team, mission, privacy, security',
  openGraph: {
    title: 'About FlipFileX - Our Story & Mission',
    description: 'Discover how FlipFileX helps millions of users convert documents securely and efficiently.',
  },
  alternates: {
    canonical: 'https://flipfilex.com/about',
  },
};

export default function AboutUsPage() {
  return <AboutUsClient />;
}