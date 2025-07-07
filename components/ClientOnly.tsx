'use client'
import React from 'react'

const ClientOnly = ({children}: {children: React.ReactNode}) => {
  return (
    {children}
  )
}

export {ClientOnly}