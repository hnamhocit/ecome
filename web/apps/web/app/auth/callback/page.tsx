"use client"

import { Suspense, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"
import { api } from "@workspace/api"
import { useUserStore } from "@workspace/stores"

function getSafeReturnUrl(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/"
  return raw
}

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setAuth = useUserStore((state) => state.setAuth)
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (hasProcessed.current) return
    hasProcessed.current = true

    const error = searchParams.get("error")
    const returnUrl = getSafeReturnUrl(searchParams.get("returnUrl"))

    if (error) {
      router.replace(`/auth/login?error=${encodeURIComponent(error)}`)
      return
    }

    const completeLogin = async () => {
      try {
        const { data } = await api.post("/auth/refresh")
        setAuth(data.accessToken, data.expiresAt)
        toast.success("Successfully signed in!")
        router.replace(returnUrl)
        router.refresh()
      } catch {
        router.replace("/auth/login?error=session_failed")
      }
    }

    completeLogin()
  }, [router, searchParams, setAuth])

  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-16 text-center">
      <IconLoader2 className="size-8 animate-spin text-emerald-600" />
      <h2 className="font-heading text-lg font-bold text-stone-900 dark:text-white">
        Completing sign-in...
      </h2>
      <p className="text-xs text-stone-500 dark:text-slate-400">
        Please wait a moment while we establish your secure session
      </p>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <IconLoader2 className="size-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  )
}
