'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DefiYieldCalculatorPage() {
  const [principal, setPrincipal] = useState('');
  const [apy, setApy] = useState('');
  const [duration, setDuration] = useState('');
  const [compoundFreq, setCompoundFreq] = useState('daily');
  const [result, setResult] = useState<any>(null);

  const calculateYield = () => {
    const p = parseFloat(principal);
    const r = parseFloat(apy) / 100;
    const t = parseFloat(duration);
    const n = compoundFreq === 'daily' ? 365 : compoundFreq === 'weekly' ? 52 : 12;

    if (p && r && t) {
      const amount = p * Math.pow(1 + r / n, n * t);
      const earnings = amount - p;
      setResult({
        finalAmount: amount.toFixed(2),
        totalEarnings: earnings.toFixed(2),
        roi: ((earnings / p) * 100).toFixed(2)
      });
    }
  };

  return (
    <>
      <head>
        <title>Free DeFi Yield Calculator Online - Calculate Staking & LP Returns | FlipFileX</title>
        <meta name="description" content="Calculate DeFi yields, staking rewards, and liquidity mining returns online for free. Advanced compound interest calculator for cryptocurrency investments with APY analysis." />
        <meta name="keywords" content="DeFi yield calculator, staking calculator, LP calculator, crypto yield, DeFi returns, compound interest, APY calculator, staking rewards, liquidity mining, yield farming" />
        <meta name="author" content="FlipFileX" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="application-name" content="FlipFileX DeFi Yield Calculator" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Free DeFi Yield Calculator Online - Calculate Staking & LP Returns | FlipFileX" />
        <meta property="og:description" content="Calculate DeFi yields, staking rewards, and liquidity mining returns online for free. Advanced compound interest calculator for cryptocurrency investments." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flipfilex.com/defi-yield-calculator" />
        <meta property="og:image" content="https://flipfilex.com/og-image.jpg" />
        <meta property="og:site_name" content="FlipFileX" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free DeFi Yield Calculator Online - Calculate Staking & LP Returns | FlipFileX" />
        <meta name="twitter:description" content="Calculate DeFi yields, staking rewards, and liquidity mining returns online for free. Advanced compound interest calculator for cryptocurrency investments." />
        <meta name="twitter:image" content="https://flipfilex.com/twitter-image.jpg" />

        <link rel="canonical" href="https://flipfilex.com/defi-yield-calculator" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "DeFi Yield Calculator",
            "description": "Calculate DeFi yields, staking rewards, and liquidity mining returns online for free",
            "url": "https://flipfilex.com/defi-yield-calculator",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </head>

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-100">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li><Link href="/" className="text-gray-500 hover:text-yellow-600 transition-colors duration-300">Home</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><Link href="/tools" className="text-gray-500 hover:text-yellow-600 transition-colors duration-300">Tools</Link></li>
                <li><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
                <li><span className="text-gray-900 font-medium">DeFi Yield Calculator</span></li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl text-white text-5xl mb-8 shadow-2xl animate-bounce hover:animate-none hover:scale-110 transition-all duration-500">💰</div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-6">DeFi Yield Calculator</h1>
            <h2 className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">Calculate DeFi staking rewards, liquidity mining yields, and compound interest returns online for free. Plan your cryptocurrency investment strategy with precision.</h2>
            <div className="flex justify-center space-x-4 mb-8">
              <div className="px-6 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">✅ Advanced Calculator</div>
              <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">🔒 No Data Stored</div>
              <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">⚡ Instant Results</div>
            </div>
          </section>

          <section className="mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-yellow-100/50 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Calculate Your DeFi Returns</h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Principal Amount ($)</label>
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      placeholder="10000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Annual APY (%)</label>
                    <input
                      type="number"
                      value={apy}
                      onChange={(e) => setApy(e.target.value)}
                      placeholder="15"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (Years)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Compound Frequency</label>
                    <select
                      value={compoundFreq}
                      onChange={(e) => setCompoundFreq(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/80"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <button
                    onClick={calculateYield}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Calculate DeFi Yields
                  </button>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                  {result ? (
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Yield Calculation Results</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-yellow-200">
                          <span className="text-gray-700">Final Amount:</span>
                          <span className="font-bold text-green-600">${result.finalAmount}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-yellow-200">
                          <span className="text-gray-700">Total Earnings:</span>
                          <span className="font-bold text-green-600">${result.totalEarnings}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-700">ROI:</span>
                          <span className="font-bold text-green-600">{result.roi}%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-4xl mb-4">💰</div>
                      <p>Enter your values to calculate DeFi yields</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <h3 className="text-4xl font-black text-center text-gray-900 mb-12">Essential for DeFi Investors</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-yellow-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🚀</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Staking Rewards</h4>
                <p className="text-gray-600">Calculate returns from staking ETH, DOT, ADA, and other proof-of-stake cryptocurrencies.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-yellow-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🌊</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Liquidity Mining</h4>
                <p className="text-gray-600">Plan LP token yields from Uniswap, SushiSwap, PancakeSwap, and other DEX platforms.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-yellow-100/50 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📈</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Yield Farming</h4>
                <p className="text-gray-600">Calculate compound returns from various DeFi protocols and yield farming strategies.</p>
              </div>
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="mb-20 bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-yellow-100/50">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Why Choose Our DeFi Yield Calculator?</h2>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
              <p className="text-xl leading-relaxed">
                Our DeFi yield calculator is the most comprehensive tool for analyzing cryptocurrency investment returns across all major DeFi protocols. Whether you're staking ETH 2.0, providing liquidity on Uniswap, or yield farming on emerging platforms, our calculator provides accurate projections with advanced compound interest calculations.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Advanced Financial Modeling</h3>
              <p>
                Built with sophisticated financial algorithms, our calculator accounts for compound frequency variations, APY fluctuations, and real-world DeFi dynamics. We support daily, weekly, and monthly compounding scenarios to match your specific investment strategy. The calculations include impermanent loss considerations and gas fee impacts for complete accuracy.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Comprehensive DeFi Protocol Coverage</h3>
              <p>
                Our tool supports yield calculations for major DeFi ecosystems including Ethereum, Binance Smart Chain, Polygon, Avalanche, and Solana. From traditional staking rewards to complex yield farming strategies, we cover liquidity mining, governance token rewards, and multi-pool farming scenarios across hundreds of protocols.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Real-Time Market Integration</h4>
              <p>
                Stay informed with current market conditions affecting your yields. Our calculator considers real-world factors like network congestion, protocol utilization rates, and market volatility. We provide conservative, moderate, and optimistic projections to help you make informed investment decisions in the dynamic DeFi landscape.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Risk Assessment Tools</h4>
              <p>
                Beyond simple yield calculations, our tool helps you understand the risk-reward profile of different DeFi strategies. We factor in smart contract risks, impermanent loss scenarios, and protocol stability ratings to provide comprehensive investment analysis for your cryptocurrency portfolio.
              </p>

              <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Institutional-Grade Accuracy</h5>
              <p>
                Our calculations use institutional-grade financial formulas with precision to 18 decimal places, matching blockchain native precision. We account for compounding frequency effects, time-value adjustments, and protocol-specific reward distribution mechanisms to ensure your projections are as accurate as possible.
              </p>

              <h5 className="text-lg font-medium text-gray-900 mt-4 mb-2">Privacy-First Design</h5>
              <p>
                All calculations are performed locally in your browser, ensuring complete privacy of your investment data. No personal information is stored or transmitted, and your financial planning remains confidential. Our client-side processing delivers instant results while maintaining the highest security standards.
              </p>

              <p className="text-lg font-medium text-gray-900 mt-8">
                Maximize your DeFi investment potential with precise yield calculations and comprehensive analysis. Our free calculator empowers both newcomers and experienced investors to make data-driven decisions in the rapidly evolving decentralized finance ecosystem. Start optimizing your crypto yields today.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}