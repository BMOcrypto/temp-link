import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { DemoBanner } from "@/components/demo-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TempLink - Temporary Links That Expire",
  description:
    "Create time-limited URLs that automatically expire. Perfect for sharing sensitive content, temporary access, or time-sensitive information.",
  keywords: ["url shortener", "temporary links", "expiring links", "link management", "secure sharing"],
  authors: [{ name: "TempLink Team" }],
  openGraph: {
    title: "TempLink - Temporary Links That Expire",
    description:
      "Create time-limited URLs that automatically expire. Perfect for sharing sensitive content, temporary access, or time-sensitive information.",
    url: "https://templink.io",
    siteName: "TempLink",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TempLink - Temporary Links That Expire",
    description:
      "Create time-limited URLs that automatically expire. Perfect for sharing sensitive content, temporary access, or time-sensitive information.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DemoBanner />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
