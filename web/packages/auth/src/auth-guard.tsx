"use client"

import { useEffect, type ReactNode } from "react"
import { useUserStore } from "@workspace/stores"

export interface AuthGuardProps {
  children: ReactNode
  redirectTo?: string
  requiredRoles?: string[]
  requiredPermission?: string
  fallback?: ReactNode
  loadingFallback?: ReactNode
  onUnauthorized?: () => void
}

export function AuthGuard({
  children,
  redirectTo = "/auth/login",
  requiredRoles,
  requiredPermission,
  fallback = null,
  loadingFallback,
  onUnauthorized,
}: AuthGuardProps) {
  const { accessToken, isLoading, user } = useUserStore()

  const hasRequiredRole =
    !requiredRoles ||
    requiredRoles.length === 0 ||
    (user && (user.roles.includes("SuperAdmin") || requiredRoles.some((r) => user.roles.includes(r))))

  const hasRequiredPermission =
    !requiredPermission ||
    (user && (user.roles.includes("SuperAdmin") || user.permissions.includes(requiredPermission)))

  const isAuthorized = Boolean(accessToken && hasRequiredRole && hasRequiredPermission)

  useEffect(() => {
    if (isLoading) return

    if (!accessToken || !hasRequiredRole || !hasRequiredPermission) {
      if (onUnauthorized) {
        onUnauthorized()
      } else if (typeof window !== "undefined" && redirectTo) {
        // If relative or absolute redirect
        const currentPath = window.location.pathname + window.location.search
        const separator = redirectTo.includes("?") ? "&" : "?"
        const destination =
          redirectTo.startsWith("http://") || redirectTo.startsWith("https://")
            ? `${redirectTo}${separator}returnUrl=${encodeURIComponent(currentPath)}`
            : `${redirectTo}${separator}returnUrl=${encodeURIComponent(currentPath)}`

        window.location.assign(destination)
      }
    }
  }, [accessToken, isLoading, hasRequiredRole, hasRequiredPermission, onUnauthorized, redirectTo])

  if (isLoading) {
    if (loadingFallback) return <>{loadingFallback}</>
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-400">
        <div className="size-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Verifying security session...
        </p>
      </div>
    )
  }

  if (!isAuthorized) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
