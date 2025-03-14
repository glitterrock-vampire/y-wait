import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
// import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Y-Wait | Revolutionizing Wait Times",
  description: "AI-powered queue management system for reducing wait times across industries",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem> */}
          <AuthProvider>{children}</AuthProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}

