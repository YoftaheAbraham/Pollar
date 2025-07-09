'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FiMenu, FiPieChart, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import SideBar from './SideBar';

interface UsageMetric {
  name: string;
  used: number;
  limit: number | string;
  unit: string;
}

interface PlanLimits {
  projects: number | string;
  polls: number | string;
  responses: number | string;
  storage: number | string;
}

interface Plan {
  name: string;
  limits: PlanLimits;
}

interface PlanData {
  free: Plan;
  pro: Plan;
  enterprise: Plan;
}

export default function UsagePage() {
  const { data: session } = useSession();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPlan] = useState<'free' | 'pro' | 'enterprise'>('free'); // Default to free plan

  const planLimits: PlanData = {
    free: {
      name: 'Free Plan',
      limits: {
        projects: 5,
        polls: 20,
        responses: 100,
        storage: 100, // MB
      }
    },
    pro: {
      name: 'Pro Plan',
      limits: {
        projects: 'Unlimited',
        polls: 100,
        responses: 1000,
        storage: 500, // MB
      }
    },
    enterprise: {
      name: 'Enterprise Plan',
      limits: {
        projects: 'Unlimited',
        polls: 'Unlimited',
        responses: 'Unlimited',
        storage: 1000, // MB
      }
    }
  };

  const getNumericLimit = (limit: number | string): number => {
    return limit === 'Unlimited' ? Infinity : Number(limit);
  };

  // Mock usage data - in a real app you'd fetch this from your API
  const usageData: UsageMetric[] = [
    {
      name: 'Projects',
      used: 3,
      limit: getNumericLimit(planLimits[currentPlan].limits.projects),
      unit: ''
    },
    {
      name: 'Polls',
      used: 12,
      limit: getNumericLimit(planLimits[currentPlan].limits.polls),
      unit: ''
    },
    {
      name: 'Responses',
      used: 78,
      limit: getNumericLimit(planLimits[currentPlan].limits.responses),
      unit: ''
    },
    {
      name: 'Storage',
      used: 32,
      limit: getNumericLimit(planLimits[currentPlan].limits.storage),
      unit: 'MB'
    }
  ];

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === Infinity) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  const getUsageColor = (percentage: number) => {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 75) return 'bg-yellow-500';
    return 'bg-green-500';
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
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <FiPieChart className="text-green-400" />
              Usage Analytics
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">
              {planLimits[currentPlan].name}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 theme">
          <div className="w-full">
            <div className="grid gap-5">
              <section className="theme-lighter border theme-border rounded-sm p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Your Current Plan</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-green-400 mb-3">{planLimits[currentPlan].name}</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-gray-300">
                        <FiCheckCircle className="text-green-400" />
                        <span>
                          Projects: {planLimits[currentPlan].limits.projects === 'Unlimited' ? 'Unlimited' : `${planLimits[currentPlan].limits.projects} active`}
                        </span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-300">
                        <FiCheckCircle className="text-green-400" />
                        <span>
                          Polls: {planLimits[currentPlan].limits.polls === 'Unlimited' ? 'Unlimited' : planLimits[currentPlan].limits.polls}
                        </span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-300">
                        <FiCheckCircle className="text-green-400" />
                        <span>
                          Responses: {planLimits[currentPlan].limits.responses === 'Unlimited' ? 'Unlimited' : `${planLimits[currentPlan].limits.responses}/month`}
                        </span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-300">
                        <FiCheckCircle className="text-green-400" />
                        <span>
                          Storage: {planLimits[currentPlan].limits.storage}MB
                        </span>
                      </li>
                    </ul>
                  </div>
                
                </div>
              </section>
              
              <section className="theme-lighter border theme-border rounded-sm p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Your Usage</h2>
                
                <div className="space-y-6">
                  {usageData.map((metric) => (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-white">{metric.name}</h3>
                        <span className="text-sm text-gray-400">
                          {metric.used} / {metric.limit === Infinity ? '∞' : metric.limit} {metric.unit}
                        </span>
                      </div>
                      
                      {metric.limit !== Infinity ? (
                        <>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${getUsageColor(getUsagePercentage(metric.used, parseInt(metric.limit as string)))}`}
                              style={{ width: `${getUsagePercentage(metric.used, parseInt(metric.limit as string))}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{getUsagePercentage(metric.used, parseInt(metric.limit as string))}% utilized</span>
                            {getUsagePercentage(metric.used, parseInt(metric.limit as string)) > 90 && (
                              <span className="text-red-400 flex items-center gap-1">
                                <FiAlertTriangle size={12} /> Near limit
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-400 flex items-center gap-1">
                          <FiCheckCircle className="text-green-400" /> Unlimited usage
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}