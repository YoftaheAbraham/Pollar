'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const PricingPage = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
    const [hoveredTier, setHoveredTier] = useState<string | null>(null)

    const pricingTiers = [
        {
            name: 'Starter',
            description: 'For individuals and casual users',
            monthlyPrice: 0,
            annualPrice: 0,
            features: [
                '5 active polls at a time',
                'Basic analytics',
                '200 votes per poll',
                'Public polls only',
                'Standard support'
            ],
            cta: 'Get Started',
            popular: false
        },
        {
            name: 'Pro',
            description: 'For content creators and professionals',
            monthlyPrice: 5,
            annualPrice: 4,
            features: [
                '20 active polls',
                'Advanced analytics',
                '2,000 votes per poll',
                'Private polls',
                'Custom branding',
                'Priority support',
                'API access'
            ],
            cta: 'Go Pro',
            popular: true
        },
        {
            name: 'Enterprise',
            description: 'For teams and businesses',
            monthlyPrice: 25,
            annualPrice: 20,
            features: [
                'Everything in Pro',
                '100 active polls',
                'Team collaboration',
                '20,000 votes per poll',
                'White-label options',
                'Dedicated account manager',
                'SLA guarantees',
                'Custom integrations',
                'IP - Tracking'
            ],
            cta: 'Contact Us',
            popular: false
        }
    ]

    return (
        <div className="min-h-screen bg-black text-white pt-10">
            <main className="container mx-auto px-4 py-16">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, transparent pricing</h1>
                    <p className="text-xl text-white/80 mb-8">
                        Choose the plan that fits your needs. Scale up as your audience grows.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center bg-white/10 rounded-full p-1 mb-12">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-white/80 hover:text-white'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`px-6 py-2 rounded-full text-sm font-medium ${billingCycle === 'annual' ? 'bg-white text-black' : 'text-white/80 hover:text-white'}`}
                        >
                            Annual (20% off)
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {pricingTiers.map((tier) => (
                        <div
                            key={tier.name}
                            onMouseEnter={() => setHoveredTier(tier.name)}
                            onMouseLeave={() => setHoveredTier(null)}
                            className={`relative border rounded-xl overflow-hidden transition-all duration-300 ${tier.popular ? 'border-white/30' : 'border-white/10'} ${hoveredTier === tier.name ? 'transform scale-[1.02] shadow-lg' : ''}`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 right-0 bg-white text-black px-4 py-1 text-xs font-bold rounded-bl-lg">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="p-8 flex flex-col justify-between">
                                <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
                                <p className="text-white/60 mb-6">{tier.description}</p>

                                <div className="mb-8">
                                    <span className="text-4xl font-bold">
                                        ${billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice}
                                    </span>
                                    <span className="text-white/60">/{billingCycle === 'annual' ? 'mo' : 'mo'}</span>
                                    {billingCycle === 'annual' && tier.annualPrice > 0 && (
                                        <div className="text-sm text-white/60 mt-1">
                                            Billed annually (${tier.annualPrice * 12})
                                        </div>
                                    )}
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <svg className="h-5 w-5 text-white mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full py-3 rounded-md font-medium transition-colors ${tier.popular ? 'bg-white text-black hover:bg-white/90' : 'bg-white/10 hover:bg-white/20'}`}
                                >
                                    {tier.cta}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="max-w-3xl mx-auto mt-24">
                    <h2 className="text-3xl font-bold mb-8 text-center">Frequently asked questions</h2>
                    <div className="space-y-4">
                        {[
                            {
                                question: "Can I change plans later?",
                                answer: "Yes, you can upgrade or downgrade your plan at any time."
                            },
                            {
                                question: "Do you offer discounts for non-profits?",
                                answer: "We offer 50% off for registered non-profit organizations. Contact us for verification."
                            },
                            {
                                question: "What payment methods do you accept?",
                                answer: "We accept all major credit cards, PayPal, and in some cases, cryptocurrency."
                            },
                            {
                                question: "Is there a limit on poll responses?",
                                answer: "Each tier has different limits. Free tier allows 100 votes per poll, Pro allows 1,000, and Enterprise allows 10,000."
                            }
                        ].map((item, index) => (
                            <div key={index} className="border-b border-white/10 pb-4">
                                <button className="flex justify-between items-center w-full text-left">
                                    <h3 className="text-lg font-medium">{item.question}</h3>
                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <p className="mt-2 text-white/60">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer CTA */}
            <div className="bg-white/5 border-t border-white/10 mt-16 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to engage your audience?</h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Start creating powerful polls today with Pollar's real-time analytics.
                    </p>
                    <button className="px-8 py-3 bg-white text-black rounded-lg text-lg font-medium hover:bg-white/90 transition">
                        Get Started - It's Free
                    </button>
                </div>
            </div>
            
        </div>
    )
}

export default PricingPage