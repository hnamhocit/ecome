"use client"

import { ReactNode, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconUser,
  IconReceipt2,
  IconTicket,
  IconDevices,
  IconShieldCheck,
  IconLogout,
  IconChevronRight,
  IconHome,
  IconSparkles,
} from "@tabler/icons-react"
import { AuthGuard } from "@workspace/auth"
import { useUserStore } from "@workspace/stores"
import Header from "@/components/header"
import { Footer } from "@/components/footer"

interface NavItem {
  href: string
  label: string
  icon: typeof IconUser
  badge?: string
}

const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: "Profile & Account",
    items: [
      { href: "/me", label: "My Profile", icon: IconUser },
    ],
  },
  {
    group: "Security & Devices",
    items: [
      { href: "/me/sessions", label: "Active Sessions", icon: IconDevices, badge: "Active" },
    ],
  },
  {
    group: "Orders & Rewards",
    items: [
      { href: "/me/orders", label: "My Orders", icon: IconReceipt2 },
      { href: "/me/vouchers", label: "Vouchers & Coupons", icon: IconTicket },
    ],
  },
]

export default function MeLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user } = useUserStore()

  const currentPageTitle = useMemo(() => {
    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        if (pathname === item.href) return item.label
      }
    }
    return "Account"
  }, [pathname])

  return (
    <AuthGuard redirectTo="/auth/login">
      <div className="flex min-h-screen flex-col bg-slate-50/70 text-foreground transition-colors duration-200 dark:bg-[#070b14]">
        {/* Main Storefront Header */}
        <Header />

        {/* Content Container */}
        <main className="flex-1 w-full">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 sm:py-8">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-1 transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                <IconHome className="size-3.5" />
                <span>Home</span>
              </Link>
              <IconChevronRight className="size-3 text-slate-400" />
              <Link
                href="/me"
                className="transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                Account Settings
              </Link>
              <IconChevronRight className="size-3 text-slate-400" />
              <span className="font-semibold text-slate-900 dark:text-white">
                {currentPageTitle}
              </span>
            </nav>

            {/* Account Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
              {/* Navigation Sidebar */}
              <aside className="space-y-4">
                {/* User Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
                  <div className="flex items-center gap-3.5">
                    {user?.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="size-12 shrink-0 rounded-full object-cover ring-2 ring-emerald-500/30"
                      />
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 font-heading text-base font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                          {user?.name || "Loading..."}
                        </p>
                        <span title="Verified Account">
                          <IconShieldCheck className="size-4 shrink-0 text-emerald-500" />
                        </span>
                      </div>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user?.email}
                      </p>
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {user?.roles?.[0] || "Customer Account"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Structured Navigation Groups */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
                  <div className="space-y-4">
                    {NAV_GROUPS.map((group, groupIndex) => (
                      <div key={group.group} className={groupIndex > 0 ? "border-t border-slate-100 pt-3 dark:border-slate-800/80" : ""}>
                        <p className="px-3 pb-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                          {group.group}
                        </p>
                        <nav className="space-y-1">
                          {group.items.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                                  isActive
                                    ? "bg-emerald-500/10 text-emerald-700 shadow-xs dark:bg-emerald-500/15 dark:text-emerald-300"
                                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <Icon
                                    className={`size-4 transition-colors ${
                                      isActive
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-slate-400 dark:text-slate-500"
                                    }`}
                                  />
                                  <span>{item.label}</span>
                                </div>
                                {item.badge && (
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                      isActive
                                        ? "bg-emerald-600 text-white"
                                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            )
                          })}
                        </nav>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Helpful ECOME Support Pill */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-xs text-slate-500 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                    <IconSparkles className="size-4 text-emerald-500" />
                    <span>ECOME Security</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Your account is safeguarded with multi-session token hashing and device verification.
                  </p>
                </div>
              </aside>

              {/* Child Page Content */}
              <section className="min-w-0">{children}</section>
            </div>
          </div>
        </main>

        {/* Storefront Footer */}
        <Footer />
      </div>
    </AuthGuard>
  )
}
