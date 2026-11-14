import { useEffect, type ReactNode } from "react"
import { useUserStore } from "@workspace/stores"
import {
  IconShieldExclamation,
  IconArrowRight,
  IconBuildingStore,
  IconLogout,
} from "@tabler/icons-react"

const WEB_URL = (import.meta as any).env?.VITE_WEB_URL ?? "http://localhost:3000"

interface ConsoleGuardProps {
  children: ReactNode
}

export function ConsoleGuard({ children }: ConsoleGuardProps) {
  const { accessToken, isLoading, user, setAuth } = useUserStore()

  const isStaffOrAdmin =
    user?.roles?.some((role: string) =>
      ["SuperAdmin", "Admin", "Staff", "Seller"].includes(role)
    ) ?? false

  useEffect(() => {
    if (isLoading) return

    if (!accessToken) {
      const returnUrl = encodeURIComponent(window.location.href)
      window.location.assign(`${WEB_URL}/auth/login?returnUrl=${returnUrl}`)
    }
  }, [accessToken, isLoading])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <div className="relative flex size-14 items-center justify-center">
          <div className="absolute size-full animate-ping rounded-full bg-emerald-500/20" />
          <div className="size-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
        <h2 className="mt-6 font-heading text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Authenticating Console Session
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Verifying security privileges and store access...
        </p>
      </div>
    )
  }

  if (!accessToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center text-slate-900 dark:bg-slate-950 dark:text-white">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30">
          <IconShieldExclamation className="size-7" />
        </div>
        <h2 className="mt-4 font-heading text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Authentication Required
        </h2>
        <p className="mt-1.5 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          You must be signed in with authorized credentials to access the ECOME Console.
        </p>
        <button
          onClick={() => {
            const returnUrl = encodeURIComponent(window.location.href)
            window.location.assign(`${WEB_URL}/auth/login?returnUrl=${returnUrl}`)
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 active:scale-95"
        >
          <span>Go to Sign In</span>
          <IconArrowRight className="size-4" />
        </button>
      </div>
    )
  }

  // If user is authenticated, check role authorization (Customer trying to access Seller Console)
  if (user && !isStaffOrAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center text-slate-900 dark:bg-slate-950 dark:text-white">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/30">
          <IconBuildingStore className="size-7" />
        </div>
        <h2 className="mt-4 font-heading text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Become an ECOME Seller
        </h2>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Your account (<strong className="text-slate-900 dark:text-white">{user.email}</strong>) is currently a shopping customer account.
          To access the Seller & Operations Console, apply for Seller credentials or sign in with an Administrator account.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={WEB_URL}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span>Return to Store</span>
          </a>

          <button
            onClick={() => {
              setAuth(null)
              const returnUrl = encodeURIComponent(window.location.href)
              window.location.assign(`${WEB_URL}/auth/login?returnUrl=${returnUrl}`)
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-500"
          >
            <IconLogout className="size-4" />
            <span>Switch Account</span>
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
