import { Metadata } from 'next';
import DefiYieldCalculatorClient from './DefiYieldCalculatorClient';

export const metadata: Metadata = {
  title: 'Free DeFi Yield Calculator Online - Calculate Staking & LP Returns | FlipFileX',
  description: 'Calculate DeFi yields, staking rewards, and liquidity mining returns online for free. Advanced compound interest calculator for cryptocurrency investments with APY analysis.',
  keywords: 'DeFi yield calculator, staking calculator, LP calculator, crypto yield, DeFi returns, compound interest, APY calculator, staking rewards, liquidity mining, yield farming',
  alternates: {
    canonical: '/defi-yield-calculator',
  },
  openGraph: {
    title: 'Free DeFi Yield Calculator Online - Calculate Staking & LP Returns | FlipFileX',
    description: 'Calculate DeFi yields, staking rewards, and liquidity mining returns online for free. Advanced compound interest calculator for cryptocurrency investments.',
    type: 'website',
    url: 'https://flipfilex.com/defi-yield-calculator',
    siteName: 'FlipFileX',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free DeFi Yield Calculator Online - Calculate Staking & LP Returns | FlipFileX',
    description: 'Calculate DeFi yields, staking rewards, and liquidity mining returns online for free. Advanced compound interest calculator for cryptocurrency investments.',
  },
};

export default function DefiYieldCalculatorPage() {
  return <DefiYieldCalculatorClient />;
}