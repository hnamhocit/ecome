import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"

export interface ApiAuthHooks {
  baseURL: string
  getAccessToken: () => string | null
  readCachedToken?: () => string | null
  onTokenRefreshed: (accessToken: string, expiresAt: string) => void
  onAuthFailed: () => void
}

let hooks: ApiAuthHooks | null = null
let refreshPromise: Promise<string | null> | null = null

export const api = axios.create({ withCredentials: true })

export function configureApi(config: ApiAuthHooks) {
  hooks = config
  api.defaults.baseURL = config.baseURL
}

export async function refreshSession(force = false): Promise<string | null> {
  if (!hooks) return null

  if (!force && hooks.readCachedToken) {
    const cached = hooks.readCachedToken()
    if (cached) return cached
  }

  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const { data } = await api.post<{ accessToken: string; expiresAt: string }>(
        "/auth/refresh"
      )
      hooks?.onTokenRefreshed(data.accessToken, data.expiresAt)
      return data.accessToken
    } catch {
      hooks?.onAuthFailed()
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

api.interceptors.request.use((config) => {
  const token = hooks?.getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/refresh") &&
      !original.url?.includes("/auth/login")
    ) {
      original._retry = true
      const newToken = await refreshSession(true)
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      }
    }
    return Promise.reject(error)
  }
)
