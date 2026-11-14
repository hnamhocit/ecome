"use client"

import { useEffect, type ReactNode } from "react"
import { configureApi, refreshSession } from "@workspace/api"
import { readSessionCache, useUserStore } from "@workspace/stores"

export function AuthProvider({
  baseURL,
  children,
}: {
  baseURL: string
  children: ReactNode
}) {
  const accessToken = useUserStore((s) => s.accessToken)
  const fetchMe = useUserStore((s) => s.fetchMe)

  configureApi({
    baseURL,
    getAccessToken: () => useUserStore.getState().accessToken,
    readCachedToken: () => {
      const cached = readSessionCache()
      if (cached && cached.expiresAt - Date.now() > 30_000) {
        useUserStore.getState().hydrateFromCache(cached)
        return cached.accessToken
      }
      return null
    },
    onTokenRefreshed: (token, expiresAt) =>
      useUserStore.getState().setAuth(token, expiresAt),
    onAuthFailed: () => useUserStore.getState().setAuth(null),
  })

  useEffect(() => {
    refreshSession()
  }, [])

  useEffect(() => {
    if (accessToken) fetchMe()
  }, [accessToken, fetchMe])

  return children
}
