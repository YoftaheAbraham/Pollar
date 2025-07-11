'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiCreditCard, FiCheckCircle, FiArrowRight, FiLoader, FiXCircle, FiMenu, FiBell, FiLogOut, FiShield, FiLock, FiDatabase } from 'react-icons/fi';
import SideBar from './SideBar';
import Link from 'next/link';
import { PLANS } from '@/config/plans';

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const currentPlan = session?.user?.plan as keyof typeof PLANS || 'FREE';

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '');
            setEmail(session.user.email || '');
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

    const handlePlanChange = async (plan: keyof typeof PLANS) => {
        setIsProcessingPayment(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            setUpdateSuccess(`Plan upgraded to ${plan}!`);
            setTimeout(() => setUpdateSuccess(''), 3000);
        } catch (error) {
            setUpdateError('Failed to process payment. Please try again.');
            setTimeout(() => setUpdateError(''), 3000);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const getPlanColor = (plan: string) => {
        switch (plan) {
            case 'ENTERPRISE': return 'purple';
            case 'PRO': return 'blue';
            default: return 'green';
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
                            <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                currentPlan === 'ENTERPRISE' ? 'bg-purple-500/20 text-purple-400' :
                                currentPlan === 'PRO' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-green-500/20 text-green-400'
                            }`}>
                                {currentPlan}
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
                    <div className="w-full max-w-5xl mx-auto">
                        <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

                        <div className="grid gap-8">
                            {/* Profile Section */}
                            <section className="bg-theme-lighter border theme-border rounded-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-${getPlanColor(currentPlan)}-500/10 text-${getPlanColor(currentPlan)}-400`}>
                                            <FiUser size={20} />
                                        </div>
                                        Profile Information
                                    </h2>
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        currentPlan === 'ENTERPRISE' ? 'bg-purple-900/30 text-purple-400' :
                                        currentPlan === 'PRO' ? 'bg-blue-900/30 text-blue-400' :
                                        'bg-green-900/30 text-green-400'
                                    }`}>
                                        {currentPlan} Plan
                                    </span>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                                                Name
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-theme-darker border theme-border rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-green-500/50"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={email}
                                                    disabled
                                                    className="w-full text-gray-500 bg-theme-darker border theme-border rounded-lg px-4 py-3 cursor-not-allowed outline-none"
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
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-sm flex items-center gap-2 transition-colors font-medium"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <FiLoader className="animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                'Update Profile'
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
                            <section className="bg-theme-lighter border theme-border rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                        <FiCreditCard size={20} />
                                    </div>
                                    Plan Upgrade
                                </h2>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map((planKey) => {
                                        const plan = PLANS[planKey];
                                        const isCurrentPlan = currentPlan === planKey;
                                        const isHigherPlan = 
                                            (currentPlan === 'FREE' && (planKey === 'PRO' || planKey === 'ENTERPRISE')) ||
                                            (currentPlan === 'PRO' && planKey === 'ENTERPRISE');

                                        return (
                                            <div
                                                key={planKey}
                                                className={`border rounded-xl p-6 transition-all relative overflow-hidden ${
                                                    isCurrentPlan 
                                                        ? `ring-2 ring-${getPlanColor(planKey)}-500 bg-${getPlanColor(planKey)}-500/5`
                                                        : 'theme-border hover:border-gray-500'
                                                }`}
                                            >
                                                {isCurrentPlan && (
                                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                                        Current Plan
                                                    </div>
                                                )}

                                                <h3 className="text-lg font-bold text-white mb-2">{planKey}</h3>
                                                <p className="text-3xl font-bold mb-4">
                                                    ${plan.monthlyPrice}
                                                    <span className="text-sm font-normal text-gray-400 ml-1">/month</span>
                                                </p>

                                                <ul className="space-y-3 mb-6">
                                                    {Object.entries(plan.features).map(([key, value]) => (
                                                        <li key={key} className="flex items-start gap-3 text-gray-300">
                                                            <FiCheckCircle className={`flex-shrink-0 mt-1 ${
                                                                isCurrentPlan ? `text-${getPlanColor(planKey)}-400` : 'text-gray-500'
                                                            }`} />
                                                            <span>
                                                                {typeof value === 'number' ? (
                                                                    <span className="font-medium">{value.toLocaleString()}</span>
                                                                ) : (
                                                                    <span className="font-medium">{value}</span>
                                                                )} {key.replace(/([A-Z])/g, ' $1').replace('total', '').trim()}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <button
                                                    onClick={() => handlePlanChange(planKey)}
                                                    disabled={isProcessingPayment || isCurrentPlan || !isHigherPlan}
                                                    className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium ${
                                                        isCurrentPlan
                                                            ? `bg-${getPlanColor(planKey)}-600 text-white cursor-not-allowed`
                                                            : isHigherPlan
                                                                ? `bg-${getPlanColor(planKey)}-600 hover:bg-${getPlanColor(planKey)}-700 text-white`
                                                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {isProcessingPayment ? (
                                                        <>
                                                            <FiLoader className="animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : isCurrentPlan ? (
                                                        'Your Current Plan'
                                                    ) : isHigherPlan ? (
                                                        <>
                                                            Upgrade to {planKey} <FiArrowRight />
                                                        </>
                                                    ) : (
                                                        'Downgrade Not Allowed'
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Danger Zone */}
                            <section className="bg-red-900/10 border border-red-900/30 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                        <FiLock size={20} />
                                    </div>
                                    Danger Zone
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-red-900/20 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-white">Delete Account</h3>
                                            <p className="text-sm text-gray-400">
                                                Permanently delete your account and all associated data.
                                            </p>
                                        </div>
                                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">
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