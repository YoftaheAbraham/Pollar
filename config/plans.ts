interface PLANS<T> {
    FREE: T,
    PRO: T,
    ENTERPRISE: T
}

interface PlanInfo {
    name: string,
    monthlyPrice: number,
    annualPrice: number,
    features: {
        totalProjects: number,
        pollsPerProject: number,
        totalPolls: number,
        totalResponses: number,
        prioritySupport: boolean
    },
}

export const PLANS: PLANS<PlanInfo> = {
    FREE: {
        name: "FREE",
        monthlyPrice: 0,
        annualPrice: 0,
        features: {
            totalProjects: 2,
            pollsPerProject: 2,
            totalPolls: 4,
            totalResponses: 1000,
            prioritySupport: false
        },
    },
    PRO: {
        name: "PRO",
        monthlyPrice: 7,
        annualPrice: 5,
        features: {
            totalProjects: 10,
            pollsPerProject: 10,
            totalPolls: 20,
            totalResponses: 10000,
            prioritySupport: true
        },
    },
    ENTERPRISE: {
        name: "ENTERPRISE",
        monthlyPrice: 30,
        annualPrice: 25,
        features: {
            totalProjects: Infinity,
            pollsPerProject: Infinity,
            totalPolls: Infinity,
            totalResponses: Infinity,
            prioritySupport: false
        }
    },
} as const;

export const pricingTiers = [
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
        monthlyPrice: 7,
        annualPrice: 5,
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