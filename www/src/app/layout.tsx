import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Copy Pasta - Clipboard manager",
  description:
    "Copy Pasta is a fast clipboard manager for macOS, Windows, and Linux that saves everything you copy.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
