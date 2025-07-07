'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { FiLogOut, FiSettings, FiUser, FiMenu, FiX } from 'react-icons/fi'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession()
  const profileRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    console.log(session, status);
    
  }, [session])

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
  ]

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen)
  const closeAllMenus = () => {
    setMobileMenuOpen(false)
    setProfileMenuOpen(false)
  }

  const handleSignOut = async () => {
    closeAllMenus()
    await signOut({ callbackUrl: '/' })
  }

  // Don't render anything until we know the auth state
  if (!mounted) {
    return (
      <nav className="fixed w-full backdrop-blur-2xl theme border-b border-white/10 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16" />
      </nav>
    )
  }

  return (
    <nav className="fixed w-full backdrop-blur-2xl border-b border-white/10 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group" onClick={closeAllMenus}>
              <h1 className="text-2xl font-bold tracking-tighter text-green-500 group-hover:text-green-400 transition-colors duration-300">
                POLLAR
              </h1>
              <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full animate-pulse">
                LIVE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-10 space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-sm font-medium text-white/80  px-3 py-2 rounded-lg transition-all duration-200 hover:text-green-400"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Auth/Profile */}
          <div className="flex items-center space-x-4">
            {status === 'authenticated' ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 focus:outline-none group"
                  aria-label="User menu"
                >
                  <span className="hidden md:inline text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                    {session?.user?.name}
                  </span>
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 transition-all duration-300">
                    {session?.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {session?.user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg theme border border-white/10 backdrop-blur-lg py-2 z-50 overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-medium text-white">{session?.user?.name}</p>
                      <p className="text-xs text-white/60 truncate">{session?.user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={closeAllMenus}
                    >
                      <FiUser className="mr-3" />
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={closeAllMenus}
                    >
                      <FiSettings className="mr-3" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors border-t border-white/10"
                    >
                      <FiLogOut className="mr-3" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : status === 'unauthenticated' ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/join"
                  className="hidden md:block px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
                  onClick={closeAllMenus}
                >
                  Log in
                </Link>
                <Link
                  href="/join"
                  className="px-4 py-2 text-sm bg-gradient-to-r text-black bg-white rounded-sm font-medium transition-all duration-300"
                  onClick={closeAllMenus}
                >
                  Get Started
                </Link>
              </div>
            ) : null}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white/80 hover:text-white focus:outline-none ml-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden theme border-t border-white/10 backdrop-blur-lg animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={closeAllMenus}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-2 border-t border-white/10 mt-2">
              {status === 'authenticated' ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                    onClick={closeAllMenus}
                  >
                    <FiUser className="mr-3" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-3 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                    onClick={closeAllMenus}
                  >
                    <FiSettings className="mr-3" />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-3 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                  >
                    <FiLogOut className="mr-3" />
                    Sign out
                  </button>
                </>
              ) : status === 'unauthenticated' ? (
                <>
                  <Link
                    href="/join"
                    className="block px-3 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                    onClick={closeAllMenus}
                  >
                    Login
                  </Link>
                  <Link
                    href="/join"
                    className="block w-full px-4 py-3 mt-2 text-center text-sm text-black bg-white rounded-sm"
                    onClick={closeAllMenus}
                  >
                    Get Started
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar