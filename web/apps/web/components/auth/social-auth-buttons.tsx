"use client"

import { useState } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { SOCIAL_APPS } from "@/constants"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

const AUTH_PROVIDERS = SOCIAL_APPS.filter((app) =>
  ["google", "github", "facebook"].includes(app.id)
)

export function SocialAuthButtons({ returnUrl }: { returnUrl?: string }) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleOAuthLogin = (providerId: string) => {
    setLoadingProvider(providerId)

    const url = new URL(`${API_URL}/auth/${providerId}`)
    if (returnUrl && returnUrl.startsWith("/") && !returnUrl.startsWith("//") && returnUrl !== "/") {
      url.searchParams.set("returnUrl", returnUrl)
    }

    window.location.assign(url.toString())
  }

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {AUTH_PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          type="button"
          disabled={loadingProvider !== null}
          onClick={() => handleOAuthLogin(provider.id)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-300/90 bg-transparent px-3 text-xs font-semibold text-stone-800 transition-all hover:border-stone-400 hover:bg-stone-200/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:text-sm dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {loadingProvider === provider.id ? (
            <IconLoader2 className="size-4 animate-spin text-stone-500" />
          ) : (
            <img
              src={provider.photoUrl}
              alt={provider.title}
              className="size-4.5 object-contain"
            />
          )}
          <span>{provider.title}</span>
        </button>
      ))}
    </div>
  )
}
