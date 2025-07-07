'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  FiPlus, FiTrash2, FiBarChart2, FiSearch, FiEdit2,
  FiChevronDown, FiChevronUp, FiRefreshCw, FiHome,
  FiPieChart, FiSettings, FiUsers, FiLogOut, FiUser,
  FiChevronLeft,
  FiX,
  FiMenu,
  FiBell,
  FiPlay,
  FiArchive,
  FiClock,
  FiBarChart
} from 'react-icons/fi';
import SideBar from './SideBar';

type Poll = {
  id: string;
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
  createdAt: Date;
};

type Project = {
  id: string;
  title: string;
  description: string;
  polls: Poll[];
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
};

type UserProfile = {
  name: string;
  email: string;
  avatar: string;
  role: string;
};

const DashboardPage = () => {
  const router = useRouter();
  const [Projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: '',
    role: 'Project Administrator'
  });

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Sample data
      const sampleProjects: Project[] = [
        {
          id: '1',
          title: 'Frontend Framework Preferences',
          description: 'Collecting data on team preferences for upcoming projects',
          status: 'active',
          polls: [
            {
              id: '1-1',
              question: 'Which framework do you prefer?',
              options: [
                { text: 'React', votes: 24 },
                { text: 'Vue', votes: 12 },
                { text: 'Svelte', votes: 8 },
              ],
              totalVotes: 44,
              createdAt: new Date('2023-10-01'),
            },
            {
              id: '1-2',
              question: 'Preferred state management solution?',
              options: [
                { text: 'Context API', votes: 18 },
                { text: 'Redux', votes: 10 },
                { text: 'Zustand', votes: 16 },
              ],
              totalVotes: 44,
              createdAt: new Date('2023-10-02'),
            },
          ],
          createdAt: new Date('2023-10-01'),
          updatedAt: new Date('2023-10-05'),
        },
        {
          id: '2',
          title: 'UI/UX Design Project',
          description: 'Gathering feedback on design system preferences',
          status: 'active',
          polls: [
            {
              id: '2-1',
              question: 'Preferred color scheme?',
              options: [
                { text: 'Light mode', votes: 32 },
                { text: 'Dark mode', votes: 45 },
                { text: 'System preference', votes: 23 },
              ],
              totalVotes: 100,
              createdAt: new Date('2023-09-15'),
            },
          ],
          createdAt: new Date('2023-09-15'),
          updatedAt: new Date('2023-09-20'),
        },
        {
          id: '3',
          title: 'Archived Team Retrospective',
          description: 'Q2 2023 team feedback',
          status: 'archived',
          polls: [
            {
              id: '3-1',
              question: 'What went well this quarter?',
              options: [
                { text: 'Communication', votes: 15 },
                { text: 'Project delivery', votes: 22 },
                { text: 'Team collaboration', votes: 18 },
              ],
              totalVotes: 55,
              createdAt: new Date('2023-06-30'),
            },
          ],
          createdAt: new Date('2023-06-01'),
          updatedAt: new Date('2023-07-10'),
        },
      ];

      setProjects(sampleProjects);
      setLoading(false);
    };

    fetchData();
  }, []);

  const toggleProjectExpansion = (ProjectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [ProjectId]: !prev[ProjectId],
    }));
  };

  const createNewProject = () => {
    router.push('/Projects/create');
  };

  const archiveProject = (ProjectId: string) => {
    setProjects(Projects.map(Project =>
      Project.id === ProjectId ? { ...Project, status: 'archived' } : Project
    ));
  };

  const activateProject = (ProjectId: string) => {
    setProjects(Projects.map(Project =>
      Project.id === ProjectId ? { ...Project, status: 'active' } : Project
    ));
  };

  const deleteProject = (ProjectId: string) => {
    setProjects(Projects.filter(Project => Project.id !== ProjectId));
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const filteredProjects = Projects.filter(Project => {
    const matchesSearch = Project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || Project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateTotalVotes = (Project: Project) => {
    return Project.polls.reduce((sum, poll) => sum + poll.totalVotes, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-darker text-gray-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-medium">Loading Project Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen theme-darker text-gray-100 overflow-hidden">
      <SideBar />
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 theme">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col space-y-6">
              {/* Header with actions */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Project Management</h1>
                  <p className="text-gray-400">Create and analyze your Projects</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={createNewProject}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-sm hover:bg-indigo-700 transition-all duration-200 shadow-sm"
                  >
                    <FiPlus />
                    New Project
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="theme-lighter border theme-border rounded-sm p-4">
                  <h3 className="text-sm text-gray-400">Total Projects</h3>
                  <p className="text-2xl font-bold text-white">{Projects.length}</p>
                </div>
                <div className="theme-lighter border theme-border rounded-sm p-4">
                  <h3 className="text-sm text-gray-400">Active Projects</h3>
                  <p className="text-2xl font-bold text-indigo-400">{Projects.filter(t => t.status === 'active').length}</p>
                </div>
                <div className="theme-lighter border theme-border rounded-sm p-4">
                  <h3 className="text-sm text-gray-400">Total Polls</h3>
                  <p className="text-2xl font-bold text-white">{Projects.reduce((sum, Project) => sum + Project.polls.length, 0)}</p>
                </div>
                <div className="theme-lighter border theme-border rounded-sm p-4">
                  <h3 className="text-sm text-gray-400">Total Votes</h3>
                  <p className="text-2xl font-bold text-white">{Projects.reduce((sum, Project) => sum + calculateTotalVotes(Project), 0)}</p>
                </div>
              </div>

              {/* Filters */}
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

              {/* Projects List */}
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
                        onClick={() => router.push(`/projects/${project.id}/analytics`)}
                        className={`bg-theme-lighter flex flex-col border ${project.status === 'active' ? 'border-green-500/30 hover:border-green-500/50' : 'border-theme-border hover:border-gray-600'} rounded-lg p-5 cursor-pointer transition-all duration-300 hover:shadow-lg group`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                                {project.title}
                              </h3>
                              {project.status === 'active' && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2 mb-3">{project.description}</p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full ${project.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-300'}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </div>

                        {/* Moved this section to the bottom */}
                        <div className="mt-auto pb-4 pt-2 border-b border-theme-border">
                          <div className="flex justify-between items-center">
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-400">
                                <FiPieChart className="text-indigo-400" size={14} />
                                {project.polls.length} {project.polls.length === 1 ? 'Poll' : 'Polls'}
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <FiUsers className="text-blue-400" size={14} />
                                {calculateTotalVotes(project)} Responses
                              </div>
                            </div>

                          </div>

                        </div>
                        <div className='flex justify-between p-2 flex-wrap'>

                          <div className="mt-2 text-xs text-gray-500">
                            Updated {new Date(project.updatedAt).toLocaleDateString()}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/projects/${project.id}/analytics`);
                            }}
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
};

export default DashboardPage;