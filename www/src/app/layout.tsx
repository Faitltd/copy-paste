import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pasta - Clipboard manager for Mac",
  description:
    "Pasta is a clipboard manager for Mac that saves everything you copy. It's like Time Machine for your clipboard.",
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
