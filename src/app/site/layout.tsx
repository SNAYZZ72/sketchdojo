import React from 'react'
import { ThemeProvider } from '@/providers/theme-provider'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <main className="h-full">
        {children}
      </main>
    </ThemeProvider>
  )
}

export default layout
