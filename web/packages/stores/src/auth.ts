import { create } from "zustand"
import { api, type MeResponse } from "@workspace/api"

const AUTH_CACHE_KEY = "ecome_auth_session"

function isDevelopment(): boolean {
  try {
    const globalProcess = (globalThis as Record<string, any>).process
    if (globalProcess?.env?.NODE_ENV === "development") return true
    if (typeof import.meta !== "undefined" && Boolean((import.meta as Record<string, any>).env?.DEV)) return true
  } catch {
    // ignore
  }
  return false
}

export interface CachedSession {
  accessToken: string
  expiresAt: number
  user: MeResponse | null
}

export function readSessionCache(): CachedSession | null {
  if (!isDevelopment() || typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(AUTH_CACHE_KEY)
    return raw ? (JSON.parse(raw) as CachedSession) : null
  } catch {
    return null
  }
}

export function writeSessionCache(data: CachedSession | null) {
  if (!isDevelopment() || typeof window === "undefined") return
  try {
    if (data) sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(data))
    else sessionStorage.removeItem(AUTH_CACHE_KEY)
  } catch {}
}

export interface UserState {
  accessToken: string | null
  expiresAt: number | null
  user: MeResponse | null
  isLoading: boolean
  setAuth: (token: string | null, expiresAt?: string | number | null) => void
  setAccessToken: (token: string | null) => void
  logout: () => void
  hydrateFromCache: (cache: CachedSession) => void
  setUser: (user: MeResponse | null) => void
  fetchMe: () => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  accessToken: null,
  expiresAt: null,
  user: null,
  isLoading: true,

  setAuth: (accessToken, expiresAt = null) => {
    if (!accessToken) {
      writeSessionCache(null)
      set({ accessToken: null, expiresAt: null, user: null, isLoading: false })
      return
    }

    const expiryMs =
      typeof expiresAt === "number"
        ? expiresAt
        : expiresAt
          ? new Date(expiresAt).getTime()
          : Date.now() + 14 * 60_000

    writeSessionCache({ accessToken, expiresAt: expiryMs, user: get().user })
    set({ accessToken, expiresAt: expiryMs, isLoading: false })
  },

  setAccessToken: (token: string | null) => {
    get().setAuth(token)
  },

  logout: () => {
    get().setAuth(null)
  },

  hydrateFromCache: (cache) => {
    set({
      accessToken: cache.accessToken,
      expiresAt: cache.expiresAt,
      user: cache.user,
      isLoading: false,
    })
  },

  setUser: (user) => {
    const { accessToken, expiresAt } = get()
    if (accessToken && expiresAt) {
      writeSessionCache({ accessToken, expiresAt, user })
    }
    set({ user })
  },

  fetchMe: async () => {
    const { accessToken, user, setUser } = get()
    if (!accessToken || user) return
    try {
      const { data } = await api.get<MeResponse>("/me")
      setUser(data)
    } catch {}
  },
}))

export const useAuthStore = useUserStore
