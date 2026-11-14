"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconUser,
  IconReceipt2,
  IconTicket,
  IconDevices,
} from "@tabler/icons-react"
import { AuthGuard } from "@workspace/auth"
import { useUserStore } from "@workspace/stores"

const NAV_ITEMS = [
  { href: "/me", label: "My Profile", icon: IconUser },
  { href: "/me", label: "My Orders", icon: IconReceipt2 },
  { href: "/me", label: "Vouchers", icon: IconTicket },
  { href: "/me", label: "Active Devices", icon: IconDevices },
]

export default function MeLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user } = useUserStore()

  return (
    <AuthGuard redirectTo="/auth/login">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
          {/* Navigation Sidebar */}
          <aside className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/70">
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="size-10 shrink-0 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-500">
                  {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  {user?.name || "Loading..."}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>
            </div>

            <nav className="flex flex-row gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 md:flex-col dark:border-slate-800 dark:bg-slate-900/70">
              {NAV_ITEMS.map((item, index) => {
                const Icon = item.icon
                const isActive = index === 0 && pathname === "/me"
                return (
                  <Link
                    key={`${item.label}-${index}`}
                    href={item.href}
                    className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Child Page Content */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
