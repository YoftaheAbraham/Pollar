"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { FiChevronLeft, FiFile, FiHome, FiPieChart, FiSettings, FiUser, FiX, FiLogOut } from 'react-icons/fi'
import { useSession, signOut } from 'next-auth/react'

type UserProfile = {
    name: string;
    email: string;
    image?: string;
    role?: string;
};

const SideBar = ({ mobileSidebarOpen, setMobileSidebarOpen }: { mobileSidebarOpen: boolean; setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { data: session, status } = useSession();

    const userProfile: UserProfile = {
        name: session?.user?.name || 'Guest',
        email: session?.user?.email || '',
        image: session?.user?.image as string
    };

    const navItems = [
        { href: "/dashboard", icon: <FiHome size={20} />, label: "Dashboard" },
        { href: "/dashboard/usage", icon: <FiPieChart size={20} />, label: "Usage" },
        { href: "/dashboard/settings", icon: <FiSettings size={20} />, label: "Settings" },
    ];

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <>
            <div className={`hidden md:flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'} theme transition-all duration-300 border-r theme-border`}>
                <div className={`p-4 border-b theme-border flex ${sidebarOpen ? 'flex-row items-start' : 'flex-col items-center'} gap-3`}>
                    <div className="relative">
                        {status === 'loading' ? (
                            <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
                        ) : userProfile.image ? (
                            <img
                                src={userProfile.image}
                                alt=""
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                                <FiUser className="text-white" size={20} />
                            </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 theme-border"></span>
                    </div>
                    {sidebarOpen && (
                        <div className="flex-1">
                            {status === 'loading' ? (
                                <>
                                    <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse mb-2"></div>
                                    <div className="h-3 w-1/2 bg-gray-700 rounded animate-pulse mb-2"></div>
                                    <div className="h-3 w-1/3 bg-gray-700 rounded animate-pulse"></div>
                                </>
                            ) : (
                                <>
                                    <h3 className="font-medium text-white truncate">{userProfile.name}</h3>
                                    <p className="text-xs text-gray-400 truncate">{userProfile.email}</p>
                                    <button className="mt-1 text-xs text-indigo-400 hover:text-indigo-300">
                                        View Profile
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto p-2">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 p-3 rounded-md hover:bg-[#0e0e0e] text-white ${sidebarOpen ? '' : 'justify-center'}`}
                                >
                                    {item.icon}
                                    {sidebarOpen && <span>{item.label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t theme-border space-y-2">
                    <button
                        className={`flex items-center gap-3 w-full p-2 rounded-md hover:bg-[#0e0e0e] text-white ${sidebarOpen ? '' : 'justify-center'}`}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <FiChevronLeft size={20} className={sidebarOpen ? '' : 'rotate-180'} />
                        {sidebarOpen && <span>Collapse</span>}
                    </button>
                    <button
                        onClick={handleSignOut}
                        className={`flex cursor-pointer items-center gap-3 w-full p-2 rounded-md hover:bg-[#0e0e0e] text-red-400 ${sidebarOpen ? '' : 'justify-center'}`}
                    >
                        <FiLogOut size={20} />
                        {sidebarOpen && <span>Sign Out</span>}
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

                        <div className="p-4 border-b theme-border flex flex-row items-start gap-3">
                            <div className="relative">
                                {status === 'loading' ? (
                                    <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
                                ) : userProfile.image ? (
                                    <img
                                        src={userProfile.image}
                                        alt="User avatar"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                                        <FiUser className="text-white" size={20} />
                                    </div>
                                )}
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 theme-border"></span>
                            </div>
                            <div className="flex-1">
                                {status === 'loading' ? (
                                    <>
                                        <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse mb-2"></div>
                                        <div className="h-3 w-1/2 bg-gray-700 rounded animate-pulse mb-2"></div>
                                        <div className="h-3 w-1/3 bg-gray-700 rounded animate-pulse"></div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="font-medium text-white truncate">{userProfile.name}</h3>
                                        <p className="text-xs text-gray-400 truncate">{userProfile.email}</p>
                                        <p className="text-xs text-gray-400">{userProfile.role}</p>
                                        <button className="mt-1 text-xs text-indigo-400 hover:text-indigo-300">
                                            View Profile
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <nav className="flex-1 overflow-y-auto p-2">
                            <ul className="space-y-1">
                                {navItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="flex items-center gap-3 p-3 rounded-md hover:bg-[#0e0e0e] text-white"
                                            onClick={() => setMobileSidebarOpen(false)}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="p-4 border-t theme-border">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-[#0e0e0e] text-red-400"
                            >
                                <FiLogOut size={20} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SideBar