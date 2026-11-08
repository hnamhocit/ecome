import type { Metadata } from "next"
import { Geist, Plus_Jakarta_Sans } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from "@/context/store-context"
import { CartDrawer } from "@/components/cart-drawer"
import { DeliveryModal } from "@/components/delivery-modal"
import { AuthModal } from "@/components/auth-modal"
import { ToastContainer } from "@/components/toast-container"
import { cn } from "@workspace/ui/lib/utils"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  display: "swap",
})

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "ECOME — Everything you need, delivered fast",
  description:
    "Trải nghiệm mua sắm thương mại điện tử hiện đại, giao diện trực quan, tối ưu chuyển đổi với chuẩn Design Tokens ECOME.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn(
        "overflow-x-clip antialiased",
        jakarta.variable,
        geist.variable,
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
        <ThemeProvider>
          <StoreProvider>
            {children}
            <CartDrawer />
            <DeliveryModal />
            <AuthModal />
            <ToastContainer />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
