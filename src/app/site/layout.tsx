import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import React from 'react'
import { ThemeProvider } from '@/providers/theme-provider'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <main className="h-full">
          {children}
        </main>
      </ThemeProvider>
    </ClerkProvider>
  )
}

export default layout
