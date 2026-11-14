"use client"

import type { ReactNode } from "react"
import { useUserStore } from "@workspace/stores"

export function usePermission(permission: string | string[]): boolean {
  const user = useUserStore((s) => s.user)
  if (!user) return false
  if (user.roles.includes("SuperAdmin")) return true
  const perms = Array.isArray(permission) ? permission : [permission]
  return perms.some((p) => user.permissions.includes(p))
}

export function useRole(role: string | string[]): boolean {
  const user = useUserStore((s) => s.user)
  if (!user) return false
  if (user.roles.includes("SuperAdmin")) return true
  const roles = Array.isArray(role) ? role : [role]
  return roles.some((r) => user.roles.includes(r))
}

export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: string | string[]
  children: ReactNode
  fallback?: ReactNode
}) {
  return usePermission(permission) ? <>{children}</> : <>{fallback}</>
}
