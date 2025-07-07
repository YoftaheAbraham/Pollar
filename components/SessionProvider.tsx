"use client"
import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const SessionProviderComp = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  if (pathname.startsWith('/dashboard')) {
    return children
  }
  
  return (
    <SessionProvider>
      <Navbar />
      {children}
      <Footer />
    </SessionProvider>
  )
}

export default SessionProviderComp