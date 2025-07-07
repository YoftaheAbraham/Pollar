"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { FiChevronLeft, FiHome, FiPieChart, FiSettings, FiUser, FiUsers, FiX } from 'react-icons/fi'

type UserProfile = {
    name: string;
    email: string;
    avatar: string;
    role: string;
};

const SideBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        avatar: '',
        role: 'Project Administrator'
    });
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <>
            <div className={`hidden md:flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'} theme transition-all duration-300 border-r theme-border`}>
                <div className={`p-4 border-b theme-border flex ${sidebarOpen ? 'flex-row items-start' : 'flex-col items-center'} gap-3`}>
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                            <FiUser className="text-white" size={20} />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 theme-border"></span>
                    </div>
                    {sidebarOpen && (
                        <div className="flex-1">
                            <h3 className="font-medium text-white">{userProfile.name}</h3>
                            <p className="text-xs text-gray-400">{userProfile.role}</p>
                            <button className="mt-1 text-xs text-indigo-400 hover:text-indigo-300">
                                View Profile
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-2">
                    <ul className="space-y-1">
                        <li>
                            <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-md bg-[#0e0e0e] text-white">
                                <FiHome size={20} />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/Projects" className="flex items-center gap-3 p-3 rounded-md hover:bg-[#0e0e0e] text-white">
                                <FiPieChart size={20} />
                                <span>All Projects</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/templates" className="flex items-center gap-3 p-3 rounded-md hover:bg-[#0e0e0e] text-white">
                                <FiSettings size={20} />
                                <span>Templates</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/respondents" className="flex items-center gap-3 p-3 rounded-md hover:bg-[#0e0e0e] text-white">
                                <FiUsers size={20} />
                                <span>Respondents</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t theme-border">
                    <button
                        className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-[#0e0e0e] text-white"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <FiChevronLeft size={20} className={sidebarOpen ? '' : 'rotate-180'} />
                        {sidebarOpen && <span>Collapse</span>}
                    </button>
                </div>
            </div>
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 theme-darker bg-opacity-75" onClick={() => setMobileSidebarOpen(false)}></div>
                    <div className="relative flex flex-col w-72 max-w-xs h-full theme-lighter border-r theme-border">
                        <div className="flex items-center justify-between p-4 border-b theme-border">
                            <Link href="/" className="flex items-center group">
                                <h1 className="text-xl font-bold tracking-tighter text-green-500 group-hover:text-green-400 transition-colors duration-300">
                                    POLLAR
                                </h1>
                                <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full animate-pulse">
                                    PRO
                                </span>
                            </Link>
                            <button onClick={() => setMobileSidebarOpen(false)} className="text-gray-400 hover:text-white">
                                <FiX size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SideBar