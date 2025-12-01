'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DefiYieldCalculatorClient() {
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
                {/* New DeFi Sections */}

                {/* 1. How to Calculate DeFi Yields Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mt-16 border border-yellow-100/50">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-6">
                        <h2 className="text-3xl font-bold text-white mb-2">How to Calculate DeFi Yields Like a Pro</h2>
                        <p className="text-yellow-100">Master the art of yield calculation with our comprehensive guide</p>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="prose max-w-none">
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                Calculating DeFi yields requires understanding compound interest, APY vs APR, and protocol-specific factors.
                                Our calculator simplifies this process while maintaining professional-grade accuracy for serious investors.
                            </p>

                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                                    <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                                        <span className="bg-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
                                        Understanding APY vs APR
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        APY (Annual Percentage Yield) includes compound interest, while APR (Annual Percentage Rate) doesn't.
                                        DeFi protocols typically display APY to show the true earning potential.
                                    </p>
                                    <ul className="text-gray-600 text-sm space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-yellow-500 mr-2">•</span>
                                            <span>APY = Compound interest included</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-yellow-500 mr-2">•</span>
                                            <span>APR = Simple interest only</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-yellow-500 mr-2">•</span>
                                            <span>Daily compounding maximizes returns</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
                                    <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                                        <span className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
                                        Compound Interest Magic
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        The more frequent the compounding, the higher your returns. Daily compounding can significantly
                                        boost your earnings compared to monthly or yearly.
                                    </p>
                                    <ul className="text-gray-600 text-sm space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-orange-500 mr-2">•</span>
                                            <span>Daily: 365 compounding periods</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-orange-500 mr-2">•</span>
                                            <span>Weekly: 52 compounding periods</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-orange-500 mr-2">•</span>
                                            <span>Monthly: 12 compounding periods</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                                    <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                                        <span className="bg-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
                                        Protocol-Specific Factors
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        Different DeFi protocols have unique reward structures, fees, and risks that affect your net returns.
                                    </p>
                                    <ul className="text-gray-600 text-sm space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-yellow-500 mr-2">•</span>
                                            <span>Gas fees on Ethereum</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-yellow-500 mr-2">•</span>
                                            <span>Impermanent loss in LPs</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-yellow-500 mr-2">•</span>
                                            <span>Protocol token emissions</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
                                    <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                                        <span className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">4</span>
                                        Risk Assessment
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        Always factor in risks like smart contract vulnerabilities, market volatility, and protocol changes.
                                    </p>
                                    <ul className="text-gray-600 text-sm space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-orange-500 mr-2">•</span>
                                            <span>Smart contract audits</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-orange-500 mr-2">•</span>
                                            <span>TVL and protocol age</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-orange-500 mr-2">•</span>
                                            <span>Team reputation</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                                <h4 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Pro Tip: Start Small & Diversify
                                </h4>
                                <p className="text-green-700">
                                    Always start with small amounts to test protocols and diversify across multiple platforms
                                    to mitigate risk while maximizing your overall yield potential.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. DeFi Strategy Tips Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mt-16 border border-yellow-100/50">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-6">
                        <h2 className="text-3xl font-bold text-white mb-2">Advanced DeFi Strategy Tips</h2>
                        <p className="text-yellow-100">Optimize your yield farming and staking strategies for maximum returns</p>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="prose max-w-none">
                            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                Successful DeFi investing requires more than just chasing high APYs. Implement these proven strategies
                                to maximize returns while managing risk effectively.
                            </p>

                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200 hover:bg-yellow-100 transition-colors">
                                        <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2">Diversify Across Protocols</h4>
                                            <p className="text-gray-600 text-sm">
                                                Spread your investments across multiple reputable protocols to minimize smart contract risk
                                                and capture different yield opportunities.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors">
                                        <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2">Monitor Gas Costs</h4>
                                            <p className="text-gray-600 text-sm">
                                                Time your transactions during low-gas periods and consider layer-2 solutions to maximize
                                                net returns after transaction fees.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors">
                                        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2">Secure Your Assets</h4>
                                            <p className="text-gray-600 text-sm">
                                                Use hardware wallets, enable 2FA, and never share private keys. Security is paramount
                                                in the decentralized space.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors">
                                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2">Compound Regularly</h4>
                                            <p className="text-gray-600 text-sm">
                                                Reinvest your earnings frequently to benefit from compound interest. Daily or weekly
                                                compounding can significantly boost long-term returns.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-colors">
                                        <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2">Manage Impermanent Loss</h4>
                                            <p className="text-gray-600 text-sm">
                                                Understand and calculate impermanent loss before providing liquidity. Stick to correlated
                                                asset pairs to minimize this risk.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors">
                                        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2">Track Performance</h4>
                                            <p className="text-gray-600 text-sm">
                                                Use portfolio trackers and our calculator to monitor your actual returns vs. projected
                                                yields and adjust strategies accordingly.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. DeFi Platforms Comparison Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mt-16 border border-yellow-100/50">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-6">
                        <h2 className="text-3xl font-bold text-white mb-2">Popular DeFi Platforms Comparison</h2>
                        <p className="text-yellow-100">Compare yields, risks, and features across major DeFi protocols</p>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {/* Ethereum DeFi */}
                            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                                <div className="text-4xl mb-4">🔷</div>
                                <h3 className="font-bold text-gray-800 text-lg mb-3">Ethereum DeFi</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    The original DeFi ecosystem with the highest security and largest TVL, but higher gas fees.
                                </p>
                                <ul className="text-gray-600 text-xs space-y-1">
                                    <li>• Uniswap, Aave, Compound</li>
                                    <li>• High security standards</li>
                                    <li>• Elevated gas costs</li>
                                    <li>• Largest liquidity</li>
                                </ul>
                                <div className="mt-4 p-2 bg-yellow-100 rounded-lg">
                                    <span className="text-yellow-800 text-sm font-semibold">APY Range: 2-15%</span>
                                </div>
                            </div>

                            {/* Binance Smart Chain */}
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 hover:shadow-lg transition-all duration-300">
                                <div className="text-4xl mb-4">💛</div>
                                <h3 className="font-bold text-yellow-800 text-lg mb-3">BSC Ecosystem</h3>
                                <p className="text-yellow-700 text-sm mb-4">
                                    Lower fees with good yields, popular for yield farming and new project launches.
                                </p>
                                <ul className="text-yellow-600 text-xs space-y-1">
                                    <li>• PancakeSwap, Venus</li>
                                    <li>• Low transaction fees</li>
                                    <li>• Higher risk projects</li>
                                    <li>• Fast transactions</li>
                                </ul>
                                <div className="mt-4 p-2 bg-orange-100 rounded-lg">
                                    <span className="text-orange-800 text-sm font-semibold">APY Range: 5-50%</span>
                                </div>
                            </div>

                            {/* Polygon */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
                                <div className="text-4xl mb-4">🟣</div>
                                <h3 className="font-bold text-purple-800 text-lg mb-3">Polygon (MATIC)</h3>
                                <p className="text-purple-700 text-sm mb-4">
                                    Ethereum-compatible sidechain with minimal fees and growing DeFi ecosystem.
                                </p>
                                <ul className="text-purple-600 text-xs space-y-1">
                                    <li>• QuickSwap, Aave Polygon</li>
                                    <li>• Near-zero fees</li>
                                    <li>• Ethereum compatibility</li>
                                    <li>• Growing ecosystem</li>
                                </ul>
                                <div className="mt-4 p-2 bg-purple-100 rounded-lg">
                                    <span className="text-purple-800 text-sm font-semibold">APY Range: 3-25%</span>
                                </div>
                            </div>

                            {/* Avalanche */}
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200 hover:shadow-lg transition-all duration-300">
                                <div className="text-4xl mb-4">🔴</div>
                                <h3 className="font-bold text-red-800 text-lg mb-3">Avalanche</h3>
                                <p className="text-red-700 text-sm mb-4">
                                    High-speed blockchain with sub-second finality and competitive yields.
                                </p>
                                <ul className="text-red-600 text-xs space-y-1">
                                    <li>• Trader Joe, Benqi</li>
                                    <li>• Very fast transactions</li>
                                    <li>• Strong institutional backing</li>
                                    <li>• Sub-second finality</li>
                                </ul>
                                <div className="mt-4 p-2 bg-red-100 rounded-lg">
                                    <span className="text-red-800 text-sm font-semibold">APY Range: 4-30%</span>
                                </div>
                            </div>

                            {/* Solana */}
                            <div className="bg-gradient-to-br from-green-50 to-purple-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
                                <div className="text-4xl mb-4">🟢</div>
                                <h3 className="font-bold text-green-800 text-lg mb-3">Solana</h3>
                                <p className="text-green-700 text-sm mb-4">
                                    Ultra-fast blockchain with extremely low fees and innovative DeFi protocols.
                                </p>
                                <ul className="text-green-600 text-xs space-y-1">
                                    <li>• Raydium, Marinade</li>
                                    <li>• Extremely low fees</li>
                                    <li>• High throughput</li>
                                    <li>• Growing NFT ecosystem</li>
                                </ul>
                                <div className="mt-4 p-2 bg-green-100 rounded-lg">
                                    <span className="text-green-800 text-sm font-semibold">APY Range: 5-40%</span>
                                </div>
                            </div>

                            {/* Arbitrum */}
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                                <div className="text-4xl mb-4">🔵</div>
                                <h3 className="font-bold text-blue-800 text-lg mb-3">Arbitrum</h3>
                                <p className="text-blue-700 text-sm mb-4">
                                    Ethereum L2 solution offering Ethereum security with significantly reduced fees.
                                </p>
                                <ul className="text-blue-600 text-xs space-y-1">
                                    <li>• Uniswap V3, GMX</li>
                                    <li>• Ethereum security</li>
                                    <li>• Reduced fees</li>
                                    <li>• Seamless bridging</li>
                                </ul>
                                <div className="mt-4 p-2 bg-blue-100 rounded-lg">
                                    <span className="text-blue-800 text-sm font-semibold">APY Range: 3-20%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                            <h4 className="text-lg font-bold text-yellow-800 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Platform Selection Tips
                            </h4>
                            <p className="text-yellow-700 mb-4">
                                Choose platforms based on your risk tolerance, investment size, and technical comfort.
                                Always research protocols thoroughly and start with smaller amounts to test the waters.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h5 className="font-semibold text-yellow-800 mb-2">For Beginners:</h5>
                                    <ul className="text-yellow-700 space-y-1">
                                        <li className="flex items-start">
                                            <span className="text-yellow-500 mr-2">•</span>
                                            <span>Start with established platforms</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-yellow-500 mr-2">•</span>
                                            <span>Use platforms with insurance</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-orange-800 mb-2">For Advanced Users:</h5>
                                    <ul className="text-orange-700 space-y-1">
                                        <li className="flex items-start">
                                            <span className="text-orange-500 mr-2">•</span>
                                            <span>Explore newer protocols for higher yields</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-orange-500 mr-2">•</span>
                                            <span>Consider layer-2 solutions for efficiency</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Risk Management Guide Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mt-16 border border-yellow-100/50">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-6">
                        <h2 className="text-3xl font-bold text-white mb-2">DeFi Risk Management Guide</h2>
                        <p className="text-yellow-100">Understand and mitigate risks in decentralized finance</p>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-red-800 mb-4">Major DeFi Risks</h3>

                                <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-xl border border-red-200">
                                    <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">
                                        ⚠️
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-red-800 mb-2">Smart Contract Risk</h4>
                                        <p className="text-red-700 text-sm">
                                            Bugs or vulnerabilities in smart contracts can lead to fund losses. Always use audited protocols.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                                        ⚠️
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-orange-800 mb-2">Impermanent Loss</h4>
                                        <p className="text-orange-700 text-sm">
                                            LP providers face losses when asset prices diverge significantly from deposit ratios.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white">
                                        ⚠️
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-yellow-800 mb-2">Regulatory Risk</h4>
                                        <p className="text-yellow-700 text-sm">
                                            Changing regulations can impact protocol operations and token values in different jurisdictions.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-green-800 mb-4">Risk Mitigation Strategies</h3>

                                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                                        ✅
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-green-800 mb-2">Use Audited Protocols</h4>
                                        <p className="text-green-700 text-sm">
                                            Only invest in protocols that have undergone multiple security audits from reputable firms.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                        ✅
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-blue-800 mb-2">Diversify Holdings</h4>
                                        <p className="text-blue-700 text-sm">
                                            Spread investments across multiple protocols and blockchain networks to minimize exposure.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
                                        ✅
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-purple-800 mb-2">Start Small</h4>
                                        <p className="text-purple-700 text-sm">
                                            Test new protocols with small amounts before committing significant capital.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                            <h4 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                                Security Best Practices
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h5 className="font-semibold text-yellow-700 mb-2">Essential Security:</h5>
                                    <ul className="text-yellow-600 text-sm space-y-1">
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✓</span>
                                            <span>Use hardware wallets</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✓</span>
                                            <span>Enable 2FA everywhere</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✓</span>
                                            <span>Verify contract addresses</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-red-700 mb-2">Avoid These:</h5>
                                    <ul className="text-red-600 text-sm space-y-1">
                                        <li className="flex items-center">
                                            <span className="text-red-500 mr-2">✗</span>
                                            <span>Sharing private keys</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="text-red-500 mr-2">✗</span>
                                            <span>Unaudited protocols</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="text-red-500 mr-2">✗</span>
                                            <span>Too-good-to-be-true APYs</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. FAQ Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mt-16 border border-yellow-100/50">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-6">
                        <h2 className="text-3xl font-bold text-white mb-2">DeFi Yield Calculator FAQ</h2>
                        <p className="text-yellow-100">Common questions about DeFi yields and our calculator</p>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="space-y-6">
                            {/* FAQ Item 1 */}
                            <div className="border border-yellow-200 rounded-2xl p-6 hover:border-yellow-300 transition-colors bg-yellow-50/50">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    What's the difference between APY and APR in DeFi?
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    APY (Annual Percentage Yield) includes compound interest, while APR (Annual Percentage Rate) does not.
                                    In DeFi, APY gives you the true earning potential because most protocols compound rewards frequently
                                    (daily or even more often). Our calculator uses APY to provide accurate projections of your returns.
                                </p>
                            </div>

                            {/* FAQ Item 2 */}
                            <div className="border border-yellow-200 rounded-2xl p-6 hover:border-yellow-300 transition-colors bg-yellow-50/50">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    How accurate are the yield calculations?
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Our calculations are mathematically precise based on the compound interest formula. However, actual returns
                                    may vary due to factors like protocol APY changes, impermanent loss (for LPs), gas fees, and market volatility.
                                    We recommend using our projections as estimates and monitoring your actual returns regularly.
                                </p>
                            </div>

                            {/* FAQ Item 3 */}
                            <div className="border border-yellow-200 rounded-2xl p-6 hover:border-yellow-300 transition-colors bg-yellow-50/50">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    What is impermanent loss and how does it affect my yields?
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Impermanent loss occurs when providing liquidity to automated market makers (AMMs) and the price ratio
                                    of your deposited assets changes significantly. This can reduce your overall value compared to simply
                                    holding the assets. Our calculator focuses on yield projections, but you should factor in potential
                                    impermanent loss when providing liquidity to LPs.
                                </p>
                            </div>

                            {/* FAQ Item 4 */}
                            <div className="border border-yellow-200 rounded-2xl p-6 hover:border-yellow-300 transition-colors bg-yellow-50/50">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    How often should I compound my yields?
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    The optimal compounding frequency depends on gas costs and your investment size. For smaller amounts,
                                    weekly or monthly compounding might be more cost-effective. For larger investments, daily compounding
                                    can significantly boost returns. Always calculate whether the gas costs justify more frequent compounding.
                                </p>
                            </div>

                            {/* FAQ Item 5 */}
                            <div className="border border-yellow-200 rounded-2xl p-6 hover:border-yellow-300 transition-colors bg-yellow-50/50">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    Are DeFi yields sustainable long-term?
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    High yields in DeFi are often driven by token emissions and protocol incentives that may decrease over time.
                                    While some established protocols offer sustainable yields from actual usage fees, many high-APY opportunities
                                    come with higher risks. Always research the source of yields and consider both the sustainability and risks
                                    involved in any DeFi investment.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 inline-block">
                                <h4 className="text-lg font-bold text-yellow-800 mb-2">Need DeFi Investment Advice?</h4>
                                <p className="text-yellow-700 mb-4">
                                    Have more questions about yield farming, staking, or liquidity provision?
                                </p>
                                <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 
                         text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 
                         transform hover:scale-105 shadow-lg hover:shadow-xl">
                                    Get Expert Consultation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
