'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiBarChart2, FiEdit2, FiChevronDown, FiChevronUp, FiRefreshCw } from 'react-icons/fi';

type Poll = {
  id: string;
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
  createdAt: Date;
};

type Ticket = {
  id: string;
  title: string;
  description: string;
  polls: Poll[];
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
};

const DashboardPage = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTickets, setExpandedTickets] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample data
      const sampleTickets: Ticket[] = [
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
          title: 'UI/UX Design Survey',
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

      setTickets(sampleTickets);
      setLoading(false);
    };

    fetchData();
  }, []);

  const toggleTicketExpansion = (ticketId: string) => {
    setExpandedTickets(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }));
  };

  const createNewTicket = () => {
    router.push('/tickets/create');
  };

  const archiveTicket = (ticketId: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: 'archived' } : ticket
    ));
  };

  const activateTicket = (ticketId: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: 'active' } : ticket
    ));
  };

  const deleteTicket = (ticketId: string) => {
    setTickets(tickets.filter(ticket => ticket.id !== ticketId));
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateTotalVotes = (ticket: Ticket) => {
    return ticket.polls.reduce((sum, poll) => sum + poll.totalVotes, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black/50 text-gray-100 pt-24 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-medium">Loading Ticket Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/80 text-gray-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-6">
          {/* Header with actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Ticket Dashboard</h1>
              <p className="text-gray-400">Manage all your polling tickets</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={refreshData}
                className="flex items-center justify-center gap-2 border border-gray-700 px-4 py-2 rounded-sm hover:bg-gray-800 transition-all duration-200"
              >
                <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={createNewTicket}
                className="flex items-center justify-center gap-2 bg-white/90 text-black px-4 py-2 rounded-sm hover:bg-indigo-700 transition-all duration-200 shadow-sm"
              >
                <FiPlus />
                New Ticket
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex flex-grow w-full">
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full flex-1 bg-black/5 border border-gray-800  px-4 py-2 text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-sm transition-all ${statusFilter === 'all' ? 'bg-white text-black' : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1 rounded-sm transition-all ${statusFilter === 'active' ? 'bg-white text-black' : 'bg-black/20 border border-gray-700 hover:bg-gray-700'}`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('archived')}
                className={`px-3 py-1 rounded-sm transition-all ${statusFilter === 'archived' ? 'bg-white text-black' : 'bg-black/20 border border-gray-700 hover:bg-gray-700'}`}
              >
                Archived
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/5  border border-gray-700 rounded-sm p-4">
              <h3 className="text-sm text-gray-400">Total Tickets</h3>
              <p className="text-2xl font-bold text-white">{tickets.length}</p>
            </div>
            <div className="bg-black/5 border border-gray-700 rounded-sm p-4">
              <h3 className="text-sm text-gray-400">Active Tickets</h3>
              <p className="text-2xl font-bold text-indigo-400">{tickets.filter(t => t.status === 'active').length}</p>
            </div>
            <div className="bg-black/5 border border-gray-700 rounded-sm p-4">
              <h3 className="text-sm text-gray-400">Total Votes</h3>
              <p className="text-2xl font-bold text-white">{tickets.reduce((sum, ticket) => sum + calculateTotalVotes(ticket), 0)}</p>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="bg-black/50 border border-gray-700 rounded-sm p-8 text-center">
                <p className="text-xl mb-4 text-gray-300">No tickets found</p>
                <button
                  onClick={createNewTicket}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-sm inline-flex items-center gap-2 hover:bg-indigo-700 transition-all duration-200"
                >
                  <FiPlus />
                  Create Your First Ticket
                </button>
              </div>
            ) : (
              filteredTickets.map(ticket => (
                <div key={ticket.id} className="bg-black border border-gray-700 rounded-sm overflow-hidden hover:border-gray-600 transition-colors duration-200">
                  <div 
                    className={`p-4 cursor-pointer flex justify-between items-center ${ticket.status === 'archived' ? 'bg-black/50' : 'bg-black'}`}
                    onClick={() => toggleTicketExpansion(ticket.id)}
                  >
                    <div className="flex-grow">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-white">{ticket.title}</h2>
                        <span className={`text-xs px-2 py-1 rounded-full ${ticket.status === 'active' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-gray-700 text-gray-300'}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{ticket.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiBarChart2 size={14} />
                          {ticket.polls.length} Polls
                        </span>
                        <span>{calculateTotalVotes(ticket)} Votes</span>
                        <span>Updated: {ticket.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="ml-4 text-gray-400 hover:text-gray-200">
                      {expandedTickets[ticket.id] ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                    </button>
                  </div>

                  {expandedTickets[ticket.id] && (
                    <div className="border-t border-gray-700 bg-black">
                      <div className="p-4 space-y-4">
                        {ticket.polls.map(poll => (
                          <div key={poll.id} className="bg-black/50 border border-gray-700 rounded-sm p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-white">{poll.question}</h3>
                                <p className="text-sm text-gray-400 mt-1">{poll.totalVotes} votes</p>
                              </div>
                              <button
                                onClick={() => router.push(`/tickets/${ticket.id}/polls/${poll.id}/analytics`)}
                                className="flex items-center gap-1 border border-gray-600 px-3 py-1 rounded-sm text-sm text-gray-200 hover:bg-gray-800 transition-colors"
                              >
                                <FiBarChart2 size={14} />
                                Analytics
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="flex justify-end gap-2 pt-2">
                          {ticket.status === 'active' ? (
                            <button
                              onClick={() => archiveTicket(ticket.id)}
                              className="flex items-center gap-1 border border-gray-600 px-3 py-1 rounded-sm text-sm text-gray-200 hover:bg-gray-800 transition-colors"
                            >
                              <FiEdit2 size={14} />
                              Archive
                            </button>
                          ) : (
                            <button
                              onClick={() => activateTicket(ticket.id)}
                              className="flex items-center gap-1 border border-gray-600 px-3 py-1 rounded-sm text-sm text-gray-200 hover:bg-gray-800 transition-colors"
                            >
                              <FiEdit2 size={14} />
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => deleteTicket(ticket.id)}
                            className="flex items-center gap-1 border border-red-900/50 bg-red-900/20 px-3 py-1 rounded-sm text-sm text-red-400 hover:bg-red-900/30 transition-colors"
                          >
                            <FiTrash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;