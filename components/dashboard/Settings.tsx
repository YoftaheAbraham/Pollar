'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiCreditCard, FiCheckCircle, FiArrowRight, FiLoader, FiXCircle, FiMenu, FiBell, FiLogOut } from 'react-icons/fi';
import SideBar from './SideBar';
import Link from 'next/link';

interface Plan {
    id: string;
    name: string;
    price: string;
    features: string[];
    recommended?: boolean;
}

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);


    const plans: Plan[] = [
        {
            id: 'basic',
            name: 'Basic',
            price: '$0',
            features: [
                '5 active projects',
                '100 responses per month',
                'Basic analytics',
                'Email support'
            ]
        },
        {
            id: 'pro',
            name: 'Professional',
            price: '$19',
            features: [
                'Unlimited projects',
                '1000 responses per month',
                'Advanced analytics',
                'Priority support',
                'API access'
            ],
            recommended: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: '$49',
            features: [
                'Unlimited projects',
                'Unlimited responses',
                'Advanced analytics',
                '24/7 support',
                'API access',
                'Custom branding'
            ]
        }
    ];

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '');
            setEmail(session.user.email || '');
            setSelectedPlan('pro'); // Default to pro plan for demo
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setUpdateError('');
        setUpdateSuccess('');

        try {
            const response = await fetch('/api/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            await update({ name, email });
            setUpdateSuccess('Profile updated successfully!');
            setTimeout(() => setUpdateSuccess(''), 3000);
        } catch (error) {
            setUpdateError(error instanceof Error ? error.message : 'Failed to update profile');
            setTimeout(() => setUpdateError(''), 3000);
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePlanChange = async (planId: string) => {
        setIsProcessingPayment(true);
        setSelectedPlan(planId);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            setUpdateSuccess(`Plan upgraded to ${plans.find(p => p.id === planId)?.name}!`);
            setTimeout(() => setUpdateSuccess(''), 3000);
        } catch (error) {
            setUpdateError('Failed to process payment. Please try again.');
            setTimeout(() => setUpdateError(''), 3000);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    return (
        <div className="flex h-screen theme-darker text-gray-100 overflow-hidden">
            <SideBar mobileSidebarOpen={mobileSidebarOpen} setMobileSidebarOpen={setMobileSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="theme-lighter border-b theme-border p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            className="mr-4 text-gray-400 hover:text-white md:hidden"
                            onClick={() => setMobileSidebarOpen(true)}
                        >
                            <FiMenu size={24} />
                        </button>
                        <Link href="/" className="flex items-center group">
                            <h1 className="text-xl font-bold tracking-tighter text-green-500 group-hover:text-green-400 transition-colors duration-300">
                                POLLAR
                            </h1>
                            <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full animate-pulse">
                                PRO
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-white">
                            <FiBell size={20} />
                        </button>
                        <button className="text-gray-400 hover:text-white">
                            <FiLogOut size={20} />
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 theme">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

                        <div className="grid gap-8">
                            {/* Profile Section */}
                            <section className="bg-theme-lighter border theme-border rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <FiUser className="text-green-400" />
                                    Profile Information
                                </h2>

                                <form onSubmit={handleSubmit}>
                                    <div className="grid gap-4 mb-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                                                Name
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-theme-darker border theme-border rounded-sm px-4 py-2 text-white outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-theme-darker border theme-border  rounded-sm px-4 py-2 text-white outline-none"
                                                    required
                                                />
                                                <FiMail className="absolute right-3 top-3 text-gray-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <FiLoader className="animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    Update Profile
                                                </>
                                            )}
                                        </button>

                                        {updateError && (
                                            <div className="flex items-center gap-2 text-red-400">
                                                <FiXCircle />
                                                <span>{updateError}</span>
                                            </div>
                                        )}

                                        {updateSuccess && (
                                            <div className="flex items-center gap-2 text-green-400">
                                                <FiCheckCircle />
                                                <span>{updateSuccess}</span>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </section>

                            {/* Subscription Section */}
                            <section className="bg-theme-lighter border theme-border  rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <FiCreditCard className="text-indigo-400" />
                                    Subscription Plan
                                </h2>

                                <div className="grid md:grid-cols-3 gap-4 mb-8">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={`border theme-border  rounded-sm p-5 transition-all ${plan.recommended
                                                ? ' bg-green-900/10'
                                                : ' hover:border-gray-500'
                                                } ${selectedPlan === plan.id ? 'ring-2 ring-green-500' : ''
                                                }`}
                                        >
                                            {plan.recommended && (
                                                <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                                                    Recommended
                                                </div>
                                            )}

                                            <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                                            <p className="text-2xl font-bold text-white mb-4">{plan.price}<span className="text-sm font-normal text-gray-400">/month</span></p>

                                            <ul className="space-y-2 mb-6">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center gap-2 text-gray-300">
                                                        <FiCheckCircle className="text-green-400" size={14} />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                onClick={() => handlePlanChange(plan.id)}
                                                disabled={isProcessingPayment || selectedPlan === plan.id}
                                                className={`w-full py-2 rounded-md flex items-center justify-center gap-2 transition-colors ${selectedPlan === plan.id
                                                    ? 'bg-green-600 text-white cursor-not-allowed'
                                                    : plan.recommended
                                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                                        : 'bg-theme-darker hover:bg-gray-700 text-white border border-theme-border'
                                                    }`}
                                            >
                                                {isProcessingPayment && selectedPlan === plan.id ? (
                                                    <>
                                                        <FiLoader className="animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : selectedPlan === plan.id ? (
                                                    <>
                                                        <FiCheckCircle />
                                                        Current Plan
                                                    </>
                                                ) : (
                                                    <>
                                                        Upgrade <FiArrowRight />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-theme-darker border theme-border rounded-sm p-4">
                                    <h3 className="text-md font-semibold text-white mb-2">Billing Information</h3>
                                    <p className="text-sm text-gray-400 mb-4">
                                        Your current plan will renew automatically on <span className="text-white">January 1, 2024</span>.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm">
                                            Update Payment Method
                                        </button>
                                        <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md text-sm border border-red-600/30">
                                            Cancel Subscription
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Danger Zone */}
                            <section className="bg-red-900/10 border border-red-900/30 rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Danger Zone</h2>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <h3 className="font-medium text-white">Delete Account</h3>
                                            <p className="text-sm text-gray-400">
                                                Permanently delete your account and all associated data.
                                            </p>
                                        </div>
                                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}