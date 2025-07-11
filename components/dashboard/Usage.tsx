'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FiMenu, FiPieChart, FiCheckCircle, FiAlertTriangle, FiActivity } from 'react-icons/fi';
import SideBar from './SideBar';

interface UsageData {
  currentPlan: string;
  limits: {
    maxProjects: number | null;
    maxPollsPerProject: number | null;
    maxTotalPolls: number | null;
    maxResponses: number | null;
    prioritySupport: boolean;
  };
  usage: {
    totalProjects: number;
    totalPolls: number;
    totalResponses: number;
    remainingProjects: number | null;
    remainingPolls: number | null;
    remainingResponses: number | null;
  };
  exceeded: {
    projects: boolean;
    polls: boolean;
    responses: boolean;
  };
  isUnlimited: boolean;
}

export default function UsagePage() {
  const { data: session } = useSession();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const response = await fetch('/api/user/actions/usage');
        if (!response.ok) {
          throw new Error('Failed to fetch usage data');
        }
        const data = await response.json();
        setUsageData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchUsageData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex h-screen theme-darker text-gray-100 overflow-hidden">
        <div className="m-auto">Loading usage data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen theme-darker text-gray-100 overflow-hidden">
        <div className="m-auto text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!usageData) {
    return null;
  }

  const getUsagePercentage = (used: number, limit: number | null) => {
    if (limit === null || limit === 0) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  const getUsageColor = (percentage: number, exceeded: boolean) => {
    if (exceeded) return 'bg-red-500';
    if (percentage > 90) return 'bg-yellow-500';
    if (percentage > 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const metrics = [
    {
      name: 'Projects',
      used: usageData.usage.totalProjects,
      limit: usageData.limits.maxProjects,
      remaining: usageData.usage.remainingProjects,
      exceeded: usageData.exceeded.projects,
      unit: '',
    },
    {
      name: 'Polls',
      used: usageData.usage.totalPolls,
      limit: usageData.limits.maxTotalPolls,
      remaining: usageData.usage.remainingPolls,
      exceeded: usageData.exceeded.polls,
      unit: '',
    },
    {
      name: 'Responses',
      used: usageData.usage.totalResponses,
      limit: usageData.limits.maxResponses,
      remaining: usageData.usage.remainingResponses,
      exceeded: usageData.exceeded.responses,
      unit: '',
    },
  ];

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
            <span className={`px-3 py-1 rounded-full text-sm ${
              usageData.isUnlimited 
                ? 'bg-purple-900/30 text-purple-400' 
                : usageData.currentPlan === 'PRO' 
                  ? 'bg-blue-900/30 text-blue-400' 
                  : 'bg-green-900/30 text-green-400'
            }`}>
              {usageData.currentPlan} {usageData.isUnlimited && ' (Unlimited)'}
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
                    <h3 className="text-lg font-medium mb-3 ${
                      usageData.isUnlimited 
                        ? 'text-purple-400' 
                        : usageData.currentPlan === 'PRO' 
                          ? 'text-blue-400' 
                          : 'text-green-400'
                    }">
                      {usageData.currentPlan} Plan
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-gray-300">
                        <FiCheckCircle className={
                          usageData.isUnlimited 
                            ? 'text-purple-400' 
                            : usageData.currentPlan === 'PRO' 
                              ? 'text-blue-400' 
                              : 'text-green-400'
                        } />
                        <span>
                          Projects: {usageData.isUnlimited ? (
                            <span className="flex items-center gap-1">
                              Unlimited <FiActivity />
                            </span>
                          ) : (
                            `${usageData.limits.maxProjects} active`
                          )}
                        </span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-300">
                        <FiCheckCircle className={
                          usageData.isUnlimited 
                            ? 'text-purple-400' 
                            : usageData.currentPlan === 'PRO' 
                              ? 'text-blue-400' 
                              : 'text-green-400'
                        } />
                        <span>
                          Polls: {usageData.isUnlimited ? (
                            <span className="flex items-center gap-1">
                              Unlimited <FiActivity />
                            </span>
                          ) : (
                            usageData.limits.maxTotalPolls
                          )}
                        </span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-300">
                        <FiCheckCircle className={
                          usageData.isUnlimited 
                            ? 'text-purple-400' 
                            : usageData.currentPlan === 'PRO' 
                              ? 'text-blue-400' 
                              : 'text-green-400'
                        } />
                        <span>
                          Responses: {usageData.isUnlimited ? (
                            <span className="flex items-center gap-1">
                              Unlimited <FiActivity />
                            </span>
                          ) : (
                            `${usageData.limits.maxResponses}/month`
                          )}
                        </span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-300">
                        <FiCheckCircle className={
                          usageData.isUnlimited 
                            ? 'text-purple-400' 
                            : usageData.currentPlan === 'PRO' 
                              ? 'text-blue-400' 
                              : 'text-green-400'
                        } />
                        <span>
                          Priority Support: {usageData.limits.prioritySupport ? 'Yes' : 'No'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section className="theme-lighter border theme-border rounded-sm p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Your Usage</h2>
                
                <div className="space-y-6">
                  {metrics.map((metric) => (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-white">{metric.name}</h3>
                        <span className="text-sm text-gray-400">
                          {metric.used} / {metric.limit === null ? (
                            <span className="flex items-center gap-1">
                              ∞ <FiActivity size={12} />
                            </span>
                          ) : (
                            metric.limit
                          )} {metric.unit}
                          {metric.remaining !== null && (
                            <span className="ml-2">({metric.remaining} remaining)</span>
                          )}
                        </span>
                      </div>
                      
                      {metric.limit !== null ? (
                        <>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                getUsageColor(getUsagePercentage(metric.used, metric.limit), metric.exceeded)
                              }`}
                              style={{ width: `${getUsagePercentage(metric.used, metric.limit)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{getUsagePercentage(metric.used, metric.limit)}% utilized</span>
                            {metric.exceeded ? (
                              <span className="text-red-400 flex items-center gap-1">
                                <FiAlertTriangle size={12} /> Limit exceeded
                              </span>
                            ) : getUsagePercentage(metric.used, metric.limit) > 90 && (
                              <span className="text-yellow-400 flex items-center gap-1">
                                <FiAlertTriangle size={12} /> Near limit
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-400 flex items-center gap-1">
                          <FiCheckCircle className={
                            usageData.isUnlimited 
                              ? 'text-purple-400' 
                              : usageData.currentPlan === 'PRO' 
                                ? 'text-blue-400' 
                                : 'text-green-400'
                          } /> 
                          Unlimited usage
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