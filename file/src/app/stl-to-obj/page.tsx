import { Metadata } from 'next';
import StlToObjClient from './StlToObjClient';

export const metadata: Metadata = {
  title: 'Free STL to OBJ Converter Online - 3D Model Format Converter | FlipFileX',
  description: 'Convert STL files to OBJ format online for free. Perfect for 3D printing, modeling, and cross-platform 3D file compatibility.',
  keywords: 'STL to OBJ, 3D converter, 3D model converter, STL converter, OBJ converter, 3D printing',
  alternates: {
    canonical: '/stl-to-obj',
  },
  openGraph: {
    title: 'Free STL to OBJ Converter Online - 3D Model Format Converter | FlipFileX',
    description: 'Convert STL files to OBJ format online for free. Perfect for 3D printing, modeling, and cross-platform 3D file compatibility.',
    type: 'website',
    url: 'https://flipfilex.com/stl-to-obj',
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free STL to OBJ Converter Online - 3D Model Format Converter | FlipFileX',
    description: 'Convert STL files to OBJ format online for free. Perfect for 3D printing, modeling, and cross-platform 3D file compatibility.',
  },
};

export default function StlToObjPage() {
  return <StlToObjClient />;
}