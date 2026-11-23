import type { Metadata } from "next"
import { Montserrat, Plus_Jakarta_Sans } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
import { Toaster } from "sonner"
import { AuthProvider } from "@workspace/auth"
import { Suspense } from "react"
import { NavigationProgress } from "@/components/navigation-progress"

const body = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["500", "600", "700", "800"],
  display: "swap",
})

const heading = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "ECOME — Everything you need, delivered fast",
  description:
    "Modern, high-performance tech e-commerce platform built with the ECOME Design System.",
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "overflow-x-clip antialiased",
        heading.variable,
        body.variable,
        GeistMono.variable
      )}
    >
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.50.0/dist/tabler-icons.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.50.0/dist/tabler-icons-filled.min.css"
        />
      </head>
      <body className="min-h-screen w-full overflow-x-clip bg-background font-sans text-base text-foreground transition-colors duration-200">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <ThemeProvider>
          <AuthProvider baseURL={API_BASE_URL}>
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
