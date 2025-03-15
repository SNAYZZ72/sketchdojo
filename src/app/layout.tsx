import type { Metadata } from 'next'
import { Poppins, Italianno } from 'next/font/google'
import { ThemeProvider } from '@/providers/theme-provider'
import './styles/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
})

const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-italianno',
})

export const metadata: Metadata = {
  title: "SketchDojo.ai",
  description: "Create your own Manga with AI",
  icons: {
    icon: 'logo.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${italianno.variable}`} suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}