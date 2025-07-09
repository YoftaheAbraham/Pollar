'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiBarChart2, FiSearch, FiMenu, FiBell, FiLogOut, FiPieChart, FiUsers, FiBarChart, FiClock, FiCheckCircle, FiLink, FiCopy, FiShare2 } from 'react-icons/fi';
import SideBar from './SideBar';

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

interface Poll {
  id: string;
  question: string;
  duration: number;
  maxVotes: number | null;
  isActive: boolean;
  totalVotes: number;
  uniqueRespondents: number;
  options: PollOption[];
  createdAt: string;
  ageInHours: number;
}

interface Project {
  id: string;
  name: string;
  owner: string;
  description: string;
  createdAt: string;
  ageInHours: number;
  isActive: boolean;
  totalPolls: number;
  totalVotes: number;
  uniqueRespondents: number;
  activePolls: number;
  completedPolls: number;
}

export default function ProjectDetail() {
  const router = useRouter();
  const { id: projectID } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedPolls, setSelectedPolls] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/user/actions/projects/${projectID}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch project data');
        }

        if (isMounted) {
          setProject(data.data.project);
          setPolls(data.data.polls);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          console.error('Project fetch error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjectData();

    return () => {
      isMounted = false;
    };
  }, [projectID]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShareModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const togglePollSelection = (pollId: string) => {
    setSelectedPolls(prev =>
      prev.includes(pollId)
        ? prev.filter(id => id !== pollId)
        : [...prev, pollId]
    );
  };

  const copyToClipboard = (text: string, pollId?: string) => {
    navigator.clipboard.writeText(text).then(() => {
      if (pollId) {
        setCopyStatus(prev => ({ ...prev, [pollId]: true }));
        setTimeout(() => {
          setCopyStatus(prev => ({ ...prev, [pollId]: false }));
        }, 2000);
      } else {
        setCopyStatus({ ...copyStatus, 'multi': true });
        setTimeout(() => {
          setCopyStatus(prev => ({ ...prev, 'multi': false }));
        }, 2000);
      }
    });
  };

  const generatePollLink = (pollId: string) => {
    return `${window.location.origin}/poll/${pollId}`;
  };

  const generateMultiPollLink = () => {
    return `${window.location.origin}/poll/${projectID}?polls=${selectedPolls.join(',')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-darker text-gray-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-medium">Loading Project...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen theme-darker text-gray-100 flex items-center justify-center">
        <div className="text-center p-6 bg-red-900/20 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Project</h2>
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

  if (!project) {
    router.push('/dashboard');
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
                  <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                  <p className="text-gray-400">Project details and polls</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${project.isActive ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-300'}`}>
                    {project.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="bg-theme-lighter border theme-border rounded-lg p-5">
                <h2 className="text-lg font-semibold text-white mb-3">Project Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Owner</p>
                    <p className="text-white">{project.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Created</p>
                    <p className="text-white">{new Date(project.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Description</p>
                    <p className="text-white">{project.description || 'No description provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Age</p>
                    <p className="text-white">{project.ageInHours} hours</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="theme-lighter border theme-border rounded-sm p-4">
                  <h3 className="text-sm text-gray-400">Total Votes</h3>
                  <p className="text-2xl font-bold text-white">{project.totalVotes}</p>
                </div>
                <div className="theme-lighter border theme-border rounded-sm p-4">
                  <h3 className="text-sm text-gray-400">Unique Respondents</h3>
                  <p className="text-2xl font-bold text-white">{project.uniqueRespondents}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Polls ({polls.length})</h2>
                 <Link
                 href={`/dashboard/projects/${projectID}/poll`}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-sm cursor-pointer transition-colors"
                  >
                    <FiPlus size={16} />
                    Add Poll
                  </Link>
              </div>

              {polls.length === 0 ? (
                <div className="bg-theme-lighter border border-theme-border rounded-lg p-8 text-center">
                  <p className="text-xl mb-4 text-gray-300">No polls found for this project</p>
                  <Link
                    href={`/projects/${projectID}/new-poll`}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-green-700 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <FiPlus />
                    Create First Poll
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {polls.map(poll => (
                    <div
                      key={poll.id}
                      className={`bg-theme-lighter flex flex-col border ${poll.isActive ? 'border-green-500/30 hover:border-green-500/50' : 'border-theme-border hover:border-gray-600'} rounded-lg p-5 transition-all duration-300 hover:shadow-lg relative ${selectedPolls.includes(poll.id) ? 'ring-2 ring-indigo-500' : ''}`}
                      onClick={() => togglePollSelection(poll.id)}
                    >
                      {selectedPolls.includes(poll.id) && (
                        <div className="absolute -top-2 -right-2 bg-indigo-500 rounded-full p-1">
                          <div className="w-4 h-4 flex items-center justify-center text-white text-xs">
                            {selectedPolls.indexOf(poll.id) + 1}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {poll.question}
                            </h3>
                            {poll.isActive && (
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                            <span className="flex items-center gap-1">
                              <FiClock size={14} />
                              {poll.duration}h duration
                            </span>
                            <span className="flex items-center gap-1">
                              <FiUsers size={14} />
                              {poll.uniqueRespondents} respondents
                            </span>
                            {!poll.isActive && (
                              <span className="flex items-center gap-1">
                                <FiCheckCircle size={14} />
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full ${poll.isActive ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-300'}`}>
                          {poll.isActive ? 'Active' : 'Completed'}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        {poll.options.map(option => (
                          <div key={option.id} className="w-full mb-4 group">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium text-gray-100 group-hover:text-white transition-colors">
                                {option.text}
                              </span>
                              <span className="text-gray-300 font-semibold">
                                {option.percentage}% <span className="text-gray-400">({option.votes} vote{option.votes !== 1 ? 's' : ''})</span>
                              </span>
                            </div>
                            <div className="w-full bg-gray-700/60 rounded-full h-1 overflow-hidden backdrop-blur-sm">
                              <div
                                className="bg-white h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                  width: `${option.percentage}%`,
                                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t theme-border flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          Created {new Date(poll.createdAt).toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="relative inline-flex items-center justify-center px-3 py-1.5 overflow-hidden font-medium text-indigo-400 rounded-lg group bg-indigo-900/20 hover:bg-gradient-to-br hover:from-indigo-900/40 hover:to-indigo-900/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(generatePollLink(poll.id), poll.id);
                            }}
                          >
                            <span className="relative flex items-center gap-1.5">
                              {copyStatus[poll.id] ? (
                                <>
                                  <FiCheckCircle size={14} />
                                  <span className="text-xs">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <FiLink size={14} className="group-hover:scale-110 transition-transform" />
                                  <span className="text-xs">Copy Link</span>
                                </>
                              )}
                            </span>
                          </button>
                          <button
                            className="relative inline-flex items-center justify-center px-3 py-1.5 overflow-hidden font-medium text-indigo-400 rounded-lg group bg-indigo-900/20 hover:bg-gradient-to-br hover:from-indigo-900/40 hover:to-indigo-900/20"
                          >
                            <span className="relative flex items-center gap-1.5">
                              <FiBarChart size={14} className="group-hover:scale-110 transition-transform" />
                              <span className="text-xs">Analytics</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}