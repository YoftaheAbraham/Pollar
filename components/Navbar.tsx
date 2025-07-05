'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed w-full backdrop-blur-md bg-black/50 border-b border-white/10 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left side */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <h1 className="text-2xl font-bold tracking-tighter text-white group-hover:text-gray-300 transition-colors duration-200">
                POLLAR
              </h1>
              <span className="ml-2 text-xs bg-white/10 text-white/80 px-2 py-1 rounded-full">
                LIVE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-10 space-x-6">
              {/* <Link 
                href="/discover" 
                className="text-sm font-medium text-white/80 hover:text-white transition-colors px-3 py-2"
              >
                Discover
              </Link> */}
              <Link 
                href="/features" 
                className="text-sm font-medium text-white/80 hover:text-white transition-colors px-3 py-2"
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="text-sm font-medium text-white/80 hover:text-white transition-colors px-3 py-2"
              >
                Pricing
              </Link>
              <Link 
                href="/about" 
                className="text-sm font-medium text-white/80 hover:text-white transition-colors px-3 py-2"
              >
                About
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white/80 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
        
            <Link 
              href="/join" 
              className="px-4 py-2 text-sm bg-white text-black rounded-md hover:bg-white/90 font-medium transition-colors duration-200"
            >
             Join
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/discover" 
              className="block px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Discover
            </Link>
            <Link 
              href="/features" 
              className="block px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="block px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 border-t border-white/10 mt-2">
              <Link 
                href="/login" 
                className="block w-full px-4 py-2 text-center text-sm font-medium text-white/80 hover:text-white mb-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="block w-full px-4 py-2 text-center text-sm bg-white text-black rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar