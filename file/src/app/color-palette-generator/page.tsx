import { Metadata } from 'next';
import ColorPaletteGeneratorClient from './ColorPaletteGeneratorClient';

export const metadata: Metadata = {
  title: 'Free Color Palette Generator Online - Professional Color Schemes | FlipFileX',
  description: 'Generate beautiful color palettes with professional harmony rules online for free. Support for multiple formats, accessibility checking, and real-time preview for designers.',
  keywords: 'color palette generator, color scheme, harmony, complementary, triadic, analogous, hex, rgb, hsl, cmyk, design tools, color theory, web design',
  alternates: {
    canonical: '/color-palette-generator',
  },
  openGraph: {
    title: 'Free Color Palette Generator Online - Professional Color Schemes | FlipFileX',
    description: 'Generate beautiful color palettes with professional harmony rules online for free. Perfect for designers and developers.',
    type: 'website',
    url: 'https://flipfilex.com/color-palette-generator',
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Color Palette Generator Online - Professional Color Schemes | FlipFileX',
    description: 'Generate beautiful color palettes with professional harmony rules online for free. Perfect for designers and developers.',
  },
};

export default function ColorPaletteGeneratorPage() {
  return <ColorPaletteGeneratorClient />;
}