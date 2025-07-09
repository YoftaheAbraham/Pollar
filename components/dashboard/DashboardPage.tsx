'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiMenu, FiBell, FiLogOut, FiPieChart, FiUsers, FiBarChart } from 'react-icons/fi';
import SideBar from './SideBar';

interface Project {
  id: string;
  name: string;
  owner: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  pollCount: number;
  totalRespondents: number;
}

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalPolls: number;
  totalVotes: number;
  recentProjects: Project[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/user/actions/getData');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch dashboard data');
        }

        if (isMounted) {
          setStats(data.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          console.error('Dashboard fetch error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const createNewProject = async () => {
    try {
      await router.push('/dashboard/projects/new');
    } catch (err) {
      console.error('Navigation error:', err);
    }
  };

  const navigateToProjectAnalytics = async (projectId: string) => {
    try {
      await router.push(`/dashboard/projects/${projectId}`);
    } catch (err) {
      console.error('Navigation error:', err);
    }
  };

  const handleProjectClick = async (projectId: string) => {
    await navigateToProjectAnalytics(projectId);
  };

  const handleAnalyticsButtonClick = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    await navigateToProjectAnalytics(projectId);
  };

  const filteredProjects = stats?.recentProjects?.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    // Since the API doesn't provide status, we'll assume all projects are active
    const matchesStatus = statusFilter === 'all' || statusFilter === 'active';
    return matchesSearch && matchesStatus;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen theme-darker text-gray-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-medium">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen theme-darker text-gray-100 flex items-center justify-center">
        <div className="text-center p-6 bg-red-900/20 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

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
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Project Management</h1>
                  <p className="text-gray-400">Create and analyze your Projects</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={createNewProject}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-sm hover:bg-green-700 transition-all duration-200 shadow-sm"
                  >
                    <FiPlus />
                    New Project
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="theme-lighter border theme-border rounded-sm p-4">
                  <h3 className="text-sm text-gray-400">Total Projects</h3>
                  <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
                </div>
                <div className="theme-lighter border theme-border rounded-sm p-4">
                  <h3 className="text-sm text-gray-400">Active Projects</h3>
                  <p className="text-2xl font-bold text-indigo-400">{stats.activeProjects}</p>
                </div>
                <div className="theme-lighter border theme-border rounded-sm p-4">
                  <h3 className="text-sm text-gray-400">Total Polls</h3>
                  <p className="text-2xl font-bold text-white">{stats.totalPolls}</p>
                </div>
                <div className="theme-lighter border theme-border rounded-sm p-4">
                  <h3 className="text-sm text-gray-400">Total Votes</h3>
                  <p className="text-2xl font-bold text-white">{stats.totalVotes}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex rounded-sm flex-grow w-full theme-lighter border theme-border px-4 py-2 text-white items-center gap-2">
                  <FiSearch className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search Projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full flex-1 bg-transparent focus:outline-none outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-sm transition-all ${statusFilter === 'all' ? 'bg-green-600 text-white' : 'theme-lighter border theme-border hover:bg-gray-700'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter('active')}
                    className={`px-3 py-1 rounded-sm transition-all ${statusFilter === 'active' ? 'bg-green-600 text-white' : 'theme-lighter border theme-border hover:bg-gray-700'}`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setStatusFilter('archived')}
                    className={`px-3 py-1 rounded-sm transition-all ${statusFilter === 'archived' ? 'bg-green-600 text-white' : 'theme-lighter border theme-border hover:bg-gray-700'}`}
                  >
                    Archived
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredProjects.length === 0 ? (
                  <div className="bg-theme-lighter border border-theme-border rounded-lg p-8 text-center">
                    <p className="text-xl mb-4 text-gray-300">No projects found</p>
                    <button
                      onClick={createNewProject}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-green-700 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <FiPlus />
                      Create First Project
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map(project => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectClick(project.id)}
                        className={`bg-theme-lighter flex flex-col border border-green-500/30 hover:border-green-500/50 rounded-lg p-5 cursor-pointer transition-all duration-300 hover:shadow-lg group`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                                {project.name}
                              </h3>
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2 mb-3">{project.description}</p>
                          </div>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-green-900/30 text-green-400">
                            Active
                          </span>
                        </div>

                        <div className="mt-auto pb-4 pt-2 border-b border-theme-border">
                          <div className="flex justify-between items-center">
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-400">
                                <FiPieChart className="text-indigo-400" size={14} />
                                {project.pollCount} {project.pollCount === 1 ? 'Poll' : 'Polls'}
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <FiUsers className="text-blue-400" size={14} />
                                {project.totalRespondents} Responses
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='flex justify-between p-2 flex-wrap'>
                          <div className="mt-2 text-xs text-gray-500">
                            Updated {new Date(project.updatedAt).toLocaleDateString()}
                          </div>
                          <button
                            onClick={(e) => handleAnalyticsButtonClick(e, project.id)}
                            className="relative inline-flex items-center justify-center px-3 py-1.5 overflow-hidden font-medium text-indigo-400 rounded-lg group bg-indigo-900/20 hover:bg-gradient-to-br hover:from-indigo-900/40 hover:to-indigo-900/20"
                          >
                            <span className="relative flex items-center gap-1.5">
                              <FiBarChart size={14} className="group-hover:scale-110 transition-transform" />
                              <span className="text-xs">Analytics</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}